/**
 * FONTE ÚNICA DE DADOS DO NEGÓCIO — Sal Ray
 * ---------------------------------------------------------------------------
 * Campos marcados "PENDENTE" vêm da seção 15 do brief e NÃO devem ser
 * inventados — foram deixados como placeholder visível até aprovação.
 * DOMINIO confirmado pelo usuário: salraycoach.com (o site real em produção).
 * EMAIL segue como inferência a partir do domínio — confirme antes de publicar.
 * ---------------------------------------------------------------------------
 */

export const DOMINIO = 'salraycoach.com'
export const SITE_URL = `https://${DOMINIO}`

export const business = {
  nome: 'Sal Ray',
  posicionamento: 'Emotional & Life Rebuilding Specialist',
  credencial: 'Emotional & Life Rebuilding Coach', // só aparece ligada ao nome
  autoridadeMetodologica: 'Creator of the S.T.A.B.L.E. Method',
  publico: 'Women in the U.S., 40–60, emotionally overloaded',
  entrega: '100% online',
  jobTitle: 'Emotional & Life Rebuilding Specialist',
} as const

export const contato = {
  email: 'hello@salraycoach.com', // inferido a partir do domínio — confirmar
  bookingUrl: 'PENDENTE_LINK_DE_AGENDAMENTO', // NÃO INVENTAR — aguardando plataforma/Stripe
  facebookGroupUrl: 'https://www.facebook.com/groups/backontrackcommunity',
  // Perfil do Facebook — usado apenas como identidade (schema.org sameAs), não como CTA clicável.
  facebookProfileUrl: 'https://www.facebook.com/profile.php?id=61562494663397',
  // Canal principal de contato direto — todos os CTAs de "mensagem" apontam para o Messenger.
  messengerUrl:
    "https://m.me/salraycoach?text=Have%20a%20question%3F%20Send%20me%20a%20message.%20I%27ll%20personally%20respond%20as%20soon%20as%20I%20can.",
  instagramUrl: 'PENDENTE_URL_INSTAGRAM',
} as const

export const ctas = {
  primary: 'Schedule an Initial Consultation',
  secondary: 'Join the Private Facebook Community',
  tertiary: 'Explore the Resource Library',
} as const

/**
 * Preço: o brief registra US$50 (~60min) como premissa a confirmar antes de
 * publicar, e também menciona valores antigos (US$80/sessão, US$600/pacote de
 * 10) que NÃO devem aparecer no site até esclarecidos. Mostramos apenas o
 * valor da consulta inicial, com o aviso de "sujeito a confirmação".
 */
export const pricing = {
  consultationPrice: 'US$50',
  consultationDuration: '~60 minutes',
  confirmed: false, // true somente após confirmação explícita antes da publicação
} as const

/**
 * S.T.A.B.L.E. — significados aprovados por Sal Ray (ver brief completo em
 * "Metodo STABLE.docx"). Fase 1 = Emotional Pattern Identification (S, T, A).
 * Fase 2 = Emotional & Life Rebuilding (B, L, E).
 */
export const stableMethod = {
  letters: [
    {
      letter: 'S',
      name: 'See the Pattern',
      shortDescription: 'Recognize the emotional patterns influencing your thoughts, reactions, behaviors, and decisions.',
      expandedExplanation:
        'Meaningful change begins with seeing what is actually happening. This element focuses on identifying recurring emotional responses, triggers, internal conflicts, and behavioral cycles that may be affecting different areas of life.\n\nThe purpose is to move from confusion to recognition. Instead of viewing every difficult situation as an isolated event, the individual begins to see the pattern connecting those experiences.',
      coreQuestion: 'What pattern continues to repeat in my life?',
      phase: 1,
    },
    {
      letter: 'T',
      name: 'Trace the Source',
      shortDescription: 'Explore where the pattern may have developed and what continues to reinforce it.',
      expandedExplanation:
        'Once a pattern has been recognized, the next step is to understand its emotional structure. This may include exploring formative experiences, learned responses, internal beliefs, protective behaviors, or unresolved emotional associations.\n\nThe objective is not to remain trapped in the past. It is to understand why the present response makes sense within the person’s emotional history.',
      coreQuestion: 'Where did this response begin, and why does it continue?',
      phase: 1,
    },
    {
      letter: 'A',
      name: 'Awaken Awareness',
      shortDescription: 'Develop a clearer, more conscious relationship with thoughts, emotions, triggers, and choices.',
      expandedExplanation:
        'Awareness creates space between an emotional trigger and an automatic reaction. During this element, the individual learns to observe internal experiences with greater clarity rather than immediately being controlled by them.\n\nThis awareness supports more intentional choices and reduces the likelihood of repeating the same response without understanding it.',
      coreQuestion: 'What is happening inside me before I react?',
      phase: 1,
    },
    {
      letter: 'B',
      name: 'Build Internal Stability',
      shortDescription: 'Strengthen the internal foundation needed for emotional regulation, confidence, and resilience.',
      expandedExplanation:
        'Recognition alone is not enough. The person must also develop greater internal stability. This element focuses on strengthening emotional responses, personal boundaries, self-trust, clarity, and the capacity to remain grounded during challenging situations.\n\nThis is where understanding begins to become rebuilding.',
      coreQuestion: 'What internal structure do I need to respond differently?',
      phase: 2,
    },
    {
      letter: 'L',
      name: 'Live in Alignment',
      shortDescription: 'Translate internal changes into healthier actions, relationships, decisions, and daily routines.',
      expandedExplanation:
        'Emotional work becomes meaningful when it begins to affect everyday life. This element focuses on applying new awareness and greater stability to communication, relationships, personal decisions, boundaries, habits, and future direction.\n\nThe objective is to reduce the distance between what the person understands internally and how they actually live.',
      coreQuestion: 'How can my daily choices reflect the person I am becoming?',
      phase: 2,
    },
    {
      letter: 'E',
      name: 'Evolve Sustainably',
      shortDescription: 'Reinforce progress and develop the ability to maintain growth beyond the initial process.',
      expandedExplanation:
        'Sustainable development requires more than a temporary breakthrough. This element focuses on reinforcing new responses, recognizing future warning signs, maintaining emotional practices, and continuing to develop with greater independence.\n\nThe goal is not perfection. It is the ability to recover, recalibrate, and continue moving forward without automatically returning to old patterns.',
      coreQuestion: 'How can I maintain progress as life continues to change?',
      phase: 2,
    },
  ],
} as const

