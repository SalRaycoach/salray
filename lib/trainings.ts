/**
 * FONTE ÚNICA dos treinamentos interativos (PDFs). Tudo que é específico de um
 * treinamento mora aqui: título, capa, arquivo do PDF, páginas, frase de "para qual
 * situação" e se já está publicado. A página /first-steps/, o seletor, os cartões, o
 * cadastro, o e-mail de entrega e a rota de download leem DESTE arquivo.
 *
 * Para publicar um treinamento novo (pdf3, pdf4, pdf5):
 *   1. copie a capa e os PDFs para os caminhos de `cover` e `pdf` abaixo;
 *   2. preencha `pages` e `situation`;
 *   3. troque `published` para true.
 * A página, o seletor "qual treinamento é para mim" e o rastreio se ajustam sozinhos.
 * Quem não está publicado não aparece em lugar nenhum e não recebe cadastros.
 *
 * Sem imports de Node: também é usado em componentes do navegador.
 * Cadastros antigos não têm o campo `training`: valem como pdf1.
 *
 * Os e-mails de acompanhamento (dias 3, 7 e 15) são outra coisa: só existem para
 * pdf1, pdf2 e pdf4 (scripts/lib/followups-core.js). Treinamento sem sequência definida
 * simplesmente não recebe e-mail de acompanhamento.
 */

export type Training = 'pdf1' | 'pdf2' | 'pdf3' | 'pdf4' | 'pdf5'
export type TrainingLang = 'en' | 'pt'

export const TRAINING_IDS: Training[] = ['pdf1', 'pdf2', 'pdf3', 'pdf4', 'pdf5']

type TrainingInfo = {
  /** Valor do parâmetro `p` do link de download (o PDF 1 não precisa dele nos links antigos). */
  downloadParam: string
  /** false = ainda não existe para o público: some da página, do seletor e dos cadastros. */
  published: boolean
  title: Record<TrainingLang, string>
  /** Uma frase: para qual situação o treinamento serve. */
  situation: Record<TrainingLang, string>
  cover: Record<TrainingLang, string>
  pdf: Record<TrainingLang, string>
  pages: Record<TrainingLang, number>
}

export const TRAININGS: Record<Training, TrainingInfo> = {
  pdf1: {
    downloadParam: '1',
    published: true,
    title: {
      en: 'The Same Problem Keeps Finding You',
      pt: 'O Mesmo Problema Continua Te Encontrando',
    },
    situation: {
      en: 'For those who feel the same problem keeps coming back in different places in their life.',
      pt: 'Para quem sente que o mesmo problema volta em lugares diferentes da vida.',
    },
    cover: { en: '/email/training-cover.jpg', pt: '/email/training-cover-pt.jpg' },
    pdf: {
      en: '/downloads/the-same-problem-keeps-finding-you.pdf',
      pt: '/downloads/o-mesmo-problema-continua-te-encontrando.pdf',
    },
    pages: { en: 120, pt: 120 },
  },
  pdf2: {
    downloadParam: '2',
    published: true,
    title: {
      en: 'You Fix Everything for Everyone. Who Fixes You?',
      pt: 'Você Resolve Tudo para Todo Mundo. Quem Conserta Você?',
    },
    situation: {
      en: 'For those who fix everyone else’s life and forget their own.',
      pt: 'Para quem resolve a vida de todo mundo e se esquece de si mesma.',
    },
    cover: { en: '/email/training-2-cover.jpg', pt: '/email/training-2-cover-pt.jpg' },
    pdf: {
      en: '/downloads/you-fix-everything-for-everyone-who-fixes-you.pdf',
      pt: '/downloads/voce-resolve-tudo-para-todo-mundo-quem-conserta-voce.pdf',
    },
    pages: { en: 121, pt: 123 },
  },
  // ---- Prontos para o futuro: published=false, não aparecem em lugar nenhum. ----
  pdf3: {
    downloadParam: '3',
    published: false,
    title: { en: 'You Start Strong. Then You Disappear.', pt: '' },
    situation: { en: '', pt: '' },
    cover: { en: '/email/training-3-cover.jpg', pt: '' },
    pdf: { en: '/downloads/you-start-strong-then-you-disappear.pdf', pt: '' },
    pages: { en: 0, pt: 0 },
  },
  pdf4: {
    downloadParam: '4',
    published: true,
    title: {
      en: 'You Say Yes to Everyone. Then Wonder Where Your Life Went.',
      pt: 'Você Diz Sim a Todo Mundo. Depois Se Pergunta para Onde Foi a Sua Vida.',
    },
    situation: {
      en: 'For those who say yes to everyone and wonder where their own life went.',
      pt: 'Para quem diz sim a todo mundo e se pergunta para onde foi a própria vida.',
    },
    cover: { en: '/email/training-4-cover.jpg', pt: '/email/training-4-cover-pt.jpg' },
    pdf: {
      en: '/downloads/you-say-yes-to-everyone-then-wonder-where-your-life-went.pdf',
      pt: '/downloads/voce-diz-sim-a-todo-mundo-depois-se-pergunta-para-onde-foi-a-sua-vida.pdf',
    },
    pages: { en: 116, pt: 118 },
  },
  pdf5: {
    downloadParam: '5',
    published: false,
    title: { en: 'You Are the Strong One. And You Are Exhausted.', pt: '' },
    situation: { en: '', pt: '' },
    cover: { en: '/email/training-5-cover.jpg', pt: '' },
    pdf: { en: '/downloads/you-are-the-strong-one-and-you-are-exhausted.pdf', pt: '' },
    pages: { en: 0, pt: 0 },
  },
}

