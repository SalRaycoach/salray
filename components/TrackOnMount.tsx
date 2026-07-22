'use client'

import { useEffect } from 'react'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'

export default function TrackOnMount({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    trackEvent(event)
  }, [event])

  return null
}
