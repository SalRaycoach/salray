'use client'

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import {
  ESCALA_PERGUNTAS,
  CATEGORIAS,
  PERGUNTAS_ABERTAS_ANTES,
  PERGUNTAS_ABERTAS_DEPOIS,
  lerAvaliacaoSalva,
  salvarEtapa,
  limparAvaliacao,
  somaCategoria,
  somaTotal,
  formatarData,
  type EtapaSalva,
  type AvaliacaoStorage,
} from './avaliacao-data'
import ScaleInput from './ScaleInput'

type Tela = 'carregando' | 'inicio' | 'form-antes' | 'pos-antes' | 'form-depois' | 'resultado'

export default function AvaliacaoApp() {
  const [tela, setTela] = useState<Tela>('carregando')
  const [dados, setDados] = useState<AvaliacaoStorage>({})
  const [escalas, setEscalas] = useState<Array<number | null>>(Array(10).fill(null))
  const [abertas, setAbertas] = useState<string[]>([])
  const [erro, setErro] = useState<string | null>(null)

  // Lê o localStorage só depois de montar — no servidor essa leitura não
  // existe, e tentar ler durante o render inicial causaria divergência
  // entre o HTML do servidor e o do cliente (erro de hidratação).
  useEffect(() => {
    setDados(lerAvaliacaoSalva())
    setTela('inicio')
  }, [])

  function iniciarEtapa(etapa: 'antes' | 'depois') {
    setEscalas(Array(10).fill(null))
    setAbertas(Array(etapa === 'antes' ? PERGUNTAS_ABERTAS_ANTES.length : PERGUNTAS_ABERTAS_DEPOIS.length).fill(''))
    setErro(null)
    setTela(etapa === 'antes' ? 'form-antes' : 'form-depois')
  }

  function handleEnviar(etapa: 'antes' | 'depois') {
    if (escalas.some((v) => v === null)) {
      setErro('Responde todas as 10 perguntas de escala antes de enviar — falta marcar pelo menos uma.')
      return
    }
    const etapaSalva: EtapaSalva = { escalas: escalas as number[], abertas, dataISO: new Date().toISOString() }
    const novoStorage = salvarEtapa(etapa, etapaSalva)
    setDados(novoStorage)
    setTela(etapa === 'antes' ? 'pos-antes' : 'resultado')
  }

  function handleReiniciar() {
    if (!window.confirm('Isso vai apagar as respostas salvas neste navegador (Antes e Depois). Quer continuar?')) return
    limparAvaliacao()
    setDados({})
    setTela('inicio')
  }

  if (tela === 'carregando') return null

  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      {tela === 'inicio' && <TelaInicio dados={dados} onIniciar={iniciarEtapa} onVerResultado={() => setTela('resultado')} />}

      {(tela === 'form-antes' || tela === 'form-depois') && (
        <TelaFormulario
          etapa={tela === 'form-antes' ? 'antes' : 'depois'}
          escalas={escalas}
          setEscalas={setEscalas}
          abertas={abertas}
          setAbertas={setAbertas}
          erro={erro}
          onEnviar={() => handleEnviar(tela === 'form-antes' ? 'antes' : 'depois')}
        />
      )}

      {tela === 'pos-antes' && dados.antes && <TelaPosAntes etapaSalva={dados.antes} onContinuar={() => setTela('inicio')} />}

      {tela === 'resultado' && dados.antes && dados.depois && (
        <TelaResultado antes={dados.antes} depois={dados.depois} onReiniciar={handleReiniciar} />
      )}
    </main>
  )
}

function TelaInicio({
  dados,
  onIniciar,
  onVerResultado,
}: {
  dados: AvaliacaoStorage
  onIniciar: (etapa: 'antes' | 'depois') => void
  onVerResultado: () => void
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">Vivências de Reconstrução Emocional</p>
      <h1 className="font-display text-4xl text-charcoal mb-6">Autoavaliação</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed mb-8">
        Uma forma simples de perceber, com mais clareza, onde você está agora — e comparar com onde você estará depois
        das 12 vivências. Leva poucos minutos e fica só no seu navegador: nada é enviado nem guardado em servidor
        nenhum.
      </p>

      {!dados.antes && (
        <button
          type="button"
          onClick={() => onIniciar('antes')}
          className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          Começar Avaliação
        </button>
      )}

      {dados.antes && !dados.depois && (
        <div className="border border-charcoal/15 rounded-lg p-6">
          <p className="font-body text-charcoal/80 leading-relaxed mb-4">
            Você já respondeu a etapa &ldquo;Antes&rdquo; em {formatarData(dados.antes.dataISO)}. Quando estiver pronta
            para comparar, responda a etapa &ldquo;Depois&rdquo; — as mesmas 10 perguntas, mais 5 perguntas de reflexão.
          </p>
          <button
            type="button"
            onClick={() => onIniciar('depois')}
            className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
          >
            Concluir Avaliação Depois
          </button>
        </div>
      )}

      {dados.antes && dados.depois && (
        <div className="border border-charcoal/15 rounded-lg p-6">
          <p className="font-body text-charcoal/80 leading-relaxed mb-4">
            Você já completou as duas etapas — Antes em {formatarData(dados.antes.dataISO)}, Depois em{' '}
            {formatarData(dados.depois.dataISO)}.
          </p>
          <button
            type="button"
            onClick={onVerResultado}
            className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
          >
            Ver Meu Resultado
          </button>
        </div>
      )}
    </div>
  )
}

