import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_ICONS } from '@/lib/icons'
import { Fraunces, Inter } from 'next/font/google'
import '../globals.css'
import AnalyticsListener from '@/components/AnalyticsListener'
import ConditionalGoogleAnalytics from '@/components/ConditionalGoogleAnalytics'
import MetaPixel from '@/components/MetaPixel'
import { GA_MEASUREMENT_ID, META_PIXEL_ID, SITE_URL } from '@/lib/config'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

/**
 * Raiz própria da página de captura em português (/pt/primeiros-passos/), irmã de
 * app/(first-steps)/layout.tsx: cabeçalho simples na própria página, sem a
 * navegação do site, mas COM GA4 (ConditionalGoogleAnalytics: só exclui
 * /pt/reconstrucao-emocional*, então /pt/primeiros-passos/ carrega normalmente),
 * Meta Pixel e o listener de rolagem. Não force robots aqui: a página define.
 */
export const metadata: Metadata = { metadataBase: new URL(SITE_URL), icons: SITE_ICONS }

export default function FirstStepsPtRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body">
        <ConditionalGoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        <MetaPixel pixelId={META_PIXEL_ID} />
        {children}
        <footer className="border-t border-charcoal/10">
          <div className="max-w-content mx-auto px-6 py-8">
            <p className="font-body text-xs text-charcoal/60 leading-relaxed max-w-3xl mb-3">
              Os conteúdos apresentados nesta página são educacionais e voltados ao coaching e ao desenvolvimento
              pessoal. Eles não prestam serviços médicos ou de saúde mental e não substituem psicoterapia, psiquiatria,
              atendimento médico ou serviços de emergência. Resultados variam de pessoa para pessoa.
            </p>
            <p className="font-body text-xs text-charcoal/60">
              © {new Date().getFullYear()} SAL Ray. Todos os direitos reservados.{' '}
              <Link href="/pt/politica-de-privacidade/" className="underline underline-offset-2 hover:text-orange">
                Política de Privacidade
              </Link>
              {' · '}
              <Link href="/terms/" className="underline underline-offset-2 hover:text-orange">
                Termos de Uso
              </Link>
            </p>
          </div>
        </footer>
        <AnalyticsListener />
      </body>
    </html>
  )
}
