import type { Metadata } from 'next'
import { reflexoes, SITE_URL } from '@/lib/config'

/**
 * Ao contrário de uma eventual página de vendas sob /pt/ (noindex), esta
 * seção é conteúdo gratuito feito pra ser encontrado — index, follow
 * explícito aqui, na camada mais próxima das páginas reais (ver
 * PROMPT_REFLEXOES_SAL_RAY.md seção 1).
 */
export const metadata: Metadata = {
  title: { template: `%s | ${reflexoes.nomeSerie}`, default: reflexoes.nomeSerie },
  robots: { index: true, follow: true },
  metadataBase: new URL(SITE_URL),
}

export default function ReflexoesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
