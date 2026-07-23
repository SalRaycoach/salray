/**
 * Gera os artigos complementares do módulo de blog (10 pilares × 10 artigos
 * cada = 100 complementares). Os 10 pilares e 6 complementares iniciais já
 * estão escritos à mão em lib/resources.ts — esta fila cobre os 96
 * complementares restantes (100 nomeados no brief, menos 4 já cobertos por
 * artigos existentes com título quase idêntico, ver notas inline).
 *
 * Grava um .json por slug em content/generated-articles/ — lib/resources.ts
 * carrega esses arquivos automaticamente via loadGeneratedArticles().
 *
 * Uso:
 *   export ANTHROPIC_API_KEY="sk-ant-..."
 *   npm run generate:blog                                    → todos os clusters
 *   npm run generate:blog -- --cluster=overthinking-emotional-overload
 *
 * Cada artigo gerado passa pelo mesmo checklist de scripts/qa-articles.js
 * (compartilhado via scripts/lib/article-qa.js) ANTES de ser gravado em
 * content/generated-articles/. Se falhar, é gravado em
 * content/generated-articles-needs-review/ em vez do diretório principal —
 * lib/resources.ts só carrega o diretório principal, então um artigo
 * reprovado nunca fica publicado silenciosamente. Rodar o script de novo
 * tenta regenerá-lo (não conta como "já existe").
 */

const fs = require('node:fs')
const path = require('node:path')
const Anthropic = require('@anthropic-ai/sdk')
const { validateArticle, deriveFieldsFromContent } = require('./lib/article-qa')

const OUTPUT_DIR = path.join(process.cwd(), 'content', 'generated-articles')
const NEEDS_REVIEW_DIR = path.join(process.cwd(), 'content', 'generated-articles-needs-review')
const RESOURCES_TS = path.join(process.cwd(), 'lib', 'resources.ts')
const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 8192
const DELAY_BETWEEN_CALLS_MS = 8000

const CLUSTER_FILTER = (process.argv.find((a) => a.startsWith('--cluster=')) || '').split('=')[1]

