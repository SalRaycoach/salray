import Link from 'next/link'

/**
 * Cabeçalho mínimo compartilhado por toda a árvore /pt/ — só em português,
 * sem o Navbar global em inglês. Deliberadamente genérico (não amarrado a
 * nenhuma seção específica) porque este arquivo é a raiz compartilhada:
 * hoje só "Reflexões" vive sob /pt/, mas outras seções em português podem
 * ser adicionadas aqui no futuro.
 */
export default function PtHeader() {
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
