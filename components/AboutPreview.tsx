import Image from 'next/image'
import Link from 'next/link'
import { business } from '@/lib/config'

export default function AboutPreview() {
  return (
    <section className="border-b border-charcoal/10 bg-pale-orange">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24 grid md:grid-cols-[280px_1fr] gap-12 items-start">
        <Image
          src="/images/hero/hero-mobile.jpg"
          alt={business.nome}
          width={420}
          height={504}
          className="w-full max-w-[280px] h-auto object-cover rounded-lg"
        />

        <div>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
            A calm, structured approach to emotional and life rebuilding.
          </h2>

          <p className="font-body text-lg text-charcoal/80 leading-relaxed mb-8 max-w-xl">
            {business.nome} is an {business.posicionamento.toLowerCase()} and coach who helps adults recognize the
            deeper patterns keeping them stuck. His work combines precise pattern recognition, structured personal
            development, and non-clinical tools designed to support clarity, stability, and responsible forward
            movement.
          </p>

          <Link href="/about/" className="font-body text-sm font-medium text-aqua hover:text-charcoal">
            Meet Sal Ray →
          </Link>
        </div>
      </div>
    </section>
  )
}
