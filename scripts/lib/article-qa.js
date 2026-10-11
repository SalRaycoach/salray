/**
 * Checklist objetivo compartilhado entre scripts/qa-articles.js (auditoria de
 * lotes já publicados) e scripts/generate-articles.js (gate no momento da
 * geração). Mantido em um único lugar para não haver deriva entre os dois.
 */

/**
 * Exceção só para a coleção "Relationship Patterns and Emotional Wellbeing" (out 2026):
 * estes 18 artigos foram publicados com o texto do PDF original, sem FAQ e mais curtos que a
 * meta de palavras. Para eles, a regra de FAQ e o aviso de contagem de palavras não se aplicam.
 * Todas as outras checagens continuam valendo. A regra geral não muda.
 */
const RELATIONSHIP_COLLECTION_EXEMPT = new Set([
  'why-you-keep-repeating-the-same-relationship-pattern',
  'a-simple-relationship-pattern-map',
  'emotional-regulation-when-relationship-feelings-become-overwhelming',
  'a-five-minute-pause-before-you-respond',
  'understanding-attachment-without-turning-it-into-a-label',
  'when-your-partner-needs-space-and-you-feel-anxious',
  'choosing-partners-who-can-meet-you-emotionally',
  'chemistry-and-consistency-in-early-dating',
  'how-to-stay-connected-to-yourself-in-a-relationship',
  'a-week-of-small-ways-to-reconnect-with-yourself',
  'simple-words-for-saying-no-without-overexplaining',
  'expressing-your-needs-without-anger-or-shutting-down',
  'repairing-a-conversation-after-an-argument',
  'reflecting-on-relationships-without-spiraling-into-self-blame',
  'rebuilding-your-self-worth-after-painful-relationships',
  'rebuilding-self-trust-through-small-decisions',
  'turning-relationship-awareness-into-lasting-change',
  'a-gentle-thirty-day-plan-for-practicing-new-relationship-habits',
])

const SENSITIVE_PATTERN = /\b(hopeless|hopelessness|empty|emptiness|abuse|self-harm|suicid)/i

/**
 * @param {object} a - artigo normalizado: { slug, tipo, needsProfessionalCareNote,
 *   pillarSlug, relatedArticles, title, excerpt, faqCount, hasClinicalHeading,
 *   has988, ctaTotal, isSensitive, wordCount? }
 * @param {Set<string>} slugSet - todos os slugs conhecidos (seeds + gerados)
 * @returns {{ errors: string[], warnings: string[] }}
 */
function validateArticle(a, slugSet) {
  const errors = []
  const warnings = []
  const exempt = RELATIONSHIP_COLLECTION_EXEMPT.has(a.slug)

  if (exempt) {
    // sem exigência de FAQ
  } else if (a.tipo === 'pilar') {
    if (a.faqCount < 8 || a.faqCount > 10) errors.push(`FAQ count ${a.faqCount}, expected 8-10 for a pillar`)
  } else {
    if (a.faqCount < 3) errors.push(`FAQ count ${a.faqCount}, expected at least 3-4 for a complementary article`)
    if (a.faqCount > 6) warnings.push(`FAQ count ${a.faqCount} is above the 3-4 target (not wrong, just more than spec)`)
  }

  if (a.needsProfessionalCareNote) {
    if (!a.hasClinicalHeading) {
      errors.push('needsProfessionalCareNote=true but missing exact heading "## When professional clinical care may be appropriate"')
    }
    if (a.isSensitive && !a.has988) {
      errors.push('touches hopelessness/emptiness/abuse but does not mention the 988 crisis resource')
    }
  }

  // +1: o bloco de CTA no rodapé do artigo (padrão ou ctaOverride) é sempre renderizado
  // pelo page.tsx, independente do conteúdo — ver app/resources/[cluster]/[slug]/page.tsx.
  const hasFourWeekCta = a.hasFourWeekCta || a.ctaOverride?.href === '/4-week-experience/'
  const minCta = a.tipo === 'complementar' && hasFourWeekCta ? 1 : 2
  const effectiveCtaTotal = a.ctaTotal + 1
  if (effectiveCtaTotal < minCta) {
    errors.push(`only ${effectiveCtaTotal} CTA link(s) (content + footer block), expected at least ${minCta}`)
  }

  if (a.pillarSlug && !slugSet.has(a.pillarSlug)) {
    errors.push(`pillarSlug '${a.pillarSlug}' does not match any known article`)
  }
  for (const r of a.relatedArticles || []) {
    if (!slugSet.has(r)) errors.push(`relatedArticles references unknown slug '${r}'`)
  }

  if (a.title && a.title.length > 110) errors.push(`title is ${a.title.length} chars, max 110`)
  if (a.excerpt && a.excerpt.length > 155) errors.push(`excerpt is ${a.excerpt.length} chars, max 155`)

  if (a.wordCount && !exempt) {
    const [min, max] = a.tipo === 'pilar' ? [2500, 3500] : [1200, 1800]
    if (a.wordCount < min) warnings.push(`${a.wordCount} words, below the ${min}-${max} target`)
  }

  return { errors, warnings }
}

function deriveFieldsFromContent(content) {
  return {
    hasClinicalHeading: /## When professional clinical care may be appropriate/.test(content),
    has988: /988/.test(content),
    ctaTotal:
      (content.match(/#consultation/g) || []).length +
      (content.match(/#community/g) || []).length +
      (content.match(/\/4-week-experience\//g) || []).length,
    hasFourWeekCta: /\/4-week-experience\//.test(content),
    isSensitive: SENSITIVE_PATTERN.test(content),
    wordCount: content.split(/\s+/).filter(Boolean).length,
  }
}

module.exports = { validateArticle, deriveFieldsFromContent, SENSITIVE_PATTERN, RELATIONSHIP_COLLECTION_EXEMPT }
