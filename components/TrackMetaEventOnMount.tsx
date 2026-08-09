'use client'

import { useEffect } from 'react'
import { trackMetaEvent, type MetaStandardEvent } from '@/lib/analytics'

export default function TrackMetaEventOnMount({ event }: { event: MetaStandardEvent }) {
  useEffect(() => {
    trackMetaEvent(event)
  }, [event])

  return null
}
