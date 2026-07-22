import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config'
import { clusters, articles } from '@/lib/resources'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/about/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/how-i-help/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/stable-method/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/consultation/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/community/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/resources/`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/faq/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/privacy-policy/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/disclaimer/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/cancellation-policy/`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const clusterEntries: MetadataRoute.Sitemap = clusters.map((c) => ({
    url: `${SITE_URL}/resources/${c.slug}/`,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/resources/${a.cluster}/${a.slug}/`,
    changeFrequency: 'monthly',
    priority: 0.7,
    lastModified: a.dateModified,
  }))

  return [...staticEntries, ...clusterEntries, ...articleEntries]
}
