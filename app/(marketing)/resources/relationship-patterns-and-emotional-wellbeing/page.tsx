import type { Metadata } from 'next'
import { OG_IMAGES, TWITTER_CARD } from '@/lib/og'
import Link from 'next/link'
import SchemaOrg from '@/components/SchemaOrg'
import { articles } from '@/lib/resources'
import { buildBreadcrumbList } from '@/lib/schema'
import { business, SITE_URL } from '@/lib/config'

const title = 'Relationship Patterns and Emotional Wellbeing'
const description =
  'A guide to articles on recurring relationship patterns, strong emotions, attachment, boundaries, needs, self-worth, and practicing change.'
const path = '/resources/relationship-patterns-and-emotional-wellbeing/'
const published = '2026-10-11T12:40:00-05:00'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}${path}` },
  twitter: TWITTER_CARD,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}${path}`,
    type: 'article',
    publishedTime: published,
    modifiedTime: published,
    images: OG_IMAGES,
  },
  robots: 'index, follow',
}

// Texto de abertura: página 1 do PDF 01_Relationship_Articles_English.pdf.
const intro = ["These articles are for women who want to understand recurring relationship difficulties and make more thoughtful choices. Each pillar explores a central theme. Its companion offers a smaller, practical place to begin. You can read the collection in order or start with the situation that feels most familiar.","The exercises are invitations, not tests. Adapt them to your circumstances, and leave anything that does not help. Educational articles can support reflection; they cannot assess your individual situation or replace mental health care. If a relationship involves fear, threats, coercion, or violence, individual safety support takes priority over communication exercises."]
const usingHeading = "Using this collection"
const usingText = "Each numbered pair contains a broad guide and a practical companion. Use the article guide or the related reading links to move between them. Sources for further reading appear at the end of each article."

// Os 10 grupos da página 2 do PDF. O grupo 6 mostra o artigo já existente de limites como pilar;
// o grupo 8 mostra só o complementar.
const groups: { n: number; title: string; pillar?: string; companion: string }[] = [
  { n: 1, title: "Recognizing recurring patterns", pillar: "why-you-keep-repeating-the-same-relationship-pattern", companion: "a-simple-relationship-pattern-map" },
  { n: 2, title: "Working with intense emotions", pillar: "emotional-regulation-when-relationship-feelings-become-overwhelming", companion: "a-five-minute-pause-before-you-respond" },
  { n: 3, title: "Understanding attachment", pillar: "understanding-attachment-without-turning-it-into-a-label", companion: "when-your-partner-needs-space-and-you-feel-anxious" },
  { n: 4, title: "Choosing emotionally available partners", pillar: "choosing-partners-who-can-meet-you-emotionally", companion: "chemistry-and-consistency-in-early-dating" },
  { n: 5, title: "Keeping your own identity", pillar: "how-to-stay-connected-to-yourself-in-a-relationship", companion: "a-week-of-small-ways-to-reconnect-with-yourself" },
  { n: 6, title: "Setting boundaries", pillar: "how-to-set-emotional-boundaries-without-guilt", companion: "simple-words-for-saying-no-without-overexplaining" },
  { n: 7, title: "Expressing needs and repairing conflict", pillar: "expressing-your-needs-without-anger-or-shutting-down", companion: "repairing-a-conversation-after-an-argument" },
  { n: 8, title: "Exploring family influences", companion: "reflecting-on-relationships-without-spiraling-into-self-blame" },
  { n: 9, title: "Rebuilding self-worth and self-trust", pillar: "rebuilding-your-self-worth-after-painful-relationships", companion: "rebuilding-self-trust-through-small-decisions" },
  { n: 10, title: "Practicing change", pillar: "turning-relationship-awareness-into-lasting-change", companion: "a-gentle-thirty-day-plan-for-practicing-new-relationship-habits" },
]

function articleLink(slug: string) {
  const a = articles.find((x) => x.slug === slug)
  if (!a) throw new Error(`Guide page: unknown article slug ${slug}`)
  return { href: `/resources/${a.cluster}/${a.slug}/`, title: a.title }
}

