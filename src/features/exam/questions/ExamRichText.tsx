import InlineText from '../../../components/learning/theory/InlineText'

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
  const content = input.replace(/\*\*(```[\s\S]*?```)\*\*/g, '$1')
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
  return parts.length ? parts : [{ kind: 'prose', text: input }]
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
          <div key={index} className="whitespace-pre-wrap break-words leading-relaxed">
            <InlineText text={part.text} />
          </div>
        )
      ))}
    </div>
  )
}
