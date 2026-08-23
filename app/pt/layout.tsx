import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import '../globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import MetaPixel from '@/components/MetaPixel'
import AnalyticsListener from '@/components/AnalyticsListener'
import { GA_MEASUREMENT_ID, META_PIXEL_ID, SITE_URL } from '@/lib/config'
import PtHeader from './PtHeader'
import PtFooter from './PtFooter'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

/**
 * Raiz compartilhada por toda a árvore /pt/ — precisa existir fora de
 * app/(marketing)/ pra poder declarar seu próprio <html lang="pt-BR">
 * (regra do Next.js pra "multiple root layouts", ver commit da
 * reestruturação de rotas). Deliberadamente sem metadata.robots aqui: cada
 * seção sob /pt/ decide isso na sua própria camada (ex.:
 * app/pt/reflexoes/layout.tsx define index,follow; app/pt/reconstrucao-
 * emocional/page.tsx define noindex,nofollow) — não force um default aqui
 * que uma seção com necessidade diferente da outra precisaria sobrescrever.
 */
export const metadata: Metadata = { metadataBase: new URL(SITE_URL) }

export default function PtRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body">
        <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        <MetaPixel pixelId={META_PIXEL_ID} />
        <PtHeader />
        {children}
        <PtFooter />
        <AnalyticsListener />
      </body>
    </html>
  )
}
