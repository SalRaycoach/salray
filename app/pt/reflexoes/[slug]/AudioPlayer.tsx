'use client'

import { useRef, useState } from 'react'
import { formatDuration } from '@/lib/audios'
import { trackEvent } from '@/lib/analytics'

const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

export default function AudioPlayer({ slug, src, duracaoSegundos }: { slug: string; src: string; duracaoSegundos: number }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [speed, setSpeed] = useState(1)
  const started = useRef(false)
  const firedMilestones = useRef(new Set<number>())

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
    if (!started.current) {
      started.current = true
      trackEvent('audio_play', { audio_slug: slug })
    }
  }

  function handlePause() {
    setIsPlaying(false)
  }

  function handleTimeUpdate() {
    const el = audioRef.current
    if (!el) return
    setCurrentTime(el.currentTime)
    const dur = el.duration || duracaoSegundos
    if (!dur) return
    const percent = Math.floor((el.currentTime / dur) * 100)
    for (const milestone of [25, 50, 75] as const) {
      if (percent >= milestone && !firedMilestones.current.has(milestone)) {
        firedMilestones.current.add(milestone)
        trackEvent(`audio_${milestone}` as 'audio_25' | 'audio_50' | 'audio_75', { audio_slug: slug })
      }
    }
  }

  function handleEnded() {
    setIsPlaying(false)
    trackEvent('audio_complete', { audio_slug: slug })
  }

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
