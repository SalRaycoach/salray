'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Reflection, ReflectionCategory } from '@/lib/reflections'
import { formatDuration } from '@/lib/reflections'
import { trackEvent } from '@/lib/analytics'

/**
 * Simple category filter — English counterpart of app/pt/reflexoes/CategoryFilter.tsx.
 * Client-side filtering: with a low initial volume (3 reflections/week),
 * separate category routes aren't worth the added complexity.
 */
export default function ReflectionCategoryFilter({
  reflections,
  categories,
}: {
  reflections: Reflection[]
  categories: ReflectionCategory[]
}) {
  const [activeCategory, setActiveCategory] = useState<ReflectionCategory | 'all'>('all')
  const filtered = activeCategory === 'all' ? reflections : reflections.filter((r) => r.category === activeCategory)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          aria-pressed={activeCategory === 'all'}
          className={`font-body text-sm px-4 py-2 rounded-full border transition-colors ${
            activeCategory === 'all'
              ? 'bg-orange text-charcoal border-orange'
              : 'border-charcoal/20 text-charcoal/70 hover:border-orange hover:text-orange'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            className={`font-body text-sm px-4 py-2 rounded-full border transition-colors ${
              activeCategory === cat
                ? 'bg-orange text-charcoal border-orange'
                : 'border-charcoal/20 text-charcoal/70 hover:border-orange hover:text-orange'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="font-body text-charcoal/60">No reflections in this category yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((reflection) => (
            <Link
              key={reflection.slug}
              href={`/reflections/${reflection.slug}/`}
              onClick={() => trackEvent('related_audio_click', { audio_slug: reflection.slug, source: 'hub' })}
              className="block border border-charcoal/10 rounded-lg p-6 hover:border-orange transition-colors"
            >
              <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{reflection.category}</p>
              <h3 className="font-display text-xl text-charcoal mb-2">{reflection.title}</h3>
              <p className="font-body text-sm text-charcoal/70 leading-relaxed mb-4">{reflection.description}</p>
              <p className="font-body text-xs text-charcoal/50">{formatDuration(reflection.durationSeconds)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
