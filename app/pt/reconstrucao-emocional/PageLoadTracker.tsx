'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'

/** Dispara view_offers_pt uma vez por carregamento — briefing seção 17. */
export default function PageLoadTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    trackEvent('view_offers_pt', {
      source: searchParams.get('utm_source') ?? undefined,
      medium: searchParams.get('utm_medium') ?? undefined,
      campaign: searchParams.get('utm_campaign') ?? undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
