'use client'

import { useEffect, useRef, useState } from 'react'
import { PUBLISHED_TRAININGS, TRAININGS, coverThumb, type Training } from '@/lib/trainings'
import type { ShelfLang } from '@/components/TrainingSignupCard'

/**
 * "Estante de capas" dos treinamentos publicados. Cada capa é um botão real (teclado e leitor de tela,
 * aria-pressed). No celular a fileira desliza com scroll-snap, a próxima capa aparece cortada na borda
 * direita (com um leve esmaecido) e as bolinhas mostram qual está selecionada. A partir de md todas as
 * capas ficam lado a lado, sem deslizar.
 *
 * A capa selecionada fica maior, com opacidade total e borda laranja; as outras ficam menores e
 * esmaecidas. Só transform e opacidade mudam (nada de reflow), então não há salto de layout.
 *
 * Lista = PUBLISHED_TRAININGS (lib/trainings.ts): 4, 5 ou 6 capas funcionam sem mexer aqui.
 */

const ALT_PREFIX = { en: 'Cover of the training', pt: 'Capa do treinamento' } as const
const GROUP_LABEL = { en: 'The trainings', pt: 'Os treinamentos' } as const

export default function TrainingShelf({
  lang,
  selected,
  onSelect,
}: {
  lang: ShelfLang
  selected: Training
  onSelect: (id: Training) => void
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const firstCenter = useRef(true)
  const [atEnd, setAtEnd] = useState(false)

  // Centraliza a capa selecionada na fileira (só mexe no scroll da fileira, nunca no da página).
  // Na primeira vez (inclusive ?t=N) vai direto, sem animar.
  useEffect(() => {
    const scroller = scrollerRef.current
    const el = itemRefs.current[selected]
    if (!scroller || !el) return
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const left = el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2
    scroller.scrollTo({ left: Math.max(0, left), behavior: firstCenter.current || reduce ? 'auto' : 'smooth' })
    firstCenter.current = false
  }, [selected])

  function updateEdge() {
    const s = scrollerRef.current
    if (!s) return
    setAtEnd(s.scrollLeft + s.clientWidth >= s.scrollWidth - 8)
  }

  useEffect(() => {
    updateEdge()
    window.addEventListener('resize', updateEdge)
    return () => window.removeEventListener('resize', updateEdge)
  }, [])

  return (
    <div>
      <div className="relative">
      <div
        ref={scrollerRef}
        role="group"
        aria-label={GROUP_LABEL[lang]}
        onScroll={updateEdge}
        // Mobile: fileira que desliza, com espaço dos dois lados para qualquer capa poder ficar no centro.
        // md+: sem rolagem, todas lado a lado.
        className="flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-[calc(50%-75px)] py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:snap-none md:justify-center md:gap-5 md:overflow-visible md:px-0"
      >
        {PUBLISHED_TRAININGS.map((id, i) => {
          const active = id === selected
          const info = TRAININGS[id]
          const title = info.title[lang]
          return (
            <button
              key={id}
              ref={(el) => {
                itemRefs.current[id] = el
              }}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(id)}
              className={`group relative w-[150px] shrink-0 snap-center rounded-md border-2 transition-[transform,opacity,border-color,box-shadow] duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-4 focus-visible:ring-offset-offwhite motion-reduce:transition-none md:w-auto md:max-w-[200px] md:shrink md:flex-1 ${
                active
                  ? 'z-10 scale-[1.08] border-orange opacity-100 shadow-[0_22px_44px_rgba(0,0,0,0.7)] md:scale-110'
                  : 'scale-[0.88] border-transparent opacity-70 hover:opacity-90 md:scale-95'
              }`}
            >
              <img
                src={coverThumb(id, lang)}
                width={400}
                height={711}
                alt={`${ALT_PREFIX[lang]}: ${title}`}
                // Só a primeira capa (a imagem principal da página) carrega já; as demais, ao se aproximar.
                loading={i < 1 ? 'eager' : 'lazy'}
                {...(i === 0 ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
                decoding="async"
                draggable={false}
                style={{ height: 'auto' }}
                // Sem a miniatura (treinamento novo ainda sem ela): cai na capa grande.
                onError={(e) => {
                  const img = e.currentTarget
                  if (img.dataset.fallback) return
                  img.dataset.fallback = '1'
                  img.src = info.cover[lang]
                }}
                className="block w-full rounded-[3px]"
              />
            </button>
          )
        })}
      </div>

      {/* Esmaecido na borda direita: avisa que há mais capas (some no fim da fileira e no computador). */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-offwhite to-transparent transition-opacity duration-200 md:hidden ${
          atEnd ? 'opacity-0' : 'opacity-100'
        }`}
      />
      </div>

      {/* Bolinhas (só no celular): a ativa é mais comprida e laranja. */}
      <div aria-hidden="true" className="flex justify-center gap-2 md:hidden">
        {PUBLISHED_TRAININGS.map((id) => (
          <span
            key={id}
            className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
              id === selected ? 'w-6 bg-orange' : 'w-2 bg-charcoal/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
