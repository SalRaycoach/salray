'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ScaleInput from './ScaleInput'
import {
  SCALE_QUESTIONS,
  CATEGORIES,
  OPEN_QUESTIONS_FIRST,
  OPEN_QUESTIONS_RETAKE,
  CLOSING_MESSAGE,
  categorySummary,
} from './assessment-data'

type Mode = 'first' | 'retake'
type Screen = 'choose' | 'form' | 'result'

/**
 * No unique identifier, no database, no localStorage — each completion is
 * fully independent (see assessment-data.ts). Since nothing is persisted
 * between visits, the tool has no way to detect on its own whether this is
 * someone's first time or a retake; she tells it herself on the choose
 * screen. That single choice decides which open questions are asked and
 * whether the two notification emails are sent after submitting.
 */
export default function AssessmentApp() {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('choose')
  const [mode, setMode] = useState<Mode>('first')
  const [scales, setScales] = useState<Array<number | null>>(Array(10).fill(null))
  const [openAnswers, setOpenAnswers] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function startMode(chosen: Mode) {
    setMode(chosen)
    setScales(Array(10).fill(null))
    setOpenAnswers(Array(chosen === 'first' ? OPEN_QUESTIONS_FIRST.length : OPEN_QUESTIONS_RETAKE.length).fill(''))
    setEmail('')
    setError(null)
    setSendStatus('idle')
    setScreen('form')
  }

  async function handleSubmit() {
    if (scales.some((v) => v === null)) {
      setError('Please answer all 10 scale questions before submitting — at least one is still unmarked.')
      return
    }
    if (mode === 'retake' && !email.includes('@')) {
      setError('Please enter a valid email address so we can send you a copy of your summary.')
      return
    }
    setError(null)
    setScreen('result')

    if (mode !== 'retake') return

    setSendStatus('sending')
    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          scales,
          openAnswers,
          submitted_at: new Date().toISOString(),
        }),
      })
      const data = await response.json()
      setSendStatus(response.ok && data.ok ? 'sent' : 'error')
    } catch {
      setSendStatus('error')
    }
  }

  if (screen === 'choose') {
    return (
      <div className="max-w-2xl">
        <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">Self-Assessment</p>
        <h1 className="font-display text-4xl text-charcoal mb-6">Where Are You Right Now?</h1>
        <p className="font-body text-lg text-charcoal/80 leading-relaxed mb-10">
          A short set of questions to help you see, with more clarity, where you are right now. It takes a few
          minutes, and there is no right or wrong answer.
        </p>

        <div className="grid gap-4">
          <button
            type="button"
            onClick={() => startMode('first')}
            className="text-left border border-charcoal/15 rounded-lg p-6 hover:border-orange transition-colors"
          >
            <p className="font-display text-lg text-charcoal mb-1">This is my first time</p>
            <p className="font-body text-sm text-charcoal/70">I haven&apos;t completed this assessment before.</p>
          </button>
          <button
            type="button"
            onClick={() => startMode('retake')}
            className="text-left border border-charcoal/15 rounded-lg p-6 hover:border-orange transition-colors"
          >
            <p className="font-display text-lg text-charcoal mb-1">I&apos;ve done this before</p>
            <p className="font-body text-sm text-charcoal/70">I&apos;m retaking it to see how things have shifted.</p>
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'form') {
    const openQuestions = mode === 'first' ? OPEN_QUESTIONS_FIRST : OPEN_QUESTIONS_RETAKE
    let counter = 0

    return (
      <div className="max-w-2xl">
        <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">Self-Assessment</p>
        <h1 className="font-display text-4xl text-charcoal mb-6">Where Are You Right Now?</h1>
        <p className="font-body text-charcoal/70 leading-relaxed mb-12">
          For each statement, mark the number that best represents you right now — 0 means not true for you at all,
          10 means completely true for you.
        </p>

        {CATEGORIES.map((category) => (
          <div key={category.name} className="mb-10">
            <h2 className="font-display text-xl text-charcoal mb-5">{category.name}</h2>
            <div className="space-y-8">
              {category.questions.map((index) => {
                counter += 1
                return (
                  <div key={index}>
                    <p className="font-body text-charcoal/85 leading-relaxed mb-3">
                      {counter}. {SCALE_QUESTIONS[index]}
                    </p>
                    <ScaleInput
                      label={SCALE_QUESTIONS[index] ?? ''}
                      value={scales[index] ?? null}
                      onChange={(value) => {
                        setScales((prev) => {
                          const next = [...prev]
                          next[index] = value
                          return next
                        })
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div className="border-t border-charcoal/10 pt-10 mb-10">
          <h2 className="font-display text-xl text-charcoal mb-6">
            {mode === 'first' ? 'A Few Reflections' : 'Looking Back'}
          </h2>
          <div className="space-y-6">
            {openQuestions.map((question, i) => (
              <div key={i}>
                <label className="font-body text-charcoal/85 leading-relaxed mb-2 block">{question}</label>
                <textarea
                  value={openAnswers[i] ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    setOpenAnswers((prev) => {
                      const next = [...prev]
                      next[i] = value
                      return next
                    })
                  }}
                  rows={3}
                  className="w-full font-body text-sm text-charcoal bg-transparent border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-aqua"
                />
              </div>
            ))}
          </div>
        </div>

        {mode === 'retake' && (
          <div className="mb-10">
            <label htmlFor="assessment-email" className="font-body text-sm text-charcoal/90 block mb-2">
              Your Email <span className="text-orange">*</span>
            </label>
            <input
              id="assessment-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-charcoal/20 bg-offwhite px-4 py-3 font-body text-charcoal rounded-md focus:outline-none focus:ring-3 focus:ring-aqua focus:ring-offset-2 focus:ring-offset-offwhite"
            />
            <p className="font-body text-xs text-charcoal/50 mt-1.5">
              We&apos;ll send a copy of your summary here, and let SAL Ray know you completed a retake.
            </p>
          </div>
        )}

        {error && <p className="font-body text-sm text-orange mb-6">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          See My Summary
        </button>
      </div>
    )
  }

  // screen === 'result'
  return (
    <div className="max-w-2xl">
      <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">Self-Assessment</p>
      <h1 className="font-display text-4xl text-charcoal mb-10">Your Snapshot</h1>

      <div className="grid gap-6 mb-10">
        {CATEGORIES.map((category) => (
          <div key={category.name} className="border border-charcoal/15 rounded-lg p-6">
            <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{category.name}</p>
            <p className="font-body text-charcoal/85 leading-relaxed">{categorySummary(scales as number[], category)}</p>
          </div>
        ))}
      </div>

      <div className="border border-charcoal/15 rounded-lg bg-pale-aqua/40 p-6 mb-10">
        <p className="font-body text-charcoal/80 leading-relaxed">{CLOSING_MESSAGE}</p>
      </div>

      {mode === 'retake' && (
        <div className="mb-10">
          {sendStatus === 'sending' && <p className="font-body text-sm text-charcoal/60">Sending your copy...</p>}
          {sendStatus === 'sent' && (
            <p className="font-body text-sm text-charcoal/60">A copy of this summary has been sent to your email.</p>
          )}
          {sendStatus === 'error' && (
            <p className="font-body text-sm text-orange">
              We couldn&apos;t send your email copy right now, but your summary above is complete and accurate.
            </p>
          )}
          <button
            type="button"
            onClick={() => router.push('/assessment/thank-you/')}
            disabled={sendStatus === 'sending'}
            className="mt-4 inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {mode === 'first' && (
        <button
          type="button"
          onClick={() => setScreen('choose')}
          className="font-body text-sm text-charcoal/50 underline underline-offset-2 hover:text-orange transition-colors"
        >
          Start over
        </button>
      )}
    </div>
  )
}
