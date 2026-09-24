'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export type NavDropdownItem = { href: string; label: string }

/**
 * Desktop-only dropdown trigger for the main nav (pedido 23 set 2026) — the
 * label itself has no destination, it only opens a small menu of real links.
 * Click-to-toggle rather than hover: works the same with mouse or keyboard,
 * and avoids the classic hover-dropdown trap of the menu closing before a
 * pointer can reach it. Closes on an outside click or Escape.
 */
export default function NavDropdown({ label, items }: { label: string; items: NavDropdownItem[] }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 hover:text-aqua transition-colors"
      >
        {label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="absolute top-full left-0 mt-3 min-w-[200px] bg-offwhite border border-charcoal/10 rounded-md shadow-lg py-2 z-50">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 hover:bg-pale-aqua hover:text-aqua transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
