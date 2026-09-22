import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Local log (outside version control, see /data/ in .gitignore) of everyone
 * who signed up for "Receive New Audio Reflections" on /reflections/ — same
 * pattern as lib/notify-me-log.ts. Always written (not only when the
 * notification email fails), because this file is the signup list itself,
 * not just a safety net.
 */
export const REFLECTIONS_SIGNUP_LOG = path.join(process.cwd(), 'data', 'reflections-signups.jsonl')

export async function persistReflectionsSignup(payload: Record<string, unknown>): Promise<void> {
  try {
    await fs.mkdir(path.dirname(REFLECTIONS_SIGNUP_LOG), { recursive: true })
    const entry = JSON.stringify({ savedAt: new Date().toISOString(), ...payload })
    await fs.appendFile(REFLECTIONS_SIGNUP_LOG, entry + '\n', 'utf-8')
  } catch (err) {
    console.error('Failed to persist reflections signup to disk:', err)
  }
}
