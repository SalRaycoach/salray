import Link from 'next/link'
import { problemCards } from '@/lib/config'

export default function ProblemRecognition() {
  return (
    <section className="border-b border-charcoal/10 bg-pale-aqua">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl text-charcoal max-w-2xl mb-6">
          You may not be falling apart. You may be carrying too much for too long.
        </h2>

        <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-10">
          Externally, you may still be working, caring for others, and doing what needs to be done. Internally,
          your mind may be exhausted, your direction unclear, and the same emotional patterns may continue to
          repeat.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {problemCards.map((card) => (
            <div key={card} className="bg-offwhite border border-charcoal/10 rounded-lg p-5">
              <span className="block w-2.5 h-2.5 rounded-full bg-orange mb-3" aria-hidden="true" />
              <p className="font-body text-charcoal font-medium">{card}</p>
            </div>
          ))}
        </div>

        <Link href="/how-i-help/" className="font-body text-sm font-medium text-aqua hover:text-charcoal">
          Continue exploring →
        </Link>
      </div>
    </section>
  )
}
