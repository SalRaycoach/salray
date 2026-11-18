import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { runFollowups } from '@/lib/first-steps-cron'

export const dynamic = 'force-dynamic'

/**
 * POST /api/first-steps-cron            envia os e-mails de apoio devidos (até 10 por chamada)
 * POST /api/first-steps-cron?test=1     envia os 6 e-mails [TESTE], sem tocar na lista real
 *
 * Chamada pelo Cron Jobs da Hostinger com curl. Protegida por CRON_SECRET no
 * cabeçalho "Authorization: Bearer ...". Sem a chave certa: 401 sem detalhe.
 * A resposta traz só contagens (nunca e-mails). Rota privada: não está no
 * sitemap, nenhuma página linka para ela e as respostas saem com noindex.
 */

const PRIVATE_HEADERS = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' }

function unauthorized() {
  return NextResponse.json({ ok: false }, { status: 401, headers: PRIVATE_HEADERS })
}

/** Comparação em tempo constante: compara os SHA-256 das duas chaves (mesmo tamanho sempre). */
function keyMatches(provided: string, expected: string): boolean {
  const a = crypto.createHash('sha256').update(provided).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || secret.length < 16) {
    console.error('first-steps cron: CRON_SECRET is not set (or too short); refusing all calls.')
    return unauthorized()
  }

  const header = request.headers.get('authorization') || ''
  const match = /^Bearer (.+)$/.exec(header)
  if (!match || !keyMatches(match[1]!.trim(), secret)) return unauthorized()

  const test = request.nextUrl.searchParams.get('test') === '1'

  try {
    const result = await runFollowups({ test })
    if ('busy' in result) {
      return NextResponse.json({ ok: false, busy: true }, { status: 409, headers: PRIVATE_HEADERS })
    }
    return NextResponse.json(result, { headers: PRIVATE_HEADERS })
  } catch (err) {
    console.error('first-steps cron failed:', err instanceof Error ? err.message.replace(/[^\s<>"',;]+@[^\s<>"',;]+/g, '[email]') : 'unknown')
    return NextResponse.json({ ok: false }, { status: 500, headers: PRIVATE_HEADERS })
  }
}
