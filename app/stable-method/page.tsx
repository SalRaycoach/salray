import type { Metadata } from 'next'
import Link from 'next/link'
import { ctas, stableMethod, business, SITE_URL } from '@/lib/config'

const title = 'The S.T.A.B.L.E. Method | Sal Ray'
const description =
  "The S.T.A.B.L.E. Method is Sal Ray's proprietary non-clinical framework for rebuilding emotional stability and direction."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/stable-method/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function StableMethodPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-6 max-w-2xl">The S.T.A.B.L.E. Method</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-12">
        {business.autoridadeMetodologica}, a structured framework for recognizing emotional patterns, rebuilding
        internal stability, and translating insight into sustainable changes in daily life.
      </p>

      <section className="mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-6">The Six Elements</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stableMethod.letters.map((item) => (
            <div key={item.letter} className="border border-charcoal/10 rounded-lg p-5">
              <span className="font-display text-3xl text-orange block mb-2">{item.letter}</span>
              <p className="font-body text-sm text-charcoal/60 italic">{item.meaning}</p>
            </div>
          ))}
        </div>
        <p className="font-body text-xs text-charcoal/50 mt-4">
          The full meaning of each letter will be published here once the approved copy is confirmed.
        </p>
      </section>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-4">How the Elements Connect</h2>
        <p className="font-body text-charcoal/85 leading-relaxed">
          Each element builds on the one before it — moving from recognizing what is happening, to rebuilding
          internal structure, to sustaining that stability once the initial work is complete. The method is applied
          sequentially, though the pace depends on each person's situation.
        </p>
      </section>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-4">Application</h2>
        <p className="font-body text-charcoal/85 leading-relaxed">
          The S.T.A.B.L.E. Method is applied throughout the initial consultation and any ongoing work that follows,
          adapted to the specific patterns and priorities identified for each person.
        </p>
      </section>

      <section className="max-w-2xl mb-12 bg-pale-orange rounded-lg p-6">
        <h2 className="font-display text-2xl text-charcoal mb-4">What This Method Is Not</h2>
        <p className="font-body text-charcoal/85 leading-relaxed">
          The S.T.A.B.L.E. Method is not a clinical treatment, a diagnostic tool, or a substitute for psychotherapy.
          It does not promise a cure or a guaranteed outcome, and it is not designed to treat mental health
          conditions.
        </p>
      </section>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-2">Have a question about the method?</h2>
        <p className="font-body text-charcoal/85 leading-relaxed mb-4">
          Common questions about the S.T.A.B.L.E. Method are answered on the{' '}
          <Link href="/faq/" className="text-aqua underline underline-offset-2">
            FAQ page
          </Link>
          .
        </p>
      </section>

      <Link
        href="/consultation/"
        data-event="consultation_cta_click"
        className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
      >
        {ctas.primary}
      </Link>
    </main>
  )
}
