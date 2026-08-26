import Script from 'next/script'

export default function MetaPixel({ pixelId }: { pixelId: string }) {
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
      <Script src="https://connect.facebook.net/en_US/fbevents.js" strategy="afterInteractive" />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}
