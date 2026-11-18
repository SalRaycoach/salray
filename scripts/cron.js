#!/usr/bin/env node
/**
 * Envio diário dos e-mails de apoio do PDF 1 (dia 3, 7 e 15).
 * Roda pelo Cron Jobs da Hostinger, uma vez por dia.
 *
 *   node scripts/cron.js             envio normal
 *   node scripts/cron.js --dry-run   só mostra no log quem receberia o quê
 *   node scripts/cron.js --test      envia os 6 e-mails de teste (dia 3/7/15, EN e PT)
 *                                    para hello+teste-en@ e hello+teste-pt@, com
 *                                    "[TESTE] " no assunto. Não lê nem grava a lista real.
 *
 * Regras:
 *  - Lê os inscritos em first-steps-subscribers.jsonl (mesma pasta do cadastro:
 *    FIRST_STEPS_DATA_DIR, ou data/ na raiz do projeto).
 *  - "Dias desde o cadastro" = diferença de dias de calendário no fuso de Nova York.
 *    O e-mail do dia N sai quando a pessoa está entre N e N+2 dias (tolera até 2 dias
 *    de cron parado). Nunca no dia do cadastro. Nunca duas vezes o mesmo e-mail:
 *    cada envio vai para first-steps-followups-sent.jsonl (e-mail, dia, data).
 *  - Nunca envia a quem está em first-steps-unsubscribed.jsonl.
 *  - Idioma = idioma do cadastro. Máximo 40 envios por execução, 3 s entre envios.
 *  - Envio que falha não é marcado como enviado; segue para o próximo e, no fim,
 *    manda um alerta ntfy com a contagem de falhas (sem dados pessoais).
 *  - Nada de e-mail completo no log: só a forma mascarada (h***@dominio.com).
 *
 * Opção só para testes: --now=2026-11-21T14:00:00Z simula "agora".
 * Precisa de SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD e UNSUBSCRIBE_SECRET
 * (do ambiente, de .env.local / .env na raiz, ou de cron.env dentro da pasta de
 * dados). --dry-run não precisa de nenhuma.
 */

const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const { buildFollowup, KINDS, CONTACT_EMAIL } = require('./lib/followups-template')

const ROOT = path.join(__dirname, '..')
const MAX_PER_RUN = 40
const PAUSE_MS = Number(process.env.FOLLOWUPS_PAUSE_MS || 3000)
const DAYS = { day3: 3, day7: 7, day15: 15 }
const WINDOW_AFTER_DAYS = 2
const TZ = 'America/New_York'
// Mesmo tópico ntfy do restante do site (lib/application-failsafe.ts).
const NTFY_URL = 'https://ntfy.sh/salray-4wk-alert-8c8bdbe0c113'

const args = process.argv.slice(2)
const FLAG_TEST = args.includes('--test')
const FLAG_DRY = args.includes('--dry-run')
const nowArg = args.find((a) => a.startsWith('--now='))
const NOW = nowArg ? new Date(nowArg.slice(6)) : new Date()

// ---------- ambiente ----------

// O Cron Jobs pode não enxergar as variáveis do painel da Hostinger. Por isso lê,
// sem sobrescrever o que já existe no ambiente: .env.local e .env na raiz do
// projeto (úteis em desenvolvimento) e cron.env DENTRO da pasta de dados. A pasta
// de dados fica fora do deploy, então o cron.env sobrevive a novos deploys.
function loadEnvFiles() {
  const dataDir = process.env.FIRST_STEPS_DATA_DIR || path.join(ROOT, 'data')
  for (const file of [path.join(ROOT, '.env.local'), path.join(ROOT, '.env'), path.join(dataDir, 'cron.env')]) {
    let raw
    try {
      raw = fs.readFileSync(file, 'utf8')
    } catch {
      continue
    }
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
      if (!m || process.env[m[1]] !== undefined) continue
      process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2')
    }
  }
}
loadEnvFiles()

const DATA_DIR = process.env.FIRST_STEPS_DATA_DIR || path.join(ROOT, 'data')
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'first-steps-subscribers.jsonl')
const UNSUBSCRIBED_FILE = path.join(DATA_DIR, 'first-steps-unsubscribed.jsonl')
const SENT_FILE = path.join(DATA_DIR, 'first-steps-followups-sent.jsonl')

