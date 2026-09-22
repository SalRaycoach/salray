'use client'

import { useState } from 'react'

/**
 * English counterpart of app/pt/reflexoes/[slug]/TranscriptAccordion.tsx.
 * Collapsed by default; the full text stays in the DOM even closed
 * (`hidden`, not removed) so the transcript remains indexable by Google
 * while collapsed.
 */
export default function TranscriptAccordion({ transcript }: { transcript: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = 'transcript-panel'

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
          <span>View Full Transcript</span>
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
        {transcript}
      </div>
    </div>
  )
}
