import type { Metadata } from 'next'
import Script from 'next/script'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FacebookFloat from '@/components/FacebookFloat'
import AnalyticsListener from '@/components/AnalyticsListener'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import MetaPixel from '@/components/MetaPixel'
import { business, SITE_URL, GA_MEASUREMENT_ID, META_PIXEL_ID } from '@/lib/config'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${business.nome} | ${business.posicionamento}`,
    template: `%s | ${business.nome}`,
  },
  description:
    'Non-clinical coaching and personal development for adults who feel emotionally overloaded, stuck in repeating patterns, or disconnected from direction.',
  robots: 'index, follow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body">
        <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        <MetaPixel pixelId={META_PIXEL_ID} />
        <Script src="https://t.contentsquare.net/uxa/10cb7940cf1c1.js" strategy="afterInteractive" />
        <Navbar />
        {children}
        <Footer />
        <FacebookFloat />
        <AnalyticsListener />
      </body>
    </html>
  )
}
