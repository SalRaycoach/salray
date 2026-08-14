import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import '../globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import MetaPixel from '@/components/MetaPixel'
import { GA_MEASUREMENT_ID, META_PIXEL_ID } from '@/lib/config'
import { PT_CANONICAL_URL, ptPageMeta } from '@/lib/pt-reconstrucao'
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
 * Rota isolada, própria (briefing seção 18): noindex/nofollow tanto na tag
 * meta quanto — via middleware.ts, matcher '/pt/:path*' — no cabeçalho
 * X-Robots-Tag. Não incluir esta rota em app/(marketing)/sitemap,
 * next-sitemap.config.js (exclude já cobre isso) nem em public/llms.txt.
 */
export const metadata: Metadata = {
  title: ptPageMeta.title,
  description: ptPageMeta.description,
  alternates: { canonical: PT_CANONICAL_URL },
  robots: { index: false, follow: false },
  openGraph: {
    title: ptPageMeta.title,
    description: ptPageMeta.description,
    url: PT_CANONICAL_URL,
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function PtRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body">
        <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        <MetaPixel pixelId={META_PIXEL_ID} />
        <PtHeader />
        {children}
        <PtFooter />
      </body>
    </html>
  )
}
