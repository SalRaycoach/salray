'use client'

import { useEffect, useRef, useState } from 'react'
import { formatDuration } from '@/lib/reflections'
import { trackEvent } from '@/lib/analytics'

const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

/**
 * English counterpart of app/pt/reflexoes/[slug]/AudioPlayer.tsx — same
 * listening-tracking behavior (see that file's comment for the full
 * rationale), only the user-facing strings differ.
 */
export default function AudioPlayer({
  slug,
  title,
  src,
  durationSeconds,
}: {
  slug: string
  title: string
  src: string
  durationSeconds: number
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
    return { audio_id: slug, audio_title: title, ...extra }
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
    // The browser fires "pause" right before "ended" when playback finishes
    // naturally — that's not a real pause, handleEnded already covers it
    // with audio_complete.
    if (el?.ended) return

    const secondsListened = el ? Math.max(0, el.currentTime - playStartPosition.current) : 0
    trackEvent('audio_pause', baseParams({ seconds_listened: Math.round(secondsListened) }))
  }

  function handleTimeUpdate() {
    const el = audioRef.current
    if (!el) return
    setCurrentTime(el.currentTime)
    const dur = el.duration || durationSeconds
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

  // Sends the final listened stretch if the person closes/switches tabs
  // while playing, without pausing manually first.
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
    el.currentTime = Math.min(Math.max(el.currentTime + deltaSeconds, 0), el.duration || durationSeconds)
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

  const duration = audioRef.current?.duration || durationSeconds

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
          aria-label={isPlaying ? 'Pause' : 'Play'}
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
          aria-label="Back 15 seconds"
          className="font-body text-xs text-charcoal/70 hover:text-orange transition-colors"
        >
          -15s
        </button>
        <button
          type="button"
          onClick={() => skip(15)}
          aria-label="Forward 15 seconds"
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
        aria-label="Audio progress"
        className="w-full accent-orange mb-4"
      />

      <div className="flex items-center gap-2">
        <span className="font-body text-xs text-charcoal/50 mr-1">Speed:</span>
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
