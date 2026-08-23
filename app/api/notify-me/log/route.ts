import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'node:crypto'
import fs from 'node:fs/promises'
import { NOTIFY_ME_LOG } from '@/lib/notify-me-log'

/**
 * Download protegido da lista de espera "avise-me quando estiver pronto"
 * (ver lib/notify-me-log.ts). Mesmo padrão de autenticação e mesmo token de
 * app/(marketing)/api/4-week-application/failed-log/route.ts — reaproveita
 * FAILED_LOG_ACCESS_TOKEN em vez de exigir uma variável de ambiente nova,
 * já que é o mesmo tipo de fronteira de confiança (dono do site recuperando
 * um arquivo local com dados de contato reais).
 *
 * Uso: GET /api/notify-me/log?token=<FAILED_LOG_ACCESS_TOKEN>
 */
export async function GET(request: NextRequest) {
  const expectedToken = process.env.FAILED_LOG_ACCESS_TOKEN
  if (!expectedToken) {
    console.error('FAILED_LOG_ACCESS_TOKEN is not set — the notify-me log download route is disabled.')
    return NextResponse.json({ ok: false, error: 'This endpoint is not configured.' }, { status: 500 })
  }

  const suppliedToken = request.nextUrl.searchParams.get('token') || ''

  const expectedHash = createHash('sha256').update(expectedToken).digest()
  const suppliedHash = createHash('sha256').update(suppliedToken).digest()
  if (!timingSafeEqual(expectedHash, suppliedHash)) {
    return NextResponse.json({ ok: false, error: 'Invalid or missing token.' }, { status: 401 })
  }

  let content: string
  try {
    content = await fs.readFile(NOTIFY_ME_LOG, 'utf-8')
  } catch {
    content = ''
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Content-Disposition': 'attachment; filename="notify-me-signups.jsonl"',
      'Cache-Control': 'no-store',
    },
  })
}
