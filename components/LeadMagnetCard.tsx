'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { TRAININGS, type Training } from '@/lib/trainings'

/**
 * Cartão de captura do treinamento interativo de 30 dias (PDF 1). É o ÚNICO
 * componente de captura do PDF 1: página /first-steps/, fim dos artigos, home
 * e /reflections/ usam este mesmo cartão e a mesma lógica de envio
 * (POST /api/first-steps-signup).
 *
 *  - variant "page": cartão grande (capa à esquerda, texto à direita; no celular
 *    a capa vai em cima).
 *  - variant "compact" / "article": cartão menor, com capa pequena, para o fim
 *    dos artigos ("article" usa o mesmo layout do "compact").
 *  - source: de onde veio o cadastro (first-steps, article, home, reflections...).
 *  - training: qual PDF o cartão entrega (pdf1 por padrão). Título, capa, páginas e a frase de
 *    "para qual situação" vêm de lib/trainings.ts. Cartões sem essa prop continuam como eram (PDF 1).
 *  - track: liga os eventos de engajamento (lead_magnet_view e lead_magnet_select). Desligado por
 *    padrão: só a página em inglês /first-steps/ e o seletor ligam. Sem e-mail em nenhum parâmetro.
 *  - onSignup: chamado depois de um cadastro com sucesso (o seletor usa para quiz_result_signup).
 */

export type LeadMagnetVariant = 'page' | 'article' | 'compact'

const COVER_WIDTH = 630
const COVER_HEIGHT = 1120

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type LeadMagnetLang = 'en' | 'pt'

