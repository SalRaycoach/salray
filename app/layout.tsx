import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import AnalyticsListener from '@/components/AnalyticsListener'
import { business, SITE_URL } from '@/lib/config'

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
        <Navbar />
        {children}
        <Footer />
        <WhatsAppFloat />
        <AnalyticsListener />
      </body>
    </html>
  )
}
