'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { PUBLISHED_TRAININGS, TRAININGS, type Training } from '@/lib/trainings'

/**
 * O ÚNICO formulário da estante de treinamentos (/first-steps/ e /pt/primeiros-passos/). Mostra o
 * treinamento selecionado (rótulo, título, situação, corpo) e envia o cadastro dele para
 * POST /api/first-steps-signup (mesma rota, mesmos campos e mesma lógica do LeadMagnetCard).
 *
 * Os textos de TODOS os treinamentos ficam empilhados na mesma célula da grade; só o do selecionado é
 * visível. Assim o cartão tem sempre a altura do maior texto e nada pula ao trocar de capa.
 *
 * Eventos (só com `track`, como no LeadMagnetCard; sem e-mail em nenhum parâmetro):
 *  - lead_magnet_view: o cartão apareceu na tela (uma vez por treinamento e visita);
 *  - lead_magnet_select: clicou no campo de e-mail ou no botão (uma vez por treinamento e visita);
 *  - lead_magnet_signup: cadastro concluído. `training` é sempre o treinamento escolhido.
 */

export type ShelfLang = 'en' | 'pt'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const COPY = {
  en: {
    label: (n: string) => `30-Day Training ${n}`,
    bodyGeneric: 'Not a reading PDF. You write in it, day by day, for 30 days. Sent straight to your inbox.',
    bodyPdf1:
      'Not a reading PDF. You write in it, day by day, and by day 30 the pattern has a name. Sent straight to your inbox.',
    bodyPdf2:
      'Not a reading PDF. You write in it, day by day, and by day 30 you can see when you rescue and what it costs you. Sent straight to your inbox.',
    invalid: 'Please enter a valid email.',
    general: 'Something went wrong. Please try again in a moment.',
    rateLimit: 'Too many attempts. Please wait a minute and try again.',
    successTitle: 'Check your inbox.',
    successBody:
      'Your training is on its way. If you do not see it in a few minutes, look in your Promotions or Spam folder.',
    emailLabel: 'Your email',
    emailPlaceholder: 'Your email',
    button: 'Get the training',
    sending: 'Sending...',
    micro: 'Delivered to your inbox. You can unsubscribe at any time.',
    privacy: 'Privacy Policy',
    privacyHref: '/privacy-policy/',
    notSure: 'Not sure?',
    sendMessage: 'Send me a message',
    guide: 'and I will guide you.',
    quizOr: 'Or',
    quizLink: 'answer 3 questions',
    selected: 'Selected training:',
  },
  pt: {
    label: (n: string) => `Treinamento ${n} · 30 dias`,
    bodyGeneric: 'Não é um PDF de leitura. Você escreve nele, dia após dia, durante 30 dias. Enviado direto para o seu email.',
    bodyPdf1:
      'Não é um PDF de leitura. Você escreve nele, dia após dia, e no dia 30 o padrão tem nome. Enviado direto para o seu email.',
    bodyPdf2:
      'Não é um PDF de leitura. Você escreve nele, dia após dia, e no dia 30 enxerga quando resgata e o que isso custa a você. Enviado direto para o seu email.',
    invalid: 'Digite um email válido.',
    general: 'Algo deu errado. Tente de novo em instantes.',
    rateLimit: 'Muitas tentativas. Espere um minuto e tente de novo.',
    successTitle: 'Confira sua caixa de entrada.',
    successBody: 'Seu treinamento está a caminho. Se não aparecer em alguns minutos, olhe em Promoções ou Spam.',
    emailLabel: 'Seu email',
    emailPlaceholder: 'Seu email',
    button: 'Receber o treinamento',
    sending: 'Enviando...',
    micro: 'Enviado para o seu email. Você pode cancelar quando quiser.',
    privacy: 'Política de Privacidade',
    privacyHref: '/pt/politica-de-privacidade/',
    notSure: 'Em dúvida?',
    sendMessage: 'Me mande uma mensagem',
    guide: 'e eu te guio.',
    quizOr: 'Ou',
    quizLink: 'responda 3 perguntas',
    selected: 'Treinamento selecionado:',
  },
} as const

type Status = 'idle' | 'submitting' | 'success' | 'error'

function bodyFor(id: Training, lang: ShelfLang): string {
  const t = COPY[lang]
  return id === 'pdf1' ? t.bodyPdf1 : id === 'pdf2' ? t.bodyPdf2 : t.bodyGeneric
}

