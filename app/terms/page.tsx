import type { Metadata } from 'next'
import { business, SITE_URL } from '@/lib/config'

const title = 'Terms of Use | Sal Ray'
const description = 'Terms of use for salraycoach.com and coaching services provided by Sal Ray.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/terms/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function TermsPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <div className="bg-pale-orange border border-orange/40 rounded-lg p-4 mb-10 max-w-2xl">
        <p className="font-body text-xs text-charcoal/70 leading-relaxed">
          <strong>Draft — pending attorney review.</strong> The legal business name and jurisdiction must be
          confirmed and this page reviewed by an attorney before publication.
        </p>
      </div>

      <h1 className="font-display text-4xl text-charcoal mb-8">Terms of Use</h1>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <p>
          By using salraycoach.com and booking services with {business.nome} ("we", "us"), you agree to these
          terms.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Nature of Services</h2>
        <p>
          {business.nome} provides non-clinical coaching and personal development services. These services do not
          constitute medical or psychological treatment. See the Professional Disclaimer for full detail.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Payment</h2>
        <p>
          Consultation and program fees are payable in advance through the booking platform. [Confirm final payment
          processor and terms once selected.]
        </p>

        <h2 className="font-display text-2xl text-charcoal">Cancellation</h2>
        <p>
          See the Cancellation &amp; Rescheduling Policy for details on rescheduling and refund eligibility.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Intellectual Property</h2>
        <p>
          The S.T.A.B.L.E. Method and all site content are the property of {business.nome} and may not be
          reproduced without permission.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Limitation of Liability</h2>
        <p>
          Services are provided "as is" without guarantee of specific outcomes. [Final liability language pending
          attorney review.]
        </p>
      </section>
    </main>
  )
}
