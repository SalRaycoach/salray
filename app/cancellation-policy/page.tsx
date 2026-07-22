import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/config'

const title = 'Cancellation & Rescheduling Policy | Sal Ray'
const description = 'Cancellation and rescheduling policy for consultations and sessions with Sal Ray.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/cancellation-policy/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function CancellationPolicyPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <div className="bg-pale-orange border border-orange/40 rounded-lg p-4 mb-10 max-w-2xl">
        <p className="font-body text-xs text-charcoal/70 leading-relaxed">
          <strong>Pending approval.</strong> This is placeholder text — item 15.8 of the brief marks the final
          cancellation/rescheduling policy as not yet defined. Do not publish until the approved policy is
          confirmed.
        </p>
      </div>

      <h1 className="font-display text-4xl text-charcoal mb-8">Cancellation &amp; Rescheduling Policy</h1>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <p>
          [Insert the approved cancellation and rescheduling policy here — for example: notice period required to
          reschedule without charge, refund eligibility, and how to request a change to a scheduled consultation.]
        </p>

        <h2 className="font-display text-2xl text-charcoal">How to Reschedule</h2>
        <p>[Insert the approved process — e.g., via the booking platform or by contacting Sal Ray directly.]</p>

        <h2 className="font-display text-2xl text-charcoal">Refunds</h2>
        <p>[Insert the approved refund policy for cancellations made within/outside the notice period.]</p>
      </section>
    </main>
  )
}
