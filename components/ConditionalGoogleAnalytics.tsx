'use client'

import { usePathname } from 'next/navigation'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const FOUR_WEEK_HREF = '/4-week-experience/'
// Pedido 17 set 2026 — mesma exclusão de GA4 já aplicada ao 4-Week Experience,
// agora também na seção isolada /pt/reconstrucao-emocional/ (inclui a
// ferramenta de autoavaliação em /avaliacao/, sub-rota da mesma seção).
const RECONSTRUCAO_PREFIX = '/pt/reconstrucao-emocional'
// Requested alongside the English "S.T.A.B.L.E. Reflections" launch — same
// lightweight-analytics treatment as the other free/content funnels above.
const REFLECTIONS_PREFIX = '/reflections'

/**
 * GA4 is excluded on /4-week-experience/, the whole /pt/reconstrucao-
 * emocional/ funnel, and /reflections/ — Meta Pixel stays on all three,
 * since that's what those campaigns are actually measured against.
 * Everywhere else, unchanged.
 */
export default function ConditionalGoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  if (pathname === FOUR_WEEK_HREF) return null
  if (pathname?.startsWith(RECONSTRUCAO_PREFIX)) return null
  if (pathname?.startsWith(REFLECTIONS_PREFIX)) return null
  return <GoogleAnalytics measurementId={measurementId} />
}
