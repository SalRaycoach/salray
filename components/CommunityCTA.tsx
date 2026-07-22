import { contato, ctas } from '@/lib/config'

export default function CommunityCTA() {
  const isPending = contato.facebookGroupUrl.startsWith('PENDENTE_')

  return (
    <section className="border-b border-charcoal/10 bg-pale-aqua">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6 max-w-xl mx-auto">
          You do not have to figure everything out alone.
        </h2>

        <p className="font-body text-lg text-charcoal/80 leading-relaxed max-w-xl mx-auto mb-8">
          Join a private Facebook community focused on emotional strength, clear thinking, and rebuilding life with
          greater stability.
        </p>

        {/* CTA secundário — nunca mais forte visualmente que o CTA de consulta (borda, sem preenchimento sólido) */}
        <a
          href={isPending ? undefined : contato.facebookGroupUrl}
          target={isPending ? undefined : '_blank'}
          rel={isPending ? undefined : 'noopener noreferrer'}
          aria-disabled={isPending}
          data-event="community_cta_click"
          className="inline-block font-body text-sm font-medium border border-aqua text-charcoal px-6 py-3 rounded-md hover:bg-aqua hover:text-charcoal transition-colors aria-disabled:opacity-50 aria-disabled:pointer-events-none"
        >
          {ctas.secondary}
        </a>
      </div>
    </section>
  )
}