function TelaFormulario({
  etapa,
  escalas,
  setEscalas,
  abertas,
  setAbertas,
  erro,
  onEnviar,
}: {
  etapa: 'antes' | 'depois'
  escalas: Array<number | null>
  setEscalas: Dispatch<SetStateAction<Array<number | null>>>
  abertas: string[]
  setAbertas: Dispatch<SetStateAction<string[]>>
  erro: string | null
  onEnviar: () => void
}) {
  const perguntasAbertas = etapa === 'antes' ? PERGUNTAS_ABERTAS_ANTES : PERGUNTAS_ABERTAS_DEPOIS
  let contador = 0

  return (
    <div className="max-w-2xl">
      <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">
        Etapa &ldquo;{etapa === 'antes' ? 'Antes' : 'Depois'}&rdquo;
      </p>
      <h1 className="font-display text-4xl text-charcoal mb-6">Autoavaliação</h1>
      <p className="font-body text-charcoal/70 leading-relaxed mb-12">
        Para cada afirmação, marca o número que melhor representa você agora — 0 significa que não é verdade pra
        você, 10 significa que é totalmente verdade pra você.
      </p>

      {CATEGORIAS.map((categoria) => (
        <div key={categoria.nome} className="mb-10">
          <h2 className="font-display text-xl text-charcoal mb-5">{categoria.nome}</h2>
          <div className="space-y-8">
            {categoria.perguntas.map((indice) => {
              contador += 1
              return (
                <div key={indice}>
                  <p className="font-body text-charcoal/85 leading-relaxed mb-3">
                    {contador}. {ESCALA_PERGUNTAS[indice] ?? ''}
                  </p>
                  <ScaleInput
                    label={ESCALA_PERGUNTAS[indice] ?? ''}
                    value={escalas[indice] ?? null}
                    onChange={(valor) => {
                      setEscalas((prev) => {
                        const novo = [...prev]
                        novo[indice] = valor
                        return novo
                      })
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="border-t border-charcoal/10 pt-10 mb-10">
        <h2 className="font-display text-xl text-charcoal mb-6">
          {etapa === 'antes' ? 'Antes de começar' : 'Olhando pra trás'}
        </h2>
        <div className="space-y-6">
          {perguntasAbertas.map((pergunta, i) => (
            <div key={i}>
              <label className="font-body text-charcoal/85 leading-relaxed mb-2 block">{pergunta}</label>
              <textarea
                value={abertas[i] ?? ''}
                onChange={(e) => {
                  const valor = e.target.value
                  setAbertas((prev) => {
                    const novo = [...prev]
                    novo[i] = valor
                    return novo
                  })
                }}
                rows={3}
                className="w-full font-body text-sm text-charcoal bg-transparent border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-aqua"
              />
            </div>
          ))}
        </div>
      </div>

      {erro && <p className="font-body text-sm text-orange mb-6">{erro}</p>}

      <button
        type="button"
        onClick={onEnviar}
        className="inline-block font-body text-sm font-medium bg-orange text-charcoal px-6 py-3.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
      >
        {etapa === 'antes' ? 'Salvar Respostas' : 'Ver Minha Comparação'}
      </button>
    </div>
  )
}

function TelaPosAntes({ etapaSalva, onContinuar }: { etapaSalva: EtapaSalva; onContinuar: () => void }) {
  return (
    <div className="max-w-2xl">
      <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">Etapa &ldquo;Antes&rdquo; concluída</p>
      <h1 className="font-display text-4xl text-charcoal mb-6">Respostas registradas.</h1>
      <p className="font-body text-lg text-charcoal/80 leading-relaxed mb-8">
        Sua pontuação total agora é {somaTotal(etapaSalva.escalas)} de 100. Depois das vivências, volte aqui pra
        responder a etapa &ldquo;Depois&rdquo; e ver a comparação completa, categoria por categoria.
      </p>

      <div className="border border-charcoal/15 rounded-lg bg-pale-aqua/40 p-6 mb-10">
        <p className="font-body text-sm text-charcoal/80 leading-relaxed">
          Guarde isso no mesmo navegador que você vai usar depois — suas respostas ficam salvas só neste dispositivo.
          Se limpar o histórico do navegador ou trocar de computador/celular antes de responder a etapa
          &ldquo;Depois&rdquo;, essas respostas se perdem.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {CATEGORIAS.map((categoria) => (
          <div key={categoria.nome} className="border border-charcoal/15 rounded-lg p-4">
            <p className="font-body text-xs uppercase tracking-widest text-aqua mb-1">{categoria.nome}</p>
            <p className="font-body text-charcoal/80">{somaCategoria(etapaSalva.escalas, categoria)} de 20</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinuar}
        className="inline-block font-body text-sm font-medium border border-aqua text-aqua px-6 py-3.5 rounded-md hover:bg-aqua hover:text-offwhite transition-colors"
      >
        Voltar ao início
      </button>
    </div>
  )
}

function TelaResultado({ antes, depois, onReiniciar }: { antes: EtapaSalva; depois: EtapaSalva; onReiniciar: () => void }) {
  const totalAntes = somaTotal(antes.escalas)
  const totalDepois = somaTotal(depois.escalas)
  const totalDiff = totalDepois - totalAntes

  return (
    <div className="avaliacao-print-area max-w-content mx-auto">
      <div className="no-print flex justify-end mb-8">
        <button
          type="button"
          onClick={() => window.print()}
          className="font-body text-sm font-medium border border-aqua text-aqua px-5 py-2.5 rounded-md hover:bg-aqua hover:text-offwhite transition-colors"
        >
          Imprimir / Salvar como PDF
        </button>
      </div>

      <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">Vivências de Reconstrução Emocional</p>
      <h1 className="font-display text-4xl text-charcoal mb-2">Seu Resultado</h1>
      <p className="font-body text-sm text-charcoal/50 mb-12">
        Antes: {formatarData(antes.dataISO)} · Depois: {formatarData(depois.dataISO)}
      </p>

      <div className="border border-charcoal/15 rounded-lg p-8 mb-12 max-w-2xl">
        <p className="font-body text-xs uppercase tracking-widest text-aqua mb-4">Pontuação total</p>
        <div className="flex flex-wrap items-baseline gap-x-10 gap-y-2">
          <div>
            <p className="font-body text-xs text-charcoal/50 mb-1">Antes</p>
            <p className="font-display text-3xl text-charcoal">{totalAntes}/100</p>
          </div>
          <div>
            <p className="font-body text-xs text-charcoal/50 mb-1">Depois</p>
            <p className="font-display text-3xl text-charcoal">{totalDepois}/100</p>
          </div>
          <div>
            <p className="font-body text-xs text-charcoal/50 mb-1">Diferença</p>
            <p className="font-display text-3xl text-orange">
              {totalDiff >= 0 ? '+' : ''}
              {totalDiff}
            </p>
          </div>
        </div>
      </div>

      <h2 className="font-display text-xl text-charcoal mb-6">Por categoria</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {CATEGORIAS.map((categoria) => {
          const scoreAntes = somaCategoria(antes.escalas, categoria)
          const scoreDepois = somaCategoria(depois.escalas, categoria)
          const diff = scoreDepois - scoreAntes
          return (
            <div key={categoria.nome} className="border border-charcoal/15 rounded-lg p-5">
              <p className="font-body text-xs uppercase tracking-widest text-aqua mb-3">{categoria.nome}</p>
              <p className="font-body text-sm text-charcoal/60 mb-1">Antes: {scoreAntes}/20</p>
              <p className="font-body text-sm text-charcoal/60 mb-3">Depois: {scoreDepois}/20</p>
              <p className="font-display text-2xl text-orange">
                {diff >= 0 ? '+' : ''}
                {diff}
              </p>
            </div>
          )
        })}
      </div>

      <div className="max-w-2xl mb-12">
        <h2 className="font-display text-xl text-charcoal mb-6">Suas reflexões — Antes</h2>
        <div className="space-y-5">
          {PERGUNTAS_ABERTAS_ANTES.map((pergunta, i) => (
            <div key={i}>
              <p className="font-body text-sm font-semibold text-charcoal mb-1">{pergunta}</p>
              <p className="font-body text-charcoal/75 leading-relaxed whitespace-pre-line">{antes.abertas[i] || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mb-12">
        <h2 className="font-display text-xl text-charcoal mb-6">Suas reflexões — Depois</h2>
        <div className="space-y-5">
          {PERGUNTAS_ABERTAS_DEPOIS.map((pergunta, i) => (
            <div key={i}>
              <p className="font-body text-sm font-semibold text-charcoal mb-1">{pergunta}</p>
              <p className="font-body text-charcoal/75 leading-relaxed whitespace-pre-line">{depois.abertas[i] || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReiniciar}
        className="no-print font-body text-sm text-charcoal/50 underline underline-offset-2 hover:text-orange transition-colors"
      >
        Apagar respostas e refazer do zero
      </button>
    </div>
  )
}
