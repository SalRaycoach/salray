import Link from 'next/link'
import { transformationDiagram } from '@/lib/config'

export default function Transformation() {
  return (
    <section className="border-b border-charcoal/10">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl text-charcoal max-w-2xl mb-6">
          This is not about becoming someone else. It is about rebuilding the structure that helps you become
          steady again.
        </h2>

        <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-12">
          The work helps you understand the pattern beneath the problem, strengthen self-trust, create emotional
          stability, and move forward with a clearer internal foundation.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {transformationDiagram.map((step, index) => (
            <div key={step} className="relative">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-display text-2xl text-orange">{index + 1}</span>
                <span className="font-display text-xl text-charcoal">{step}</span>
              </div>
              {index < transformationDiagram.length - 1 && (
                <div
                  className="hidden md:block absolute top-4 -right-3 w-6 h-px bg-aqua"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>

        <Link
          href="/how-i-help/"
          className="inline-block font-body text-sm font-medium bg-charcoal text-offwhite px-6 py-3.5 rounded-md hover:bg-aqua transition-colors"
        >
          See How I Help
        </Link>
      </div>
    </section>
  )
}
