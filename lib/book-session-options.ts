/**
 * Shared between components/BookSessionForm.tsx (client) and
 * app/(marketing)/api/book-a-session/route.ts (server) — kept in a plain
 * module with no 'use client' directive so the server route can import it
 * directly. Importing these from the client form component instead throws
 * at runtime ("Attempted to call includes() from the server but includes is
 * on the client"), because Next.js treats a client component's exports as
 * client-only proxies even for plain constants.
 */

// Same four categories used across the S.T.A.B.L.E. Reflections library —
// keeps the language consistent for anyone arriving here from a reflection.
export const FOCUS_AREA_OPTIONS = ['Patterns', 'Relationships', 'Clarity', 'Emotional Stability'] as const

export const URGENCY_OPTIONS = [
  "As soon as possible — I'm ready to start now",
  'Within the next couple of weeks',
  'No rush — just exploring my options',
] as const
