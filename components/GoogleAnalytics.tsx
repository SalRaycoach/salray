'use client'

import { useEffect } from 'react'
import Script from 'next/script'

/**
 * GA4 sem atrapalhar a velocidade: nada aqui bloqueia a renderização.
 *  - gtag() e a fila (dataLayer) são criados no useEffect, logo após a hidratação. Assim
 *    trackEvent() já enfileira eventos antes da biblioteca chegar, e isso também funciona
 *    quando a pessoa chega a esta página por navegação interna (um <script> inline que
 *    entra no DOM depois do carregamento inicial não executa).
 *  - a biblioteca gtag.js só baixa com strategy="lazyOnload": depois do evento load,
 *    quando o navegador está ocioso.
 */
export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    if (window.gtag) return
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      // gtag.js exige o objeto `arguments`, não um array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments as unknown as Record<string, unknown>)
    }
    window.gtag('js', new Date())
    window.gtag('config', measurementId)
  }, [measurementId])

  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="lazyOnload" />
}
