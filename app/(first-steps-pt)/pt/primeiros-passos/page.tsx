import type { Metadata } from 'next'
import Link from 'next/link'
import TrainingsHub from '@/components/TrainingsHub'
import { SITE_URL } from '@/lib/config'
import { buildWhatsAppUrl } from '@/lib/pt-reconstrucao'

const title = 'Primeiros passos | SAL Ray'
const description =
  'PDFs interativos de treinamento de 30 dias. Escolha o que mais se parece com você hoje. Cada caixa pode ser preenchida, cerca de 20 minutos por dia.'
const COVER_URL = `${SITE_URL}/email/training-cover-pt.jpg`
const COVER_ALT = 'Capa do treinamento: O Mesmo Problema Continua Te Encontrando'

// Fase B: página pública, indexável, no sitemap e com hreflang ligado nas duas páginas.
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE_URL}/pt/primeiros-passos/`,
    languages: {
      'en-US': `${SITE_URL}/first-steps/`,
      'pt-BR': `${SITE_URL}/pt/primeiros-passos/`,
    },
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/pt/primeiros-passos/`,
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: COVER_URL, width: 630, height: 1120, type: 'image/jpeg', alt: COVER_ALT }],
  },
  twitter: { card: 'summary_large_image', images: [{ url: COVER_URL, alt: COVER_ALT }] },
}

const OS_8_PADROES = '/pt/recursos/os-8-padroes/'

// Só "Os 8 Padrões" tem artigo em português; os outros dois itens ficam só como texto.
const steps: { title: string; note: string; href?: string }[] = [
  { title: 'Entenda o que é um padrão', note: 'A ideia por trás de todo o treinamento.' },
  { title: 'Conheça os 8 padrões', note: 'Veja qual deles parece com você.', href: OS_8_PADROES },
  { title: 'Veja como funcionam os 30 dias', note: 'Uma página curta por dia, em quatro semanas.' },
  { title: 'Receba o treinamento acima e comece pelo dia 1', note: 'Abra no Adobe Acrobat Reader para que todas as caixas funcionem.' },
]

export default function PrimeirosPassosPage() {
  return (
    <>
      <header className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <span className="font-display font-semibold text-lg text-charcoal">SAL Ray</span>
          <Link href="/" className="font-body text-sm text-charcoal/80 underline underline-offset-4 hover:text-orange">
            Voltar ao site
          </Link>
        </div>
      </header>

      <main>
        {/* Título com a quantidade de treinamentos publicados, estante de capas e UM formulário
            (lib/trainings.ts manda: publicar mais um já o inclui). Não há seletor em português. */}
        <TrainingsHub
          lang="pt"
          source="primeiros-passos"
          messageHref={buildWhatsAppUrl('Olá, Sal Ray. Estou em dúvida sobre qual treinamento escolher e queria uma ajuda.')}
          messageExternal
        />

        <section className="max-w-content mx-auto px-6 pb-14 md:pb-20">
          <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Antes de começar</p>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-8">Quatro passos curtos</h2>
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
              alt="SAL Ray usando uma camisa S.T.A.B.L.E."
              loading="lazy"
              decoding="async"
              style={{ height: 'auto' }}
              className="w-full max-w-[380px] mx-auto md:mx-0 rounded-xl border border-charcoal/15"
            />
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-aqua mb-2">Quem sou eu</p>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-5">Eu sou SAL Ray</h2>
              <p className="font-body text-charcoal/80 leading-relaxed mb-4 max-w-xl">
                Sou Coach de Reconstrução Emocional e de Vida. Trabalho com mulheres que continuam encontrando o mesmo
                problema de formas diferentes.
              </p>
              <p className="font-body text-charcoal/80 leading-relaxed max-w-xl">
                Criei o método S.T.A.B.L.E. para ajudar você a ver o padrão primeiro. Depois você escolhe de novo.
              </p>
            </div>
          </div>
        </section>

        {/* Não há página de sessão dedicada em português: a mais próxima é a seção de sessões
            de /pt/reconstrucao-emocional/. */}
        <p className="max-w-content mx-auto px-6 pb-14 text-center font-body text-sm text-charcoal/70">
          Prefere conversar?{' '}
          <Link href="/pt/reconstrucao-emocional/#personalizado" className="underline underline-offset-4 hover:text-orange">
            Agende uma sessão comigo
          </Link>
        </p>
      </main>
    </>
  )
}
