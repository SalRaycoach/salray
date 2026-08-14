'use client'

import { buildWhatsAppUrl, whatsapp } from '@/lib/pt-reconstrucao'
import { trackEvent } from '@/lib/analytics'

/**
 * Cabeçalho mínimo, só em português — briefing seção 3 e 4.1. Não renderiza
 * o Navbar global em inglês; não expõe About/How I Help/Resources/Community/
 * FAQ/4-Week Experience. O clique no logo rola para o topo desta própria
 * página (âncora #inicio), não para a homepage em inglês.
 */
export default function PtHeader() {
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
