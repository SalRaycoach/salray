import type { Metadata } from 'next'
import Link from 'next/link'
import { ctas, helpAreas, processSteps, clinicalDisclaimer, crisisResource, SITE_URL } from '@/lib/config'

const title = 'How I Help | Emotional & Life Rebuilding'
const description =
  'Non-clinical support for overthinking, repeating patterns, loss of direction, and emotional instability — structured, realistic, and honest about its limits.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/how-i-help/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function HowIHelpPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-6 max-w-2xl">Emotional & Life Rebuilding</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-12">
        Emotional & Life Rebuilding is a structured, non-clinical process for understanding the patterns that keep
        you stuck, rebuilding internal stability, and moving forward with a clearer sense of direction.
      </p>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-4">Signs You May Be Stuck</h2>
        <ul className="font-body text-charcoal/85 leading-relaxed list-disc list-inside space-y-1">
          {helpAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </section>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-4">Focus Areas</h2>
        <p className="font-body text-charcoal/85 leading-relaxed">
          Work is organized around understanding recurring emotional patterns, rebuilding self-trust, strengthening
          boundaries in relationships, and creating a clearer, more stable sense of direction.
        </p>
      </section>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-4">Realistic Outcomes</h2>
        <p className="font-body text-charcoal/85 leading-relaxed">
          This work can support greater clarity about recurring patterns, a steadier emotional baseline, and more
          confident decision-making. It does not promise instant transformation, a cure, or a guaranteed outcome —
          progress depends on consistent, active engagement in the process.
        </p>
      </section>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-4">Who May Benefit</h2>
        <p className="font-body text-charcoal/85 leading-relaxed">
          Adults who feel emotionally overloaded, stuck in repeating patterns, disconnected from direction, or ready
          to work actively on personal change.
        </p>
      </section>

      <section className="max-w-2xl mb-12 bg-pale-aqua rounded-lg p-6">
        <h2 className="font-display text-2xl text-charcoal mb-4">Who May Need Clinical Support Instead</h2>
        <p className="font-body text-charcoal/85 leading-relaxed mb-3">{clinicalDisclaimer}</p>
        <p className="font-body text-charcoal/85 leading-relaxed">{crisisResource}</p>
      </section>

      <section className="max-w-2xl mb-12">
        <h2 className="font-display text-2xl text-charcoal mb-6">The Process</h2>
        <ol className="space-y-6">
          {processSteps.map((item) => (
            <li key={item.step} className="flex gap-4">
              <span className="font-display text-xl text-orange shrink-0">{item.step}.</span>
              <div>
                <h3 className="font-display text-lg text-charcoal">{item.name}</h3>
                <p className="font-body text-charcoal/75 leading-relaxed">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
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
