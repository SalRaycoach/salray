import Link from 'next/link'
import { ctas, pricing } from '@/lib/config'

export default function FinalCTA() {
  return (
    <section className="bg-charcoal text-offwhite">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl mb-6 max-w-2xl mx-auto">
          You do not need to have everything figured out before the first conversation.
        </h2>

        <p className="font-body text-lg text-offwhite/80 leading-relaxed max-w-xl mx-auto mb-4">
          The initial consultation is a structured space to understand what is happening, identify the patterns
          that may be keeping you stuck, and decide whether this work is the right next step.
        </p>

        {pricing.confirmed && (
          <p className="font-body text-sm text-offwhite/60 mb-8">
            {pricing.consultationPrice} · {pricing.consultationDuration}
          </p>
        )}

        <Link
          href="/consultation/"
          data-event="consultation_cta_click"
          className={`inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-aqua transition-colors ${pricing.confirmed ? '' : 'mt-4'}`}
        >
          {ctas.primary}
        </Link>
      </div>
    </section>
  )
}
