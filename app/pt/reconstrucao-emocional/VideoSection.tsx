'use client'

import { useState } from 'react'
import { mainVideo, getYouTubeId } from '@/lib/pt-reconstrucao'
import { trackEvent } from '@/lib/analytics'

const VIDEO_NAME = 'video_principal_pt'

/**
 * Vídeo principal. O link vem do campo único `videoUrl` (lib/pt-reconstrucao.ts, objeto mainVideo).
 * Mostra só a capa com um botão de play e carrega o player do YouTube (youtube-nocookie.com) apenas
 * ao clicar, para a página não ficar lenta. Legendas em português ligadas (hl=pt, cc_load_policy=1)
 * e sem vídeos sugeridos de outros canais ao final (rel=0). Se `videoUrl` estiver vazio ou inválido,
 * volta o aviso "Vídeo principal em preparação". Importa a config diretamente (em vez de receber por
 * prop) porque este é um Client Component.
 */
export default function VideoSection({ title }: { title: string }) {
  const [started, setStarted] = useState(false)
  const [coverFallback, setCoverFallback] = useState(false)
  const videoId = getYouTubeId(mainVideo.videoUrl)

  if (!videoId) {
    return (
      <div className="max-w-[620px] mx-auto aspect-video rounded-lg bg-pale-aqua flex items-center justify-center px-8 text-center">
        <p className="font-body text-sm text-charcoal/60">
          Vídeo principal em preparação. Esta seção será ativada assim que o arquivo final e as legendas forem entregues.
        </p>
      </div>
    )
  }

  function handleStart() {
    setStarted(true)
    trackEvent('video_start', { video_name: VIDEO_NAME })
  }

  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&hl=pt&cc_load_policy=1&rel=0&playsinline=1`
  const cover = `https://i.ytimg.com/vi/${videoId}/${coverFallback ? 'hqdefault' : 'maxresdefault'}.jpg`

  return (
    <div className="max-w-[620px] mx-auto relative aspect-video rounded-lg overflow-hidden bg-offwhite">
      {started ? (
        <iframe
          src={embedSrc}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={handleStart}
          aria-label={`Reproduzir o vídeo: ${title}`}
          className="group absolute inset-0 w-full h-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt=""
            loading="lazy"
            onError={() => setCoverFallback(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" aria-hidden="true" />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#F7941D] shadow-lg group-hover:scale-105 transition-transform"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-9 md:h-9 ml-1 text-[#171717]" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
