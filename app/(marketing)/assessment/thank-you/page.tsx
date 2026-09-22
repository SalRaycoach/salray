import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Your self-assessment summary has been sent.',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/assessment/thank-you/` },
}

export default function AssessmentThankYouPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24 text-center">
      <h1 className="font-display text-4xl text-charcoal mb-6">Thank you.</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-xl mx-auto">
        A copy of your summary has been sent to your email. You can retake this assessment anytime, whenever you
        want to check in with yourself again.
      </p>
    </main>
  )
}
