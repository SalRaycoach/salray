import type { FollowupKind } from './followups-core'
export const KINDS: FollowupKind[]
export const SITE_URL: string
export const CONTACT_EMAIL: string
export function buildFollowup(opts: {
  lang: 'en' | 'pt'
  kind: FollowupKind
  token: string
  baseUrl?: string
  subjectPrefix?: string
  imageSrc?: { logo: string; cover: string }
}): { subject: string; html: string; text: string; headers: Record<string, string> }
