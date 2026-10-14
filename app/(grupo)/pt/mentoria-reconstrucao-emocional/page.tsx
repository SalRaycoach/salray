import type { Metadata } from 'next'
import { getMentoriaReconstrucao } from '@/lib/pt-reconstrucao'
import GroupButton from './GroupButton'

// Página de captura para anúncios: fora do sitemap, noindex, e renderizada a cada acesso só para a
// frase da mentoria nas perguntas (ela some depois do encerramento das inscrições).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Grupo do WhatsApp Reconstrução Emocional | SAL Ray',
  description: 'Entre no grupo Reconstrução Emocional de Sal Ray no WhatsApp.',
  robots: { index: false, follow: false },
}

const faixa = [
  { rotulo: 'SEG · QUA · SEX', texto: 'Reflexões em áudio para levar para a vida.' },
  { rotulo: 'DOMINGO', texto: 'Vídeo com reflexões mais profundas sobre comportamento e reconstrução emocional.' },
  { rotulo: 'EM ALGUNS DOMINGOS', texto: 'Aulas ao vivo.' },
  { rotulo: 'OCASIONALMENTE', texto: 'Consultas gratuitas, conforme disponibilidade.' },
]

export default function GrupoGratuitoPage() {
  const mentoria = getMentoriaReconstrucao()
  const inscricoesAbertas = mentoria.state !== 'closed' && mentoria.state !== 'soldout'

  const perguntas: { pergunta: string; resposta: string }[] = [
    { pergunta: 'É gratuito?', resposta: 'Sim.' },
    { pergunta: 'Preciso participar?', resposta: 'Não. Você pode só acompanhar.' },
    { pergunta: 'Posso sair quando quiser?', resposta: 'Sim, a qualquer momento.' },
    {
      pergunta: 'Meu número aparece?',
      resposta: 'Em grupos do WhatsApp, os outros participantes podem ver o número de quem entra.',
    },
    {
      pergunta: 'E a mentoria?',
      resposta:
        'Em alguns períodos do ano, abro a mentoria ao vivo, que é paga. Quando abrir, aviso no grupo. Você pode continuar só no grupo gratuito, sem comprar.' +
        (inscricoesAbertas ? ' Agora estão abertas as inscrições da última turma de 2026.' : ''),
    },
  ]

  return (
    <main>
      {/* Topo: título, subtítulo e botão. No celular a imagem vem logo depois do botão. */}
      <section className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">GRUPO DO WHATSAPP</p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-charcoal mb-5">
              Entre no grupo Reconstrução Emocional
            </h1>
            <p className="font-body text-lg text-charcoal/80 leading-relaxed mb-8">
              Um espaço de cuidado criado por Sal Ray para você entender seus sentimentos e reconhecer os padrões que se
              repetem na sua vida.
            </p>
            <GroupButton location="topo" />
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/grupo-gratuito/sal-ray-aneis.webp"
              srcSet="/images/grupo-gratuito/sal-ray-aneis-480.webp 480w, /images/grupo-gratuito/sal-ray-aneis-640.webp 640w, /images/grupo-gratuito/sal-ray-aneis-800.webp 800w, /images/grupo-gratuito/sal-ray-aneis.webp 1122w"
              sizes="(max-width: 768px) calc(100vw - 48px), 542px"
              alt="Sal Ray, Emotional & Life Rebuilding Coach"
              width={1122}
              height={1274}
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Faixa de 4 blocos iguais */}
      <section className="border-b border-charcoal/10 bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-12 md:py-16">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-4 mb-10">
            {faixa.map((b) => (
              <li key={b.rotulo} className="flex flex-col border border-[#F7941D]/40 bg-[#F7941D]/5 rounded-lg p-5">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-[#20B9CE] mb-2">{b.rotulo}</p>
                <p className="font-body text-base text-charcoal/80 leading-snug">{b.texto}</p>
              </li>
            ))}
          </ul>
          <GroupButton location="meio" />
        </div>
      </section>

      <section className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-12 md:py-16">
          <div className="max-w-[720px] mx-auto text-center">
            <p className="font-body text-lg text-charcoal/80 leading-relaxed mb-8">
              Aqui não existe julgamento, cobrança ou obrigação de participar. Você pode responder enquetes, fazer
              perguntas ou só acompanhar.
            </p>
            <p className="font-body text-sm font-semibold text-charcoal mb-1">Para quem é</p>
            <p className="font-body text-charcoal/80 leading-relaxed">
              Para quem está funcionando por fora, mas não se sente estável por dentro.
            </p>
          </div>
        </div>
      </section>

      {/* Quem é Sal Ray */}
      <section className="border-b border-charcoal/10 bg-pale-aqua">
        <div className="max-w-content mx-auto px-6 py-12 md:py-16 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/grupo-gratuito/sal-ray-executivo.webp"
              srcSet="/images/grupo-gratuito/sal-ray-executivo-480.webp 480w, /images/grupo-gratuito/sal-ray-executivo-640.webp 640w, /images/grupo-gratuito/sal-ray-executivo-800.webp 800w, /images/grupo-gratuito/sal-ray-executivo.webp 1122w"
              sizes="(max-width: 768px) calc(100vw - 48px), 542px"
              alt="Sal Ray, Emotional & Life Rebuilding Coach"
              width={1122}
              height={1402}
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="text-left">
            <p className="font-body text-xs uppercase tracking-[0.08em] text-aqua mb-3">
              EMOTIONAL &amp; LIFE REBUILDING COACH · CRIADOR DO MÉTODO S.T.A.B.L.E.™
            </p>
            <p className="font-body text-lg md:text-xl text-charcoal/90 leading-relaxed">
              Sal Ray é um coach especializado em reconstrução emocional e de vida, que ajuda adultos a identificar os
              padrões mais profundos que os mantêm estagnados. Seu trabalho combina o reconhecimento preciso de padrões,
              o desenvolvimento pessoal estruturado usando hipnose, PNL, Terapia Cognitivo-Comportamental e Análise
              Transacional, para promover clareza, estabilidade e um avanço responsável.
            </p>
          </div>
        </div>
      </section>

      {/* Perguntas rápidas */}
      <section className="border-b border-charcoal/10">
        <div className="max-w-content mx-auto px-6 py-12 md:py-16">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-6">Perguntas rápidas</h2>
          <div className="max-w-[720px] border-t border-charcoal/15">
            {perguntas.map((p) => (
              <details key={p.pergunta} className="group border-b border-charcoal/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-body font-medium text-charcoal [&::-webkit-details-marker]:hidden">
                  {p.pergunta}
                  <span className="text-[#F7941D] text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-5 font-body text-charcoal/80 leading-relaxed">{p.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Botão final */}
      <section>
        <div className="max-w-content mx-auto px-6 py-12 md:py-16 text-center md:text-left">
          <GroupButton location="fim" />
        </div>
      </section>
    </main>
  )
}
