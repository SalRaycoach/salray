import SalRayTopPhoto from '@/components/SalRayTopPhoto'
import Link from 'next/link'
import { business, ctas } from '@/lib/config'

export default function Hero() {
  return (
    <section className="border-b border-charcoal/10">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">
            {business.posicionamento} · 100% Online
          </p>

          <h1 className="font-display text-4xl md:text-5xl leading-tight text-charcoal mb-6">
            Understand the pattern. Rebuild your emotional stability.
          </h1>

          <p className="font-body text-lg text-charcoal/80 leading-relaxed mb-8">
            When you feel stuck in overthinking, repeating emotional cycles, or a life that no longer feels like
            your own, the first step is not more pressure. It is understanding what needs to be rebuilt.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/book-a-session/"
              data-event="book_session_cta_click"
              className="inline-block font-body text-sm font-medium bg-charcoal text-offwhite px-6 py-3.5 rounded-md hover:bg-orange hover:text-charcoal transition-colors"
            >
              {ctas.primary}
            </Link>
            <Link
              href="/how-i-help/"
              className="inline-block font-body text-sm font-medium border border-orange text-orange px-6 py-3.5 rounded-md hover:bg-orange hover:text-charcoal transition-colors"
            >
              See How I Help
            </Link>
          </div>
        </div>

        <div className="relative">
          <SalRayTopPhoto sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1180px) calc(50vw - 48px), 542px" style={{ opacity: 1 }} />
        </div>
      </div>
    </section>
  )
}
