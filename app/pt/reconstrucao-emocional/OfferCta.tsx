'use client'

import type { Offer } from '@/lib/pt-reconstrucao'
import { buildWhatsAppUrl, whatsapp } from '@/lib/pt-reconstrucao'
import { trackEvent } from '@/lib/analytics'

const BUTTON_CLASSES =
  'inline-block text-center font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors'
const DISABLED_CLASSES = 'inline-block text-center font-body text-sm font-medium bg-orange/40 text-charcoal/60 px-6 py-3.5 rounded-md cursor-not-allowed'

/**
 * Regra dos botões (briefing seções 4, 8, 16, 21 e checklist seção 7):
 * - As 3 ofertas pagas só apontam para links de checkout da Payhip, nunca
 *   Stripe Payment Link direto, nunca "#". Enquanto o link real não existir
 *   (offer.ctaHref começa com "PENDENTE_"), o botão fica aria-disabled.
 * - Mentoria sem turma ativa: nem checkout nem WhatsApp — só estado informativo.
 * - Personalizado: sempre WhatsApp, nunca checkout/Payhip/Stripe.
 */
export default function OfferCta({ offer, source }: { offer: Offer; source: string }) {
  if (offer.status === 'preparing' || offer.status === 'enrollment-closed') {
    const label = offer.status === 'preparing' ? 'Próxima turma em preparação' : 'Inscrições encerradas'
    return (
      <span className="inline-block font-body text-sm font-medium text-charcoal/70 border border-charcoal/20 px-6 py-3.5 rounded-md">
        {label}
      </span>
    )
  }

  if (offer.status === 'contact-only') {
    return (
      <a
        href={buildWhatsAppUrl(whatsapp.messages.personalizado)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent('select_offer', { offer_name: offer.id, offer_source: source })
          trackEvent('whatsapp_click', { cta_location: source, offer_name: offer.id })
        }}
        className={BUTTON_CLASSES}
      >
        {offer.ctaText}
      </a>
    )
  }

  const isPending = offer.ctaHref.startsWith('PENDENTE_')
  if (isPending) {
    return (
      <button
        type="button"
        aria-disabled="true"
        disabled
        title="Checkout ainda não disponível — link será ativado após a configuração da Payhip."
        className={DISABLED_CLASSES}
      >
        {offer.ctaText}
      </button>
    )
  }

  return (
    <a
      href={offer.ctaHref}
      onClick={() => {
        trackEvent('select_offer', { offer_name: offer.id, value: offer.price, currency: 'USD', offer_source: source })
        trackEvent('begin_checkout', { offer_name: offer.id, value: offer.price, currency: 'USD' })
      }}
      className={BUTTON_CLASSES}
    >
      {offer.ctaText}
    </a>
  )
}
