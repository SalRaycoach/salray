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

// Valor interno em inglês (mais simples de manter no código) — o texto
// mostrado pro usuário vem sempre de CATEGORIA_LABEL, nunca deste valor cru.
// "Morning Reflections" foi removida da lista de filtros a pedido do
// usuário (22 ago 2026) — não é mais uma categoria válida.
export type AudioCategoria = 'Patterns' | 'Relationships' | 'Clarity' | 'Emotional Stability'

export const AUDIO_CATEGORIAS: AudioCategoria[] = ['Patterns', 'Relationships', 'Clarity', 'Emotional Stability']

export const CATEGORIA_LABEL: Record<AudioCategoria, string> = {
  Patterns: 'Padrões',
  Relationships: 'Relacionamentos',
  Clarity: 'Clareza',
  'Emotional Stability': 'Estabilidade Emocional',
}

/**
 * Referencia uma das 4 ofertas já existentes em /pt/reconstrucao-emocional/
 * (ver PROMPT_PT_RECONSTRUCAO_EMOCIONAL, seção 3 "Âncoras e IDs"). Esse
 * mapeamento só existe aqui como texto de exibição + âncora de link — a
 * copy completa da oferta mora exclusivamente na página de vendas, não é
 * duplicada nesta branch.
 */
export type ProdutoRelacionado = 'primeiro-passo' | 'vivencias' | 'mentoria' | 'personalizado'

