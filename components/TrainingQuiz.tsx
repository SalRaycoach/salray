'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { PUBLISHED_TRAININGS, QUIZ_QUESTIONS, QUIZ_VIDEO_URL, TRAININGS, pickQuizResult, type Training } from '@/lib/trainings'

/**
 * Seletor "qual treinamento é para mim" (/first-steps/). Três perguntas, uma por vez, sem pedir
 * e-mail. Cada opção soma 1 ponto para um treinamento; só contam e aparecem as opções dos
 * treinamentos PUBLICADOS (lib/trainings.ts). Empate: vale a resposta da última pergunta.
 * Com menos de 2 treinamentos publicados o bloco inteiro some.
 *
 * O resultado NÃO tem formulário próprio: ao terminar, chama `onResult` e a página (TrainingsHub)
 * seleciona a capa indicada na estante e leva a pessoa até lá; o cadastro é feito no cartão único da
 * estante (origem "first-steps-quiz", com o evento quiz_result_signup).
 *
 * Eventos (sem e-mail): quiz_start e quiz_complete (training = o indicado).
 */

const SOURCE = 'first-steps'

type Step = 'intro' | number | 'result'

function VideoBlock({ url }: { url: string }) {
  const isFile = /\.(mp4|webm)(\?.*)?$/i.test(url)
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-charcoal/15 bg-black">
      {isFile ? (
        <video controls preload="none" playsInline className="aspect-video w-full" src={url}>
          Your browser does not support video.
        </video>
      ) : (
        <iframe
          src={url}
          title="A short video from SAL Ray"
          loading="lazy"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full"
        />
      )}
    </div>
  )
}

export default function TrainingQuiz({
  anchorId,
  onResult,
}: {
  /** id da seção (destino do link "answer 3 questions" do cartão da estante). */
  anchorId?: string
  /** Chamado ao terminar, com o treinamento indicado. */
  onResult?: (id: Training) => void
}) {
  const [step, setStep] = useState<Step>('intro')
  const [answers, setAnswers] = useState<Training[]>([])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const movedRef = useRef(false)

  // Depois de trocar de pergunta, leva o foco ao título dela (leitores de tela e teclado).
  useEffect(() => {
    if (!movedRef.current) return
    // No resultado a página rola até a estante; o foco não pode puxar a rolagem de volta para cá.
    headingRef.current?.focus({ preventScroll: step === 'result' })
  }, [step])

  if (PUBLISHED_TRAININGS.length < 2) return null

  const total = QUIZ_QUESTIONS.length

  function start() {
    trackEvent('quiz_start', { source: SOURCE })
    movedRef.current = true
    setAnswers([])
    setStep(0)
  }

  function choose(index: number, id: Training) {
    const next = [...answers.slice(0, index), id]
    setAnswers(next)
    if (index === total - 1) {
      const result = pickQuizResult(next)
      trackEvent('quiz_complete', { training: result ?? 'pdf1', source: SOURCE })
      setStep('result')
      if (result) onResult?.(result)
    } else {
      setStep(index + 1)
    }
  }

  const result = step === 'result' ? pickQuizResult(answers) : null

  return (
    <section id={anchorId} aria-label="Find your training" className="max-w-content mx-auto scroll-mt-4 px-6 pb-10 md:pb-14">
      <div className="rounded-2xl border border-aqua/40 bg-[#171717] p-6 sm:p-8">
        {step === 'intro' && (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-charcoal mb-2">Not sure where to start?</h2>
              <p className="font-body text-charcoal/80 leading-relaxed">Three short questions. No email needed.</p>
            </div>
            <button
              type="button"
              onClick={start}
              className="shrink-0 rounded-md bg-orange px-6 py-3.5 font-body text-sm font-semibold text-offwhite transition-colors hover:bg-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
            >
              Answer 3 questions
            </button>
          </div>
        )}

        {typeof step === 'number' && QUIZ_QUESTIONS[step] && (
          <div role="group" aria-labelledby="quiz-question">
            <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2" aria-live="polite">
              Question {step + 1} of {total}
            </p>
            <h2
              id="quiz-question"
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-2xl sm:text-3xl text-charcoal mb-5 focus:outline-none"
            >
              {QUIZ_QUESTIONS[step]!.prompt}
            </h2>
            <ul className="space-y-3">
              {PUBLISHED_TRAININGS.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => choose(step, id)}
                    className="w-full min-h-[56px] rounded-lg border border-charcoal/25 bg-offwhite px-4 py-3 text-left font-body text-base text-charcoal transition-colors hover:border-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
                  >
                    {QUIZ_QUESTIONS[step]!.options[id]}
                  </button>
                </li>
              ))}
            </ul>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="mt-4 font-body text-sm text-charcoal/70 underline underline-offset-4 hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
              >
                Back
              </button>
            )}
          </div>
        )}

        {step === 'result' && result && (
          <div>
            {QUIZ_VIDEO_URL && <VideoBlock url={QUIZ_VIDEO_URL} />}
            <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2" aria-live="polite">
              Your best starting point is
            </p>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-2xl sm:text-3xl text-charcoal mb-5 focus:outline-none"
            >
              {TRAININGS[result].title.en}
            </h2>
            <p className="mb-4 font-body text-sm font-semibold leading-relaxed text-orange">
              {TRAININGS[result].situation.en}
            </p>
            <a
              href="#trainings"
              className="inline-block rounded-md bg-orange px-6 py-3.5 font-body text-sm font-semibold text-offwhite transition-colors hover:bg-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
            >
              See it above
            </a>
            <p className="mt-5 font-body text-sm text-charcoal/80">
              Not sure?{' '}
              <Link href="/contact/" className="underline underline-offset-4 hover:text-orange">
                Send me a message
              </Link>{' '}
              and I will guide you.
            </p>
            <button
              type="button"
              onClick={() => {
                setAnswers([])
                setStep('intro')
              }}
              className="mt-3 font-body text-sm text-charcoal/70 underline underline-offset-4 hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