function missingEnv(names) {
  return names.filter((n) => !process.env[n])
}

// ---------- utilidades ----------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function log(msg) {
  console.log(`[followups] ${msg}`)
}

function mask(email) {
  const [local = '', domain = ''] = String(email).split('@')
  return `${local.slice(0, 1)}***@${domain}`
}

function readJsonl(file) {
  let raw
  try {
    raw = fs.readFileSync(file, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
  const rows = []
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue
    try {
      rows.push(JSON.parse(line))
    } catch {
      // linha corrompida: ignora
    }
  }
  return rows
}

function appendJsonl(file, entry) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.appendFileSync(file, JSON.stringify(entry) + '\n', 'utf8')
}

// Mesma regra de lib/first-steps.ts: HMAC-SHA256 do e-mail normalizado, base64url.
function makeToken(email) {
  return crypto.createHmac('sha256', process.env.UNSUBSCRIBE_SECRET).update(email.trim().toLowerCase()).digest('base64url')
}

const nyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
function nyDay(date) {
  return nyFormatter.format(date) // YYYY-MM-DD no calendário de Nova York
}
function daysBetween(fromDate, toDate) {
  const [y1, m1, d1] = nyDay(fromDate).split('-').map(Number)
  const [y2, m2, d2] = nyDay(toDate).split('-').map(Number)
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000)
}

async function sendAlert(title, body) {
  try {
    await fetch(NTFY_URL, { method: 'POST', headers: { Title: title, Priority: 'urgent', Tags: 'warning,email' }, body })
  } catch (err) {
    log(`falha ao enviar alerta ntfy: ${err.message}`)
  }
}

let transporter
function getTransporter() {
  if (transporter) return transporter
  const nodemailer = require('nodemailer')
  const port = Number(process.env.SMTP_PORT || 465)
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  })
  return transporter
}

async function deliver(to, message) {
  await getTransporter().sendMail({
    from: `SAL Ray <${CONTACT_EMAIL}>`,
    replyTo: CONTACT_EMAIL,
    to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    headers: message.headers,
  })
}

// ---------- planejamento (puro, sem envio) ----------

/**
 * Para cada inscrito único decide o que fazer. Retorna { decisions, due }.
 * decisions: uma linha por pessoa (para o --dry-run); due: quem recebe agora.
 */
function plan(now, subscribers, unsubscribedRows, sentRows) {
  const unsub = new Set(unsubscribedRows.map((r) => String(r.email).toLowerCase()))
  const sent = new Set(sentRows.map((r) => `${String(r.email).toLowerCase()}|${r.day}`))
  const seen = new Set()
  const decisions = []
  const due = []

  for (const row of subscribers) {
    const email = String(row.email || '').trim().toLowerCase()
    if (!email || seen.has(email)) continue // duplicado: vale só a primeira linha
    seen.add(email)
    const lang = row.lang === 'pt' ? 'pt' : 'en'
    const signedUp = new Date(row.date)
    const base = { email, lang }

    if (unsub.has(email)) {
      decisions.push({ ...base, result: 'skip (unsubscribed)' })
      continue
    }
    if (Number.isNaN(signedUp.getTime())) {
      decisions.push({ ...base, result: 'skip (invalid signup date)' })
      continue
    }
    const age = daysBetween(signedUp, now)
    if (age <= 0) {
      decisions.push({ ...base, age, result: 'skip (signed up today)' })
      continue
    }
    const kind = KINDS.find((k) => age >= DAYS[k] && age <= DAYS[k] + WINDOW_AFTER_DAYS)
    if (!kind) {
      decisions.push({ ...base, age, result: age < DAYS.day3 ? 'skip (too early)' : 'skip (no email due)' })
      continue
    }
    if (sent.has(`${email}|${kind}`)) {
      decisions.push({ ...base, age, kind, result: `skip (${kind} already sent)` })
      continue
    }
    decisions.push({ ...base, age, kind, result: `SEND ${kind}` })
    due.push({ ...base, age, kind })
  }
  return { decisions, due }
}

// ---------- modos ----------

