/** @type {import('next').NextConfig} */
const DOMINIO = 'salraycoach.com'
// Domínio antigo/alternativo: só serve para redirecionar (301) ao DOMINIO
// mantendo caminho e query. Nunca aparece em link, sitemap nem canonical.
const DOMINIOS_ALTERNATIVOS = ['salrayofficial.com', 'www.salrayofficial.com']

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
