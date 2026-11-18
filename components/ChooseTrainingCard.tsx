import Link from 'next/link'
import { PUBLISHED_TRAININGS, TRAININGS } from '@/lib/trainings'

/**
 * Cartão compacto do fim dos artigos em inglês: leva para /first-steps/ (a página de todos os
 * treinamentos). É o mesmo em todos os artigos; não escolhe treinamento por tema. Mostra as capas
 * dos treinamentos publicados (até 3), pequenas e inclinadas.
 */
const TILTS = ['-rotate-6', 'rotate-3', '-rotate-3']

export default function ChooseTrainingCard() {
  const shown = PUBLISHED_TRAININGS.slice(0, 3)

  return (
    <div className="rounded-2xl border border-charcoal/15 bg-[#171717] p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
      <div className="shrink-0 flex items-center justify-center gap-2 py-2" aria-hidden="true">
        {shown.map((id, i) => (
          <img
            key={id}
            src={TRAININGS[id].cover.en}
            width={630}
            height={1120}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ height: 'auto' }}
            className={`w-[64px] sm:w-[72px] ${TILTS[i % TILTS.length]} rounded-sm shadow-[0_14px_28px_rgba(0,0,0,0.6)]`}
          />
        ))}
      </div>
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Interactive training PDFs</p>
        <h2 className="font-display text-xl sm:text-2xl text-charcoal leading-tight mb-2">Choose your training</h2>
        <p className="font-body text-charcoal/80 leading-relaxed mb-4">
          Thirty days to find the pattern running your life. Every box can be filled in. About 20 minutes a day.
        </p>
        <Link
          href="/first-steps/"
          className="inline-block rounded-md bg-orange px-6 py-3 font-body text-sm font-semibold text-offwhite transition-colors hover:bg-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
        >
          See the trainings
        </Link>
      </div>
    </div>
  )
}
