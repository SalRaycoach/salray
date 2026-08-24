import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { contato, SITE_URL } from '@/lib/config'
import { offers } from '@/lib/pt-reconstrucao'
import { persistNotifyMeSignup } from '@/lib/notify-me-log'

/**
 * Captura "avise-me quando estiver pronto" para ofertas ainda em gravação
 * (Primeiro Passo, Vivências — 23 ago 2026). Componente genérico: qualquer
 * offer.id válido em lib/pt-reconstrucao.ts pode usar este endpoint, incluindo
 * a Mentoria quando ela for reaproveitar o mesmo formulário.
 *
 * Ao contrário do e-mail de notificação (melhor esforço, pode falhar), o
 * registro em disco (persistNotifyMeSignup) é sempre feito primeiro — esta
 * lista de espera não pode depender só do SMTP estar de pé.
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

const VALID_OFFER_IDS = new Set(offers.map((o) => o.id))

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Você enviou esse formulário várias vezes seguidas. Aguarde cerca de 15 minutos e tente de novo.' },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Requisição inválida.' }, { status: 400 })
  }

  // Honeypot: visitantes reais nunca preenchem este campo oculto.
  if (str(body, 'website') !== '') {
    return NextResponse.json({ ok: true })
  }

  const contact = str(body, 'contact')
  const offerId = str(body, 'offerId')
  const offerName = str(body, 'offerName')
  const pageUrl = str(body, 'pageUrl') || SITE_URL

  if (!contact || contact.length > 200) {
    return NextResponse.json({ ok: false, error: 'Informe um e-mail ou WhatsApp válido.' }, { status: 400 })
  }
  if (!VALID_OFFER_IDS.has(offerId as (typeof offers)[number]['id'])) {
    return NextResponse.json({ ok: false, error: 'Oferta desconhecida.' }, { status: 400 })
  }

  const signup = { contact, offerId, offerName, pageUrl, ip }
  await persistNotifyMeSignup(signup)

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    try {
      await sendEmail({
        from: `SAL Ray site <${contato.email}>`,
        to: contato.email,
        subject: `Nova inscrição "avise-me" — ${offerName || offerId}`,
        html: `
          <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;">
            <h2 style="margin-bottom:4px;">Nova inscrição para aviso de lançamento</h2>
            <table cellpadding="0" cellspacing="0">
              <tr><td style="padding:6px 12px 6px 0;color:#555;"><strong>Oferta</strong></td><td style="padding:6px 0;">${escapeHtml(offerName || offerId)}</td></tr>
              <tr><td style="padding:6px 12px 6px 0;color:#555;"><strong>Contato</strong></td><td style="padding:6px 0;">${escapeHtml(contact)}</td></tr>
              <tr><td style="padding:6px 12px 6px 0;color:#555;"><strong>Página</strong></td><td style="padding:6px 0;">${escapeHtml(pageUrl)}</td></tr>
            </table>
          </div>
        `,
      })
    } catch (err) {
      // Não bloqueia a resposta de sucesso — o cadastro já está salvo em disco.
      console.error('Failed to send notify-me notification email:', err)
    }
  } else {
    console.error('SMTP_HOST/SMTP_USER/SMTP_PASSWORD not set — notify-me signup saved to disk only, no email alert sent.')
  }

  return NextResponse.json({ ok: true })
}