// `artigo` existe porque "Conhecer {nome}" precisa de concordância de
// gênero/número em português ("o Primeiro Passo", "as Vivências", "a
// Mentoria", "o Acompanhamento") — um artigo fixo quebraria 2 dos 4 nomes.
export const PRODUTO_INFO: Record<ProdutoRelacionado, { nome: string; artigo: string; anchor: string }> = {
  'primeiro-passo': { nome: 'Primeiro Passo S.T.A.B.L.E.™', artigo: 'o', anchor: 'primeiro-passo' },
  vivencias: { nome: 'Vivências de Reconstrução Emocional', artigo: 'as', anchor: 'vivencias' },
  mentoria: { nome: 'Mentoria S.T.A.B.L.E.™', artigo: 'a', anchor: 'mentoria' },
  personalizado: { nome: 'Acompanhamento Personalizado com Sal Ray', artigo: 'o', anchor: 'personalizado' },
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
    slug: 'adaptando-escolhas-para-nao-decepcionar-os-outros',
    titulo: 'Você Está Adaptando Suas Escolhas Para Não Decepcionar os Outros?',
    descricao:
      'A pessoa acredita que está sendo cuidadosa, mas pode estar alterando decisões, limites e até a própria fala para evitar o desconforto de desagradar. Durante a semana, ela observará onde a necessidade de aprovação está dirigindo suas respostas.',
    categoria: 'Clarity',
    duracaoSegundos: 245,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/01_Voc%C3%AA%20est%C3%A1%20adaptando%20suas%20escolhas%20para%20n%C3%A3o%20decepcionar%20os%20outros.mp3',
    transcricao:
      'Eu quero que você observe uma coisa essa semana.\nTalvez você não esteja apenas pensando no que quer fazer.\nTalvez você esteja pensando no que pode fazer sem decepcionar alguém.\nE existe uma diferença muito grande entre essas duas coisas.\nPensa na última decisão que você precisou tomar.\nPode ter sido uma decisão importante.\nMas também pode ter sido uma coisa simples.\nUm convite que você queria recusar.\nUma conversa que precisava ter.\nUm limite que queria colocar.\nUma escolha que fazia sentido pra você… mas que poderia desagradar alguém.\nO que aconteceu dentro de você naquele momento?\nPorque talvez, antes mesmo de decidir, você já tenha começado a imaginar a reação da outra pessoa.\nA cara que ela faria.\nO silêncio.\nA cobrança.\nA pergunta.\nA possibilidade de ela entender tudo errado.\nE, sem perceber, você começou a adaptar sua escolha.\nVocê não disse exatamente o que queria dizer.\nVocê deixou pra depois.\nVocê tentou encontrar um jeito de fazer aquilo sem causar nenhum desconforto.\nOu talvez tenha desistido completamente.\nE é aqui que eu quero chamar sua atenção.\nTalvez você esteja chamando isso de consideração.\nE pode ser que uma parte seja mesmo.\nConsiderar quem está ao seu lado é importante.\nMas existe um momento em que considerar o outro começa a significar abandonar o que você precisa.\nVocê começa a ajustar demais.\nExplicar demais.\nPedir permissão sem perceber.\nE, pouco a pouco, suas escolhas deixam de mostrar o que você realmente quer.\nElas começam a mostrar apenas o que você acredita que os outros conseguem aceitar.\nEu não estou dizendo que você precisa ignorar todo mundo.\nNem que precisa começar a dizer não pra tudo.\nNão é isso.\nEu só quero que você perceba quem está participando das suas decisões.\nPorque pode existir alguém dentro da sua cabeça mesmo quando essa pessoa não está presente.\nVocê imagina o que ela vai pensar.\nO que vai falar.\nComo vai reagir.\nE muda sua resposta antes mesmo de dar a essa pessoa a oportunidade de responder.\nEntão, durante essa semana, antes de dizer sim… antes de mudar seus planos… antes de desistir de alguma coisa… para por alguns segundos.\nE se pergunta:\n"Essa é realmente a minha escolha?"\n"Ou é a versão da minha escolha que causa menos desconforto em alguém?"\nNão precisa mudar tudo imediatamente.\nPrimeiro, percebe.\nPercebe onde você suaviza o que pensa.\nOnde aceita o que não queria aceitar.\nOnde continua disponível mesmo estando cansado.\nOnde evita uma conversa porque tem medo de parecer uma pessoa ruim.\nTalvez você descubra que o problema não é não saber o que quer.\nTalvez você saiba.\nO que pesa é imaginar quem pode ficar decepcionado quando você se posicionar.\nE se isso aparecer durante a semana, não tenta fugir dessa percepção.\nSó observa.\nPorque você pode respeitar alguém sem entregar a essa pessoa o controle das suas escolhas.\nE talvez essa seja a pergunta que precisa acompanhar você durante os próximos dias:\n"Se eu não estivesse tentando evitar a decepção de alguém… o que eu escolheria?"',
    dataPublicacao: '2026-08-24T00:00:00-05:00', // meia-noite — mudança de prazo pedida em 23 ago 2026
    produtoRelacionado: 'vivencias',
  },
  {
    slug: 'limite-que-voce-estabeleceu-mas-continua-renegociando',
    titulo: 'O Limite Que Você Estabeleceu, Mas Continua Renegociando Quando Sente Desconforto',
    descricao:
      'O problema pode não ser colocar o limite. Pode ser sustentar a própria decisão depois que surgem culpa, pressão, silêncio ou medo de conflito.',
    categoria: 'Patterns',
    duracaoSegundos: 296,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/02_%20O%20limite%20que%20voc%C3%AA%20estabeleceu%2C%20mas%20continua%20renegociando%20quando%20sente%20desconforto..mp3',
    transcricao:
      'Eu quero te interromper por um instante no meio dessa semana.\nTem algum limite que você já colocou… mas agora está começando a negociar de novo?\nTalvez você tenha decidido que não aceitaria mais uma determinada forma de ser tratado.\nTalvez tenha decidido que não assumiria novamente uma responsabilidade que não é sua.\nOu talvez tenha dito que não continuaria disponível sempre que alguém quisesse, mesmo quando isso estivesse te fazendo mal.\nNo momento em que você tomou essa decisão, parecia claro.\nVocê sabia por que precisava daquele limite.\nMas aí veio a reação.\nA outra pessoa ficou chateada.\nMudou a forma de falar com você.\nFicou em silêncio.\nComeçou a fazer você se sentir culpado.\nOu simplesmente demonstrou que não gostou da sua decisão.\nE agora você começou a questionar o limite que colocou.\nTalvez esteja pensando:\n"Será que eu exagerei?"\n"Será que estou sendo injusto?"\n"Talvez eu possa abrir uma exceção."\n"Só dessa vez não vai fazer diferença."\nMas eu quero que você perceba uma coisa.\nPode ser que nada tenha mudado na situação.\nA única coisa que mudou é que agora você está sentindo o desconforto de sustentar aquilo que decidiu.\nE isso é importante.\nPorque colocar um limite quando tudo está calmo é uma coisa.\nManter esse limite quando alguém demonstra insatisfação é outra completamente diferente.\nÉ nesse momento que o padrão costuma aparecer.\nVocê coloca o limite.\nA outra pessoa reage.\nVocê sente culpa, medo ou ansiedade.\nE, para acabar com esse desconforto, começa a negociar novamente.\nVocê explica mais uma vez.\nTenta suavizar o que disse.\nVolta atrás em uma parte.\nAbre uma exceção.\nE quando percebe, está novamente no mesmo lugar que fez você precisar daquele limite.\nÉ claro que você pode reconsiderar uma decisão.\nMudar de posição diante de uma informação nova também é maturidade.\nMas eu quero que você se pergunte:\nAlguma coisa realmente mudou?\nOu você só está tentando fazer esse desconforto passar?\nPorque existe uma diferença entre mudar uma decisão porque você entendeu algo novo… e mudar apenas porque não conseguiu suportar a reação de alguém.\nEu não estou dizendo que você precisa se tornar uma pessoa fria.\nLimite não é punição.\nNão é uma forma de controlar o outro.\nÉ uma forma de deixar claro o que você aceita, o que não aceita e como vai responder quando alguma coisa ultrapassar isso.\nEntão observa o que está acontecendo hoje.\nQual limite você está prestes a abandonar?\nE antes de voltar atrás, para um pouco.\nNão responda no auge da culpa.\nNão tente resolver tudo só porque o silêncio está te incomodando.\nNão explique pela quinta vez aquilo que você já explicou com clareza.\nDá um tempo para essa reação diminuir.\nDepois, pergunta pra você:\n"O que mudou desde que eu tomei essa decisão?"\nSe surgiu uma informação nova, você pode avaliar.\nMas se nada mudou além do desconforto que você está sentindo, talvez você não precise tomar outra decisão.\nTalvez precise apenas sustentar a que já tomou.\nPorque dizer o limite é só o começo.\nO que faz esse limite existir de verdade é o que você faz depois que alguém não gosta dele.\nEntão, antes de continuar o seu dia, pensa nisso:\nQual limite você está quase abandonando apenas para o desconforto acabar?',
    dataPublicacao: '2026-08-26T00:00:00-05:00', // quarta-feira, meia-noite — mesmo padrão de publicação exata do primeiro áudio
    produtoRelacionado: 'primeiro-passo',
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

/**
 * Teaser "Próxima reflexão" nas páginas já publicadas — pedido em 24 ago
 * 2026, junto com o segundo áudio real. Computado a partir dos dados (não é
 * um texto fixo numa página específica), então funciona sozinho pra
 * qualquer áudio futuro sem precisar editar nada manualmente: assim que o
 * próximo da fila publicar, o teaser desaparece de quem já mostrava ele e
 * passa a apontar pro seguinte, se houver.
 */
export function getNextScheduledAudio(now: Date = new Date()): Audio | undefined {
  return audios
    .filter((a) => !isPublished(a, now))
    .sort((a, b) => new Date(a.dataPublicacao).getTime() - new Date(b.dataPublicacao).getTime())[0]
}

/**
 * "quarta-feira, 26 de agosto" — só dia da semana e data, nunca título ou
 * categoria (pedido explícito: teaser não pode revelar do que se trata).
 * timeZone fixo em -05:00 pra combinar com o fuso já usado em
 * dataPublicacao — sem isso, o servidor rodando num fuso diferente poderia
 * arredondar pro dia errado perto da virada da meia-noite.
 */
export function formatProximaData(dataPublicacao: string): string {
  const date = new Date(dataPublicacao)
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Bogota',
  }).format(date)
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return `${minutes}:${String(remaining).padStart(2, '0')}`
}
