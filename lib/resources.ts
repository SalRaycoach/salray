import fs from 'node:fs'
import path from 'node:path'
import type { Faq } from './config'

/**
 * 6 clusters emocionais (seção 10 do brief) — cada um vira uma página-hub em
 * /resources/[cluster]/ e agrupa artigos em /resources/[cluster]/[slug]/.
 * Os artigos abaixo são conteúdo semente; scripts/generate-articles.js grava
 * os demais em content/generated-articles/*.json, carregados automaticamente
 * por loadGeneratedArticles() no fim deste arquivo.
 */

export type ClusterSlug =
  | 'overthinking-emotional-overload'
  | 'emotional-patterns-self-sabotage'
  | 'relationships-boundaries'
  | 'self-trust-identity'
  | 'life-direction-rebuilding'
  | 'emotional-stability'

export type Cluster = {
  slug: ClusterSlug
  name: string
  description: string
}

export const clusters: Cluster[] = [
  {
    slug: 'overthinking-emotional-overload',
    name: 'Overthinking & Emotional Overload',
    description:
      'Articles on racing thoughts, constant worry, and the exhaustion of carrying too much for too long — and what it can look like to calm an overactive mind.',
  },
  {
    slug: 'emotional-patterns-self-sabotage',
    name: 'Emotional Patterns & Self-Sabotage',
    description:
      'Articles on why the same reactions and setbacks keep repeating, and how unresolved patterns from the past can keep showing up in the present.',
  },
  {
    slug: 'relationships-boundaries',
    name: 'Relationships & Boundaries',
    description:
      'Articles on repeating relationship patterns, difficulty setting boundaries, and rebuilding trust — in others and in yourself.',
  },
  {
    slug: 'self-trust-identity',
    name: 'Self-Trust & Identity',
    description:
      'Articles on rebuilding confidence, quieting self-doubt, and reconnecting with a clearer sense of who you are.',
  },
  {
    slug: 'life-direction-rebuilding',
    name: 'Life Direction & Rebuilding',
    description:
      'Articles on starting over, finding direction after a major life transition, and rebuilding a life that feels like your own again.',
  },
  {
    slug: 'emotional-stability',
    name: 'Emotional Stability',
    description:
      'Articles on building a steadier internal foundation — responding instead of reacting, and feeling grounded again.',
  },
]

export type Article = {
  slug: string
  cluster: ClusterSlug
  title: string // headline, máx 110 chars
  keyword: string
  excerpt: string // description, máx 155 chars
  datePublished: string
  dateModified: string
  content: string // markdown simplificado — ver lib/mdx.ts
  faq: Faq[]
  needsProfessionalCareNote: boolean
  relatedArticles: string[]
  ogImage: string
}

