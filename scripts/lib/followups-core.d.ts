export type FollowupKind = 'day3' | 'day7' | 'day15'
export type PlanDecision = { email: string; lang: 'en' | 'pt'; age?: number; kind?: FollowupKind; result: string }
export type DueItem = { email: string; lang: 'en' | 'pt'; age: number; kind: FollowupKind }
export const KINDS: FollowupKind[]
export const DAYS: Record<FollowupKind, number>
export const WINDOW_AFTER_DAYS: number
export const TZ: string
export function nyDay(date: Date): string
export function daysBetween(fromDate: Date, toDate: Date): number
export function plan(
  now: Date,
  subscribers: { email?: string; lang?: string; date?: string }[],
  unsubscribedRows: { email?: string }[],
  sentRows: { email?: string; day?: string }[]
): { decisions: PlanDecision[]; due: DueItem[] }
