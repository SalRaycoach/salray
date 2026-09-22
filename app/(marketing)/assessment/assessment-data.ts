/**
 * DATA SOURCE — English self-assessment tool (/assessment/)
 * ---------------------------------------------------------------------------
 * Generalized English counterpart of app/pt/reconstrucao-emocional/avaliacao/
 * avaliacao-data.ts — same 10 scale questions and 5 categories, translated
 * and stripped of any reference to a specific program or timeframe (works
 * for any client, at any point in her journey, not tied to a 4-week or
 * 12-session program). Unlike the Portuguese tool, this version does not
 * compare "before" vs "after": each completion is independent and shows a
 * qualitative snapshot, not a before/after score delta — so there is no
 * localStorage, no unique identifier, and nothing persisted between visits.
 * The person herself indicates whether this is her first time or a retake.
 *
 * Score-band copy (low/medium/high per category) provided directly by SAL
 * Ray on 2026-09-22 — not paraphrased.
 * ---------------------------------------------------------------------------
 */

export type ScoreBand = 'low' | 'medium' | 'high'

export type Category = {
  name: string
  questions: [number, number] // 0-based indexes into SCALE_QUESTIONS
  ranges: Record<ScoreBand, string>
}

export const SCALE_QUESTIONS: string[] = [
  'When an emotion becomes intense, I can lower its intensity before acting or making a decision.',
  "I can notice what I'm feeling without immediately needing to escape, react, or fix it.",
  'I can recognize patterns that repeat in how I think, feel, or relate to others.',
  "When something affects me, I can better separate what actually happened from the interpretation my mind creates.",
  'I can more clearly see what is my responsibility and what belongs to someone else.',
  'I can recognize and communicate my boundaries without exploding, over-explaining, or abandoning what I need.',
  "A criticism, rejection, or someone else's choice does not fully determine how I see my own worth.",
  'I have clarity about what matters to me, even when others expect something different.',
  'When I notice an old pattern starting, I can create some space before automatically repeating the same response.',
  'Even when fear, discomfort, or uncertainty is present, I can identify a possible next step and act on what truly matters to me.',
]

export const CATEGORIES: Category[] = [
  {
    name: 'Emotional Stability',
    questions: [0, 1],
    ranges: {
      low: "Your answers suggest that, right now, it's difficult to create space between feeling something intense and reacting to it — emotions tend to take over before you can pause.",
      medium: "You can already, at times, notice what you're feeling before reacting — but it's still a work in progress, not yet automatic.",
      high: "Your answers show you already have a real foundation of pausing between feeling and acting — that's worth recognizing, even knowing there's always room to go deeper.",
    },
  },
  {
    name: 'Patterns & Clarity',
    questions: [2, 3],
    ranges: {
      low: "Right now, it may be hard to see the patterns that repeat — situations can feel disconnected from one another, even when they aren't.",
      medium: 'You already recognize some patterns when they show up, but it can still be hard to separate what actually happened from the story your mind builds around it.',
      high: 'You already show real clarity about repeating patterns — that awareness is a powerful tool for the next step.',
    },
  },
  {
    name: 'Boundaries & Responsibility',
    questions: [4, 5],
    ranges: {
      low: "It may be hard, today, to tell what's your responsibility apart from what belongs to someone else — and communicating a boundary can feel too risky.",
      medium: 'You already have some sense of where your boundaries are, but communicating them without guilt or over-explaining is still a challenge.',
      high: "Your boundaries are already fairly clear to you, and you're able to communicate them without abandoning what you need.",
    },
  },
  {
    name: 'Self-Worth & Identity',
    questions: [6, 7],
    ranges: {
      low: 'A rejection or criticism can, today, significantly shake how you see your own worth.',
      medium: "You already have a foundation of self-worth, but it can still waver depending on other people's opinions or reactions.",
      high: "Your sense of worth already seems well established, independent of outside approval — that's a solid foundation.",
    },
  },
  {
    name: 'Direction & Choice',
    questions: [8, 9],
    ranges: {
      low: 'Faced with fear or uncertainty, it can be hard to see what the next possible step would be.',
      medium: "You can already, at times, create space before repeating an old pattern — but it's not yet consistent.",
      high: "Even facing fear or discomfort, you're already able to identify a real next step — that's a valuable capacity.",
    },
  },
]

export const OPEN_QUESTIONS_FIRST: string[] = [
  'What has been taking up most of your emotional energy lately?',
  'What pattern or situation would you most like to understand or respond to differently?',
  'If this work helps you, what concrete change would you like to notice in your life?',
]

export const OPEN_QUESTIONS_RETAKE: string[] = [
  'What, if anything, do you notice has changed in how you respond to your emotions?',
  'Is there a behavior you do differently today? Give a concrete example.',
  'Which pattern can you now notice earlier?',
  "Is there an area where you expected change but haven't noticed a difference yet?",
]

export const CLOSING_MESSAGE =
  "This is not a diagnosis or a score — it's simply a snapshot of where you are right now, in your own words. Save this moment. You can retake this assessment anytime, and compare how things shift along the way."

export function categoryScore(scales: number[], category: Category): number {
  return category.questions.reduce((sum, i) => sum + (scales[i] ?? 0), 0)
}

export function categoryBand(score: number): ScoreBand {
  if (score <= 9) return 'low'
  if (score <= 14) return 'medium'
  return 'high'
}

export function categorySummary(scales: number[], category: Category): string {
  return category.ranges[categoryBand(categoryScore(scales, category))]
}
