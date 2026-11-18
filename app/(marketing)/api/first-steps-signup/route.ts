import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { buildFirstStepsEmail, buildSignupNotification, FIRST_STEPS_FROM } from '@/lib/first-steps-email'
import { contato } from '@/lib/config'
import {
  addSubscriber,
  isSubscribed,
  isUnsubscribed,
  isValidEmail,
  normalizeEmail,
  parseLang,
  parseSource,
  recordFailedDelivery,
  sendAlert,
  sendDeliveryFailureAlert,
  type Lang,
} from '@/lib/first-steps'
import { resolvePublishedTraining } from '@/lib/trainings'

/**
 * Cadastro do treinamento do PDF 1 (envio do e-mail com o link de download).
 * Mesmo padrão de /api/reflections-signup: honeypot "website", rate limit em
 * memória por IP (processo Node único e duradouro na Hostinger, não serverless).
 *
 * Ordem importa: o cadastro é gravado em disco ANTES de tentar o e-mail, então
 * uma falha de SMTP nunca perde a pessoa (fica em
 * first-steps-failed-deliveries.jsonl + alerta ntfy).
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

// Limite por destinatário: evita usar o formulário para encher a caixa de
// outra pessoa com reenvios (o IP muda, o e-mail alvo não).
const deliveryMap = new Map<string, number[]>()
const DELIVERY_WINDOW_MS = 60 * 60 * 1000
const DELIVERY_MAX = 3

function deliveryAllowed(email: string): boolean {
  const now = Date.now()
  const recent = (deliveryMap.get(email) || []).filter((t) => now - t < DELIVERY_WINDOW_MS)
  if (recent.length >= DELIVERY_MAX) {
    deliveryMap.set(email, recent)
    return false
  }
  recent.push(now)
  deliveryMap.set(email, recent)
  return true
}

const MESSAGES: Record<Lang, { rate: string; invalidEmail: string; failed: string }> = {
  en: {
    rate: "You've submitted this form too many times in a row. Please wait about 15 minutes and try again.",
    invalidEmail: 'Please enter a valid email address.',
    failed: 'We could not send your training right now. Please try again shortly.',
  },
  pt: {
    rate: 'Você enviou este formulário muitas vezes seguidas. Aguarde cerca de 15 minutos e tente de novo.',
    invalidEmail: 'Digite um endereço de e-mail válido.',
    failed: 'Não conseguimos enviar o seu treinamento agora. Tente novamente em instantes.',
  },
}

function str(body: Record<string, unknown>, key: string): string {
  return typeof body[key] === 'string' ? (body[key] as string).trim() : ''
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const lang = parseLang(body.lang)
  const msg = MESSAGES[lang]

  // Honeypot: visitantes reais nunca preenchem este campo escondido.
  if (str(body, 'website') !== '') {
    return NextResponse.json({ ok: true })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: msg.rate }, { status: 429 })
  }

  const email = normalizeEmail(str(body, 'email'))
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: msg.invalidEmail }, { status: 400 })
  }
  const source = parseSource(body.source)
  // Só treinamentos publicados (ausente = pdf1, como nos formulários antigos). Outro valor é recusado.
  const training = resolvePublishedTraining(body.training)
  if (!training) {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  try {
    // Quem se descadastrou nunca recebe nada. Resposta idêntica à de sucesso
    // para não revelar a ninguém quem está (ou não) na lista.
    if (await isUnsubscribed(email)) {
      return NextResponse.json({ ok: true })
    }

    // Já inscrito neste treinamento: reenvia o e-mail, mas não cria linha nova. Quem pede o
    // outro treinamento ganha uma linha própria (recebe os e-mails de apoio de cada um).
    const isNewSubscriber = !(await isSubscribed(email, training))
    if (isNewSubscriber) {
      await addSubscriber(email, lang, source, training)
    }

    // Cota por destinatário esgotada: não envia de novo, mas responde como sucesso.
    if (!deliveryAllowed(email)) {
      return NextResponse.json({ ok: true })
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      const reason = 'SMTP_HOST/SMTP_USER/SMTP_PASSWORD not set'
      console.error(`${reason}: first-steps signup saved, delivery email not sent.`)
      await recordFailedDelivery(email, lang, reason)
      await sendDeliveryFailureAlert(reason)
      return NextResponse.json({ ok: false, error: msg.failed }, { status: 500 })
    }

    const message = buildFirstStepsEmail({ lang, email, training })
    try {
      await sendEmail({
        from: FIRST_STEPS_FROM,
        to: email,
        subject: message.subject,
        html: message.html,
        text: message.text,
        headers: message.headers,
      })
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      console.error('SMTP send failed for first-steps delivery:', reason)
      await recordFailedDelivery(email, lang, reason)
      await sendDeliveryFailureAlert(reason)
      return NextResponse.json({ ok: false, error: msg.failed }, { status: 502 })
    }

    // Aviso interno só para cadastro NOVO e já entregue. Nunca pode derrubar
    // o cadastro nem a entrega: se falhar, só log (sem e-mail) e alerta ntfy.
    if (isNewSubscriber) {
      try {
        const note = buildSignupNotification({ lang, source, date: new Date(), training })
        await sendEmail({
          from: `"SAL Ray site" <${contato.email}>`,
          to: contato.email,
          subject: note.subject,
          html: note.html,
          text: note.text,
        })
      } catch (err) {
        console.error('first-steps signup notification failed:', err instanceof Error ? err.message : err)
        await sendAlert(
          'SAL Ray site: signup notice failed',
          'A new first-steps signup was saved and the training email was delivered, but the internal notice to hello@ failed to send.'
        )
      }
    }
  } catch (err) {
    // Erro de configuração (ex.: UNSUBSCRIBE_SECRET ausente) ou de disco.
    const reason = err instanceof Error ? err.message : String(err)
    console.error('first-steps signup failed:', reason)
    await recordFailedDelivery(email, lang, reason)
    await sendDeliveryFailureAlert(reason)
    return NextResponse.json({ ok: false, error: msg.failed }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
