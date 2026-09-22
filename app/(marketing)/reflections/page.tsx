import type { Metadata } from 'next'
import { getPublishedReflections, getNextScheduledReflection, formatNextReflectionDate, REFLECTION_CATEGORIES } from '@/lib/reflections'
import { SITE_URL } from '@/lib/config'
import ReflectionCategoryFilter from './ReflectionCategoryFilter'
import ReflectionsSignupForm from './ReflectionsSignupForm'

// See the equivalent note in app/pt/reflexoes/page.tsx — force-dynamic (rather
// than revalidate) makes sure a scheduled reflection becomes reachable the
// moment its publishDate arrives, without waiting on the next cache cycle.
export const dynamic = 'force-dynamic'

const title = 'S.T.A.B.L.E. Reflections'
const description =
  'Short audio reflections to help you recognize emotional patterns, understand your responses, and make clearer decisions—one reflection at a time.'

// layout.tsx's title.template in this same folder does NOT apply to the
// title defined here — Next.js rule: title.template only affects CHILD
// segments, never the page.js of the segment the layout lives in.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/reflections/` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/reflections/`,
    locale: 'en_US',
    type: 'website',
  },
}

export default function ReflectionsHubPage() {
  const publishedReflections = getPublishedReflections()
  const nextReflection = getNextScheduledReflection()

  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl leading-tight text-charcoal mb-4 max-w-2xl">{title}</h1>
      <p className="font-body text-sm text-charcoal/60 mb-6">
        Reflections by SAL Ray — Emotional &amp; Life Rebuilding Coach — Creator of the S.T.A.B.L.E. Method™
      </p>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-3">{description}</p>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-14">
        New reflections every <span className="text-aqua">Monday</span>, <span className="text-aqua">Wednesday</span>,
        and <span className="text-aqua">Friday</span>.
      </p>

      <div className="max-w-2xl border border-charcoal/15 rounded-lg bg-pale-aqua/40 p-6 mb-14">
        <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Receive New Audio Reflections</p>
        <p className="font-body text-charcoal/80 leading-relaxed mb-5">
          Receive three short audio reflections each week to help you recognize patterns, strengthen your
          boundaries, and respond with greater clarity.
        </p>
        <ReflectionsSignupForm />
      </div>

      {nextReflection && (
        <div className="max-w-2xl border border-charcoal/15 rounded-lg bg-pale-aqua/40 p-6 mb-14">
          <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Next Reflection</p>
          <p className="font-body text-charcoal/80">{formatNextReflectionDate(nextReflection.publishDate)}</p>
        </div>
      )}

      <ReflectionCategoryFilter reflections={publishedReflections} categories={REFLECTION_CATEGORIES} />
    </main>
  )
}
