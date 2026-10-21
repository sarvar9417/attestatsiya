import { Fragment, useMemo } from 'react'
import { renderMath } from './renderMath'
import MantiqCircuit from './MantiqCircuit'

/**
 * Kontent ichki mini-formati (LaTeX konverteri chiqaradi):
 *
 * | Yozuv                  | Ma'nosi                          |
 * |------------------------|----------------------------------|
 * | `**matn**`             | qalin                            |
 * | `__matn__`             | kursiv                           |
 * | `~~term~~`             | inglizcha atama                  |
 * | `==term==`             | kalit so'z (kitobdagi \keyterm)  |
 * | `` `kod` ``            | monospace                        |
 * | `$x^2$`                | KaTeX matematikasi               |
 * | `@@ICT5, PDF 10–12@@`  | manba izi                        |
 * | `[matn](url)`          | havola                           |
 */
const TOKEN = new RegExp(
  [
    /\[\[FIG:(G\d{3})\]\]/.source,
    /\$([^$]+)\$/.source,
    /\*\*([^*]+)\*\*/.source,
    /__([^_]+)__/.source,
    /~~([^~]+)~~/.source,
    /==([^=]+)==/.source,
    /`([^`]+)`/.source,
    /@@([^@]+)@@/.source,
    /\[([^\]]+)\]\(([^)]+)\)/.source,
    /(✓|✗)/.source,
  ].join('|'),
  'g',
)

type Node = string | { kind: string; value: string; href?: string }

function tokenize(text: string): Node[] {
  const nodes: Node[] = []
  let last = 0
  TOKEN.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const [, fig, math, bold, italic, eng, term, code, src, linkText, linkHref, mark] = m
    if (fig !== undefined) nodes.push({kind: 'diagram', value: fig})
    else if (math !== undefined) nodes.push({ kind: 'math', value: math })
    else if (mark !== undefined) nodes.push({ kind: mark === '✓' ? 'yes' : 'no', value: mark })
    else if (bold !== undefined) nodes.push({ kind: 'bold', value: bold })
    else if (italic !== undefined) nodes.push({ kind: 'italic', value: italic })
    else if (eng !== undefined) nodes.push({ kind: 'eng', value: eng })
    else if (term !== undefined) nodes.push({ kind: 'term', value: term })
    else if (code !== undefined) nodes.push({ kind: 'code', value: code })
    else if (src !== undefined) nodes.push({ kind: 'src', value: src })
    else if (linkText !== undefined) nodes.push({ kind: 'link', value: linkText, href: linkHref })
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/** Never turn lesson-source Markdown links into executable browser URLs. */
function safeTheoryLink(href: string | undefined): string | null {
  if (!href) return null
  const url = href.trim()
  if (!url || /[\\\u0000-\u001f\u007f]/.test(url) || url.startsWith('//')) return null
  const scheme = /^[a-z][a-z\d+.-]*:/i.exec(url)?.[0].toLowerCase()
  if (scheme && scheme !== 'https:' && scheme !== 'http:') return null
  return url
}

function renderNode(node: Node, key: number) {
  if (typeof node === 'string') {
    // majburiy satr ko'chirish (kitobdagi \\)
    const lines = node.split('\n')
    return (
      <Fragment key={key}>
        {lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Fragment>
    )
  }

  switch (node.kind) {
    case 'diagram':
      return <MantiqCircuit key={key} id={node.value} />
    case 'math':
      return (
        <span
          key={key}
          className="book-math"
          dangerouslySetInnerHTML={{ __html: renderMath(node.value, false) }}
        />
      )
    case 'bold':
      return <strong key={key} className="book-bold">{node.value}</strong>
    case 'italic':
      return <em key={key}>{node.value}</em>
    case 'eng':
      return <em key={key} className="book-eng">{node.value}</em>
    case 'term':
      return <span key={key} className="book-term">{node.value}</span>
    case 'code':
      return <code key={key} className="book-code">{node.value}</code>
    case 'src':
      return <span key={key} className="book-src">{node.value}</span>
    case 'yes':
      return <span key={key} className="book-yes" aria-label="to‘g‘ri">✓</span>
    case 'no':
      return <span key={key} className="book-no" aria-label="noto‘g‘ri">✗</span>
    case 'link': {
      const href = safeTheoryLink(node.href)
      if (!href) return <Fragment key={key}>{node.value}</Fragment>
      return (
        <a key={key} href={href} target="_blank" rel="noreferrer noopener" className="book-link">
          {node.value}
        </a>
      )
    }
    default:
      return <Fragment key={key}>{node.value}</Fragment>
  }
}

/** Bir qatorlik matnni mini-format bo'yicha chizadi. */
export default function InlineText({ text }: { text: string }) {
  const nodes = useMemo(() => tokenize(text), [text])
  return <>{nodes.map(renderNode)}</>
}

/** Matematikasiz oddiy matn (sarlavha, `title` atributi va h.k. uchun). */
export function plainText(text: string): string {
  return text
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/==([^=]+)==/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/@@([^@]+)@@/g, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}