export default function TrainingSignupCard({
  lang,
  selected,
  source,
  track = false,
  messageHref,
  messageExternal = false,
  quizHref,
  onSignup,
}: {
  lang: ShelfLang
  selected: Training
  /** Origem do cadastro (first-steps, first-steps-quiz, primeiros-passos...). */
  source: string
  track?: boolean
  /** Link do "Not sure? Send me a message". */
  messageHref: string
  messageExternal?: boolean
  /** Âncora do seletor de 3 perguntas (só em inglês; sem ela o link não aparece). */
  quizHref?: string
  /** Chamado depois de um cadastro com sucesso. */
  onSignup?: (training: Training) => void
}) {
  const t = COPY[lang]
  const uid = useId()
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [inView, setInView] = useState(false)
  const [announce, setAnnounce] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)
  const viewedRef = useRef<Set<Training>>(new Set())
  const selectedRef = useRef<Set<Training>>(new Set())
  const firstRender = useRef(true)

  // Trocou de treinamento: limpa o resultado do envio anterior (a pessoa pode pedir outro treinamento)
  // e avisa o leitor de tela.
  useEffect(() => {
    setStatus('idle')
    setErrorMessage('')
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setAnnounce(`${t.selected} ${TRAININGS[selected].title[lang]}`)
  }, [selected, lang, t.selected])

  // O cartão está visível? (alimenta lead_magnet_view)
  useEffect(() => {
    if (!track) return
    const el = cardRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver((entries) => setInView(entries.some((e) => e.isIntersecting)), {
      threshold: 0.4,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [track])

  // lead_magnet_view: uma vez por treinamento e visita, quando o cartão dele aparece na tela.
  useEffect(() => {
    if (!track || !inView || viewedRef.current.has(selected)) return
    viewedRef.current.add(selected)
    trackEvent('lead_magnet_view', { lang, source, training: selected })
  }, [track, inView, selected, lang, source])

  function markSelected() {
    if (!track || selectedRef.current.has(selected)) return
    selectedRef.current.add(selected)
    trackEvent('lead_magnet_select', { lang, source, training: selected })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    const value = email.trim()
    if (!EMAIL_RE.test(value) || value.length > 200) {
      setStatus('error')
      setErrorMessage(t.invalid)
      return
    }

    setStatus('submitting')
    setErrorMessage('')
    const training = selected

    try {
      const response = await fetch('/api/first-steps-signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, lang, source, website, training }),
      })
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean }

      if (response.ok && data.ok) {
        // Nunca vai e-mail em parâmetro de evento.
        trackEvent('lead_magnet_signup', { lang, source, training })
        onSignup?.(training)
        setStatus('success')
        setEmail('')
        return
      }

      setStatus('error')
      setErrorMessage(response.status === 429 ? t.rateLimit : response.status === 400 ? t.invalid : t.general)
    } catch {
      setStatus('error')
      setErrorMessage(t.general)
    }
  }

  const emailId = `${uid}-email`
  const errorId = `${uid}-error`

  return (
    <div
      ref={cardRef}
      id="training-card"
      className="mx-auto max-w-3xl rounded-2xl border border-charcoal/15 bg-[#171717] p-6 sm:p-8 md:p-10"
    >
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      {/* Todos os textos na mesma célula: a altura é a do maior, então nada pula ao trocar de capa. */}
      <div className="grid">
        {PUBLISHED_TRAININGS.map((id) => {
          const active = id === selected
          const info = TRAININGS[id]
          return (
            <div
              key={id}
              aria-hidden={active ? undefined : true}
              className={`col-start-1 row-start-1 ${active ? '' : 'invisible'}`}
            >
              <p className="mb-2 font-body text-xs uppercase tracking-widest text-aqua">{t.label(info.downloadParam)}</p>
              <h2 className="mb-3 font-display text-2xl leading-tight text-charcoal sm:text-3xl">{info.title[lang]}</h2>
              <p className="mb-3 font-body text-sm font-semibold leading-relaxed text-orange">{info.situation[lang]}</p>
              <p className="mb-6 font-body leading-relaxed text-charcoal/80">{bodyFor(id, lang)}</p>
            </div>
          )
        })}
      </div>

      <div aria-live="polite">
        {status === 'success' ? (
          <div className="rounded-lg border border-aqua/40 bg-pale-aqua/60 p-4">
            <p className="mb-1 font-display text-xl text-charcoal">{t.successTitle}</p>
            <p className="font-body leading-relaxed text-charcoal/80">{t.successBody}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot: escondido de visitantes reais, preenchido por bots. */}
            <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <label htmlFor={`${uid}-website`}>Website</label>
              <input
                type="text"
                id={`${uid}-website`}
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor={emailId} className="sr-only">
                {t.emailLabel}
              </label>
              <input
                id={emailId}
                type="email"
                name="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={markSelected}
                aria-invalid={status === 'error' ? true : undefined}
                aria-describedby={status === 'error' ? errorId : undefined}
                className="min-w-0 flex-1 rounded-md border border-charcoal/30 bg-offwhite px-4 py-3.5 font-body text-charcoal placeholder:text-charcoal/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                onClick={markSelected}
                className="whitespace-nowrap rounded-md bg-orange px-6 py-3.5 font-body text-sm font-semibold text-offwhite transition-colors hover:bg-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? t.sending : t.button}
              </button>
            </div>

            {status === 'error' && (
              <p id={errorId} role="alert" className="mt-3 font-body text-sm text-orange">
                {errorMessage}
              </p>
            )}

            <p className="mt-3 font-body text-xs leading-relaxed text-charcoal/70">
              {t.micro}{' '}
              <Link href={t.privacyHref} className="underline underline-offset-2 hover:text-orange">
                {t.privacy}
              </Link>
            </p>
          </form>
        )}
      </div>

      <p className="mt-6 border-t border-charcoal/10 pt-5 font-body text-sm text-charcoal/80">
        {t.notSure}{' '}
        {messageExternal ? (
          <a
            href={messageHref}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-orange"
          >
            {t.sendMessage}
          </a>
        ) : (
          <Link href={messageHref} className="underline underline-offset-4 hover:text-orange">
            {t.sendMessage}
          </Link>
        )}{' '}
        {t.guide}
        {quizHref && (
          <>
            {' '}
            {t.quizOr}{' '}
            <a href={quizHref} className="underline underline-offset-4 hover:text-orange">
              {t.quizLink}
            </a>
            .
          </>
        )}
      </p>
    </div>
  )
}
