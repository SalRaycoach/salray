'use client'

import { useState } from 'react'
import type { Faq } from '@/lib/config'
import { trackEvent } from '@/lib/analytics'

export default function FAQAccordion({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(index: number, question: string) {
    const next = openIndex === index ? null : index
    setOpenIndex(next)
    if (next !== null) trackEvent('faq_expand', { question })
  }

  return (
    <div className="divide-y divide-charcoal/10 border-t border-b border-charcoal/10">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.question} className="py-5">
            <button
              type="button"
              onClick={() => toggle(index, item.question)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between text-left font-display text-lg text-charcoal"
            >
              {item.question}
              <span className={`font-body text-orange text-xl ml-4 shrink-0 transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            {isOpen && (
              <p className="font-body text-charcoal/80 leading-relaxed mt-3 pr-8">{item.answer}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
