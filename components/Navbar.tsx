'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { business, ctas, fourWeekExperience } from '@/lib/config'
import NavDropdown, { type NavDropdownItem } from './NavDropdown'

// Reorganized 23 set 2026 — 9 top-level items down to 5 + the CTA button.
// FAQ and Community are deliberately not here anymore: both pages still
// exist and are linked from the footer (and 4-Week Experience keeps its own
// embedded FAQ section) — removing them from the header nav doesn't delete
// or 404 either page, it only takes them out of top-level navigation.
const ABOUT_ITEMS: NavDropdownItem[] = [
  { href: '/about/', label: 'About SAL Ray' },
  { href: '/stable-method/', label: 'The S.T.A.B.L.E. Method' },
]

const RESOURCES_ITEMS: NavDropdownItem[] = [
  { href: '/resources/', label: 'Articles' },
  { href: '/reflections/', label: 'S.T.A.B.L.E. Reflections' },
]

const FOUR_WEEK_HREF = '/4-week-experience/'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // Which mobile accordion section is expanded — 'about' | 'resources' | null
  // (only one open at a time keeps the menu from growing unpredictably tall).
  const [mobileSection, setMobileSection] = useState<'about' | 'resources' | null>(null)
  const pathname = usePathname()
  const isFourWeekPage = pathname === FOUR_WEEK_HREF
  const showFourWeekLink = fourWeekExperience.status === 'open'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function closeMobileMenu() {
    setMenuOpen(false)
    setMobileSection(null)
  }

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
          <li>
            <NavDropdown label="About" items={ABOUT_ITEMS} />
          </li>
          <li>
            <Link href="/how-i-help/" className="hover:text-aqua transition-colors">
              How I Help
            </Link>
          </li>
          <li>
            <NavDropdown label="Resources" items={RESOURCES_ITEMS} />
          </li>
          {showFourWeekLink && (
            <li>
              <Link
                href={FOUR_WEEK_HREF}
                aria-current={isFourWeekPage ? 'page' : undefined}
                className={`font-semibold hover:text-orange transition-colors ${
                  isFourWeekPage ? 'text-orange' : 'text-aqua'
                }`}
              >
                4-Week Experience
              </Link>
            </li>
          )}
        </ul>

        {isFourWeekPage ? (
          <a
            href="#application"
            data-event="four_week_apply_click"
            className="hidden lg:inline-block font-body text-sm font-medium bg-orange text-offwhite px-5 py-2.5 rounded-md hover:bg-charcoal transition-colors"
          >
            Apply Now
          </a>
        ) : (
          <Link
            href="/book-a-session/"
            data-event="book_session_cta_click"
            className="hidden lg:inline-block font-body text-sm font-medium bg-orange text-charcoal px-5 py-2.5 rounded-md hover:bg-charcoal hover:text-offwhite transition-colors"
          >
            {ctas.primary}
          </Link>
        )}

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
          <MobileAccordionItem
            label="About"
            items={ABOUT_ITEMS}
            isOpen={mobileSection === 'about'}
            onToggle={() => setMobileSection((v) => (v === 'about' ? null : 'about'))}
            onNavigate={closeMobileMenu}
          />
          <li>
            <Link href="/how-i-help/" className="block py-2" onClick={closeMobileMenu}>
              How I Help
            </Link>
          </li>
          <MobileAccordionItem
            label="Resources"
            items={RESOURCES_ITEMS}
            isOpen={mobileSection === 'resources'}
            onToggle={() => setMobileSection((v) => (v === 'resources' ? null : 'resources'))}
            onNavigate={closeMobileMenu}
          />
          {showFourWeekLink && (
            <li>
              <Link
                href={FOUR_WEEK_HREF}
                aria-current={isFourWeekPage ? 'page' : undefined}
                className={`block py-2 font-semibold ${isFourWeekPage ? 'text-orange' : 'text-aqua'}`}
                onClick={closeMobileMenu}
              >
                4-Week Experience
              </Link>
            </li>
          )}
          <li>
            {isFourWeekPage ? (
              <a
                href="#application"
                className="block mt-2 text-center bg-orange text-offwhite px-5 py-3 rounded-md font-medium"
                onClick={closeMobileMenu}
              >
                Apply Now
              </a>
            ) : (
              <Link
                href="/book-a-session/"
                className="block mt-2 text-center bg-orange text-charcoal px-5 py-3 rounded-md font-medium"
                onClick={closeMobileMenu}
              >
                {ctas.primary}
              </Link>
            )}
          </li>
        </ul>
      )}
    </header>
  )
}

/**
 * Mobile equivalent of NavDropdown — an accordion instead of a floating
 * panel, since hover doesn't exist on touch and a popover would fight with
 * the already-scrollable full-screen mobile menu. Tapping the label expands
 * the sub-items in place.
 */
function MobileAccordionItem({
  label,
  items,
  isOpen,
  onToggle,
  onNavigate,
}: {
  label: string
  items: NavDropdownItem[]
  isOpen: boolean
  onToggle: () => void
  onNavigate: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        {label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <ul className="pl-4 flex flex-col gap-1 pb-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block py-2 text-charcoal/80" onClick={onNavigate}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
