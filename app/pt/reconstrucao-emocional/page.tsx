import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getOffer, isVivenciasLaunchPrice, getMentoriaReconstrucao, getComparisonColumns, comparisonRows, stableMethodPt, ptFaqs, ptTestimonials, buildWhatsAppUrl, whatsapp, PT_CANONICAL_URL, ptPageMeta } from '@/lib/pt-reconstrucao'
import { getReconstrucaoEmocionalSchema } from '@/lib/schema'
import SchemaOrg from '@/components/SchemaOrg'
import OfferCta from './OfferCta'
import MentoriaCta from './MentoriaCta'
import PersonalizadoCta from './PersonalizadoCta'
import ComparisonAction from './ComparisonAction'
import NotifyMeForm from './NotifyMeForm'
import FaqAccordion from './FaqAccordion'
import VideoSection from './VideoSection'
import PageLoadTracker from './PageLoadTracker'

// Rota isolada, própria (briefing seção 18). Desde out 2026 esta página é
// indexável e está no sitemap; só a ferramenta /avaliacao/ continua noindex
// (meta tag e cabeçalho X-Robots-Tag em middleware.ts).
export const metadata: Metadata = {
  title: ptPageMeta.title,
  description: ptPageMeta.description,
  alternates: { canonical: PT_CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: ptPageMeta.title,
    description: ptPageMeta.description,
    url: PT_CANONICAL_URL,
    locale: 'pt_BR',
    type: 'website',
  },
}

// O preço das Vivências muda em 1º/11/2026 (ver getOffer em lib/pt-reconstrucao.ts),
// então esta lista é montada a cada render.
const getQuickChoiceItems = (vivenciasPrice: string) => [
  { anchor: '#primeiro-passo', label: 'Começar de forma simples · US$ 17' },
  { anchor: '#vivencias', label: `Aprofundar no meu ritmo · ${vivenciasPrice}` },
  { anchor: '#mentoria', label: 'Ter direção em grupo · Mentoria' },
  { anchor: '#personalizado', label: 'Trabalhar diretamente com Sal Ray · Personalizado' },
]

const orientationCards = [
  { nivel: 'NÍVEL 1 · COMEÇAR', text: 'Quero experimentar o método com baixo investimento.', linkText: 'Ir para o programa de US$ 17', anchor: '#primeiro-passo' },
  { nivel: 'NÍVEL 2 · APROFUNDAR', text: 'Quero fazer uma reconstrução emocional mais profunda no meu ritmo.', linkText: 'Ir para as 12 vivências', anchor: '#vivencias' },
  { nivel: 'NÍVEL 3 · SER ACOMPANHADO', text: 'Quero direção, encontros ao vivo e apoio em grupo.', linkText: 'Conhecer a mentoria', anchor: '#mentoria' },
  { nivel: 'NÍVEL 4 · PERSONALIZAR', text: 'Quero trabalhar diretamente com Sal Ray sobre a minha situação.', linkText: 'Conhecer o acompanhamento', anchor: '#personalizado' },
]

// Faixa de serviços do Acompanhamento Personalizado (mesmo modelo visual da faixa da Mentoria).
// Nunca publicar e-mail ou telefone do Zelle: os dados são enviados no agendamento.
const personalizadoFaixa = [
  {
    servico: 'consulta' as const,
    rotulo: 'CONSULTA',
    valor: 'US$ 50',
    texto:
      'Comece por aqui. Um encontro para entender o que você está vivendo, identificar os padrões emocionais e de comportamento e definir a direção do seu processo.',
    botao: 'Agendar minha consulta',
    destaque: true,
  },
  {
    servico: 'sessao' as const,
    rotulo: 'SESSÃO',
    valor: 'US$ 80',
    texto:
      'Atendimento individual para trabalhar os padrões emocionais e de comportamento que afetam suas decisões, seus relacionamentos e sua estabilidade emocional, com as ferramentas do Método S.T.A.B.L.E.™.',
    botao: 'Agendar uma sessão',
    destaque: false,
  },
  {
    servico: 'pacote' as const,
    rotulo: 'PACOTE',
    valor: 'US$ 600',
    texto:
      '10 sessões individuais. Equivale a US$ 60 por sessão, US$ 200 a menos do que dez avulsas. Válido por 90 dias a partir da compra.',
    botao: 'Quero o pacote',
    destaque: false,
  },
  {
    servico: null,
    rotulo: 'PAGAMENTO',
    valor: 'Stripe ou Zelle',
    texto: 'Os dados do Zelle são enviados no agendamento.',
    botao: null,
    destaque: false,
  },
]

// Renderizada a cada acesso: a troca de preço de 1º/11/2026 não pede novo deploy.
export const dynamic = 'force-dynamic'

