export type Training = 'pdf1' | 'pdf2' | 'pdf3' | 'pdf4' | 'pdf5'
export type FollowupKind =
  | 'day3'
  | 'day7'
  | 'day15'
  | 'pdf2-day3'
  | 'pdf2-day7'
  | 'pdf2-day15'
  | 'pdf3-day3'
  | 'pdf3-day7'
  | 'pdf3-day15'
  | 'pdf4-day3'
  | 'pdf4-day7'
  | 'pdf4-day15'
export type PlanDecision = { email: string; lang: 'en' | 'pt'; training: Training; age?: number; kind?: FollowupKind; result: string }
export type DueItem = { email: string; lang: 'en' | 'pt'; training: Training; age: number; kind: FollowupKind }
export const KINDS: FollowupKind[]
export const KINDS_BY_TRAINING: Record<Training, FollowupKind[]>
export const DAYS: Record<FollowupKind, number>
export const WINDOW_AFTER_DAYS: number
export const TZ: string
export function nyDay(date: Date): string
export function daysBetween(fromDate: Date, toDate: Date): number
export function plan(
  now: Date,
  subscribers: { email?: string; lang?: string; date?: string; training?: string }[],
  unsubscribedRows: { email?: string }[],
  sentRows: { email?: string; day?: string }[]
): { decisions: PlanDecision[]; due: DueItem[] }
