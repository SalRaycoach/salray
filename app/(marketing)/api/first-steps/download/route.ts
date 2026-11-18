import { NextRequest, NextResponse } from 'next/server'
import { findEmailByToken, logDownload, parseLang } from '@/lib/first-steps'
import { TRAININGS, trainingFromDownloadParam } from '@/lib/trainings'

// Sempre dinâmica: cada clique precisa chegar ao servidor para ser registrado.
export const dynamic = 'force-dynamic'

/**
 * Link do botão do e-mail: registra o download (só log, sem e-mail no log) e
 * redireciona (302) para o PDF. NUNCA bloqueia: se o token não bater (ex.: o
 * arquivo de inscritos foi perdido num deploy), a pessoa recebe o treinamento
 * do mesmo jeito. O PDF em si é um arquivo público em /downloads/.
 */
export async function GET(request: NextRequest) {
  const lang = parseLang(request.nextUrl.searchParams.get('l'))
  const token = request.nextUrl.searchParams.get('t') || ''
  // p=2 → PDF 2; sem p (links antigos do PDF 1) → PDF 1.
  const training = trainingFromDownloadParam(request.nextUrl.searchParams.get('p'))

  let valid = false
  try {
    valid = (await findEmailByToken(token)) !== null
  } catch (err) {
    console.error('first-steps download: token check failed:', err instanceof Error ? err.message : err)
  }
  await logDownload({ lang, tokenId: token.slice(0, 10), valid, training })

  // Location relativo de propósito: atrás do proxy da Hostinger, request.url
  // pode trazer o host interno em vez de salraycoach.com.
  return new NextResponse(null, {
    status: 302,
    headers: { Location: TRAININGS[training].pdf[lang] },
  })
}
