import Link from 'next/link'

/**
 * Bloco "Start here" da home (Fase B do PDF 1): leva para /first-steps/, onde
 * fica o cartão de captura. Entra logo depois do Hero, sem substituir nada.
 */
export default function StartHere() {
  return (
    <section aria-labelledby="start-here-title" className="border-b border-charcoal/10">
      <div className="max-w-content mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="shrink-0 py-2">
          <img
            src="/email/training-cover.jpg"
            width={630}
            height={1120}
            alt="Cover of the training: The Same Problem Keeps Finding You"
            loading="lazy"
            decoding="async"
            style={{ height: 'auto' }}
            className="w-[170px] sm:w-[220px] md:w-[260px] -rotate-6 rounded-sm shadow-[0_22px_44px_rgba(0,0,0,0.6)]"
          />
        </div>
        <div className="max-w-xl text-center md:text-left">
          <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">Start here</p>
          <h2 id="start-here-title" className="font-display text-3xl md:text-4xl leading-tight text-charcoal mb-4">
            Thirty days to find the pattern running your life
          </h2>
          <p className="font-body text-base md:text-lg text-charcoal/80 leading-relaxed mb-7">
            An interactive training PDF. You write in it, one short page a day, and the same problem stops finding you.
          </p>
          <Link
            href="/first-steps/"
            className="inline-block rounded-md bg-orange px-7 py-3.5 font-body text-sm font-semibold text-offwhite transition-colors hover:bg-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite"
          >
            Get the training
          </Link>
        </div>
      </div>
    </section>
  )
}
