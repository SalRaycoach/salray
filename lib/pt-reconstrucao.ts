/**
 * FONTE ÚNICA DE DADOS — Página "Reconstrução Emocional com o Método S.T.A.B.L.E.™"
 * ---------------------------------------------------------------------------
 * Ver briefing completo: Briefing_Pagina_Reconstrucao_Emocional_SAL_Ray(1).docx
 * (14 de agosto de 2026), seções 4, 6–10, 16, 20 e 21.
 *
 * REGRA DE BLOQUEIO (briefing, seção 4 e 21): a página pode ficar pronta e
 * revisada nesta branch, mas NÃO pode ir ao ar até que os campos marcados
 * "PENDENTE_" abaixo sejam substituídos por valores reais aprovados por
 * Sal Ray. Nenhum destes valores deve ser inventado. Enquanto um campo
 * PENDENTE_ não for preenchido:
 *   - CTAs pagos ficam com aria-disabled (nunca apontam para "#").
 *   - A pergunta de reembolso no FAQ não deve ser publicada com resposta genérica.
 * ---------------------------------------------------------------------------
 */

export const PT_ROUTE = '/pt/reconstrucao-emocional/'
export const PT_CANONICAL_URL = `https://salraycoach.com${PT_ROUTE}`

export const ptPageMeta = {
  title: 'Reconstrução Emocional em Português | Método S.T.A.B.L.E.™ | SAL Ray',
  description:
    'Conheça quatro formas de começar sua reconstrução emocional com o Método S.T.A.B.L.E.™: vivências guiadas em áudio, mentoria em grupo e acompanhamento personalizado com Sal Ray.',
  ogImageAlt: 'Reconstrução Emocional com o Método S.T.A.B.L.E.™, SAL Ray',
} as const

/**
 * WhatsApp — número real confirmado por Sal Ray em 15 set 2026 (mesmo número
 * já usado no resto do site). isPending() e o fallback em buildWhatsAppUrl()
 * ficam como estão, sem uso agora, apenas como rede de segurança caso o
 * número precise voltar a um estado "PENDENTE_" no futuro.
 */
export const whatsapp = {
  numberE164: '18635137521',
  isPending(): boolean {
    return this.numberE164.startsWith('PENDENTE_')
  },
  messages: {
    ajudaParaEscolher:
      'Olá, Sal Ray. Vi a página de Reconstrução Emocional e preciso de ajuda para escolher a opção mais adequada para mim.',
    personalizado: 'Olá, Sal Ray. Quero entender se o acompanhamento personalizado é adequado para o meu momento.',
    // Botões da faixa de serviços do Acompanhamento Personalizado: o texto identifica o serviço.
    consulta: 'Olá, Sal Ray. Quero agendar a consulta de US$ 50.',
    sessao: 'Olá, Sal Ray. Quero agendar uma sessão individual de US$ 80.',
    pacote: 'Olá, Sal Ray. Quero o pacote de 10 sessões de US$ 600.',
    // Botão de WhatsApp específico da ferramenta de autoavaliação (pedido 15
    // set 2026) — contexto diferente do botão "ajuda para escolher" do resto
    // da página: quem chega aqui já concluiu as Vivências.
    avaliacaoConcluida:
      'Olá, Sal Ray. Concluí as Vivências de Reconstrução Emocional e gostaria de agendar uma consulta.',
  },
} as const

/**
 * Monta o link wa.me — usa o placeholder óbvio "1XXXXXXXXXX" enquanto o
 * número real não existir (briefing, checklist seção 7). Importante: não
 * usar .replace(/\D/g, '') no placeholder — isso removeria os "X" e deixaria
 * só o "1", tornando o placeholder irreconhecível.
 */
