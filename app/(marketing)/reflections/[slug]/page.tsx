import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SchemaOrg from '@/components/SchemaOrg'
import { getReflectionAudioSchema } from '@/lib/schema'
import {
  getPublishedReflectionBySlug,
  getRelatedReflections,
  getNextScheduledReflection,
  formatNextReflectionDate,
  formatDuration,
} from '@/lib/reflections'
import { SITE_URL } from '@/lib/config'
import AudioPlayer from './AudioPlayer'
import ShareButton from './ShareButton'
import ProductCta from './ProductCta'
import TranscriptAccordion from './TranscriptAccordion'

// See the equivalent note in app/pt/reflexoes/[slug]/page.tsx — force-dynamic
// (rather than revalidate) keeps a scheduled reflection reachable the moment
// its publishDate arrives, without waiting on the next cache cycle.
export const dynamic = 'force-dynamic'

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const reflection = getPublishedReflectionBySlug(params.slug)
  if (!reflection) return {}

  const url = `${SITE_URL}/reflections/${reflection.slug}/`
  return {
    title: reflection.title,
    description: reflection.description,
    alternates: { canonical: url },
    openGraph: {
      title: reflection.title,
      description: reflection.description,
      url,
      locale: 'en_US',
      type: 'music.song', // OG has no "audio reflection" type — closer to this than "article"
      images: [{ url: `${SITE_URL}${reflection.ogImage ?? '/images/og/og-default.jpg'}`, width: 1200, height: 630, alt: reflection.title }],
    },
  }
}

export default function ReflectionPage({ params }: { params: { slug: string } }) {
  const reflection = getPublishedReflectionBySlug(params.slug)
  if (!reflection) notFound()

  const related = getRelatedReflections(reflection)
  const pageUrl = `${SITE_URL}/reflections/${reflection.slug}/`
  const schema = getReflectionAudioSchema(reflection)
  const nextReflection = getNextScheduledReflection()
  // nextReflectionManual takes priority — used when the next one in the
  // cadence doesn't have a confirmed recording date yet (see lib/reflections.ts).
  const nextReflectionText = reflection.nextReflectionManual ?? (nextReflection ? formatNextReflectionDate(nextReflection.publishDate) : null)

  return (
    <>
      <SchemaOrg data={schema} />
      <main className="max-w-content mx-auto px-6 py-16 md:py-24">
        <nav className="font-body text-xs text-charcoal/50 mb-8">
          <Link href="/reflections/" className="hover:text-aqua">
            S.T.A.B.L.E. Reflections
          </Link>{' '}
          / {reflection.title}
        </nav>

        <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{reflection.category}</p>
        <h1 className="font-display text-4xl text-charcoal mb-2 max-w-2xl">{reflection.title}</h1>
        <p className="font-body text-sm text-charcoal/50 mb-8">{formatDuration(reflection.durationSeconds)}</p>

        <div className="max-w-2xl mb-6">
          <AudioPlayer slug={reflection.slug} title={reflection.title} src={reflection.audioUrl} durationSeconds={reflection.durationSeconds} />
        </div>

        <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-12">{reflection.description}</p>

        {/* Block order matches the fix applied to /pt/reflexoes/[slug]/ (22
            set 2026): description → "Want to Go Deeper?" → share → next
            reflection, so the product CTA sits right after the description
            without needing to scroll past sharing and the teaser. */}
        <div className="max-w-2xl border border-charcoal/15 rounded-lg p-6 mb-12">
          <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Want to Go Deeper?</p>
          <p className="font-body text-charcoal/80 leading-relaxed mb-4">
            If this reflection helped you recognize a pattern in your own life, a private coaching session can help
            you understand how that pattern is affecting your decisions, relationships, boundaries, and emotional
            stability.
          </p>
          <ProductCta audioSlug={reflection.slug} />
        </div>

        <div className="max-w-2xl mb-12">
          <ShareButton slug={reflection.slug} title={reflection.title} url={pageUrl} />
        </div>

        {nextReflectionText && (
          <div className="max-w-2xl border border-charcoal/15 rounded-lg bg-pale-aqua/40 p-6 mb-12">
            <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Next Reflection</p>
            <p className="font-body text-charcoal/80">{nextReflectionText}</p>
          </div>
        )}

        <TranscriptAccordion transcript={reflection.transcript} />

        {related.length > 0 && (
          <div className="max-w-2xl mb-12">
            <h2 className="font-body text-xs uppercase tracking-widest text-aqua mb-4">Continue Listening</h2>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/reflections/${r.slug}/`}
                    className="font-display text-lg text-charcoal hover:text-orange transition-colors"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  )
}
