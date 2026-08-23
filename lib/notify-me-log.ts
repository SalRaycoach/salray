import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Log local (fora do controle de versão, ver /data/ em .gitignore) de quem
 * pediu pra ser avisado quando "Primeiro Passo" ou "Vivências" ficarem
 * prontos (23 ago 2026) — mesmo padrão de data/failed-4week-applications.jsonl
 * em lib/application-failsafe.ts. Diferença: aqui é sempre gravado (não só
 * quando o e-mail de notificação falha), porque este arquivo é a lista de
 * espera em si, não apenas uma rede de segurança.
 */
export const NOTIFY_ME_LOG = path.join(process.cwd(), 'data', 'notify-me-signups.jsonl')

export async function persistNotifyMeSignup(payload: Record<string, unknown>): Promise<void> {
  try {
    await fs.mkdir(path.dirname(NOTIFY_ME_LOG), { recursive: true })
    const entry = JSON.stringify({ savedAt: new Date().toISOString(), ...payload })
    await fs.appendFile(NOTIFY_ME_LOG, entry + '\n', 'utf-8')
  } catch (err) {
    console.error('Failed to persist notify-me signup to disk:', err)
  }
}
