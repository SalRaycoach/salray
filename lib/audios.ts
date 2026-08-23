/**
 * FONTE DE DADOS — "Reflexões SAL Ray" (biblioteca de áudios em português)
 * ---------------------------------------------------------------------------
 * Ver PROMPT_REFLEXOES_SAL_RAY.md, seção 3. Cada áudio é uma entrada neste
 * array — sem painel administrativo na v1. Passo a passo de como adicionar
 * uma entrada nova: ver COMO_PUBLICAR_AUDIO.md na raiz do projeto.
 *
 * Publicação programada: um áudio com `dataPublicacao` no futuro não aparece
 * no hub nem é acessível diretamente até essa data chegar (ver
 * isPublished() / getPublishedAudios() abaixo) — isso é o que permite gravar
 * várias semanas de uma vez e o site "soltar" um por vez sozinho.
 * ---------------------------------------------------------------------------
 */

export type AudioCategoria = 'Patterns' | 'Relationships' | 'Clarity' | 'Emotional Stability' | 'Morning Reflections'

export const AUDIO_CATEGORIAS: AudioCategoria[] = [
  'Patterns',
  'Relationships',
  'Clarity',
  'Emotional Stability',
  'Morning Reflections',
]

/**
 * Referencia uma das 4 ofertas já existentes em /pt/reconstrucao-emocional/
 * (ver PROMPT_PT_RECONSTRUCAO_EMOCIONAL, seção 3 "Âncoras e IDs"). Esse
 * mapeamento só existe aqui como texto de exibição + âncora de link — a
 * copy completa da oferta mora exclusivamente na página de vendas, não é
 * duplicada nesta branch.
 */
export type ProdutoRelacionado = 'primeiro-passo' | 'vivencias' | 'mentoria' | 'personalizado'

export const PRODUTO_INFO: Record<ProdutoRelacionado, { nome: string; anchor: string }> = {
  'primeiro-passo': { nome: 'Primeiro Passo S.T.A.B.L.E.™', anchor: 'primeiro-passo' },
  vivencias: { nome: 'Vivências de Reconstrução Emocional', anchor: 'vivencias' },
  mentoria: { nome: 'Mentoria S.T.A.B.L.E.™', anchor: 'mentoria' },
  personalizado: { nome: 'Acompanhamento Personalizado com Sal Ray', anchor: 'personalizado' },
}

export type Audio = {
  slug: string
  titulo: string
  descricao: string // 2-3 linhas
  categoria: AudioCategoria
  duracaoSegundos: number
  urlAudio: string // link público do arquivo no Cloudflare R2
  transcricao: string // texto completo ou resumo — obrigatório pra SEO
  dataPublicacao: string // ISO 8601 — data em que o áudio passa a aparecer no site
  produtoRelacionado: ProdutoRelacionado
  ogImage?: string // opcional — se ausente, usa o template genérico da marca
}

export const audios: Audio[] = [
  {
    slug: 'quando-a-mente-nao-desacelera',
    titulo: 'Quando a Mente Não Desacelera',
    descricao:
      'Uma reflexão guiada de cinco minutos para reconhecer o excesso de pensamento sem tentar apagá-lo à força, e encontrar um primeiro ponto de apoio no meio dele.',
    categoria: 'Patterns',
    duracaoSegundos: 312,
    urlAudio: 'https://pub-example.r2.dev/reflexoes/quando-a-mente-nao-desacelera.mp3',
    transcricao:
      'Se você chegou até aqui, é provável que sua mente esteja repetindo alguma coisa agora mesmo. Uma conversa, uma decisão, uma preocupação que já foi revisada dez vezes hoje. Isso não significa que algo está errado com você. Significa que uma parte da sua mente está tentando resolver algo que talvez não tenha uma resposta simples.\n\nEsta reflexão não promete apagar esse pensamento. Ela propõe apenas uma coisa: notar que existe um espaço entre o pensamento e você. Você não é o pensamento. Você é quem está percebendo que ele está lá.\n\nRespire uma vez, sem pressa. Não precisa mudar nada agora. Apenas perceba: o pensamento continua, e você continua também, um pouco mais estável do que estava há um minuto.',
    dataPublicacao: '2026-08-01T09:00:00-05:00',
    produtoRelacionado: 'primeiro-passo',
  },
  {
    slug: 'o-padrao-que-se-repete',
    titulo: 'O Padrão Que Se Repete',
    descricao:
      'Por que a mesma situação parece se repetir em relacionamentos diferentes — e o primeiro passo para começar a reconhecer o padrão em vez de repeti-lo.',
    categoria: 'Relationships',
    duracaoSegundos: 287,
    urlAudio: 'https://pub-example.r2.dev/reflexoes/o-padrao-que-se-repete.mp3',
    transcricao:
      'Talvez você já tenha notado: pessoas diferentes, situações diferentes, mas um final parecido. Isso não é coincidência, e também não é sua culpa sozinha. Padrões se repetem porque foram aprendidos, e o que foi aprendido pode ser reconhecido.\n\nO primeiro passo não é mudar o padrão. É apenas vê-lo com clareza, sem se julgar por ele estar lá. Da próxima vez que a situação começar a se repetir, experimente apenas nomear, baixinho: "este é o padrão". Nada mais que isso, por enquanto.',
    dataPublicacao: '2026-08-08T09:00:00-05:00',
    produtoRelacionado: 'vivencias',
  },
  {
    slug: 'clareza-antes-da-cafeina',
    titulo: 'Clareza Antes da Cafeína',
    descricao:
      'Um ponto de partida simples para começar o dia com direção, antes que as primeiras exigências do dia tomem conta da sua atenção.',
    categoria: 'Morning Reflections',
    duracaoSegundos: 254,
    urlAudio: 'https://pub-example.r2.dev/reflexoes/clareza-antes-da-cafeina.mp3',
    transcricao:
      'Antes de olhar o celular, antes de qualquer mensagem, antes mesmo do café: um minuto de clareza pode mudar como o resto do dia se organiza. Não se trata de motivação. Trata-se de escolher, ainda que brevemente, o que realmente importa hoje, antes que o dia escolha por você.',
    dataPublicacao: '2099-01-01T09:00:00-05:00', // teste: publicação futura, deve ficar oculto
    produtoRelacionado: 'mentoria',
  },
]

export function isPublished(audio: Audio, now: Date = new Date()): boolean {
  return new Date(audio.dataPublicacao).getTime() <= now.getTime()
}

/** Já publicados, mais recentes primeiro. Nunca inclui um `dataPublicacao` no futuro. */
export function getPublishedAudios(now: Date = new Date()): Audio[] {
  return audios
    .filter((a) => isPublished(a, now))
    .sort((a, b) => new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime())
}

/** Retorna undefined se o slug não existir OU se ainda não tiver sido publicado — nunca vaza um áudio agendado. */
export function getPublishedAudioBySlug(slug: string, now: Date = new Date()): Audio | undefined {
  return getPublishedAudios(now).find((a) => a.slug === slug)
}

export function getRelatedAudios(audio: Audio, limit = 3, now: Date = new Date()): Audio[] {
  return getPublishedAudios(now)
    .filter((a) => a.slug !== audio.slug && a.categoria === audio.categoria)
    .slice(0, limit)
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return `${minutes}:${String(remaining).padStart(2, '0')}`
}
