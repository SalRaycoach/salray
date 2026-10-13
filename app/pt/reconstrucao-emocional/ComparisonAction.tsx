'use client'

import { trackEvent } from '@/lib/analytics'

/**
 * Link de ação da tabela de comparação (âncora na própria página). Registra o clique no mesmo
 * padrão dos botões das ofertas: select_offer com offer_name e offer_source.
 */
export default function ComparisonAction({
  href,
  label,
  offerName,
  variant,
}: {
  href: string
  label: string
  offerName: string
  variant: 'link' | 'button'
}) {
  const classes =
    variant === 'button'
      ? 'flex w-full min-h-[48px] items-center justify-center text-center font-body text-sm font-semibold bg-[#F7941D] text-[#171717] px-5 py-3 rounded-md hover:bg-charcoal transition-colors'
      : 'font-body text-sm font-semibold text-[#F7941D] underline underline-offset-2 hover:text-charcoal transition-colors'
  return (
    <a
      href={href}
      onClick={() => trackEvent('select_offer', { offer_name: offerName, offer_source: 'tabela_comparacao' })}
      className={classes}
    >
      {label}
    </a>
  )
}
