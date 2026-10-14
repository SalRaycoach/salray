'use client'

import { usePathname } from 'next/navigation'

/**
 * Rodapé mínimo compartilhado por toda a árvore /pt/ — não repete o menu em
 * inglês. Os links legais apontam para as páginas legais existentes do site
 * (em inglês), exceto as políticas de cancelamento, que têm versão em português.
 * Na página de captura de anúncios (/pt/mentoria-reconstrucao-emocional/) o rodapé tem só o aviso.
 */
export default function PtFooter() {
  const pathname = usePathname()

  if (pathname?.startsWith('/pt/mentoria-reconstrucao-emocional')) {
    return (
      <footer className="bg-charcoal text-offwhite">
        <div className="max-w-content mx-auto px-6 py-10">
          <p className="font-body text-sm text-offwhite/80 leading-relaxed mb-3 max-w-[720px]">
            Os conteúdos apresentados nesta página são educacionais e voltados ao coaching e ao desenvolvimento
            pessoal. Eles não prestam serviços médicos ou de saúde mental e não substituem psicoterapia, psiquiatria,
            atendimento médico ou serviços de emergência. Resultados variam de pessoa para pessoa.
          </p>
          <p className="font-body text-xs text-offwhite/60">© {new Date().getFullYear()} SAL Ray. Todos os direitos reservados.</p>
        </div>
      </footer>
    )
  }

  const legalLinks = [
    { href: '/privacy-policy/', label: 'Política de Privacidade' },
    { href: '/terms/', label: 'Termos de Uso' },
    { href: '/disclaimer/', label: 'Aviso Profissional' },
    { href: '/pt/politica-de-cancelamento/', label: 'Política de Cancelamento' },
    { href: '/pt/politica-de-cancelamento-mentoria/', label: 'Cancelamento e Reembolso da Mentoria' },
    { href: '/contact/', label: 'Contato' },
  ]

  return (
    <footer className="bg-charcoal text-offwhite">
      <div className="max-w-content mx-auto px-6 py-12">
        <span className="font-display text-xl block mb-2">SAL Ray</span>
        <p className="font-body text-sm text-offwhite/70 mb-6">Coach de Reconstrução Emocional e de Vida · Método S.T.A.B.L.E.™</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-body text-sm text-offwhite/70 mb-6">
          {legalLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-orange underline underline-offset-2">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="font-body text-xs text-offwhite/50">
          © {new Date().getFullYear()} SAL Ray. Todos os direitos reservados. ·{' '}
          <a href="https://salraycoach.com" className="underline underline-offset-2 hover:text-orange">
            Explore o site completo (em inglês)
          </a>
        </p>
      </div>
    </footer>
  )
}
