import type { Metadata } from 'next'
import BookSessionForm from '@/components/BookSessionForm'
import { SITE_URL } from '@/lib/config'

const title = 'Book a Session'
const description = 'Request a private coaching session with SAL Ray. Sessions are $60. SAL Ray personally reviews every request before scheduling.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/book-a-session/` },
  openGraph: {
    title: `${title} | SAL Ray`,
    description,
    url: `${SITE_URL}/book-a-session/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function BookASessionPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">Private Coaching Session</p>
      <h1 className="font-display text-4xl md:text-5xl leading-tight text-charcoal mb-6 max-w-2xl">Book a Session</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-4">
        Request a private, one-to-one coaching session with SAL Ray. Sessions are $60 and are delivered 100% online.
      </p>
      <p className="font-body text-charcoal/70 leading-relaxed max-w-2xl mb-14">
        Submitting the form below is a request, not an automatic booking. SAL Ray reviews every request personally
        and will follow up directly to confirm fit, scheduling, and payment.
      </p>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
        <div className="border border-charcoal/15 rounded-lg p-6 h-fit">
          <h2 className="font-display text-xl text-charcoal mb-2">Investment</h2>
          <p className="font-body text-2xl text-charcoal mb-1">$60</p>
          <p className="font-body text-sm text-charcoal/60">~60 minutes, delivered online</p>
        </div>

        <BookSessionForm />
      </div>
    </main>
  )
}
