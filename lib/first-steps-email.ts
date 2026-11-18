import { SITE_URL, contato, business } from '@/lib/config'
import { makeToken, type Lang } from '@/lib/first-steps'
import { TRAININGS, type Training } from '@/lib/trainings'

/**
 * E-mail de entrega do PDF 1 ("The Same Problem Keeps Finding You" / "O Mesmo
 * Problema Continua Te Encontrando"). Design aprovado em
 * "Entrega PDF 1/email_{en,pt}_REFERENCIA.html": tabelas, CSS inline, 560 px,
 * preheader e tema escuro. Diferença para a referência: imagens por URL
 * absoluta (Gmail bloqueia base64) e links reais.
 */

type Copy = {
  subject: string
  preheader: string
  eyebrow: string
  title: string
  intro: string
  coverAlt: string
  button: string
  beforeTitle: string
  bullets: { bold: string; text: string }[]
  closing: string
  role: string
  receivingBecause: string
  unsubscribe: string
  privacy: string
  htmlLang: string
}

const COPY: Record<Lang, Copy> = {
  en: {
    subject: 'Your training is ready',
    preheader: 'Your 30-day interactive training is ready.',
    eyebrow: 'The Same Problem Keeps Finding You',
    title: 'Your training is ready.',
    intro:
      'Thank you for trusting this work. Your 30-day training is below. It is not a reading PDF: every box can be filled in, right on your phone.',
    coverAlt: 'Cover of the training: The Same Problem Keeps Finding You',
    button: 'Open your training',
    beforeTitle: 'Before you start',
    bullets: [
      { bold: 'Save the file first.', text: 'Keep it on your device, in a place only you open.' },
      {
        bold: 'Open it in Adobe Acrobat Reader.',
        text: 'It is free, and it is the app that works best with the boxes. Email previews and some phone readers do not show them.',
      },
      { bold: 'One day at a time.', text: 'About 20 minutes. A good day to begin is a Monday, but it is not a rule.' },
    ],
    closing: 'During the 30 days I will write to you a few times, only to support your practice.',
    role: 'Emotional & Life Rebuilding Coach',
    receivingBecause: 'You are receiving this because you asked for the training at salraycoach.com.',
    unsubscribe: 'Unsubscribe',
    privacy: 'Privacy',
    htmlLang: 'en',
  },
  pt: {
    subject: 'Seu treinamento está pronto',
    preheader: 'O seu treinamento interativo de 30 dias está pronto.',
    eyebrow: 'O Mesmo Problema Continua Te Encontrando',
    title: 'O seu treinamento está pronto.',
    intro:
      'Agradeço por confiar neste trabalho. O seu treinamento de 30 dias está logo abaixo. Não é um PDF para ler: cada caixa pode ser preenchida, direto no celular.',
    coverAlt: 'Capa do treinamento: O Mesmo Problema Continua Te Encontrando',
    button: 'Abrir o treinamento',
    beforeTitle: 'Antes de começar',
    bullets: [
      { bold: 'Salve o arquivo primeiro.', text: 'Guarde no seu aparelho, em um lugar que só você abre.' },
      {
        bold: 'Abra no Adobe Acrobat Reader.',
        text: 'É gratuito e é o aplicativo que funciona melhor com as caixas. A pré-visualização do e-mail e alguns leitores de celular não mostram.',
      },
      { bold: 'Um dia de cada vez.', text: 'Cerca de 20 minutos. Um bom dia para começar é segunda-feira, mas não é regra.' },
    ],
    closing: 'Durante os 30 dias eu vou escrever para você algumas vezes, só para apoiar a sua prática.',
    role: 'Coach de Reconstrução Emocional e de Vida',
    receivingBecause: 'Você está recebendo este e-mail porque pediu o treinamento em salraycoach.com.',
    unsubscribe: 'Cancelar inscrição',
    privacy: 'Privacidade',
    htmlLang: 'pt-BR',
  },
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export type FirstStepsEmailOptions = {
  lang: Lang
  /** Quem vai receber. O token (HMAC do e-mail) é gerado aqui, nunca vai o e-mail na URL. */
  email: string
  /** Só para testes locais; em produção é sempre SITE_URL. */
  /** Qual treinamento está sendo entregue (padrão: pdf1). */
  training?: Training
  baseUrl?: string
  /** Só para testes: troca as URLs das imagens (ex.: "cid:logo"). */
  imageSrc?: { logo: string; cover: string }
}

export type FirstStepsEmail = {
  subject: string
  html: string
  text: string
  headers: Record<string, string>
}

export function buildFirstStepsEmail({ lang, email, training = 'pdf1', baseUrl = SITE_URL, imageSrc }: FirstStepsEmailOptions): FirstStepsEmail {
  // Título (e capa, PDF) mudam com o treinamento; o resto do texto é o mesmo.
  const t = TRAININGS[training]
  const c: Copy = {
    ...COPY[lang],
    eyebrow: t.title[lang],
    coverAlt: `${lang === 'pt' ? 'Capa do treinamento' : 'Cover of the training'}: ${t.title[lang]}`,
  }
  const token = makeToken(email)

  // O PDF 1 não leva o parâmetro p (links já enviados continuam valendo); os demais levam p=<número>.
  const downloadUrl = `${baseUrl}/api/first-steps/download/?l=${lang}&t=${token}${training !== 'pdf1' ? `&p=${t.downloadParam}` : ''}`
  const unsubscribeUrl = `${baseUrl}/unsubscribe/?l=${lang}&t=${token}`
  const oneClickUnsubscribeUrl = `${baseUrl}/api/first-steps/unsubscribe/?t=${token}`
  const privacyUrl = `${baseUrl}${lang === 'pt' ? '/pt/politica-de-privacidade/' : '/privacy-policy/'}`
  const logoSrc = imageSrc?.logo ?? `${baseUrl}/email/logo.png`
  const coverSrc = imageSrc?.cover ?? `${baseUrl}${t.cover[lang]}`

  const bulletRows = c.bullets
    .map(
      (b) =>
        `<tr><td style="padding:0 0 14px 0;font:15px/24px Arial,Helvetica,sans-serif;color:#D9D4CC"><span style="color:#F7941D">&#9679;&nbsp;&nbsp;</span><b>${escapeHtml(b.bold)}</b> ${escapeHtml(b.text)}</td></tr>`
    )
    .join('')

  const html = `<!doctype html><html lang="${c.htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(c.subject)}</title></head>
<body style="margin:0;background:#0F0F0F;">
<div style="display:none;max-height:0;overflow:hidden;color:#0F0F0F">${escapeHtml(c.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F0F"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#171717;border:1px solid #2E2E2E">
<tr><td align="center" style="padding:36px 24px 8px"><img src="${escapeHtml(logoSrc)}" width="110" alt="SAL Ray" style="display:block"></td></tr>
<tr><td align="center" style="padding:20px 32px 0;font:600 11px Arial,Helvetica,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#F7941D">${escapeHtml(c.eyebrow)}</td></tr>
<tr><td align="center" style="padding:14px 32px 0;font:400 36px/42px Georgia,'Times New Roman',serif;color:#F2EEE8">${escapeHtml(c.title)}</td></tr>
<tr><td align="center" style="padding:8px 0 0"><table role="presentation" width="46" cellpadding="0" cellspacing="0"><tr><td height="2" style="background:#F7941D;font-size:0;line-height:0">&nbsp;</td></tr></table></td></tr>
<tr><td align="center" style="padding:22px 36px 0;font:16px/26px Arial,Helvetica,sans-serif;color:#D9D4CC">${escapeHtml(c.intro)}</td></tr>
<tr><td align="center" style="padding:28px 36px 0"><img src="${escapeHtml(coverSrc)}" width="200" alt="${escapeHtml(c.coverAlt)}" style="display:block;border:1px solid #2E2E2E"></td></tr>
<tr><td align="center" style="padding:28px 36px 0"><a href="${escapeHtml(downloadUrl)}" style="display:block;background:#F7941D;color:#171717;font:600 16px Arial,Helvetica,sans-serif;text-decoration:none;padding:17px 24px;border-radius:4px">${escapeHtml(c.button)}</a></td></tr>
<tr><td style="padding:40px 36px 0;font:600 11px Arial,Helvetica,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#20B9CE">${escapeHtml(c.beforeTitle)}</td></tr>
<tr><td style="padding:16px 36px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${bulletRows}</table></td></tr>
<tr><td style="padding:10px 36px 0;font:italic 18px/28px Georgia,'Times New Roman',serif;color:#F2EEE8">${escapeHtml(c.closing)}</td></tr>
<tr><td style="padding:26px 36px 0;font:400 22px Georgia,serif;color:#F2EEE8">SAL Ray<br><span style="font:12px Arial,sans-serif;letter-spacing:1px;color:#A8A39B">${escapeHtml(c.role)}</span></td></tr>
<tr><td style="padding:36px 36px 30px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2E2E2E"><tr><td style="padding-top:18px;font:12px/19px Arial,sans-serif;color:#8A857D">${escapeHtml(c.receivingBecause)}<br><a href="${escapeHtml(unsubscribeUrl)}" style="color:#A8A39B">${escapeHtml(c.unsubscribe)}</a> &nbsp;&middot;&nbsp; <a href="${escapeHtml(privacyUrl)}" style="color:#A8A39B">${escapeHtml(c.privacy)}</a></td></tr></table></td></tr>
</table></td></tr></table></body></html>`

  const text = [
    c.eyebrow.toUpperCase(),
    '',
    c.title,
    '',
    c.intro,
    '',
    `${c.button}: ${downloadUrl}`,
    '',
    c.beforeTitle.toUpperCase(),
    ...c.bullets.map((b) => `- ${b.bold} ${b.text}`),
    '',
    c.closing,
    '',
    'SAL Ray',
    c.role,
    '',
    '--',
    c.receivingBecause,
    `${c.unsubscribe}: ${unsubscribeUrl}`,
    `${c.privacy}: ${privacyUrl}`,
    '',
  ].join('\n')

  return {
    subject: c.subject,
    html,
    text,
    headers: {
      'List-Unsubscribe': `<${oneClickUnsubscribeUrl}>, <mailto:${contato.email}?subject=unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  }
}

export const FIRST_STEPS_FROM = `${business.nome} <${contato.email}>`

/**
 * Aviso interno para hello@ a cada novo cadastro. Assunto fixo por idioma e
 * sem o e-mail da pessoa (nem no assunto nem no corpo).
 */
export function buildSignupNotification({ lang, source, date, training = 'pdf1' }: { lang: Lang; source: string; date: Date; training?: Training }) {
  const label = lang === 'pt' ? 'PT' : 'EN'
  // Hora sempre em 12 horas com AM/PM (horário de Nova York).
  const when = date.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const rows: [string, string][] = [
    ['Idioma', label],
    ['Treinamento', `PDF ${TRAININGS[training].downloadParam} (${TRAININGS[training].title.pt || TRAININGS[training].title.en})`],
    ['Origem', source],
    ['Data e hora', `${when} (horário de Nova York)`],
  ]
  return {
    subject: `[${label}] Novo cadastro treinamento`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n') + '\n',
    html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111;"><h2 style="margin-bottom:4px;">Novo cadastro do treinamento</h2><table cellpadding="0" cellspacing="0">${rows
      .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#555;"><strong>${k}</strong></td><td style="padding:6px 0;">${escapeHtml(v)}</td></tr>`)
      .join('')}</table></div>`,
  }
}
