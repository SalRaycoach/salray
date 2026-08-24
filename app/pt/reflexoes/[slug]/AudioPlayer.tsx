'use client'

import { useEffect, useRef, useState } from 'react'
import { formatDuration } from '@/lib/audios'
import { trackEvent } from '@/lib/analytics'

const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

/**
 * Rastreamento de escuta (pedido 24 ago 2026) — audio_start dispara uma vez
 * por visita à página; audio_play dispara em todo play, inclusive retomando
 * após pausa; audio_pause manda quanto foi ouvido desde o último play
 * (currentTime, não tempo de relógio — não sofre com velocidade de
 * reprodução diferente de 1x); audio_progress é um ping fixo de 15s
 * enquanto toca, via setInterval (timeupdate não garante intervalo
 * regular); audio_milestone cobre 25/50/75/100%.
 *
 * Ao fechar a aba tocando (sem pausar manualmente), pagehide/beforeunload
 * disparam o mesmo audio_pause com o trecho final ouvido, usando
 * transport_type: 'beacon' pra garantir que o gtag consiga enviar antes da
 * página descarregar.
 */
export default function AudioPlayer({
  slug,
  titulo,
  src,
  duracaoSegundos,
}: {
  slug: string
  titulo: string
  src: string
  duracaoSegundos: number
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [speed, setSpeed] = useState(1)

  const started = useRef(false)
  const firedMilestones = useRef(new Set<number>())
  const playStartPosition = useRef(0)
  const isPlayingRef = useRef(false)
  const progressIntervalRef = useRef<number | null>(null)

  function baseParams(extra: Record<string, unknown> = {}) {
    return { audio_id: slug, audio_title: titulo, ...extra }
  }

  function startProgressInterval() {
    stopProgressInterval()
    progressIntervalRef.current = window.setInterval(() => {
      trackEvent('audio_progress', baseParams({ seconds_listened: 15 }))
    }, 15000)
  }

  function stopProgressInterval() {
    if (progressIntervalRef.current !== null) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  function togglePlay() {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      el.play()
    } else {
      el.pause()
    }
  }

  function handlePlay() {
    setIsPlaying(true)
    isPlayingRef.current = true
    playStartPosition.current = audioRef.current?.currentTime ?? 0

    if (!started.current) {
      started.current = true
      trackEvent('audio_start', baseParams())
    }
    trackEvent('audio_play', baseParams())
    startProgressInterval()
  }

  function handlePause() {
    setIsPlaying(false)
    isPlayingRef.current = false
    stopProgressInterval()

    const el = audioRef.current
    // Quando a reprodução termina naturalmente, o navegador dispara "pause"
    // logo antes de "ended" — não é uma pausa real, o handleEnded já cobre
    // esse caso com audio_complete.
    if (el?.ended) return

    const secondsListened = el ? Math.max(0, el.currentTime - playStartPosition.current) : 0
    trackEvent('audio_pause', baseParams({ seconds_listened: Math.round(secondsListened) }))
  }

  function handleTimeUpdate() {
    const el = audioRef.current
    if (!el) return
    setCurrentTime(el.currentTime)
    const dur = el.duration || duracaoSegundos
    if (!dur) return
    const percent = (el.currentTime / dur) * 100
    for (const milestone of [25, 50, 75, 100] as const) {
      if (percent >= milestone && !firedMilestones.current.has(milestone)) {
        firedMilestones.current.add(milestone)
        trackEvent('audio_milestone', baseParams({ milestone_percent: milestone }))
      }
    }
  }

  function handleEnded() {
    setIsPlaying(false)
    isPlayingRef.current = false
    stopProgressInterval()
    trackEvent('audio_complete', baseParams())
  }

  // Envia o trecho final ouvido se a pessoa fechar/trocar de aba com o
  // áudio tocando, sem pausar manualmente antes.
  useEffect(() => {
    function flushOnLeave() {
      if (!isPlayingRef.current) return
      const el = audioRef.current
      const secondsListened = el ? Math.max(0, el.currentTime - playStartPosition.current) : 0
      trackEvent('audio_pause', baseParams({ seconds_listened: Math.round(secondsListened), transport_type: 'beacon' }))
      isPlayingRef.current = false
    }

    window.addEventListener('pagehide', flushOnLeave)
    window.addEventListener('beforeunload', flushOnLeave)
    return () => {
      window.removeEventListener('pagehide', flushOnLeave)
      window.removeEventListener('beforeunload', flushOnLeave)
      stopProgressInterval()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function skip(deltaSeconds: number) {
    const el = audioRef.current
    if (!el) return
    el.currentTime = Math.min(Math.max(el.currentTime + deltaSeconds, 0), el.duration || duracaoSegundos)
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const el = audioRef.current
    if (!el) return
    const value = Number(e.target.value)
    el.currentTime = value
    setCurrentTime(value)
  }

  function changeSpeed(value: number) {
    setSpeed(value)
    if (audioRef.current) audioRef.current.playbackRate = value
  }

  const duration = audioRef.current?.duration || duracaoSegundos

  return (
    <div className="border border-charcoal/15 rounded-lg p-6">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          className="shrink-0 w-12 h-12 rounded-full bg-orange text-charcoal flex items-center justify-center hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <rect x="2" y="1" width="4" height="14" />
              <rect x="10" y="1" width="4" height="14" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M2 1l12 7-12 7z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => skip(-15)}
          aria-label="Voltar 15 segundos"
          className="font-body text-xs text-charcoal/70 hover:text-orange transition-colors"
        >
          -15s
        </button>
        <button
          type="button"
          onClick={() => skip(15)}
          aria-label="Avançar 15 segundos"
          className="font-body text-xs text-charcoal/70 hover:text-orange transition-colors"
        >
          +15s
        </button>

        <span className="font-body text-xs text-charcoal/50 ml-auto tabular-nums">
          {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={currentTime}
        onChange={handleSeek}
        aria-label="Progresso do áudio"
        className="w-full accent-orange mb-4"
      />

      <div className="flex items-center gap-2">
        <span className="font-body text-xs text-charcoal/50 mr-1">Velocidade:</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => changeSpeed(s)}
            aria-pressed={speed === s}
            className={`font-body text-xs px-2.5 py-1 rounded transition-colors ${
              speed === s ? 'bg-aqua text-offwhite' : 'text-charcoal/60 hover:text-aqua'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  )
}
