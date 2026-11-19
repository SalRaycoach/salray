/**
 * Regras de planejamento dos e-mails de apoio dos treinamentos (dia 3, 7 e 15).
 * Módulo puro (sem disco, sem envio), compartilhado por scripts/cron.js e pela
 * rota POST /api/first-steps-cron (lib/first-steps-cron.ts). Fonte única das regras.
 *
 *  - Dias desde o cadastro = diferença de dias de calendário em Nova York.
 *  - O e-mail do dia N sai quando a pessoa está entre N e N+2 dias.
 *  - Nunca no dia do cadastro, nunca a descadastrados, nunca duas vezes.
 *  - Cada cadastro tem um treinamento (campo `training`, ausente = pdf1) e só recebe
 *    os e-mails DELE: pdf1 → day3/day7/day15; pdf2 → pdf2-day3/pdf2-day7/pdf2-day15;
 *    pdf3 → pdf3-day3/pdf3-day7/pdf3-day15; pdf4 → pdf4-day3/pdf4-day7/pdf4-day15;
 *    pdf5 → pdf5-day3/pdf5-day7/pdf5-day15.
 *    Quem pediu os dois treinamentos tem duas linhas e recebe as duas sequências.
 *  - Duplicados (mesmo e-mail e mesmo treinamento) valem só pela primeira linha.
 */

// KINDS continua sendo a sequência do PDF 1 (o modo de teste da rota usa só ela).
const KINDS = ['day3', 'day7', 'day15']
const KINDS_BY_TRAINING = {
  pdf1: ['day3', 'day7', 'day15'],
  pdf2: ['pdf2-day3', 'pdf2-day7', 'pdf2-day15'],
  pdf3: ['pdf3-day3', 'pdf3-day7', 'pdf3-day15'],
  pdf4: ['pdf4-day3', 'pdf4-day7', 'pdf4-day15'],
  pdf5: ['pdf5-day3', 'pdf5-day7', 'pdf5-day15'],
}
const DAYS = {
  day3: 3,
  day7: 7,
  day15: 15,
  'pdf2-day3': 3,
  'pdf2-day7': 7,
  'pdf2-day15': 15,
  'pdf3-day3': 3,
  'pdf3-day7': 7,
  'pdf3-day15': 15,
  'pdf4-day3': 3,
  'pdf4-day7': 7,
  'pdf4-day15': 15,
  'pdf5-day3': 3,
  'pdf5-day7': 7,
  'pdf5-day15': 15,
}
const WINDOW_AFTER_DAYS = 2
const TZ = 'America/New_York'

const nyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })

function nyDay(date) {
  return nyFormatter.format(date) // YYYY-MM-DD no calendário de Nova York
}

function daysBetween(fromDate, toDate) {
  const [y1, m1, d1] = nyDay(fromDate).split('-').map(Number)
  const [y2, m2, d2] = nyDay(toDate).split('-').map(Number)
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000)
}

/**
 * Para cada inscrito único decide o que fazer. Retorna { decisions, due }.
 * decisions: uma linha por pessoa e treinamento; due: quem recebe agora.
 */
function plan(now, subscribers, unsubscribedRows, sentRows) {
  const unsub = new Set(unsubscribedRows.map((r) => String(r.email).toLowerCase()))
  const sent = new Set(sentRows.map((r) => `${String(r.email).toLowerCase()}|${r.day}`))
  const seen = new Set()
  const decisions = []
  const due = []

  for (const row of subscribers) {
    const email = String(row.email || '').trim().toLowerCase()
    // Cadastro sem o campo training = pdf1 (cadastros antigos). Qualquer outro id vale ele mesmo.
    const training = row.training ? String(row.training) : 'pdf1'
    const key = `${email}|${training}`
    if (!email || seen.has(key)) continue
    seen.add(key)
    const lang = row.lang === 'pt' ? 'pt' : 'en'
    const signedUp = new Date(row.date)
    const base = { email, lang, training }

    if (unsub.has(email)) {
      decisions.push({ ...base, result: 'skip (unsubscribed)' })
      continue
    }
    if (Number.isNaN(signedUp.getTime())) {
      decisions.push({ ...base, result: 'skip (invalid signup date)' })
      continue
    }
    const age = daysBetween(signedUp, now)
    if (age <= 0) {
      decisions.push({ ...base, age, result: 'skip (signed up today)' })
      continue
    }
    const kinds = KINDS_BY_TRAINING[training]
    if (!kinds) {
      // Treinamento sem sequência de e-mails definida (ex.: um pdf6 futuro): não recebe acompanhamento.
      decisions.push({ ...base, result: 'skip (no follow-up sequence for this training)' })
      continue
    }
    const kind = kinds.find((k) => age >= DAYS[k] && age <= DAYS[k] + WINDOW_AFTER_DAYS)
    if (!kind) {
      decisions.push({ ...base, age, result: age < DAYS[kinds[0]] ? 'skip (too early)' : 'skip (no email due)' })
      continue
    }
    if (sent.has(`${email}|${kind}`)) {
      decisions.push({ ...base, age, kind, result: `skip (${kind} already sent)` })
      continue
    }
    decisions.push({ ...base, age, kind, result: `SEND ${kind}` })
    due.push({ ...base, age, kind })
  }
  return { decisions, due }
}

module.exports = { KINDS, KINDS_BY_TRAINING, DAYS, WINDOW_AFTER_DAYS, TZ, nyDay, daysBetween, plan }
