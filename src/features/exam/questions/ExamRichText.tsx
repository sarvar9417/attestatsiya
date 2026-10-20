import type { ReactNode } from 'react'
import InlineText from '../../../components/learning/theory/InlineText'


/** Decode imported literal newlines and safe HTML character references.
 * Never interpret imported HTML as markup: React receives only plain text.
 */
export function normalizeExamText(input: string): string {
  const entities: Record<string, string> = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  }
  return input
    .replace(/\\r\\n|\\n|\\t/g, value =>
      value === '\\t' ? '\t' : '\n')
    .replace(/&(#x[0-9a-f]+|#[0-9]+|amp|lt|gt|quot|apos|nbsp);/gi, (match, code: string) => {
      if (code[0] !== '#') return entities[code.toLowerCase()] ?? match
      const value = code[1]?.toLowerCase() === 'x'
        ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return value > 0 && value <= 0x10ffff && !(value >= 0xd800 && value <= 0xdfff)
        ? String.fromCodePoint(value) : match
    })
}

function tableCells(line: string): string[] | null {
  const trimmed = line.trim()
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return null
  return trimmed.slice(1, -1).split(/(?<!\\)\|/).map(cell => cell.trim().replace(/\\\|/g, '|'))
}

function tableHeaderAt(lines: string[], index: number): boolean {
  const header = tableCells(lines[index] ?? '')
  const divider = tableCells(lines[index + 1] ?? '')
  return !!(header && divider && header.length === divider.length &&
    divider.every(cell => /^:?-{3,}:?$/.test(cell)))
}

/** Shared question renderer: ordinary Markdown prose plus safe GFM-style tables. */
function ExamProse({ text }: { text: string }) {
  const lines = text.split('\n')
  const rendered: ReactNode[] = []
  let index = 0
  while (index < lines.length) {
    if (tableHeaderAt(lines, index)) {
      const header = tableCells(lines[index]) ?? []
      const rows: string[][] = []
      let next = index + 2
      while (next < lines.length) {
        const cells = tableCells(lines[next])
        if (!cells || cells.length !== header.length) break
        rows.push(cells)
        next += 1
      }
      rendered.push(<div key={index} className="my-3 max-w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700" tabIndex={0}>
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>{header.map((cell, column) => <th key={column} scope="col" className="border-b border-gray-200 px-3 py-2 font-semibold dark:border-gray-700"><InlineText text={cell} /></th>)}</tr>
          </thead>
          <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
            {row.map((cell, column) => <td key={column} className="px-3 py-2"><InlineText text={cell} /></td>)}
          </tr>)}</tbody>
        </table>
      </div>)
      index = next
    } else {
      const start = index
      while (index < lines.length && !tableHeaderAt(lines, index)) index += 1
      rendered.push(<div key={start} className="whitespace-pre-wrap break-words leading-relaxed">
        <InlineText text={lines.slice(start, index).join('\n')} />
      </div>)
    }
  }
  return <>{rendered}</>
}

/**
 * Exam stems are partly Markdown, but InlineText intentionally supports only
 * inline markup. Parse fenced code before handing prose to InlineText so that
 * a code block does not collapse into a single inline <code>.
 *
 * The source is rendered as text (not HTML), keeping examples harmless.
 */
export function splitExamContent(input: string):
  Array<{ kind: 'prose' | 'code'; text: string; language?: string }> {
  const parts: Array<{ kind: 'prose' | 'code'; text: string; language?: string }> = []
  // Some imported questions incorrectly wrapped a whole fenced block in **bold**.
  // Remove only that outer wrapper; leave legitimate bold prose untouched.
  const content = normalizeExamText(input).replace(/\*\*(```[\s\S]*?```)\*\*/g, '$1')
  const fence = /```([a-zA-Z0-9_+#.-]*)[ \t]*(?:\r?\n|[ \t]+)([\s\S]*?)[ \t]*```/g
  let cursor = 0
  let match: RegExpExecArray | null
  while ((match = fence.exec(content)) !== null) {
    if (match.index > cursor) {
      parts.push({ kind: 'prose', text: content.slice(cursor, match.index) })
    }
    parts.push({
      kind: 'code',
      language: match[1].toLowerCase() || undefined,
      text: match[2].replace(/^\r?\n|\r?\n$/g, ''),
    })
    cursor = match.index + match[0].length
  }
  if (cursor < content.length) parts.push({ kind: 'prose', text: content.slice(cursor) })
  return parts.length ? parts : [{ kind: 'prose', text: content }]
}

const languageNames: Record<string, string> = {
  js: 'JavaScript', javascript: 'JavaScript', py: 'Python',
  python: 'Python', cpp: 'C++', c: 'C', sql: 'SQL',
  pascal: 'Pascal', html: 'HTML', css: 'CSS', text: 'Kod',
}

export default function ExamRichText({ text }: { text: string }) {
  return (
    <div className="min-w-0 max-w-full space-y-2">
      {splitExamContent(text).map((part, index) => (
        part.kind === 'code' ? (
          <div key={index} className="min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-950 text-slate-100 dark:border-slate-600">
            <div className="border-b border-slate-700 px-3 py-1 text-xs font-medium tracking-wide text-slate-300">
              {languageNames[part.language ?? ''] ?? part.language ?? 'Kod'}
            </div>
            <pre
              className="m-0 max-w-full overflow-x-auto p-3 text-left font-mono text-[13px] leading-6 sm:text-sm"
              tabIndex={0}
              aria-label={`${languageNames[part.language ?? ''] ?? 'Dastur'} kodi`}
            ><code className="whitespace-pre">{part.text}</code></pre>
          </div>
        ) : (
          <ExamProse key={index} text={part.text} />
        )
      ))}
    </div>
  )
}
