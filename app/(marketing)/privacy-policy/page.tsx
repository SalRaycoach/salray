import type { Metadata } from 'next'
import { contato, SITE_URL } from '@/lib/config'

const title = 'Privacy Policy'
const description = 'How SAL Ray collects, uses, and protects your personal information.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/privacy-policy/` },
  openGraph: {
    title: `${title} | SAL Ray`,
    description,
    url: `${SITE_URL}/privacy-policy/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-2">Privacy Policy</h1>
      <p className="font-body text-sm text-charcoal/50 mb-8">Last updated: September 14, 2026</p>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <p>
          SAL Ray Coaching LLC (&quot;SAL Ray,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the
          website salraycoach.com (the &quot;Site&quot;) and provides non-clinical coaching and personal development
          services. This Privacy Policy describes our practices regarding the information we collect and how we use
          it. <strong>By using this Site, you acknowledge the practices described in this Privacy Policy.</strong>{' '}
          This Privacy Policy is a description of our practices, not a contract of consent; where your consent is
          legally required for a specific use of your information, we will request it separately.
        </p>

        <h2 className="font-display text-2xl text-charcoal">1. Information We Collect</h2>

        <h3 className="font-display text-xl text-charcoal">1.1 Information Collected From Applicants</h3>
        <p>
          When you submit an application (such as the 4-Week Experience application form), we may collect:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>First name</li>
          <li>Email address</li>
          <li>Mobile phone number</li>
          <li>State of residence</li>
          <li>Your response to a multiple-choice question about the area you would like to work on</li>
          <li>Your response to whether you can commit to weekly sessions and begin within 14 days</li>
        </ul>
        <p>
          We collect your mobile phone number solely to reach you as a backup in case our email does not reach your
          inbox (for example, if it is filtered as spam). We do not use your phone number for ongoing SMS marketing.
        </p>

        <h3 className="font-display text-xl text-charcoal">1.2 Information Collected From Paying Clients</h3>
        <p>If you become a paying client, we may additionally collect and retain:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Program or session agreements you have signed or accepted</li>
          <li>Scheduling and appointment information</li>
          <li>Email and other communications related to your coaching relationship</li>
          <li>Records of sessions attended, rescheduled, or missed, for billing and program-administration purposes</li>
        </ul>
        <p>
          We retain this information for as long as necessary to provide services, administer your program, and meet
          our legal, tax, and accounting obligations.
        </p>

        <h3 className="font-display text-xl text-charcoal">1.3 Information Collected Automatically</h3>
        <p>
          Like most websites, we use analytics and advertising technologies that may automatically collect
          information about your visit, including:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Google Analytics 4 (GA4):</strong> used on most pages of the Site to understand how visitors use
            the Site. GA4 is not used on the /4-week-experience/ page.
          </li>
          <li>
            <strong>Meta Pixel and Meta Conversions API:</strong> used to measure the effectiveness of our
            advertising and to understand which pages lead to an application.
          </li>
        </ul>
        <p>
          When you submit an application, information such as your email address and phone number may be shared with
          Meta through Meta&apos;s Conversions API, configured through Meta&apos;s own Events Manager tools.
          Meta&apos;s standard tools apply one-way hashing (a form of encryption) to this information before it is
          used for advertising measurement and matching, so Meta does not receive your email address or phone number
          in readable form.
        </p>
        <p>
          These tools may use cookies or similar technologies. You can control cookies through your browser
          settings, though disabling them may affect how the Site functions.
        </p>

        <h3 className="font-display text-xl text-charcoal">1.4 Self-Assessment Tool</h3>
        <p>
          If you use the self-assessment tool associated with the Vivências de Reconstrução Emocional program, your
          answers are stored only in your own browser&apos;s local storage (localStorage). This information is never
          transmitted to or stored on our servers, and we do not have access to it.
        </p>

        <h2 className="font-display text-2xl text-charcoal">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Review and respond to applications for coaching programs and experiences</li>
          <li>Contact you about your application by email, or by text message as a backup if email is undeliverable</li>
          <li>Deliver, schedule, and administer paid coaching services</li>
          <li>Understand how visitors use the Site and improve its content and performance</li>
          <li>Measure the effectiveness of our advertising</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>

        <h2 className="font-display text-2xl text-charcoal">3. How We Share Information</h2>
        <p>We may share information with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Service providers</strong> who help us operate the Site and deliver our services (such as our
            email provider, hosting provider, and payment processor for paid programs)
          </li>
          <li>
            <strong>Google and Meta</strong>, through the analytics and advertising tools described above, subject to
            their own privacy policies
          </li>
          <li>
            <strong>Legal authorities</strong>, if required by law or to protect our rights, safety, or the safety of
            others
          </li>
        </ul>

        <h2 className="font-display text-2xl text-charcoal">4. Payment Information</h2>
        <p>
          Paid programs and experiences are processed through third-party payment providers (such as Payhip and
          Stripe). We do not directly collect or store your full payment card information. Please refer to the
          privacy policies of these providers for details on how they handle your payment data.
        </p>

        <h2 className="font-display text-2xl text-charcoal">5. Data Security</h2>
        <p>
          We use reasonable administrative and technical measures designed to protect the personal information we
          hold, including restricting access to personal information to those who need it to perform their role, and
          using reputable third-party providers for hosting, email, and payment processing. No method of transmission
          or storage is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="font-display text-2xl text-charcoal">6. Data Retention</h2>
        <p>
          We retain application and contact information for as long as reasonably necessary to respond to your
          application, provide services, and comply with legal, accounting, or reporting obligations.
        </p>

        <h2 className="font-display text-2xl text-charcoal">7. Your Choices and Rights</h2>
        <p>You may:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Ask us to correct or delete the personal information we hold about you</li>
          <li>Opt out of future email communication by contacting us</li>
          <li>Contact us with any questions about this policy or your information</li>
        </ul>
        <p>
          Depending on your state of residence, you may have additional rights under applicable state privacy laws.
          To exercise any rights, contact us using the details below.
        </p>

        <h2 className="font-display text-2xl text-charcoal">8. Children&apos;s Privacy</h2>
        <p>
          Our services are intended for adults 18 years of age or older. We do not knowingly collect personal
          information from anyone under 18.
        </p>

        <h2 className="font-display text-2xl text-charcoal">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of this
          page reflects the most recent revision.
        </p>

        <h2 className="font-display text-2xl text-charcoal">10. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, contact us at:</p>
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
