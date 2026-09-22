import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { business, contato, SITE_URL } from '@/lib/config'
import { SCALE_QUESTIONS, CATEGORIES, OPEN_QUESTIONS_RETAKE, CLOSING_MESSAGE, categorySummary } from '@/app/(marketing)/assessment/assessment-data'
import { persistFailedAssessment, sendAssessmentFailureAlert } from '@/lib/assessment-failsafe'

/**
 * Only reached on a retake (see AssessmentApp.tsx) — a first-time completion
 * never calls this route. Same in-memory rate limiting rationale as the
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br />')
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "You've submitted this too many times in a row. Please wait about 15 minutes and try again." },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const scales = Array.isArray(body.scales) ? (body.scales as unknown[]) : []
  const openAnswers = Array.isArray(body.openAnswers) ? (body.openAnswers as unknown[]) : []
  const submittedAt = typeof body.submitted_at === 'string' ? body.submitted_at : new Date().toISOString()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'A valid email address is required.' }, { status: 400 })
  }
  if (scales.length !== 10 || scales.some((v) => typeof v !== 'number' || v < 0 || v > 10)) {
    return NextResponse.json({ ok: false, error: 'All 10 scale answers (0-10) are required.' }, { status: 400 })
  }
  const numericScales = scales as number[]
  const answers = openAnswers.map((v) => (typeof v === 'string' ? v : ''))

  const submissionRecord = { email, scales: numericScales, openAnswers: answers, submittedAt }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    const reason = 'SMTP_HOST/SMTP_USER/SMTP_PASSWORD not set'
    console.error(`${reason} — cannot send assessment retake emails.`)
    await persistFailedAssessment(submissionRecord, reason)
    await sendAssessmentFailureAlert(email, reason)
    return NextResponse.json({ ok: false, error: 'We could not send your summary right now.' }, { status: 500 })
  }

  // Client email: the qualitative summary only, exactly as shown on screen —
  // no raw scores, matching the tool's own "not a diagnosis or a score" framing.
  const summaryHtml = CATEGORIES.map(
    (category) => `
      <div style="margin-bottom:20px;">
        <p style="text-transform:uppercase;letter-spacing:0.05em;font-size:11px;color:#0e8fa3;margin:0 0 6px;"><strong>${escapeHtml(category.name)}</strong></p>
        <p style="margin:0;">${escapeHtml(categorySummary(numericScales, category))}</p>
      </div>
    `
  ).join('')

  const clientHtml = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
      <p>Here is your snapshot from the self-assessment you just retook.</p>
      ${summaryHtml}
      <p style="margin-top:24px;">${escapeHtml(CLOSING_MESSAGE)}</p>
      <p>${business.nome}<br />${business.jobTitle}<br /><a href="${SITE_URL}/">${SITE_URL.replace('https://', '')}</a></p>
    </div>
  `

  // Notification email: full raw answers, including the open-ended ones —
  // deliberately more detailed than the client's own copy (see task spec).
  const scaleRows = SCALE_QUESTIONS.map((question, i) => {
    const category = CATEGORIES.find((c) => c.questions.includes(i))
    return `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top;">${escapeHtml(category?.name ?? '')}</td><td style="padding:4px 12px 4px 0;vertical-align:top;">${escapeHtml(question)}</td><td style="padding:4px 0;font-weight:bold;vertical-align:top;">${numericScales[i]}</td></tr>`
  }).join('')

  const openRows = OPEN_QUESTIONS_RETAKE.map(
    (question, i) => `
      <p style="margin:0 0 4px;"><strong>${escapeHtml(question)}</strong></p>
      <p style="margin:0 0 16px;color:#333;">${nl2br(answers[i] || '—')}</p>
    `
  ).join('')

  const notificationHtml = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;">
      <h2 style="margin-bottom:4px;">Assessment retake completed</h2>
      <p style="color:#555;margin-top:0;">${escapeHtml(submittedAt)} — ${escapeHtml(email)}</p>
      <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        ${scaleRows}
      </table>
      <h3>Reflections</h3>
      ${openRows}
    </div>
  `

  try {
    await sendEmail({
      from: `${business.nome} <${contato.email}>`,
      to: email,
      subject: 'Your Self-Assessment Summary',
      html: clientHtml,
    })

    await sendEmail({
      from: `SAL Ray site <${contato.email}>`,
      to: contato.email,
      replyTo: email,
      subject: `Assessment retake — ${email}`,
      html: notificationHtml,
    })
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    console.error('SMTP send failed for assessment retake:', err)
    await persistFailedAssessment(submissionRecord, reason)
    await sendAssessmentFailureAlert(email, reason)
    return NextResponse.json({ ok: false, error: 'We could not send your summary right now.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