export default function RelationshipPatternsGuidePage() {
  const itemList = groups.flatMap((g) => [g.pillar, g.companion].filter((s): s is string => Boolean(s)))
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        author: { '@type': 'Person', name: business.nome, url: `${SITE_URL}/about/` },
        publisher: {
          '@type': 'Organization',
          name: business.nome,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/og/og-default.jpg` },
        },
        datePublished: published,
        dateModified: published,
        image: `${SITE_URL}/images/og/og-default.jpg`,
        mainEntityOfPage: `${SITE_URL}${path}`,
        inLanguage: 'en-US',
      },
      {
        '@type': 'ItemList',
        itemListElement: itemList.map((slug, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: articleLink(slug).title,
          url: `${SITE_URL}${articleLink(slug).href}`,
        })),
      },
      buildBreadcrumbList([
        { name: 'Home', url: '/' },
        { name: 'Resources', url: '/resources/' },
        { name: title, url: path },
      ]),
    ],
  }

  return (
    <>
      <SchemaOrg data={schema} />
      <main className="max-w-content mx-auto px-6 py-16 md:py-24">
        <nav className="font-body text-xs text-charcoal/50 mb-8">
          <Link href="/" className="hover:text-aqua">
            Home
          </Link>{' '}
          /{' '}
          <Link href="/resources/" className="hover:text-aqua">
            Resources
          </Link>{' '}
          / {title}
        </nav>

        <h1 className="font-display text-4xl text-charcoal mb-6 max-w-3xl">{title}</h1>

        <div className="max-w-2xl">
          {intro.map((p) => (
            <p key={p} className="text-charcoal/85 leading-relaxed mb-5">
              {p}
            </p>
          ))}
          <h2 className="font-display text-3xl text-charcoal mt-10 mb-4">{usingHeading}</h2>
          <p className="text-charcoal/85 leading-relaxed mb-5">{usingText}</p>

          <h2 className="font-display text-3xl text-charcoal mt-10 mb-6">Article guide</h2>
          <ol className="space-y-8">
            {groups.map((g) => (
              <li key={g.n}>
                <h3 className="font-display text-xl text-charcoal mb-3">
                  {g.n} {g.title}
                </h3>
                <ul className="space-y-2 font-body text-charcoal/85">
                  {g.pillar && (
                    <li>
                      <span className="text-xs uppercase tracking-widest text-aqua mr-2">Pillar</span>
                      <Link href={articleLink(g.pillar).href} className="text-aqua underline underline-offset-2 hover:text-orange">
                        {articleLink(g.pillar).title}
                      </Link>
                    </li>
                  )}
                  <li>
                    <span className="text-xs uppercase tracking-widest text-aqua mr-2">Companion</span>
                    <Link href={articleLink(g.companion).href} className="text-aqua underline underline-offset-2 hover:text-orange">
                      {articleLink(g.companion).title}
                    </Link>
                  </li>
                </ul>
              </li>
            ))}
          </ol>

          <p className="mt-12 mb-5">
            <a
              href="/4-week-experience/#application"
              className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-5 py-3 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
            >
              Apply for the 4-Week Experience
            </a>
          </p>
          <p className="text-charcoal/85 leading-relaxed mb-5">
            This article is educational and reflects a non-clinical coaching perspective. SAL Ray is not a therapist,
            psychologist, or medical provider, and this content does not diagnose or treat any condition.
          </p>
        </div>

        <div className="max-w-2xl mt-12 pt-8 border-t border-charcoal/10">
          <p className="font-body text-sm text-charcoal/60 leading-relaxed">
            Written by SAL Ray, Emotional & Life Rebuilding Coach. This article is educational and does not diagnose
            or treat mental health conditions. See the{' '}
            <Link href="/disclaimer/" className="text-aqua underline underline-offset-2">
              Professional Disclaimer
            </Link>
            .
          </p>
        </div>
      </main>
    </>
  )
}
