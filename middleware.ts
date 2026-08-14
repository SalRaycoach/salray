import { NextRequest, NextResponse } from 'next/server'

// URLs intentionally removed (content-scope-update). Serving 410 instead of a
// silent 404 signals to search engines that this is a deliberate removal, not
// a broken link, which speeds up de-indexing.
const REMOVED_PATHS = new Set([
  '/resources/emotional-patterns-self-sabotage/childhood-trauma-inner-child',
  '/resources/emotional-patterns-self-sabotage/can-childhood-trauma-affect-you-as-an-adult',
  '/resources/emotional-patterns-self-sabotage/emotional-pain-without-a-clear-cause',
  '/resources/emotional-patterns-self-sabotage/healing-childhood-trauma-without-blaming-parents',
  '/resources/emotional-patterns-self-sabotage/how-childhood-wounds-show-up-in-adult-relationships',
  '/resources/emotional-patterns-self-sabotage/how-to-begin-healing-childhood-wounds',
  '/resources/emotional-patterns-self-sabotage/remembering-vs-reliving-childhood-pain',
  '/resources/emotional-patterns-self-sabotage/signs-of-unresolved-emotional-trauma',
  '/resources/emotional-patterns-self-sabotage/signs-you-were-parentified-as-a-child',
  '/resources/emotional-patterns-self-sabotage/what-is-inner-child-healing',
  '/resources/emotional-patterns-self-sabotage/why-childhood-patterns-feel-impossible-to-break',
  '/resources/emotional-stability',
  '/resources/emotional-stability/depression-numbness-burnout',
  '/resources/emotional-stability/why-do-i-feel-emotionally-numb',
  '/resources/emotional-stability/burnout-recovery-why-rest-alone-isnt-enough',
  '/resources/emotional-stability/coaching-vs-clinical-treatment-for-depression',
  '/resources/emotional-stability/common-signs-associated-with-depression',
  '/resources/emotional-stability/emotional-numbness-as-a-protection-mechanism',
  '/resources/emotional-stability/how-to-get-motivated-again',
  '/resources/emotional-stability/sadness-that-wont-go-away',
  '/resources/emotional-stability/understanding-hopelessness-without-minimizing',
  '/resources/emotional-stability/why-do-i-feel-empty-even-when-life-looks-fine',
  '/resources/emotional-stability/why-dont-i-enjoy-anything-anymore',
  '/resources/self-trust-identity/how-self-worth-gets-built-or-broken-in-childhood',
])

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, '')

  if (REMOVED_PATHS.has(pathname)) {
    return new NextResponse('Gone', { status: 410 })
  }

  // Página isolada em português — nunca indexada. A tag <meta robots> em
  // app/pt/layout.tsx já cobre isso; este cabeçalho é o reforço equivalente
  // pedido no briefing (seção 18), para o caso de algum crawler ignorar a meta tag.
  if (pathname.startsWith('/pt')) {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/resources/:path*', '/pt/:path*'],
}
