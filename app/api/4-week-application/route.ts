import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { business, contato, SITE_URL } from '@/lib/config'

/**
 * Rate limiting is in-memory because this app runs as a single long-lived
 * Node process (next start on Hostinger), not stateless serverless functions
 * — the Map survives across requests within the process lifetime, which is
 * enough to deter basic abuse without adding an external store.
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

const HOW_LONG_OPTIONS = ['Less than 3 months', '3-12 months', '1-3 years', 'More than 3 years']
const YES_NO_UNSURE = ['Yes', 'No', 'I am not sure']
const YES_NO = ['Yes', 'No']

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

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br />')
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error: "You've submitted this form too many times in a row. This is temporary — please wait about 15 minutes and try again.",
      },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success so
  // bots don't learn the field is being checked.
  if (str(body, 'website') !== '') {
    return NextResponse.json({ ok: true })
  }

  const firstName = str(body, 'firstName')
  const lastName = str(body, 'lastName')
  const email = str(body, 'email')
  const mobile = str(body, 'mobile')
  const location = str(body, 'location')
  const currentSituation = str(body, 'currentSituation')
  const desiredChange = str(body, 'desiredChange')
  const howLong = str(body, 'howLong')
  const whyNow = str(body, 'whyNow')
  const commitFourWeeks = str(body, 'commitFourWeeks')
  const activeParticipation = str(body, 'activeParticipation')
  const readyIn14Days = str(body, 'readyIn14Days')

  const ackAge18 = body.ackAge18 === true
  const ackNonClinical = body.ackNonClinical === true
  const ackNoGuarantee = body.ackNoGuarantee === true
  const ackAttendance = body.ackAttendance === true
  const ackPrivacy = body.ackPrivacy === true
  const phoneConsent = body.phoneConsent === true

  const errors: string[] = []
  if (!firstName) errors.push('First Name is required.')
  if (!lastName) errors.push('Last Name is required.')
  if (!email || !email.includes('@')) errors.push('A valid Email Address is required.')
  if (!location) errors.push('Please share where you are located.')
  if (!currentSituation) errors.push('Please describe what you are currently experiencing.')
  if (currentSituation.length > 1500) errors.push('The current-situation answer exceeds 1,500 characters.')
  if (!desiredChange) errors.push('Please describe what you would like to work on.')
  if (desiredChange.length > 1000) errors.push('The desired-change answer exceeds 1,000 characters.')
  if (!HOW_LONG_OPTIONS.includes(howLong)) errors.push('Please select how long this has been affecting you.')
  if (!whyNow) errors.push('Please share why now feels like the right time.')
  if (whyNow.length > 750) errors.push('The "why now" answer exceeds 750 characters.')
  if (!YES_NO_UNSURE.includes(commitFourWeeks)) errors.push('Please answer the four-week commitment question.')
  if (!YES_NO.includes(activeParticipation)) errors.push('Please answer the active-participation question.')
  if (!YES_NO.includes(readyIn14Days)) errors.push('Please answer the 14-day readiness question.')
  if (!ackAge18 || !ackNonClinical || !ackNoGuarantee || !ackAttendance || !ackPrivacy) {
    errors.push('All required acknowledgements must be confirmed.')
  }

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, error: errors[0], errors }, { status: 400 })
  }

  const submittedAt = str(body, 'submitted_at') || new Date().toISOString()
  const pageUrl = str(body, 'landing_page_url') || `${SITE_URL}/4-week-experience/`
  const utmSource = str(body, 'utm_source')
  const utmMedium = str(body, 'utm_medium')
  const utmCampaign = str(body, 'utm_campaign')
  const utmContent = str(body, 'utm_content')
  const fbclid = str(body, 'fbclid')

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error('SMTP_HOST/SMTP_USER/SMTP_PASSWORD are not set — cannot send 4-Week Experience application emails.')
    return NextResponse.json(
      { ok: false, error: 'We could not submit your application right now. Please try again shortly.' },
      { status: 500 }
    )
  }

  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:6px 12px 6px 0;color:#555;white-space:nowrap;vertical-align:top;"><strong>${escapeHtml(label)}</strong></td><td style="padding:6px 0;">${nl2br(value)}</td></tr>` : ''

  const notificationHtml = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;">
      <h2 style="margin-bottom:4px;">New 4-Week Experience application</h2>
      <p style="color:#555;margin-top:0;">${escapeHtml(submittedAt)}</p>
      <table cellpadding="0" cellspacing="0">
        ${row('First Name', firstName)}
        ${row('Last Name', lastName)}
        ${row('Email', email)}
        ${row('Mobile', mobile || '—')}
        ${row('Location', location)}
        ${row('Currently experiencing / dealing with', currentSituation)}
        ${row('Wants to understand / change / rebuild', desiredChange)}
        ${row('How long has this been affecting them', howLong)}
        ${row('Why now', whyNow)}
        ${row('Can commit to 1 session/week x 4 weeks', commitFourWeeks)}
        ${row('Prepared to participate actively', activeParticipation)}
        ${row('Ready to begin within 14 days if selected', readyIn14Days)}
        ${row('Phone contact consent', mobile ? (phoneConsent ? 'Yes' : 'No') : 'N/A')}
        ${row('Page URL', pageUrl)}
        ${row('utm_source', utmSource || '—')}
        ${row('utm_medium', utmMedium || '—')}
        ${row('utm_campaign', utmCampaign || '—')}
        ${row('utm_content', utmContent || '—')}
        ${row('fbclid', fbclid || '—')}
      </table>
    </div>
  `

  const confirmationHtml = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#111;line-height:1.6;">
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>Thank you for applying for the Private 4-Week Emotional &amp; Life Rebuilding Experience.</p>
      <p>I review each application individually. If your application appears to be a strong fit, you will receive an email from ${contato.email} within three business days with the next step.</p>
      <p>Only three participants will be selected, and submitting an application does not guarantee participation.</p>
      <p>${business.nome}<br />${business.jobTitle}<br /><a href="${SITE_URL}/">${SITE_URL.replace('https://', '')}</a></p>
    </div>
  `

  try {
    await sendEmail({
      from: `SAL Ray — 4-Week Experience <${contato.email}>`,
      to: contato.email,
      replyTo: email,
      subject: `New 4-Week Experience application — ${firstName} ${lastName}`,
      html: notificationHtml,
    })

    await sendEmail({
      from: `${business.nome} <${contato.email}>`,
      to: email,
      subject: 'We received your 4-Week Experience application',
      html: confirmationHtml,
    })
  } catch (err) {
    console.error('SMTP send failed for 4-Week Experience application:', err)
    return NextResponse.json(
      { ok: false, error: 'We could not submit your application right now. Please try again shortly.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
