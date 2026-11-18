import type { Metadata } from 'next'
import Link from 'next/link'
import LeadMagnetCard from '@/components/LeadMagnetCard'
import { SITE_URL } from '@/lib/config'

const title = 'First steps | SAL Ray'
const description =
  'A 30-day interactive training PDF to find the pattern running your life. Every box can be filled in, about 20 minutes a day.'
const COVER_URL = `${SITE_URL}/email/training-cover.jpg`
const COVER_ALT = 'Cover of the training: The Same Problem Keeps Finding You'

// Fase B: página pública, indexável e listada no sitemap.
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE_URL}/first-steps/`,
    languages: {
      'en-US': `${SITE_URL}/first-steps/`,
      'pt-BR': `${SITE_URL}/pt/primeiros-passos/`,
    },
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/first-steps/`,
    locale: 'en_US',
    type: 'website',
    images: [{ url: COVER_URL, width: 630, height: 1120, type: 'image/jpeg', alt: COVER_ALT }],
  },
  twitter: { card: 'summary_large_image', images: [{ url: COVER_URL, alt: COVER_ALT }] },
}

const PATTERN_ARTICLE = '/resources/emotional-patterns-self-sabotage/why-do-i-keep-reacting-the-same-way/'

// Itens 2 e 3 ficam sem link por decisão de SAL Ray: ainda não há artigo equivalente.
const steps: { title: string; note: string; href?: string }[] = [
  { title: 'Understand what a pattern is', note: 'The idea behind the whole training.', href: PATTERN_ARTICLE },
  { title: 'Meet the 8 patterns', note: 'See which one sounds like you.' },
  { title: 'See how the 30 days work', note: 'One short page a day, in four weeks.' },
  { title: 'Get your training above and begin with day 1', note: 'Open it in Adobe Acrobat Reader so every box works.' },
]

export default function FirstStepsPage() {
  return (
    <>
      <header className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <span className="font-display font-semibold text-lg text-charcoal">SAL Ray</span>
          <Link href="/" className="font-body text-sm text-charcoal/80 underline underline-offset-4 hover:text-orange">
            Back to the site
          </Link>
        </div>
      </header>

      <main>
        <section className="max-w-content mx-auto px-6 pt-10 pb-8 md:pt-16 md:pb-10">
          <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">First steps</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-charcoal max-w-3xl mb-4">
            Thirty days to find the pattern running your life
          </h1>
          <p className="font-body text-base md:text-lg text-charcoal/80 leading-relaxed max-w-2xl">
            An interactive training PDF. Every box can be filled in, right on your phone or computer. About 20 minutes a
            day.
          </p>
        </section>

        <section aria-label="Get the training" className="max-w-content mx-auto px-6 pb-14 md:pb-20">
          <LeadMagnetCard variant="page" source="first-steps" priority />
        </section>

        <section className="max-w-content mx-auto px-6 pb-14 md:pb-20">
          <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Before you start</p>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-8">Four small steps</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-xl border border-charcoal/15 bg-[#171717] p-5 flex flex-col gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-orange font-body text-sm font-semibold text-offwhite"
                >
                  {i + 1}
                </span>
                <h3 className="font-display text-xl leading-snug text-charcoal">
                  {step.href ? (
                    <Link href={step.href} className="underline underline-offset-4 decoration-charcoal/40 hover:text-orange">
                      {step.title}
                    </Link>
                  ) : (
                    step.title
                  )}
                </h3>
                <p className="font-body text-sm text-charcoal/80 leading-relaxed">{step.note}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="max-w-content mx-auto px-6 pb-12 md:pb-16">
          <div className="grid gap-8 md:grid-cols-[minmax(0,380px)_1fr] md:gap-14 items-center">
            <img
              src="/images/first-steps/sal-ray-stable-shirt.jpg"
              width={720}
              height={900}
              alt="SAL Ray wearing a S.T.A.B.L.E. shirt"
              loading="lazy"
              decoding="async"
              style={{ height: 'auto' }}
              className="w-full max-w-[380px] mx-auto md:mx-0 rounded-xl border border-charcoal/15"
            />
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Who I am</p>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-5">I am SAL Ray</h2>
              <p className="font-body text-charcoal/80 leading-relaxed mb-4 max-w-xl">
                I am an Emotional &amp; Life Rebuilding Coach. I work with women who keep meeting the same problem in a
                different form.
              </p>
              <p className="font-body text-charcoal/80 leading-relaxed max-w-xl">
                I created the S.T.A.B.L.E. method to help you see the pattern first. Then you choose again.
              </p>
            </div>
          </div>
        </section>

        <p className="max-w-content mx-auto px-6 pb-14 text-center font-body text-sm text-charcoal/70">
          Prefer to talk it through?{' '}
          <Link href="/book-a-session/" className="underline underline-offset-4 hover:text-orange">
            Book a session with me
          </Link>
        </p>
      </main>
    </>
  )
}
