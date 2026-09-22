import type { Metadata } from 'next'

/**
 * English counterpart of app/pt/reflexoes/layout.tsx. This section is free,
 * indexable content meant to be found — explicit index, follow here, at the
 * layer closest to the real pages.
 */
export const metadata: Metadata = {
  title: { template: '%s | S.T.A.B.L.E. Reflections', default: 'S.T.A.B.L.E. Reflections' },
  robots: { index: true, follow: true },
}

export default function ReflectionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
