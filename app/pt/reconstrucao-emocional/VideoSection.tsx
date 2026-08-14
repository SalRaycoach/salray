'use client'

import { useRef, useState } from 'react'
import { mainVideo as video, isMainVideoReady } from '@/lib/pt-reconstrucao'
import { trackEvent } from '@/lib/analytics'

const VIDEO_NAME = 'video_principal_pt'

/**
 * Vídeo principal — briefing seção 5. Poster estático, inicia só no clique
 * (sem autoplay), legendas + transcrição acessíveis, CTA discreto após 75%.
 * O arquivo real (srcUrl) é um dos materiais bloqueadores da seção 21 — até
 * chegar, mostramos um estado "em preparação" em vez de um player quebrado.
 * Importa a config diretamente (em vez de receber por prop) porque este é
 * um Client Component — ver nota em lib/pt-reconstrucao.ts.
 */
export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [showCta, setShowCta] = useState(false)
  const firedMilestones = useRef(new Set<number>())

  if (!isMainVideoReady()) {
    return (
      <div className="max-w-[720px] mx-auto aspect-video rounded-lg bg-pale-aqua flex items-center justify-center px-8 text-center">
        <p className="font-body text-sm text-charcoal/60">
          Vídeo principal em preparação. Esta seção será ativada assim que o arquivo final e as legendas forem entregues.
        </p>
      </div>
    )
  }

  function handlePlay() {
    if (!started) {
      setStarted(true)
      trackEvent('video_start', { video_name: VIDEO_NAME })
    }
  }

  function handleTimeUpdate() {
    const el = videoRef.current
    if (!el || !el.duration) return
    const percent = Math.floor((el.currentTime / el.duration) * 100)
    for (const milestone of [25, 50, 75]) {
      if (percent >= milestone && !firedMilestones.current.has(milestone)) {
        firedMilestones.current.add(milestone)
        trackEvent('video_progress', { video_name: VIDEO_NAME, percent: milestone })
        if (milestone === 75) setShowCta(true)
      }
    }
  }

  function handleEnded() {
    trackEvent('video_complete', { video_name: VIDEO_NAME })
    setShowCta(true)
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <video
        ref={videoRef}
        className="w-full aspect-video rounded-lg bg-offwhite"
        poster={video.posterUrl ?? undefined}
        controls
        preload="none"
        onPlay={handlePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      >
        <source src={video.srcUrl ?? undefined} type="video/mp4" />
        {video.captionsUrl && <track kind="captions" srcLang="pt" label="Português" src={video.captionsUrl} default />}
      </video>

      {video.transcript && (
        <div className="mt-4">
          <button
            type="button"
            aria-expanded={showTranscript}
            onClick={() => setShowTranscript((v) => !v)}
            className="font-body text-sm text-aqua underline underline-offset-2 hover:text-orange transition-colors"
          >
            {showTranscript ? 'Ocultar transcrição' : 'Ler transcrição do vídeo'}
          </button>
          {showTranscript && (
            <p className="mt-3 font-body text-sm text-charcoal/75 leading-relaxed whitespace-pre-line">{video.transcript}</p>
          )}
        </div>
      )}

      {showCta && (
        <div className="mt-6 text-center">
          <a
            href="#escolher"
            className="font-body text-sm font-medium text-aqua underline underline-offset-2 hover:text-orange transition-colors"
          >
            Ver as quatro opções
          </a>
        </div>
      )}
    </div>
  )
}
