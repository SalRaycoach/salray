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
 *   - A seção de Mentoria fica oculta (não publicar com placeholder visível).
 *   - A pergunta de reembolso no FAQ não deve ser publicada com resposta genérica.
 * ---------------------------------------------------------------------------
 */

export const PT_ROUTE = '/pt/reconstrucao-emocional/'
export const PT_CANONICAL_URL = `https://salraycoach.com${PT_ROUTE}`

export const ptPageMeta = {
  title: 'Reconstrução Emocional em Português | Método S.T.A.B.L.E.™ | SAL Ray',
  description:
    'Conheça quatro formas de começar sua reconstrução emocional com o Método S.T.A.B.L.E.™: vivências guiadas em áudio, mentoria em grupo e acompanhamento personalizado com Sal Ray.',
  ogImageAlt: 'Reconstrução Emocional com o Método S.T.A.B.L.E.™ — SAL Ray',
} as const

/**
 * WhatsApp — número real ainda não fornecido (briefing, seção 21). Formato
 * esperado: código do país + DDD/área, sem símbolos (ex.: "15551234567").
 * PLACEHOLDER ÓBVIO até Sal Ray confirmar o número real.
 */
export const whatsapp = {
  numberE164: 'PENDENTE_NUMERO_WHATSAPP', // ex. real esperado: "1XXXXXXXXXX" — NÃO INVENTAR
  isPending(): boolean {
    return this.numberE164.startsWith('PENDENTE_')
  },
  messages: {
    ajudaParaEscolher:
      'Olá, Sal Ray. Vi a página de Reconstrução Emocional e preciso de ajuda para escolher a opção mais adequada para mim.',
    personalizado: 'Olá, Sal Ray. Quero entender se o acompanhamento personalizado é adequado para o meu momento.',
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

export type OfferStatus = 'active' | 'open-cohort' | 'preparing' | 'enrollment-closed' | 'contact-only'

export type Offer = {
  id: 'primeiro-passo' | 'vivencias' | 'mentoria' | 'personalizado'
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
  paymentType?: string
  status: OfferStatus
  ctaText: string
  ctaHref: string // link direto de checkout da Payhip — PENDENTE_ até existir
  microtext: string
  limites?: string
}

export const offers: Offer[] = [
  {
    id: 'primeiro-passo',
    anchor: 'primeiro-passo',
    level: 'NÍVEL 1 · COMEÇAR',
    badge: 'RECOMENDADO PARA COMEÇAR',
    name: 'Primeiro Passo S.T.A.B.L.E.™',
    subtitle:
      'Cinco vivências guiadas em áudio para começar a reorganizar seu estado interno — com uma vivência bônus para reforçar o processo.',
    paraQuemE:
      'Para quem quer experimentar o Método S.T.A.B.L.E.™ de maneira simples, acessível e autoguiada, antes de decidir se precisa de um processo mais profundo.',
    oQueRecebe:
      '5 vivências guiadas em áudio + 1 vivência bônus. Acesso digital para ouvir no próprio ritmo, em um ambiente tranquilo e sem interrupções.',
    comoFunciona:
      'O botão leva diretamente ao checkout da Payhip. O pagamento é processado pelo Stripe. Após a aprovação, a Payhip envia automaticamente o comprovante e o link de acesso por e-mail, sem envio manual por Sal Ray.',
    price: 'US$ 17',
    paymentType: 'pagamento único',
    status: 'active',
    ctaText: 'Começar agora por US$ 17',
    ctaHref: 'PENDENTE_CHECKOUT_PAYHIP_17', // NÃO INVENTAR — link direto de checkout da Payhip
    microtext: 'Pagamento seguro processado pelo Stripe. Acesso e instruções enviados automaticamente por e-mail após a confirmação.',
    limites: 'Este programa não inclui mentoria, análise individual ou contato direto com Sal Ray. Se você precisa de orientação personalizada, veja a quarta opção.',
  },
  {
    id: 'vivencias',
    anchor: 'vivencias',
    level: 'NÍVEL 2 · APROFUNDAR',
    name: 'Vivências de Reconstrução Emocional',
    subtitle:
      'Doze vivências profundas, conduzidas em áudio, para reconhecer padrões, reorganizar respostas internas e fortalecer uma base emocional mais estável.',
    highlight: '12 vivências · aproximadamente 60 minutos cada · cerca de 12 horas de experiência guiada',
    paraQuemE:
      'Para quem já percebe que não precisa apenas de um primeiro alívio, mas de um processo autoguiado mais profundo, com tempo para ouvir, refletir e integrar cada vivência.',
    oQueRecebe:
      'Uma sequência de 12 vivências de reconstrução emocional em áudio. Cada vivência cumpre uma função própria dentro do processo, sem depender de encontros ao vivo.',
    price: 'US$ 147',
    paymentType: 'pagamento único',
    status: 'active',
    ctaText: 'Quero iniciar as Vivências por US$ 147',
    ctaHref: 'PENDENTE_CHECKOUT_PAYHIP_147', // NÃO INVENTAR — link direto de checkout da Payhip
    microtext: 'Programa digital autoguiado. Pagamento seguro processado pelo Stripe. Acesso automático por e-mail. Não inclui sessões individuais.',
  },
  {
    id: 'mentoria',
    anchor: 'mentoria',
    level: 'NÍVEL 3 · ACOMPANHAMENTO EM GRUPO',
    name: 'Mentoria S.T.A.B.L.E.™',
    subtitle:
      'Direção, estrutura e encontros ao vivo para quem quer aplicar o método com acompanhamento, sem entrar imediatamente em um processo individual.',
    paraQuemE:
      'Para quem compreende melhor quando pode ouvir uma explicação ao vivo, organizar o que está acontecendo, fazer perguntas e acompanhar a aplicação do método junto a outras pessoas.',
    oQueRecebe:
      'Encontros online em grupo com Sal Ray, direcionamento estruturado, aplicação prática do Método S.T.A.B.L.E.™ e espaço organizado para perguntas e integração.',
    status: 'preparing', // "Próxima turma em preparação" — nunca 'open-cohort' sem preço/calendário/vagas reais aprovados
    ctaText: 'Quero participar da Mentoria S.T.A.B.L.E.™',
    ctaHref: 'PENDENTE_CHECKOUT_PAYHIP_MENTORIA', // NÃO INVENTAR — link do plano de preço/checkout da Mentoria
    microtext: 'Pagamento processado pelo Stripe. Após a confirmação, você receberá automaticamente por e-mail o acesso, as datas e as primeiras orientações.',
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

export function getOffer(id: Offer['id']): Offer {
  const offer = offers.find((o) => o.id === id)
  if (!offer) throw new Error(`Offer not found: ${id}`)
  return offer
}

/** Mentoria: só pode ficar visível com checkout ativo quando turma realmente aberta E dados abaixo confirmados (briefing, seção 8 e 21). */
export const mentoriaConfig = {
  status: 'preparing' as OfferStatus,
  price: null as string | null, // PENDENTE — não inventar
  numeroEncontros: null as number | null, // PENDENTE
  duracaoPorEncontro: null as string | null, // PENDENTE
  calendario: null as string | null, // PENDENTE
  limiteParticipantes: null as number | null, // PENDENTE
  politicaDeFaltas: null as string | null, // PENDENTE
  isReadyToPublish(): boolean {
    return (
      this.status === 'open-cohort' &&
      this.price !== null &&
      this.numeroEncontros !== null &&
      this.duracaoPorEncontro !== null &&
      this.calendario !== null &&
      this.limiteParticipantes !== null
    )
  },
} as const

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
  { criterio: 'Ritmo', valores: ['Próprio', 'Próprio, em sequência', 'Calendário da turma', 'Agenda definida'] },
  {
    criterio: 'Melhor para',
    valores: ['Dar o primeiro passo', 'Aprofundar sozinho', 'Ter direção ao vivo', 'Trabalhar o caso individual'],
  },
  { criterio: 'Ação', valores: ['Comprar por US$ 17', 'Comprar por US$ 147', 'Comprar vaga da turma', 'Conversar no WhatsApp'] },
] as const

export const comparisonColumns = ['US$ 17', 'US$ 147', 'Mentoria', 'Personalizado'] as const
