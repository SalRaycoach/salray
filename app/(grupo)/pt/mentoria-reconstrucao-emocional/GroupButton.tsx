'use client'

import { trackEvent } from '@/lib/analytics'

export const GROUP_URL = 'https://chat.whatsapp.com/C2uKMyZbupXBO8ACZdHsxk?mode=gi_t'

/**
 * Botão "Entre no grupo do WhatsApp | Reconstrução Emocional" (página de anúncios). Registra o clique com o evento que o
 * site já usa para WhatsApp (whatsapp_click), que o trackEvent envia ao Meta Pixel como evento
 * personalizado e ao dataLayer/GA4. `location` diz qual dos três botões da página foi clicado.
 */
export default function GroupButton({ location }: { location: 'topo' | 'meio' | 'fim' }) {
  return (
    <div className="w-full md:w-fit">
      <a
        href={GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent('whatsapp_click', { cta_location: `grupo_gratuito_${location}`, offer_name: 'grupo_gratuito' })
        }
        className="flex w-full min-h-[56px] items-center justify-center text-center lg:whitespace-nowrap font-body text-base font-semibold bg-[#F7941D] text-[#171717] px-8 py-4 rounded-md hover:bg-charcoal transition-colors"
      >
        Entre no grupo do WhatsApp | Reconstrução Emocional
      </a>
      <p className="font-body text-sm text-charcoal/60 mt-2 text-center md:text-left">
        Sem cobrança. Sem obrigação de participar.
      </p>
    </div>
  )
}
