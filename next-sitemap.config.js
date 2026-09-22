/** @type {import('next-sitemap').IConfig} */
const fs = require('fs')
const path = require('path')

const DOMINIO = 'salraycoach.com'

/**
 * Real per-article lastmod dates — fixes the bug where every URL in the
 * sitemap showed the exact same build-time timestamp (pedido 22 set 2026).
 * Resource articles DO have a real dateModified, but it lives in TypeScript
 * (lib/resources.ts for the 14 seed articles, content/generated-articles/*.json
 * for the rest) — this config file runs as plain CommonJS via the
 * `next-sitemap` CLI, with no TypeScript compilation step, so a normal
 * `require('../lib/resources')` isn't available here. The 93 generated
 * articles are read directly since they're already plain JSON. The 14 seed
 * articles are hardcoded below from lib/resources.ts's current values —
 * update this list if a seed article's dateModified changes there.
 */
const SEED_ARTICLE_DATES = {
  'why-cant-i-stop-overthinking': '2026-03-01T09:00:00-05:00',
  'why-do-i-keep-reacting-the-same-way': '2026-03-05T09:00:00-05:00',
  'why-do-i-attract-toxic-relationships': '2026-03-08T09:00:00-05:00',
  'why-dont-i-trust-myself-anymore': '2026-03-12T09:00:00-05:00',
  'how-to-rebuild-your-life-after-it-falls-apart': '2026-03-15T09:00:00-05:00',
  'overthinking-racing-thoughts': '2026-04-01T09:00:00-05:00',
  'anxiety-symptoms-chronic-anxiety': '2026-04-03T09:00:00-05:00',
  'unresolved-trauma-recovery': '2026-04-08T09:00:00-05:00',
  'toxic-relationships-abuse-patterns': '2026-04-10T09:00:00-05:00',
  'attachment-trust-boundaries': '2026-04-13T09:00:00-05:00',
  'self-worth-self-esteem-failure': '2026-04-17T09:00:00-05:00',
  'people-pleasing-perfectionism': '2026-04-20T09:00:00-05:00',
  'life-direction-identity-starting-over': '2026-04-22T09:00:00-05:00',
  'high-functioning-anxiety-patterns': '2026-08-11T09:00:00-05:00',
}

function loadGeneratedArticleDates() {
  const dir = path.join(__dirname, 'content', 'generated-articles')
  const map = {}
  if (!fs.existsSync(dir)) return map
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.json')) continue
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
      if (data.slug && data.dateModified) map[data.slug] = data.dateModified
    } catch {
      // Malformed file — skip rather than fail the whole sitemap build.
    }
  }
  return map
}

const ARTICLE_DATES = { ...SEED_ARTICLE_DATES, ...loadGeneratedArticleDates() }

/**
 * /pt/reflexoes/ and /reflections/ are `force-dynamic` pages with no
 * generateStaticParams (see their page.tsx comments) — next-sitemap
 * discovers URLs from the static build output, so dynamic-only routes like
 * these were silently never listed at all (pedido 22 set 2026, item 6).
 * Same fs-read-as-plain-text trick as the article dates above: the audio
 * arrays live in TypeScript (lib/audios.ts, lib/reflections.ts), so a
 * lightweight regex extracts just {slug, date} pairs without needing a
 * TypeScript compile step in this CommonJS config. Only already-published
 * entries (date <= now) are included — a scheduled one isn't a real URL yet.
 */
function extractPublishedSlugs(tsFilePath, dateFieldName) {
  const filePath = path.join(__dirname, tsFilePath)
  if (!fs.existsSync(filePath)) return []
  const src = fs.readFileSync(filePath, 'utf-8')
  const re = new RegExp(`slug: ['"]([^'"]+)['"],[\\s\\S]*?${dateFieldName}: ['"]([^'"]+)['"]`, 'g')
  const now = Date.now()
  const results = []
  let m
  while ((m = re.exec(src)) !== null) {
    const [, slug, date] = m
    if (new Date(date).getTime() <= now) results.push({ slug, date })
  }
  return results
}

const PT_REFLEXOES_AUDIOS = extractPublishedSlugs('lib/audios.ts', 'dataPublicacao')
const EN_REFLECTIONS = extractPublishedSlugs('lib/reflections.ts', 'publishDate')

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
    '/book-a-session/thank-you',
    // Isolated PT campaign page — never indexed, never listed in sitemap.
    // See Briefing_Pagina_Reconstrucao_Emocional_SAL_Ray, seção 18. Does NOT
    // exclude the rest of /pt/ — /pt/reflexoes/ is a sibling section that's
    // meant to be indexed and listed (see its own priority rule below).
    '/pt/reconstrucao-emocional',
    // Ferramenta de autoavaliação enviada só por link direto a quem comprou
    // as Vivências — nunca indexada, nunca listada (pedido 27 ago 2026).
    '/pt/reconstrucao-emocional/avaliacao',
    // Ferramenta de autoavaliação em inglês — mesmo padrão "link privado",
    // nunca indexada, nunca listada (pedido 22 set 2026).
    '/assessment',
    '/assessment/thank-you',
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
  // Injects the force-dynamic pages next-sitemap's own crawl never finds
  // (see the comment on extractPublishedSlugs above) — routed through the
  // same transform() below so they get the same priority/changefreq/lastmod
  // logic as every other URL, not a separate ad-hoc shape.
  additionalPaths: async (config) => {
    const paths = ['/pt/reflexoes', ...PT_REFLEXOES_AUDIOS.map((a) => `/pt/reflexoes/${a.slug}`), '/reflections', ...EN_REFLECTIONS.map((a) => `/reflections/${a.slug}`)]
    return Promise.all(paths.map((p) => config.transform(config, p)))
  },
  transform: async (config, path) => {
    // next-sitemap passes paths without a trailing slash into transform,
    // then appends "/" itself afterwards (trailingSlash: true above) — normalize first.
    const p = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path

    let priority = 0.7
    let changefreq = 'monthly'
    let lastmod // real date only where one is actually known — omitted otherwise (pedido 22 set 2026, item 4)

    if (p === '' || p === '/') {
      priority = 1.0
      changefreq = 'weekly'
    } else if (p === '/book-a-session') {
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
      lastmod = ARTICLE_DATES[p.split('/')[3]]
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
      lastmod = PT_REFLEXOES_AUDIOS.find((a) => a.slug === p.split('/')[3])?.date
    } else if (p === '/reflections') {
      // hub — English audio reflections library, same treatment as /pt/reflexoes
      priority = 0.8
      changefreq = 'weekly'
    } else if (p.startsWith('/reflections/')) {
      // /reflections/[slug]/ — individual reflection
      priority = 0.6
      changefreq = 'monthly'
      lastmod = EN_REFLECTIONS.find((a) => a.slug === p.split('/')[2])?.date
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod,
    }
  },
}