export const processSteps = [
  {
    step: 1,
    name: 'Initial Consultation',
    description: 'Understand your situation and determine fit.',
  },
  {
    step: 2,
    name: 'Rebuilding Plan',
    description: 'Define the patterns and priorities.',
  },
  {
    step: 3,
    name: 'Guided Work',
    description: 'Develop stability, self-trust, and practical change.',
  },
  {
    step: 4,
    name: 'Integration',
    description: 'Support consistency beyond the session.',
  },
] as const

export const transformationDiagram = ['Understand', 'Rebuild', 'Stabilize', 'Move Forward'] as const

export const helpAreas = [
  'Overthinking and emotional overload',
  'Repeating relationship patterns',
  'Loss of identity or direction',
  'Self-sabotage',
  'Difficulty trusting yourself',
  'Emotional instability after major life changes',
] as const

export const problemCards = [
  'Overthinking',
  'Emotional overload',
  'Repeating relationship patterns',
  'Loss of direction',
] as const

/** Aviso base — seção 11. Revisão jurídica obrigatória antes de publicar. */
export const clinicalDisclaimer =
  'Sal Ray provides non-clinical coaching and personal development services. These services are educational and supportive in nature and do not diagnose, treat, cure, or prevent mental-health or medical conditions. They are not a substitute for psychotherapy, psychiatry, medical care, or emergency services.'

/** Recurso de crise — obrigatório em /faq, /contact, /disclaimer e artigos sensíveis. */
export const crisisResource =
  'If you are in crisis or in immediate danger, please contact local emergency services or the 988 Suicide & Crisis Lifeline (call or text 988 in the U.S.). This service is not emergency or crisis care.'

/**
 * Prova social — seção 2 da análise externa. NÃO INVENTAR nenhum destes itens.
 * Ficam vazios (seções ocultas automaticamente) até Sal Ray fornecer conteúdo
 * real: depoimentos com permissão por escrito, estudos de caso reais
 * (anonimizados se necessário) e credenciais/formação verificáveis.
 */
export type Testimonial = { quote: string; name: string; photo?: string }
export const testimonials: Testimonial[] = []

export type CaseStudy = { title: string; summary: string; outcome: string }
export const caseStudies: CaseStudy[] = []

export type Credential = { title: string; issuer?: string; year?: string }
export const credentials: Credential[] = []

export type Faq = { question: string; answer: string }

export const faqs: Faq[] = [
  {
    question: 'Is this therapy?',
    answer:
      'No. Sal Ray provides non-clinical coaching and personal development support. The work does not diagnose or treat mental health conditions and is not a substitute for licensed healthcare.',
  },
  {
    question: 'What is Emotional & Life Rebuilding?',
    answer:
      'A structured process for understanding repeating emotional patterns, strengthening internal stability, rebuilding self-trust, and creating more responsible forward movement.',
  },
  {
    question: 'Who is this work for?',
    answer:
      'Adults who feel emotionally overloaded, stuck in repeating patterns, disconnected from direction, or ready to work actively on personal change.',
  },
  {
    question: 'Do you use hypnosis?',
    answer:
      'When appropriate and agreed upon, Sal may use non-clinical hypnosis as one supportive tool within a broader process. It is not the brand’s central promise and is never presented as medical treatment.',
  },
  {
    question: 'What happens in the initial consultation?',
    answer:
      'The consultation clarifies the current situation, identifies relevant patterns and priorities, explains the approach, and determines whether there is a responsible fit.',
  },
  {
    question: 'Are sessions online?',
    answer: 'Yes. Sessions are delivered online. The booking system displays time zones clearly.',
  },
  {
    question: 'Can you help in a crisis?',
    answer:
      'No. This service is not emergency or crisis care. Anyone in immediate danger or experiencing a mental-health emergency should contact local emergency services or an appropriate crisis resource (in the U.S.: 988 Suicide & Crisis Lifeline).',
  },
  {
    question: 'What is the S.T.A.B.L.E. Method?',
    answer:
      'A structured, non-clinical framework created by Sal Ray for identifying emotional patterns, rebuilding internal stability, and applying meaningful change in daily life — applied through two phases: Emotional Pattern Identification and Emotional & Life Rebuilding. See The S.T.A.B.L.E. Method page for the full explanation of each element.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'The final cancellation and rescheduling policy is being finalized — see the Cancellation & Rescheduling Policy page for the current version, and confirm directly during booking.',
  },
  {
    question: 'How do I begin?',
    answer: 'Schedule a paid initial consultation through the secure booking page.',
  },
]
