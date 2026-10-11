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
  'why-do-i-keep-reacting-the-same-way': '2026-10-11T14:30:00-05:00',
  'overthinking-racing-thoughts': '2026-10-11T14:30:00-05:00',
  'anxiety-symptoms-chronic-anxiety': '2026-10-11T14:30:00-05:00',
  'unresolved-trauma-recovery': '2026-10-11T14:30:00-05:00',
  'toxic-relationships-abuse-patterns': '2026-10-11T14:30:00-05:00',
  'attachment-trust-boundaries': '2026-10-11T14:30:00-05:00',
  'self-worth-self-esteem-failure': '2026-10-11T14:30:00-05:00',
  'people-pleasing-perfectionism': '2026-10-11T14:30:00-05:00',
  'life-direction-identity-starting-over': '2026-10-11T14:30:00-05:00',
  'high-functioning-anxiety-patterns': '2026-10-11T09:45:00-05:00',
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
    // Post-submission confirmation page — never indexed, same pattern as
    // /thank-you-consultation and /thank-you-community below.
    '/4-week-experience/thank-you',
    '/book-a-session/thank-you',
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
        // /_next/static/ and /_next/image/ deliberately NOT disallowed here
        // (pedido 23 set 2026) — blocking them stops Google from fetching the
        // CSS/JS/optimized images it needs to render the page, which can get
        // a visually broken version of the page indexed even though the text
        // content is fine. Google's own guidance for Next.js sites is to
        // leave these paths crawlable.
        disallow: ['/api/', '/thank-you-consultation/'],
      },
    ],
  },
  // Injects the force-dynamic pages next-sitemap's own crawl never finds
  // (see the comment on extractPublishedSlugs above) — routed through the
  // same transform() below so they get the same priority/changefreq/lastmod
  // logic as every other URL, not a separate ad-hoc shape.
  // /pt/reconstrucao-emocional é force-dynamic (troca de preço automática em
  // 01/11/2026), então também não aparece no crawl estático: listada aqui.
  additionalPaths: async (config) => {
    const paths = ['/pt/reconstrucao-emocional', '/pt/reflexoes', ...PT_REFLEXOES_AUDIOS.map((a) => `/pt/reflexoes/${a.slug}`), '/reflections', ...EN_REFLECTIONS.map((a) => `/reflections/${a.slug}`)]
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
    } else if (p === '/4-week-experience' || p === '/pt/reconstrucao-emocional') {
      // Tornadas indexáveis em 11 out 2026 — lastmod fixo nessa data (não muda a cada build).
      priority = 0.8
      changefreq = 'monthly'
      lastmod = '2026-10-11T12:00:00-05:00'
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
