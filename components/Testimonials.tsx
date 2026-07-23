import Image from 'next/image'
import type { Testimonial } from '@/lib/config'

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null

  return (
    <>
      <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-6">What Clients Say</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <blockquote key={index} className="bg-pale-aqua rounded-lg p-6">
            <p className="font-body text-charcoal/85 leading-relaxed italic mb-4">&ldquo;{item.quote}&rdquo;</p>
            <footer className="flex items-center gap-3 font-body text-sm text-charcoal/60">
              {item.photo && (
                <Image src={item.photo} alt={item.name} width={40} height={40} className="rounded-full object-cover" />
              )}
              {item.name}
            </footer>
          </blockquote>
        ))}
      </div>
    </>
  )
}
