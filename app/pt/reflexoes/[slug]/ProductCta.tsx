'use client'

import { trackEvent } from '@/lib/analytics'

/**
 * Botão fixo do bloco "Quer ir mais fundo?": o mesmo em todas as reflexões,
 * sempre para a página dos programas. O data-event + AnalyticsListener
 * genérico do site não carrega parâmetros extras — este evento precisa do
 * slug do áudio, então dispara direto em vez de depender do listener global.
 * Largura total do bloco e altura mínima de 56 px para ficar fácil de tocar no celular.
 */
export default function ProductCta({ audioSlug }: { audioSlug: string }) {
  return (
    <a
      href="/pt/reconstrucao-emocional/"
      onClick={() => trackEvent('product_cta_click', { audio_slug: audioSlug })}
      className="flex w-full min-h-[56px] items-center justify-center text-center font-body text-base font-semibold bg-[#F7941D] text-offwhite px-6 py-4 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
    >
      Conheça os Programas de Reconstrução Emocional
    </a>
  )
}
