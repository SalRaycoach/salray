'use client'

import { usePathname } from 'next/navigation'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const FOUR_WEEK_HREF = '/4-week-experience/'

/**
 * GA4 is excluded only on /4-week-experience/ — Meta Pixel stays, since that's
 * what the campaign is actually measured against. Everywhere else, unchanged.
 */
export default function ConditionalGoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  if (pathname === FOUR_WEEK_HREF) return null
  return <GoogleAnalytics measurementId={measurementId} />
}
