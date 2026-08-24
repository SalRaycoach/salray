'use client'

import { useState } from 'react'

/**
 * Recolhida por padrão (pedido 24 ago 2026) — quem quer compartilhar ou ver
 * a próxima reflexão não precisa mais rolar pelo texto inteiro pra achar
 * esses elementos, que agora vêm antes dela na página. O texto completo
 * continua no HTML mesmo fechada (`hidden`, não removido do DOM) — mesmo
 * padrão já usado em FaqAccordion.tsx, necessário pra manter a transcrição
 * indexável pelo Google mesmo colapsada.
 */
export default function TranscriptAccordion({ transcricao }: { transcricao: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = 'transcricao-painel'

  return (
    <div className="max-w-2xl mb-12">
      <h2>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 font-body text-xs uppercase tracking-widest text-aqua hover:text-orange transition-colors"
        >
          <span>Ver transcrição completa</span>
          <span aria-hidden="true" className="shrink-0 text-base leading-none">
            {isOpen ? '−' : '+'}
          </span>
        </button>
      </h2>
      <div
        id={panelId}
        hidden={!isOpen}
        className="font-body text-charcoal/75 leading-relaxed whitespace-pre-line mt-4"
      >
        {transcricao}
      </div>
    </div>
  )
}
