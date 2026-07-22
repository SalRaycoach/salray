import Link from 'next/link'
import { helpAreas } from '@/lib/config'

export default function HelpAreas() {
  return (
    <section className="border-b border-charcoal/10">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24">
        <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-10 max-w-xl">
          What may need to be rebuilt?
        </h2>

        <ul className="grid sm:grid-cols-2 gap-4 mb-10">
          {helpAreas.map((area) => (
            <li key={area} className="flex items-start gap-3 font-body text-charcoal/85 leading-relaxed">
              <span className="text-aqua mt-1">—</span>
              {area}
            </li>
          ))}
        </ul>

        <Link
          href="/how-i-help/"
          className="inline-block font-body text-sm font-medium border border-charcoal text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          Explore How I Help
        </Link>
      </div>
    </section>
  )
}
