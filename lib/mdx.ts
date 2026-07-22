/**
 * Parser markdown minimalista para o conteúdo dos artigos (sem dependência externa).
 * Suporta: ## / ### headings, **negrito**, [texto](link), parágrafos e tabelas | | |.
 */

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-aqua underline underline-offset-2">$1</a>')
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith('|') && line.trim().endsWith('|')
}

function isTableSeparator(line: string): boolean {
  return /^\|[\s-:|]+\|$/.test(line.trim())
}

export function markdownToHtml(markdown: string): string {
  const lines = markdown.split('\n')
  const html: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i] ?? ''
    const trimmed = line.trim()

    if (trimmed === '') {
      i++
      continue
    }

    if (trimmed.startsWith('### ')) {
      html.push(`<h3 class="font-display text-2xl text-charcoal mt-8 mb-3">${inline(trimmed.slice(4))}</h3>`)
      i++
      continue
    }

    if (trimmed.startsWith('## ')) {
      html.push(`<h2 class="font-display text-3xl text-charcoal mt-10 mb-4">${inline(trimmed.slice(3))}</h2>`)
      i++
      continue
    }

    if (isTableRow(trimmed)) {
      const rows: string[][] = []
      while (i < lines.length && isTableRow((lines[i] ?? '').trim())) {
        const rowLine = (lines[i] ?? '').trim()
        if (!isTableSeparator(rowLine)) {
          const cells = rowLine
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim())
          rows.push(cells)
        }
        i++
      }
      const [header, ...body] = rows
      html.push('<div class="overflow-x-auto my-6"><table class="w-full border-collapse text-sm">')
      if (header) {
        html.push(
          '<thead><tr class="border-b-2 border-charcoal">' +
            header.map((c) => `<th class="text-left py-2 px-3 text-charcoal">${inline(c)}</th>`).join('') +
            '</tr></thead>'
        )
      }
      html.push('<tbody>')
      for (const row of body) {
        html.push(
          '<tr class="border-b border-charcoal/10">' +
            row.map((c) => `<td class="py-2 px-3 text-charcoal/80">${inline(c)}</td>`).join('') +
            '</tr>'
        )
      }
      html.push('</tbody></table></div>')
      continue
    }

    html.push(`<p class="text-charcoal/85 leading-relaxed mb-5">${inline(trimmed)}</p>`)
    i++
  }

  return html.join('\n')
}
