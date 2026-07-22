/** @type {import('next-sitemap').IConfig} */
const DOMINIO = 'salrayofficial.com'

module.exports = {
  siteUrl: `https://${DOMINIO}`,
  generateRobotsTxt: true,
  trailingSlash: true,
  exclude: [
    '/404',
    '/500',
    '/robots.txt',
    '/sitemap.xml',
    '/thank-you-consultation',
    '/thank-you-community',
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
      { userAgent: 'Googlebot-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/_next/static/', '/_next/image/', '/api/', '/thank-you-consultation/'],
      },
    ],
  },
  transform: async (config, path) => {
    // next-sitemap passes paths without a trailing slash into transform,
    // then appends "/" itself afterwards (trailingSlash: true above) — normalize first.
    const p = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path

    let priority = 0.7
    let changefreq = 'monthly'

    if (p === '' || p === '/') {
      priority = 1.0
      changefreq = 'weekly'
    } else if (p === '/consultation') {
      priority = 0.9
      changefreq = 'weekly'
    } else if (p === '/how-i-help' || p === '/stable-method') {
      priority = 0.9
      changefreq = 'monthly'
    } else if (p === '/resources') {
      priority = 0.8
      changefreq = 'daily'
    } else if (p.startsWith('/resources/') && p.split('/').length === 3) {
      // /resources/[cluster]/ — hub page
      priority = 0.8
      changefreq = 'daily'
    } else if (p.startsWith('/resources/')) {
      // /resources/[cluster]/[slug]/ — individual article
      priority = 0.7
      changefreq = 'monthly'
    } else if (['/privacy-policy', '/terms', '/disclaimer', '/cancellation-policy'].includes(p)) {
      priority = 0.3
      changefreq = 'yearly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
