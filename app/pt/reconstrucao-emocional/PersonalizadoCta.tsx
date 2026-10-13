'use client'

import { trackEvent } from '@/lib/analytics'

const BUTTON_CLASSES =
  'flex w-full min-h-[56px] items-center justify-center text-center font-body text-base font-semibold bg-[#F7941D] text-[#171717] px-6 py-4 rounded-md hover:bg-charcoal transition-colors'

/**
 * Botão de cada serviço do Acompanhamento Personalizado. Mesmo fluxo do botão antigo da seção
 * (WhatsApp, ver OfferCta.tsx, ramo contact-only), com a mensagem identificando o serviço, e os
 * mesmos eventos (select_offer e whatsapp_click) com offer_name = consulta, sessao ou pacote.
 */
export default function PersonalizadoCta({
  servico,
  label,
  href,
}: {
  servico: 'consulta' | 'sessao' | 'pacote'
  label: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent('select_offer', { offer_name: servico, offer_source: 'oferta_personalizado' })
        trackEvent('whatsapp_click', { cta_location: 'oferta_personalizado', offer_name: servico })
      }}
      className={BUTTON_CLASSES}
    >
      {label}
    </a>
  )
}
