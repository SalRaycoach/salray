import type { Metadata } from 'next'
import TrackOnMount from '@/components/TrackOnMount'
import { contato, SITE_URL } from '@/lib/config'

const title = 'Request Received'
const ogTitle = 'Request Received | SAL Ray'

export const metadata: Metadata = {
  title,
  description: 'Your session request has been received.',
  openGraph: {
    title: ogTitle,
    url: `${SITE_URL}/book-a-session/thank-you/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: ogTitle }],
  },
  robots: 'noindex, nofollow',
}

export default function BookSessionThankYouPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24 text-center">
      <TrackOnMount event="book_session_completed" />
      <h1 className="font-display text-4xl text-charcoal mb-6">Your request has been received.</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-xl mx-auto mb-4">
        Thank you for requesting a private session with SAL Ray.
      </p>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-xl mx-auto mb-4">
        SAL Ray reviews each request personally and will follow up with you directly, by email or phone, within two
        business days to confirm scheduling and next steps. Please check your spam or promotions folder if you don&apos;t
        see an email from {contato.email}.
      </p>
      <p className="font-body text-sm text-charcoal/60 max-w-xl mx-auto">
        Submitting this form does not guarantee a scheduled session.
      </p>
    </main>
  )
}
