import type { Metadata } from 'next'
import { getPublishedAudios, AUDIO_CATEGORIAS } from '@/lib/audios'
import { reflexoes, SITE_URL } from '@/lib/config'
import CategoryFilter from './CategoryFilter'

// Sem isso, a lista de áudios ficaria congelada no que estava publicado no
// momento do último build — um áudio agendado só apareceria depois de um
// novo deploy manual, o que contradiz o objetivo da publicação programada
// (gravar várias semanas de uma vez e o site "soltar" um por vez sozinho).
// Com revalidate, o Next.js reconstrói esta página em segundo plano no
// máximo 1x/hora, então a defasagem real entre a data programada e o áudio
// aparecer no ar é de até ~1 hora, não instantânea.
export const revalidate = 3600

// title.template do layout.tsx desta mesma pasta NÃO se aplica ao title
// definido aqui — regra do Next.js: title.template só afeta segmentos
// FILHOS, nunca a page.js do mesmo segmento em que o layout mora (a página
// [slug]/ é filha e recebe o template normalmente). Por isso o hub define o
// título completo, final, direto.
export const metadata: Metadata = {
  title: reflexoes.nomeSerie,
  description:
    'Reflexões curtas em áudio, em português, para reconhecer padrões emocionais e reorganizar a resposta interna — de graça, sem cadastro.',
  alternates: { canonical: `${SITE_URL}/pt/reflexoes/` },
  openGraph: {
    title: reflexoes.nomeSerie,
    description: 'Reflexões curtas em áudio, em português, para reconhecer padrões e reorganizar a resposta interna.',
    url: `${SITE_URL}/pt/reflexoes/`,
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function ReflexoesHubPage() {
  const audios = getPublishedAudios()

  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">GRATUITO · EM PORTUGUÊS</p>
      <h1 className="font-display text-4xl md:text-5xl leading-tight text-charcoal mb-6 max-w-2xl">{reflexoes.nomeSerie}</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-2xl mb-14">
        Reflexões curtas em áudio para reconhecer padrões emocionais e reorganizar a resposta interna, um pouco por
        vez. Ouça quando fizer sentido para você.
      </p>

      <CategoryFilter audios={audios} categorias={AUDIO_CATEGORIAS} />
    </main>
  )
}
