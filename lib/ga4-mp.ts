import crypto from 'node:crypto'

/**
 * Eventos do GA4 enviados pelo SERVIDOR (Measurement Protocol). Hoje só serve para o
 * lead_magnet_download: o clique do e-mail passa por /api/first-steps/download/, que não roda
 * no navegador e por isso nunca conseguia avisar o GA4.
 *
 * Variáveis de ambiente (criar na Hostinger):
 *   GA4_MEASUREMENT_ID  ex.: G-YFEG8JC9BF
 *   GA4_API_SECRET      GA4 > Admin > Fluxos de dados > (seu fluxo) > Measurement Protocol API secrets
 * Se alguma faltar, nada é enviado (só fica o registro no log local) e o download segue normal.
 * Nunca vai e-mail em parâmetro: o client_id é um número derivado do hash do token.
 */

export function ga4Configured(): boolean {
  return Boolean(process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET)
}

/** client_id no formato "numero.numero" (como o GA4 gera), derivado de um hash: não identifica ninguém. */
export function clientIdFromSeed(seed: string): string {
  const hex = crypto.createHash('sha256').update(seed).digest('hex')
  return `${parseInt(hex.slice(0, 10), 16)}.${parseInt(hex.slice(10, 20), 16)}`
}

export function buildGa4Payload(name: string, params: Record<string, string | number>, seed: string) {
  return {
    client_id: clientIdFromSeed(seed),
    events: [{ name, params: { ...params, engagement_time_msec: 1 } }],
  }
}

/**
 * Envia o evento. Nunca lança e nunca demora mais que ~2,5 s (quem chama não deve esperar por ele).
 * Retorna 'sent' | 'skipped' (variáveis ausentes) | 'failed'.
 */
export async function sendGa4Event(
  name: string,
  params: Record<string, string | number>,
  seed: string
): Promise<'sent' | 'skipped' | 'failed'> {
  const id = process.env.GA4_MEASUREMENT_ID
  const secret = process.env.GA4_API_SECRET
  if (!id || !secret) return 'skipped'
  try {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(id)}&api_secret=${encodeURIComponent(secret)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildGa4Payload(name, params, seed)),
      signal: AbortSignal.timeout(2500),
    })
    return res.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
