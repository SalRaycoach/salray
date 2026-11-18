/**
 * Regras de planejamento dos e-mails de apoio do PDF 1 (dia 3, 7 e 15).
 * Módulo puro (sem disco, sem envio), compartilhado por scripts/cron.js e pela
 * rota POST /api/first-steps-cron (lib/first-steps-cron.ts). Fonte única das regras.
 *
 *  - Dias desde o cadastro = diferença de dias de calendário em Nova York.
 *  - O e-mail do dia N sai quando a pessoa está entre N e N+2 dias.
 *  - Nunca no dia do cadastro, nunca a descadastrados, nunca duas vezes.
 *  - Duplicados na lista valem só pela primeira linha.
 */

const KINDS = ['day3', 'day7', 'day15']
const DAYS = { day3: 3, day7: 7, day15: 15 }
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
 * decisions: uma linha por pessoa; due: quem recebe agora.
 */
function plan(now, subscribers, unsubscribedRows, sentRows) {
  const unsub = new Set(unsubscribedRows.map((r) => String(r.email).toLowerCase()))
  const sent = new Set(sentRows.map((r) => `${String(r.email).toLowerCase()}|${r.day}`))
  const seen = new Set()
  const decisions = []
  const due = []

  for (const row of subscribers) {
    const email = String(row.email || '').trim().toLowerCase()
    if (!email || seen.has(email)) continue
    seen.add(email)
    const lang = row.lang === 'pt' ? 'pt' : 'en'
    const signedUp = new Date(row.date)
    const base = { email, lang }

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
    const kind = KINDS.find((k) => age >= DAYS[k] && age <= DAYS[k] + WINDOW_AFTER_DAYS)
    if (!kind) {
      decisions.push({ ...base, age, result: age < DAYS.day3 ? 'skip (too early)' : 'skip (no email due)' })
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

module.exports = { KINDS, DAYS, WINDOW_AFTER_DAYS, TZ, nyDay, daysBetween, plan }
