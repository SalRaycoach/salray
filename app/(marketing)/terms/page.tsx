import type { Metadata } from 'next'
import Link from 'next/link'
import { contato, SITE_URL } from '@/lib/config'

const title = 'Terms of Use | SAL Ray'
const description = 'Terms of use for salraycoach.com and coaching services provided by SAL Ray.'

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
      <h1 className="font-display text-4xl text-charcoal mb-2">Terms of Use</h1>
      <p className="font-body text-sm text-charcoal/50 mb-8">Last updated: September 14, 2026</p>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <p>
          These Terms of Use (&quot;Terms&quot;) govern your access to and use of salraycoach.com (the
          &quot;Site&quot;) and the general relationship between you and SAL Ray Coaching LLC (&quot;SAL Ray,&quot;
          &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By using the Site, you agree to these Terms.
        </p>
        <p>
          <strong>These Terms are general and apply to the Site as a whole.</strong> Where you purchase or apply for
          a specific service, program, or product, that service will have its own specific agreement (for example, a
          program agreement for the 4-Week Experience, or{' '}
          <Link href="/digital-product-terms/" className="text-aqua underline underline-offset-2">
            Digital Product Terms
          </Link>{' '}
          for Primeiro Passo S.T.A.B.L.E.™ and Vivências de Reconstrução Emocional).{' '}
          <strong>
            In the event of a conflict, the specific agreement for that service governs, and these Terms apply only
            to the extent they do not conflict with it.
          </strong>
        </p>

        <h2 className="font-display text-2xl text-charcoal">1. Nature of Services</h2>
        <p>
          SAL Ray provides non-clinical coaching and personal development services. These services are educational
          and supportive in nature. They do not diagnose, treat, cure, or prevent any mental-health or medical
          condition, and they are not a substitute for psychotherapy, psychiatry, medical care, or emergency
          services. Please review our{' '}
          <Link href="/disclaimer/" className="text-aqua underline underline-offset-2">
            Professional Disclaimer
          </Link>{' '}
          for more detail.
        </p>

        <h2 className="font-display text-2xl text-charcoal">2. Eligibility</h2>
        <p>
          Our services are intended for adults 18 years of age or older. By applying for or participating in a
          program, you confirm that you are at least 18 years old.
        </p>

        <h2 className="font-display text-2xl text-charcoal">3. Applications and Selection (4-Week Experience and Similar Programs)</h2>
        <p>
          Submitting an application (including for the 4-Week Experience) does not guarantee acceptance or a place
          in any program. Applications are reviewed individually, and SAL Ray reserves the right to accept or decline
          any application at his discretion.
        </p>

        <h2 className="font-display text-2xl text-charcoal">4. Paid Live Coaching</h2>
        <p>
          Individual sessions and session packages are governed by our{' '}
          <Link href="/cancellation-policy/" className="text-aqua underline underline-offset-2">
            Cancellation &amp; Rescheduling Policy
          </Link>
          , which is incorporated into these Terms by reference for that service.
        </p>

        <h2 className="font-display text-2xl text-charcoal">5. Digital Products</h2>
        <p>
          Primeiro Passo S.T.A.B.L.E.™, Vivências de Reconstrução Emocional, and any other pre-recorded digital audio
          programs are governed by their own{' '}
          <Link href="/digital-product-terms/" className="text-aqua underline underline-offset-2">
            Digital Product Terms
          </Link>
          , provided at the time of purchase, which take precedence over this document for those products.
        </p>

        <h2 className="font-display text-2xl text-charcoal">6. No Guarantee of Results</h2>
        <p>
          Coaching outcomes depend on individual effort, circumstances, and participation. We do not guarantee any
          specific result, outcome, or transformation. Testimonials, if shared, reflect individual experiences and
          are not a promise of similar results for any other person.
        </p>

        <h2 className="font-display text-2xl text-charcoal">7. Intellectual Property</h2>
        <p>
          All content on the Site, including but not limited to text, graphics, audio recordings, the S.T.A.B.L.E.™
          Method, and program materials, is the property of SAL Ray Coaching LLC and is protected by applicable
          intellectual property laws. You may not reproduce, distribute, or create derivative works from this content
          without our prior written permission.
        </p>

        <h2 className="font-display text-2xl text-charcoal">8. Confidentiality</h2>
        <p>
          We respect the privacy of anyone who applies for or participates in our programs. A public testimonial is
          never required as a condition of participation. See our{' '}
          <Link href="/privacy-policy/" className="text-aqua underline underline-offset-2">
            Privacy Policy
          </Link>{' '}
          for how we handle personal information.
        </p>

        <h2 className="font-display text-2xl text-charcoal">9. User Conduct</h2>
        <p>When using the Site or interacting with us, you agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide false or misleading information in an application</li>
          <li>Use the Site for any unlawful purpose</li>
          <li>Attempt to interfere with the security or proper functioning of the Site</li>
        </ul>

        <h2 className="font-display text-2xl text-charcoal">10. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, SAL Ray Coaching LLC shall not be liable for any
          indirect, incidental, or consequential damages arising from your use of the Site or participation in our
          programs.{' '}
          <strong>
            Nothing in this section limits or excludes any liability that cannot be limited or excluded under
            applicable law.
          </strong>
        </p>
        <p>
          Our services are not a substitute for emergency, medical, or mental-health care. If you are in crisis or
          experiencing an emergency, contact local emergency services or an appropriate crisis resource immediately.
        </p>

        <h2 className="font-display text-2xl text-charcoal">11. Changes to These Terms</h2>
        <p>
          We may update these general Terms from time to time.{' '}
          <strong>
            Continued use of the Site after a change is posted applies only to your ongoing use of the Site itself
            going forward — it does not retroactively modify any specific program or product agreement you have
            already accepted.
          </strong>{' '}
          Any change to a specific agreement you have already accepted requires your separate consent.
        </p>

        <h2 className="font-display text-2xl text-charcoal">12. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the <strong>State of Florida</strong>, without regard to
          conflict-of-law principles.
        </p>

        <h2 className="font-display text-2xl text-charcoal">13. Contact Us</h2>
        <p>If you have questions about these Terms, contact us at:</p>
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