// tipo é sempre 'complementar' aqui — os 10 pilares já existem em lib/resources.ts.
// precisaDisclaimerClinico segue exatamente as marcações ⚠️ do brief original.
const ARTICLE_QUEUE = [
  // ==================== PILAR 1 — overthinking-racing-thoughts ====================
  // Item 1 já coberto por 'why-cant-i-stop-overthinking' (seed existente).
  { slug: 'why-is-my-brain-always-racing-at-night', keyword: 'why is my brain always racing at night', titulo: 'Why Is My Brain Always Racing at Night?', cluster: 'overthinking-emotional-overload', pillarSlug: 'overthinking-racing-thoughts', precisaDisclaimerClinico: false, pauta: ['Why nighttime removes daytime distractions', 'Decision fatigue by end of day', 'Practical wind-down structure', 'When to expect improvement'] },
  { slug: 'how-to-stop-worrying-about-things-you-cant-control', keyword: "how do I stop worrying about things I can't control", titulo: "How Do I Stop Worrying About Things I Can't Control?", cluster: 'overthinking-emotional-overload', pillarSlug: 'overthinking-racing-thoughts', precisaDisclaimerClinico: false, pauta: ['Difference between productive concern and worry', 'Identifying what is actually yours to control', 'A simple sorting exercise', 'Redirecting energy to next steps'] },
  { slug: 'how-to-calm-your-mind-without-forcing-relaxation', keyword: 'how to calm your mind without forcing relaxation', titulo: 'How to Calm Your Mind Without Forcing Yourself to "Just Relax"', cluster: 'overthinking-emotional-overload', pillarSlug: 'overthinking-racing-thoughts', precisaDisclaimerClinico: false, pauta: ['Why "just relax" backfires', 'Structured processing vs suppression', 'Writing the worry down', 'Setting a specific time to revisit it'] },
  { slug: 'constant-worry-vs-anxiety-difference', keyword: "constant worry vs anxiety what's the difference", titulo: "Constant Worry vs. Anxiety: What's the Difference?", cluster: 'overthinking-emotional-overload', pillarSlug: 'overthinking-racing-thoughts', precisaDisclaimerClinico: false, pauta: ['Worry as a thinking pattern', 'Anxiety\'s physical component', 'How they overlap', 'Why the distinction changes what helps'] },
  { slug: 'stress-management-habits-that-interrupt-overthinking', keyword: 'stress management habits that interrupt overthinking', titulo: 'Simple Stress Management Habits That Actually Interrupt Overthinking', cluster: 'overthinking-emotional-overload', pillarSlug: 'overthinking-racing-thoughts', precisaDisclaimerClinico: false, pauta: ['Naming the loop out loud', 'Keeping a worry list', 'Physical resets (walk, room change, breathing)', 'Why consistency matters more than intensity'] },
  { slug: 'why-overthinking-gets-worse-when-tired-overwhelmed', keyword: 'why overthinking gets worse when tired or overwhelmed', titulo: "Why Overthinking Gets Worse When You're Tired or Overwhelmed", cluster: 'overthinking-emotional-overload', pillarSlug: 'overthinking-racing-thoughts', precisaDisclaimerClinico: false, pauta: ['Mental fatigue and risk perception', 'Why rest is not indulgent', 'Recognizing the fatigue-overthinking loop', 'Practical recovery habits'] },
  { slug: 'how-to-calm-anxiety-in-the-moment', keyword: 'how to calm anxiety in the moment', titulo: 'How to Calm Anxiety in the Moment: A Non-Clinical First-Step Guide', cluster: 'overthinking-emotional-overload', pillarSlug: 'overthinking-racing-thoughts', precisaDisclaimerClinico: true, pauta: ['Slow exhale technique', 'Grounding with senses', 'Naming discomfort vs danger', 'When in-the-moment tools are not enough — when professional clinical care may be appropriate'] },
  { slug: 'what-anxiety-relief-actually-looks-like', keyword: 'what anxiety relief actually looks like', titulo: 'What Anxiety Relief Actually Looks Like Beyond Quick Fixes', cluster: 'overthinking-emotional-overload', pillarSlug: 'overthinking-racing-thoughts', precisaDisclaimerClinico: true, pauta: ['Quick fixes vs lasting change', 'Understanding what anxiety protects against', 'Building structure and self-trust', 'When professional clinical care may be appropriate'] },
  { slug: 'overthinking-at-work-why-it-happens', keyword: 'overthinking at work why it happens', titulo: 'Overthinking at Work: Why It Happens and What Helps', cluster: 'overthinking-emotional-overload', pillarSlug: 'overthinking-racing-thoughts', precisaDisclaimerClinico: false, pauta: ['Fear of judgment or irreversible mistakes', 'Preparation vs rumination', 'Setting an "enough thinking" cutoff', 'Practical workplace habits'] },

  // ==================== PILAR 2 — anxiety-symptoms-chronic-anxiety (cluster inteiro ⚠️) ====================
  { slug: 'why-am-i-anxious-all-the-time', keyword: 'why am I anxious all the time', titulo: 'Why Am I Anxious All the Time? Understanding the Pattern', cluster: 'overthinking-emotional-overload', pillarSlug: 'anxiety-symptoms-chronic-anxiety', precisaDisclaimerClinico: true, pauta: ['Nervous system stuck on alert', 'Ongoing stress vs specific threat', 'Non-clinical framework for baseline anxiety', 'When professional clinical care may be appropriate'] },
  { slug: 'why-do-i-feel-anxious-for-no-reason', keyword: 'why do I feel anxious for no reason', titulo: 'Why Do I Feel Anxious for No Reason?', cluster: 'overthinking-emotional-overload', pillarSlug: 'anxiety-symptoms-chronic-anxiety', precisaDisclaimerClinico: true, pauta: ['Anxiety without an obvious trigger', 'Accumulated smaller stressors', 'Lowered threshold from overload', 'When professional clinical care may be appropriate'] },
  { slug: 'why-do-i-wake-up-anxious-every-morning', keyword: 'why do I wake up anxious every morning', titulo: 'Why Do I Wake Up Anxious Every Morning?', cluster: 'overthinking-emotional-overload', pillarSlug: 'anxiety-symptoms-chronic-anxiety', precisaDisclaimerClinico: true, pauta: ['Morning cortisol rise', 'Lack of structure right at waking', 'Morning routine adjustments', 'When professional clinical care may be appropriate'] },
  { slug: 'can-anxiety-make-you-feel-physically-sick', keyword: 'can anxiety make you feel physically sick', titulo: 'Can Anxiety Make You Feel Physically Sick?', cluster: 'overthinking-emotional-overload', pillarSlug: 'anxiety-symptoms-chronic-anxiety', precisaDisclaimerClinico: true, pauta: ['Stress response and physical symptoms', 'Nausea, tension, chest tightness', 'When to rule out medical causes', 'When professional clinical care may be appropriate'] },
  { slug: 'can-anxiety-go-away-naturally', keyword: 'can anxiety go away naturally or does it need support', titulo: 'Can Anxiety Go Away Naturally, or Does It Need Support?', cluster: 'overthinking-emotional-overload', pillarSlug: 'anxiety-symptoms-chronic-anxiety', precisaDisclaimerClinico: true, pauta: ['Situational vs chronic anxiety', 'Why waiting rarely resolves chronic anxiety', 'Options: coaching, lifestyle change, clinical treatment', 'When professional clinical care may be appropriate'] },
  { slug: 'chronic-vs-severe-anxiety-signs', keyword: 'chronic vs severe anxiety recognizing the signs', titulo: 'Chronic vs. Severe Anxiety: Recognizing the Signs', cluster: 'overthinking-emotional-overload', pillarSlug: 'anxiety-symptoms-chronic-anxiety', precisaDisclaimerClinico: true, pauta: ['Duration vs intensity', 'How they can overlap or not', 'Self-recognition without self-diagnosis', 'When professional clinical care may be appropriate'] },
  { slug: 'social-anxiety-beyond-shyness', keyword: 'social anxiety what it feels like beyond shyness', titulo: 'Social Anxiety: What It Feels Like Beyond Shyness', cluster: 'overthinking-emotional-overload', pillarSlug: 'anxiety-symptoms-chronic-anxiety', precisaDisclaimerClinico: true, pauta: ['Fear of judgment vs introversion', 'Physical symptoms in social settings', 'Avoidance and post-event replay', 'When professional clinical care may be appropriate'] },
  { slug: 'panic-attacks-vs-panic-disorder', keyword: "panic attacks vs panic disorder what's the difference", titulo: "Panic Attacks vs. Panic Disorder: What's the Difference?", cluster: 'overthinking-emotional-overload', pillarSlug: 'anxiety-symptoms-chronic-anxiety', precisaDisclaimerClinico: true, pauta: ['Defining a single panic attack', 'Panic disorder as recurring pattern + fear of recurrence', 'Why one attack does not equal disorder', 'When professional clinical care may be appropriate + crisis resource'] },
  { slug: 'what-anxiety-therapy-and-coaching-can-offer', keyword: 'what anxiety therapy and coaching can and cannot offer', titulo: "What Anxiety Therapy and Coaching Can (and Can't) Offer", cluster: 'overthinking-emotional-overload', pillarSlug: 'anxiety-symptoms-chronic-anxiety', precisaDisclaimerClinico: true, pauta: ['What licensed therapy provides (diagnosis, CBT, medication)', 'What non-clinical coaching provides', 'Why they can work together', 'When professional clinical care may be appropriate'] },
  { slug: 'generalized-anxiety-daily-pattern', keyword: 'generalized anxiety when worry becomes a daily pattern', titulo: 'Generalized Anxiety: When Worry Becomes a Daily Pattern', cluster: 'overthinking-emotional-overload', pillarSlug: 'anxiety-symptoms-chronic-anxiety', precisaDisclaimerClinico: true, pauta: ['Diffuse worry across many life areas', 'Duration and persistence markers', 'Non-clinical recognition vs diagnosis', 'When professional clinical care may be appropriate'] },

  // ==================== PILAR 3 — childhood-trauma-inner-child ====================
  { slug: 'can-childhood-trauma-affect-you-as-an-adult', keyword: 'can childhood trauma really affect you as an adult', titulo: 'Can Childhood Trauma Really Affect You as an Adult?', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'childhood-trauma-inner-child', precisaDisclaimerClinico: false, pauta: ['How early experiences shape adult patterns', 'Nervous system and belief formation in childhood', 'Common adult manifestations', 'Non-clinical framework for recognizing it'] },
  { slug: 'signs-of-unresolved-emotional-trauma', keyword: 'what are the signs of unresolved emotional trauma', titulo: 'What Are the Signs of Unresolved Emotional Trauma?', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'childhood-trauma-inner-child', precisaDisclaimerClinico: false, pauta: ['Disproportionate reactions', 'Persistent unease without clear cause', 'Trust difficulties', 'Avoidance patterns'] },
  { slug: 'what-is-inner-child-healing', keyword: 'what is inner child healing really', titulo: 'What Is Inner Child Healing, Really?', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'childhood-trauma-inner-child', precisaDisclaimerClinico: false, pauta: ['Defining "inner child" as a working concept', 'Not a literal regression', 'Recognizing old patterns being replayed', 'Responding as an adult vs a child would'] },
  { slug: 'how-childhood-wounds-show-up-in-adult-relationships', keyword: 'how childhood wounds show up in adult relationships', titulo: 'How Childhood Wounds Show Up in Adult Relationships', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'childhood-trauma-inner-child', precisaDisclaimerClinico: false, pauta: ['Old dynamics activated in closeness', 'Difficulty asking for needs', 'Assuming the worst in silence', 'Feeling unsafe with stability'] },
  { slug: 'emotional-pain-without-a-clear-cause', keyword: "emotional pain that doesn't have a clear cause", titulo: "Emotional Pain That Doesn't Have a Clear Cause", cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'childhood-trauma-inner-child', precisaDisclaimerClinico: false, pauta: ['Present situations echoing old patterns', 'Why the connection is not always conscious', 'The pain is still real', 'Tracing pain back to its pattern'] },
  { slug: 'why-childhood-patterns-feel-impossible-to-break', keyword: 'why some childhood patterns feel impossible to break', titulo: 'Why Some Childhood Patterns Feel Impossible to Break', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'childhood-trauma-inner-child', precisaDisclaimerClinico: false, pauta: ['Automaticity of early, reinforced patterns', 'Why insight alone is not enough', 'Deliberate practice of new responses', 'Realistic timelines for change'] },
  { slug: 'remembering-vs-reliving-childhood-pain', keyword: 'the difference between remembering and reliving childhood pain', titulo: 'The Difference Between Remembering and Reliving Childhood Pain', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'childhood-trauma-inner-child', precisaDisclaimerClinico: false, pauta: ['Remembering with emotional distance', 'Reliving as re-experiencing intensity', 'Why reliving may need clinical support', 'Self-check for which one you are experiencing'] },
  { slug: 'how-to-begin-healing-childhood-wounds', keyword: 'how to begin healing childhood wounds as an adult', titulo: 'How to Begin Healing Childhood Wounds as an Adult', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'childhood-trauma-inner-child', precisaDisclaimerClinico: false, pauta: ['Identifying one recurring reaction', 'Tracing it to its likely origin', 'Separating old context from current one', 'Practicing a different response'] },
  { slug: 'signs-you-were-parentified-as-a-child', keyword: 'signs you were parentified as a child', titulo: 'Signs You Were Parentified as a Child', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'childhood-trauma-inner-child', precisaDisclaimerClinico: false, pauta: ['Defining parentification', 'Emotional vs practical caretaking roles', 'Adult effects: guilt resting, over-responsibility', 'Recognizing and rebalancing the pattern'] },
  { slug: 'healing-childhood-trauma-without-blaming-parents', keyword: "why healing childhood trauma isn't about blaming your parents", titulo: "Why Healing Childhood Trauma Isn't About Blaming Your Parents", cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'childhood-trauma-inner-child', precisaDisclaimerClinico: false, pauta: ['Understanding vs blaming', 'Parents\' own limitations and context', 'Focus on what you do with the pattern now', 'Healing without requiring anyone else to change'] },

  // ==================== PILAR 4 — unresolved-trauma-recovery (⚠️) ====================
  { slug: 'how-do-i-know-if-i-have-unresolved-trauma', keyword: 'how do I know if I have unresolved trauma', titulo: 'How Do I Know If I Have Unresolved Trauma?', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'unresolved-trauma-recovery', precisaDisclaimerClinico: true, pauta: ['Disproportionate reactions', 'Persistent vigilance', 'Trust in your own perception', 'When professional clinical care may be appropriate'] },
  { slug: 'why-cant-i-let-go-of-the-past', keyword: "why can't I let go of the past", titulo: "Why Can't I Let Go of the Past?", cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'unresolved-trauma-recovery', precisaDisclaimerClinico: true, pauta: ['Misunderstanding "letting go" as forgetting', 'Acknowledgment before release', 'Why forcing it backfires', 'When professional clinical care may be appropriate'] },
  { slug: 'what-trauma-recovery-looks-like-day-to-day', keyword: 'what trauma recovery actually looks like day to day', titulo: 'What Trauma Recovery Actually Looks Like Day to Day', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'unresolved-trauma-recovery', precisaDisclaimerClinico: true, pauta: ['Non-linear process', 'Noticing triggers earlier over time', 'Setbacks as normal, not failure', 'When professional clinical care may be appropriate'] },
  { slug: 'non-clinical-signs-associated-with-ptsd', keyword: 'common non-clinical signs associated with PTSD', titulo: 'Common (Non-Clinical) Signs Associated with PTSD', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'unresolved-trauma-recovery', precisaDisclaimerClinico: true, pauta: ['Educational overview only, not diagnostic', 'Intrusive memories, avoidance, startle response', 'Negative beliefs following trauma', 'When professional clinical care may be appropriate + crisis resource'] },
  { slug: 'trauma-healing-coaching-vs-therapy', keyword: 'trauma healing what coaching can support vs what needs therapy', titulo: 'Trauma Healing: What Coaching Can Support vs. What Needs Therapy', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'unresolved-trauma-recovery', precisaDisclaimerClinico: true, pauta: ['Coaching: daily stability, pattern recognition', 'Therapy: processing traumatic memories, diagnosis', 'Why trauma-focused treatment needs a clinician', 'When professional clinical care may be appropriate'] },
  { slug: 'why-some-people-feel-fine-but-carry-trauma', keyword: 'why some people feel fine but still carry unresolved trauma', titulo: 'Why Some People Feel "Fine" but Still Carry Unresolved Trauma', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'unresolved-trauma-recovery', precisaDisclaimerClinico: true, pauta: ['High outward functioning masking internal patterns', 'Hypervigilance and numbness under the surface', 'What surfaces it (intimacy, specific stress)', 'When professional clinical care may be appropriate'] },
  { slug: 'bodys-reaction-to-old-trauma', keyword: "the body's reaction to old trauma why it doesn't just go away", titulo: 'The Body\'s Reaction to Old Trauma: Why It Doesn\'t Just "Go Away"', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'unresolved-trauma-recovery', precisaDisclaimerClinico: true, pauta: ['Trauma as a learned bodily response', 'Physical sensations without present danger', 'Body\'s timeline vs mind\'s timeline', 'When professional clinical care may be appropriate'] },
  { slug: 'how-unresolved-trauma-shapes-daily-decisions', keyword: 'how unresolved trauma quietly shapes daily decisions', titulo: 'How Unresolved Trauma Quietly Shapes Daily Decisions', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'unresolved-trauma-recovery', precisaDisclaimerClinico: true, pauta: ['Avoiding vulnerability-based opportunities', 'Over-preparing to avoid surprise', 'Choosing "safer" smaller options', 'When professional clinical care may be appropriate'] },
  { slug: 'when-to-seek-clinical-support-for-trauma', keyword: 'when to seek clinical support for trauma vs coaching support', titulo: 'When to Seek Clinical Support for Trauma vs. Coaching Support', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'unresolved-trauma-recovery', precisaDisclaimerClinico: true, pauta: ['Red flags requiring a licensed clinician', 'What coaching can complement', 'How to find trauma-informed care', 'Crisis resource for immediate danger'] },

  // ==================== PILAR 5 — toxic-relationships-abuse-patterns ====================
  // Item 1 já coberto por 'why-do-i-attract-toxic-relationships' (seed existente).
  { slug: 'why-cant-i-leave-a-toxic-relationship', keyword: "why can't I leave a toxic relationship even when I want to", titulo: "Why Can't I Leave a Toxic Relationship, Even When I Want To?", cluster: 'relationships-boundaries', pillarSlug: 'toxic-relationships-abuse-patterns', precisaDisclaimerClinico: false, pauta: ['Eroded self-trust', 'Trauma bonds', 'Practical entanglements and fear', 'Wanting vs being able to leave safely'] },
  { slug: 'why-do-i-attract-toxic-people-pattern', keyword: 'why do I attract toxic people understanding the pattern', titulo: 'Why Do I Attract Toxic People? Understanding the Pattern', cluster: 'relationships-boundaries', pillarSlug: 'toxic-relationships-abuse-patterns', precisaDisclaimerClinico: false, pauta: ['Pattern across multiple relationship types', 'Boundaries and self-worth connection', 'What "normal" was shaped by', 'Distinguishing pattern from bad luck'] },
  { slug: 'signs-of-narcissistic-abuse-easy-to-miss', keyword: 'signs of narcissistic abuse that are easy to miss', titulo: 'Signs of Narcissistic Abuse That Are Easy to Miss', cluster: 'relationships-boundaries', pillarSlug: 'toxic-relationships-abuse-patterns', precisaDisclaimerClinico: false, pauta: ['Minimizing your feelings', 'Blame-shifting after conflict', 'Idealization-devaluation cycling', 'Educational only — not legal or safety advice'] },
  { slug: 'what-emotional-abuse-can-look-like', keyword: "what emotional abuse can look like when it's not obvious", titulo: "What Emotional Abuse Can Look Like When It's Not Obvious", cluster: 'relationships-boundaries', pillarSlug: 'toxic-relationships-abuse-patterns', precisaDisclaimerClinico: false, pauta: ['Chronic criticism disguised as honesty', 'Control framed as care', 'Erosion of self vs one-time conflict', 'Educational only — not legal or safety advice'] },
  { slug: 'relationship-trauma-shapes-future-relationships', keyword: 'relationship trauma how past relationships shape future ones', titulo: 'Relationship Trauma: How Past Relationships Shape Future Ones', cluster: 'relationships-boundaries', pillarSlug: 'toxic-relationships-abuse-patterns', precisaDisclaimerClinico: false, pauta: ['Heightened vigilance for warning signs', 'Difficulty trusting healthy partners', 'Bracing for harm that has not reappeared', 'Rebuilding calibration over time'] },
  { slug: 'why-toxic-relationships-feel-familiar', keyword: 'why toxic relationships can feel familiar instead of wrong', titulo: 'Why Toxic Relationships Can Feel Familiar Instead of Wrong', cluster: 'relationships-boundaries', pillarSlug: 'toxic-relationships-abuse-patterns', precisaDisclaimerClinico: false, pauta: ['Familiarity vs safety', 'Echoes of earlier instability', 'Nervous system conflating the two', 'Learning to distinguish them'] },
  { slug: 'cycle-of-idealization-and-devaluation', keyword: 'the cycle of idealization and devaluation explained simply', titulo: 'The Cycle of Idealization and Devaluation, Explained Simply', cluster: 'relationships-boundaries', pillarSlug: 'toxic-relationships-abuse-patterns', precisaDisclaimerClinico: false, pauta: ['Idealization phase', 'Devaluation phase', 'Hoovering / pull-back-in phase', 'Naming the cycle as a pattern'] },
  { slug: 'rebuilding-self-trust-after-a-toxic-relationship', keyword: 'rebuilding self-trust after a toxic relationship', titulo: 'Rebuilding Self-Trust After a Toxic Relationship', cluster: 'relationships-boundaries', pillarSlug: 'toxic-relationships-abuse-patterns', precisaDisclaimerClinico: false, pauta: ['Broad self-doubt after a toxic relationship', 'Small independent decisions as evidence', 'Gradual trust rebuilding', 'Patience with the process'] },
  { slug: 'when-to-seek-professional-support-after-abuse', keyword: 'when to seek professional support after abuse', titulo: 'When to Seek Professional Support After Abuse', cluster: 'relationships-boundaries', pillarSlug: 'toxic-relationships-abuse-patterns', precisaDisclaimerClinico: true, pauta: ['Signs professional support is needed', 'Licensed therapists and domestic violence resources', 'Coaching as a complement, not a substitute', 'Crisis resource for immediate danger'] },

  // ==================== PILAR 6 — attachment-trust-boundaries ====================
  { slug: 'why-do-i-fear-abandonment-in-healthy-relationships', keyword: 'why do I fear abandonment even in healthy relationships', titulo: 'Why Do I Fear Abandonment, Even in Healthy Relationships?', cluster: 'relationships-boundaries', pillarSlug: 'attachment-trust-boundaries', precisaDisclaimerClinico: false, pauta: ['Fear persisting independent of present evidence', 'Earlier experiences of loss or inconsistency', 'Normal independence triggering old fear', 'Updating the pattern with new evidence'] },
  { slug: 'why-do-i-sabotage-relationships-going-well', keyword: 'why do I always sabotage relationships that are going well', titulo: 'Why Do I Always Sabotage Relationships That Are Going Well?', cluster: 'relationships-boundaries', pillarSlug: 'attachment-trust-boundaries', precisaDisclaimerClinico: false, pauta: ['Fear that closeness increases loss', 'Belief that good things do not last', 'Creating distance for a sense of control', 'Interrupting the pattern deliberately'] },
  { slug: 'how-to-rebuild-trust-after-its-broken', keyword: "how do I rebuild trust after it's been broken", titulo: "How Do I Rebuild Trust After It's Been Broken?", cluster: 'relationships-boundaries', pillarSlug: 'attachment-trust-boundaries', precisaDisclaimerClinico: false, pauta: ['Trust rebuilding through consistent action', 'Clarifying what you need to see', 'Communicating needs clearly', 'Realistic pacing'] },
  { slug: 'relationship-anxiety-why-good-relationships-feel-unsafe', keyword: 'relationship anxiety why good relationships can still feel unsafe', titulo: 'Relationship Anxiety: Why Good Relationships Can Still Feel Unsafe', cluster: 'relationships-boundaries', pillarSlug: 'attachment-trust-boundaries', precisaDisclaimerClinico: false, pauta: ['Learned expectation of instability', 'Objective stability vs felt safety', 'Updating the expectation through experience', 'Practical grounding tools'] },
  { slug: 'what-trust-issues-really-come-from', keyword: 'what trust issues really come from', titulo: 'What Trust Issues Really Come From', cluster: 'relationships-boundaries', pillarSlug: 'attachment-trust-boundaries', precisaDisclaimerClinico: false, pauta: ['Specific origin experiences', 'Not a fixed personality trait', 'Naming the origin as clarifying, not curative', 'Rebuilding gradually'] },
  { slug: 'codependency-where-caring-ends-losing-yourself-begins', keyword: 'codependency where caring ends and losing yourself begins', titulo: 'Codependency: Where Caring Ends and Losing Yourself Begins', cluster: 'relationships-boundaries', pillarSlug: 'attachment-trust-boundaries', precisaDisclaimerClinico: false, pauta: ['Defining codependency', 'Self-worth tied to managing another person', 'Healthy care vs codependent care', 'Rebalancing the relationship'] },
  { slug: 'breakup-recovery-why-some-are-harder', keyword: 'breakup recovery why some breakups are harder to move past', titulo: 'Breakup Recovery: Why Some Breakups Are Harder to Move Past', cluster: 'relationships-boundaries', pillarSlug: 'attachment-trust-boundaries', precisaDisclaimerClinico: false, pauta: ['What the relationship represented, not just its length', 'Echoes of earlier losses', 'Ambiguous endings without closure', 'A structured recovery approach'] },
  { slug: 'how-to-set-emotional-boundaries-without-guilt', keyword: 'how to set emotional boundaries without guilt', titulo: 'How to Set Emotional Boundaries Without Guilt', cluster: 'relationships-boundaries', pillarSlug: 'attachment-trust-boundaries', precisaDisclaimerClinico: false, pauta: ['Why boundaries feel uncomfortable at first', 'Practicing in lower-stakes situations', 'Boundaries as information, not demands', 'Building tolerance for discomfort'] },
  { slug: 'anxious-attachment-recognizing-the-pattern', keyword: 'anxious attachment recognizing the pattern without labeling yourself', titulo: 'Anxious Attachment: Recognizing the Pattern Without Labeling Yourself', cluster: 'relationships-boundaries', pillarSlug: 'attachment-trust-boundaries', precisaDisclaimerClinico: false, pauta: ['Defining anxious attachment as a pattern', 'Not a permanent identity', 'Common triggers', 'Practical self-soothing tools'] },
  { slug: 'repeating-your-parents-relationship-patterns', keyword: "how to know if you're repeating your parents' relationship patterns", titulo: "How to Know If You're Repeating Your Parents' Relationship Patterns", cluster: 'relationships-boundaries', pillarSlug: 'attachment-trust-boundaries', precisaDisclaimerClinico: false, pauta: ['Recognizing familiar dynamics in hindsight', 'Comparing current relationship shape to caregiving relationships', 'Without judgment or blame', 'Choosing a different pattern going forward'] },

  // ==================== PILAR 7 — depression-numbness-burnout (⚠️) ====================
  { slug: 'why-do-i-feel-empty-even-when-life-looks-fine', keyword: 'why do I feel empty even when life looks fine', titulo: 'Why Do I Feel Empty, Even When Life Looks Fine?', cluster: 'emotional-stability', pillarSlug: 'depression-numbness-burnout', precisaDisclaimerClinico: true, pauta: ['Disconnect between how life looks and feels', 'Prolonged overload or unresolved grief', 'Loss of meaningful direction', 'When professional clinical care may be appropriate'] },
  { slug: 'why-dont-i-enjoy-anything-anymore', keyword: "why don't I enjoy anything anymore", titulo: "Why Don't I Enjoy Anything Anymore?", cluster: 'emotional-stability', pillarSlug: 'depression-numbness-burnout', precisaDisclaimerClinico: true, pauta: ['Anhedonia as a recognizable pattern', 'Gradual development after sustained stress', 'Taking it seriously, not dismissing it as a phase', 'When professional clinical care may be appropriate'] },
  { slug: 'how-to-get-motivated-again', keyword: 'how do I get motivated again when nothing feels worth it', titulo: 'How Do I Get Motivated Again When Nothing Feels Worth It?', cluster: 'emotional-stability', pillarSlug: 'depression-numbness-burnout', precisaDisclaimerClinico: true, pauta: ['Gradual return, not instant fix', 'Small low-pressure actions', 'Addressing underlying depletion', 'When professional clinical care may be appropriate'] },
  { slug: 'common-signs-associated-with-depression', keyword: 'common signs associated with depression non-diagnostic overview', titulo: 'Common Signs Associated with Depression (Non-Diagnostic Overview)', cluster: 'emotional-stability', pillarSlug: 'depression-numbness-burnout', precisaDisclaimerClinico: true, pauta: ['Educational overview, not a diagnostic tool', 'Mood, interest, sleep, appetite, concentration changes', 'Why only a clinician can diagnose', 'When professional clinical care may be appropriate'] },
  { slug: 'sadness-that-wont-go-away', keyword: "sadness that won't go away when to pay closer attention", titulo: "Sadness That Won't Go Away: When to Pay Closer Attention", cluster: 'emotional-stability', pillarSlug: 'depression-numbness-burnout', precisaDisclaimerClinico: true, pauta: ['Situational vs persistent sadness', 'Two-week duration marker', 'Accompanying changes to watch for', 'When professional clinical care may be appropriate'] },
  { slug: 'understanding-hopelessness-without-minimizing', keyword: 'hopelessness understanding the pattern without minimizing it', titulo: 'Hopelessness: Understanding the Pattern Without Minimizing It', cluster: 'emotional-stability', pillarSlug: 'depression-numbness-burnout', precisaDisclaimerClinico: true, pauta: ['Hopelessness as a significant signal', 'Belief that nothing will change', 'Taking it seriously immediately', 'When professional clinical care may be appropriate + crisis resource'] },
  { slug: 'burnout-recovery-why-rest-alone-isnt-enough', keyword: "burnout recovery why rest alone doesn't always fix it", titulo: "Burnout Recovery: Why Rest Alone Doesn't Always Fix It", cluster: 'emotional-stability', pillarSlug: 'depression-numbness-burnout', precisaDisclaimerClinico: true, pauta: ['Burnout vs simple tiredness', 'Chronic overload without recovery or meaning', 'Addressing root causes, not just resting', 'When professional clinical care may be appropriate'] },
  { slug: 'coaching-vs-clinical-treatment-for-depression', keyword: 'what coaching can support vs what requires clinical treatment for depression', titulo: 'What Coaching Can Support vs. What Requires Clinical Treatment for Depression', cluster: 'emotional-stability', pillarSlug: 'depression-numbness-burnout', precisaDisclaimerClinico: true, pauta: ['Coaching: structure, overload, motivation rebuilding', 'What coaching cannot do: diagnose or treat depression', 'Why clinical treatment is necessary for depression', 'When professional clinical care may be appropriate'] },
  { slug: 'emotional-numbness-as-a-protection-mechanism', keyword: 'emotional numbness as a protection mechanism not a flaw', titulo: 'Emotional Numbness as a Protection Mechanism, Not a Flaw', cluster: 'emotional-stability', pillarSlug: 'depression-numbness-burnout', precisaDisclaimerClinico: true, pauta: ['Numbness as nervous system protection', 'Not a sign of not caring', 'Reconnecting with feeling gradually', 'When professional clinical care may be appropriate'] },

  // ==================== PILAR 8 — self-worth-self-esteem-failure ====================
  { slug: 'why-dont-i-feel-good-enough-no-matter-what-i-achieve', keyword: "why don't I feel good enough no matter what I achieve", titulo: "Why Don't I Feel Good Enough, No Matter What I Achieve?", cluster: 'self-trust-identity', pillarSlug: 'self-worth-self-esteem-failure', precisaDisclaimerClinico: false, pauta: ['Self-worth vs achievement as separate systems', 'Temporary relief from each accomplishment', 'Why the underlying pattern persists', 'Building worth independent of output'] },
  { slug: 'why-do-i-keep-doubting-myself', keyword: 'why do I keep doubting myself', titulo: 'Why Do I Keep Doubting Myself?', cluster: 'self-trust-identity', pillarSlug: 'self-worth-self-esteem-failure', precisaDisclaimerClinico: false, pauta: ['Origins in having judgment questioned', 'Second-guessing becoming automatic', 'Evidence-based rebuilding', 'Small decisions as practice'] },
  { slug: 'low-self-esteem-where-the-pattern-starts', keyword: 'low self-esteem where the pattern really starts', titulo: 'Low Self-Esteem: Where the Pattern Really Starts', cluster: 'self-trust-identity', pillarSlug: 'self-worth-self-esteem-failure', precisaDisclaimerClinico: false, pauta: ['Childhood messages about conditional worth', 'Praise tied mainly to achievement', 'Internal voice outliving its source', 'Updating the internal narrative'] },
  { slug: 'lack-of-confidence-vs-low-self-worth', keyword: "lack of confidence vs low self-worth what's the difference", titulo: "Lack of Confidence vs. Low Self-Worth: What's the Difference?", cluster: 'self-trust-identity', pillarSlug: 'self-worth-self-esteem-failure', precisaDisclaimerClinico: false, pauta: ['Confidence as skill-specific', 'Self-worth as inherent value', 'Why success does not resolve low self-worth', 'Addressing both separately'] },
  { slug: 'fear-of-failure-why-its-not-about-the-outcome', keyword: "fear of failure why it often isn't about the outcome", titulo: "Fear of Failure: Why It Often Isn't About the Outcome", cluster: 'self-trust-identity', pillarSlug: 'self-worth-self-esteem-failure', precisaDisclaimerClinico: false, pauta: ['Failure as confirmation of a deeper belief', 'Disproportionate fear relative to stakes', 'Separating outcome from self-worth', 'Practical reframing'] },
  { slug: 'impostor-syndrome-why-success-doesnt-silence-doubt', keyword: "impostor syndrome why success doesn't silence the doubt", titulo: "Impostor Syndrome: Why Success Doesn't Silence the Doubt", cluster: 'self-trust-identity', pillarSlug: 'self-worth-self-esteem-failure', precisaDisclaimerClinico: false, pauta: ['Belief system vs factual evidence', 'Reframing success as luck or timing', 'Why reassurance does not fully help', 'Building durable self-trust'] },
  { slug: 'how-self-worth-gets-built-or-broken-in-childhood', keyword: 'how self-worth gets built or broken in childhood', titulo: 'How Self-Worth Gets Built (or Broken) in Childhood', cluster: 'self-trust-identity', pillarSlug: 'self-worth-self-esteem-failure', precisaDisclaimerClinico: false, pauta: ['Consistency of caregiver response', 'Conditional vs unconditional worth', 'Long-term effects into adulthood', 'Rebuilding a more stable foundation'] },
  { slug: 'why-comparing-yourself-to-others-keeps-pattern-alive', keyword: 'why comparing yourself to others keeps the pattern alive', titulo: 'Why Comparing Yourself to Others Keeps the Pattern Alive', cluster: 'self-trust-identity', pillarSlug: 'self-worth-self-esteem-failure', precisaDisclaimerClinico: false, pauta: ['External, shifting standard', 'Why comparison never fully resolves', 'Redirecting to personal, internal benchmarks', 'Practical steps to reduce comparison'] },
  { slug: 'rebuilding-self-worth-without-relying-on-achievement', keyword: 'rebuilding self-worth without relying on achievement', titulo: 'Rebuilding Self-Worth Without Relying on Achievement', cluster: 'self-trust-identity', pillarSlug: 'self-worth-self-esteem-failure', precisaDisclaimerClinico: false, pauta: ['Practicing non-contingent self-regard', 'Valuing effort and character, not just outcomes', 'Separating value from daily output', 'Building over time'] },
  { slug: 'difference-between-confidence-and-self-trust', keyword: 'the difference between confidence and real self-trust', titulo: 'The Difference Between Confidence and Real Self-Trust', cluster: 'self-trust-identity', pillarSlug: 'self-worth-self-esteem-failure', precisaDisclaimerClinico: false, pauta: ['Confidence as task-specific', 'Self-trust as general and resilient', 'Why self-trust holds up better under uncertainty', 'Building both'] },

  // ==================== PILAR 9 — people-pleasing-perfectionism ====================
  { slug: 'why-do-i-seek-validation-from-everyone', keyword: 'why do I seek validation from everyone around me', titulo: 'Why Do I Seek Validation From Everyone Around Me?', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'people-pleasing-perfectionism', precisaDisclaimerClinico: false, pauta: ['Worth tied to external approval historically', 'Temporary relief from validation', 'Why it can never fully satisfy the need', 'Building internal validation instead'] },
  { slug: 'why-do-i-care-so-much-what-people-think', keyword: 'why do I care so much about what people think', titulo: 'Why Do I Care So Much About What People Think?', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'people-pleasing-perfectionism', precisaDisclaimerClinico: false, pauta: ['Normal social instinct vs disproportionate concern', 'Disapproval as confirmation of a deeper fear', 'Why ordinary feedback feels high-stakes', 'Recalibrating the stakes'] },
  { slug: 'how-to-stop-people-pleasing-without-feeling-selfish', keyword: 'how do I stop people-pleasing without feeling selfish', titulo: 'How Do I Stop People-Pleasing Without Feeling Selfish?', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'people-pleasing-perfectionism', precisaDisclaimerClinico: false, pauta: ['Reframing sustainability vs selfishness', 'Resentment building under compliance', 'Small boundary practice', 'A realistic pace of change'] },
  { slug: 'perfectionism-when-doing-your-best-becomes-a-trap', keyword: 'perfectionism when doing your best becomes a trap', titulo: 'Perfectionism: When "Doing Your Best" Becomes a Trap', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'people-pleasing-perfectionism', precisaDisclaimerClinico: false, pauta: ['Healthy effort vs perfectionism', 'Shifting standards', 'Mistakes feeling catastrophic', 'Recognizing when it prevents starting or finishing'] },
  { slug: 'self-sabotage-why-we-undermine-what-we-want', keyword: 'self-sabotage why we undermine the things we want most', titulo: 'Self-Sabotage: Why We Undermine the Things We Want Most', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'people-pleasing-perfectionism', precisaDisclaimerClinico: false, pauta: ['Hidden purpose of avoiding a bigger fear', 'Common contexts: relationships, goals nearing completion', 'Cost vs perceived protection', 'Interrupting the pattern'] },
  { slug: 'limiting-beliefs-the-quiet-rules-that-run-decisions', keyword: 'limiting beliefs the quiet rules that run your decisions', titulo: 'Limiting Beliefs: The Quiet Rules That Run Your Decisions', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'people-pleasing-perfectionism', precisaDisclaimerClinico: false, pauta: ['Unexamined rules shaping decisions', 'Common examples', 'Operating below conscious awareness', 'Identifying and testing your own'] },
  { slug: 'people-pleasing-as-a-learned-survival-skill', keyword: 'people-pleasing as a learned survival skill', titulo: 'People-Pleasing as a Learned Survival Skill', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'people-pleasing-perfectionism', precisaDisclaimerClinico: false, pauta: ['Strategy that once provided safety', 'Managing a volatile parent or unstable household', 'Understanding vs flaw framing', 'Consciously updating the strategy'] },
  { slug: 'why-saying-no-feels-physically-uncomfortable', keyword: 'why saying no can feel physically uncomfortable', titulo: 'Why Saying No Can Feel Physically Uncomfortable', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'people-pleasing-perfectionism', precisaDisclaimerClinico: false, pauta: ['Genuine stress response to disapproval', 'Nervous system treating it as a threat', 'Leftover response from earlier context', 'Building tolerance gradually'] },
  { slug: 'link-between-perfectionism-and-fear-of-rejection', keyword: 'the link between perfectionism and fear of rejection', titulo: 'The Link Between Perfectionism and Fear of Rejection', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'people-pleasing-perfectionism', precisaDisclaimerClinico: false, pauta: ['Perfectionism as an attempt to control perception', 'Flawlessness as protection from rejection', 'Intensifying under evaluation or visibility', 'Addressing the underlying fear directly'] },
  { slug: 'how-to-recognize-your-own-self-sabotage-pattern', keyword: 'how to recognize your own self-sabotage pattern', titulo: 'How to Recognize Your Own Self-Sabotage Pattern', cluster: 'emotional-patterns-self-sabotage', pillarSlug: 'people-pleasing-perfectionism', precisaDisclaimerClinico: false, pauta: ['Signature situations that trigger it', 'Tracking without self-judgment', 'Common patterns across relationships, work, goals', 'Using the pattern to predict and interrupt it'] },

  // ==================== PILAR 10 — life-direction-identity-starting-over ====================
  { slug: 'feeling-lost-in-life-what-it-usually-means', keyword: "feeling lost in life here's what that usually means", titulo: "Feeling Lost in Life? Here's What That Usually Means", cluster: 'life-direction-rebuilding', pillarSlug: 'life-direction-identity-starting-over', precisaDisclaimerClinico: false, pauta: ['Loss of familiar structures', 'Transitional, not permanent state', 'Common triggers', 'First steps toward clarity'] },
  { slug: 'why-do-i-feel-like-i-dont-know-my-purpose', keyword: "why do I feel like I don't know my purpose anymore", titulo: "Why Do I Feel Like I Don't Know My Purpose Anymore?", cluster: 'life-direction-rebuilding', pillarSlug: 'life-direction-identity-starting-over', precisaDisclaimerClinico: false, pauta: ['Purpose tied to a role that changed', 'Why it feels unclear after identity shifts', 'Purpose emerging gradually, not all at once', 'Practical next steps'] },
  { slug: 'identity-crisis-when-you-dont-recognize-your-life', keyword: 'identity crisis when you no longer recognize your own life', titulo: 'Identity Crisis: When You No Longer Recognize Your Own Life', cluster: 'life-direction-rebuilding', pillarSlug: 'life-direction-identity-starting-over', precisaDisclaimerClinico: false, pauta: ['Disruption to self-concept after major change', 'Internal identity lagging external change', 'Discomfort as temporary', 'Rebuilding identity around the change'] },
  { slug: 'life-transitions-why-change-feels-harder-40s-50s', keyword: 'life transitions why change feels harder in your 40s and 50s', titulo: 'Life Transitions: Why Change Feels Harder in Your 40s and 50s', cluster: 'life-direction-rebuilding', pillarSlug: 'life-direction-identity-starting-over', precisaDisclaimerClinico: false, pauta: ['Multiple simultaneous shifts at midlife', 'Physical, family, career, mortality factors', 'Lack of social permission to feel disoriented', 'Normalizing the experience'] },
  { slug: 'starting-over-emotionally-what-it-involves', keyword: 'starting over emotionally what it actually involves', titulo: 'Starting Over Emotionally: What It Actually Involves', cluster: 'life-direction-rebuilding', pillarSlug: 'life-direction-identity-starting-over', precisaDisclaimerClinico: false, pauta: ['Not discarding your whole history', 'Grieving what changed', 'Keeping what is still true', 'Building new structure sequentially'] },
  { slug: 'burnout-and-loss-of-direction', keyword: 'burnout and loss of direction how they feed each other', titulo: 'Burnout and Loss of Direction: How They Feed Each Other', cluster: 'life-direction-rebuilding', pillarSlug: 'life-direction-identity-starting-over', precisaDisclaimerClinico: false, pauta: ['Burnout eroding capacity to evaluate direction', 'Lack of direction contributing to burnout', 'Breaking the cycle', 'Sequencing recovery and reflection'] },
  { slug: 'feeling-lost-at-40-or-50-not-behind', keyword: "feeling lost at 40 or 50 you're not behind", titulo: "Feeling Lost at 40 or 50: You're Not Behind", cluster: 'life-direction-rebuilding', pillarSlug: 'life-direction-identity-starting-over', precisaDisclaimerClinico: false, pauta: ['No universal timeline for having life figured out', 'Common experience tied to real transitions', 'Reframing "behind" as a false standard', 'Practical reassurance and next steps'] },
  { slug: 'how-to-rebuild-direction-without-all-answers', keyword: 'how to rebuild direction without having all the answers first', titulo: 'How to Rebuild Direction Without Having All the Answers First', cluster: 'life-direction-rebuilding', pillarSlug: 'life-direction-identity-starting-over', precisaDisclaimerClinico: false, pauta: ['Clarifying the next season, not the whole future', 'One concrete reversible step', 'Clarity building through action', 'Avoiding the trap of waiting for certainty'] },
  { slug: 'why-big-life-changes-trigger-old-patterns', keyword: 'why big life changes trigger old emotional patterns', titulo: 'Why Big Life Changes Trigger Old Emotional Patterns', cluster: 'life-direction-rebuilding', pillarSlug: 'life-direction-identity-starting-over', precisaDisclaimerClinico: false, pauta: ['Disruption resembling earlier instability', 'Old fears and coping strategies reactivating', 'Separating old pattern from current requirement', 'Responding with present-day resources'] },
  { slug: 'rebuilding-your-life-without-starting-from-zero', keyword: 'what rebuilding your life looks like without starting from zero', titulo: 'What Rebuilding Your Life Looks Like Without Starting From Zero', cluster: 'life-direction-rebuilding', pillarSlug: 'life-direction-identity-starting-over', precisaDisclaimerClinico: false, pauta: ['Carrying forward what still holds value', 'Relationships, skills, values that remain', 'Updating what no longer fits', 'Realistic expectations for the process'] },
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getKnownSlugs() {
  const fullSrc = fs.readFileSync(RESOURCES_TS, 'utf-8')
  // Só considerar o array de artigos (seedArticles), não o array `clusters` —
  // ambos têm campos `slug:` com a mesma indentação (mesmo bug corrigido em qa-articles.js).
  const src = fullSrc.slice(fullSrc.indexOf('const seedArticles: Article[] = ['))
  const seedSlugs = [...src.matchAll(/^\s{4}slug: '([^']+)',/gm)].map((m) => m[1])

  const generatedSlugs = fs.existsSync(OUTPUT_DIR)
    ? fs
        .readdirSync(OUTPUT_DIR)
        .filter((f) => f.endsWith('.json'))
        .map((f) => f.replace(/\.json$/, ''))
    : []

  return new Set([...seedSlugs, ...generatedSlugs])
}

function buildPrompt(item) {
  const clinicalStep = item.precisaDisclaimerClinico
    ? `Include a clearly visible section (not buried at the end of a paragraph) titled "When professional clinical care may be appropriate" — name the specific clinical terms relevant here, state plainly that non-clinical coaching is not a substitute for licensed care, and if the topic touches hopelessness, prolonged emptiness, PTSD, or abuse, explicitly include the 988 Suicide & Crisis Lifeline (U.S.) as a crisis resource.`
    : 'Include a brief, visible note that this content is educational and non-clinical where relevant, without needing a full crisis-resource section.'

  return `You are writing for Sal Ray's blog — an Emotional & Life Rebuilding Specialist and non-clinical coach (never a therapist, psychologist, or medical provider). Write in a calm, direct, first-person-adjacent voice consistent with Sal's brand. This is a COMPLEMENTARY article (not a pillar) — narrower and shorter than a full guide.

Write a complete article: "${item.titulo}"
Primary keyword / search intent: ${item.keyword}
Cluster: ${item.cluster}
Parent pillar (complete guide) this article belongs to: ${item.pillarSlug}
Outline to cover (one H2 per topic, phrased as a natural search question): ${item.pauta.join(', ')}

Mandatory rules:
1. First paragraph answers the search intent directly in 2-3 sentences — must work if quoted alone by an AI answer engine.
2. H1 = the keyword/question almost verbatim. Every H2 is phrased as a natural search question, not an editorial title.
3. Never diagnose, treat, or claim to cure any condition. Never present hypnosis or coaching as medical treatment.
4. Bold 3-5 key terms or verifiable claims total — not more.
5. Length: 1200-1800 words.
6. Include at least 3 internal links: one to the parent pillar guide using [${item.pillarSlug}](#pillar), and two to sibling articles using [text](#related) placeholders — do not invent real slugs, just mark them as placeholders.
7. Include exactly one CTA link partway through and one near the end, using [Schedule an Initial Consultation](#consultation) or [Join the private community](#community) depending on fit.
8. ${clinicalStep}
9. End the body with "## Frequently Asked Questions" heading (no questions here — those go in the separate "faq" field).
10. Include a short author bio + non-clinical disclaimer as the final paragraph before the FAQ heading.

Respond with ONLY valid JSON, no surrounding markdown, in this exact shape:
{
  "title": "string, max 110 characters",
  "excerpt": "string, max 155 characters, direct answer to the search intent",
  "content": "string in simplified markdown (## , ### , **bold**, [text](link))",
  "faq": [{ "question": "string", "answer": "string, 80-120 words, self-contained" }] (3 to 4 items only)
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
    tipo: 'complementar',
    pillarSlug: item.pillarSlug,
    keyword: item.keyword,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    ogImage: '/images/og/og-default.jpg',
    needsProfessionalCareNote: item.precisaDisclaimerClinico,
    relatedArticles: [],
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

  let queue = ARTICLE_QUEUE
  if (CLUSTER_FILTER) {
    queue = queue.filter((item) => item.cluster === CLUSTER_FILTER)
    console.log(`Filtering to cluster: ${CLUSTER_FILTER} (${queue.length} article(s) in queue)\n`)
    if (queue.length === 0) {
      console.log('No queued items match that cluster slug. Check the spelling against lib/resources.ts clusters.')
      return
    }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let generated = 0
  let skipped = 0
  let quarantined = 0

  for (const item of queue) {
    const outputPath = path.join(OUTPUT_DIR, `${item.slug}.json`)

    if (fs.existsSync(outputPath)) {
      console.log(`[skip] ${item.slug} already exists`)
      skipped++
      continue
    }

    console.log(`[generating] ${item.slug} (pillar: ${item.pillarSlug}) ...`)
    try {
      const article = await generateArticle(client, item)

      // Gate: mesmo checklist de scripts/qa-articles.js, aplicado antes de publicar.
      const knownSlugs = getKnownSlugs()
      const normalized = {
        ...article,
        faqCount: (article.faq || []).length,
        ...deriveFieldsFromContent(article.content || ''),
      }
      const { errors, warnings } = validateArticle(normalized, knownSlugs)

      if (errors.length > 0) {
        if (!fs.existsSync(NEEDS_REVIEW_DIR)) fs.mkdirSync(NEEDS_REVIEW_DIR, { recursive: true })
        const reviewPath = path.join(NEEDS_REVIEW_DIR, `${item.slug}.json`)
        fs.writeFileSync(reviewPath, JSON.stringify(article, null, 2), 'utf-8')
        console.log(`[quarantined] ${item.slug} → content/generated-articles-needs-review/ (NOT published)`)
        errors.forEach((e) => console.log(`    ❌ ${e}`))
        quarantined++
      } else {
        fs.writeFileSync(outputPath, JSON.stringify(article, null, 2), 'utf-8')
        console.log(`[ok] ${item.slug} written to content/generated-articles/`)
        if (warnings.length > 0) warnings.forEach((w) => console.log(`    ⚠ ${w}`))
        generated++
      }
    } catch (error) {
      console.error(`[error] ${item.slug}:`, error.message)
    }

    await sleep(DELAY_BETWEEN_CALLS_MS)
  }

  console.log(`\nDone. Published: ${generated}. Quarantined (failed QA): ${quarantined}. Skipped (already existed): ${skipped}.`)
  console.log(`Queue size this run: ${queue.length} (full queue: ${ARTICLE_QUEUE.length} across 10 pillars).`)
  if (quarantined > 0) {
    console.log(`\n${quarantined} article(s) need manual review in content/generated-articles-needs-review/.`)
    console.log('Fix the underlying prompt/template issue, delete the quarantined file, and re-run to regenerate.')
  }
  console.log('Reminder: run "npm run indexnow" after each batch to submit new URLs — do not wait for all 96.')
}

main().catch((error) => {
  console.error('Error running generate-articles.js:', error.message)
  process.exit(1)
})
