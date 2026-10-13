'use client'

import { trackEvent } from '@/lib/analytics'
import type { MentoriaButtonState } from '@/lib/pt-reconstrucao'

const BUTTON_CLASSES =
  'flex w-full min-h-[56px] items-center justify-center text-center font-body text-base font-semibold bg-[#F7941D] text-[#171717] px-6 py-4 rounded-md hover:bg-charcoal transition-colors'
const DISABLED_CLASSES =
  'flex w-full min-h-[56px] items-center justify-center text-center font-body text-base font-semibold bg-[#F7941D]/40 text-[#171717]/70 px-6 py-4 rounded-md cursor-not-allowed'

/**
 * Botão da Mentoria de Reconstrução Emocional. Os eventos são os mesmos dos botões de checkout
 * das outras ofertas (select_offer e begin_checkout, ver OfferCta.tsx), com offer_name "mentoria".
 * Fora do estado "active" o botão fica desativado e mostra o motivo.
 */
export default function MentoriaCta({
  state,
  label,
  href,
  price,
  source,
}: {
  state: MentoriaButtonState
  label: string
  href: string
  price: string
  source: string
}) {
  if (state !== 'active') {
    return (
      <button type="button" aria-disabled="true" disabled className={DISABLED_CLASSES}>
        {label}
      </button>
    )
  }

  return (
    <a
      href={href}
      onClick={() => {
        trackEvent('select_offer', { offer_name: 'mentoria', value: price, currency: 'USD', offer_source: source })
        trackEvent('begin_checkout', { offer_name: 'mentoria', value: price, currency: 'USD' })
      }}
      className={BUTTON_CLASSES}
    >
      {label}
    </a>
  )
}
