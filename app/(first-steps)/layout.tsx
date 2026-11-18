import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_ICONS } from '@/lib/icons'
import { Fraunces, Inter } from 'next/font/google'
import '../globals.css'
import AnalyticsListener from '@/components/AnalyticsListener'
import ConditionalGoogleAnalytics from '@/components/ConditionalGoogleAnalytics'
import MetaPixel from '@/components/MetaPixel'
import { business, clinicalDisclaimer, SITE_URL, GA_MEASUREMENT_ID, META_PIXEL_ID } from '@/lib/config'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

/**
 * Raiz própria da página de captura /first-steps/: sem a navegação completa nem
 * o rodapé grande do site (a página tem o próprio cabeçalho simples), mas com
 * GA4 (ConditionalGoogleAnalytics: /first-steps/ NÃO está na lista de exclusões),
 * Meta Pixel e o listener de rolagem. Não force robots aqui: a página define.
 */
export const metadata: Metadata = { metadataBase: new URL(SITE_URL), icons: SITE_ICONS }

export default function FirstStepsRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body">
        <ConditionalGoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        <MetaPixel pixelId={META_PIXEL_ID} />
        {children}
        <footer className="border-t border-charcoal/10">
          <div className="max-w-content mx-auto px-6 py-8">
            <p className="font-body text-xs text-charcoal/60 leading-relaxed max-w-3xl mb-3">{clinicalDisclaimer}</p>
            <p className="font-body text-xs text-charcoal/60">
              © {new Date().getFullYear()} {business.nome}. All rights reserved.{' '}
              <Link href="/privacy-policy/" className="underline underline-offset-2 hover:text-orange">
                Privacy Policy
              </Link>
              {' · '}
              <Link href="/terms/" className="underline underline-offset-2 hover:text-orange">
                Terms of Use
              </Link>
            </p>
          </div>
        </footer>
        <AnalyticsListener />
      </body>
    </html>
  )
}
