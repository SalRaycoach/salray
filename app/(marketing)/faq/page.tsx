import type { Metadata } from 'next'
import Link from 'next/link'
import SchemaOrg from '@/components/SchemaOrg'
import FAQAccordion from '@/components/FAQAccordion'
import { getFaqPageSchema } from '@/lib/schema'
import { faqs, ctas, crisisResource, SITE_URL } from '@/lib/config'

const title = 'FAQ'
const description =
  'Answers about Emotional & Life Rebuilding coaching, the S.T.A.B.L.E. Method, pricing, cancellation, and the difference between coaching and therapy.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/faq/` },
  openGraph: {
    title: `${title} | SAL Ray`,
    description,
    url: `${SITE_URL}/faq/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function FaqPage() {
  const schema = getFaqPageSchema()

  return (
    <>
      <SchemaOrg data={schema} />
      <main className="max-w-content mx-auto px-6 py-16 md:py-24">
        <h1 className="font-display text-4xl text-charcoal mb-10">Frequently Asked Questions</h1>

        <FAQAccordion items={faqs} />

        <div className="mt-10 bg-pale-aqua rounded-lg p-6 max-w-2xl">
          <p className="font-body text-sm text-charcoal/80 leading-relaxed">{crisisResource}</p>
        </div>

        <Link
          href="/book-a-session/"
          data-event="book_session_cta_click"
          className="inline-block mt-10 font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          {ctas.primary}
        </Link>
      </main>
    </>
  )
}
