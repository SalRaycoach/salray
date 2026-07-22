/**
 * Gera os artigos da fila (seção 10 do brief, 6 clusters emocionais) via API
 * da Anthropic e grava um .json por slug em content/generated-articles/ —
 * lib/resources.ts carrega esses arquivos automaticamente, sem edição manual.
 *
 * Uso:
 *   export ANTHROPIC_API_KEY="sk-ant-..."
 *   npm run generate:blog
 */

const fs = require('node:fs')
const path = require('node:path')
const Anthropic = require('@anthropic-ai/sdk')

const OUTPUT_DIR = path.join(process.cwd(), 'content', 'generated-articles')
const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 8192
const DELAY_BETWEEN_CALLS_MS = 8000

// Nenhuma keyword das duas listas originais (blueprint + pesquisa) foi descartada —
// termos clínicos/diagnósticos (anxiety, PTSD, depression etc.) aparecem como
// keywords secundárias dentro da pauta de cada artigo, nunca como alegação clínica.
const ARTICLE_QUEUE = [
  // ---- Cluster 1: overthinking-emotional-overload ----
  { slug: 'why-am-i-anxious-all-the-time', keyword: 'why am I anxious all the time', titulo: 'Why Am I Anxious All the Time?', intencao: 'informational', cluster: 'overthinking-emotional-overload', precisaDisclaimerClinico: true, pauta: ['Empathetic opening without diagnosing', 'What constant anxiety can feel like', 'Why it may persist (overload, unresolved patterns)', 'Non-clinical framework for calming the nervous system', 'What rebuilding stability can involve', 'When professional clinical care may be appropriate (anxiety symptoms, panic disorder, generalized anxiety)', 'Internal links to overthinking and emotional stability clusters', 'CTA: consultation'] },
  { slug: 'how-to-calm-an-overactive-mind', keyword: 'how to calm an overactive mind', titulo: 'How to Calm an Overactive Mind', intencao: 'informational', cluster: 'overthinking-emotional-overload', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What an overactive mind looks like day to day', 'Why the mind stays in overdrive (stress management angle)', 'Non-clinical framework for calming it', 'What rebuilding can involve', 'Internal links', 'CTA: community'] },
  { slug: 'why-do-i-feel-mentally-exhausted', keyword: 'why do I feel mentally exhausted', titulo: 'Why Do I Feel Mentally Exhausted?', intencao: 'informational', cluster: 'overthinking-emotional-overload', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'Signs of mental exhaustion vs. normal tiredness', 'Why emotional overload causes exhaustion', 'Non-clinical framework for recovery', 'What rebuilding sustainable rhythms can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'how-to-stop-worrying', keyword: 'how do I stop worrying', titulo: 'How Do I Stop Worrying?', intencao: 'informational', cluster: 'overthinking-emotional-overload', precisaDisclaimerClinico: true, pauta: ['Empathetic opening', 'Why worry feels productive but rarely resolves anything (constant worry)', 'The pattern beneath chronic worry', 'Non-clinical framework to interrupt it', 'What rebuilding decision-making trust can involve', 'When professional clinical care may be appropriate (generalized anxiety, chronic anxiety)', 'Internal links', 'CTA: consultation'] },
  { slug: 'why-is-my-brain-always-racing', keyword: 'why is my brain always racing', titulo: 'Why Is My Brain Always Racing?', intencao: 'informational', cluster: 'overthinking-emotional-overload', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'Racing thoughts as a pattern, not a flaw', 'Why it happens (unresolved pressure)', 'Non-clinical framework', 'What rebuilding can involve', 'Internal links', 'CTA: community'] },
  { slug: 'anxiety-attack-vs-panic-attack', keyword: 'anxiety attack vs panic attack', titulo: 'Anxiety Attack or Panic Attack? Understanding the Difference', intencao: 'informational', cluster: 'overthinking-emotional-overload', precisaDisclaimerClinico: true, pauta: ['Empathetic, non-alarming opening', 'Defining the terms in plain language', 'Why this distinction matters', 'What non-clinical coaching can and cannot address here', 'Grounding tools that may help in the moment', 'When professional clinical care may be appropriate (panic disorder, severe anxiety) + crisis resource', 'Internal links', 'CTA: consultation'] },
  { slug: 'non-clinical-tools-for-anxiety-relief', keyword: 'anxiety relief', titulo: 'Non-Clinical Tools That May Support Anxiety Relief', intencao: 'informational', cluster: 'overthinking-emotional-overload', precisaDisclaimerClinico: true, pauta: ['Empathetic opening', 'What non-clinical support can offer (distinct from treatment)', 'Practical tools (grounding, structure, pattern recognition)', 'What these tools are not a substitute for', 'What rebuilding stability can involve', 'When professional clinical care may be appropriate (anxiety treatment, anxiety causes)', 'Internal links', 'CTA: consultation'] },

  // ---- Cluster 2: emotional-patterns-self-sabotage ----
  { slug: 'how-to-stop-self-sabotage', keyword: 'how to stop self-sabotage', titulo: 'How to Stop Self-Sabotage', intencao: 'informational', cluster: 'emotional-patterns-self-sabotage', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What self-sabotage really is', 'Why it persists (familiarity, fear)', 'Non-clinical framework to interrupt it', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'why-do-i-feel-stuck-in-life', keyword: 'why do I feel stuck in life', titulo: 'Why Do I Feel Stuck in Life?', intencao: 'informational', cluster: 'emotional-patterns-self-sabotage', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What "stuck" usually means underneath', 'Why the feeling persists', 'Non-clinical framework for movement', 'What rebuilding direction can involve', 'Internal links to life-direction cluster', 'CTA: community'] },
  { slug: 'understanding-emotional-triggers', keyword: 'emotional triggers', titulo: 'Understanding Your Emotional Triggers', intencao: 'informational', cluster: 'emotional-patterns-self-sabotage', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What a trigger actually is', 'Why the same triggers keep activating the same reaction', 'Non-clinical framework for working with triggers', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'why-cant-i-let-go-of-the-past', keyword: "why can't I let go of the past", titulo: "Why Can't I Let Go of the Past?", intencao: 'informational', cluster: 'emotional-patterns-self-sabotage', precisaDisclaimerClinico: true, pauta: ['Empathetic opening', 'Limiting beliefs and emotional pain that keep the past present', 'Why the mind holds on', 'Non-clinical framework for processing and moving forward', 'What rebuilding can involve', 'When professional clinical care may be appropriate (unresolved trauma)', 'Internal links', 'CTA: consultation'] },
  { slug: 'healing-childhood-wounds-non-clinical-approach', keyword: 'healing childhood wounds', titulo: 'Healing Childhood Wounds: A Non-Clinical Approach', intencao: 'informational', cluster: 'emotional-patterns-self-sabotage', precisaDisclaimerClinico: true, pauta: ['Empathetic, careful opening', 'What "inner child" language means in a non-clinical context', 'Why old wounds keep influencing adult patterns', 'What non-clinical coaching can support here', 'What rebuilding can involve', 'When professional clinical care may be appropriate (childhood trauma, PTSD symptoms, trauma recovery) + crisis resource', 'Internal links', 'CTA: consultation'] },
  { slug: 'what-is-emotional-healing', keyword: 'emotional healing', titulo: 'What Is Emotional Healing, Really?', intencao: 'informational', cluster: 'emotional-patterns-self-sabotage', precisaDisclaimerClinico: true, pauta: ['Empathetic opening', 'Defining emotional healing in plain terms', 'Why it is a process, not an event', 'Non-clinical framework for supporting it', 'What rebuilding can involve', 'When professional clinical care may be appropriate (emotional trauma, trauma healing)', 'Internal links', 'CTA: community'] },

  // ---- Cluster 3: relationships-boundaries ----
  { slug: 'why-cant-i-leave-a-toxic-relationship', keyword: "why can't I leave a toxic relationship", titulo: "Why Can't I Leave a Toxic Relationship?", intencao: 'informational', cluster: 'relationships-boundaries', precisaDisclaimerClinico: true, pauta: ['Empathetic, careful opening', 'Why leaving is harder than it looks from outside', 'The role of familiarity and eroded self-trust', 'What non-clinical coaching can support here', 'What this content is not (legal or safety advice)', 'When professional/safety support may be needed (narcissistic abuse, emotional abuse) + crisis resource', 'Internal links', 'CTA: consultation'] },
  { slug: 'how-to-set-emotional-boundaries', keyword: 'how to set emotional boundaries', titulo: 'How to Set Emotional Boundaries (Without Guilt)', intencao: 'informational', cluster: 'relationships-boundaries', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What a boundary actually is', 'Why boundaries feel uncomfortable at first', 'Non-clinical framework for practicing boundaries', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'why-do-i-fear-abandonment', keyword: 'why do I fear abandonment', titulo: 'Why Do I Fear Abandonment?', intencao: 'informational', cluster: 'relationships-boundaries', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What fear of abandonment can look like', 'Why it develops', 'Non-clinical framework for rebuilding security', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'why-do-i-have-trust-issues', keyword: 'trust issues', titulo: 'Why Do I Have Trust Issues — and How Do I Rebuild Trust?', intencao: 'informational', cluster: 'relationships-boundaries', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What trust issues look like in relationships', 'Where they usually come from', 'Non-clinical framework for rebuilding trust', 'What rebuilding can involve', 'Internal links', 'CTA: community'] },
  { slug: 'understanding-codependency', keyword: 'codependency', titulo: 'Understanding Codependency in Relationships', intencao: 'informational', cluster: 'relationships-boundaries', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What codependency is (and is not)', 'Signs of codependent patterns', 'Non-clinical framework for building healthier interdependence', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'recovering-from-a-breakup', keyword: 'breakup recovery', titulo: 'Recovering From a Breakup: A Structured Approach', intencao: 'informational', cluster: 'relationships-boundaries', precisaDisclaimerClinico: true, pauta: ['Empathetic opening', 'Why breakup recovery is not linear', 'Relationship trauma and what it can look like', 'Non-clinical framework for rebuilding after a breakup', 'What rebuilding can involve', 'When professional clinical care may be appropriate', 'Internal links', 'CTA: consultation'] },
  { slug: 'relationship-anxiety-explained', keyword: 'relationship anxiety', titulo: 'Relationship Anxiety: Why It Happens and What Helps', intencao: 'informational', cluster: 'relationships-boundaries', precisaDisclaimerClinico: true, pauta: ['Empathetic opening', 'What relationship anxiety feels like', 'Why it develops (patterns, past experience)', 'Non-clinical framework for working through it', 'What rebuilding can involve', 'When professional clinical care may be appropriate', 'Internal links', 'CTA: consultation'] },

  // ---- Cluster 4: self-trust-identity ----
  { slug: 'lost-sense-of-self', keyword: 'lost sense of self', titulo: 'What to Do When You Have Lost Your Sense of Self', intencao: 'informational', cluster: 'self-trust-identity', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What losing your sense of self can feel like', 'Why it happens', 'Non-clinical framework for reconnecting with identity', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'how-to-rebuild-confidence-after-a-difficult-relationship', keyword: 'how to rebuild confidence after a difficult relationship', titulo: 'How to Rebuild Confidence After a Difficult Relationship', intencao: 'informational', cluster: 'self-trust-identity', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'Why confidence erodes in difficult relationships', 'What rebuilding confidence actually requires', 'Non-clinical framework', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'why-dont-i-know-what-i-want', keyword: "why don't I know what I want", titulo: "Why Don't I Know What I Want?", intencao: 'informational', cluster: 'self-trust-identity', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'Why clarity about wants can disappear', 'The connection to self-trust', 'Non-clinical framework for rebuilding clarity', 'What rebuilding can involve', 'Internal links', 'CTA: community'] },
  { slug: 'why-dont-i-feel-good-enough', keyword: "why don't I feel good enough", titulo: "Why Don't I Feel Good Enough?", intencao: 'informational', cluster: 'self-trust-identity', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'Low self-esteem and lack of confidence, defined plainly', 'Where this feeling usually comes from', 'Non-clinical framework for rebuilding self-worth', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'understanding-impostor-syndrome', keyword: 'impostor syndrome', titulo: 'Understanding Impostor Syndrome', intencao: 'informational', cluster: 'self-trust-identity', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What impostor syndrome is', 'Why capable people experience it', 'Non-clinical framework for working through it', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'how-to-stop-people-pleasing', keyword: 'people pleasing', titulo: 'How to Stop People Pleasing', intencao: 'informational', cluster: 'self-trust-identity', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What people-pleasing costs you over time', 'Why do I seek validation / why do I care what people think', 'Non-clinical framework for change', 'What rebuilding can involve', 'Internal links', 'CTA: community'] },
  { slug: 'perfectionism-and-fear-of-failure', keyword: 'perfectionism and fear of failure', titulo: 'Perfectionism and Fear of Failure: Breaking the Cycle', intencao: 'informational', cluster: 'self-trust-identity', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'How perfectionism and fear of failure reinforce each other', 'Why doubting yourself keeps the cycle going', 'Non-clinical framework', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },

  // ---- Cluster 5: life-direction-rebuilding ----
  { slug: 'feeling-lost-at-40-or-50', keyword: 'feeling lost at 40 or 50', titulo: 'Feeling Lost at 40 or 50? Here Is a Way Forward', intencao: 'informational', cluster: 'life-direction-rebuilding', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'Why this life stage often brings disorientation', 'What tends to make it harder', 'Non-clinical framework for rebuilding direction', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'how-to-find-direction-in-life', keyword: 'how to find direction in life', titulo: 'How to Find Direction in Life', intencao: 'informational', cluster: 'life-direction-rebuilding', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'Why direction feels unclear', 'A structured, non-clinical approach to finding it', 'What rebuilding can involve', 'Internal links', 'CTA: community'] },
  { slug: 'starting-over-emotionally', keyword: 'starting over emotionally', titulo: 'Starting Over Emotionally After a Major Life Change', intencao: 'informational', cluster: 'life-direction-rebuilding', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What starting over actually requires emotionally', 'Why it feels disorienting', 'Non-clinical framework for the transition', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'navigating-an-identity-crisis', keyword: 'identity crisis', titulo: 'Navigating an Identity Crisis', intencao: 'informational', cluster: 'life-direction-rebuilding', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What an identity crisis looks like in adulthood', 'Why life transitions trigger it', 'Non-clinical framework', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'burnout-recovery-what-it-looks-like', keyword: 'burnout recovery', titulo: 'Burnout Recovery: What It Actually Looks Like', intencao: 'informational', cluster: 'life-direction-rebuilding', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'Recognizing burnout vs. normal tiredness', 'Why recovery takes longer than people expect', 'Non-clinical framework for recovery', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'how-to-find-purpose-after-a-major-life-transition', keyword: 'purpose in life', titulo: 'How to Find Purpose After a Major Life Transition', intencao: 'informational', cluster: 'life-direction-rebuilding', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'Why purpose feels elusive after big change', 'A sequenced, non-clinical approach', 'What rebuilding can involve', 'Internal links', 'CTA: community'] },

  // ---- Cluster 6: emotional-stability ----
  { slug: 'how-to-become-emotionally-stable', keyword: 'how to become emotionally stable', titulo: 'How to Become Emotionally Stable', intencao: 'informational', cluster: 'emotional-stability', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What emotional stability actually means', 'Why it feels out of reach after overload', 'Non-clinical framework for building it', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'how-to-respond-instead-of-react', keyword: 'how to respond instead of react', titulo: 'How to Respond Instead of React', intencao: 'informational', cluster: 'emotional-stability', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'The difference between reacting and responding', 'Why reactive patterns take over', 'Non-clinical framework for building a pause', 'What rebuilding can involve', 'Internal links', 'CTA: community'] },
  { slug: 'building-emotional-resilience', keyword: 'building emotional resilience', titulo: 'Building Emotional Resilience', intencao: 'informational', cluster: 'emotional-stability', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What resilience coaching actually involves', 'Why resilience is built, not innate', 'Non-clinical framework', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'how-to-feel-grounded', keyword: 'how to feel grounded', titulo: 'How to Feel Grounded Again', intencao: 'informational', cluster: 'emotional-stability', precisaDisclaimerClinico: false, pauta: ['Empathetic opening', 'What feeling ungrounded is usually about', 'Non-clinical grounding framework', 'What rebuilding can involve', 'Internal links', 'CTA: consultation'] },
  { slug: 'why-do-i-feel-empty', keyword: 'why do I feel empty', titulo: 'Why Do I Feel Empty?', intencao: 'informational', cluster: 'emotional-stability', precisaDisclaimerClinico: true, pauta: ['Empathetic, careful opening', 'What emotional emptiness can feel like (feeling empty, no motivation)', 'Why it develops after prolonged overload', 'Non-clinical framework for rebuilding responsiveness', 'What rebuilding can involve', 'When professional clinical care may be appropriate (hopelessness, sadness that will not go away) + crisis resource', 'Internal links', 'CTA: consultation'] },
  { slug: 'how-do-i-get-motivated-again', keyword: 'how do I get motivated again', titulo: 'How Do I Get Motivated Again?', intencao: 'informational', cluster: 'emotional-stability', precisaDisclaimerClinico: true, pauta: ['Empathetic opening', 'Why motivation disappears (overload, numbness)', 'Non-clinical framework for rebuilding it gradually', 'What rebuilding can involve', 'When professional clinical care may be appropriate (depression symptoms, depression treatment) + crisis resource', 'Internal links', 'CTA: consultation'] },
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildPrompt(item) {
  const clinicalStep = item.precisaDisclaimerClinico
    ? `8. "When professional clinical care may be appropriate" — REQUIRED. Name the specific clinical terms relevant here (from the pauta) and clearly state that non-clinical coaching is not a substitute for licensed care. If the topic touches hopelessness, emptiness, PTSD, or trauma, explicitly include the 988 Suicide & Crisis Lifeline (U.S.) as a crisis resource.`
    : '8. Briefly note, where relevant, that this content is educational and non-clinical, without needing a full crisis-resource section.'

  return `You are writing for Sal Ray's blog — an Emotional & Life Rebuilding Specialist and non-clinical coach (never a therapist, psychologist, or medical provider). Write in a calm, first-person voice consistent with Sal's brand.

Write a complete article: "${item.titulo}"
Primary keyword / search intent: ${item.keyword}
Cluster: ${item.cluster}
Outline to cover (one H2 per topic): ${item.pauta.join(', ')}

Mandatory rules:
1. First paragraph answers the search intent directly in 2-3 sentences (must work if quoted alone by an AI answer engine).
2. H1/H2s use natural search-style phrasing.
3. Never diagnose, treat, or claim to cure any condition. Never present hypnosis or coaching as medical treatment.
4. Use **bold** for key terms and verifiable claims.
5. Include a CTA link partway through the article and another near the end, using the format [Schedule an Initial Consultation](#consultation) or [Join the private community](#community) depending on intent (${item.intencao === 'informational' ? 'use whichever fits the content — consultation for higher-intent topics, community for lighter ones' : item.intencao}).
${clinicalStep}
9. Include 2-3 internal links to related articles as plain text placeholders like [related article title](#related) — do not invent real slugs.
10. End the body with "## Frequently Asked Questions" (no questions here — those go in the separate "faq" field).
11. Include an author bio + non-clinical disclaimer as the final short paragraph before the FAQ heading.

Respond with ONLY valid JSON, no surrounding markdown, in this exact shape:
{
  "title": "string, max 110 characters",
  "excerpt": "string, max 155 characters, direct answer to the search intent",
  "content": "string in simplified markdown (## , ### , **bold**, [text](link), tables using | |)",
  "faq": [{ "question": "string", "answer": "string, 80-120 words, self-contained" }],
  "relatedArticles": []
}`
}

async function generateArticle(client, item) {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [{ role: 'user', content: buildPrompt(item) }],
  })

  const textBlock = message.content.find((block) => block.type === 'text')
  if (!textBlock) throw new Error('API response had no text block')

  const parsed = JSON.parse(textBlock.text)

  return {
    slug: item.slug,
    cluster: item.cluster,
    keyword: item.keyword,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    ogImage: '/images/og/og-default.jpg',
    needsProfessionalCareNote: item.precisaDisclaimerClinico,
    ...parsed,
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Set ANTHROPIC_API_KEY before running this script.')
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let generated = 0
  let skipped = 0

  for (const item of ARTICLE_QUEUE) {
    const outputPath = path.join(OUTPUT_DIR, `${item.slug}.json`)

    if (fs.existsSync(outputPath)) {
      console.log(`[skip] ${item.slug} already exists`)
      skipped++
      continue
    }

    console.log(`[generating] ${item.slug} (cluster: ${item.cluster}) ...`)
    try {
      const article = await generateArticle(client, item)
      fs.writeFileSync(outputPath, JSON.stringify(article, null, 2), 'utf-8')
      console.log(`[ok] ${item.slug} written to content/generated-articles/`)
      generated++
    } catch (error) {
      console.error(`[error] ${item.slug}:`, error.message)
    }

    await sleep(DELAY_BETWEEN_CALLS_MS)
  }

  console.log(`\nDone. Generated: ${generated}. Skipped (already existed): ${skipped}.`)
  console.log(`Total queue size: ${ARTICLE_QUEUE.length} articles across 6 clusters.`)
}

main().catch((error) => {
  console.error('Error running generate-articles.js:', error.message)
  process.exit(1)
})
