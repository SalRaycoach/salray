import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/config'
import AssessmentApp from './AssessmentApp'

// Isolated route, outside the main menu — link shared directly with
// individual clients. noindex both via this metadata tag and (via
// middleware.ts, scoped to '/assessment') the X-Robots-Tag header, and
// excluded from the sitemap in next-sitemap.config.js — same "private link"
// pattern as app/pt/reconstrucao-emocional/avaliacao/.
export const metadata: Metadata = {
  title: 'Self-Assessment',
  description: 'A private self-assessment for clients working with SAL Ray.',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/assessment/` },
}

export default function AssessmentPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <AssessmentApp />
    </main>
  )
}
