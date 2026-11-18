'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

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
 */

export type LeadMagnetVariant = 'page' | 'article' | 'compact'

const COVER_SRC = '/email/training-cover.jpg'
const COVER_WIDTH = 630
const COVER_HEIGHT = 1120

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const MESSAGES = {
  invalid: 'Please enter a valid email.',
  general: 'Something went wrong. Please try again in a moment.',
  rateLimit: 'Too many attempts. Please wait a minute and try again.',
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function LeadMagnetCard({
  variant = 'page',
  source,
  priority = false,
}: {
  variant?: LeadMagnetVariant
  source: string
  /** Cartão na primeira dobra: carrega a capa já, sem lazy. */
  priority?: boolean
}) {
  const uid = useId()
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const compact = variant !== 'page'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    const value = email.trim()
    if (!EMAIL_RE.test(value) || value.length > 200) {
      setStatus('error')
      setErrorMessage(MESSAGES.invalid)
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/first-steps-signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, lang: 'en', source, website }),
      })
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean }

      if (response.ok && data.ok) {
        // Nunca vai e-mail em parâmetro de evento.
        trackEvent('lead_magnet_signup', { lang: 'en', source })
        setStatus('success')
        setEmail('')
        return
      }

      setStatus('error')
      setErrorMessage(
        response.status === 429 ? MESSAGES.rateLimit : response.status === 400 ? MESSAGES.invalid : MESSAGES.general
      )
    } catch {
      setStatus('error')
      setErrorMessage(MESSAGES.general)
    }
  }

  const eyebrow = compact ? 'Interactive training PDF' : 'Interactive training PDF · 120 pages'
  const title = compact ? 'Thirty days to find the pattern running your life' : 'The Same Problem Keeps Finding You'
  const body = compact
    ? 'Every box can be filled in. About 20 minutes a day.'
    : 'Not a reading PDF. You write in it, day by day, and by day 30 the pattern has a name. Sent straight to your inbox.'

  const emailId = `${uid}-email`
  const errorId = `${uid}-error`

  return (
    <div
      className={`rounded-2xl border border-charcoal/15 bg-[#171717] ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8 md:p-10'
      } ${compact ? 'flex flex-col sm:flex-row items-center sm:items-center gap-6' : 'flex flex-col md:flex-row items-center gap-8 md:gap-12'}`}
    >
      <div className={`shrink-0 flex justify-center ${compact ? 'sm:w-[110px]' : 'md:w-[260px]'} py-2`}>
        <img
          src={COVER_SRC}
          width={COVER_WIDTH}
          height={COVER_HEIGHT}
          alt="Cover of the training: The Same Problem Keeps Finding You"
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
        <p className={`font-body text-charcoal/80 leading-relaxed ${compact ? 'mb-4' : 'mb-6'}`}>{body}</p>

        <div aria-live="polite">
          {status === 'success' ? (
            <div className="rounded-lg border border-aqua/40 bg-pale-aqua/60 p-4">
              <p className="font-display text-xl text-charcoal mb-1">Check your inbox.</p>
              <p className="font-body text-charcoal/80 leading-relaxed">
                Your training is on its way. If you do not see it in a few minutes, look in your Promotions or Spam
                folder.
              </p>
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
                  Your email
                </label>
                <input
                  id={emailId}
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={status === 'error' ? true : undefined}
                  aria-describedby={status === 'error' ? errorId : undefined}
                  className="min-w-0 flex-1 rounded-md border border-charcoal/30 bg-offwhite px-4 py-3.5 font-body text-charcoal placeholder:text-charcoal/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="whitespace-nowrap rounded-md bg-orange px-6 py-3.5 font-body text-sm font-semibold text-offwhite transition-colors hover:bg-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Sending...' : 'Get the training'}
                </button>
              </div>

              {status === 'error' && (
                <p id={errorId} role="alert" className="mt-3 font-body text-sm text-orange">
                  {errorMessage}
                </p>
              )}

              <p className="mt-3 font-body text-xs leading-relaxed text-charcoal/70">
                Delivered to your inbox. You can unsubscribe at any time.{' '}
                <Link href="/privacy-policy/" className="underline underline-offset-2 hover:text-orange">
                  Privacy Policy
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
