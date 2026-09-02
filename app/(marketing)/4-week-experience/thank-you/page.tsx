import type { Metadata } from 'next'
import TrackOnMount from '@/components/TrackOnMount'
import { contato, SITE_URL } from '@/lib/config'

const title = 'Application Received'
const ogTitle = 'Application Received | SAL Ray'

export const metadata: Metadata = {
  title,
  description: 'Your 4-Week Experience application has been received.',
  openGraph: {
    title: ogTitle,
    url: `${SITE_URL}/4-week-experience/thank-you/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: ogTitle }],
  },
  robots: 'noindex, nofollow',
}

export default function FourWeekThankYouPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24 text-center">
      <TrackOnMount event="application_completed" />
      <h1 className="font-display text-4xl text-charcoal mb-6">Your application has been received.</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-xl mx-auto mb-4">
        Thank you for applying for the Private 4-Week Emotional &amp; Life Rebuilding Experience, and for taking the
        time to share your answers.
      </p>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-xl mx-auto mb-4">
        SAL Ray reviews each application individually. If your application appears to be a strong fit, you will
        receive an email from {contato.email} within three business days with the next step. Please check your spam
        or promotions folder if you do not see it.
      </p>
      <p className="font-body text-sm text-charcoal/60 max-w-xl mx-auto">
        Only three participants will be selected, and submitting an application does not guarantee participation.
      </p>
    </main>
  )
}
