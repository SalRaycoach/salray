import { business, contato, faqs, SITE_URL, DOMINIO } from './config'
import type { Faq } from './config'
import type { Article } from './resources'

type BreadcrumbItem = { name: string; url: string } // url deve iniciar com "/" e terminar com "/"

function withTrailingSlash(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return clean.endsWith('/') ? clean : `${clean}/`
}

function isPending(value: string): boolean {
  return value.startsWith('PENDENTE_')
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${withTrailingSlash(item.url)}`,
    })),
  }
}

function buildFaqPage(items: Faq[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/** Alias nomeado — mesma FAQPage schema usada internamente por getArticleSchema/getHomeSchema. */
export const getFAQSchema = buildFaqPage

/** Alias nomeado — mesma BreadcrumbList schema já exportada como buildBreadcrumbList. */
export const getBreadcrumbSchema = buildBreadcrumbList

function buildPerson() {
  const sameAs = [contato.instagramUrl, contato.facebookProfileUrl, contato.facebookGroupUrl].filter(
    (url) => !isPending(url)
  )

  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: business.nome,
    jobTitle: business.jobTitle,
    url: `${SITE_URL}/about/`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    knowsAbout: [
      'Emotional and life rebuilding',
      'Non-clinical coaching',
      'Personal development',
      'The S.T.A.B.L.E. Method',
    ],
  }
}

function buildWebSite() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: business.nome,
    url: SITE_URL,
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/resources/?s={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

/** HOME: Person + WebSite + FAQPage */
export function getHomeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildPerson(), buildWebSite(), buildFaqPage(faqs)],
  }
}

/** /faq: FAQPage isolado */
export function getFaqPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildFaqPage(faqs)],
  }
}

/** /consultation: Service (ProfessionalService) + BreadcrumbList */
export function getServiceSchema() {
  const service = {
    '@type': ['Service', 'ProfessionalService'],
    name: 'Initial Consultation',
    description:
      'A structured, non-clinical initial consultation with Sal Ray to understand your situation, identify relevant patterns, and determine fit for ongoing work.',
    provider: { '@id': `${SITE_URL}/#person` },
    areaServed: 'United States',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITE_URL}/consultation/`,
      availableLanguage: 'en-US',
    },
  }

  const breadcrumb = buildBreadcrumbList([
    { name: 'Home', url: '/' },
    { name: 'Initial Consultation', url: '/consultation/' },
  ])

  return {
    '@context': 'https://schema.org',
    '@graph': [service, breadcrumb],
  }
}

/** /resources/[cluster]/[slug]: Article + FAQPage + BreadcrumbList */
export function getArticleSchema(article: Article, clusterName: string) {
  const articleSchema = {
    '@type': 'Article',
    headline: article.title.slice(0, 110),
    description: article.excerpt,
    author: {
      '@type': 'Person',
      name: business.nome,
      url: `${SITE_URL}/about/`,
    },
    publisher: {
      '@type': 'Organization',
      name: business.nome,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/og/og-default.jpg`,
      },
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: `${SITE_URL}${article.ogImage}`,
    mainEntityOfPage: `${SITE_URL}/resources/${article.cluster}/${article.slug}/`,
    keywords: article.keyword,
    inLanguage: 'en-US',
  }

  const breadcrumb = buildBreadcrumbList([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources/' },
    { name: clusterName, url: `/resources/${article.cluster}/` },
    { name: article.title, url: `/resources/${article.cluster}/${article.slug}/` },
  ])

  return {
    '@context': 'https://schema.org',
    '@graph': [articleSchema, buildFaqPage(article.faq), breadcrumb],
  }
}

export { DOMINIO, SITE_URL }
