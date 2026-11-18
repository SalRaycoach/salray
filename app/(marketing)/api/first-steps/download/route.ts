import { NextRequest, NextResponse } from 'next/server'
import { findEmailByToken, logDownload, parseLang } from '@/lib/first-steps'
import crypto from 'node:crypto'
import { ga4Configured, sendGa4Event } from '@/lib/ga4-mp'
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
  // p=<número> → o treinamento dono do número; sem p (links antigos do PDF 1) → PDF 1.
  // Treinamento ainda não publicado nunca é entregue: cai no PDF 1 (o download não pode quebrar).
  const requested = trainingFromDownloadParam(request.nextUrl.searchParams.get('p'))
  const training = TRAININGS[requested].published ? requested : 'pdf1'

  let valid = false
  try {
    valid = (await findEmailByToken(token)) !== null
  } catch (err) {
    console.error('first-steps download: token check failed:', err instanceof Error ? err.message : err)
  }
  // lead_magnet_download no GA4, enviado pelo servidor (Measurement Protocol). Sem as variáveis
  // GA4_MEASUREMENT_ID e GA4_API_SECRET só fica o registro no log local. Nunca espera nem quebra o download.
  const ga4 = ga4Configured() ? 'queued' : 'not_configured'
  if (ga4 === 'queued') {
    void sendGa4Event('lead_magnet_download', { training, lang, source: 'email' }, token || crypto.randomUUID()).catch(() => {})
  }
  await logDownload({ lang, tokenId: token.slice(0, 10), valid, training, ga4 })

  // Location relativo de propósito: atrás do proxy da Hostinger, request.url
  // pode trazer o host interno em vez de salraycoach.com.
  return new NextResponse(null, {
    status: 302,
    headers: { Location: TRAININGS[training].pdf[lang] },
  })
}
