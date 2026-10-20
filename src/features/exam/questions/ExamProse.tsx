import InlineText from '../../../components/learning/theory/InlineText'

type ExamParagraph = { kind: 'paragraph'; text: string }
type ExamTable = { kind: 'table'; columns: string[]; rows: string[][] }
export type ExamProseBlock = ExamParagraph | ExamTable

/**
 * Some source imports serialized Markdown line breaks as literal "\n".
 * Only decode when Markdown block structure makes this unambiguous; preserve
 * inline code such as a Python string containing the literal escape "\n".
 */
export function normalizeExamLineBreaks(input: string): string {
  const text = input.replace(/\r\n?/g, '\n')
  const structuralEscapes = /\\n\\n|\\n[ \t]*(?:\||#{1,6}[ \t]|[-*][ \t]|\d+\.[ \t]|```)/.test(text)
  const normalized = structuralEscapes
    ? text.replace(/(?<!`)`(?!`)[^`]*`(?!`)|\\r\\n|\\n/g, (match) =>
        match.startsWith('`') ? match : '\n',
      )
    : text

  // A few imports wrap an entire multi-block question in **...**. Do not
  // leave orphaned asterisks around the rendered table and its paragraphs.
  const wrappedTable = normalized.startsWith('**') && normalized.endsWith('**') &&
    /\n\|[ \t]*:?-{3,}/.test(normalized)
  return wrappedTable ? normalized.slice(2, -2) : normalized
}

function parseTableCells(line: string): string[] | null {
  const trimmed = line.trim()
  if (!trimmed.includes('|')) return null
  const withoutEdges = trimmed.replace(/^\|/, '').replace(/\|$/, '')
  return withoutEdges.split(/(?<!\\)\|/).map(cell => cell.trim().replace(/\\\|/g, '|'))
}

function isSeparator(cells: string[] | null, length: number): boolean {
  return cells !== null && cells.length === length && cells.every(cell => /^:?-{3,}:?$/.test(cell))
}

/** Parse only real Markdown tables (header + alignment delimiter + data). */
/** Decode imported HTML entities as plain text; never interpret source as HTML. */
export function decodeImportedEntities(input: string): string {
  const named: Record<string, string> = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  }
  return input.replace(/&#(?:x([0-9a-f]+)|([0-9]+));|&(amp|lt|gt|quot|apos|nbsp);/gi,
    (full, hex: string | undefined, decimal: string | undefined, name: string | undefined) => {
      if (name) return named[name.toLowerCase()] ?? full
      const code = Number.parseInt(hex ?? decimal ?? '', hex ? 16 : 10)
      return Number.isFinite(code) && code > 0 && code <= 0x10FFFF &&
        !(code >= 0xD800 && code <= 0xDFFF) && (code >= 32 || code === 9 || code === 10)
        ? String.fromCodePoint(code)
        : full
    },
  )
}

export function splitExamProse(input: string): ExamProseBlock[] {
  const lines = input.split(/\n/)
  const blocks: ExamProseBlock[] = []
  let paragraph: string[] = []
  const flush = () => {
    const text = paragraph.join('\n').trim()
    if (text) blocks.push({ kind: 'paragraph', text })
    paragraph = []
  }

  for (let i = 0; i < lines.length;) {
    const header = parseTableCells(lines[i])
    if (header && header.length >= 2 && i + 1 < lines.length &&
        isSeparator(parseTableCells(lines[i + 1]), header.length)) {
      flush()
      const rows: string[][] = []
      i += 2
      while (i < lines.length) {
        const cells = parseTableCells(lines[i])
        if (!cells || cells.length !== header.length) break
        rows.push(cells)
        i += 1
      }
      blocks.push({ kind: 'table', columns: header, rows })
      continue
    }

    if (lines[i].trim() === '') flush()
    else paragraph.push(lines[i])
    i += 1
  }
  flush()
  return blocks
}

export default function ExamProse({ text }: { text: string }) {
  return (
    <div className="min-w-0 max-w-full space-y-3">
      {splitExamProse(decodeImportedEntities(text)).map((block, index) =>
        block.kind === 'table' ? (
          <div
            key={index}
            role="region"
            aria-label="Savol jadvali"
            tabIndex={0}
            className="min-w-0 max-w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  {block.columns.map((column, col) => (
                    <th
                      key={col}
                      scope="col"
                      className="border-b border-r border-gray-200 px-3 py-2 font-semibold last:border-r-0 dark:border-gray-700"
                    >
                      <InlineText text={column} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="even:bg-gray-50 dark:even:bg-gray-800/40">
                    {row.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className="border-b border-r border-gray-200 px-3 py-2 last:border-r-0 dark:border-gray-700"
                      >
                        <InlineText text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div key={index} className="whitespace-pre-wrap break-words leading-relaxed">
            <InlineText text={block.text} />
          </div>
        ),
      )}
    </div>
  )
}
