/**
 * QA objetivo para os artigos do blog — roda o mesmo checklist usado na
 * revisão dos 10 pilares, agora reutilizável para cada lote dos 96
 * complementares gerados por generate-articles.js.
 *
 * A lógica de checagem vive em scripts/lib/article-qa.js e é compartilhada
 * com o gate embutido em generate-articles.js — nenhuma regra é duplicada.
 *
 * Uso:
 *   npm run qa:blog                  → valida tudo (seeds + gerados)
 *   npm run qa:blog -- --cluster=overthinking-emotional-overload
 */

const fs = require('node:fs')
const path = require('node:path')
const { validateArticle, deriveFieldsFromContent } = require('./lib/article-qa')

const RESOURCES_TS = path.join(process.cwd(), 'lib', 'resources.ts')
const GENERATED_DIR = path.join(process.cwd(), 'content', 'generated-articles')

const CLUSTER_FILTER = (process.argv.find((a) => a.startsWith('--cluster=')) || '').split('=')[1]

function extractSeedArticles() {
  const fullSrc = fs.readFileSync(RESOURCES_TS, 'utf-8')
  // Só considerar o array de artigos (seedArticles), não o array `clusters` —
  // ambos têm campos `slug:` com a mesma indentação.
  const articlesStart = fullSrc.indexOf('const seedArticles: Article[] = [')
  const src = fullSrc.slice(articlesStart)
  const slugMatches = [...src.matchAll(/^\s{4}slug: '([^']+)',/gm)]
  const articles = []

  for (let i = 0; i < slugMatches.length; i++) {
    const start = slugMatches[i].index
    const end = i + 1 < slugMatches.length ? slugMatches[i + 1].index : src.indexOf('\nconst generatedDir', start)
    const block = src.slice(start, end > 0 ? end : undefined)

    const slug = slugMatches[i][1]
    const cluster = (block.match(/cluster: '([^']+)'/) || [])[1]
    const tipo = (block.match(/tipo: '([^']+)'/) || [])[1] || 'complementar'
    const pillarSlug = (block.match(/pillarSlug: '([^']+)'/) || [])[1]
    const title = (block.match(/title: '((?:[^'\\]|\\.)*)'/) || block.match(/title: "((?:[^"\\]|\\.)*)"/) || [])[1]
    const excerpt = (block.match(/excerpt:\s*\n?\s*'((?:[^'\\]|\\.)*)'/) || [])[1]
    const needsProfessionalCareNote = /needsProfessionalCareNote: true/.test(block)
    const relatedMatch = block.match(/relatedArticles: \[([^\]]*)\]/)
    const relatedArticles = relatedMatch ? [...relatedMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : []
    const faqCount = (block.match(/question:/g) || []).length

    articles.push({
      slug, cluster, tipo, pillarSlug, title, excerpt,
      needsProfessionalCareNote, relatedArticles, faqCount,
      ...deriveFieldsFromContent(block),
      source: 'seed (lib/resources.ts)',
    })
  }

  return articles
}

function extractGeneratedArticles() {
  if (!fs.existsSync(GENERATED_DIR)) return []
  return fs
    .readdirSync(GENERATED_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((file) => {
      const data = JSON.parse(fs.readFileSync(path.join(GENERATED_DIR, file), 'utf-8'))
      const content = data.content || ''
      return {
        slug: data.slug,
        cluster: data.cluster,
        tipo: data.tipo || 'complementar',
        pillarSlug: data.pillarSlug,
        title: data.title,
        excerpt: data.excerpt,
        needsProfessionalCareNote: !!data.needsProfessionalCareNote,
        relatedArticles: data.relatedArticles || [],
        faqCount: (data.faq || []).length,
        ...deriveFieldsFromContent(content),
        source: `generated (${file})`,
      }
    })
}

function main() {
  const seeds = extractSeedArticles()
  const generated = extractGeneratedArticles()
  let all = [...seeds, ...generated]

  if (CLUSTER_FILTER) {
    all = all.filter((a) => a.cluster === CLUSTER_FILTER)
    console.log(`Filtering to cluster: ${CLUSTER_FILTER} (${all.length} articles)\n`)
  }

  const slugSet = new Set([...seeds, ...generated].map((a) => a.slug))
  const allErrors = []
  const allWarnings = []

  for (const a of all) {
    const { errors, warnings } = validateArticle(a, slugSet)
    errors.forEach((e) => allErrors.push(`${a.slug} [${a.source}]: ${e}`))
    warnings.forEach((w) => allWarnings.push(`${a.slug} [${a.source}]: ${w}`))
  }

  console.log(`Checked ${all.length} article(s): ${seeds.length} seed + ${generated.length} generated.\n`)

  if (allErrors.length === 0) {
    console.log('✅ No blocking issues found.')
  } else {
    console.log(`❌ ${allErrors.length} issue(s) found:\n`)
    allErrors.forEach((e) => console.log('  - ' + e))
  }

  if (allWarnings.length > 0) {
    console.log(`\n⚠ ${allWarnings.length} warning(s) (not blocking, worth a look):\n`)
    allWarnings.forEach((w) => console.log('  - ' + w))
  }

  process.exit(allErrors.length > 0 ? 1 : 0)
}

main()
