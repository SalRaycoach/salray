import fs from 'node:fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { contato } from '@/lib/config'
import { isAuthorizedCron } from '@/lib/cron-auth'
import { sendAlert, SUBSCRIBERS_FILE, UNSUBSCRIBED_FILE } from '@/lib/first-steps'

export const dynamic = 'force-dynamic'

/**
 * POST /api/first-steps-backup: cópia de segurança dos cadastros dos treinamentos. Envia por e-mail,
 * pelo mesmo SMTP do site, para hello@salrayofficial.com, com os arquivos first-steps-subscribers.jsonl
 * e first-steps-unsubscribed.jsonl anexados (nomes com a data de Nova York).
 *
 * Chamada pelo Cron Jobs da Hostinger (semanal, agendada por SAL Ray). Mesma proteção do cron dos
 * e-mails: CRON_SECRET em "Authorization: Bearer ...", 401 sem detalhe. Rota privada: noindex, fora do
 * sitemap, sem link em lugar nenhum. A resposta traz só contagens, e nenhum e-mail vai para log.
 * Arquivo de inscritos vazio ou ausente, ou qualquer erro: alerta (sendAlert) e nada de e-mail de backup.
 */

const PRIVATE_HEADERS = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' }

const scrub = (text: string) => text.replace(/[^\s<>"',;]+@[^\s<>"',;]+/g, '[email]')

async function readOrNull(file: string): Promise<string | null> {
  try {
    return await fs.readFile(file, 'utf-8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw err
  }
}

const countLines = (raw: string | null) => (raw ? raw.split('\n').filter((l) => l.trim()).length : 0)

export async function POST(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ ok: false }, { status: 401, headers: PRIVATE_HEADERS })
  }

  try {
    const [subscribersRaw, unsubscribedRaw] = await Promise.all([readOrNull(SUBSCRIBERS_FILE), readOrNull(UNSUBSCRIBED_FILE)])
    const subscribers = countLines(subscribersRaw)
    const unsubscribed = countLines(unsubscribedRaw)

    if (subscribers === 0) {
      // Pode ser perda de dados (ex.: o deploy apagou a pasta): avisa em vez de mandar um backup vazio.
      await sendAlert(
        'SAL Ray site: backup problem',
        'The weekly training subscribers backup found the subscribers file missing or empty. No backup email was sent. Check the data folder on the server.'
      )
      return NextResponse.json({ ok: false, subscribers, unsubscribed }, { status: 409, headers: PRIVATE_HEADERS })
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw new Error('SMTP not configured')
    }

    // Data de hoje em Nova York (AAAA-MM-DD) para os nomes dos arquivos.
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())

    await sendEmail({
      from: `"SAL Ray site" <${contato.email}>`,
      to: contato.email,
      subject: 'SAL Ray backup: training subscribers',
      text: `Weekly backup of the training lists (${day}).\n\nSubscribers: ${subscribers}\nUnsubscribed: ${unsubscribed}\n\nThe two files are attached. Keep them somewhere safe.\n`,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111;"><p>Weekly backup of the training lists (${day}).</p><p><strong>Subscribers:</strong> ${subscribers}<br><strong>Unsubscribed:</strong> ${unsubscribed}</p><p>The two files are attached. Keep them somewhere safe.</p></div>`,
      attachments: [
        { filename: `first-steps-subscribers-${day}.jsonl`, content: subscribersRaw ?? '', contentType: 'application/x-ndjson' },
        { filename: `first-steps-unsubscribed-${day}.jsonl`, content: unsubscribedRaw ?? '', contentType: 'application/x-ndjson' },
      ],
    })

    return NextResponse.json({ ok: true, subscribers, unsubscribed }, { headers: PRIVATE_HEADERS })
  } catch (err) {
    const reason = scrub(err instanceof Error ? err.message : String(err))
    console.error('first-steps backup failed:', reason)
    await sendAlert('SAL Ray site: backup failed', `The weekly training subscribers backup failed (${reason.slice(0, 120)}). No backup email was sent.`)
    return NextResponse.json({ ok: false }, { status: 500, headers: PRIVATE_HEADERS })
  }
}
