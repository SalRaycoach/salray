'use client'

import { useState } from 'react'
import type { Offer } from '@/lib/pt-reconstrucao'
import { trackEvent } from '@/lib/analytics'

/**
 * Captura "avise-me quando estiver pronto" — pensado pra ser reaproveitado
 * pela Mentoria depois (por isso recebe offerId/offerName/source como props
 * em vez de ter qualquer coisa específica do Primeiro Passo ou das
 * Vivências embutida aqui). Um único campo aceita e-mail OU WhatsApp, sem
 * validar formato rígido — a pessoa pode preencher do jeito que preferir
 * ser contatada.
 */
export default function NotifyMeForm({ offerId, offerName, source }: { offerId: Offer['id']; offerName: string; source: string }) {
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.trim()) return

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/notify-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: contact.trim(),
          offerId,
          offerName,
          pageUrl: window.location.href,
          website: '', // honeypot
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'Não foi possível enviar agora. Tente novamente em instantes.')
        return
      }
      trackEvent('notify_me_submit', { offer_name: offerId, cta_location: source })
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Não foi possível enviar agora. Verifique sua conexão e tente novamente.')
    }
  }

  if (status === 'success') {
    return (
      <p className="font-body text-sm text-charcoal/80 leading-relaxed border border-aqua/30 bg-aqua/5 rounded-md px-4 py-3.5">
        Combinado! Você será avisada assim que estiver pronto.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor={`notify-contact-${offerId}`} className="sr-only">
        Seu e-mail ou WhatsApp
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id={`notify-contact-${offerId}`}
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Seu e-mail ou WhatsApp"
          required
          disabled={status === 'submitting'}
          className="flex-1 font-body text-sm text-charcoal border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-aqua disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="font-body text-sm font-medium bg-orange text-charcoal px-6 py-3 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {status === 'submitting' ? 'Enviando…' : 'Avise-me quando estiver pronto'}
        </button>
      </div>
      {status === 'error' && <p className="font-body text-xs text-orange">{errorMessage}</p>}
    </form>
  )
}