/** Treinamentos publicados, na ordem pdf1, pdf2, pdf3... */
export const PUBLISHED_TRAININGS: Training[] = TRAINING_IDS.filter((id) => TRAININGS[id].published)

function isTrainingId(value: unknown): value is Training {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(TRAININGS, value)
}

/**
 * Para linhas já gravadas: id conhecido vale ele mesmo; ausente ou desconhecido vale pdf1
 * (cadastros antigos não têm o campo training).
 */
export function parseTraining(value: unknown): Training {
  return isTrainingId(value) ? value : 'pdf1'
}

/**
 * Para pedidos novos (cadastro): só aceita treinamento PUBLICADO. Ausente → pdf1 (formulários
 * antigos não mandam o campo). Id desconhecido ou ainda não publicado → null (o pedido é recusado).
 */
export function resolvePublishedTraining(value: unknown): Training | null {
  if (value === undefined || value === null || value === '') return 'pdf1'
  return isTrainingId(value) && TRAININGS[value].published ? value : null
}

/** Parâmetro `p` do link de download: acha o treinamento dono do número; sem p (links antigos) → pdf1. */
export function trainingFromDownloadParam(value: unknown): Training {
  const found = TRAINING_IDS.find((id) => TRAININGS[id].downloadParam === value)
  return found ?? 'pdf1'
}

// ---------------------------------------------------------------------------
// Seletor "qual treinamento é para mim" (/first-steps/)
// ---------------------------------------------------------------------------

/**
 * Cada pergunta tem uma opção por treinamento (a ordem é a de TRAINING_IDS). O seletor só mostra
 * e só conta as opções dos treinamentos PUBLICADOS. Cada opção vale 1 ponto para o treinamento dela.
 * Empate: vale a resposta da última pergunta.
 */
export const QUIZ_QUESTIONS: { prompt: string; options: Record<Training, string> }[] = [
  {
    prompt: 'Which sentence is closest to what you tell yourself?',
    options: {
      pdf1: 'The same problem keeps coming back, in different places.',
      pdf2: 'If I do not fix it, nobody will.',
      pdf3: 'I start with energy, then I fade away.',
      pdf4: 'I say yes even when I want to say no.',
      pdf5: 'I have to be the strong one, and I am tired.',
    },
  },
  {
    prompt: 'What happens most in your week?',
    options: {
      pdf1: 'I notice I react the same way, again.',
      pdf2: 'Someone needs help and I am already helping.',
      pdf3: 'I begin something and drop it halfway.',
      pdf4: 'I agree first and regret it later.',
      pdf5: 'I keep going even when I have nothing left.',
    },
  },
  {
    prompt: 'What do you want most right now?',
    options: {
      pdf1: 'To understand why it keeps repeating.',
      pdf2: 'To stop carrying everyone else’s problems.',
      pdf3: 'To finish what I start and stay with it.',
      pdf4: 'To say no without guilt.',
      pdf5: 'To rest without feeling weak.',
    },
  },
]

/**
 * Vídeo opcional acima do resultado do seletor. UM só campo: cole a URL aqui.
 * Vazio = o bloco do vídeo fica totalmente oculto. Aceita um arquivo (.mp4 ou .webm) ou um
 * link de incorporação (por exemplo https://www.youtube.com/embed/ID).
 */
export const QUIZ_VIDEO_URL = ''

/**
 * Resultado do seletor a partir das respostas (uma por pergunta, cada uma é o id do treinamento
 * escolhido). Maior pontuação vence; empate vence quem foi escolhido na última pergunta.
 */
export function pickQuizResult(answers: Training[]): Training | null {
  if (answers.length === 0) return null
  const points = new Map<Training, number>()
  for (const a of answers) points.set(a, (points.get(a) ?? 0) + 1)
  const top = Math.max(...points.values())
  const leaders = [...points.entries()].filter(([, n]) => n === top).map(([id]) => id)
  const last = answers[answers.length - 1] as Training
  return leaders.includes(last) ? last : (leaders[0] as Training)
}
