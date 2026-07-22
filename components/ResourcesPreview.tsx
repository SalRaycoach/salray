import Link from 'next/link'
import { articles, clusters } from '@/lib/resources'
import { ctas } from '@/lib/config'

export default function ResourcesPreview() {
  const featured = articles.slice(0, 3)

  return (
    <section className="border-b border-charcoal/10">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-12 max-w-xl">
          Clarity begins when the pattern becomes visible.
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featured.map((article) => {
            const cluster = clusters.find((c) => c.slug === article.cluster)
            return (
              <Link key={article.slug} href={`/resources/${article.cluster}/${article.slug}/`} className="group">
                <span className="font-body text-xs uppercase tracking-wide text-aqua">{cluster?.name}</span>
                <h3 className="font-display text-xl text-charcoal mt-2 mb-2 group-hover:text-orange transition-colors">
                  {article.title}
                </h3>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed">{article.excerpt}</p>
              </Link>
            )
          })}
        </div>

        <Link
          href="/resources/"
          className="inline-block font-body text-sm font-medium bg-charcoal text-offwhite px-6 py-3.5 rounded-md hover:bg-aqua transition-colors"
        >
          {ctas.tertiary}
        </Link>
      </div>
    </section>
  )
}
