import Image from 'next/image'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getOffer, comparisonColumns, comparisonRows, stableMethodPt, ptFaqs, ptTestimonials, buildWhatsAppUrl, whatsapp, PT_CANONICAL_URL } from '@/lib/pt-reconstrucao'
import OfferCta from './OfferCta'
import FaqAccordion from './FaqAccordion'
import VideoSection from './VideoSection'
import PageLoadTracker from './PageLoadTracker'

export const metadata: Metadata = {
  alternates: { canonical: PT_CANONICAL_URL },
  robots: { index: false, follow: false },
}

const quickChoiceItems = [
  { anchor: '#primeiro-passo', label: 'Começar de forma simples · US$ 17' },
  { anchor: '#vivencias', label: 'Aprofundar no meu ritmo · US$ 147' },
  { anchor: '#mentoria', label: 'Ter direção em grupo · Mentoria' },
  { anchor: '#personalizado', label: 'Trabalhar diretamente com Sal Ray · Personalizado' },
]

const orientationCards = [
  { nivel: 'NÍVEL 1 · COMEÇAR', text: 'Quero experimentar o método com baixo investimento.', linkText: 'Ir para o programa de US$ 17', anchor: '#primeiro-passo' },
  { nivel: 'NÍVEL 2 · APROFUNDAR', text: 'Quero fazer uma reconstrução emocional mais profunda no meu ritmo.', linkText: 'Ir para as 12 vivências', anchor: '#vivencias' },
  { nivel: 'NÍVEL 3 · SER ACOMPANHADO', text: 'Quero direção, encontros ao vivo e apoio em grupo.', linkText: 'Conhecer a mentoria', anchor: '#mentoria' },
  { nivel: 'NÍVEL 4 · PERSONALIZAR', text: 'Quero trabalhar diretamente com Sal Ray sobre a minha situação.', linkText: 'Conhecer o acompanhamento', anchor: '#personalizado' },
]

export default function ReconstrucaoEmocionalPage() {
  const primeiroPasso = getOffer('primeiro-passo')
  const vivencias = getOffer('vivencias')
  const mentoria = getOffer('mentoria')
  const personalizado = getOffer('personalizado')
  const ajudaUrl = buildWhatsAppUrl(whatsapp.messages.ajudaParaEscolher)

  return (
    <main id="inicio">
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
            <div
              aria-hidden="true"
              className="aspect-square rounded-md bg-offwhite/60 border border-charcoal/10 flex items-center justify-center mb-6"
            >
              <span className="font-body text-xs text-charcoal/40 text-center px-4">
                Capa digital · fones · 6 faixas numeradas
              </span>
            </div>
            <p className="font-display text-4xl text-charcoal mb-1">{primeiroPasso.price}</p>
            <p className="font-body text-sm text-charcoal/60 mb-6">{primeiroPasso.paymentType}</p>
            <OfferCta offer={primeiroPasso} source="oferta_17" />
            <p className="font-body text-xs text-charcoal/50 leading-relaxed mt-4">{primeiroPasso.microtext}</p>
          </div>
        </div>
      </section>

      {/* ===== OFERTA 2 — US$ 147 ===== */}
      <section id="vivencias" className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{vivencias.level}</p>
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
            <div aria-hidden="true" className="grid grid-cols-4 gap-2 mb-6">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded bg-offwhite/60 border border-charcoal/10 flex items-center justify-center font-display text-charcoal/40 text-sm"
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
              ))}
            </div>
            <p className="font-display text-4xl text-charcoal mb-1">{vivencias.price}</p>
            <p className="font-body text-sm text-charcoal/60 mb-6">{vivencias.paymentType}</p>
            <OfferCta offer={vivencias} source="oferta_147" />
            <p className="font-body text-xs text-charcoal/50 leading-relaxed mt-4">{vivencias.microtext}</p>
          </div>
        </div>
      </section>

      {/* ===== OFERTA 3 — MENTORIA ===== */}
      <section id="mentoria" className="border-b border-charcoal/10 bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24">
          <div className="max-w-[680px]">
            <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{mentoria.level}</p>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">{mentoria.name}</h2>
            <p className="font-body text-charcoal/80 leading-relaxed mb-6">{mentoria.subtitle}</p>

            <p className="font-body text-sm font-semibold text-charcoal mb-1">Para quem é</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-5">{mentoria.paraQuemE}</p>

            <p className="font-body text-sm font-semibold text-charcoal mb-1">O que a pessoa recebe</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-8">{mentoria.oQueRecebe}</p>

            <div className="border border-charcoal/15 rounded-lg p-6 mb-6">
              <OfferCta offer={mentoria} source="oferta_mentoria" />
              <p className="font-body text-xs text-charcoal/50 leading-relaxed mt-4">{mentoria.microtext}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OFERTA 4 — PERSONALIZADO ===== */}
      <section id="personalizado" className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
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
            <p className="font-body text-charcoal/80 leading-relaxed mb-6 max-w-[560px]">{personalizado.subtitle}</p>

            <p className="font-body text-sm font-semibold text-charcoal mb-1">Para quem é</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-5 max-w-[560px]">{personalizado.paraQuemE}</p>

            <p className="font-body text-sm font-semibold text-charcoal mb-1">Como começa</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-5 max-w-[560px]">
              O processo começa com uma conversa estruturada para entender o que está acontecendo, reconhecer os
              padrões mais relevantes e verificar se o acompanhamento é adequado para a situação.
            </p>

            <p className="font-body text-sm font-semibold text-charcoal mb-1">O que pode incluir</p>
            <p className="font-body text-charcoal/75 leading-relaxed mb-8 max-w-[560px]">{personalizado.oQueRecebe}</p>

            <OfferCta offer={personalizado} source="oferta_personalizado" />
            <p className="font-body text-xs text-charcoal/50 leading-relaxed mt-4 max-w-[560px]">{personalizado.microtext}</p>
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
                    <th key={col} className="text-left font-display text-lg text-charcoal py-3 px-4">
                      {col}
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
                        {valor}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden grid gap-4">
            {comparisonColumns.map((col, colIndex) => (
              <div key={col} className="border border-charcoal/15 rounded-lg p-5">
                <p className="font-display text-lg text-charcoal mb-3">{col}</p>
                <dl className="space-y-2">
                  {comparisonRows.map((row) => (
                    <div key={row.criterio} className="flex justify-between gap-4 text-sm">
                      <dt className="font-body text-charcoal/50">{row.criterio}</dt>
                      <dd className="font-body text-charcoal/85 text-right">{row.valores[colIndex]}</dd>
                    </div>
                  ))}
                </dl>
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
    </main>
  )
}
