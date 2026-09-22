'use client'

import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Share block for English reflections — Copy Link, Email, and a direct
 * Facebook sharer link lead (facebook.com/sharer/sharer.php, no Facebook SDK
 * or script — deliberately kept light), native share when the browser
 * supports it, and WhatsApp as a discreet fifth option. Different emphasis
 * from app/pt/reflexoes/[slug]/ShareButton.tsx, which leads with WhatsApp —
 * that ordering fits the Portuguese audience, not this one.
 */
export default function ShareButton({ slug, title, url }: { slug: string; title: string; url: string }) {
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title} — ${url}`)}`
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`

  const [copied, setCopied] = useState(false)
  // navigator.share() only exists on the client — checking during render
  // would diverge between server (always absent) and client, causing a
  // hydration mismatch. Only decide after mounting.
  const [canNativeShare, setCanNativeShare] = useState(false)
  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  function track(channel: string) {
    trackEvent('audio_share_click', { audio_slug: slug, channel })
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      track('copy_link')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable or denied — nothing to recover from here.
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        track('native')
      } catch {
        // Person canceled the share sheet — not an error.
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 font-body text-sm font-medium bg-orange text-charcoal px-5 py-2.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
      >
        {copied ? 'Link Copied!' : 'Copy Link'}
      </button>
      <a
        href={emailHref}
        onClick={() => track('email')}
        className="font-body text-sm font-medium border border-charcoal/20 text-charcoal px-5 py-2.5 rounded-md hover:border-orange hover:text-orange transition-colors"
      >
        Email
      </a>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('facebook')}
        className="font-body text-sm font-medium border border-charcoal/20 text-charcoal px-5 py-2.5 rounded-md hover:border-orange hover:text-orange transition-colors"
      >
        Facebook
      </a>
      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="font-body text-sm text-aqua underline underline-offset-2 hover:text-orange transition-colors"
        >
          More sharing options
        </button>
      )}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('whatsapp')}
        className="font-body text-xs text-charcoal/50 underline underline-offset-2 hover:text-orange transition-colors"
      >
        Share on WhatsApp
      </a>
    </div>
  )
}
