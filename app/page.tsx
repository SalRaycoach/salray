import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/Hero'
import ProblemRecognition from '@/components/ProblemRecognition'
import Transformation from '@/components/Transformation'
import AboutPreview from '@/components/AboutPreview'
import StableMethodPreview from '@/components/StableMethodPreview'
import ProcessTimeline from '@/components/ProcessTimeline'
import HelpAreas from '@/components/HelpAreas'
import ResourcesPreview from '@/components/ResourcesPreview'
import CommunityCTA from '@/components/CommunityCTA'
import Testimonials from '@/components/Testimonials'
import FAQAccordion from '@/components/FAQAccordion'
import FinalCTA from '@/components/FinalCTA'
import SchemaOrg from '@/components/SchemaOrg'
import { getHomeSchema } from '@/lib/schema'
import { faqs, testimonials, SITE_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Emotional & Life Rebuilding Specialist | Sal Ray',
  description:
    'Non-clinical coaching for women 40–60 who feel emotionally overloaded or stuck in repeating patterns. Schedule your initial consultation.',
  openGraph: {
    title: 'Emotional & Life Rebuilding Specialist | Sal Ray',
    description:
      'Non-clinical coaching for women 40–60 who feel emotionally overloaded or stuck in repeating patterns. Schedule your initial consultation.',
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/images/og/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'Sal Ray — Emotional & Life Rebuilding Specialist',
      },
    ],
  },
  robots: 'index, follow',
}

export default function HomePage() {
  const schema = getHomeSchema()

  return (
    <>
      <SchemaOrg data={schema} />
      <main>
        <Hero />
        <ProblemRecognition />
        <Transformation />
        <AboutPreview />
        <StableMethodPreview />
        <ProcessTimeline />
        <HelpAreas />
        <ResourcesPreview />

        {testimonials.length > 0 && (
          <section className="border-b border-charcoal/10">
            <div className="max-w-content mx-auto px-6 py-16 md:py-24">
              <Testimonials items={testimonials} />
            </div>
          </section>
        )}

        <CommunityCTA />

        <section className="border-b border-charcoal/10">
          <div className="max-w-content mx-auto px-6 py-16 md:py-24">
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-10 max-w-xl">
              Questions before you begin?
            </h2>
            <FAQAccordion items={faqs.slice(0, 6)} />
            <Link href="/faq/" className="inline-block mt-8 font-body text-sm font-medium text-aqua hover:text-charcoal">
              View All FAQs →
            </Link>
          </div>
        </section>

        <FinalCTA />
      </main>
    </>
  )
}
