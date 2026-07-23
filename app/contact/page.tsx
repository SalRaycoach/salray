import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import { contato, crisisResource, SITE_URL } from '@/lib/config'

const title = 'Contact | Sal Ray'
const description = 'Send a message to Sal Ray. Non-emergency inquiries only — typical response time is 1–2 business days.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/contact/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function ContactPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-4">Contact</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-xl mb-12">
        Send a message using the form below, or reach out directly by email. Typical response time is 1–2 business
        days.
      </p>

      <div className="grid md:grid-cols-2 gap-16">
        <ContactForm />

        <div>
          <h2 className="font-display text-2xl text-charcoal mb-4">Other Ways to Reach Out</h2>
          <p className="font-body text-sm text-charcoal/70 mb-2">
            Email:{' '}
            <a href={`mailto:${contato.email}`} className="text-aqua">
              {contato.email}
            </a>
          </p>
          <p className="font-body text-sm text-charcoal/70 mb-8">
            Facebook:{' '}
            <a href={contato.facebookProfileUrl} target="_blank" rel="noopener noreferrer" className="text-aqua">
              Message Sal directly
            </a>
          </p>

          <div className="bg-pale-aqua rounded-lg p-6 mb-6">
            <p className="font-body text-sm text-charcoal/80 leading-relaxed">{crisisResource}</p>
          </div>

          <p className="font-body text-sm text-charcoal/70">
            Ready to schedule directly?{' '}
            <Link href="/consultation/" className="text-aqua underline underline-offset-2">
              Book your initial consultation
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  )
}
