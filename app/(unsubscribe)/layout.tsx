import type { Metadata } from 'next'
import { SITE_ICONS } from '@/lib/icons'
import { Fraunces, Inter } from 'next/font/google'
import '../globals.css'
import { SITE_URL } from '@/lib/config'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

/**
 * Raiz própria para /unsubscribe/ (EN ou PT conforme ?l=). Propositalmente sem
 * GA4, Meta Pixel, navegação ou rodapé: a URL carrega o token de descadastro
 * da pessoa e não deve ser enviada a ferramentas de analytics. Sempre noindex.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: SITE_ICONS,
  robots: { index: false, follow: false },
}

export default function UnsubscribeRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  )
}
