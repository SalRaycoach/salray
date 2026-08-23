import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'node:crypto'
import fs from 'node:fs/promises'
import { FAILED_APPLICATIONS_LOG } from '@/lib/application-failsafe'

/**
 * Download protegido do log de candidaturas que falharam no e-mail (ver
 * lib/application-failsafe.ts). Autenticação simples por token de posse —
 * sem sistema de login neste projeto, então isso é a barreira mínima
 * razoável pra um arquivo com PII real de candidatos.
 *
 * Uso: GET /api/4-week-application/failed-log?token=<FAILED_LOG_ACCESS_TOKEN>
 * O token vem de uma variável de ambiente — precisa estar configurado tanto
 * localmente (.env.local) quanto em produção (hPanel), do mesmo jeito que
 * as variáveis SMTP_*.
 */
export async function GET(request: NextRequest) {
  const expectedToken = process.env.FAILED_LOG_ACCESS_TOKEN
  if (!expectedToken) {
    console.error('FAILED_LOG_ACCESS_TOKEN is not set — the failed-applications download route is disabled.')
    return NextResponse.json({ ok: false, error: 'This endpoint is not configured.' }, { status: 500 })
  }

  const suppliedToken = request.nextUrl.searchParams.get('token') || ''

  // Comparação de tamanho fixo (hash de ambos os lados) pra evitar timing
  // attack e pra não quebrar quando os tamanhos diferem, o que
  // timingSafeEqual exige que sejam iguais.
  const expectedHash = createHash('sha256').update(expectedToken).digest()
  const suppliedHash = createHash('sha256').update(suppliedToken).digest()
  if (!timingSafeEqual(expectedHash, suppliedHash)) {
    return NextResponse.json({ ok: false, error: 'Invalid or missing token.' }, { status: 401 })
  }

  let content: string
  try {
    content = await fs.readFile(FAILED_APPLICATIONS_LOG, 'utf-8')
  } catch {
    // Ainda não existe = nenhuma candidatura falhou até agora, não é um erro.
    content = ''
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Content-Disposition': 'attachment; filename="failed-4week-applications.jsonl"',
      'Cache-Control': 'no-store',
    },
  })
}
