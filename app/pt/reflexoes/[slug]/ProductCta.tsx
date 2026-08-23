'use client'

import { trackEvent } from '@/lib/analytics'
import type { ProdutoRelacionado } from '@/lib/audios'

/**
 * O data-event + AnalyticsListener genérico do site não carrega parâmetros
 * extras — este evento precisa do produto relacionado como parâmetro (ver
 * PROMPT_REFLEXOES_SAL_RAY.md seção 8), então dispara direto em vez de
 * depender do listener global.
 */
export default function ProductCta({
  audioSlug,
  produtoRelacionado,
  produtoNome,
  produtoArtigo,
  anchor,
}: {
  audioSlug: string
  produtoRelacionado: ProdutoRelacionado
  produtoNome: string
  produtoArtigo: string
  anchor: string
}) {
  return (
    <a
      href={`/pt/reconstrucao-emocional/#${anchor}`}
      onClick={() => trackEvent('product_cta_click', { produto_relacionado: produtoRelacionado, audio_slug: audioSlug })}
      className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
    >
      Conhecer {produtoArtigo} {produtoNome}
    </a>
  )
}
