import Script from 'next/script'

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      {/* Synchronous stub: defines gtag() so calls made before the library
          below finishes downloading are queued in dataLayer instead of
          silently dropped (gtag.js drains this queue once it loads). */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}');`,
        }}
      />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
    </>
  )
}
