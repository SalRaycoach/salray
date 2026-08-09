import nodemailer from 'nodemailer'

/**
 * Single seam for outbound transactional email. Callers only see sendEmail()
 * — if delivery ever needs to move to a different SMTP account or a
 * provider like Resend, only this file changes, not the routes that call it.
 */

export type SendEmailInput = {
  to: string
  from: string
  replyTo?: string
  subject: string
  html: string
}

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (cachedTransporter) return cachedTransporter

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 465)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASSWORD must be set to send email.')
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = implicit TLS; 587 uses STARTTLS (secure: false)
    auth: { user, pass },
  })

  return cachedTransporter
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const transporter = getTransporter()
  await transporter.sendMail({
    to: input.to,
    from: input.from,
    replyTo: input.replyTo,
    subject: input.subject,
    html: input.html,
  })
}
