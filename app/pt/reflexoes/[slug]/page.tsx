import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SchemaOrg from '@/components/SchemaOrg'
import { getAudioSchema } from '@/lib/schema'
import {
  getPublishedAudioBySlug,
  getPublishedAudios,
  getRelatedAudios,
  getNextScheduledAudio,
  formatProximaData,
  formatDuration,
  PRODUTO_INFO,
  CATEGORIA_LABEL,
} from '@/lib/audios'
import { SITE_URL } from '@/lib/config'
import AudioPlayer from './AudioPlayer'
import ShareButton from './ShareButton'
import ProductCta from './ProductCta'
import TranscriptAccordion from './TranscriptAccordion'

// Ver nota equivalente em app/pt/reflexoes/page.tsx — force-dynamic (em vez
// de revalidate) garante que um áudio agendado fica acessível assim que sua
// dataPublicacao chega, sem esperar o próximo ciclo de cache (até 1h de
// atraso com ISR). generateStaticParams foi removido junto: com
// force-dynamic nada é pré-gerado, então uma lista estática de slugs no
// build não tem efeito.
export const dynamic = 'force-dynamic'

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const audio = getPublishedAudioBySlug(params.slug)
  if (!audio) return {}

  const url = `${SITE_URL}/pt/reflexoes/${audio.slug}/`
  return {
    title: audio.titulo,
    description: audio.descricao,
    alternates: { canonical: url },
    openGraph: {
      title: audio.titulo,
      description: audio.descricao,
      url,
      locale: 'pt_BR',
      type: 'music.song', // OG não tem tipo "áudio de reflexão" — mais perto disso do que "article"
      images: [{ url: `${SITE_URL}${audio.ogImage ?? '/images/og/og-default.jpg'}`, width: 1200, height: 630, alt: audio.titulo }],
    },
  }
}

export default function AudioPage({ params }: { params: { slug: string } }) {
  const audio = getPublishedAudioBySlug(params.slug)
  if (!audio) notFound()

  const related = getRelatedAudios(audio)
  const produto = PRODUTO_INFO[audio.produtoRelacionado]
  const pageUrl = `${SITE_URL}/pt/reflexoes/${audio.slug}/`
  const schema = getAudioSchema(audio)
  const proximaAudio = getNextScheduledAudio()

  return (
    <>
      <SchemaOrg data={schema} />
      <main className="max-w-content mx-auto px-6 py-16 md:py-24">
        <nav className="font-body text-xs text-charcoal/50 mb-8">
          <Link href="/pt/reflexoes/" className="hover:text-aqua">
            Reflexões
          </Link>{' '}
          / {audio.titulo}
        </nav>

        <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{CATEGORIA_LABEL[audio.categoria]}</p>
        <h1 className="font-display text-4xl text-charcoal mb-2 max-w-2xl">{audio.titulo}</h1>
        <p className="font-body text-sm text-charcoal/50 mb-8">{formatDuration(audio.duracaoSegundos)}</p>

        <div className="max-w-2xl mb-6">
          <AudioPlayer slug={audio.slug} titulo={audio.titulo} src={audio.urlAudio} duracaoSegundos={audio.duracaoSegundos} />
        </div>

        <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-12">{audio.descricao}</p>

        <div className="max-w-2xl mb-12">
          <ShareButton slug={audio.slug} titulo={audio.titulo} url={pageUrl} />
        </div>

        {proximaAudio && (
          <div className="max-w-2xl border border-charcoal/15 rounded-lg bg-pale-aqua/40 p-6 mb-12">
            <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Próxima reflexão</p>
            <p className="font-body text-charcoal/80">{formatProximaData(proximaAudio.dataPublicacao)}</p>
          </div>
        )}

        <TranscriptAccordion transcricao={audio.transcricao} />

        <div className="max-w-2xl border border-charcoal/15 rounded-lg p-6 mb-12">
          <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Quer ir mais fundo?</p>
          <p className="font-body text-charcoal/80 leading-relaxed mb-4">
            Esta reflexão se conecta com {produto.artigo} {produto.nome}, parte do Método S.T.A.B.L.E.™.
          </p>
          <ProductCta
            audioSlug={audio.slug}
            produtoRelacionado={audio.produtoRelacionado}
            produtoNome={produto.nome}
            produtoArtigo={produto.artigo}
            anchor={produto.anchor}
          />
        </div>

        {related.length > 0 && (
          <div className="max-w-2xl mb-12">
            <h2 className="font-body text-xs uppercase tracking-widest text-aqua mb-4">Continue ouvindo</h2>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/pt/reflexoes/${r.slug}/`}
                    className="font-display text-lg text-charcoal hover:text-orange transition-colors"
                  >
                    {r.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  )
}
