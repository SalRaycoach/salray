/** @type {import('next').NextConfig} */
const DOMINIO = 'salraycoach.com'
// Domínio antigo/alternativo: só serve para redirecionar (301) ao DOMINIO
// mantendo caminho e query. Nunca aparece em link, sitemap nem canonical.
const DOMINIOS_ALTERNATIVOS = ['salrayofficial.com', 'www.salrayofficial.com']

// Onda 2 de limpeza de artigos (out 2026): cada artigo de origem foi reunido no destino.
// Destinos com barra final por causa de trailingSlash: true; sempre direto ao
// destino final, sem encadear redirecionamentos.
const ARTICLE_MERGES = [
  ['/resources/relationships-boundaries/why-do-i-attract-toxic-relationships', '/resources/relationships-boundaries/why-do-i-attract-toxic-people-pattern/'],
  ['/resources/relationships-boundaries/relationship-trauma-shapes-future-relationships', '/resources/relationships-boundaries/why-toxic-relationships-feel-familiar/'],
  ['/resources/relationships-boundaries/what-emotional-abuse-can-look-like', '/resources/relationships-boundaries/signs-of-narcissistic-abuse-easy-to-miss/'],
  ['/resources/relationships-boundaries/when-to-seek-professional-support-after-abuse', '/resources/relationships-boundaries/toxic-relationships-abuse-patterns/'],
  ['/resources/relationships-boundaries/why-do-i-fear-abandonment-in-healthy-relationships', '/resources/relationships-boundaries/relationship-anxiety-why-good-relationships-feel-unsafe/'],
  ['/resources/self-trust-identity/why-dont-i-trust-myself-anymore', '/resources/self-trust-identity/why-do-i-keep-doubting-myself/'],
  ['/resources/self-trust-identity/difference-between-confidence-and-self-trust', '/resources/self-trust-identity/lack-of-confidence-vs-low-self-worth/'],
  ['/resources/self-trust-identity/low-self-esteem-where-the-pattern-starts', '/resources/self-trust-identity/self-worth-self-esteem-failure/'],
  ['/resources/life-direction-rebuilding/how-to-rebuild-your-life-after-it-falls-apart', '/resources/life-direction-rebuilding/rebuilding-your-life-without-starting-from-zero/'],
  ['/resources/life-direction-rebuilding/starting-over-emotionally-what-it-involves', '/resources/life-direction-rebuilding/rebuilding-your-life-without-starting-from-zero/'],
  ['/resources/life-direction-rebuilding/feeling-lost-in-life-what-it-usually-means', '/resources/life-direction-rebuilding/why-do-i-feel-like-i-dont-know-my-purpose/'],
  ['/resources/life-direction-rebuilding/life-transitions-why-change-feels-harder-40s-50s', '/resources/life-direction-rebuilding/feeling-lost-at-40-or-50-not-behind/'],
  ['/resources/emotional-patterns-self-sabotage/bodys-reaction-to-old-trauma', '/resources/emotional-patterns-self-sabotage/unresolved-trauma-recovery/'],
  ['/resources/emotional-patterns-self-sabotage/how-do-i-know-if-i-have-unresolved-trauma', '/resources/emotional-patterns-self-sabotage/unresolved-trauma-recovery/'],
  ['/resources/emotional-patterns-self-sabotage/what-trauma-recovery-looks-like-day-to-day', '/resources/emotional-patterns-self-sabotage/unresolved-trauma-recovery/'],
  ['/resources/emotional-patterns-self-sabotage/why-some-people-feel-fine-but-carry-trauma', '/resources/emotional-patterns-self-sabotage/unresolved-trauma-recovery/'],
  ['/resources/emotional-patterns-self-sabotage/why-do-i-care-so-much-what-people-think', '/resources/emotional-patterns-self-sabotage/why-do-i-seek-validation-from-everyone/'],
  ['/resources/overthinking-emotional-overload/why-cant-i-stop-overthinking', '/resources/overthinking-emotional-overload/overthinking-racing-thoughts/'],
  ['/resources/overthinking-emotional-overload/how-to-calm-your-mind-without-forcing-relaxation', '/resources/overthinking-emotional-overload/overthinking-racing-thoughts/'],
  ['/resources/overthinking-emotional-overload/how-to-stop-worrying-about-things-you-cant-control', '/resources/overthinking-emotional-overload/overthinking-racing-thoughts/'],
  ['/resources/overthinking-emotional-overload/stress-management-habits-that-interrupt-overthinking', '/resources/overthinking-emotional-overload/overthinking-racing-thoughts/'],
  ['/resources/overthinking-emotional-overload/why-is-my-brain-always-racing-at-night', '/resources/overthinking-emotional-overload/overthinking-racing-thoughts/'],
  ['/resources/overthinking-emotional-overload/why-overthinking-gets-worse-when-tired-overwhelmed', '/resources/overthinking-emotional-overload/overthinking-racing-thoughts/'],
  ['/resources/high-functioning-anxiety/anxious-even-when-everyone-thinks-im-fine', '/resources/high-functioning-anxiety/high-functioning-anxiety-patterns/'],
  ['/resources/high-functioning-anxiety/how-do-i-know-if-im-anxious-if-i-dont-look-anxious', '/resources/high-functioning-anxiety/high-functioning-anxiety-patterns/'],
  ['/resources/high-functioning-anxiety/why-i-struggle-at-work-even-though-im-capable', '/resources/high-functioning-anxiety/am-i-actually-failing-or-is-something-else-going-on/'],
  ['/resources/high-functioning-anxiety/why-my-anxiety-feels-different-from-others', '/resources/high-functioning-anxiety/why-i-feel-broken-when-everyone-else-seems-fine/'],
  ['/resources/overthinking-emotional-overload/can-anxiety-go-away-naturally', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/overthinking-emotional-overload/can-anxiety-make-you-feel-physically-sick', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/overthinking-emotional-overload/chronic-vs-severe-anxiety-signs', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/overthinking-emotional-overload/constant-worry-vs-anxiety-difference', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/overthinking-emotional-overload/generalized-anxiety-daily-pattern', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/overthinking-emotional-overload/how-to-calm-anxiety-in-the-moment', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/overthinking-emotional-overload/panic-attacks-vs-panic-disorder', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/overthinking-emotional-overload/social-anxiety-beyond-shyness', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/overthinking-emotional-overload/what-anxiety-relief-actually-looks-like', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/overthinking-emotional-overload/why-am-i-anxious-all-the-time', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/overthinking-emotional-overload/why-do-i-feel-anxious-for-no-reason', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/overthinking-emotional-overload/why-do-i-wake-up-anxious-every-morning', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
  ['/resources/high-functioning-anxiety/can-anxiety-cause-physical-symptoms-when-i-look-calm', '/resources/overthinking-emotional-overload/anxiety-symptoms-chronic-anxiety/'],
]

const nextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${DOMINIO}` }],
        destination: `https://${DOMINIO}/:path*`,
        permanent: true,
        statusCode: 301,
      },
      // Três regras por host, nesta ordem: home, arquivos (sitemap.xml, imagens…
      // sem barra final) e páginas (com barra final, por causa de
      // trailingSlash: true, para não encadear mais um 308 no domínio novo).
      ...DOMINIOS_ALTERNATIVOS.flatMap((host) => {
        const has = [{ type: 'host', value: host }]
        return [
          { source: '/', has, destination: `https://${DOMINIO}/`, permanent: true, statusCode: 301 },
          {
            source: '/:path((?:[^/]+/)*[^/]+\\.[A-Za-z0-9]+)',
            has,
            destination: `https://${DOMINIO}/:path`,
            permanent: true,
            statusCode: 301,
          },
          { source: '/:path+', has, destination: `https://${DOMINIO}/:path+/`, permanent: true, statusCode: 301 },
        ]
      }),
      {
        // Onda 1 de limpeza de artigos (out 2026): conteúdo reunido em outro
        // artigo. Destinos com barra final por causa de trailingSlash: true.
        source: '/resources/emotional-patterns-self-sabotage/when-to-seek-clinical-support-for-trauma',
        destination: '/resources/emotional-patterns-self-sabotage/trauma-healing-coaching-vs-therapy/',
        permanent: true,
        statusCode: 301,
      },
      {
        source: '/resources/relationships-boundaries/repeating-your-parents-relationship-patterns',
        destination: '/resources/relationships-boundaries/why-toxic-relationships-feel-familiar/',
        permanent: true,
        statusCode: 301,
      },
      {
        // Grupo do Facebook retirado do site (out 2026): as duas páginas
        // antigas levam à candidatura da 4-Week Experience.
        source: '/community',
        destination: '/4-week-experience/',
        permanent: true,
        statusCode: 301,
      },
      {
        source: '/thank-you-community',
        destination: '/4-week-experience/',
        permanent: true,
        statusCode: 301,
      },
      ...ARTICLE_MERGES.map(([source, destination]) => ({ source, destination, permanent: true, statusCode: 301 })),
      {
        // /consultation/ retired in favor of /book-a-session/ (pedido 22 set
        // 2026) — permanent so search engines transfer link equity and any
        // existing bookmarks/backlinks keep working. Destination keeps the
        // trailing slash (trailingSlash: true above) so this doesn't chain
        // into a second 308 hop from Next.js's own slash normalization.
        source: '/consultation',
        destination: '/book-a-session/',
        permanent: true,
        statusCode: 301,
      },
    ]
  },
  async headers() {
    return [
      {
        // Applies to every path by default, including HTML documents. The
        // Hostinger CDN was falling back to its own ~1-year default cache
        // for HTML (no Cache-Control was set for pages at all before this),
        // so after a deploy, edges could keep serving old HTML that
        // referenced already-deleted hashed CSS/JS from the previous build
        // — a real incident, not theoretical. A short s-maxage with
        // stale-while-revalidate means any edge self-heals within ~60s of
        // a deploy without needing a manual purge every time. The more
        // specific rules below (images/fonts, /_next/static/) override this
        // for their own paths with a long immutable cache, since Next.js
        // applies the last matching rule for a given header key.
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
        ],
      },
      {
        source: '/:path*(jpg|jpeg|png|webp|avif|svg|ico|woff|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // Build-hashed assets — Next.js sets this automatically for `next start`,
        // but the Hostinger reverse proxy in front of the Node process may strip
        // it, so it's set explicitly here too (brief item 1.4).
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

module.exports = nextConfig
