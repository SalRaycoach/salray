import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { business, ctas, clinicalDisclaimer, SITE_URL } from '@/lib/config'

const title = 'About Sal Ray | Emotional & Life Rebuilding Specialist'
const description =
  "Meet Sal Ray, Emotional & Life Rebuilding Specialist and creator of the S.T.A.B.L.E. Method, helping adults recognize patterns keeping them stuck."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/about/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function AboutPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <div className="grid md:grid-cols-[300px_1fr] gap-12 mb-16">
        <Image
          src="/images/about/sal-ray-portrait.jpg"
          alt={business.nome}
          width={420}
          height={504}
          className="w-full h-auto object-cover rounded-lg"
        />

        <div>
          <h1 className="font-display text-4xl text-charcoal mb-6">About Sal Ray</h1>
          <p className="font-body text-lg text-charcoal/80 leading-relaxed">
            {business.nome} is an {business.posicionamento.toLowerCase()} and coach who helps adults recognize the
            deeper patterns keeping them stuck. His work combines precise pattern recognition, structured personal
            development, and non-clinical tools designed to support clarity, stability, and responsible forward
            movement.
          </p>
        </div>
      </div>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-4">Philosophy</h2>
        <p className="font-body text-charcoal/85 leading-relaxed">
          Most people who feel stuck are not lacking willpower — they are carrying an unresolved pattern that keeps
          repeating until it is understood. Sal's work starts from that premise: clarity about the pattern comes
          before lasting change, not after it.
        </p>
      </section>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-4">Why Pattern Recognition Matters</h2>
        <p className="font-body text-charcoal/85 leading-relaxed">
          Repeating emotional cycles, relationship patterns, and self-doubt rarely resolve through effort alone.
          When the underlying pattern becomes visible, it becomes possible to respond differently — which is where
          real, sustainable change tends to begin.
        </p>
      </section>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-4">Approach and Tools</h2>
        <p className="font-body text-charcoal/85 leading-relaxed">
          Sessions combine structured conversation, pattern mapping, and practical, non-clinical tools. When
          appropriate and agreed upon, this can include non-clinical hypnosis as one supportive tool among others —
          never the central promise of the work, and never presented as medical treatment.
        </p>
      </section>

      <section className="max-w-2xl mb-12 bg-pale-aqua rounded-lg p-6">
        <h2 className="font-display text-2xl text-charcoal mb-4">Non-Clinical Boundaries</h2>
        <p className="font-body text-charcoal/85 leading-relaxed">{clinicalDisclaimer}</p>
      </section>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-4">Values</h2>
        <ul className="font-body text-charcoal/85 leading-relaxed list-disc list-inside space-y-1">
          <li>Clarity over vague reassurance</li>
          <li>Structure over guesswork</li>
          <li>Responsibility over dependency</li>
          <li>Honesty about what coaching can and cannot do</li>
        </ul>
      </section>

      <section className="max-w-2xl mb-16">
        <h2 className="font-display text-2xl text-charcoal mb-4">The S.T.A.B.L.E. Method</h2>
        <p className="font-body text-charcoal/85 leading-relaxed">
          {business.autoridadeMetodologica}. It is the structured framework behind Sal's work with clients — see{' '}
          <Link href="/stable-method/" className="text-aqua underline underline-offset-2">
            The S.T.A.B.L.E. Method
          </Link>{' '}
          for the full outline.
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
