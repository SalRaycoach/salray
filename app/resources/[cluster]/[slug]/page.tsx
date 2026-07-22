import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SchemaOrg from '@/components/SchemaOrg'
import { articles, clusters } from '@/lib/resources'
import { getArticleSchema } from '@/lib/schema'
import { markdownToHtml } from '@/lib/mdx'
import { ctas, crisisResource, SITE_URL } from '@/lib/config'

export function generateStaticParams() {
  return articles.map((a) => ({ cluster: a.cluster, slug: a.slug }))
}

export function generateMetadata({ params }: { params: { cluster: string; slug: string } }): Metadata {
  const article = articles.find((a) => a.cluster === params.cluster && a.slug === params.slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${SITE_URL}/resources/${article.cluster}/${article.slug}/`,
      type: 'article',
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      images: [{ url: `${SITE_URL}${article.ogImage}`, width: 1200, height: 630, alt: article.title }],
    },
    robots: 'index, follow',
  }
}

export default function ArticlePage({ params }: { params: { cluster: string; slug: string } }) {
  const article = articles.find((a) => a.cluster === params.cluster && a.slug === params.slug)
  if (!article) notFound()

  const cluster = clusters.find((c) => c.slug === article.cluster)
  const schema = getArticleSchema(article, cluster?.name ?? article.cluster)
  const html = markdownToHtml(
    article.content.replaceAll('(#consultation)', '(/consultation/)').replaceAll('(#community)', '(/community/)')
  )
  const related = articles.filter((a) => article.relatedArticles.includes(a.slug))

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
          /{' '}
          <Link href={`/resources/${article.cluster}/`} className="hover:text-aqua">
            {cluster?.name}
          </Link>{' '}
          / {article.title}
        </nav>

        <span className="font-body text-xs uppercase tracking-widest text-aqua">
          Published {new Date(article.datePublished).toLocaleDateString('en-US')}
        </span>
        <h1 className="font-display text-4xl text-charcoal mt-2 mb-8 max-w-3xl">{article.title}</h1>

        <article className="max-w-2xl" dangerouslySetInnerHTML={{ __html: html }} />

        {article.needsProfessionalCareNote && (
          <div className="max-w-2xl mt-4 bg-pale-aqua rounded-lg p-6">
            <p className="font-body text-sm text-charcoal/80 leading-relaxed">{crisisResource}</p>
          </div>
        )}

        <div className="max-w-2xl mt-12 border border-charcoal/10 rounded-lg p-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-body text-charcoal/80">Ready to work on this directly?</p>
          <div className="flex gap-3">
            <Link
              href="/consultation/"
              data-event="consultation_cta_click"
              className="font-body text-xs font-medium bg-orange text-charcoal px-5 py-3 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors shrink-0"
            >
              {ctas.primary}
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div className="max-w-2xl mt-12">
            <h2 className="font-body text-xs uppercase tracking-widest text-aqua mb-4">Related Reading</h2>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/resources/${r.cluster}/${r.slug}/`}
                    className="font-display text-lg text-charcoal hover:text-orange"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="max-w-2xl mt-12 pt-8 border-t border-charcoal/10">
          <p className="font-body text-sm text-charcoal/60 leading-relaxed">
            Written by Sal Ray, Emotional & Life Rebuilding Specialist. This article is educational and does not
            diagnose or treat mental health conditions — see the{' '}
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
