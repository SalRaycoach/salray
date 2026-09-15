import type { Metadata } from 'next'
import Link from 'next/link'
import { contato, SITE_URL } from '@/lib/config'

const title = 'Digital Product Terms | SAL Ray'
const description = 'Terms governing pre-recorded digital audio programs from SAL Ray, including Primeiro Passo S.T.A.B.L.E.™ and Vivências de Reconstrução Emocional.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/digital-product-terms/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function DigitalProductTermsPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-2">Digital Product Terms</h1>
      <p className="font-body text-sm text-charcoal/50 mb-8">Last updated: September 14, 2026</p>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <p>
          These Digital Product Terms apply specifically to pre-recorded digital audio programs offered by SAL Ray
          Coaching LLC, including but not limited to <strong>Primeiro Passo S.T.A.B.L.E.™</strong> and{' '}
          <strong>Vivências de Reconstrução Emocional</strong>. These programs are delivered entirely as digital,
          pre-recorded content — they do not include any live session with SAL Ray.
        </p>
        <p>
          These Digital Product Terms take precedence over the general{' '}
          <Link href="/terms/" className="text-aqua underline underline-offset-2">
            Terms of Use
          </Link>{' '}
          for anything specific to these products. Our general Terms of Use,{' '}
          <Link href="/privacy-policy/" className="text-aqua underline underline-offset-2">
            Privacy Policy
          </Link>
          , and{' '}
          <Link href="/disclaimer/" className="text-aqua underline underline-offset-2">
            Professional Disclaimer
          </Link>{' '}
          continue to apply where they do not conflict with this document.
        </p>

        <h2 className="font-display text-2xl text-charcoal">1. Nature of the Product</h2>
        <p>
          Primeiro Passo S.T.A.B.L.E.™ and Vivências de Reconstrução Emocional are pre-recorded audio programs
          delivered digitally after purchase. They are non-clinical, educational, and reflective in nature. They do
          not include live coaching sessions, scheduled appointments, or direct real-time interaction with SAL Ray,
          unless expressly stated otherwise for a specific product at the time of purchase.
        </p>

        <h2 className="font-display text-2xl text-charcoal">2. Delivery</h2>
        <p>
          Access to the purchased program is provided digitally, typically through a link or access instructions
          sent to the email address provided at checkout. It is your responsibility to provide an accurate, active
          email address at the time of purchase.
        </p>

        <h2 className="font-display text-2xl text-charcoal">3. Self-Assessment Tool</h2>
        <p>
          Vivências de Reconstrução Emocional includes an optional self-assessment tool. Your answers to this tool
          are stored only in your own browser&apos;s local storage (localStorage) and are never transmitted to or
          stored on our servers. If you clear your browser data or switch devices between completing the
          &quot;before&quot; and &quot;after&quot; assessments, your earlier answers may be lost, and we have no way
          to recover them.
        </p>

        <h2 className="font-display text-2xl text-charcoal">4. Refunds</h2>
        <p>
          Because these are digital products delivered immediately upon purchase,{' '}
          <strong>all sales are final and non-refundable</strong>, except where required by applicable law. Please
          review the product description carefully before purchasing.
        </p>

        <h2 className="font-display text-2xl text-charcoal">5. Personal, Non-Transferable Use</h2>
        <p>
          Your purchase grants you a personal, non-transferable license to access and listen to the program for your
          own personal, non-commercial use. You may not share, resell, publicly perform, broadcast, or redistribute
          the audio content or any accompanying materials.
        </p>

        <h2 className="font-display text-2xl text-charcoal">6. Intellectual Property</h2>
        <p>
          All audio content, the S.T.A.B.L.E.™ Method, and any accompanying written materials remain the property of
          SAL Ray Coaching LLC and are protected by applicable intellectual property laws.
        </p>

        <h2 className="font-display text-2xl text-charcoal">7. No Guarantee of Results</h2>
        <p>
          These programs are educational and reflective in nature. We do not guarantee any specific result, outcome,
          or transformation from completing the program. Individual experiences vary.
        </p>

        <h2 className="font-display text-2xl text-charcoal">8. Not a Substitute for Professional Care</h2>
        <p>
          These digital products are not therapy, medical treatment, or crisis support, and are not a substitute for
          professional care. Please review our{' '}
          <Link href="/disclaimer/" className="text-aqua underline underline-offset-2">
            Professional Disclaimer
          </Link>{' '}
          for more detail. If you are in crisis or experiencing an emergency, contact local emergency services or an
          appropriate crisis resource immediately.
        </p>

        <h2 className="font-display text-2xl text-charcoal">9. Technical Requirements</h2>
        <p>
          You are responsible for having a device, internet connection, and audio playback capability sufficient to
          access and listen to the program. We are not responsible for issues arising from your own device or
          connection.
        </p>

        <h2 className="font-display text-2xl text-charcoal">10. Contact Us</h2>
        <p>If you have questions about a digital product or experience a problem accessing your purchase, contact us at:</p>
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
