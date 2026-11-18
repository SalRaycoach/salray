import fs from 'node:fs/promises'
import path from 'node:path'
import { sendEmail } from '@/lib/email'
import {
  appendJsonl,
  CRON_LOG_FILE,
  FOLLOWUPS_SENT_FILE,
  makeToken,
  readJsonl,
  sendAlert,
  SUBSCRIBERS_FILE,
  UNSUBSCRIBED_FILE,
  type Lang,
} from '@/lib/first-steps'
import { FIRST_STEPS_FROM } from '@/lib/first-steps-email'
import { contato } from '@/lib/config'
import { KINDS, plan, type FollowupKind } from '../scripts/lib/followups-core'
import { buildFollowup } from '../scripts/lib/followups-template'

/**
 * Envio dos e-mails de apoio (dia 3, 7 e 15), chamado por
 * POST /api/first-steps-cron (Cron Jobs da Hostinger, via curl). As regras de quem
 * recebe o quê vêm de scripts/lib/followups-core.js, o mesmo módulo usado por
 * scripts/cron.js. A resposta e o log trazem só contagens, nunca e-mails.
 */

export const MAX_PER_CALL = 10
const PAUSE_MS = 3000
const TEST_TARGETS: Record<Lang, string> = {
  en: 'hello+teste-en@salrayofficial.com',
  pt: 'hello+teste-pt@salrayofficial.com',
}

export type CronResult = {
  ok: true
  mode: 'normal' | 'test'
  sent: number
  skipped: number
  failed: number
  queued: number // devidos que ficaram para a próxima chamada
  serverTime: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Hora sempre em 12 horas com AM/PM. Ex.: "Nov 18, 2026, 04:52:10 AM". */
function time12(date: Date, timeZone?: string): string {
  return date.toLocaleString('en-US', {
    timeZone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

function serverTimeLabel(date: Date): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return `${time12(date)} (${tz})`
}

/** Tira qualquer endereço de e-mail de mensagens de erro do SMTP antes de logar/alertar. */
function scrub(message: string): string {
  return message.replace(/[^\s<>"',;]+@[^\s<>"',;]+/g, '[email]')
}

async function writeLog(line: string): Promise<void> {
  try {
    await fs.mkdir(path.dirname(CRON_LOG_FILE), { recursive: true })
    await fs.appendFile(CRON_LOG_FILE, `${time12(new Date(), 'America/New_York')} ET | ${line}\n`, 'utf-8')
  } catch (err) {
    console.error('first-steps cron: could not write cron.log:', err instanceof Error ? err.message : err)
  }
}

// Uma execução por vez: o app é um processo Node único, então um trava em memória basta.
let running = false

export async function runFollowups({ test }: { test: boolean }): Promise<CronResult | { busy: true }> {
  if (running) return { busy: true }
  running = true
  const startedAt = new Date()
  try {
    let sent = 0
    let failed = 0
    let skipped = 0
    let queued = 0
    const failReasons = new Set<string>()

    type Job = { to: string; lang: Lang; kind: FollowupKind; email?: string }
    let jobs: Job[]

    if (test) {
      // Modo teste: não lê nem grava a lista real.
      jobs = (['en', 'pt'] as Lang[]).flatMap((lang) => KINDS.map((kind) => ({ to: TEST_TARGETS[lang], lang, kind })))
    } else {
      const [subscribers, unsubscribed, sentRows] = await Promise.all([
        readJsonl<{ email?: string; lang?: string; date?: string }>(SUBSCRIBERS_FILE),
        readJsonl<{ email?: string }>(UNSUBSCRIBED_FILE),
        readJsonl<{ email?: string; day?: string }>(FOLLOWUPS_SENT_FILE),
      ])
      const { decisions, due } = plan(startedAt, subscribers, unsubscribed, sentRows)
      skipped = decisions.length - due.length
      queued = Math.max(0, due.length - MAX_PER_CALL)
      jobs = due.slice(0, MAX_PER_CALL).map((d) => ({ to: d.email, email: d.email, lang: d.lang, kind: d.kind }))
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      if (jobs.length > 0) {
        await writeLog(`mode=${test ? 'test' : 'normal'} ABORTED: SMTP not configured (${jobs.length} due)`)
        await sendAlert('SAL Ray site: followups cron misconfigured', 'The follow-up cron route has emails due but SMTP is not configured. Nothing was sent.')
        throw new Error('SMTP not configured')
      }
    }

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i]!
      if (i > 0) await sleep(PAUSE_MS)
      try {
        const msg = buildFollowup({
          lang: job.lang,
          kind: job.kind,
          token: makeToken(job.to),
          subjectPrefix: test ? '[TESTE] ' : '',
        })
        await sendEmail({
          from: FIRST_STEPS_FROM,
          replyTo: contato.email,
          to: job.to,
          subject: msg.subject,
          html: msg.html,
          text: msg.text,
          headers: msg.headers,
        })
        // Marca como enviado logo após cada envio (uma queda no meio não duplica).
        if (!test) await appendJsonl(FOLLOWUPS_SENT_FILE, { email: job.email, day: job.kind, date: new Date().toISOString() })
        sent++
      } catch (err) {
        failed++
        failReasons.add(scrub(err instanceof Error ? err.message : String(err)).slice(0, 120))
      }
    }

    const finished = new Date()
    await writeLog(
      `mode=${test ? 'test' : 'normal'} sent=${sent} skipped=${skipped} failed=${failed} queued=${queued} | server time ${serverTimeLabel(finished)}` +
        (failReasons.size ? ` | errors: ${[...failReasons].join(' ; ')}` : '')
    )
    if (failed > 0) {
      await sendAlert(
        'SAL Ray site: followups had failures',
        `${failed} follow-up email(s) failed to send in this call (${sent} sent). Failed ones are not marked as sent and are retried on the next call while inside their 2-day window.`
      )
    }

    return { ok: true, mode: test ? 'test' : 'normal', sent, skipped, failed, queued, serverTime: serverTimeLabel(finished) }
  } finally {
    running = false
  }
}