export function buildWhatsAppUrl(message: string): string {
  const number = whatsapp.isPending() ? '1XXXXXXXXXX' : whatsapp.numberE164.replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export type OfferStatus = 'active' | 'contact-only' | 'recording'

export type Offer = {
  id: 'primeiro-passo' | 'vivencias' | 'personalizado'
  anchor: string
  level: string
  badge?: string
  name: string
  subtitle: string
  highlight?: string
  paraQuemE: string
  oQueRecebe: string
  comoFunciona?: string
  price?: string
  // Preço "de", riscado, exibido junto de `price` quando há desconto ativo.
  originalPrice?: string
  // Nota curta abaixo do preço (ex.: prazo do valor de lançamento).
  priceNote?: string
  // Selo destacado perto do preço (ex.: "4x sem juros") — visível, não
  // escondido atrás de texto secundário.
  installmentBadge?: string
  // Frase curta de contexto/urgência, acima do preço, no card de compra.
  narrativeLine?: string
  paymentType?: string
  status: OfferStatus
  ctaText: string
  ctaHref: string // link direto de checkout da Payhip — PENDENTE_ até existir
  microtext: string
  limites?: string
  // status 'recording': texto que substitui o preço/CTA de compra enquanto o
  // áudio ainda está sendo gravado (pedido em 23 ago 2026) — sem data fixa,
  // com concordância de gênero/número específica pra cada oferta (não dá pra
  // templatizar genericamente: "está sendo gravado" vs "estão sendo gravadas").
  recordingMessage?: string
}

/**
 * Vivências: dois preços, uma troca automática. Até 31/10/2026 vale o valor de
 * lançamento (US$ 117). A partir de 01/11/2026 às 00:00 em Nova York (EDT,
 * UTC-4: o horário de verão só termina às 02:00 desse dia) vale US$ 147, sem
 * selo e sem nota. A página é renderizada a cada acesso (force-dynamic), então
 * a troca acontece sozinha, sem novo deploy.
 */
export const VIVENCIAS_PRICE_CHANGE_AT = '2026-11-01T00:00:00-04:00'
export const VIVENCIAS_CHECKOUT_117 = 'https://payhip.com/order?link=LRdlK&pricing_plan=4lW53Yo6B3'
// PENDENTE: link do plano de US$ 147 na Payhip. Enquanto começar com PENDENTE_,
// o botão fica desativado (OfferCta.tsx). Trocar pelo link real antes de 1º/11.
export const VIVENCIAS_CHECKOUT_147 = 'PENDENTE_CHECKOUT_PAYHIP_147'

export function isVivenciasLaunchPrice(now: Date = new Date()): boolean {
  return now.getTime() < new Date(VIVENCIAS_PRICE_CHANGE_AT).getTime()
}

/**
 * Mentoria de Reconstrução Emocional (última turma de 2026, 29/11/2026). Mesmo mecanismo das
 * Vivências: a página é renderizada a cada acesso (force-dynamic) e as datas abaixo decidem
 * o preço e o estado do botão, sem novo deploy. Horário de Nova York em novembro é EST (UTC-5):
 * o horário de verão terminou em 01/11/2026.
 *  - Pré-venda: US$ 247 até 18/11/2026 23:59. Desde 19/11/2026 00:00: US$ 297.
 *  - Inscrições: até 28/11/2026 23:59. A partir de 29/11/2026 00:00 o botão fica desativado.
 */
export const MENTORIA_PRICE_CHANGE_AT = '2026-11-19T00:00:00-05:00'
export const MENTORIA_ENROLLMENT_CLOSES_AT = '2026-11-29T00:00:00-05:00'
export const MENTORIA_CHECKOUT_247 = 'https://buy.stripe.com/8x200icItemA5jQb6afIs06'
// PENDENTE: link de pagamento de US$ 297 (ainda não existe). Vazio = botão desativado
// ("Checkout ainda não disponível") a partir de 19/11/2026. Colar o link aqui quando existir.
export const MENTORIA_CHECKOUT_297 = ''

export const mentoriaReconstrucaoConfig = {
  // true = botão desativado com "Vagas esgotadas". Nunca mostrar contador de vagas.
  vagasEsgotadas: false,
  // true = mostra a linha de parcelamento (Affirm ou Klarna) abaixo do botão ativo.
  parcelamentoDisponivel: true,
} as const

export type MentoriaButtonState = 'active' | 'closed' | 'soldout' | 'unavailable'

export function getMentoriaReconstrucao(now: Date = new Date()) {
  const presale = now.getTime() < new Date(MENTORIA_PRICE_CHANGE_AT).getTime()
  const closed = now.getTime() >= new Date(MENTORIA_ENROLLMENT_CLOSES_AT).getTime()
  const checkoutHref = presale ? MENTORIA_CHECKOUT_247 : MENTORIA_CHECKOUT_297
  let state: MentoriaButtonState = 'active'
  if (closed) state = 'closed'
  else if (mentoriaReconstrucaoConfig.vagasEsgotadas) state = 'soldout'
  else if (!checkoutHref) state = 'unavailable'
  const labels: Record<MentoriaButtonState, string> = {
    active: 'Garantir minha vaga na mentoria',
    closed: 'Inscrições encerradas',
    soldout: 'Vagas esgotadas',
    unavailable: 'Checkout ainda não disponível',
  }
  return {
    presale,
    closed,
    priceLabel: presale ? 'Condição especial de pré-venda' : 'Investimento',
    price: presale ? 'US$ 247' : 'US$ 297',
    strikePrice: presale ? 'US$ 297' : undefined,
    priceNote: presale ? 'Válida até 18 de novembro. Depois: US$ 297.' : undefined,
    checkoutHref,
    state,
    buttonLabel: labels[state],
    showInstallments: state === 'active' && mentoriaReconstrucaoConfig.parcelamentoDisponivel,
  }
}

export const offers: Offer[] = [
  {
    id: 'primeiro-passo',
    anchor: 'primeiro-passo',
    level: 'NÍVEL 1 · COMEÇAR',
    badge: 'RECOMENDADO PARA COMEÇAR',
    name: 'Primeiro Passo S.T.A.B.L.E.™',
    subtitle:
      'Cinco vivências guiadas em áudio para começar a reorganizar seu estado interno, com uma vivência bônus para reforçar o processo.',
    paraQuemE:
      'Para quem quer experimentar o Método S.T.A.B.L.E.™ de maneira simples, acessível e autoguiada, antes de decidir se precisa de um processo mais profundo.',
    oQueRecebe:
      '5 vivências guiadas em áudio + 1 vivência bônus. Acesso digital para ouvir no próprio ritmo, em um ambiente tranquilo e sem interrupções.',
    comoFunciona:
      'O botão leva diretamente ao checkout da Payhip. O pagamento é processado pelo Stripe. Após a aprovação, a Payhip envia automaticamente o comprovante e o link de acesso por e-mail, sem envio manual por Sal Ray.',
    price: 'US$ 17',
    paymentType: 'pagamento único',
    status: 'recording',
    ctaText: 'Começar agora por US$ 17',
    ctaHref: 'PENDENTE_CHECKOUT_PAYHIP_17', // NÃO INVENTAR — link direto de checkout da Payhip
    microtext: 'Pagamento seguro processado pelo Stripe. Acesso e instruções enviados automaticamente por e-mail após a confirmação.',
    limites: 'Este programa não inclui mentoria, análise individual ou contato direto com Sal Ray. Se você precisa de orientação personalizada, veja a quarta opção.',
    recordingMessage: 'O Primeiro Passo está sendo gravado com cuidado. Quer ser avisada assim que estiver pronto?',
  },
  {
    id: 'vivencias',
    anchor: 'vivencias',
    level: 'NÍVEL 2 · APROFUNDAR',
    badge: 'VALOR DE LANÇAMENTO',
    name: 'Vivências de Reconstrução Emocional',
    subtitle:
      'Doze vivências profundas, conduzidas em áudio, para reconhecer padrões, reorganizar respostas internas e fortalecer uma base emocional mais estável.',
    highlight: '12 vivências · aproximadamente 60 minutos cada · cerca de 12 horas de experiência guiada',
    paraQuemE:
      'Para quem já percebe que não precisa apenas de um primeiro alívio, mas de um processo autoguiado mais profundo, com tempo para ouvir, refletir e integrar cada vivência.',
    oQueRecebe:
      'Uma sequência de 12 vivências de reconstrução emocional em áudio. Cada vivência cumpre uma função própria dentro do processo, sem depender de encontros ao vivo.',
    // Valor de lançamento: US$ 117 até 31/10/2026. A partir de 01/11/2026 (00:00,
    // Nova York) vale o preço cheio — ver getOffer() abaixo e o schema.org Offer
    // em lib/schema.ts (getReconstrucaoEmocionalSchema), que seguem a mesma data.
    narrativeLine: 'Comece antes do fim do ano a reconstrução que você quer levar para 2027.',
    price: 'US$ 117',
    originalPrice: 'US$ 147',
    // Nomeia os provedores (pedido 17 set 2026, confirmado por Sal Ray) pra
    // pessoa saber exatamente qual opção procurar no checkout da Payhip —
    // essa opção fica escondida atrás de uma seta lá, sem nome visível.
    installmentBadge: '4x sem juros via Klarna ou Affirm',
    paymentType: 'pagamento único',
    status: 'active',
    ctaText: 'Quero iniciar as Vivências',
    ctaHref: VIVENCIAS_CHECKOUT_117,
    microtext: 'Programa digital autoguiado. Pagamento seguro processado pelo Stripe. Acesso automático por e-mail. Não inclui sessões individuais. Parcelamento sujeito à aprovação do Klarna ou Affirm.',
  },
  {
    id: 'personalizado',
    anchor: 'personalizado',
    level: 'NÍVEL 4 · PROCESSO PERSONALIZADO',
    name: 'Acompanhamento Personalizado com Sal Ray',
    subtitle: 'Para quem precisa de uma leitura individual, prioridades específicas e um processo conduzido diretamente por Sal Ray.',
    paraQuemE:
      'Para quem sente que conteúdos autoguiados ou uma mentoria em grupo não são suficientes para a complexidade do momento atual e precisa compreender seus próprios padrões com mais precisão.',
    oQueRecebe:
      'Sessões individuais online, direcionamento personalizado, aplicação dos elementos do Método S.T.A.B.L.E.™ conforme as prioridades identificadas e integração das novas respostas na vida cotidiana.',
    status: 'contact-only',
    ctaText: 'Quero falar diretamente com Sal Ray',
    ctaHref: '', // não usado — OfferCta.tsx monta o link wa.me dinamicamente via buildWhatsAppUrl() para ofertas 'contact-only'
    microtext: 'O envio da mensagem não garante disponibilidade ou início imediato. A adequação do processo é avaliada individualmente.',
  },
]

export function getOffer(id: Offer['id'], now: Date = new Date()): Offer {
  const offer = offers.find((o) => o.id === id)
  if (!offer) throw new Error(`Offer not found: ${id}`)
  if (id === 'vivencias' && !isVivenciasLaunchPrice(now)) {
    return {
      ...offer,
      badge: undefined,
      originalPrice: undefined,
      priceNote: undefined,
      price: 'US$ 147',
      ctaText: 'Quero iniciar as Vivências',
      ctaHref: VIVENCIAS_CHECKOUT_147,
    }
  }
  return offer
}


export const offerLinksReady = {
  primeiroPasso: !getOffer('primeiro-passo').ctaHref.startsWith('PENDENTE_'),
  vivencias: !getOffer('vivencias').ctaHref.startsWith('PENDENTE_'),
} as const

/** Refund/purchase policy — briefing seção 14: NÃO publicar como placeholder. */
export const refundPolicy = {
  approvedText: null as string | null, // PENDENTE_POLITICA_REEMBOLSO — não inventar
  isApproved(): boolean {
    return this.approvedText !== null
  },
} as const

export const stableMethodPt = {
  intro: {
    paragrafo1:
      'O Método S.T.A.B.L.E.™ é uma estrutura não clínica criada por Sal Ray para ajudar pessoas a reconhecer padrões emocionais, fortalecer estabilidade interna e transformar compreensão em respostas mais conscientes na vida cotidiana.',
    paragrafo2:
      'A profundidade e o nível de acompanhamento mudam entre as opções. A base permanece a mesma: tornar o padrão visível, reorganizar a resposta e aplicar uma direção mais estável no dia a dia.',
  },
  // Nomes oficiais em inglês (briefing, seção 11) — nunca a nomenclatura antiga
  // (Settle, Track, Align, Build, Lead, Execute). Explicação em português.
  elementos: [
    { letra: 'S', nome: 'See the Pattern', explicacao: 'Ver o padrão que influencia pensamentos, reações, comportamentos e decisões.' },
    { letra: 'T', nome: 'Trace the Source', explicacao: 'Rastrear onde o padrão pode ter se desenvolvido e o que continua reforçando sua repetição.' },
    { letra: 'A', nome: 'Awaken Awareness', explicacao: 'Desenvolver uma relação mais consciente com pensamentos, emoções, gatilhos e escolhas.' },
    { letra: 'B', nome: 'Build Internal Stability', explicacao: 'Construir a estabilidade interna necessária para responder com mais clareza, confiança e limites.' },
    { letra: 'L', nome: 'Live in Alignment', explicacao: 'Levar as mudanças internas para decisões, relacionamentos, comunicação e rotina.' },
    { letra: 'E', nome: 'Evolve Sustainably', explicacao: 'Reforçar o progresso e desenvolver a capacidade de continuar evoluindo com independência.' },
  ],
} as const

export type PtFaq = { question: string; answer: string | null }

/** answer: null renderiza a pergunta com nota "resposta pendente de aprovação" em vez de texto inventado. */
export const ptFaqs: PtFaq[] = [
  {
    question: 'Qual opção devo escolher?',
    answer:
      'Se você quer apenas começar e experimentar a abordagem, escolha o programa de US$ 17. Se deseja um processo autoguiado mais profundo, escolha as 12 Vivências de Reconstrução Emocional. Se precisa de direção ao vivo, considere a mentoria. Se a sua situação exige análise individual, solicite o acompanhamento personalizado.',
  },
  {
    question: 'Preciso começar pelo programa de US$ 17?',
    answer:
      'Não. Ele é a porta de entrada recomendada para quem ainda não conhece as vivências, mas você pode começar pelo nível que corresponde à profundidade e ao apoio de que precisa agora.',
  },
  {
    question: 'Isso é terapia?',
    answer:
      'Não. O Método S.T.A.B.L.E.™ é uma estrutura não clínica de coaching, desenvolvimento pessoal e reconstrução emocional e de vida. Esses programas não substituem psicoterapia, psiquiatria, atendimento médico ou serviços de emergência.',
  },
  {
    question: 'Posso ouvir os áudios enquanto dirijo?',
    answer:
      'Não. As vivências devem ser ouvidas somente em um ambiente seguro, tranquilo e sem atividades que exijam atenção total. Não ouça dirigindo, operando equipamentos ou realizando qualquer tarefa de risco.',
  },
  {
    question: 'Os programas digitais incluem contato direto com Sal Ray?',
    answer:
      'Não, salvo quando isso estiver declarado na oferta. Os programas de US$ 17 e US$ 147 são autoguiados. Para contato ao vivo, escolha a mentoria ou solicite o acompanhamento personalizado.',
  },
  {
    question: 'A mentoria é individual?',
    answer:
      'Não. A mentoria acontece em grupo. O acompanhamento personalizado é a opção indicada para quem precisa trabalhar diretamente com Sal Ray sobre a própria situação.',
  },
  {
    question: 'Como recebo os áudios depois da compra?',
    answer:
      'Após a confirmação do pagamento processado pelo Stripe, a Payhip envia automaticamente um e-mail com o comprovante e o link para baixar ou acessar o conteúdo comprado. Verifique também as pastas Spam, Lixo Eletrônico e Promoções.',
  },
  {
    question: 'Os valores estão em reais ou dólares?',
    answer: 'Todos os valores desta página estão em dólares americanos, identificados como US$.',
  },
  {
    question: 'Existe garantia de resultado?',
    answer:
      'Não. Cada pessoa chega com uma história, um momento e um nível de aplicação diferentes. A página não deve prometer resultado específico ou igual para todas as pessoas.',
  },
  {
    question: 'Qual é a política de reembolso?',
    answer: null, // PENDENTE — briefing seção 14: "NÃO PUBLICAR ESTA RESPOSTA COMO PLACEHOLDER"
  },
]

/**
 * Vídeo principal — briefing, seção 5. A página pode entrar no ar só com este
 * vídeo (vídeos individuais são melhoria futura). Objeto plano de dados (sem
 * métodos) porque é importado diretamente por um Client Component — passar
 * um objeto com função como prop de Server para Client quebra o build.
 */
export const mainVideo = {
  srcUrl: null as string | null, // PENDENTE_VIDEO_PRINCIPAL — não inventar
  posterUrl: null as string | null, // PENDENTE — poster estático
  captionsUrl: null as string | null, // PENDENTE — legendas em português (.vtt)
  transcript: null as string | null, // PENDENTE — transcrição acessível
} as const

export function isMainVideoReady(): boolean {
  return mainVideo.srcUrl !== null
}

/** Depoimentos — componente reutilizável, permanece oculto até haver conteúdo real e autorizado (briefing, seção 13). */
export type PtTestimonial = {
  quote: string
  firstName: string
  location: string
  offerId: Offer['id']
  videoUrl?: string
}
export const ptTestimonials: PtTestimonial[] = []

export const comparisonRows = [
  { criterio: 'Formato', valores: ['6 áudios', '12 áudios', 'Grupo ao vivo', 'Sessões individuais'] },
  { criterio: 'Profundidade', valores: ['Inicial', 'Profunda e autoguiada', 'Guiada em grupo', 'Personalizada'] },
  { criterio: 'Acesso a Sal Ray', valores: ['Não', 'Não', 'Durante encontros', 'Direto e individual'] },
  { criterio: 'Ritmo', valores: ['Próprio', 'Próprio, em sequência', 'Domingos, 7 PM (Flórida), a partir de 29 de nov', 'Agenda definida'] },
  {
    criterio: 'Melhor para',
    valores: ['Dar o primeiro passo', 'Aprofundar sozinho', 'Ter direção ao vivo', 'Trabalhar o caso individual'],
  },
  {
    criterio: 'Ação',
    // Primeiro Passo: ainda em gravação, sem compra ativa (23 ago 2026) — CTA
    // aponta pra captura de interesse, não pro preço. Vivências: checkout real.
    valores: ['Avise-me quando estiver pronto', 'Comprar as Vivências', 'Garantir minha vaga', 'Agendar minha consulta'],
  },
] as const

/**
 * Cabeçalhos da tabela de comparação: nome em cima, preço embaixo. Os preços das Vivências e da
 * Mentoria vêm das mesmas funções (e datas) das seções dos programas: fonte única.
 */
export function getComparisonColumns(now: Date = new Date()) {
  const primeiroPasso = getOffer('primeiro-passo', now)
  const vivencias = getOffer('vivencias', now)
  const mentoria = getMentoriaReconstrucao(now)
  // Espaço sem quebra no preço, para o valor nunca quebrar no meio.
  const semQuebra = (preco: string) => preco.replace(/ /g, ' ')
  return [
    { nome: primeiroPasso.name, preco: semQuebra(primeiroPasso.price ?? ''), prefixo: undefined, nota: undefined },
    {
      nome: vivencias.name,
      preco: semQuebra(vivencias.price ?? ''),
      prefixo: undefined,
      nota: isVivenciasLaunchPrice(now) ? 'até 31 out. Depois: US$ 147' : undefined,
    },
    {
      nome: 'Mentoria',
      preco: semQuebra(mentoria.price),
      prefixo: undefined,
      nota: mentoria.presale ? 'até 18 nov. Depois: US$ 297' : undefined,
    },
    { nome: 'Personalizado', preco: semQuebra('US$ 50'), prefixo: 'a partir de', nota: undefined },
  ]
}
