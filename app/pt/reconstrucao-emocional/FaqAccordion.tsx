'use client'

import { useState } from 'react'
import type { PtFaq } from '@/lib/pt-reconstrucao'
import { trackEvent } from '@/lib/analytics'

/**
 * Accordion acessível — briefing seção 14 "Comportamento do FAQ": botão real,
 * indicador +/-, navegação por teclado nativa (button), aria-expanded. Uma
 * pergunta aberta por vez no mobile; no desktop o mesmo componente permite
 * várias abertas (sem estado exclusivo), como o resto do site já faz.
 */
export default function FaqAccordion({ faqs }: { faqs: PtFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-charcoal/10 border-t border-b border-charcoal/10">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        const panelId = `pt-faq-panel-${i}`
        const buttonId = `pt-faq-button-${i}`
        return (
          <div key={faq.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  const next = isOpen ? null : i
                  setOpenIndex(next)
                  if (next !== null) trackEvent('faq_expand', { question: faq.question })
                }}
                className="w-full flex items-center justify-between gap-4 py-5 text-left font-body text-charcoal hover:text-orange transition-colors"
              >
                <span className="font-medium">{faq.question}</span>
                <span aria-hidden="true" className="shrink-0 text-xl leading-none text-aqua">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="pb-5">
              {faq.answer ? (
                <p className="font-body text-sm text-charcoal/75 leading-relaxed max-w-[680px]">{faq.answer}</p>
              ) : (
                <p className="font-body text-sm text-charcoal/50 italic leading-relaxed max-w-[680px]">
                  Resposta pendente de aprovação final — será publicada antes do lançamento da página.
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