const seedArticles: Article[] = [
  {
    slug: 'why-cant-i-stop-overthinking',
    cluster: 'overthinking-emotional-overload',
    title: "Why Can't I Stop Overthinking?",
    keyword: "why can't I stop overthinking",
    excerpt:
      "If you can't stop overthinking, it's often less about the thoughts themselves and more about an unresolved pattern underneath them. Here's what that can look like.",
    datePublished: '2026-03-01T09:00:00-05:00',
    dateModified: '2026-03-01T09:00:00-05:00',
    needsProfessionalCareNote: true,
    relatedArticles: ['why-do-i-feel-mentally-exhausted', 'why-do-i-keep-reacting-the-same-way'],
    ogImage: '/images/og/og-default.jpg',
    content: `If you can't stop overthinking, it is rarely a sign that something is wrong with your mind. More often, it is a sign that your mind is trying to solve a problem — safety, control, or certainty — that thinking alone cannot resolve. Understanding **what the overthinking is protecting you from** is usually the first real step toward quieting it.

## Why the mind keeps racing

Overthinking often shows up when there is unresolved pressure: a decision you are avoiding, a relationship that feels uncertain, or a version of yourself you are not sure how to become. The mind treats these as unfinished problems, so it keeps returning to them — not because you are failing to think clearly, but because it has not yet found a stable place to put the concern down.

## Signs the pattern has taken over

You may notice the same worry replaying with slightly different words. You may rehearse conversations that have not happened yet, or replay ones that already ended. You may feel mentally tired by mid-morning, even when nothing unusual has happened. These are signs of a **pattern**, not a personal flaw.

## Why the pattern may persist

Overthinking often persists because it feels productive — like you are "doing something" about the problem. In reality, repeated thinking without a structure to act on it tends to reinforce the loop rather than resolve it. The pattern continues because nothing has changed the underlying condition that triggers it.

## A non-clinical framework for interrupting the loop

Rather than trying to "stop thinking," it can help to **name the pattern**, identify what it is protecting you from, and create one small, concrete action connected to the underlying concern. This shifts the mind from rehearsing to resolving — even in a small way — which tends to quiet the loop more effectively than willpower alone.

## What rebuilding can involve

Rebuilding in this area often means learning to recognize the early signs of the pattern, developing a structure for making decisions instead of circling them, and strengthening the trust that you can handle what comes next. This is the kind of work at the center of the S.T.A.B.L.E. Method.

## When professional clinical care may be appropriate

Occasional overthinking is a common human experience. However, if racing thoughts are accompanied by **panic attacks, persistent physical symptoms of anxiety, a diagnosed anxiety disorder, or a level of worry that consistently interferes with daily functioning**, this may fall outside the scope of non-clinical coaching. In that case, a licensed mental health professional is the appropriate next step — coaching is not a substitute for psychotherapy or medical care.

If your overthinking feels connected to a repeating emotional pattern, [scheduling an initial consultation](#consultation) can help clarify what is underneath it. If you would rather explore this at your own pace first, [the private community](#community) is a good place to start.

## Perguntas frequentes`,
    faq: [
      {
        question: 'Is overthinking the same as anxiety?',
        answer:
          'Overthinking and anxiety often overlap but are not identical. Overthinking describes a pattern of repetitive, circling thoughts, while anxiety can include physical symptoms like a racing heart or tension. Occasional overthinking is common; persistent anxiety symptoms that interfere with daily life may warrant a conversation with a licensed clinician.',
      },
      {
        question: 'Can coaching help with overthinking?',
        answer:
          'Non-clinical coaching can help you recognize the pattern behind the overthinking, understand what it may be protecting you from, and build a more structured way of making decisions. It does not diagnose or treat anxiety disorders — if symptoms are severe or persistent, clinical support is the appropriate path.',
      },
      {
        question: 'Why do I overthink more at night?',
        answer:
          'Nighttime often removes the distractions that keep overthinking in the background during the day, so unresolved concerns surface more clearly. It is also when decision fatigue is highest, which can make thoughts feel more urgent or unsolvable than they are in the morning.',
      },
      {
        question: 'Is it normal to replay conversations in my head?',
        answer:
          'Yes, this is a common pattern, especially for people who value connection and want to be understood correctly. It becomes worth attention when the replaying is frequent, distressing, or prevents you from moving forward — that is often a sign of a deeper pattern worth exploring.',
      },
      {
        question: 'How long does it take to reduce overthinking?',
        answer:
          'This varies widely by person and by what is underneath the pattern. Some people notice a shift in how they relate to their thoughts within a few weeks of structured work; deeper patterns tied to identity or trust may take longer to rebuild.',
      },
      {
        question: 'What is the difference between overthinking and being careful?',
        answer:
          'Careful thinking leads somewhere — a decision, an action, a resolution. Overthinking circles without resolving. If you notice the same thought returning without new information or a next step attached, it is more likely the latter.',
      },
    ],
  },
  {
    slug: 'why-do-i-keep-reacting-the-same-way',
    cluster: 'emotional-patterns-self-sabotage',
    title: 'Why Do I Keep Reacting the Same Way?',
    keyword: 'why do I keep reacting the same way',
    excerpt:
      'Repeating the same emotional reaction in different situations usually points to a pattern formed earlier, not a character flaw. Here is what that pattern can look like.',
    datePublished: '2026-03-05T09:00:00-05:00',
    dateModified: '2026-03-05T09:00:00-05:00',
    needsProfessionalCareNote: true,
    relatedArticles: ['why-cant-i-stop-overthinking', 'why-do-i-attract-toxic-relationships'],
    ogImage: '/images/og/og-default.jpg',
    content: `If you notice yourself reacting the same way across very different situations — the same defensiveness, the same shutdown, the same overcommitting — it is rarely random. **Repeating emotional reactions usually trace back to a pattern that was useful once and never got updated.**

## What an emotional pattern actually is

An emotional pattern is a reaction that formed in response to something real, often years ago, and continued running on autopilot long after the original situation changed. It is not a flaw in your character — it is closer to an old strategy still being applied to a new problem.

## Why the pattern keeps repeating

Patterns repeat because they are familiar, and familiarity feels safer than an untested response, even when the pattern is not serving you anymore. Without a clear moment of recognizing the pattern, the mind defaults to what it already knows.

## Signs of a repeating pattern

You may notice the same argument with different people, the same withdrawal when things get serious, or the same self-sabotage right before something goes well. These repeated shapes — not the specific situations — are what point to the underlying pattern.

## A non-clinical approach to interrupting the cycle

Interrupting a repeating pattern usually starts with **naming it clearly** ("this is the pattern where I withdraw when I feel criticized") rather than judging it. From there, the work involves identifying the earlier moment the pattern may have formed, and practicing a different, deliberate response in a low-stakes situation before applying it somewhere higher-stakes.

## What rebuilding can involve

Rebuilding this area of your life often means separating the old strategy from your present-day reality, strengthening your ability to pause before reacting, and building enough self-trust to try a new response even when the old one feels safer.

## When professional clinical care may be appropriate

If the pattern is connected to **unresolved trauma, a diagnosed condition such as PTSD, or reactions that feel outside of your control (dissociation, intense flashbacks, or safety concerns)**, this goes beyond the scope of non-clinical coaching. A licensed trauma-informed therapist is the appropriate professional to work with in that case.

If this pattern feels familiar and you want structured support to work through it, [an initial consultation](#consultation) is the next step. For ongoing support between sessions, [the private community](#community) is also available.

## Perguntas frequentes`,
    faq: [
      {
        question: 'Why do I always react the same way in conflict?',
        answer:
          'Repeated reactions in conflict usually reflect a pattern learned earlier in life, often as a way to stay safe or keep connection. The reaction persists because it once worked, even if it no longer fits your current relationships or situation.',
      },
      {
        question: 'Can I actually change a pattern I have had for years?',
        answer:
          'Yes, though it typically requires more than insight alone — recognizing the pattern is the first step, but changing it usually involves deliberate practice of a different response, often with support, until the new response becomes as automatic as the old one.',
      },
      {
        question: 'Is this the same as a trigger?',
        answer:
          'A trigger is the specific moment that activates a pattern; the pattern itself is the underlying reaction that keeps repeating across different triggers. Working on the pattern tends to be more effective than trying to avoid every possible trigger.',
      },
      {
        question: 'Why does this pattern show up more with people I am close to?',
        answer:
          'Emotional patterns tend to intensify in close relationships because there is more at stake and more history involved. Situations with less emotional weight rarely activate the same pattern as strongly.',
      },
      {
        question: 'Do I need to know where the pattern came from to change it?',
        answer:
          'It helps, but it is not always required. Some people make progress simply by recognizing the pattern in the moment and choosing a different response; others benefit from understanding its origin first. Both are valid starting points.',
      },
      {
        question: 'What if I cannot stop the reaction even when I see it happening?',
        answer:
          "That is common in the early stages of change — awareness usually arrives before control. If a reaction feels completely outside your control, or connected to trauma, that is a sign to involve a licensed clinician alongside any coaching work.",
      },
    ],
  },
  {
    slug: 'why-do-i-attract-toxic-relationships',
    cluster: 'relationships-boundaries',
    title: 'Why Do I Attract Toxic Relationships?',
    keyword: 'why do I attract toxic people',
    excerpt:
      "Repeating unhealthy relationship patterns is rarely about attracting the 'wrong' people — it is usually about a boundary or trust pattern worth understanding.",
    datePublished: '2026-03-08T09:00:00-05:00',
    dateModified: '2026-03-08T09:00:00-05:00',
    needsProfessionalCareNote: true,
    relatedArticles: ['why-do-i-keep-reacting-the-same-way', 'why-dont-i-trust-myself-anymore'],
    ogImage: '/images/og/og-default.jpg',
    content: `If you keep ending up in relationships that feel unhealthy, it is rarely about "attracting" the wrong people at random. More often, it points to a **pattern in how boundaries, trust, and self-worth were shaped earlier in life** — one that can be understood and rebuilt.

## Why the same relationship pattern repeats

People are often drawn to what feels familiar, even when familiar is not healthy. If early relationships modeled instability, inconsistency, or blurred boundaries, those dynamics can feel more recognizable — and therefore more comfortable — than a genuinely healthy relationship might.

## Signs of a repeating relationship pattern

You may notice a consistent type of partner or friend who takes more than they give, difficulty recognizing early warning signs, or a tendency to stay well past the point where the relationship has stopped serving you. These are signs of a pattern, not a personal failing.

## Rebuilding boundaries as a non-clinical framework

Rebuilding this area typically starts with learning to notice early discomfort instead of overriding it, practicing smaller boundaries in lower-stakes relationships, and building the self-trust to act on what you notice rather than explaining it away.

## What healthier relationship patterns can look like

Over time, this work can support recognizing red flags earlier, communicating boundaries clearly and without over-explaining, and choosing relationships based on how they actually feel rather than how much potential they seem to have.

## When professional clinical care may be appropriate

If a relationship involves **narcissistic abuse, emotional abuse, or safety concerns**, this content is educational only and is not a substitute for professional support. Sal Ray's coaching does not provide legal advice or safety planning. If you are in an abusive relationship or unsafe situation, please contact a licensed professional, a domestic violence resource, or, in an emergency, local emergency services.

If this pattern feels familiar, [an initial consultation](#consultation) can help you understand it more clearly. [The private community](#community) is also available for ongoing support.

## Perguntas frequentes`,
    faq: [
      {
        question: 'Why do I keep ending up with the same type of person?',
        answer:
          'This usually reflects a pattern of familiarity rather than coincidence — the traits that feel recognizable, even when unhealthy, tend to repeat until the underlying pattern is understood and addressed directly.',
      },
      {
        question: 'Why is it hard for me to leave a relationship that is not good for me?',
        answer:
          'Leaving is often harder when the relationship reflects familiar emotional dynamics from earlier in life, or when self-trust has been eroded to the point where your own judgment about the relationship feels unreliable.',
      },
      {
        question: 'How do I know if I have a boundary problem?',
        answer:
          'Common signs include agreeing to things you do not want, feeling resentful after saying yes, over-explaining simple decisions, or feeling guilty when prioritizing your own needs. These point toward an area of boundary work.',
      },
      {
        question: 'Can coaching help me set boundaries?',
        answer:
          'Yes, non-clinical coaching can help you identify where boundaries are missing, practice communicating them clearly, and build the self-trust to maintain them, especially in relationships where boundaries have historically been difficult.',
      },
      {
        question: 'Is this the same as trust issues?',
        answer:
          'Trust issues and boundary patterns are closely related but not identical. Trust issues often involve difficulty believing others (or yourself); boundary patterns involve difficulty acting on what you already know or feel. They frequently show up together.',
      },
      {
        question: 'What should I do if I think I am in an abusive relationship?',
        answer:
          'Please seek support from a licensed professional or a domestic violence resource, and contact local emergency services if you are in immediate danger. Coaching content on this topic is educational only and is not a substitute for professional safety planning.',
      },
    ],
  },
  {
    slug: 'why-dont-i-trust-myself-anymore',
    cluster: 'self-trust-identity',
    title: "Why Don't I Trust Myself Anymore?",
    keyword: 'how to trust yourself again',
    excerpt:
      'Losing trust in your own judgment usually happens gradually, after repeated self-doubt or a difficult relationship. Rebuilding it is a structured process.',
    datePublished: '2026-03-12T09:00:00-05:00',
    dateModified: '2026-03-12T09:00:00-05:00',
    needsProfessionalCareNote: false,
    relatedArticles: ['why-do-i-attract-toxic-relationships', 'how-to-rebuild-your-life-after-it-falls-apart'],
    ogImage: '/images/og/og-default.jpg',
    content: `Losing trust in yourself rarely happens in one moment. More often, it builds gradually — after a series of decisions that did not go the way you expected, or a relationship that taught you to doubt your own perception. **Rebuilding self-trust is less about confidence and more about evidence.**

## Why self-trust erodes over time

Self-trust tends to erode when your instincts were repeatedly overridden, criticized, or proven "wrong" by someone else's version of events. Over time, the habit of second-guessing yourself becomes automatic, even in situations where your judgment was accurate all along.

## What losing self-trust can look like

This often shows up as chronic indecision, needing reassurance before making even small choices, or a persistent sense that you don't really know what you want. None of these are permanent traits — they are patterns that formed and can be rebuilt.

## A structured way to rebuild self-trust

Rebuilding self-trust usually starts small: making low-stakes decisions and following through on them without over-consulting others, then reviewing the outcome honestly. Each completed decision becomes evidence — proof that your judgment can be relied on again.

## What rebuilding can involve

Over time, this work can involve identifying where self-trust was lost, practicing decision-making in low-risk areas first, and gradually applying that same trust to bigger decisions about relationships, direction, and identity.

Ready to work on this directly? [Schedule an initial consultation](#consultation) to talk through where self-trust has been affected. If you want ongoing support in the meantime, [join the private community](#community).

## Perguntas frequentes`,
    faq: [
      {
        question: 'Why do I doubt every decision I make?',
        answer:
          'Chronic self-doubt usually develops after a pattern of having your judgment questioned or overridden, whether by a relationship, an authority figure, or repeated setbacks. It becomes automatic over time, even in situations where your judgment is sound.',
      },
      {
        question: 'How long does it take to rebuild self-trust?',
        answer:
          'This varies by person, but most people notice a shift within a few weeks of consistently making and following through on small decisions. Deeper self-trust, especially around major life choices, tends to build over a period of months.',
      },
      {
        question: 'Is low self-esteem the same as low self-trust?',
        answer:
          'They are related but distinct. Low self-esteem is about how you value yourself overall; low self-trust is specifically about whether you believe your own judgment and perception. You can have one without the other, though they often reinforce each other.',
      },
      {
        question: 'Why do I ask everyone else what I should do?',
        answer:
          'This often reflects a habit of outsourcing decisions after self-trust has been eroded — it can feel safer to rely on someone else\'s judgment than risk being wrong again on your own.',
      },
      {
        question: 'Can rebuilding self-trust help with people-pleasing?',
        answer:
          'Yes. People-pleasing is often connected to low self-trust — it can be easier to defer to others\' preferences than trust your own. Rebuilding self-trust tends to reduce the need for constant external validation over time.',
      },
      {
        question: 'What is the first step to trusting myself again?',
        answer:
          'Start by making one small decision independently, following through on it, and reviewing the outcome honestly without judgment. Repeating this consistently builds the evidence base that self-trust is rebuilt on.',
      },
    ],
  },
  {
    slug: 'how-to-rebuild-your-life-after-it-falls-apart',
    cluster: 'life-direction-rebuilding',
    title: 'How to Rebuild Your Life After It Falls Apart',
    keyword: 'how to rebuild your life',
    excerpt:
      'Rebuilding your life after a major change does not require having everything figured out at once. Here is a more structured way to approach it.',
    datePublished: '2026-03-15T09:00:00-05:00',
    dateModified: '2026-03-15T09:00:00-05:00',
    needsProfessionalCareNote: false,
    relatedArticles: ['why-dont-i-trust-myself-anymore', 'why-do-i-feel-emotionally-numb'],
    ogImage: '/images/og/og-default.jpg',
    content: `When a major part of your life falls apart — a relationship, a career, an identity you had built your life around — the instinct is often to look for a complete answer immediately. **Rebuilding rarely works that way. It tends to happen in a structured sequence, not all at once.**

## Why "starting over" feels so disorienting

Starting over is disorienting because the usual reference points — routine, identity, direction — are suddenly missing. Without those references, even simple decisions can feel overwhelming, which is a normal response to genuine disruption, not a sign that something is wrong with you.

## What tends to make rebuilding harder

Rebuilding is often made harder by trying to solve everything at once, comparing your timeline to someone else's, or waiting to feel fully "ready" before taking any action. None of these are required for meaningful progress to begin.

## A structured approach to rebuilding

A more workable approach usually starts with understanding what actually needs rebuilding — is it direction, identity, stability, or trust? — before jumping to solutions. From there, small, concrete steps in one area tend to create more momentum than trying to address everything simultaneously.

## What rebuilding can involve

This work often involves clarifying what changed and what didn't, identifying which patterns from before are worth keeping and which need to change, and creating a realistic, sequenced plan rather than an all-at-once transformation.

If you are in the middle of a major life transition and want a clearer structure to work from, [schedule an initial consultation](#consultation). For ongoing support along the way, [the private community](#community) is also available.

## Perguntas frequentes`,
    faq: [
      {
        question: 'Where do I even start when rebuilding my life?',
        answer:
          'Start by identifying what specifically needs rebuilding — direction, identity, stability, relationships, or a combination. Trying to address everything at once tends to create overwhelm; starting with one clear area creates faster, more sustainable momentum.',
      },
      {
        question: 'Is it normal to feel lost in my 40s or 50s?',
        answer:
          'Yes, feeling lost during a major life transition is a common experience, especially after a significant change in relationships, career, or identity. It reflects the loss of familiar reference points, not a personal failure.',
      },
      {
        question: 'How long does it take to rebuild your life after a major change?',
        answer:
          "This varies significantly depending on the change and the person, but most people notice meaningful clarity within a few months of structured work, even if the full rebuilding process continues longer.",
      },
      {
        question: 'What if I do not know what I want anymore?',
        answer:
          'Not knowing what you want is common after a major identity shift. Rather than searching for a complete answer immediately, it often helps to start by noticing what feels aligned or misaligned in daily choices — clarity tends to build gradually from there.',
      },
      {
        question: 'Is burnout part of needing to rebuild?',
        answer:
          'Burnout is often one of the signals that something needs to change, whether in direction, workload, or identity. Recovering from burnout and rebuilding direction frequently happen together, though they are not identical processes.',
      },
      {
        question: 'Can I rebuild my life without knowing my long-term purpose?',
        answer:
          'Yes. Meaningful rebuilding can begin with clarity about the next season, not necessarily a complete long-term purpose. Purpose often becomes clearer as stability and direction are rebuilt, rather than being a prerequisite for starting.',
      },
    ],
  },
  {
    slug: 'why-do-i-feel-emotionally-numb',
    cluster: 'emotional-stability',
    title: 'Why Do I Feel Emotionally Numb?',
    keyword: 'why am I emotionally numb',
    excerpt:
      'Emotional numbness is often the mind protecting itself after prolonged overload. Here is what that can look like, and when to seek clinical support.',
    datePublished: '2026-03-19T09:00:00-05:00',
    dateModified: '2026-03-19T09:00:00-05:00',
    needsProfessionalCareNote: true,
    relatedArticles: ['how-to-rebuild-your-life-after-it-falls-apart', 'why-cant-i-stop-overthinking'],
    ogImage: '/images/og/og-default.jpg',
    content: `Feeling emotionally numb — like you are going through the motions without really feeling anything — is often the mind's way of protecting itself after a prolonged period of emotional overload. **It is a signal worth paying attention to, not a personal failing.**

## Why numbness can develop

When emotional demands go on for too long without relief, the mind may reduce its emotional responses as a form of self-protection. This can feel like flatness, disconnection, or an inability to enjoy things that used to matter — a kind of internal shutdown after sustained overload.

## Signs of emotional numbness

Common signs include feeling disconnected from people you care about, going through routines without any real sense of engagement, or noticing that things that used to bring you joy no longer register. These are signals the nervous system needs a different kind of support, not evidence that something is permanently wrong.

## A non-clinical approach to rebuilding emotional responsiveness

Rebuilding emotional responsiveness usually starts with reducing ongoing overload where possible, and reintroducing small, low-pressure experiences that reconnect you with feeling — without forcing intensity. This tends to work better than trying to "feel more" through willpower alone.

## What rebuilding can involve

This work can involve identifying what led to the overload in the first place, creating more sustainable emotional rhythms day to day, and gradually rebuilding a stable, responsive relationship with your own emotions.

## When professional clinical care may be appropriate

If emotional numbness is accompanied by **persistent hopelessness, sadness that will not lift, loss of motivation for an extended period, or any thoughts of self-harm**, this goes beyond the scope of non-clinical coaching and requires professional support. If you are in crisis or immediate danger, please contact local emergency services or the 988 Suicide & Crisis Lifeline (call or text 988 in the U.S.).

If this describes a period you are currently in, [an initial consultation](#consultation) can help clarify next steps. [The private community](#community) is also available for ongoing, non-clinical support.

## Perguntas frequentes`,
    faq: [
      {
        question: 'Is emotional numbness a sign of depression?',
        answer:
          'Emotional numbness can be one feature of depression, but it can also occur on its own after prolonged stress or overload without meeting the criteria for a depressive disorder. If numbness is persistent or accompanied by hopelessness, a licensed clinician can help determine what is happening.',
      },
      {
        question: 'Why don\'t I enjoy things I used to love?',
        answer:
          'Losing enjoyment in previously meaningful activities is often a sign of emotional overload or numbness rather than the activities themselves changing. It typically improves as overload is reduced and emotional responsiveness is rebuilt gradually.',
      },
      {
        question: 'Can coaching help with emotional numbness?',
        answer:
          'Non-clinical coaching can help address overload and support rebuilding a more responsive relationship with your emotions. However, if numbness is connected to a diagnosable condition or persistent hopelessness, clinical care is the appropriate primary support.',
      },
      {
        question: 'Is it normal to feel nothing after a hard period in life?',
        answer:
          'Yes, a period of emotional flatness after intense stress or loss is a common protective response. It becomes a concern when it persists for an extended period, deepens, or is accompanied by hopelessness — at that point, professional support is recommended.',
      },
      {
        question: 'How do I start feeling again?',
        answer:
          'Rather than forcing intensity, it usually helps to reduce ongoing sources of overload and reintroduce small, low-pressure experiences that allow feeling to return gradually, alongside consistent rest and support.',
      },
      {
        question: 'When should I seek help instead of trying to manage this alone?',
        answer:
          'If numbness is accompanied by persistent hopelessness, loss of motivation over an extended period, or any thoughts of self-harm, seek support from a licensed mental health professional immediately, or contact the 988 Suicide & Crisis Lifeline if you are in crisis.',
      },
    ],
  },
]

const generatedDir = path.join(process.cwd(), 'content', 'generated-articles')

function loadGeneratedArticles(): Article[] {
  if (!fs.existsSync(generatedDir)) return []
  return fs
    .readdirSync(generatedDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(generatedDir, file), 'utf-8')) as Article)
}

// scripts/generate-articles.js grava um .json por slug em content/generated-articles/,
// mesclado aqui automaticamente — nenhuma edição manual é necessária.
export const articles: Article[] = [...seedArticles, ...loadGeneratedArticles()]

export function getArticlesByCluster(cluster: ClusterSlug): Article[] {
  return articles.filter((a) => a.cluster === cluster)
}
