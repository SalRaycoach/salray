import type { Metadata } from 'next'
import { clinicalDisclaimer, crisisResource, SITE_URL } from '@/lib/config'

const title = 'Professional Disclaimer | Sal Ray'
const description = 'Sal Ray provides non-clinical coaching and personal development services. Read the full professional disclaimer.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/disclaimer/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function DisclaimerPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <div className="bg-pale-orange border border-orange/40 rounded-lg p-4 mb-10 max-w-2xl">
        <p className="font-body text-xs text-charcoal/70 leading-relaxed">
          <strong>Draft — pending attorney review.</strong> This page must be reviewed and approved by a licensed
          attorney in the relevant U.S. jurisdiction before this site is published live.
        </p>
      </div>

      <h1 className="font-display text-4xl text-charcoal mb-8">Professional Disclaimer</h1>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <p>{clinicalDisclaimer}</p>

        <h2 className="font-display text-2xl text-charcoal">No Clinical Claims</h2>
        <p>
          Nothing on this website, in coaching sessions, in testimonials, or in any advertising should be
          interpreted as a clinical or medical claim. Sal Ray is not a licensed therapist, psychologist,
          psychiatrist, or medical provider.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Non-Clinical Hypnosis</h2>
        <p>
          When appropriate and mutually agreed upon, Sal Ray may use non-clinical hypnosis techniques as one
          supportive tool within a broader coaching process. This is never presented as medical treatment, and
          informed consent is obtained before any such tool is used.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Not Emergency or Crisis Care</h2>
        <p>{crisisResource}</p>

        <h2 className="font-display text-2xl text-charcoal">No Guarantee of Outcome</h2>
        <p>
          Coaching outcomes depend on individual engagement and circumstances. Sal Ray does not guarantee specific
          results, a cure, or a particular outcome from any consultation, session, or program.
        </p>
      </section>
    </main>
  )
}
