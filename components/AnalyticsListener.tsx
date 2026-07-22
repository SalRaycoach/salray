'use client'

import { useEffect } from 'react'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'

export default function AnalyticsListener() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest('[data-event]')
      if (!target) return
      const event = target.getAttribute('data-event') as AnalyticsEvent | null
      if (event) trackEvent(event)
    }

    let firedHalf = false
    let firedNinety = false
    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      const pct = total > 0 ? scrolled / total : 0
      if (!firedHalf && pct >= 0.5) {
        firedHalf = true
        trackEvent('scroll_50')
      }
      if (!firedNinety && pct >= 0.9) {
        firedNinety = true
        trackEvent('scroll_90')
      }
    }

    document.addEventListener('click', onClick)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return null
}
