/** @type {import('next-sitemap').IConfig} */
const DOMINIO = 'salraycoach.com'

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
    // Temporary, capacity-limited campaign page (noindex while active) — see
    // brief section 11. Remove this line if the page is ever taken off noindex.
    '/4-week-experience',
    // Post-submission confirmation page — never indexed, same pattern as
    // /thank-you-consultation and /thank-you-community below.
    '/4-week-experience/thank-you',
    // Isolated PT campaign page — never indexed, never listed in sitemap.
    // See Briefing_Pagina_Reconstrucao_Emocional_SAL_Ray, seção 18. Does NOT
    // exclude the rest of /pt/ — /pt/reflexoes/ is a sibling section that's
    // meant to be indexed and listed (see its own priority rule below).
    '/pt/reconstrucao-emocional',
    // Ferramenta de autoavaliação enviada só por link direto a quem comprou
    // as Vivências — nunca indexada, nunca listada (pedido 27 ago 2026).
    '/pt/reconstrucao-emocional/avaliacao',
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
    } else if (p === '/sitemap') {
      priority = 0.2
      changefreq = 'weekly'
    } else if (p === '/pt/reflexoes') {
      // hub — biblioteca de áudios em português, conteúdo indexável e gratuito
      priority = 0.8
      changefreq = 'weekly'
    } else if (p.startsWith('/pt/reflexoes/')) {
      // /pt/reflexoes/[slug]/ — áudio individual
      priority = 0.6
      changefreq = 'monthly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
