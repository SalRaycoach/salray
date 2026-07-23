import type { CaseStudy } from '@/lib/config'

export default function CaseStudies({ items }: { items: CaseStudy[] }) {
  if (items.length === 0) return null

  return (
    <section className="max-w-2xl mb-12">
      <h2 className="font-display text-2xl text-charcoal mb-6">Case Studies</h2>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="bg-pale-orange rounded-lg p-6">
            <h3 className="font-display text-xl text-charcoal mb-2">{item.title}</h3>
            <p className="font-body text-charcoal/85 leading-relaxed mb-3">{item.summary}</p>
            <p className="font-body text-sm text-charcoal/60">
              <span className="uppercase tracking-widest text-xs">Outcome</span> — {item.outcome}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
