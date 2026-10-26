import type { Metadata } from 'next'
import { OG_IMAGES, TWITTER_CARD } from '@/lib/og'
import { SITE_URL } from '@/lib/config'
import AvaliacaoApp from './AvaliacaoApp'

// Rota isolada, fora do menu principal — link enviado diretamente a quem
// comprou as Vivências. noindex tanto na meta tag quanto (via
// middleware.ts, escopo '/pt/reconstrucao-emocional') no cabeçalho
// X-Robots-Tag, e excluída do sitemap em next-sitemap.config.js.
export const metadata: Metadata = {
  title: 'Autoavaliação: Vivências de Reconstrução Emocional',
  description: 'Ferramenta de autoavaliação Antes/Depois para participantes das Vivências de Reconstrução Emocional.',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/pt/reconstrucao-emocional/avaliacao/` },
  twitter: TWITTER_CARD,
  openGraph: {
    title: 'Autoavaliação: Vivências de Reconstrução Emocional',
    description: 'Ferramenta de autoavaliação Antes/Depois para participantes das Vivências de Reconstrução Emocional.',
    url: `${SITE_URL}/pt/reconstrucao-emocional/avaliacao/`,
    locale: 'pt_BR',
    type: 'website',
    images: OG_IMAGES,
  },
}

export default function AvaliacaoPage() {
  return <AvaliacaoApp />
}
