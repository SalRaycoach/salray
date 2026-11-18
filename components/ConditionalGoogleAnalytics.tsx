'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import GoogleAnalytics from '@/components/GoogleAnalytics'

/**
 * GA4 só onde faz sentido medir (lista de PERMITIDAS, em vez da lista de exclusões antiga):
 *  - /first-steps/ e /pt/primeiros-passos/ (páginas de captura do treinamento);
 *  - os artigos: /resources/[categoria]/[artigo]/ (exatamente 3 níveis).
 * Fica DESLIGADO em todo o resto: home, 4-Week Experience, /pt/reconstrucao-emocional*
 * (e a mentoria), /reflections*, /assessment*, avaliação, páginas de políticas etc.
 * O Meta Pixel é outro componente e não é afetado por este.
 */
// Também as duas páginas de agradecimento (leves), para application_completed e book_session_completed chegarem ao GA4.
const ALLOWED_EXACT = ['/first-steps', '/pt/primeiros-passos', '/book-a-session/thank-you', '/4-week-experience/thank-you']
// Artigos: /resources/[categoria]/[artigo]/ (3 níveis) e os artigos em português, /pt/recursos/[artigo]/.
const ARTICLE_PATH = /^\/(?:resources\/[^/]+\/[^/]+|pt\/recursos\/[^/]+)\/?$/

export function isGaAllowed(pathname: string | null): boolean {
  if (!pathname) return false
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
  return ALLOWED_EXACT.includes(clean) || ARTICLE_PATH.test(pathname)
}

export default function ConditionalGoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const allowed = isGaAllowed(pathname)

  // Na navegação interna a biblioteca do GA4 continua carregada depois que a pessoa sai de
  // uma página permitida. O opt-out oficial (ga-disable-ID) impede que a home e as outras
  // páginas desligadas sejam contadas nesse caso.
  useEffect(() => {
    ;(window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = !allowed
  }, [allowed, measurementId])

  if (!allowed) return null
  return <GoogleAnalytics measurementId={measurementId} />
}
