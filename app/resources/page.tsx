import type { Metadata } from 'next'
import Link from 'next/link'
import ResourceSearch from '@/components/ResourceSearch'
import SchemaOrg from '@/components/SchemaOrg'
import { getResourcesIndexSchema } from '@/lib/schema'
import { articles, clusters } from '@/lib/resources'
import { SITE_URL } from '@/lib/config'

const title = 'Resource Library | Sal Ray'
const description =
  'Articles on overthinking, emotional patterns, relationships, self-trust, life direction, and emotional stability.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/resources/`,
    images: [{ url: `${SITE_URL}/images/og/og-default.jpg`, width: 1200, height: 630, alt: title }],
  },
  robots: 'index, follow',
}

export default function ResourcesPage() {
  const recent = [...articles].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1)).slice(0, 3)
  const schema = getResourcesIndexSchema(clusters)

  return (
    <>
      <SchemaOrg data={schema} />
      <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-4">Resource Library</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-12">
        Practical, non-clinical articles on the patterns that keep people stuck — and what rebuilding can look like.
      </p>

      <section className="mb-12">
        <h2 className="font-body text-xs uppercase tracking-widest text-aqua mb-4">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {clusters.map((cluster) => (
            <Link
              key={cluster.slug}
              href={`/resources/${cluster.slug}/`}
              data-event="resource_category_view"
              className="font-body text-sm border border-charcoal/20 rounded-md px-4 py-2 hover:border-aqua hover:text-aqua transition-colors"
            >
              {cluster.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-body text-xs uppercase tracking-widest text-aqua mb-4">Recently Published</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {recent.map((article) => (
            <Link key={article.slug} href={`/resources/${article.cluster}/${article.slug}/`} className="group">
              <h3 className="font-display text-lg text-charcoal group-hover:text-orange transition-colors">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-body text-xs uppercase tracking-widest text-aqua mb-6">All Resources</h2>
        <ResourceSearch articles={articles} clusters={clusters} />
      </section>
      </main>
    </>
  )
}
