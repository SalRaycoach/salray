'use client'

import { trackEvent } from '@/lib/analytics'

/**
 * Botão fixo do bloco "Quer ir mais fundo?": o mesmo em todas as reflexões,
 * sempre para a página dos programas. O data-event + AnalyticsListener
 * genérico do site não carrega parâmetros extras — este evento precisa do
 * slug do áudio, então dispara direto em vez de depender do listener global.
 */
export default function ProductCta({ audioSlug }: { audioSlug: string }) {
  return (
    <a
      href="/pt/reconstrucao-emocional/"
      onClick={() => trackEvent('product_cta_click', { audio_slug: audioSlug })}
      className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
    >
      Conheça os Programas de Reconstrução Emocional
    </a>
  )
}
