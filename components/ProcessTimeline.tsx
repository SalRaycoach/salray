import Link from 'next/link'
import { processSteps, ctas } from '@/lib/config'

export default function ProcessTimeline() {
  return (
    <section className="border-b border-charcoal/10 bg-pale-aqua">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-12 max-w-xl">
          A clear process. No pressure. No vague promises.
        </h2>

        <div className="grid md:grid-cols-4 gap-8 md:gap-6 mb-12">
          {processSteps.map((item, index) => (
            <div key={item.step} className="relative pl-6 md:pl-0 border-l-2 md:border-l-0 border-aqua md:border-none">
              <div className="hidden md:block h-px bg-aqua mb-6" aria-hidden="true" />
              <span className="font-display text-2xl text-orange block mb-2">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-xl text-charcoal mb-2">{item.name}</h3>
              <p className="font-body text-charcoal/75 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <Link
          href="/consultation/"
          data-event="consultation_cta_click"
          className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          {ctas.primary}
        </Link>
      </div>
    </section>
  )
}
