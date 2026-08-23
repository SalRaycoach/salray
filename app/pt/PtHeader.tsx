'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buildWhatsAppUrl, whatsapp } from '@/lib/pt-reconstrucao'
import { trackEvent } from '@/lib/analytics'

/**
 * Cabeçalho compartilhado por toda a árvore /pt/ — só em português, sem o
 * Navbar global em inglês. Route-aware porque as duas seções sob /pt/ têm
 * necessidades opostas: a página de vendas (isolada, briefing seção 3 e 4.1)
 * quer o logo rolando para o topo da própria página (não navegar pra fora,
 * meio de funil) e um CTA de WhatsApp; o hub de Reflexões quer o logo
 * navegando para /pt/reflexoes/ e nenhum CTA comercial no header.
 */
export default function PtHeader() {
  const pathname = usePathname()
  const isReconstrucao = pathname?.startsWith('/pt/reconstrucao-emocional')

  if (isReconstrucao) {
    const helpUrl = buildWhatsAppUrl(whatsapp.messages.ajudaParaEscolher)
    return (
      <header className="sticky top-0 z-50 bg-offwhite border-b border-charcoal/10">
        <nav className="max-w-content mx-auto flex items-center justify-between px-6 py-4">
          <a href="#inicio" className="font-display font-semibold text-lg text-charcoal">
            SAL Ray
          </a>
          <a
            href={helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { cta_location: 'header', offer_name: 'ajuda_para_escolher' })}
            className="font-body text-sm font-medium border border-aqua text-aqua px-4 py-2 rounded-md hover:bg-aqua hover:text-offwhite transition-colors"
          >
            Preciso de ajuda para escolher
          </a>
        </nav>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-offwhite border-b border-charcoal/10">
      <nav className="max-w-content mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/pt/reflexoes/" className="font-display font-semibold text-lg text-charcoal">
          SAL Ray
        </Link>
      </nav>
    </header>
  )
}
