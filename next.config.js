/** @type {import('next').NextConfig} */
const DOMINIO = 'salraycoach.com'

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