const COPY = {
  en: {
    coverSrc: '/email/training-cover.jpg',
    coverAlt: 'Cover of the training: The Same Problem Keeps Finding You',
    invalid: 'Please enter a valid email.',
    general: 'Something went wrong. Please try again in a moment.',
    rateLimit: 'Too many attempts. Please wait a minute and try again.',
    eyebrowPage: 'Interactive training PDF · 120 pages',
    eyebrowCompact: 'Interactive training PDF',
    titlePage: 'The Same Problem Keeps Finding You',
    titleCompact: 'Thirty days to find the pattern running your life',
    bodyPage:
      'Not a reading PDF. You write in it, day by day, and by day 30 the pattern has a name. Sent straight to your inbox.',
    bodyCompact: 'Every box can be filled in. About 20 minutes a day.',
    pages: 'pages',
    coverAltPrefix: 'Cover of the training',
    bodyGeneric: 'Not a reading PDF. You write in it, day by day, for 30 days. Sent straight to your inbox.',
    bodyPdf2:
      'Not a reading PDF. You write in it, day by day, and by day 30 you can see when you rescue and what it costs you. Sent straight to your inbox.',
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
  },
  pt: {
    coverSrc: '/email/training-cover-pt.jpg',
    coverAlt: 'Capa do treinamento: O Mesmo Problema Continua Te Encontrando',
    invalid: 'Digite um email válido.',
    general: 'Algo deu errado. Tente de novo em instantes.',
    rateLimit: 'Muitas tentativas. Espere um minuto e tente de novo.',
    eyebrowPage: 'PDF interativo de treinamento · 120 páginas',
    eyebrowCompact: 'PDF interativo de treinamento',
    titlePage: 'O Mesmo Problema Continua Te Encontrando',
    titleCompact: 'Trinta dias para encontrar o padrão que comanda a sua vida',
    bodyPage:
      'Não é um PDF de leitura. Você escreve nele, dia após dia, e no dia 30 o padrão tem nome. Enviado direto para o seu email.',
    bodyCompact: 'Cada caixa pode ser preenchida. Cerca de 20 minutos por dia.',
    pages: 'páginas',
    coverAltPrefix: 'Capa do treinamento',
    bodyGeneric: 'Não é um PDF de leitura. Você escreve nele, dia após dia, durante 30 dias. Enviado direto para o seu email.',
    bodyPdf2:
      'Não é um PDF de leitura. Você escreve nele, dia após dia, e no dia 30 enxerga quando resgata e o que isso custa a você. Enviado direto para o seu email.',
    successTitle: 'Confira sua caixa de entrada.',
    successBody:
      'Seu treinamento está a caminho. Se não aparecer em alguns minutos, olhe em Promoções ou Spam.',
    emailLabel: 'Seu email',
    emailPlaceholder: 'Seu email',
    button: 'Receber o treinamento',
    sending: 'Enviando...',
    micro: 'Enviado para o seu email. Você pode cancelar quando quiser.',
    privacy: 'Política de Privacidade',
    privacyHref: '/pt/politica-de-privacidade/',
  },
} as const

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function LeadMagnetCard({
  variant = 'page',
  source,
  priority = false,
  lang = 'en',
  training = 'pdf1',
  showSituation = false,
  track = false,
  onSignup,
}: {
  variant?: LeadMagnetVariant
  source: string
  /** Idioma do cartão e do e-mail de entrega ("en" por padrão: os cartões em inglês não mudam). */
  lang?: LeadMagnetLang
  /** Qual treinamento o cartão entrega. */
  training?: Training
  /** Mostra a frase "para quem é" (usada na página com os dois treinamentos). */
  showSituation?: boolean
  /** Cartão na primeira dobra: carrega a capa já, sem lazy. */
  priority?: boolean
  /** Liga os eventos lead_magnet_view e lead_magnet_select (ver o comentário do topo). */
  track?: boolean
  /** Chamado depois de um cadastro com sucesso. */
  onSignup?: () => void
}) {
  const uid = useId()
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)
  const viewedRef = useRef(false)
  const selectedRef = useRef(false)

  const compact = variant !== 'page'
  const t = COPY[lang]

  // lead_magnet_view: o cartão apareceu na tela (uma vez por visita). Só com track ligado.
  useEffect(() => {
    if (!track || viewedRef.current) return
    const el = cardRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      viewedRef.current = true
      trackEvent('lead_magnet_view', { lang, source, training })
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !viewedRef.current) {
          viewedRef.current = true
          trackEvent('lead_magnet_view', { lang, source, training })
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [track, lang, source, training])

  // lead_magnet_select: clicou no campo de e-mail ou no botão (uma vez por cartão e visita).
  function markSelected() {
    if (!track || selectedRef.current) return
    selectedRef.current = true
    trackEvent('lead_magnet_select', { lang, source, training })
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
        onSignup?.()
        setStatus('success')
        setEmail('')
        return
      }

      setStatus('error')
      setErrorMessage(
        response.status === 429 ? t.rateLimit : response.status === 400 ? t.invalid : t.general
      )
    } catch {
      setStatus('error')
      setErrorMessage(t.general)
    }
  }

  const info = TRAININGS[training]
  const isPdf1 = training === 'pdf1'
  // PDF 1 e PDF 2: textos de sempre. Os demais: título vem de lib/trainings.ts e o corpo é genérico.
  // (O título do cartão compacto do PDF 1 é a chamada dele; nos outros é o próprio título.)
  const eyebrow =
    compact || info.pages[lang] <= 0 ? t.eyebrowCompact : `${t.eyebrowCompact} · ${info.pages[lang]} ${t.pages}`
  const title = !isPdf1 ? info.title[lang] : compact ? t.titleCompact : t.titlePage
  const body = compact ? t.bodyCompact : isPdf1 ? t.bodyPage : training === 'pdf2' ? t.bodyPdf2 : t.bodyGeneric
  const coverSrc = info.cover[lang]
  const coverAlt = `${t.coverAltPrefix}: ${info.title[lang]}`

  const emailId = `${uid}-email`
  const errorId = `${uid}-error`

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl border border-charcoal/15 bg-[#171717] ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8 md:p-10'
      } ${compact ? 'flex flex-col sm:flex-row items-center sm:items-center gap-6' : 'flex flex-col md:flex-row items-center gap-8 md:gap-12'}`}
    >
      <div className={`shrink-0 flex justify-center ${compact ? 'sm:w-[110px]' : 'md:w-[260px]'} py-2`}>
        <img
          src={coverSrc}
          width={COVER_WIDTH}
          height={COVER_HEIGHT}
          alt={coverAlt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // fetchpriority é válido no DOM, mas o React 18.3 ainda não tipa o atributo.
          {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
          style={{ height: 'auto' }}
          className={`-rotate-6 rounded-sm shadow-[0_18px_36px_rgba(0,0,0,0.6)] ${compact ? 'w-[96px]' : 'w-[150px] sm:w-[220px] md:w-[240px]'}`}
        />
      </div>

      <div className="min-w-0 flex-1 w-full">
        <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">{eyebrow}</p>
        <h2
          className={`font-display text-charcoal leading-tight mb-3 ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}
        >
          {title}
        </h2>
        {showSituation && (
          <p className="font-body text-sm font-semibold text-orange mb-3 leading-relaxed">{info.situation[lang]}</p>
        )}
        <p className={`font-body text-charcoal/80 leading-relaxed ${compact ? 'mb-4' : 'mb-6'}`}>{body}</p>

        <div aria-live="polite">
          {status === 'success' ? (
            <div className="rounded-lg border border-aqua/40 bg-pale-aqua/60 p-4">
              <p className="font-display text-xl text-charcoal mb-1">{t.successTitle}</p>
              <p className="font-body text-charcoal/80 leading-relaxed">{t.successBody}</p>
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

              <div className="flex flex-col sm:flex-row gap-3">
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
                  // Com dois cartões na mesma página, o leitor de tela precisa saber qual treinamento cada botão pede.
                  aria-label={showSituation ? `${t.button}: ${info.title[lang]}` : undefined}
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
      </div>
    </div>
  )
}
