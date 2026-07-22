import Link from 'next/link'
import { stableMethod } from '@/lib/config'

export default function StableMethodPreview() {
  return (
    <section className="border-b border-charcoal/10">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">The S.T.A.B.L.E. Method</h2>

        <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-10">
          A structured framework for recognizing emotional patterns, rebuilding internal stability, and translating
          insight into sustainable changes in daily life.
        </p>

        <div className="flex flex-wrap gap-4 mb-10">
          {stableMethod.letters.map((item) => (
            <div
              key={item.letter}
              className="w-16 h-16 rounded-full border-2 border-aqua flex items-center justify-center"
            >
              <span className="font-display text-2xl text-charcoal">{item.letter}</span>
            </div>
          ))}
        </div>

        <Link
          href="/stable-method/"
          className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          Explore the Method
        </Link>
      </div>
    </section>
  )
}
