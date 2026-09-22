import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Same two-layer safety net as lib/book-session-failsafe.ts, applied to
 * /assessment/ retakes: persist the full submission to disk whenever email
 * fails, and push an independent ntfy.sh alert. Only retakes reach this —
 * a first-time completion never sends email, so there is nothing to fail.
 */

export const FAILED_ASSESSMENT_LOG = path.join(process.cwd(), 'data', 'failed-assessment-retakes.jsonl')

const NTFY_TOPIC = 'salray-assessment-alert-9d3e71b04c'
const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`

export async function persistFailedAssessment(payload: Record<string, unknown>, reason: string): Promise<void> {
  try {
    await fs.mkdir(path.dirname(FAILED_ASSESSMENT_LOG), { recursive: true })
    const entry = JSON.stringify({ savedAt: new Date().toISOString(), reason, ...payload })
    await fs.appendFile(FAILED_ASSESSMENT_LOG, entry + '\n', 'utf-8')
  } catch (err) {
    console.error('Failed to persist failed assessment retake to disk:', err)
  }
}

export async function sendAssessmentFailureAlert(email: string, reason: string): Promise<void> {
  try {
    await fetch(NTFY_URL, {
      method: 'POST',
      headers: {
        Title: 'SAL Ray site: Assessment retake email failed',
        Priority: 'urgent',
        Tags: 'warning,email',
      },
      body: `An /assessment/ retake email failed to send (${reason}). Submitter email: ${email || 'unknown'}. The submission was NOT lost — full details were saved to the server recovery log (data/failed-assessment-retakes.jsonl).`,
    })
  } catch (err) {
    console.error('Failed to send ntfy.sh failure alert:', err)
  }
}
