'use client'

import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

/** Botão de compartilhar com foco em WhatsApp (ver PROMPT_REFLEXOES_SAL_RAY.md seção 7). */
export default function ShareButton({ slug, titulo, url }: { slug: string; titulo: string; url: string }) {
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${titulo} — ${url}`)}`

  // navigator.share() só existe no cliente — checar isso durante o render
  // divergiria entre servidor (sempre ausente) e cliente, causando erro de
  // hidratação. Só decide depois de montar.
  const [canNativeShare, setCanNativeShare] = useState(false)
  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  function handleWhatsAppClick() {
    trackEvent('audio_share_click', { audio_slug: slug, channel: 'whatsapp' })
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url })
        trackEvent('audio_share_click', { audio_slug: slug, channel: 'native' })
      } catch {
        // usuário cancelou o compartilhamento — não é um erro
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        className="inline-flex items-center gap-2 font-body text-sm font-medium bg-orange text-charcoal px-5 py-2.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
      >
        Compartilhar no WhatsApp
      </a>
      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="font-body text-sm text-aqua underline underline-offset-2 hover:text-orange transition-colors"
        >
          Outras opções de compartilhamento
        </button>
      )}
    </div>
  )
}
