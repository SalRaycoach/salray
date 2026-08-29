/**
 * FONTE DE DADOS — Autoavaliação das Vivências de Reconstrução Emocional
 * ---------------------------------------------------------------------------
 * Conteúdo (perguntas e categorias) vem do documento "Mapa de Reconstrução
 * Emocional" fornecido por Sal Ray em 27 ago 2026 — texto exato, não parafraseado.
 *
 * Rota isolada (/pt/reconstrucao-emocional/avaliacao/), fora do menu
 * principal, sem indexação, enviada por link direto só a quem comprou o
 * programa. Tudo fica no localStorage do navegador da pessoa — nada é
 * enviado nem salvo neste servidor (ver AvaliacaoApp.tsx).
 * ---------------------------------------------------------------------------
 */

export type CategoriaAvaliacao = {
  nome: string
  perguntas: [number, number] // índices (0-based) em ESCALA_PERGUNTAS
}

export const ESCALA_PERGUNTAS: string[] = [
  'Quando uma emoção fica intensa, consigo diminuir a intensidade antes de agir ou tomar uma decisão.',
  'Consigo perceber o que estou sentindo sem precisar imediatamente fugir, reagir ou resolver aquilo.',
  'Consigo reconhecer padrões que se repetem na minha maneira de pensar, sentir ou me relacionar.',
  'Quando alguma coisa me afeta, consigo separar melhor o que realmente aconteceu da interpretação que minha mente criou.',
  'Consigo perceber com mais clareza o que é minha responsabilidade e o que pertence às outras pessoas.',
  'Consigo reconhecer e comunicar meus limites sem precisar explodir, me justificar excessivamente ou abandonar aquilo que preciso.',
  'Uma crítica, rejeição ou escolha de outra pessoa não determina completamente a maneira como vejo o meu próprio valor.',
  'Tenho clareza sobre aquilo que é importante para mim, mesmo quando outras pessoas esperam algo diferente.',
  'Quando percebo um padrão antigo começando, consigo criar algum espaço antes de repetir automaticamente a mesma resposta.',
  'Mesmo quando existe medo, desconforto ou incerteza, consigo identificar um próximo passo possível e agir sobre aquilo que realmente importa para mim.',
]

export const CATEGORIAS: CategoriaAvaliacao[] = [
  { nome: 'Estabilidade Emocional', perguntas: [0, 1] },
  { nome: 'Padrões e Clareza', perguntas: [2, 3] },
  { nome: 'Limites e Responsabilidade', perguntas: [4, 5] },
  { nome: 'Valor e Identidade', perguntas: [6, 7] },
  { nome: 'Direção e Escolha', perguntas: [8, 9] },
]

export const PERGUNTAS_ABERTAS_ANTES: string[] = [
  'O que mais tem ocupado sua energia emocional atualmente?',
  'Qual padrão ou situação você mais gostaria de compreender ou responder de maneira diferente?',
  'Se estas Vivências ajudarem você, qual mudança concreta gostaria de perceber na sua vida?',
]

export const PERGUNTAS_ABERTAS_DEPOIS: string[] = [
  'O que, se alguma coisa, você percebe que mudou na maneira como responde às suas emoções?',
  'Existe algum comportamento que você faz diferente hoje? Dê um exemplo concreto.',
  'Qual padrão você consegue perceber mais cedo agora?',
  'Qual das Vivências teve maior impacto em você e por quê?',
  'Existe alguma área em que você esperava mudança, mas ainda não percebeu diferença?',
]

export type EtapaSalva = {
  escalas: number[] // 10 valores, 0-10 cada, mesma ordem de ESCALA_PERGUNTAS
  abertas: string[] // 3 (antes) ou 5 (depois) respostas, mesma ordem das perguntas abertas
  dataISO: string
}

export type AvaliacaoStorage = {
  antes?: EtapaSalva
  depois?: EtapaSalva
}

// Versionado — se o formato mudar no futuro, uma nova chave evita ler dados
// salvos num formato antigo incompatível.
export const STORAGE_KEY = 'salray-avaliacao-vivencias-v1'

export function lerAvaliacaoSalva(): AvaliacaoStorage {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AvaliacaoStorage) : {}
  } catch {
    // localStorage indisponível (modo privado, storage desabilitado) — degrada
    // pra "nada salvo" em vez de quebrar a página.
    return {}
  }
}

export function salvarEtapa(etapa: 'antes' | 'depois', dados: EtapaSalva): AvaliacaoStorage {
  const atual = lerAvaliacaoSalva()
  const novo: AvaliacaoStorage = { ...atual, [etapa]: dados }
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(novo))
  } catch {
    // Mesmo se salvar falhar, devolve o objeto em memória — a pessoa ainda
    // consegue ver o resultado nesta visita, só não vai persistir.
  }
  return novo
}

export function limparAvaliacao(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignora — nada pra limpar se o storage já não está acessível
  }
}

export function somaCategoria(escalas: number[], categoria: CategoriaAvaliacao): number {
  return categoria.perguntas.reduce((soma, i) => soma + (escalas[i] ?? 0), 0)
}

export function somaTotal(escalas: number[]): number {
  return escalas.reduce((soma, v) => soma + (v ?? 0), 0)
}

export function formatarData(dataISO: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dataISO))
}
