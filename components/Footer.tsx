import Link from 'next/link'
import { business, contato, clinicalDisclaimer } from '@/lib/config'

const navLinks = [
  { href: '/about/', label: 'About Sal' },
  { href: '/how-i-help/', label: 'How I Help' },
  { href: '/stable-method/', label: 'The S.T.A.B.L.E. Method' },
  { href: '/resources/', label: 'Resources' },
  { href: '/community/', label: 'Community' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/contact/', label: 'Contact' },
]

const legalLinks = [
  { href: '/privacy-policy/', label: 'Privacy Policy' },
  { href: '/terms/', label: 'Terms of Use' },
  { href: '/disclaimer/', label: 'Professional Disclaimer' },
  { href: '/cancellation-policy/', label: 'Cancellation & Rescheduling Policy' },
]

export default function Footer() {
  const isInstagramPending = contato.instagramUrl.startsWith('PENDENTE_')
  const isFacebookPending = contato.facebookGroupUrl.startsWith('PENDENTE_')

  return (
    <footer className="bg-charcoal text-offwhite">
      <div className="max-w-content mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <span className="font-display text-xl block mb-2">{business.nome}</span>
          <p className="font-body text-sm text-offwhite/70 leading-relaxed">{business.posicionamento}</p>
        </div>

        <div>
          <h3 className="font-body text-xs uppercase tracking-widest text-aqua mb-4">Navigate</h3>
          <ul className="space-y-2 font-body text-sm text-offwhite/70">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-orange">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-body text-xs uppercase tracking-widest text-aqua mb-4">Contact</h3>
          <ul className="space-y-2 font-body text-sm text-offwhite/70">
            <li>
              <a href={`mailto:${contato.email}`} className="hover:text-orange">
                {contato.email}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${contato.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-orange">
                {contato.whatsappDisplay}
              </a>
            </li>
            {!isInstagramPending && (
              <li>
                <a href={contato.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-orange">
                  Instagram
                </a>
              </li>
            )}
            {!isFacebookPending && (
              <li>
                <a href={contato.facebookGroupUrl} target="_blank" rel="noopener noreferrer" className="hover:text-orange">
                  Private Facebook Community
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-body text-xs uppercase tracking-widest text-aqua mb-4">Legal</h3>
          <ul className="space-y-2 font-body text-sm text-offwhite/70">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-orange">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-offwhite/10">
        <div className="max-w-content mx-auto px-6 py-6">
          <p className="font-body text-xs text-offwhite/50 leading-relaxed max-w-3xl mb-3">{clinicalDisclaimer}</p>
          <p className="font-body text-xs text-offwhite/40">
            © {new Date().getFullYear()} {business.nome}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
