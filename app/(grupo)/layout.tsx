import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import '../globals.css'
import MetaPixel from '@/components/MetaPixel'
import AnalyticsListener from '@/components/AnalyticsListener'
import { META_PIXEL_ID, SITE_URL } from '@/lib/config'

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
 * Raiz enxuta só para a página de captura de anúncios (/pt/mentoria-reconstrucao-emocional/),
 * criada para carregar rápido no celular (tráfego do Facebook). Diferenças para app/pt/layout.tsx:
 * cabeçalho e rodapé estáticos (sem componentes de cliente que leem a rota) e sem GA4. O Meta Pixel
 * continua, com o carregamento adiado (veja components/MetaPixel.tsx, prop deferLoad) e o
 * AnalyticsListener continua para os eventos de rolagem. Não force robots aqui: a página define index,follow.
 */
export const metadata: Metadata = { metadataBase: new URL(SITE_URL) }

export default function GrupoRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body">
        <MetaPixel pixelId={META_PIXEL_ID} deferLoad />
        <header className="bg-offwhite border-b border-charcoal/10">
          <div className="max-w-content mx-auto px-6 py-4">
            <span className="font-display font-semibold text-lg text-charcoal">SAL Ray</span>
          </div>
        </header>
        {children}
        <footer className="bg-charcoal text-offwhite">
          <div className="max-w-content mx-auto px-6 py-10">
            <p className="font-body text-sm text-offwhite/80 leading-relaxed mb-3 max-w-[720px]">
              Os conteúdos apresentados nesta página são educacionais e voltados ao coaching e ao desenvolvimento
              pessoal. Eles não prestam serviços médicos ou de saúde mental e não substituem psicoterapia, psiquiatria,
              atendimento médico ou serviços de emergência. Resultados variam de pessoa para pessoa.
            </p>
            <p className="font-body text-xs text-offwhite/60">
              © {new Date().getFullYear()} SAL Ray. Todos os direitos reservados.
            </p>
          </div>
        </footer>
        <AnalyticsListener />
      </body>
    </html>
  )
}
