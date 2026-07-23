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
  whatsapp: '18635137521', // +1 (863) 513-7521
  whatsappDisplay: '+1 (863) 513-7521',
  bookingUrl: 'PENDENTE_LINK_DE_AGENDAMENTO', // NÃO INVENTAR — aguardando plataforma/Stripe
  facebookGroupUrl: 'PENDENTE_URL_GRUPO_FACEBOOK', // NÃO INVENTAR
  instagramUrl: 'PENDENTE_URL_INSTAGRAM',
} as const

export const social = {
  whatsappLink: `https://wa.me/${contato.whatsapp}`,
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
 * S.T.A.B.L.E. — NÃO INVENTAR o significado de cada letra. Mostrar as 6
 * letras em sequência; o campo "meaning" fica como placeholder até a
 * expansão aprovada ser fornecida.
 */
export const stableMethod = {
  letters: [
    { letter: 'S', meaning: '[Pending approved meaning]' },
    { letter: 'T', meaning: '[Pending approved meaning]' },
    { letter: 'A', meaning: '[Pending approved meaning]' },
    { letter: 'B', meaning: '[Pending approved meaning]' },
    { letter: 'L', meaning: '[Pending approved meaning]' },
    { letter: 'E', meaning: '[Pending approved meaning]' },
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
      'A proprietary non-clinical framework created by Sal Ray. The full description of each of the six components will be published once approved — see The S.T.A.B.L.E. Method page for the current outline.',
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
