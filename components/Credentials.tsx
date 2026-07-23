import type { Credential } from '@/lib/config'

export default function Credentials({ items }: { items: Credential[] }) {
  if (items.length === 0) return null

  return (
    <section className="max-w-2xl mb-12">
      <h2 className="font-display text-2xl text-charcoal mb-4">Credentials & Training</h2>
      <ul className="font-body text-charcoal/85 leading-relaxed space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            {item.title}
            {item.issuer && <span className="text-charcoal/60"> — {item.issuer}</span>}
            {item.year && <span className="text-charcoal/60"> ({item.year})</span>}
          </li>
        ))}
      </ul>
    </section>
  )
}
