import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Same two-layer safety net as lib/application-failsafe.ts (4-Week
 * Experience), applied to /book-a-session/: (1) persist the full submission
 * to disk whenever email fails, so nothing is silently lost, and (2) push an
 * ntfy.sh alert (independent of SMTP) so the failure is noticed right away.
 * Kept as its own file with its own ntfy topic and log path — the two forms
 * are unrelated funnels and shouldn't share state or alert channels.
 */

export const FAILED_BOOK_SESSION_LOG = path.join(process.cwd(), 'data', 'failed-book-a-session-requests.jsonl')

const NTFY_TOPIC = 'salray-book-session-alert-4f2a9c7e21'
const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`

export async function persistFailedBookSessionRequest(payload: Record<string, unknown>, reason: string): Promise<void> {
  try {
    await fs.mkdir(path.dirname(FAILED_BOOK_SESSION_LOG), { recursive: true })
    const entry = JSON.stringify({ savedAt: new Date().toISOString(), reason, ...payload })
    await fs.appendFile(FAILED_BOOK_SESSION_LOG, entry + '\n', 'utf-8')
  } catch (err) {
    console.error('Failed to persist failed Book a Session request to disk:', err)
  }
}

export async function sendBookSessionFailureAlert(firstName: string, reason: string): Promise<void> {
  try {
    await fetch(NTFY_URL, {
      method: 'POST',
      headers: {
        Title: 'SAL Ray site: Book a Session email failed',
        Priority: 'urgent',
        Tags: 'warning,email',
      },
      body: `A Book a Session request email failed to send (${reason}). Requester first name: ${firstName || 'unknown'}. The request was NOT lost — full details were saved to the server recovery log (data/failed-book-a-session-requests.jsonl).`,
    })
  } catch (err) {
    console.error('Failed to send ntfy.sh failure alert:', err)
  }
}
