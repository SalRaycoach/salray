import Link from 'next/link'
import { PUBLISHED_TRAININGS, TRAININGS } from '@/lib/trainings'

/**
 * Bloco "Start here" da home: leva para /first-steps/, a página de todos os treinamentos.
 * Texto genérico (vale para qualquer treinamento). Mostra as capas dos treinamentos publicados lado
 * a lado (até 3, inclinadas em sentidos opostos); com mais treinamentos publicados, as 3 primeiras.
 * Entra logo depois do Hero, sem substituir nada.
 */
const TILTS = ['-rotate-6', 'rotate-3', '-rotate-3']

export default function StartHere() {
  const shown = PUBLISHED_TRAININGS.slice(0, 3)

  return (
    <section aria-labelledby="start-here-title" className="border-b border-charcoal/10">
      <div className="max-w-content mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="shrink-0 py-2 flex items-center justify-center gap-3 sm:gap-5">
          {shown.map((id, i) => (
            <img
              key={id}
              src={TRAININGS[id].cover.en}
              width={630}
              height={1120}
              alt={`Cover of the training: ${TRAININGS[id].title.en}`}
              loading="lazy"
              decoding="async"
              style={{ height: 'auto' }}
              className={`${shown.length === 1 ? 'w-[170px] sm:w-[220px] md:w-[260px]' : 'w-[122px] sm:w-[170px] md:w-[190px]'} ${TILTS[i % TILTS.length]} rounded-sm shadow-[0_22px_44px_rgba(0,0,0,0.6)]`}
            />
          ))}
        </div>
        <div className="max-w-xl text-center md:text-left">
          <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">Start here</p>
          <h2 id="start-here-title" className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-4">
            Thirty days to find the pattern running your life
          </h2>
          <p className="font-body text-base md:text-lg text-charcoal/80 leading-relaxed mb-7">
            Interactive training PDFs. You write in them, one short page a day, and start choosing differently.
          </p>
          <Link
            href="/first-steps/"
            className="inline-block rounded-md bg-orange px-7 py-3.5 font-body text-sm font-semibold text-offwhite transition-colors hover:bg-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite"
          >
            Choose your training
          </Link>
        </div>
      </div>
    </section>
  )
}
