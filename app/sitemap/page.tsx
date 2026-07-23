import type { Metadata } from 'next'
import Link from 'next/link'
import SchemaOrg from '@/components/SchemaOrg'
import { getSitemapPageSchema } from '@/lib/schema'
import { SITE_URL } from '@/lib/config'
import { clusters, getArticlesByCluster } from '@/lib/resources'

const title = 'Sitemap | Sal Ray'
const description = 'A complete, human-readable map of every page and article on the Sal Ray website.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/sitemap/` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/sitemap/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

const mainPages = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About Sal' },
  { href: '/how-i-help/', label: 'How I Help' },
  { href: '/stable-method/', label: 'The S.T.A.B.L.E. Method' },
  { href: '/consultation/', label: 'Initial Consultation' },
  { href: '/community/', label: 'Private Facebook Community' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/contact/', label: 'Contact' },
]

const legalPages = [
  { href: '/privacy-policy/', label: 'Privacy Policy' },
  { href: '/terms/', label: 'Terms of Use' },
  { href: '/disclaimer/', label: 'Professional Disclaimer' },
  { href: '/cancellation-policy/', label: 'Cancellation & Rescheduling Policy' },
]

export default function SitemapPage() {
  const schemaItems = [
    ...mainPages,
    { href: '/resources/', label: 'Resources' },
    ...clusters.map((c) => ({ href: `/resources/${c.slug}/`, label: c.name })),
    ...clusters.flatMap((c) =>
      getArticlesByCluster(c.slug).map((a) => ({ href: `/resources/${a.cluster}/${a.slug}/`, label: a.title }))
    ),
    ...legalPages,
  ]
  const schema = getSitemapPageSchema(schemaItems.map((i) => ({ name: i.label, url: i.href })))

  return (
    <>
      <SchemaOrg data={schema} />
      <main className="max-w-content mx-auto px-6 py-16 md:py-24">
        <h1 className="font-display text-4xl text-charcoal mb-4">Sitemap</h1>
        <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-12">
          A complete map of every page on this site, organized by topic.
        </p>

        <nav aria-label="Site pages">
          <section className="mb-12">
            <h2 className="font-display text-2xl text-charcoal mb-4">Main Pages</h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 font-body text-charcoal/85">
              {mainPages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="hover:text-orange underline underline-offset-2">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-charcoal mb-6">Resource Library</h2>
            <Link href="/resources/" className="inline-block font-body text-sm text-aqua underline underline-offset-2 mb-8">
              Browse all resources
            </Link>

            {clusters.map((cluster) => {
              const clusterArticles = getArticlesByCluster(cluster.slug)
              return (
                <div key={cluster.slug} className="mb-8">
                  <h3 className="font-display text-xl text-charcoal mb-3">
                    <Link href={`/resources/${cluster.slug}/`} className="hover:text-orange underline underline-offset-2">
                      {cluster.name}
                    </Link>
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 font-body text-sm text-charcoal/80">
                    {clusterArticles.map((article) => (
                      <li key={article.slug}>
                        <Link
                          href={`/resources/${article.cluster}/${article.slug}/`}
                          className="hover:text-orange underline underline-offset-2"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </section>

          <section>
            <h2 className="font-display text-2xl text-charcoal mb-4">Legal</h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 font-body text-charcoal/85">
              {legalPages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="hover:text-orange underline underline-offset-2">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </nav>
      </main>
    </>
  )
}
