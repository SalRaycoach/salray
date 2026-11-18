import { NextRequest, NextResponse } from 'next/server'
import { findEmailByToken, logDownload, parseLang } from '@/lib/first-steps'

// Sempre dinâmica: cada clique precisa chegar ao servidor para ser registrado.
export const dynamic = 'force-dynamic'

const PDF_BY_LANG = {
  en: '/downloads/the-same-problem-keeps-finding-you.pdf',
  pt: '/downloads/o-mesmo-problema-continua-te-encontrando.pdf',
} as const

/**
 * Link do botão do e-mail: registra o download (só log, sem e-mail no log) e
 * redireciona (302) para o PDF. NUNCA bloqueia: se o token não bater (ex.: o
 * arquivo de inscritos foi perdido num deploy), a pessoa recebe o treinamento
 * do mesmo jeito. O PDF em si é um arquivo público em /downloads/.
 */
export async function GET(request: NextRequest) {
  const lang = parseLang(request.nextUrl.searchParams.get('l'))
  const token = request.nextUrl.searchParams.get('t') || ''

  let valid = false
  try {
    valid = (await findEmailByToken(token)) !== null
  } catch (err) {
    console.error('first-steps download: token check failed:', err instanceof Error ? err.message : err)
  }
  await logDownload({ lang, tokenId: token.slice(0, 10), valid })

  // Location relativo de propósito: atrás do proxy da Hostinger, request.url
  // pode trazer o host interno em vez de salraycoach.com.
  return new NextResponse(null, {
    status: 302,
    headers: { Location: PDF_BY_LANG[lang] },
  })
}
