import type { Metadata } from 'next'
import { contato, SITE_URL } from '@/lib/config'

const title = 'Privacy Policy | Sal Ray'
const description = 'How Sal Ray collects, uses, and protects your personal information.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/privacy-policy/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <div className="bg-pale-orange border border-orange/40 rounded-lg p-4 mb-10 max-w-2xl">
        <p className="font-body text-xs text-charcoal/70 leading-relaxed">
          <strong>Draft — pending attorney review.</strong> This policy must be finalized once the actual booking,
          payment, and analytics tools are confirmed, and reviewed by an attorney before publication.
        </p>
      </div>

      <h1 className="font-display text-4xl text-charcoal mb-8">Privacy Policy</h1>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <p>
          This policy describes how salrayofficial.com ("the site") collects, uses, and protects information you
          provide when you contact us, join the community, or book a consultation.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Information We Collect</h2>
        <p>
          Name, email address, phone number, time zone, and any information you voluntarily share through the
          contact form or booking process. [Update this section once the final booking and payment platform is
          confirmed.]
        </p>

        <h2 className="font-display text-2xl text-charcoal">How We Use Information</h2>
        <p>
          To respond to inquiries, schedule and confirm consultations, and send related communications. We do not
          sell personal information to third parties.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Analytics</h2>
        <p>
          This site may use analytics tools to understand how visitors use the site. [Name the specific analytics
          provider here once selected.]
        </p>

        <h2 className="font-display text-2xl text-charcoal">Contact</h2>
        <p>
          Questions about this policy can be sent to{' '}
          <a href={`mailto:${contato.email}`} className="text-aqua underline underline-offset-2">
            {contato.email}
          </a>
          .
        </p>
      </section>
    </main>
  )
}
