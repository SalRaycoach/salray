import { NextRequest, NextResponse } from 'next/server'
import { findEmailByToken, markUnsubscribed, parseLang } from '@/lib/first-steps'

export const dynamic = 'force-dynamic'

/**
 * One-click unsubscribe (RFC 8058): o Gmail/Apple Mail fazem POST neste URL,
 * o mesmo que vai no cabeçalho List-Unsubscribe. Responde 200 só se o token
 * bateu com alguém da lista.
 */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('t') || ''
  try {
    const email = await findEmailByToken(token)
    if (!email) return NextResponse.json({ ok: false }, { status: 400 })
    await markUnsubscribed(email)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('first-steps one-click unsubscribe failed:', err instanceof Error ? err.message : err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

/** Quem abrir o link do cabeçalho no navegador (GET) cai na página de confirmação. */
export async function GET(request: NextRequest) {
  const lang = parseLang(request.nextUrl.searchParams.get('l'))
  const token = request.nextUrl.searchParams.get('t') || ''
  return new NextResponse(null, {
    status: 302,
    headers: { Location: `/unsubscribe/?l=${lang}&t=${encodeURIComponent(token)}` },
  })
}
