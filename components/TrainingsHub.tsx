'use client'

import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import TrainingQuiz from '@/components/TrainingQuiz'
import TrainingShelf from '@/components/TrainingShelf'
import TrainingSignupCard, { type ShelfLang } from '@/components/TrainingSignupCard'
import { trackEvent } from '@/lib/analytics'
import { PUBLISHED_TRAININGS, TRAININGS, type Training } from '@/lib/trainings'

/**
 * Página de treinamentos (/first-steps/ em inglês, /pt/primeiros-passos/ em português): título com a
 * quantidade de treinamentos PUBLICADOS, a estante de capas, UM cartão com o formulário do treinamento
 * selecionado e (só em inglês) o seletor de 3 perguntas.
 *
 * Qual capa abre selecionada, nesta ordem:
 *  1. a indicada pelo resultado do seletor (guardada em sessionStorage enquanto a pessoa não escolher
 *     outra capa; vale também ao recarregar a página ou voltar a ela);
 *  2. o parâmetro ?t=N da URL (N = número do treinamento, ex.: ?t=3 = PDF 3);
 *  3. o primeiro treinamento publicado.
 * Ao trocar de capa a URL ganha ?t=N (replaceState, sem recarregar) para o link poder ser compartilhado.
 *
 * Origem do cadastro: "first-steps-quiz" quando o treinamento enviado é o indicado pelo seletor (e só
 * então dispara quiz_result_signup, como antes); senão a origem normal da página.
 */

const QUIZ_PICK_KEY = 'fs_quiz_pick'
const QUIZ_SOURCE = 'first-steps-quiz'
export const QUIZ_ANCHOR = 'find-your-training'

const WORDS = {
  en: ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'],
  pt: ['', 'Um', 'Dois', 'Três', 'Quatro', 'Cinco', 'Seis', 'Sete', 'Oito', 'Nove', 'Dez'],
} as const

function headline(lang: ShelfLang, n: number): string {
  const word = WORDS[lang][n] || String(n)
  if (lang === 'pt') return n === 1 ? `${word} caminho. Escolha o seu.` : `${word} caminhos. Escolha o seu.`
  return n === 1 ? `${word} path. Pick yours.` : `${word} paths. Pick yours.`
}

const TEXT = {
  en: {
    eyebrow: 'First steps',
    sub: 'Swipe and tap the cover that looks like you.',
  },
  pt: {
    eyebrow: 'Primeiros passos',
    sub: 'Deslize e toque na capa que parece com você.',
  },
} as const

// useLayoutEffect no navegador (aplica ?t=N antes da primeira pintura); useEffect no servidor (sem aviso).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function fromParam(value: string | null): Training | null {
  if (!value) return null
  return PUBLISHED_TRAININGS.find((id) => TRAININGS[id].downloadParam === value) ?? null
}

function readQuizPick(): Training | null {
  try {
    const v = window.sessionStorage.getItem(QUIZ_PICK_KEY)
    return PUBLISHED_TRAININGS.find((id) => id === v) ?? null
  } catch {
    return null
  }
}

function writeQuizPick(id: Training | null) {
  try {
    if (id) window.sessionStorage.setItem(QUIZ_PICK_KEY, id)
    else window.sessionStorage.removeItem(QUIZ_PICK_KEY)
  } catch {
    /* sessionStorage indisponível (janela privada, bloqueio): a seleção só não é lembrada. */
  }
}

export default function TrainingsHub({
  lang,
  source,
  track = false,
  messageHref,
  messageExternal = false,
  withQuiz = false,
}: {
  lang: ShelfLang
  /** Origem normal dos cadastros desta página. */
  source: string
  track?: boolean
  messageHref: string
  messageExternal?: boolean
  /** Mostra o seletor de 3 perguntas (só existe em inglês). */
  withQuiz?: boolean
}) {
  const [selected, setSelected] = useState<Training>(PUBLISHED_TRAININGS[0]!)
  const [quizPick, setQuizPick] = useState<Training | null>(null)
  const t = TEXT[lang]

  const writeUrl = useCallback((id: Training) => {
    try {
      const url = new URL(window.location.href)
      if (url.searchParams.get('t') === TRAININGS[id].downloadParam) return
      url.searchParams.set('t', TRAININGS[id].downloadParam)
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
    } catch {
      /* sem history API: só não atualiza o link */
    }
  }, [])

  // Seleção inicial: seletor > ?t=N > primeiro treinamento.
  useIsoLayoutEffect(() => {
    const pick = withQuiz ? readQuizPick() : null
    const fromUrl = fromParam(new URLSearchParams(window.location.search).get('t'))
    const initial = pick ?? fromUrl
    if (pick) {
      setQuizPick(pick)
      writeUrl(pick) // o link compartilhável acompanha a capa que abriu selecionada
    }
    if (initial) setSelected(initial)
  }, [withQuiz, writeUrl])

  // Escolha manual de uma capa: vale a escolha da pessoa (o seletor deixa de mandar na seleção).
  function handleSelect(id: Training) {
    if (id !== selected) {
      setSelected(id)
      writeUrl(id)
    }
    // Escolheu OUTRA capa: o resultado do seletor deixa de mandar (tocar na que já está selecionada não muda nada).
    if (id !== selected && quizPick) {
      setQuizPick(null)
      writeQuizPick(null)
    }
  }

  // O seletor terminou: seleciona a capa indicada e leva a pessoa até a estante.
  function handleQuizResult(id: Training) {
    setQuizPick(id)
    writeQuizPick(id)
    setSelected(id)
    writeUrl(id)
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    document.getElementById('trainings')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  const fromQuiz = quizPick !== null && quizPick === selected

  return (
    <>
      <section id="trainings" aria-label={t.eyebrow} className="mx-auto max-w-content scroll-mt-4 px-6 pt-10 pb-12 md:pt-16 md:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-body text-xs uppercase tracking-widest text-aqua">{t.eyebrow}</p>
          <h1 className="mb-4 font-display text-3xl leading-tight text-charcoal sm:text-4xl md:text-5xl">
            {headline(lang, PUBLISHED_TRAININGS.length)}
          </h1>
          <p className="font-body text-base leading-relaxed text-charcoal/80 md:text-lg">{t.sub}</p>
        </div>

        <div className="-mx-6 mt-4 md:mx-0">
          <TrainingShelf lang={lang} selected={selected} onSelect={handleSelect} />
        </div>

        <TrainingSignupCard
          lang={lang}
          selected={selected}
          source={fromQuiz ? QUIZ_SOURCE : source}
          track={track}
          messageHref={messageHref}
          messageExternal={messageExternal}
          quizHref={withQuiz ? `#${QUIZ_ANCHOR}` : undefined}
          onSignup={(training) => {
            if (fromQuiz) trackEvent('quiz_result_signup', { training, source: QUIZ_SOURCE, lang: 'en' })
          }}
        />
      </section>

      {/* "Qual treinamento é para mim": some sozinho se houver menos de 2 treinamentos publicados. */}
      {withQuiz && <TrainingQuiz anchorId={QUIZ_ANCHOR} onResult={handleQuizResult} />}
    </>
  )
}
