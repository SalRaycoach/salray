import type { Metadata } from 'next'
import Link from 'next/link'
import TrackOnMount from '@/components/TrackOnMount'
import { crisisResource, SITE_URL } from '@/lib/config'

const title = 'Consultation Confirmed | Sal Ray'

export const metadata: Metadata = {
  title,
  description: 'Your initial consultation with Sal Ray has been scheduled.',
  openGraph: {
    title,
    url: `${SITE_URL}/thank-you-consultation/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'noindex, follow',
}

export default function ThankYouConsultationPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24 text-center">
      <TrackOnMount event="consultation_booking_completed" />
      <h1 className="font-display text-4xl text-charcoal mb-6">Your consultation is confirmed.</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-xl mx-auto mb-4">
        A confirmation email and calendar invite are on their way, along with preparation notes and our policies.
        We look forward to speaking with you.
      </p>
      <p className="font-body text-sm text-charcoal/60 max-w-xl mx-auto mb-10">{crisisResource}</p>
      <Link href="/resources/" className="font-body text-sm font-medium text-aqua hover:text-charcoal">
        In the meantime, explore the Resource Library →
      </Link>
    </main>
  )
}
