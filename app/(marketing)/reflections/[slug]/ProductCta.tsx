'use client'

import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

/**
 * "Want to Go Deeper?" CTA — English reflections always point to the same
 * destination (/book-a-session/), unlike the Portuguese version, which
 * links to whichever offer the audio's `produtoRelacionado` names. Direct
 * dispatch instead of the generic data-event listener because it needs the
 * audio slug as a parameter (same rationale as the PT ProductCta).
 */
export default function ProductCta({ audioSlug }: { audioSlug: string }) {
  return (
    <Link
      href="/book-a-session/"
      onClick={() => trackEvent('product_cta_click', { produto_relacionado: 'book_a_session', audio_slug: audioSlug })}
      className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
    >
      Schedule a Private Session
    </Link>
  )
}