async function runTest() {
  const missing = missingEnv(['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'UNSUBSCRIBE_SECRET'])
  if (missing.length) {
    log(`faltam variáveis: ${missing.join(', ')}`)
    await sendAlert('SAL Ray site: followups cron misconfigured', `cron.js --test cannot run: missing ${missing.join(', ')}.`)
    return 1
  }
  const targets = { en: 'hello+teste-en@salrayofficial.com', pt: 'hello+teste-pt@salrayofficial.com' }
  log('modo --test: 6 e-mails de teste; a lista real não é lida nem gravada.')
  let failures = 0
  let first = true
  for (const lang of ['en', 'pt']) {
    for (const kind of KINDS) {
      if (!first) await sleep(PAUSE_MS)
      first = false
      try {
        const msg = buildFollowup({ lang, kind, token: makeToken(targets[lang]), subjectPrefix: '[TESTE] ' })
        await deliver(targets[lang], msg)
        log(`teste enviado: ${kind} ${lang} -> ${mask(targets[lang])}`)
      } catch (err) {
        failures++
        log(`FALHA no teste ${kind} ${lang}: ${err.message}`)
      }
    }
  }
  if (failures) await sendAlert('SAL Ray site: followups test failed', `${failures} of 6 test follow-up emails failed to send.`)
  return failures ? 1 : 0
}

async function runNormal() {
  log(`pasta de dados: ${DATA_DIR}`)
  const subscribers = readJsonl(SUBSCRIBERS_FILE)
  const { decisions, due } = plan(NOW, subscribers, readJsonl(UNSUBSCRIBED_FILE), readJsonl(SENT_FILE))
  log(`${decisions.length} inscrito(s) único(s); ${due.length} com e-mail devido; limite de ${MAX_PER_RUN} por execução.`)

  const batch = due.slice(0, MAX_PER_RUN)
  if (due.length > batch.length) log(`${due.length - batch.length} ficam para a próxima execução (limite atingido).`)

  if (FLAG_DRY) {
    const inBatch = new Set(batch.map((b) => b.email))
    for (const d of decisions) {
      const over = d.result.startsWith('SEND') && !inBatch.has(d.email) ? ' (adiado: limite)' : ''
      log(`${mask(d.email)} lang=${d.lang}${d.age !== undefined ? ` dias=${d.age}` : ''} -> ${d.result}${over}`)
    }
    log('--dry-run: nada foi enviado nem gravado.')
    return 0
  }

  if (batch.length === 0) {
    log('nada a enviar hoje.')
    return 0
  }
  const missing = missingEnv(['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'UNSUBSCRIBE_SECRET'])
  if (missing.length) {
    log(`faltam variáveis: ${missing.join(', ')}`)
    await sendAlert('SAL Ray site: followups cron misconfigured', `cron.js has ${batch.length} email(s) due but is missing ${missing.join(', ')}. Nothing was sent.`)
    return 1
  }

  let sentCount = 0
  let failures = 0
  for (let i = 0; i < batch.length; i++) {
    const p = batch[i]
    if (i > 0) await sleep(PAUSE_MS)
    try {
      await deliver(p.email, buildFollowup({ lang: p.lang, kind: p.kind, token: makeToken(p.email) }))
      appendJsonl(SENT_FILE, { email: p.email, day: p.kind, date: new Date().toISOString() })
      sentCount++
      log(`enviado ${p.kind} (${p.lang}) -> ${mask(p.email)}`)
    } catch (err) {
      failures++
      log(`FALHA ${p.kind} (${p.lang}) -> ${mask(p.email)}: ${err.message}`)
    }
  }
  log(`fim: ${sentCount} enviado(s), ${failures} falha(s).`)
  if (failures) {
    await sendAlert('SAL Ray site: followups had failures', `${failures} follow-up email(s) failed to send in this run (${sentCount} sent). They were not marked as sent and will be retried on the next run while inside their 2-day window.`)
  }
  return failures ? 1 : 0
}

async function main() {
  log(`início: ${NOW.toISOString()} | fuso do servidor: ${Intl.DateTimeFormat().resolvedOptions().timeZone} (${new Date().toString()}) | Nova York hoje: ${nyDay(NOW)}`)
  const code = FLAG_TEST ? await runTest() : await runNormal()
  process.exit(code)
}

if (require.main === module) {
  main().catch(async (err) => {
    log(`erro inesperado: ${err.message}`)
    await sendAlert('SAL Ray site: followups cron crashed', `cron.js crashed: ${err.message}`)
    process.exit(1)
  })
}

module.exports = { plan, daysBetween, nyDay }
