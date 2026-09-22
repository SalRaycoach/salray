/**
 * DATA SOURCE — "S.T.A.B.L.E. Reflections" (English audio library)
 * ---------------------------------------------------------------------------
 * English counterpart of lib/audios.ts (the Portuguese "Reflexões" library —
 * see that file for the fully-worked reference implementation, including its
 * scheduled-publish mechanism and testing methodology). Same architecture,
 * deliberately duplicated rather than shared, so the two languages can be
 * edited independently without one accidentally affecting the other.
 *
 * Each reflection is one entry in the array below — no admin panel. A
 * reflection with `publishDate` in the future does not appear on the hub or
 * become directly reachable until that date arrives (see isPublished() /
 * getPublishedReflections() below) — this lets several weeks be recorded at
 * once and the site "release" one at a time by itself.
 * ---------------------------------------------------------------------------
 */

export type ReflectionCategory = 'Patterns' | 'Relationships' | 'Clarity' | 'Emotional Stability'

export const REFLECTION_CATEGORIES: ReflectionCategory[] = ['Patterns', 'Relationships', 'Clarity', 'Emotional Stability']

export type Reflection = {
  slug: string
  title: string
  description: string // 2-3 lines
  category: ReflectionCategory
  durationSeconds: number
  audioUrl: string // public link to the file on Cloudflare R2 (english/ subfolder)
  transcript: string // full text — required for SEO
  publishDate: string // ISO 8601 — date this reflection starts appearing on the site
  ogImage?: string // optional — falls back to the generic brand template if absent
  // Manual override for the "Next reflection" teaser on this specific page —
  // use only when the next one in the cadence (e.g. the following Monday)
  // doesn't have a confirmed recording date yet, so it doesn't exist as an
  // entry in `reflections` for getNextScheduledReflection() to find. Free
  // text (e.g. "Monday", no date) — when absent, the teaser is computed
  // automatically from the next scheduled reflection.
  nextReflectionManual?: string
}

export const reflections: Reflection[] = []

export function isPublished(reflection: Reflection, now: Date = new Date()): boolean {
  return new Date(reflection.publishDate).getTime() <= now.getTime()
}

/** Already published, most recent first. Never includes a future `publishDate`. */
export function getPublishedReflections(now: Date = new Date()): Reflection[] {
  return reflections
    .filter((r) => isPublished(r, now))
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
}

/** Returns undefined if the slug doesn't exist OR hasn't been published yet — never leaks a scheduled reflection. */
export function getPublishedReflectionBySlug(slug: string, now: Date = new Date()): Reflection | undefined {
  return getPublishedReflections(now).find((r) => r.slug === slug)
}

export function getRelatedReflections(reflection: Reflection, limit = 3, now: Date = new Date()): Reflection[] {
  return getPublishedReflections(now)
    .filter((r) => r.slug !== reflection.slug && r.category === reflection.category)
    .slice(0, limit)
}

/**
 * "Next reflection" teaser — computed from the data, not a fixed string on
 * any one page, so it works automatically for any future reflection: as soon
 * as the next one in line publishes, the teaser disappears from wherever it
 * showed and points to the following one, if any.
 */
export function getNextScheduledReflection(now: Date = new Date()): Reflection | undefined {
  return reflections
    .filter((r) => !isPublished(r, now))
    .sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())[0]
}

/**
 * "Wednesday, September 23" — weekday and date only, never title or category
 * (the teaser must never reveal what the reflection is about). timeZone
 * fixed to match the -05:00 offset used across every publishDate on this
 * site — without it, a server running in a different time zone could round
 * to the wrong day near midnight.
 */
export function formatNextReflectionDate(publishDate: string): string {
  const date = new Date(publishDate)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Bogota',
  }).format(date)
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return `${minutes}:${String(remaining).padStart(2, '0')}`
}
