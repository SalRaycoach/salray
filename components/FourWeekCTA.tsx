import Link from 'next/link'
import { fourWeekExperience } from '@/lib/config'

export default function FourWeekCTA() {
  // Quando as vagas fecham, a seção some junto com o item do menu.
  if (fourWeekExperience.status === 'closed') return null

  return (
    <section className="border-b border-charcoal/10 bg-pale-aqua">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6 max-w-xl mx-auto">
          You do not have to figure everything out alone.
        </h2>

        <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-xl mx-auto mb-8">
          The 4-Week Experience is a private, non-clinical coaching space with SAL Ray to look at the patterns that
          keep repeating in your life. Three participants are selected at no cost.
        </p>

        {/* CTA secundário — nunca mais forte visualmente que o CTA de consulta (borda, sem preenchimento sólido) */}
        <Link
          href="/4-week-experience/#application"
          data-event="four_week_apply_click"
          className="inline-block font-body text-sm font-medium border border-aqua text-charcoal px-6 py-3 rounded-md hover:bg-aqua hover:text-charcoal transition-colors"
        >
          Apply for the 4-Week Experience
        </Link>
      </div>
    </section>
  )
}
