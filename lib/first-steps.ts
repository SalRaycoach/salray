import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { NTFY_URL } from '@/lib/application-failsafe'
import { parseTraining, type Training } from '@/lib/trainings'

/**
 * Lista de e-mail do PDF 1 (treinamento interativo de 30 dias): cadastro,
 * descadastro, log de downloads e rede de segurança de entrega.
 *
 * Tudo em arquivos JSON Lines dentro de data/ (fora do controle de versão,
 * ver /data/ no .gitignore), mesmo padrão de lib/reflections-signup-log.ts.
 * FIRST_STEPS_DATA_DIR permite apontar para uma pasta FORA do diretório do
 * deploy, caso o deploy da Hostinger apague data/ (ver relatório do PDF 1).
 */

export type Lang = 'en' | 'pt'

export function parseLang(value: unknown): Lang {
  return value === 'pt' ? 'pt' : 'en'
}

const DATA_DIR = process.env.FIRST_STEPS_DATA_DIR || path.join(process.cwd(), 'data')

export const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'first-steps-subscribers.jsonl')
export const UNSUBSCRIBED_FILE = path.join(DATA_DIR, 'first-steps-unsubscribed.jsonl')
export const DOWNLOADS_FILE = path.join(DATA_DIR, 'first-steps-downloads.jsonl')
export const FAILED_DELIVERIES_FILE = path.join(DATA_DIR, 'first-steps-failed-deliveries.jsonl')
export const FOLLOWUPS_SENT_FILE = path.join(DATA_DIR, 'first-steps-followups-sent.jsonl')
export const CRON_LOG_FILE = path.join(DATA_DIR, 'cron.log')

/** `training` ausente nos cadastros antigos: vale como pdf1. */
export type Subscriber = { email: string; lang: Lang; source: string; date: string; status: 'active'; training?: Training }
/** Lista de bloqueio: guarda SOMENTE o e-mail (ver markUnsubscribed). */
export type Unsubscribed = { email: string }

export async function readJsonl<T>(file: string): Promise<T[]> {
  let raw: string
  try {
    raw = await fs.readFile(file, 'utf-8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
  const rows: T[] = []
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue
    try {
      rows.push(JSON.parse(line) as T)
    } catch {
      // Linha corrompida: ignora em vez de derrubar a lista inteira.
    }
  }
  return rows
}

export async function appendJsonl(file: string, entry: Record<string, unknown>): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.appendFile(file, JSON.stringify(entry) + '\n', 'utf-8')
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

const EMAIL_RE = /^[^\s@<>"',;:()[\]\\]+@[^\s@<>"',;:()[\]\\]+\.[^\s@<>"',;:()[\]\\]{2,}$/

export function isValidEmail(email: string): boolean {
  return email.length <= 200 && EMAIL_RE.test(email)
}

/** source vira um rótulo curto (first-steps, article, home...); qualquer outra coisa cai no padrão. */
export function parseSource(value: unknown): string {
  return typeof value === 'string' && /^[a-z0-9_-]{1,40}$/i.test(value.trim()) ? value.trim().toLowerCase() : 'first-steps'
}

// ---------- Token (HMAC-SHA256 do e-mail, base64url) ----------

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('UNSUBSCRIBE_SECRET must be set (random string, 16+ characters).')
  }
  return secret
}

export function makeToken(email: string): string {
  return crypto.createHmac('sha256', getSecret()).update(normalizeEmail(email)).digest('base64url')
}

function tokensEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb)
}

/**
 * O token não carrega o e-mail (não vai e-mail em URL). Para validar, recalcula
 * o HMAC de cada e-mail conhecido e compara em tempo constante. Procura entre os
 * inscritos E na lista de bloqueio: ao cancelar, a linha do inscrito é apagada,
 * mas o link de cancelamento (e os de e-mails antigos) continua reconhecido.
 * Retorna o e-mail dono do token, ou null se nenhum bater.
 */
export async function findEmailByToken(token: string): Promise<string | null> {
  if (!token || token.length > 100) return null
  const [subscribers, blocked] = await Promise.all([
    readJsonl<Subscriber>(SUBSCRIBERS_FILE),
    readJsonl<Unsubscribed>(UNSUBSCRIBED_FILE),
  ])
  const seen = new Set<string>()
  for (const row of [...subscribers, ...blocked]) {
    if (!row.email || seen.has(row.email)) continue
    seen.add(row.email)
    if (tokensEqual(makeToken(row.email), token)) return row.email
  }
  return null
}

// ---------- Inscritos ----------

export async function isUnsubscribed(email: string): Promise<boolean> {
  const rows = await readJsonl<Unsubscribed>(UNSUBSCRIBED_FILE)
  return rows.some((r) => r.email === email)
}

