import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/config'

const title = 'Welcome to the Community | Sal Ray'

export const metadata: Metadata = {
  title,
  description: 'Thank you for requesting to join the private Facebook community.',
  openGraph: {
    title,
    url: `${SITE_URL}/thank-you-community/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'noindex, follow',
}

export default function ThankYouCommunityPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24 text-center">
      <h1 className="font-display text-4xl text-charcoal mb-6">You're almost in.</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-xl mx-auto mb-10">
        Your request to join the private Facebook community has been received. Once approved, you'll see it appear
        in your Facebook groups.
      </p>
      <Link href="/resources/" className="font-body text-sm font-medium text-aqua hover:text-charcoal">
        In the meantime, explore the Resource Library →
      </Link>
    </main>
  )
}
