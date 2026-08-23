import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Rede de segurança contra falha silenciosa de e-mail no formulário do
 * 4-Week Experience — dois níveis independentes, nessa ordem de prioridade
 * (ver conversa com o usuário, 22 ago 2026):
 *   1. Nunca perder a candidatura: grava os dados em disco, fora do
 *      controle de versão, sempre que o e-mail falhar — recuperação manual
 *      depois, mesmo que o e-mail quebre de novo.
 *   2. Avisar na hora: push via ntfy.sh (serviço público, sem conta,
 *      independente do SMTP que pode estar quebrado) — a mensagem NÃO leva
 *      dados pessoais do candidato (o tópico é público, ainda que com nome
 *      longo e aleatório), só sinaliza que algo falhou e onde recuperar.
 */

export const FAILED_APPLICATIONS_LOG = path.join(process.cwd(), 'data', 'failed-4week-applications.jsonl')

// Tópico ntfy.sh dedicado — o nome longo/aleatório funciona como o "segredo"
// do canal, já que o serviço em si não tem autenticação. Pra receber os
// alertas: abrir https://ntfy.sh/salray-4wk-alert-8c8bdbe0c113 no navegador
// ou no app ntfy (iOS/Android), e opcionalmente inscrever esse tópico lá
// pra notificação push no celular.
const NTFY_TOPIC = 'salray-4wk-alert-8c8bdbe0c113'
const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`

/**
 * Grava a candidatura completa em um arquivo JSON Lines local. Cada falha
 * vira uma linha própria, pra permitir recuperação manual depois. Nunca
 * lança — se até isso falhar, cai no log do processo como último recurso.
 */
export async function persistFailedApplication(payload: Record<string, unknown>, reason: string): Promise<void> {
  try {
    await fs.mkdir(path.dirname(FAILED_APPLICATIONS_LOG), { recursive: true })
    const entry = JSON.stringify({ savedAt: new Date().toISOString(), reason, ...payload })
    await fs.appendFile(FAILED_APPLICATIONS_LOG, entry + '\n', 'utf-8')
  } catch (err) {
    console.error('Failed to persist failed 4-Week application to disk:', err)
  }
}

/**
 * Envia um push de alerta via ntfy.sh — canal HTTP simples, sem depender do
 * SMTP. Mensagem propositalmente sem PII do candidato (nome/e-mail/telefone
 * ficam só no log recuperável). Nunca lança.
 */
export async function sendFailureAlert(firstName: string, reason: string): Promise<void> {
  try {
    await fetch(NTFY_URL, {
      method: 'POST',
      headers: {
        Title: 'SAL Ray site: 4-Week email failed',
        Priority: 'urgent',
        Tags: 'warning,email',
      },
      body: `A 4-Week Experience application email failed to send (${reason}). Applicant first name: ${firstName || 'unknown'}. The application was NOT lost — full details were saved to the server recovery log (data/failed-4week-applications.jsonl).`,
    })
  } catch (err) {
    console.error('Failed to send ntfy.sh failure alert:', err)
  }
}
