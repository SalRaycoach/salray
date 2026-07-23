import type { Metadata } from 'next'
import Link from 'next/link'
import { contato, ctas, SITE_URL } from '@/lib/config'

const title = 'Private Facebook Community | Sal Ray'
const description =
  'Join a private Facebook community focused on emotional strength, clear thinking, and rebuilding life with greater stability.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/community/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function CommunityPage() {
  const isPending = contato.facebookGroupUrl.startsWith('PENDENTE_')

  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-6 max-w-2xl">
        You do not have to figure everything out alone.
      </h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-12">
        Join a private Facebook community focused on emotional strength, clear thinking, and rebuilding life with
        greater stability.
      </p>

      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="font-display text-2xl text-charcoal mb-4">Purpose</h2>
          <p className="font-body text-charcoal/85 leading-relaxed mb-8">
            A supportive space to reflect on emotional patterns, share progress, and stay connected between
            sessions — without pressure or judgment.
          </p>

          <h2 className="font-display text-2xl text-charcoal mb-4">Topics</h2>
          <p className="font-body text-charcoal/85 leading-relaxed mb-8">
            Overthinking, emotional stability, relationship patterns, self-trust, and rebuilding life direction —
            the same themes covered across the Resource Library.
          </p>

          <h2 className="font-display text-2xl text-charcoal mb-4">Who It Is For</h2>
          <p className="font-body text-charcoal/85 leading-relaxed">
            Anyone working on emotional and life rebuilding, whether or not you are currently working with Sal
            directly.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-charcoal mb-4">Community Guidelines</h2>
          <p className="font-body text-charcoal/85 leading-relaxed mb-8">
            Respectful, non-judgmental participation is required. The group is not a space for crisis support,
            clinical advice, or diagnosis — see the Professional Disclaimer for details.
          </p>

          <h2 className="font-display text-2xl text-charcoal mb-4">Privacy</h2>
          <p className="font-body text-charcoal/85 leading-relaxed mb-8">
            The group is private; posts are visible only to members. Members are asked to keep others' shares
            confidential.
          </p>

          <h2 className="font-display text-2xl text-charcoal mb-4">Content Frequency</h2>
          <p className="font-body text-charcoal/85 leading-relaxed">
            New prompts and reflections are shared regularly to support ongoing progress between sessions.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {isPending ? (
          <p className="font-body text-charcoal/60 text-sm">
            Facebook group link pending — check back soon or ask via Facebook/email.
          </p>
        ) : (
          <a
            href={contato.facebookGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-event="community_cta_click"
            className="inline-block font-body text-sm font-medium border border-aqua text-charcoal px-6 py-3 rounded-md hover:bg-aqua transition-colors"
          >
            {ctas.secondary}
          </a>
        )}

        <Link
          href="/consultation/"
          data-event="consultation_cta_click"
          className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          {ctas.primary}
        </Link>
      </div>
    </main>
  )
}