/** Inscrito em ESTE treinamento (a mesma pessoa pode ter pedido os dois). */
export async function isSubscribed(email: string, training: Training = 'pdf1'): Promise<boolean> {
  const rows = await readJsonl<Subscriber>(SUBSCRIBERS_FILE)
  return rows.some((r) => r.email === email && parseTraining(r.training) === training)
}

// Uma escrita por vez no arquivo de inscritos (o app é um processo Node único):
// cadastrar e apagar linhas não podem se atropelar.
let subscribersLock: Promise<void> = Promise.resolve()
function withSubscribersLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = subscribersLock.then(fn, fn)
  subscribersLock = run.then(
    () => undefined,
    () => undefined
  )
  return run
}

export async function addSubscriber(email: string, lang: Lang, source: string, training: Training = 'pdf1'): Promise<void> {
  const row: Subscriber = { email, lang, source, date: new Date().toISOString(), status: 'active', training }
  await withSubscribersLock(() => appendJsonl(SUBSCRIBERS_FILE, row))
}

/** Apaga todas as linhas de um e-mail de um arquivo JSON Lines (grava em arquivo temporário e renomeia). */
async function removeEmailFromJsonl(file: string, email: string): Promise<void> {
  let raw: string
  try {
    raw = await fs.readFile(file, 'utf-8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return
    throw err
  }
  const lines = raw.split('\n')
  const kept = lines.filter((line) => {
    if (!line.trim()) return false
    try {
      return String((JSON.parse(line) as { email?: string }).email || '').toLowerCase() !== email
    } catch {
      return true // linha corrompida: não mexe
    }
  })
  if (kept.length === lines.filter((l) => l.trim()).length) return // nada a apagar
  const tmp = `${file}.tmp`
  await fs.writeFile(tmp, kept.length ? kept.join('\n') + '\n' : '', 'utf-8')
  await fs.rename(tmp, file)
}

/**
 * Cancelamento: grava SOMENTE o e-mail na lista de bloqueio (para nunca mais enviar
 * nada) e apaga a pessoa dos demais arquivos da lista (inscrito completo, registro de
 * e-mails de apoio enviados e falhas de entrega). Primeiro bloqueia, depois apaga:
 * se algo cair no meio, a pessoa continua bloqueada. Idempotente.
 */
export async function markUnsubscribed(email: string): Promise<void> {
  const e = normalizeEmail(email)
  if (!(await isUnsubscribed(e))) await appendJsonl(UNSUBSCRIBED_FILE, { email: e })
  await withSubscribersLock(() => removeEmailFromJsonl(SUBSCRIBERS_FILE, e))
  await removeEmailFromJsonl(FOLLOWUPS_SENT_FILE, e)
  await removeEmailFromJsonl(FAILED_DELIVERIES_FILE, e)
}

// ---------- Log de download (sem e-mail: só os 10 primeiros caracteres do token) ----------

export async function logDownload(entry: { lang: Lang; tokenId: string; valid: boolean; training?: Training; ga4?: string }): Promise<void> {
  try {
    await appendJsonl(DOWNLOADS_FILE, { date: new Date().toISOString(), ...entry })
  } catch (err) {
    console.error('Failed to log first-steps download:', err)
  }
}

// ---------- Rede de segurança do envio ----------

/**
 * O cadastro já está salvo em first-steps-subscribers.jsonl antes do envio.
 * Quando o e-mail falha, este arquivo lista quem ainda NÃO recebeu o treinamento
 * (para reenvio manual) e o ntfy avisa na hora, sem dados pessoais no aviso.
 */
export async function recordFailedDelivery(email: string, lang: Lang, reason: string): Promise<void> {
  try {
    await appendJsonl(FAILED_DELIVERIES_FILE, { date: new Date().toISOString(), email, lang, reason })
  } catch (err) {
    console.error('Failed to persist first-steps failed delivery:', err)
  }
}

export async function sendAlert(title: string, body: string): Promise<void> {
  try {
    // Serviço público: nunca e-mails no alerta (mensagens de erro do SMTP às vezes trazem o endereço).
    const safeBody = body.replace(/[^\s<>"',;]+@[^\s<>"',;]+/g, '[email]')
    await fetch(NTFY_URL, { method: 'POST', headers: { Title: title, Priority: 'urgent', Tags: 'warning,email' }, body: safeBody })
  } catch (err) {
    console.error('Failed to send ntfy.sh alert:', err)
  }
}

export async function sendDeliveryFailureAlert(reason: string): Promise<void> {
  await sendAlert(
    'SAL Ray site: PDF 1 email failed',
    `A first-steps training delivery email failed (${reason}). The signup was NOT lost: it is in the subscribers file and listed in data/first-steps-failed-deliveries.jsonl for manual resend.`
  )
}
