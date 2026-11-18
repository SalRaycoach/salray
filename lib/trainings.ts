/**
 * Os dois treinamentos interativos (PDFs) e tudo que é específico de cada um:
 * título, capa, arquivo do PDF e número de páginas. Sem imports de Node, então
 * pode ser usado também em componentes do navegador.
 *
 *  - pdf1: "The Same Problem Keeps Finding You" / "O Mesmo Problema Continua Te Encontrando"
 *  - pdf2: "You Fix Everything for Everyone. Who Fixes You?" / "Você Resolve Tudo para Todo Mundo. Quem Conserta Você?"
 *
 * Cadastros antigos não têm o campo `training`: valem como pdf1.
 */

export type Training = 'pdf1' | 'pdf2'
export type TrainingLang = 'en' | 'pt'

export const TRAINING_IDS: Training[] = ['pdf1', 'pdf2']

type TrainingInfo = {
  /** Valor do parâmetro `p` do link de download (o PDF 1 não precisa dele). */
  downloadParam: string
  title: Record<TrainingLang, string>
  cover: Record<TrainingLang, string>
  pdf: Record<TrainingLang, string>
  pages: Record<TrainingLang, number>
}

export const TRAININGS: Record<Training, TrainingInfo> = {
  pdf1: {
    downloadParam: '1',
    title: {
      en: 'The Same Problem Keeps Finding You',
      pt: 'O Mesmo Problema Continua Te Encontrando',
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
    title: {
      en: 'You Fix Everything for Everyone. Who Fixes You?',
      pt: 'Você Resolve Tudo para Todo Mundo. Quem Conserta Você?',
    },
    cover: { en: '/email/training-2-cover.jpg', pt: '/email/training-2-cover-pt.jpg' },
    pdf: {
      en: '/downloads/you-fix-everything-for-everyone-who-fixes-you.pdf',
      pt: '/downloads/voce-resolve-tudo-para-todo-mundo-quem-conserta-voce.pdf',
    },
    pages: { en: 121, pt: 123 },
  },
}

export function parseTraining(value: unknown): Training {
  return value === 'pdf2' ? 'pdf2' : 'pdf1'
}

/** Parâmetro `p` do link de download: "2" → pdf2; qualquer outra coisa (ou ausente) → pdf1. */
export function trainingFromDownloadParam(value: unknown): Training {
  return value === TRAININGS.pdf2.downloadParam ? 'pdf2' : 'pdf1'
}
