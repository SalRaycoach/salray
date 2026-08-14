/**
 * Rodapé mínimo, só em português — briefing seção 15. Não repete o menu em
 * inglês. Os links legais apontam para as páginas legais existentes do site
 * (ainda não há versão em português dessas páginas — decisão pragmática:
 * o rótulo do link é em português, o destino é o documento legal vigente).
 */
export default function PtFooter() {
  const legalLinks = [
    { href: '/privacy-policy/', label: 'Política de Privacidade' },
    { href: '/terms/', label: 'Termos de Uso' },
    { href: '/disclaimer/', label: 'Aviso Profissional' },
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
        <p className="font-body text-xs text-offwhite/50">© {new Date().getFullYear()} SAL Ray. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
