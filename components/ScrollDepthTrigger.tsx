'use client'

import { useEffect, useRef } from 'react'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'

/** Dispara `event` uma única vez quando a página é rolada além de `threshold` (0–1). */
export default function ScrollDepthTrigger({ threshold, event }: { threshold: number; event: AnalyticsEvent }) {
  const fired = useRef(false)

  useEffect(() => {
    function onScroll() {
      if (fired.current) return
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (total > 0 && scrolled / total >= threshold) {
        fired.current = true
        trackEvent(event)
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold, event])

  return null
}
