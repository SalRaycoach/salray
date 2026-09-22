import type { Metadata } from 'next'
import Link from 'next/link'
import { contato, SITE_URL } from '@/lib/config'

const title = 'Cancellation & Rescheduling Policy'
const description = 'Cancellation and rescheduling policy for consultations and sessions with SAL Ray.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/cancellation-policy/` },
  openGraph: {
    title: `${title} | SAL Ray`,
    description,
    url: `${SITE_URL}/cancellation-policy/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function CancellationPolicyPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-2">Cancellation &amp; Rescheduling Policy</h1>
      <p className="font-body text-sm text-charcoal/50 mb-8">Last updated: September 14, 2026</p>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <p>
          This policy applies to all private, live coaching sessions with SAL Ray, including the initial
          consultation, individual sessions, session packages, and the 4-Week Experience.
        </p>
        <p>
          It does not apply to digital audio products (such as Primeiro Passo S.T.A.B.L.E.™ and Vivências de
          Reconstrução Emocional, if delivered as pre-recorded digital content rather than live sessions). Digital
          products are covered by a separate{' '}
          <Link href="/digital-product-terms/" className="text-aqua underline underline-offset-2">
            Digital Product Policy
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-charcoal">1. Scheduling</h2>
        <p>
          All sessions are conducted privately, online. Clients are responsible for joining each session on time,
          from a quiet, private location with reliable internet access.
        </p>

        <h2 className="font-display text-2xl text-charcoal">2. Rescheduling — 24-Hour Notice Required</h2>
        <p>
          Rescheduling a session requires at least <strong>24 hours&apos; notice</strong>. This is not a courtesy —
          it is a requirement to reschedule without losing the session.
        </p>

        <h2 className="font-display text-2xl text-charcoal">3. Late Cancellations and No-Shows Count as a Used Session</h2>
        <p>
          For paid services, cancellation with less than 24 hours&apos; notice, or failure to attend, counts as a
          used session. No refund or replacement session will be provided, except at SAL Ray&apos;s sole written
          discretion.
        </p>

        <h2 className="font-display text-2xl text-charcoal">4. Late Arrival</h2>
        <p>
          Arriving more than <strong>15 minutes late</strong> to a scheduled session also counts as a used session.
        </p>

        <h2 className="font-display text-2xl text-charcoal">5. Cancellation by SAL Ray</h2>
        <p>
          If SAL Ray needs to cancel or is unable to attend a scheduled session, that session will not be counted as
          used and will be rescheduled at no additional cost.
        </p>

        <h2 className="font-display text-2xl text-charcoal">6. Refunds for Paid Live Sessions</h2>
        <p>
          Paid live coaching (individual sessions, session packages, and the live portion of any program) is
          non-refundable, except where required by applicable law.
        </p>

        <h2 className="font-display text-2xl text-charcoal">7. Four-Week and Multi-Session Programs</h2>
        <p>
          Because each session in a structured program (such as the 4-Week Experience) builds on the one before it,
          consistent attendance matters. Participants are expected to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Schedule all sessions in advance where applicable</li>
          <li>Attend each session as scheduled, on time</li>
          <li>Provide at least 24 hours&apos; notice if a schedule change is unavoidable</li>
        </ul>
        <p>
          Late cancellations and no-shows are governed by Sections 2–4 above and may affect continued participation
          in the program.
        </p>

        <h2 className="font-display text-2xl text-charcoal">8. Free Programs (4-Week Experience)</h2>
        <p>
          The 4-Week Experience is offered at no cost to selected participants. Because places are limited,
          participants who do not attend scheduled sessions or who repeatedly cancel with short notice may have their
          place in the program ended to make room for another applicant.
        </p>

        <h2 className="font-display text-2xl text-charcoal">9. Contact Us</h2>
        <p>To reschedule a session or ask a question about this policy, contact us at:</p>
        <p>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${contato.email}`} className="text-aqua underline underline-offset-2">
            {contato.email}
          </a>
          <br />
          <strong>Business:</strong> SAL Ray Coaching LLC
        </p>
      </section>
    </main>
  )
}
