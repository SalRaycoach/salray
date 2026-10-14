import Script from 'next/script'

// Adiamento do fbevents.js na página de anúncios do grupo: carrega na primeira interação da pessoa
// (toque, clique, rolagem ou tecla) ou DEFER_MS depois do evento load, o que vier primeiro. O stub
// abaixo já enfileira fbq('init') e fbq('track', 'PageView'), então o PageView sai assim que o script
// carrega. Só quem sai da página antes disso, sem interagir, não gera PageView.
const DEFER_MS = 3000
const deferLoader = `(function(){var l=0,ev=['pointerdown','keydown','scroll','touchstart'];function go(){if(l)return;l=1;ev.forEach(function(e){removeEventListener(e,go)});var s=document.createElement('script');s.async=true;s.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(s)}ev.forEach(function(e){addEventListener(e,go,{passive:true})});function arm(){setTimeout(go,${DEFER_MS})}if(document.readyState==='complete')arm();else addEventListener('load',arm)})();`

export default function MetaPixel({ pixelId, deferLoad = false }: { pixelId: string; deferLoad?: boolean }) {
  return (
    <>
      {/* Synchronous stub: defines fbq() with its own queue so calls made
          before fbevents.js below finishes downloading are queued instead
          of silently dropped (fbevents.js drains n.queue once it loads). */}
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(f,b){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window,document);fbq('init','${pixelId}');fbq('track','PageView');`,
        }}
      />
      {deferLoad ? (
        <script dangerouslySetInnerHTML={{ __html: deferLoader }} />
      ) : (
        <Script src="https://connect.facebook.net/en_US/fbevents.js" strategy="lazyOnload" />
      )}
      {/* Rendered as a raw HTML string (not a JSX <img>) so Next's renderer
          never sees an <img> element to generate a preload hint for — this
          tag only executes for visitors with JavaScript disabled anyway. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`,
        }}
      />
    </>
  )
}
