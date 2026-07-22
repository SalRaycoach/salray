'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { business, ctas } from '@/lib/config'

const links = [
  { href: '/about/', label: 'About Sal' },
  { href: '/how-i-help/', label: 'How I Help' },
  { href: '/stable-method/', label: 'The S.T.A.B.L.E. Method' },
  { href: '/resources/', label: 'Resources' },
  { href: '/community/', label: 'Community' },
  { href: '/faq/', label: 'FAQ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-offwhite/95 backdrop-blur border-b border-charcoal/10' : 'bg-offwhite'
      }`}
    >
      <nav className="max-w-content mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-display font-semibold text-lg text-charcoal">
          {business.nome}
        </Link>

        <ul className="hidden lg:flex items-center gap-6 font-body text-sm text-charcoal">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-aqua transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/consultation/"
          data-event="consultation_cta_click"
          className="hidden lg:inline-block font-body text-sm font-medium bg-orange text-charcoal px-5 py-2.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          {ctas.primary}
        </Link>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="lg:hidden text-charcoal"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <ul className="lg:hidden flex flex-col gap-1 bg-offwhite border-t border-charcoal/10 px-6 py-4 font-body text-charcoal">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="block py-2" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/consultation/"
              className="block mt-2 text-center bg-orange text-charcoal px-5 py-3 rounded-md font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {ctas.primary}
            </Link>
          </li>
        </ul>
      )}
    </header>
  )
}
