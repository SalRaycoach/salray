/**
 * Checklist objetivo compartilhado entre scripts/qa-articles.js (auditoria de
 * lotes já publicados) e scripts/generate-articles.js (gate no momento da
 * geração). Mantido em um único lugar para não haver deriva entre os dois.
 */

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

  if (a.tipo === 'pilar') {
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

  if (a.ctaTotal < 2) {
    errors.push(`only ${a.ctaTotal} CTA link(s) (#consultation/#community), expected at least 2 (mid + end)`)
  }

  if (a.pillarSlug && !slugSet.has(a.pillarSlug)) {
    errors.push(`pillarSlug '${a.pillarSlug}' does not match any known article`)
  }
  for (const r of a.relatedArticles || []) {
    if (!slugSet.has(r)) errors.push(`relatedArticles references unknown slug '${r}'`)
  }

  if (a.title && a.title.length > 110) errors.push(`title is ${a.title.length} chars, max 110`)
  if (a.excerpt && a.excerpt.length > 155) errors.push(`excerpt is ${a.excerpt.length} chars, max 155`)

  if (a.wordCount) {
    const [min, max] = a.tipo === 'pilar' ? [2500, 3500] : [1200, 1800]
    if (a.wordCount < min) warnings.push(`${a.wordCount} words, below the ${min}-${max} target`)
  }

  return { errors, warnings }
}

function deriveFieldsFromContent(content) {
  return {
    hasClinicalHeading: /## When professional clinical care may be appropriate/.test(content),
    has988: /988/.test(content),
    ctaTotal: (content.match(/#consultation/g) || []).length + (content.match(/#community/g) || []).length,
    isSensitive: SENSITIVE_PATTERN.test(content),
    wordCount: content.split(/\s+/).filter(Boolean).length,
  }
}

module.exports = { validateArticle, deriveFieldsFromContent, SENSITIVE_PATTERN }
