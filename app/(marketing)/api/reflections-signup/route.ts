import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { contato, SITE_URL } from '@/lib/config'
import { persistReflectionsSignup } from '@/lib/reflections-signup-log'

/**
 * Captures "Receive New Audio Reflections" signups on /reflections/. No
 * external email-marketing service — this only records the signup and
 * notifies hello@salrayofficial.com so SAL Ray can filter it into its own
 * Gmail folder by subject. Same in-memory rate limiting rationale as the
 * other form routes (single long-lived Node process, not serverless).
 */
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 5

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (rateLimitMap.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  recent.push(now)
  rateLimitMap.set(ip, recent)
  return recent.length > RATE_LIMIT_MAX
}

function str(body: Record<string, unknown>, key: string): string {
  return typeof body[key] === 'string' ? (body[key] as string).trim() : ''
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "You've submitted this form too many times in a row. Please wait about 15 minutes and try again." },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: real visitors never fill this hidden field.
  if (str(body, 'website') !== '') {
    return NextResponse.json({ ok: true })
  }

  const email = str(body, 'email')
  const pageUrl = str(body, 'pageUrl') || `${SITE_URL}/reflections/`

  if (!email || !email.includes('@') || email.length > 200) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
  }

  await persistReflectionsSignup({ email, pageUrl, ip })

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    try {
      await sendEmail({
        from: `SAL Ray site <${contato.email}>`,
        to: contato.email,
        subject: `[Reflections Signup] ${email}`,
        html: `
          <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;">
            <h2 style="margin-bottom:4px;">New S.T.A.B.L.E. Reflections signup</h2>
            <table cellpadding="0" cellspacing="0">
              <tr><td style="padding:6px 12px 6px 0;color:#555;"><strong>Email</strong></td><td style="padding:6px 0;">${escapeHtml(email)}</td></tr>
              <tr><td style="padding:6px 12px 6px 0;color:#555;"><strong>Page</strong></td><td style="padding:6px 0;">${escapeHtml(pageUrl)}</td></tr>
            </table>
          </div>
        `,
      })
    } catch (err) {
      // Does not block the success response — the signup is already saved to disk.
      console.error('Failed to send reflections-signup notification email:', err)
    }
  } else {
    console.error('SMTP_HOST/SMTP_USER/SMTP_PASSWORD not set — reflections signup saved to disk only, no email alert sent.')
  }

  return NextResponse.json({ ok: true })
}
