/**
 * Presentation-only code formatting for legacy exam questions.
 *
 * Important: published question text, answer keys and evidence fingerprints
 * stay unchanged in the database. This formatter runs at display time.
 * Never execute question content.
 */

const CODE_FENCE = String.fromCharCode(96).repeat(3)

function formatJavaScript(code: string): string {
  // Comments can change scope if newlines are introduced. Leave them intact.
  if (code.includes('//') || code.includes('/*') || code.includes('*/')) return code

  const packed = code.split(/\r?\n/).some(line =>
    /;[ \t]*\S/.test(line) || /\{[^\n]*\}/.test(line),
  )
  if (!packed) return code

  const lines: string[] = []
  let current = ''
  let indent = 0
  let parenthesisDepth = 0
  let quote = ''
  let escaped = false

  const flush = () => {
    const text = current.trim()
    if (text) lines.push('  '.repeat(Math.min(16, Math.max(0, indent))) + text)
    current = ''
  }

  for (const char of code.replace(/\r\n?/g, '\n')) {
    if (quote) {
      current += char
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === quote) quote = ''
      continue
    }
    if (char === "'" || char === '"' || char === String.fromCharCode(96)) {
      quote = char
      current += char
      continue
    }
    if (char === '(') {
      parenthesisDepth += 1
      current += char
      continue
    }
    if (char === ')') {
      parenthesisDepth = Math.max(0, parenthesisDepth - 1)
      current += char
      continue
    }
    if (char === '{') {
      current = current.trimEnd() + (current.trim() ? ' ' : '') + '{'
      flush()
      indent += 1
      continue
    }
    if (char === '}') {
      flush()
      indent = Math.max(0, indent - 1)
      current = '}'
      flush()
      continue
    }
    if (char === ';' && parenthesisDepth === 0) {
      current += ';'
      flush()
      continue
    }
    if (char === '\n') {
      flush()
      continue
    }
    current += char
  }
  flush()
  return lines.join('\n') || code
}

function formatPython(code: string): string {
  return code.replace(/^([ \t]*def [A-Za-z_]\w*\([^()\n]*\)\s*:)\s*(return\b[^\n]*)$/gm,
    (_, declaration: string, result: string) =>
      declaration + '\n    ' + result.trim(),
  )
}

/** Keep short single-statement examples unchanged. */
export function formatCodeForDisplay(code: string, language?: string): string {
  const lang = (language ?? '').toLowerCase()
  if (lang === 'javascript' || lang === 'js') return formatJavaScript(code)
  if (lang === 'python' || lang === 'py') return formatPython(code)
  return code
}

/**
 * Promote only unmistakable multi-statement *inline program* snippets to a
 * fenced block. Ordinary formulas, expressions and inline code stay inline.
 * Preserve the source wording and never repair deliberately broken programs.
 */
export function prepareExamCodeText(source: string): string {
  if (source.includes(CODE_FENCE)) return source

  const tick = String.fromCharCode(96)
  const expression = new RegExp(tick + '([^' + tick + '\\n]+)' + tick, 'g')
  const snippets = [...source.matchAll(expression)]
  const candidates = snippets.filter(match => {
    const code = match[1]
    return code.length > 16 && code.includes(';') &&
      !code.includes('...') &&
      !/\b(?:elif|else)\s*:/.test(code) &&
      /(?:console\.log|function\s+\w+|(?:let|const|var)\s+\w+|print\(|\.append\()/.test(code)
  })
  if (candidates.length !== 1) return source

  const match = candidates[0]
  const code = match[1]
  const javascript = /\b(?:javascript|js)\b|console\.log|function\s+\w+|(?:let|const|var)\s+\w+/i.test(source)
  const language = javascript ? 'javascript' : 'python'
  if (!javascript && /(?:if|for|while)\b.*:/.test(code)) return source
  const display = formatCodeForDisplay(code, language)
  // A fenced code block needs its own paragraph. Nothing is changed in DB.
  const prefix = source.slice(0, match.index).trimEnd()
  let suffix = source.slice((match.index ?? 0) + match[0].length).trim()
  // A full stop immediately following inline code is just a separator.
  if (suffix.startsWith('. ')) suffix = suffix.slice(2)
  return prefix + '\n\n' + CODE_FENCE + language + '\n' + display +
    '\n' + CODE_FENCE + (suffix ? '\n\n' + suffix : '')
}
