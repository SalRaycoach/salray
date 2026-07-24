import type { Metadata } from 'next'
import SchemaOrg from '@/components/SchemaOrg'
import { getServiceSchema } from '@/lib/schema'
import { pricing, contato, clinicalDisclaimer, SITE_URL } from '@/lib/config'

const title = 'Initial Consultation | Sal Ray'
const description =
  'Schedule a structured, non-clinical initial consultation with Sal Ray to understand your situation and determine the right next step.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/consultation/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function ConsultationPage() {
  const schema = getServiceSchema()
  const isBookingPending = contato.bookingUrl.startsWith('PENDENTE_')

  return (
    <>
      <SchemaOrg data={schema} />
      <main className="max-w-content mx-auto px-6 py-16 md:py-24">
        <h1 className="font-display text-4xl text-charcoal mb-6 max-w-2xl">Initial Consultation</h1>
        <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-10">
          The initial consultation is a structured space to understand what is happening, identify the patterns
          that may be keeping you stuck, and decide whether this work is the right next step.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="font-display text-2xl text-charcoal mb-4">Who It Is For</h2>
            <p className="font-body text-charcoal/85 leading-relaxed mb-8">
              Adults who feel emotionally overloaded, stuck in repeating patterns, or ready to explore whether this
              work is a good fit — no prior preparation or clarity required.
            </p>

            <h2 className="font-display text-2xl text-charcoal mb-4">Purpose</h2>
            <p className="font-body text-charcoal/85 leading-relaxed mb-8">
              To clarify your current situation, identify relevant patterns and priorities, explain the approach,
              and determine whether there is a responsible fit for ongoing work.
            </p>

            <h2 className="font-display text-2xl text-charcoal mb-4">Duration & Format</h2>
            <p className="font-body text-charcoal/85 leading-relaxed mb-8">
              {pricing.consultationDuration}, delivered 100% online via video call with time zones displayed
              clearly during booking.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-charcoal mb-4">Investment</h2>
            <p className="font-body text-charcoal/85 leading-relaxed mb-2">
              {pricing.consultationPrice} <span className="text-charcoal/50">({pricing.consultationDuration})</span>
            </p>
            {!pricing.confirmed && (
              <p className="font-body text-xs text-charcoal/50 mb-8">
                Pricing shown is a placeholder pending final confirmation before publication.
              </p>
            )}

            <h2 className="font-display text-2xl text-charcoal mb-4">What to Expect</h2>
            <p className="font-body text-charcoal/85 leading-relaxed mb-8">
              A calm, structured conversation — not a sales pitch. You will be asked about what brought you here and
              what you are hoping will change.
            </p>

            <h2 className="font-display text-2xl text-charcoal mb-4">Preparation</h2>
            <p className="font-body text-charcoal/85 leading-relaxed mb-8">
              No preparation is required. It can help to think in advance about one or two situations where the
              pattern you want to address shows up most clearly.
            </p>
          </div>
        </div>

        <section className="bg-pale-aqua rounded-lg p-8 mb-12">
          <h2 className="font-display text-2xl text-charcoal mb-4">Book Your Consultation</h2>
          {isBookingPending ? (
            <>
              <p className="font-body text-charcoal/70 leading-relaxed mb-6">
                Online booking is being finalized. In the meantime, message Sal Ray directly to schedule your
                consultation.
              </p>
              <a
                href={contato.messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-event="messenger_cta_click"
                className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
              >
                Message Sal Ray
              </a>
            </>
          ) : (
            <a
              href={contato.bookingUrl}
              data-event="consultation_booking_started"
              className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
            >
              Book Your Consultation
            </a>
          )}
        </section>

        <section className="max-w-2xl">
          <h2 className="font-display text-xl text-charcoal mb-3">Policies & Disclaimer</h2>
          <p className="font-body text-sm text-charcoal/70 leading-relaxed mb-2">{clinicalDisclaimer}</p>
          <p className="font-body text-sm text-charcoal/70 leading-relaxed">
            See the Cancellation &amp; Rescheduling Policy before booking.
          </p>
        </section>
      </main>
    </>
  )
}
