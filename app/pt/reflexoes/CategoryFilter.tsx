'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Audio, AudioCategoria } from '@/lib/audios'
import { formatDuration } from '@/lib/audios'
import { trackEvent } from '@/lib/analytics'

/**
 * Filtro simples por categoria — sem busca por palavra-chave na v1 (ver
 * PROMPT_REFLEXOES_SAL_RAY.md seção 5). Filtragem client-side: com o volume
 * inicial baixo (3 áudios/semana), não vale a complexidade de rotas
 * separadas por categoria.
 */
export default function CategoryFilter({ audios, categorias }: { audios: Audio[]; categorias: AudioCategoria[] }) {
  const [activeCategoria, setActiveCategoria] = useState<AudioCategoria | 'all'>('all')
  const filtered = activeCategoria === 'all' ? audios : audios.filter((a) => a.categoria === activeCategoria)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          onClick={() => setActiveCategoria('all')}
          aria-pressed={activeCategoria === 'all'}
          className={`font-body text-sm px-4 py-2 rounded-full border transition-colors ${
            activeCategoria === 'all'
              ? 'bg-orange text-charcoal border-orange'
              : 'border-charcoal/20 text-charcoal/70 hover:border-orange hover:text-orange'
          }`}
        >
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategoria(cat)}
            aria-pressed={activeCategoria === cat}
            className={`font-body text-sm px-4 py-2 rounded-full border transition-colors ${
              activeCategoria === cat
                ? 'bg-orange text-charcoal border-orange'
                : 'border-charcoal/20 text-charcoal/70 hover:border-orange hover:text-orange'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="font-body text-charcoal/60">Nenhuma reflexão nesta categoria ainda.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((audio) => (
            <Link
              key={audio.slug}
              href={`/pt/reflexoes/${audio.slug}/`}
              onClick={() => trackEvent('related_audio_click', { audio_slug: audio.slug, source: 'hub' })}
              className="block border border-charcoal/10 rounded-lg p-6 hover:border-orange transition-colors"
            >
              <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{audio.categoria}</p>
              <h3 className="font-display text-xl text-charcoal mb-2">{audio.titulo}</h3>
              <p className="font-body text-sm text-charcoal/70 leading-relaxed mb-4">{audio.descricao}</p>
              <p className="font-body text-xs text-charcoal/50">{formatDuration(audio.duracaoSegundos)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