export default function ReconstrucaoEmocionalPage() {
  const now = new Date()
  const primeiroPasso = getOffer('primeiro-passo', now)
  const vivencias = getOffer('vivencias', now)
  const quickChoiceItems = getQuickChoiceItems(vivencias.price ?? '')
  const comparisonColumns = getComparisonColumns(now)
  const personalizado = getOffer('personalizado')
  const ajudaUrl = buildWhatsAppUrl(whatsapp.messages.ajudaParaEscolher)
  const schema = getReconstrucaoEmocionalSchema(now)
  const mentoriaTurma = getMentoriaReconstrucao(now)
  // Vivências: o bloco 1 da faixa e o bloco de preço seguem a mesma data de troca do preço (isVivenciasLaunchPrice).
  const vivenciasLancamento = isVivenciasLaunchPrice(now)
  const vivenciasFaixa = [
    vivenciasLancamento
      ? {
          rotulo: 'VALOR DE LANÇAMENTO ATÉ',
          destaque: <time dateTime="2026-10-31T23:59:00-04:00">31 OUT</time>,
          texto: <>US$ 117. Depois: US$ 147.</>,
        }
      : { rotulo: 'VALOR', destaque: <>US$ 147</>, texto: <>pagamento único</> },
    { rotulo: 'FORMATO', destaque: <>12 áudios</>, texto: <>em sequência, no seu ritmo</> },
    { rotulo: 'PAGAMENTO', destaque: <>Único</>, texto: <>processado pelo Stripe</> },
  ]

  // Tabela de comparação: células com formatação ou link (Ritmo da Mentoria e linha Ação).
  // Mentoria: link para a seção; vira texto simples após o encerramento das inscrições (28/11 23:59, Nova York)
  // ou quando vagasEsgotadas for true. Estados vêm de getMentoriaReconstrucao (fonte única).
  const acaoMentoriaTexto =
    mentoriaTurma.state === 'closed' ? 'Inscrições encerradas' : mentoriaTurma.state === 'soldout' ? 'Vagas esgotadas' : null
  const acaoCelula = (i: number, valor: string, variant: 'link' | 'button') => {
    if (i === 2) {
      return acaoMentoriaTexto ?? <ComparisonAction href="#mentoria" label={valor} offerName="mentoria" variant={variant} />
    }
    if (i === 3) return <ComparisonAction href="#personalizado" label={valor} offerName="consulta" variant={variant} />
    return valor
  }
  const ritmoMentoria = (valor: string) => {
    const destaque = '29 de nov'
    const pos = valor.indexOf(destaque)
    if (pos < 0) return valor
    return (
      <>
        {valor.slice(0, pos)}
        <strong className="font-bold text-[#F7941D]">{destaque}</strong>
        {valor.slice(pos + destaque.length)}
      </>
    )
  }
  const valorCelula = (criterio: string, i: number, valor: string) => {
    if (criterio === 'Ação') return acaoCelula(i, valor, 'link')
    if (criterio === 'Ritmo' && i === 2) return ritmoMentoria(valor)
    return valor
  }
  // Faixa de destaques da mentoria. O bloco 3 segue a mesma data de troca de preço (presale) e o bloco 4
  // a mesma data de encerramento (closed) de getMentoriaReconstrucao: fonte única em lib/pt-reconstrucao.ts.
  const mentoriaFaixa = [
    {
      rotulo: 'INÍCIO',
      destaque: <time dateTime="2026-11-29T19:00:00-05:00">29 NOV</time>,
      texto: <>Domingo, 7 PM, horário da Flórida</>,
    },
    { rotulo: 'ENCONTROS', destaque: <>10</>, texto: <>encontros online de 90 minutos</> },
    mentoriaTurma.presale
      ? {
          rotulo: 'PRÉ-VENDA ATÉ',
          destaque: <time dateTime="2026-11-18T23:59:00-05:00">18 NOV</time>,
          texto: <>US$ 247. Depois: US$ 297</>,
        }
      : { rotulo: 'VALOR', destaque: <>US$ 297</>, texto: <>pagamento único</> },
    mentoriaTurma.closed
      ? {
          rotulo: 'INSCRIÇÕES',
          destaque: <>ENCERRADAS</>,
          texto: (
            <>
              a turma começa em <time dateTime="2026-11-29T19:00:00-05:00">29 de novembro</time>.
            </>
          ),
        }
      : {
          rotulo: 'INSCRIÇÕES ATÉ',
          destaque: <time dateTime="2026-11-28T23:59:00-05:00">28 NOV</time>,
          texto: <>ou até as vagas acabarem</>,
        },
  ]

  return (
    <main id="inicio">
      <SchemaOrg data={schema} />
      <Suspense fallback={null}>
        <PageLoadTracker />
      </Suspense>

      {/* ===== HERO ===== */}
      <section className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">
              MÉTODO S.T.A.B.L.E.™ · EXPERIÊNCIAS EM PORTUGUÊS · 100% ONLINE
            </p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-charcoal mb-6">
              Você está funcionando. Mas não se sente estável por dentro.
            </h1>
            <p className="font-body text-lg text-charcoal/80 leading-relaxed mb-4">
              Quando a mente não desacelera, os mesmos padrões continuam se repetindo ou você carrega tudo por fora
              enquanto se sente sobrecarregado por dentro, o primeiro passo não precisa ser o processo mais caro ou
              mais intenso. Precisa ser o nível de apoio certo para o seu momento.
            </p>
            <p className="font-body text-base text-charcoal/70 leading-relaxed mb-8">
              Escolha entre vivências guiadas em áudio, um processo autoguiado mais profundo, mentoria em grupo ou
              acompanhamento personalizado com Sal Ray.
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <a
                href="#escolher"
                className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
              >
                Encontrar meu ponto de partida
              </a>
              <a
                href="#metodo"
                className="inline-block font-body text-sm font-medium border border-aqua text-aqua px-6 py-3.5 rounded-md hover:bg-aqua hover:text-offwhite transition-colors"
              >
                Conhecer o Método S.T.A.B.L.E.™
              </a>
            </div>
            <p className="font-body text-sm text-charcoal/50">Quatro formas de começar. Uma mesma estrutura de reconstrução.</p>
          </div>
          <div className="relative">
            <Image
              src="/images/hero/hero-desktop.jpg"
              alt="Sal Ray, criador do Método S.T.A.B.L.E.™"
              width={800}
              height={960}
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* ===== BARRA DE ESCOLHA RÁPIDA ===== */}
      <section id="escolher" className="border-b border-charcoal/10 bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-6">
          <h2 className="font-display text-xl text-charcoal mb-4">Como você quer começar?</h2>
          <ul className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
            {quickChoiceItems.map((item) => (
              <li key={item.anchor} className="shrink-0">
                <a
                  href={item.anchor}
                  className="block min-h-[44px] flex items-center font-body text-sm text-charcoal border border-charcoal/20 rounded-md px-4 py-2.5 hover:border-orange hover:text-orange transition-colors whitespace-nowrap"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== ORIENTAÇÃO ===== */}
      <section className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">O COMEÇO CERTO</p>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-8 max-w-2xl">
            Você não precisa escolher o processo mais completo. Precisa escolher o começo certo.
          </h2>
          <div className="max-w-[680px] space-y-4 mb-12">
            <p className="font-body text-charcoal/80 leading-relaxed">
              Algumas pessoas precisam apenas interromper o excesso de pensamentos e experimentar uma primeira
              mudança de estado. Outras já reconhecem padrões repetidos e querem um processo mais profundo. Há
              também quem precise de direção ao vivo, acompanhamento em grupo ou uma análise completamente individual.
            </p>
            <p className="font-body text-charcoal/80 leading-relaxed">
              Por isso, o Método S.T.A.B.L.E.™ pode ser acessado em quatro níveis. Você escolhe de acordo com a
              profundidade, o contato e o investimento que fazem sentido agora.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {orientationCards.map((card) => (
              <div key={card.anchor} className="border border-charcoal/10 rounded-lg p-6 flex flex-col">
                <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{card.nivel}</p>
                <p className="font-body text-charcoal/80 leading-relaxed mb-4 grow">{card.text}</p>
                <a href={card.anchor} className="font-body text-sm text-orange hover:underline underline-offset-2">
                  {card.linkText} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VÍDEO PRINCIPAL ===== */}
      <section className="border-b border-charcoal/10 bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3 text-center">ANTES DE ESCOLHER</p>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4 text-center max-w-2xl mx-auto">
            Por que eu criei quatro formas de começar?
          </h2>
          <p className="font-body text-charcoal/70 leading-relaxed text-center max-w-[620px] mx-auto mb-10">
            Nem toda pessoa precisa do mesmo nível de apoio no mesmo momento. Neste vídeo, Sal Ray explica o que
            conecta todas as opções e como escolher sem pressão.
          </p>
          <VideoSection />
        </div>
      </section>

      {/* ===== AINDA NÃO TEM CERTEZA? — link pras Reflexões gratuitas (pedido
          17 set 2026, revisado 17 set 2026: sem card/fundo próprio — só
          texto centralizado + botão, mesma largura de coluna das outras
          seções de texto centralizado da página, ex. "ANTES DE ESCOLHER"
          logo acima). Sem bg-pale-aqua nem borda — só a seção com fundo
          padrão, que já quebra a sequência de bg-pale-aqua entre o vídeo e
          o Primeiro Passo. */}
      <section className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-10 text-center">
          <h2 className="font-display text-xl text-charcoal mb-2">Ainda não tem certeza?</h2>
          <p className="font-body text-sm text-charcoal/75 leading-relaxed mb-4 max-w-2xl mx-auto">
            Ouça uma reflexão gratuita e conheça meu método antes de decidir.
          </p>
          <Link
            href="/pt/reflexoes/"
            className="inline-block font-body text-sm font-medium border border-aqua text-aqua px-5 py-2.5 rounded-md hover:bg-aqua hover:text-offwhite transition-colors"
          >
            Ouvir Reflexões Gratuitas
          </Link>
        </div>
      </section>

      {/* ===== OFERTA 1 — US$ 17 ===== */}
      <section id="primeiro-passo" className="border-b border-charcoal/10 bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{primeiroPasso.level}</p>
            {primeiroPasso.badge && (
              <p className="font-body text-xs uppercase tracking-widest text-aqua/80 border border-aqua/40 inline-block px-3 py-1 rounded-full mb-4">
                {primeiroPasso.badge}
              </p>
            )}
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">{primeiroPasso.name}</h2>
            <p className="font-body text-charcoal/80 leading-relaxed mb-6 max-w-[620px]">{primeiroPasso.subtitle}</p>

            <p className="font-body text-sm font-semibold text-charcoal mb-1">Para quem é</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-5 max-w-[620px]">{primeiroPasso.paraQuemE}</p>

            <p className="font-body text-sm font-semibold text-charcoal mb-1">O que a pessoa recebe</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-5 max-w-[620px]">{primeiroPasso.oQueRecebe}</p>

            <p className="font-body text-sm font-semibold text-charcoal mb-1">Como funciona</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-8 max-w-[620px]">{primeiroPasso.comoFunciona}</p>

            {primeiroPasso.limites && (
              <p className="font-body text-sm text-charcoal/50 leading-relaxed mb-8 max-w-[620px]">{primeiroPasso.limites}</p>
            )}
          </div>

          <div className="border border-charcoal/15 rounded-lg p-8 bg-offwhite/40">
            <div className="relative aspect-square rounded-md overflow-hidden border border-charcoal/10 mb-6">
              <Image
                src="/images/primeiro-passo/capa.webp"
                alt="Capa digital do Primeiro Passo S.T.A.B.L.E.™"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {primeiroPasso.status === 'recording' ? (
              <>
                <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-aqua border border-aqua/40 bg-aqua/5 px-4 py-2 rounded-full mb-4">
                  Gravação em andamento
                </span>
                <p className="font-body text-charcoal/75 leading-relaxed mb-6">{primeiroPasso.recordingMessage}</p>
                <NotifyMeForm offerId={primeiroPasso.id} offerName={primeiroPasso.name} source="oferta_17" />
              </>
            ) : (
              <>
                <p className="font-display text-4xl text-charcoal mb-1">{primeiroPasso.price}</p>
                <p className="font-body text-sm text-charcoal/60 mb-6">{primeiroPasso.paymentType}</p>
                <OfferCta offer={primeiroPasso} source="oferta_17" />
                <p className="font-body text-xs text-charcoal/50 leading-relaxed mt-4">{primeiroPasso.microtext}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== OFERTA 2 — Vivências (valor de lançamento até 31/10, depois US$ 147) ===== */}
      <section id="vivencias" className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{vivencias.level}</p>
            {vivencias.badge && (
              // Tratamento diferenciado (pedido 17 set 2026): fundo laranja de
              // destaque em vez do outline aqua padrão dos outros rótulos da
              // página — sinaliza oferta por tempo limitado à primeira vista.
              // text-offwhite (não text-charcoal) de propósito: `offwhite` é o
              // tom escuro deste tema invertido — dá ~8:1 de contraste contra
              // o laranja, bem melhor que o ~2:1 que `charcoal` daria aqui.
              <p className="font-body text-xs font-bold uppercase tracking-widest text-offwhite bg-[#F7941D] inline-block px-4 py-1.5 rounded-full mb-4">
                {vivencias.badge}
              </p>
            )}
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">{vivencias.name}</h2>
            <p className="font-body text-charcoal/80 leading-relaxed mb-4 max-w-[620px]">{vivencias.subtitle}</p>
            {vivencias.highlight && (
              <p className="font-body text-sm text-aqua mb-6">{vivencias.highlight}</p>
            )}

            <p className="font-body text-sm font-semibold text-charcoal mb-1">Para quem é</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-5 max-w-[620px]">{vivencias.paraQuemE}</p>

            <p className="font-body text-sm font-semibold text-charcoal mb-1">O que a pessoa recebe</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-5 max-w-[620px]">{vivencias.oQueRecebe}</p>

            <p className="font-body text-sm font-semibold text-charcoal mb-1">Como usar</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-8 max-w-[620px]">
              Seguir a ordem recomendada e reservar um momento seguro, privado e sem interrupções. A orientação é
              não ouvir mais de uma vivência no mesmo dia.
            </p>

            <div className="border border-orange/30 bg-orange/5 rounded-lg p-5 max-w-[620px]">
              <p className="font-body text-xs uppercase tracking-widest text-orange mb-2">Aviso de segurança</p>
              <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                Não ouvir enquanto dirige, opera máquinas, cuida de crianças em situação que exige atenção constante
                ou realiza qualquer atividade que dependa de alerta total. Ouvir somente em local seguro e tranquilo.
              </p>
            </div>
          </div>

          <div className="border border-charcoal/15 rounded-lg p-8 bg-pale-aqua/40">
            <div className="grid grid-cols-4 gap-2 mb-6">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="relative aspect-square rounded overflow-hidden border border-charcoal/10">
                  <Image
                    src={`/images/vivencias/${i + 1}.webp`}
                    alt={`Vivência ${i + 1} de 12`}
                    fill
                    sizes="(max-width: 768px) 25vw, 12vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            {vivencias.status === 'recording' ? (
              <>
                <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-aqua border border-aqua/40 bg-aqua/5 px-4 py-2 rounded-full mb-4">
                  Gravação em andamento
                </span>
                <p className="font-body text-charcoal/75 leading-relaxed mb-6">{vivencias.recordingMessage}</p>
                <NotifyMeForm offerId={vivencias.id} offerName={vivencias.name} source="oferta_147" />
              </>
            ) : (
              <>
                {vivencias.narrativeLine && (
                  <p className="font-body text-sm text-charcoal/70 leading-relaxed mb-4">{vivencias.narrativeLine}</p>
                )}
                {/* Faixa de destaques (mesmo estilo da faixa da Mentoria): 3 blocos iguais, 1 por linha no celular */}
                <ul className="grid grid-cols-1 lg:grid-cols-3 auto-rows-fr gap-3 mb-6">
                  {vivenciasFaixa.map((b) => (
                    <li key={b.rotulo} className="flex flex-col border border-[#F7941D]/40 bg-[#F7941D]/5 rounded-lg p-4">
                      <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#20B9CE] mb-2">{b.rotulo}</p>
                      <p className="font-display text-3xl lg:text-2xl leading-none text-[#F7941D] mb-3 break-words">{b.destaque}</p>
                      <p className="font-body text-sm text-charcoal/70 leading-snug">{b.texto}</p>
                    </li>
                  ))}
                </ul>
                {vivenciasLancamento && (
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#F7941D] mb-2">Valor de lançamento</p>
                )}
                <div className="flex items-baseline gap-3 mb-1">
                  {vivencias.originalPrice && (
                    <span className="font-body text-lg text-charcoal/40 line-through">{vivencias.originalPrice}</span>
                  )}
                  <p className="font-display text-4xl text-charcoal">{vivencias.price}</p>
                </div>
                {vivenciasLancamento && (
                  <p className="font-body text-sm text-[#F7941D] mb-3">
                    Válido até{' '}
                    <time dateTime="2026-10-31T23:59:00-04:00" className="font-bold">
                      31 de outubro
                    </time>
                    . Depois: US$ 147.
                  </p>
                )}
                <p className="font-body text-sm text-charcoal/60 mb-4">{vivencias.paymentType}</p>
                {vivencias.installmentBadge && (
                  <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-aqua border border-aqua/40 bg-aqua/5 px-4 py-2 rounded-full mb-6">
                    {vivencias.installmentBadge}
                  </span>
                )}
                <OfferCta offer={vivencias} source="oferta_147" />
                <p className="font-body text-xs text-charcoal/50 leading-relaxed mt-4">{vivencias.microtext}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== OFERTA 3: MENTORIA DE RECONSTRUÇÃO EMOCIONAL (última turma de 2026; preço e botão mudam por data, ver getMentoriaReconstrucao) ===== */}
      <section id="mentoria" className="border-b border-charcoal/10 bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          {/* Linha 1: etiquetas, título, abertura e destaques à esquerda; imagem à direita (no celular a imagem vem logo depois do título) */}
          <div className="grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] gap-x-12 gap-y-8 mb-12 md:mb-16">
            <div className="lg:col-start-1 lg:row-start-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <p className="font-body text-xs uppercase tracking-widest text-aqua">Nível 3 · Acompanhamento em grupo</p>
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#F7941D] border border-[#F7941D]/50 rounded-full px-3 py-1">
                  Última turma de 2026 · Vagas limitadas
                </p>
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-2">Mentoria de Reconstrução Emocional</h2>
              <p className="font-display text-xl text-[#20B9CE]">Método S.T.A.B.L.E.™</p>
            </div>

            <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
              <Image
                src="/images/mentoria-reconstrucao-emocional.webp"
                alt="Mentoria de Reconstrução Emocional, Método S.T.A.B.L.E.™"
                width={1200}
                height={1200}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 560px"
                className="w-full h-auto rounded-lg"
              />
            </div>

            <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
              <p className="font-body text-lg text-charcoal/90 leading-relaxed mb-6">
                Durante dez encontros ao vivo, você vai aprender a reconhecer os padrões emocionais que se repetem na
                sua vida, compreender suas reações e trabalhar novas maneiras de responder às situações do dia a dia.
              </p>
            </div>
          </div>

          {/* Faixa de destaques: 4 blocos de igual largura e altura (2 por 2 no celular) */}
          <ul className="grid grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-3 md:gap-4 mb-12 md:mb-16">
            {mentoriaFaixa.map((b) => (
              <li
                key={b.rotulo}
                className="flex flex-col border border-[#F7941D]/40 bg-[#F7941D]/5 rounded-lg p-4 md:p-6"
              >
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#20B9CE] mb-2">{b.rotulo}</p>
                <p className="font-display text-3xl md:text-5xl leading-none text-[#F7941D] mb-3 break-words">{b.destaque}</p>
                <p className="font-body text-sm text-charcoal/70 leading-snug">{b.texto}</p>
              </li>
            ))}
          </ul>

          {/* Linha 2: "Para quem é" e corpo à esquerda; "O que está incluído" à direita */}
          <div className="grid lg:grid-cols-2 gap-x-12 gap-y-8 mb-12 md:mb-16">
            <div>
              <p className="font-body text-sm font-semibold text-charcoal mb-1">Para quem é</p>
              <p className="font-body text-charcoal/75 leading-relaxed mb-6">
                Para quem compreende melhor quando pode ouvir uma explicação ao vivo, organizar o que está
                acontecendo, fazer perguntas e acompanhar a aplicação do método junto a outras pessoas.
              </p>
              <div className="space-y-4 font-body text-charcoal/80 leading-relaxed">
                <p>Você já percebeu que algumas situações continuam se repetindo na sua vida, mesmo quando promete que vai agir diferente?</p>
                <p>
                  Talvez você tenha dificuldade para colocar limites, sinta que carrega responsabilidades demais ou
                  perceba que suas emoções continuam influenciando escolhas que gostaria de mudar.
                </p>
                <p>
                  Nos encontros, vamos trabalhar essas situações através do Método S.T.A.B.L.E.™, com reflexões
                  guiadas, exercícios e acompanhamento do seu desenvolvimento.
                </p>
                <p>
                  Você terá um espaço respeitoso para olhar para seus próprios padrões, compreender melhor suas
                  respostas emocionais e praticar mudanças possíveis no seu dia a dia.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-body text-sm font-semibold text-charcoal mb-3">O que está incluído:</h3>
              <ul className="list-disc pl-6 space-y-2 font-body text-charcoal/80 leading-relaxed mb-8">
                <li>10 encontros online de 90 minutos.</li>
                <li>Avaliação inicial individual por formulário.</li>
                <li>Reflexões e exercícios semanais.</li>
                <li>Acompanhamento do progresso durante o programa.</li>
                <li>Plano pessoal para continuar o trabalho após a mentoria.</li>
              </ul>
            </div>
          </div>

          {/* Linha 3: cartão de preço, preço à esquerda e botão à direita */}
          <div className="border border-[#F7941D]/40 bg-[#F7941D]/5 rounded-lg p-6 md:p-8 mb-12 md:mb-16">
            <div className="grid lg:grid-cols-[1fr_minmax(320px,440px)] gap-6 lg:gap-12 items-center">
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#F7941D] mb-2">{mentoriaTurma.priceLabel}</p>
                <div className="flex items-baseline gap-3 mb-1">
                  {mentoriaTurma.strikePrice && (
                    <span className="font-body text-lg text-charcoal/40 line-through">{mentoriaTurma.strikePrice}</span>
                  )}
                  <p className="font-display text-4xl text-charcoal">{mentoriaTurma.price}</p>
                </div>
                {mentoriaTurma.priceNote && (
                  <p className="font-body text-sm text-charcoal/80">
                    Válida até{' '}
                    <time dateTime="2026-11-18T23:59:00-05:00" className="font-bold text-[#F7941D]">
                      18 de novembro
                    </time>
                    . Depois: US$ 297.
                  </p>
                )}
              </div>
              <MentoriaCta
                state={mentoriaTurma.state}
                label={mentoriaTurma.buttonLabel}
                href={mentoriaTurma.checkoutHref}
                price={mentoriaTurma.price}
                source="oferta_mentoria_reconstrucao"
              />
            </div>
            <div className="mt-6 space-y-2">
              {mentoriaTurma.showInstallments && (
                <p className="font-body text-xs text-charcoal/60 leading-relaxed">
                  Parcelamento disponível pelo Affirm ou Klarna, sujeito à aprovação e às condições de cada um, que
                  podem incluir juros.
                </p>
              )}
              <p className="font-body text-xs text-charcoal/60 leading-relaxed">
                Pagamento processado pelo Stripe. Após a confirmação, você receberá por e-mail as datas e as primeiras
                orientações.
              </p>
            </div>
          </div>

          {/* Linha 4: como funciona a inscrição, em duas colunas */}
          <h3 className="font-display text-2xl text-charcoal mb-6">Como funciona a inscrição</h3>
          <ul className="grid md:grid-cols-2 gap-x-12 gap-y-4 font-body text-charcoal/80 leading-relaxed mb-4">
            <li>
              <strong className="text-charcoal">Inscrições:</strong> até{' '}
              <time dateTime="2026-11-28T23:59:00-05:00" className="font-bold text-charcoal">
                28 de novembro de 2026
              </time>
              , ou até as vagas
              acabarem. Depois que o primeiro encontro começar, não é possível entrar na turma.
            </li>
            <li>
              <strong className="text-charcoal">Turma mínima:</strong> a turma acontece com 5 inscrições confirmadas.
              Se esse número não for atingido até 28 de novembro, você recebe 100% do valor pago de volta, inclusive as
              taxas.
            </li>
            <li>
              <strong className="text-charcoal">Desistência:</strong> você pode pedir reembolso em até 7 dias após a
              compra, desde que antes do primeiro encontro. O valor devolvido é o valor pago menos as taxas de
              processamento do pagamento, que o Stripe não devolve. Depois que a turma começa, não há reembolso.
            </li>
            <li>
              <strong className="text-charcoal">Pagamento parcelado:</strong> a devolução segue as regras de cada
              serviço (Affirm ou Klarna).
            </li>
            <li>
              <strong className="text-charcoal">Remarcação:</strong> se eu precisar remarcar um encontro, ele será
              reposto em nova data. Em semanas de feriado, as datas podem ser ajustadas com a turma.
            </li>
          </ul>
          <p className="font-body text-sm text-charcoal/70 leading-relaxed mb-10">
            Veja também a{' '}
            <Link href="/pt/politica-de-cancelamento-mentoria/" className="text-aqua underline underline-offset-2">
              política de cancelamento e reembolso da mentoria em grupo
            </Link>
            .
          </p>

          {/* Linha final: aviso e fechamento */}
          <p className="font-body text-sm text-charcoal/60 leading-relaxed mb-8">
            A mentoria é um programa de coaching e desenvolvimento pessoal, não substituindo psicoterapia ou
            atendimento médico.
          </p>
          <p className="font-display text-xl md:text-2xl text-charcoal">
            Garanta sua vaga na última turma de 2026 da Mentoria de Reconstrução Emocional.
          </p>
        </div>
      </section>

      {/* ===== OFERTA 4: PERSONALIZADO (faixa de serviços no mesmo modelo da faixa da Mentoria) ===== */}
      <section id="personalizado" className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12 md:mb-16">
            <div className="relative order-2 md:order-1">
              <Image
                src="/images/about/sal-ray-portrait.jpg"
                alt="Sal Ray, criador do Método S.T.A.B.L.E.™"
                width={700}
                height={840}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{personalizado.level}</p>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">{personalizado.name}</h2>
              <p className="font-body text-charcoal/80 leading-relaxed max-w-[560px]">{personalizado.subtitle}</p>
            </div>
          </div>

          {/* Faixa de serviços: 4 cartões iguais no desktop; 1 por linha no celular, com o botão logo abaixo do valor */}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:auto-rows-fr gap-4 md:gap-5 mb-12 md:mb-16 pt-3">
            {personalizadoFaixa.map((b) => (
              <li
                key={b.rotulo}
                className={`relative flex flex-col rounded-lg p-5 md:p-6 bg-[#F7941D]/5 ${
                  b.destaque ? 'border-2 border-[#F7941D]' : 'border border-[#F7941D]/40'
                }`}
              >
                {b.destaque && (
                  <span className="absolute -top-3 left-5 bg-[#F7941D] text-[#171717] font-body text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Comece por aqui
                  </span>
                )}
                <p className="order-1 font-body text-xs font-semibold uppercase tracking-widest text-[#20B9CE] mb-2">{b.rotulo}</p>
                <p className="order-2 font-display text-4xl leading-none text-[#F7941D] mb-4 break-words">{b.valor}</p>
                {b.botao && b.servico && (
                  <div className="order-3 lg:order-4 mb-4 lg:mb-0 lg:mt-auto lg:pt-6">
                    <PersonalizadoCta
                      servico={b.servico}
                      label={b.botao}
                      href={buildWhatsAppUrl(whatsapp.messages[b.servico])}
                    />
                  </div>
                )}
                <p className="order-4 lg:order-3 font-body text-sm text-charcoal/70 leading-snug">{b.texto}</p>
              </li>
            ))}
          </ul>

          <div className="grid lg:grid-cols-3 gap-x-12 gap-y-6 mb-12">
            <div>
              <p className="font-body text-sm font-semibold text-charcoal mb-1">Para quem é</p>
              <p className="font-body text-charcoal/75 leading-relaxed">{personalizado.paraQuemE}</p>
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-charcoal mb-1">Como começa</p>
              <p className="font-body text-charcoal/75 leading-relaxed">
                O processo começa com uma conversa estruturada para entender o que está acontecendo, reconhecer os
                padrões mais relevantes e verificar se o acompanhamento é adequado para a situação.
              </p>
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-charcoal mb-1">O que pode incluir</p>
              <p className="font-body text-charcoal/75 leading-relaxed">{personalizado.oQueRecebe}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-charcoal/10 space-y-3">
            <p className="font-body text-xs text-charcoal/50 leading-relaxed">{personalizado.microtext}</p>
            <p className="font-body text-sm text-charcoal/70 leading-relaxed">
              Cancelamento e remarcação: veja a{' '}
              <Link href="/pt/politica-de-cancelamento/" className="text-aqua underline underline-offset-2">
                política de cancelamento
              </Link>
              .
            </p>
            <p className="font-body text-sm text-charcoal/60 leading-relaxed">
              Coaching é um serviço de desenvolvimento pessoal e não substitui psicoterapia ou atendimento médico.
            </p>
          </div>
        </div>
      </section>

      {/* ===== COMPARAÇÃO ===== */}
      <section id="comparar" className="border-b border-charcoal/10 bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">COMPARE COM CLAREZA</p>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4 max-w-2xl">
            Qual nível de apoio faz sentido para você agora?
          </h2>
          <p className="font-body text-charcoal/70 leading-relaxed max-w-[620px] mb-10">
            Nenhuma opção é &ldquo;melhor&rdquo; de forma absoluta. Elas oferecem níveis diferentes de profundidade,
            contato e acompanhamento.
          </p>

          {/* Desktop: tabela real. Mobile: cartões (briefing seção 10 / 19) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-charcoal/20">
                  <th className="text-left font-body text-xs uppercase tracking-widest text-charcoal/50 py-3 pr-4">Critério</th>
                  {comparisonColumns.map((col) => (
                    <th key={col.nome} className="text-left align-top py-3 px-4">
                      <span className="block font-display text-lg text-charcoal leading-snug">{col.nome}</span>
                      {col.prefixo && <span className="block font-body text-xs text-charcoal/60 mt-1">{col.prefixo}</span>}
                      <span className={`block font-display text-2xl text-[#F7941D] ${col.prefixo ? '' : 'mt-1'}`}>{col.preco}</span>
                      {col.nota && <span className="block font-body text-xs text-charcoal/60 mt-1">{col.nota}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.criterio} className="border-b border-charcoal/10">
                    <td className="font-body text-sm font-semibold text-charcoal/70 py-4 pr-4 align-top">{row.criterio}</td>
                    {row.valores.map((valor, i) => (
                      <td key={i} className="font-body text-sm text-charcoal/80 py-4 px-4 align-top">
                        {valorCelula(row.criterio, i, valor)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden grid gap-4">
            {comparisonColumns.map((col, colIndex) => (
              <div key={col.nome} className="border border-charcoal/15 rounded-lg p-5">
                <p className="font-display text-lg text-charcoal leading-snug">{col.nome}</p>
                {col.prefixo && <p className="font-body text-xs text-charcoal/60 mt-1">{col.prefixo}</p>}
                <p className={`font-display text-3xl text-[#F7941D] ${col.nota ? '' : 'mb-4'}`}>{col.preco}</p>
                {col.nota && <p className="font-body text-xs text-charcoal/60 mb-4">{col.nota}</p>}
                <dl className="space-y-2 mb-5">
                  {comparisonRows
                    .filter((row) => row.criterio !== 'Ação')
                    .map((row) => (
                      <div key={row.criterio} className="flex justify-between gap-4 text-sm">
                        <dt className="font-body text-charcoal/50">{row.criterio}:</dt>
                        <dd className="font-body text-charcoal/85 text-right">
                          {valorCelula(row.criterio, colIndex, row.valores[colIndex] ?? '')}
                        </dd>
                      </div>
                    ))}
                </dl>
                <div className="font-body text-sm text-charcoal/85">
                  {acaoCelula(colIndex, comparisonRows.find((row) => row.criterio === 'Ação')?.valores[colIndex] ?? '', 'button')}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-charcoal/10 pt-10 max-w-[620px]">
            <p className="font-body text-sm font-semibold text-charcoal mb-2">Recomendação final</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-6">
              Ainda não sabe qual escolher? Comece pelo Primeiro Passo S.T.A.B.L.E.™ de US$ 17. Ele foi criado para
              apresentar a experiência de maneira acessível e ajudar você a perceber se deseja avançar para um nível
              mais profundo.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="#primeiro-passo"
                className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
              >
                Começar pelo programa de US$ 17
              </a>
              <a
                href={ajudaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-aqua underline underline-offset-2 hover:text-orange transition-colors"
              >
                Prefiro falar com Sal Ray antes de escolher
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MÉTODO ===== */}
      <section id="metodo" className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">UMA MESMA ESTRUTURA</p>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-8 max-w-2xl">
            Quatro formas de começar. Um único método por trás do processo.
          </h2>
          <div className="max-w-[680px] space-y-4 mb-12">
            <p className="font-body text-charcoal/80 leading-relaxed">{stableMethodPt.intro.paragrafo1}</p>
            <p className="font-body text-charcoal/80 leading-relaxed">{stableMethodPt.intro.paragrafo2}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {stableMethodPt.elementos.map((el) => (
              <div key={el.letra} className="border border-charcoal/10 rounded-lg p-6">
                <p className="font-display text-3xl text-orange mb-2">{el.letra}</p>
                <h3 className="font-display text-xl text-charcoal mb-2">{el.nome}</h3>
                <p className="font-body text-charcoal/70 leading-relaxed text-sm">{el.explicacao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOBRE SAL RAY ===== */}
      <section className="border-b border-charcoal/10 bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">QUEM CONDUZ O MÉTODO</p>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6 max-w-lg">
              Uma abordagem calma, precisa e estruturada para reconstrução emocional e de vida.
            </h2>
            <p className="font-body text-charcoal/80 leading-relaxed mb-6 max-w-[560px]">
              Sal Ray é Coach de Reconstrução Emocional e de Vida e criador do Método S.T.A.B.L.E.™. Seu trabalho
              ajuda pessoas que continuam funcionando por fora, mas percebem que a sobrecarga, a repetição de
              padrões ou a falta de direção continuam governando o que acontece por dentro. A abordagem combina
              leitura precisa de padrões, estrutura clara e aplicação prática na vida real.
            </p>
            <p className="font-display text-xl text-charcoal italic">&ldquo;Autoridade vem de precisão, não de intensidade.&rdquo;</p>
          </div>
          <div className="relative">
            <Image
              src="/images/about/sal-ray-portrait.jpg"
              alt="Sal Ray, criador do Método S.T.A.B.L.E.™"
              width={700}
              height={840}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* ===== DEPOIMENTOS — oculto até haver conteúdo real autorizado (briefing seção 13) ===== */}
      {ptTestimonials.length > 0 && (
        <section className="border-b border-charcoal/10">
          <div className="max-w-content mx-auto px-6 py-16 md:py-24">
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-10 text-center">
              O que mudou quando o processo ganhou estrutura
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ptTestimonials.map((t, i) => (
                <div key={i} className="border border-charcoal/10 rounded-lg p-6">
                  <p className="font-body text-charcoal/80 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <p className="font-body text-sm text-charcoal/50">
                    {t.firstName}, {t.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      <section id="duvidas" className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-10">Perguntas frequentes</h2>
          <div className="max-w-[720px]">
            <FaqAccordion faqs={ptFaqs} />
          </div>
        </div>
      </section>

      {/* ===== AVISO PROFISSIONAL — sempre visível, nunca dentro do accordion ===== */}
      <section className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-10">
          <div className="max-w-[720px] bg-pale-aqua rounded-lg p-6">
            <p className="font-body text-sm text-charcoal/80 leading-relaxed mb-3">
              Os conteúdos, programas e serviços apresentados nesta página são educacionais e voltados ao coaching e
              ao desenvolvimento pessoal. Eles não prestam serviços médicos ou de saúde mental e não substituem
              psicoterapia, psiquiatria, atendimento médico ou serviços de emergência. Resultados variam de pessoa
              para pessoa.
            </p>
            <p className="font-body text-sm text-charcoal/80 leading-relaxed">
              Se você estiver em crise ou em perigo imediato nos Estados Unidos, ligue ou envie uma mensagem para 988
              ou procure os serviços de emergência locais.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 text-center">
          <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">SEU PRÓXIMO PASSO</p>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4 max-w-2xl mx-auto">
            Você não precisa resolver tudo hoje. Precisa apenas escolher o primeiro passo certo.
          </h2>
          <p className="font-body text-charcoal/70 leading-relaxed max-w-[560px] mx-auto mb-8">
            Se você ainda não sabe qual nível escolher, comece pela experiência de US$ 17. Se sente que precisa de
            análise individual, fale diretamente com Sal Ray.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#primeiro-passo"
              className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
            >
              Começar agora por US$ 17
            </a>
            <a
              href={ajudaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-body text-sm font-medium border border-aqua text-aqua px-6 py-3.5 rounded-md hover:bg-aqua hover:text-offwhite transition-colors"
            >
              Preciso de ajuda para escolher
            </a>
          </div>
        </div>
      </section>

      {/* ===== MENÇÃO ÀS REFLEXÕES — bloco secundário e discreto, depois do CTA
           final pra não competir com ele (pedido 27 ago 2026) ===== */}
      <section className="border-t border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-8 text-center">
          <p className="font-body text-sm text-charcoal/50">
            Enquanto isso, ouça as{' '}
            <Link href="/pt/reflexoes/" className="text-aqua hover:text-orange underline underline-offset-2">
              Reflexões gratuitas
            </Link>
            : novo conteúdo toda segunda, quarta e sexta.
          </p>
        </div>
      </section>
    </main>
  )
}
