import crypto from 'node:crypto'
import type { NextRequest } from 'next/server'

/**
 * Autenticação das rotas chamadas pelo Cron Jobs da Hostinger: cabeçalho
 * "Authorization: Bearer <CRON_SECRET>". Mesmo método da rota do cron dos e-mails:
 * compara os SHA-256 das duas chaves em tempo constante. Sem CRON_SECRET configurada
 * (ou muito curta), recusa tudo.
 */
export function isAuthorizedCron(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret || secret.length < 16) {
    console.error('cron auth: CRON_SECRET is not set (or too short); refusing all calls.')
    return false
  }
  const match = /^Bearer (.+)$/.exec(request.headers.get('authorization') || '')
  if (!match) return false
  const a = crypto.createHash('sha256').update(match[1]!.trim()).digest()
  const b = crypto.createHash('sha256').update(secret).digest()
  return crypto.timingSafeEqual(a, b)
}
