'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Article, Cluster } from '@/lib/resources'

export default function ResourceSearch({ articles, clusters }: { articles: Article[]; clusters: Cluster[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.keyword.toLowerCase().includes(query.toLowerCase())
      )
    : articles

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search resources…"
        aria-label="Search resources"
        className="w-full max-w-md border border-charcoal/20 bg-offwhite px-4 py-3 rounded-md font-body text-charcoal focus:outline-none focus:border-aqua mb-10"
      />

      <div className="grid md:grid-cols-3 gap-8">
        {filtered.map((article) => {
          const cluster = clusters.find((c) => c.slug === article.cluster)
          return (
            <Link
              key={article.slug}
              href={`/resources/${article.cluster}/${article.slug}/`}
              data-event="resource_article_view"
              className="group"
            >
              <span className="font-body text-xs uppercase tracking-wide text-aqua">{cluster?.name}</span>
              <h3 className="font-display text-xl text-charcoal mt-2 mb-2 group-hover:text-orange transition-colors">
                {article.title}
              </h3>
              <p className="font-body text-sm text-charcoal/70 leading-relaxed">{article.excerpt}</p>
            </Link>
          )
        })}
        {filtered.length === 0 && (
          <p className="font-body text-charcoal/60 col-span-full">No resources match your search yet.</p>
        )}
      </div>
    </div>
  )
}
