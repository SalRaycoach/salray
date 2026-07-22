import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { clusters, getArticlesByCluster } from '@/lib/resources'
import { SITE_URL } from '@/lib/config'

export function generateStaticParams() {
  return clusters.map((c) => ({ cluster: c.slug }))
}

export function generateMetadata({ params }: { params: { cluster: string } }): Metadata {
  const cluster = clusters.find((c) => c.slug === params.cluster)
  if (!cluster) return {}

  const title = `${cluster.name} | Resources | Sal Ray`
  const description = cluster.description.slice(0, 155)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/resources/${cluster.slug}/`,
      images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
    },
    robots: 'index, follow',
  }
}

export default function ClusterPage({ params }: { params: { cluster: string } }) {
  const cluster = clusters.find((c) => c.slug === params.cluster)
  if (!cluster) notFound()

  const clusterArticles = getArticlesByCluster(cluster.slug)

  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <nav className="font-body text-xs text-charcoal/50 mb-8">
        <Link href="/" className="hover:text-aqua">
          Home
        </Link>{' '}
        / <Link href="/resources/" className="hover:text-aqua">Resources</Link> / {cluster.name}
      </nav>

      <h1 className="font-display text-4xl text-charcoal mb-4 max-w-2xl">{cluster.name}</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-12">{cluster.description}</p>

      <div className="grid md:grid-cols-3 gap-8">
        {clusterArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/resources/${cluster.slug}/${article.slug}/`}
            data-event="resource_article_view"
            className="group"
          >
            <h2 className="font-display text-xl text-charcoal mb-2 group-hover:text-orange transition-colors">
              {article.title}
            </h2>
            <p className="font-body text-sm text-charcoal/70 leading-relaxed">{article.excerpt}</p>
          </Link>
        ))}
        {clusterArticles.length === 0 && (
          <p className="font-body text-charcoal/60 col-span-full">Articles for this category are coming soon.</p>
        )}
      </div>
    </main>
  )
}
