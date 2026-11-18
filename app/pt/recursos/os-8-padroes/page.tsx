import type { Metadata } from 'next'
import Link from 'next/link'
import { OG_IMAGES, TWITTER_CARD } from '@/lib/og'
import { business, SITE_URL } from '@/lib/config'
import { markdownToHtml } from '@/lib/mdx'
import SchemaOrg from '@/components/SchemaOrg'
import LeadMagnetCard from '@/components/LeadMagnetCard'
import article from '@/content/pt-articles/os-8-padroes.json'

/**
 * Artigo em português "Os 8 Padrões". Mesmo layout dos artigos em inglês
 * (app/(marketing)/resources/[cluster]/[slug]/page.tsx), dentro da árvore /pt/
 * (cabeçalho e rodapé em português). O texto fica em content/pt-articles/os-8-padroes.json,
 * no mesmo formato markdown simples dos artigos em inglês.
 */
const url = `${SITE_URL}/pt/recursos/${article.slug}/`
const metaTitle = 'Os 8 Padrões: Qual Deles Comanda a Sua Vida?'

export const metadata: Metadata = {
  title: `${metaTitle} | SAL Ray`,
  description: article.excerpt,
  alternates: { canonical: url },
  twitter: TWITTER_CARD,
  openGraph: {
    title: `${metaTitle} | SAL Ray`,
    description: article.excerpt,
    url,
    locale: 'pt_BR',
    type: 'article',
    publishedTime: article.datePublished,
    modifiedTime: article.dateModified,
    images: OG_IMAGES,
  },
  robots: 'index, follow',
}

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      author: { '@type': 'Person', name: business.nome, url: `${SITE_URL}/about/` },
      publisher: {
        '@type': 'Organization',
        name: business.nome,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/og/og-default.jpg` },
      },
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      image: `${SITE_URL}/images/og/og-default.jpg`,
      mainEntityOfPage: url,
      keywords: article.keyword,
      inLanguage: 'pt-BR',
    },
    {
      '@type': 'FAQPage',
      mainEntity: article.faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
  ],
}

export default function OsOitoPadroesPage() {
  const html = markdownToHtml(article.content)
  const published = new Date(article.datePublished).toLocaleDateString('pt-BR', { timeZone: 'America/New_York' })

  return (
    <>
      <SchemaOrg data={schema} />
      <main className="max-w-content mx-auto px-6 py-16 md:py-24">
        <span className="font-body text-xs uppercase tracking-widest text-aqua">Publicado em {published}</span>
        <h1 className="font-display text-4xl text-charcoal mt-2 mb-4 max-w-3xl">{article.title}</h1>

        <article className="max-w-2xl" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="max-w-2xl mt-12">
          <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">Fim do artigo · o que fazer agora</p>
          <LeadMagnetCard variant="compact" source="article" lang="pt" />
          <p className="mt-5 text-center font-body text-sm text-charcoal/70">
            Prefere conversar?{' '}
            <Link href="/pt/reconstrucao-emocional/#personalizado" className="underline underline-offset-4 hover:text-orange">
              Agende uma sessão comigo
            </Link>
          </p>
        </div>

        <div className="max-w-2xl mt-12 pt-8 border-t border-charcoal/10">
          <p className="font-body text-sm text-charcoal/60 leading-relaxed">
            Escrito por SAL Ray, Coach de Reconstrução Emocional e de Vida. Este artigo é educativo e não diagnostica
            nem trata condições de saúde mental.
          </p>
        </div>
      </main>
    </>
  )
}
