/**
 * Adapts source-backed lessons into meaningful theory blocks instead of flattening
 * headings, tables, emphasis and examples into visually identical paragraphs.
 *
 * The first eight M15 lessons remain the curated core. Only published and
 * explicitly marked source supplements join the main book; short server
 * summaries never replace the textbook-backed core.
 */
import type { TheoryBlock, TopicContent } from '../../data/topicContent'
import type { LessonSummary } from './contentApi'
import { M16_SOURCE_THEORY_ADDITIONS } from '../../data/topics/m16SourceTheoryAdditions'
import { M14_NORMATIVE_SOURCE_ADDITIONS } from '../../data/topics/m14NormativeSourceAdditions'

const rowCells = (line: string): string[] =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim())

const isTableDivider = (line: string): boolean => {
  const cells = rowCells(line)
  return cells.length >= 2 && cells.every(cell => /^:?-{3,}:?$/.test(cell))
}

const SUPPLEMENT_HEADING = /^##\s+Chuqurlashtirilgan nazariya\s+—\s+manba korpusi/i
const sourceLine = /^(?:>\s*)?(?:\*\*)?Manba(?: izi|lar)?\s*:(?:\*\*)?/i

export function markdownToTheoryBlocks(markdown: string): TheoryBlock[] {
  const result: TheoryBlock[] = []
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  let paragraph: string[] = []
  let currentSection = ''

  const flush = () => {
    const content = paragraph.join(' ').trim()
    paragraph = []
    if (!content) return
    const text = content.replace(/^(?:>\s*)/, '')
    const type: TheoryBlock['type'] = sourceLine.test(text)
      ? 'source'
      : /(?:tuzog['‘’]?i|ko['‘’]?p uchraydigan xato|chalkash)/i.test(currentSection)
        ? 'trap'
        : /^(?:Maqsad|O['‘’]?quv maqsadi)$/i.test(currentSection)
          ? 'goal'
          : /^(?:Vaziyat|Misol|Amaliy|Diagnostik)/i.test(currentSection)
            ? 'example'
            : 'text'
    result.push({ type, content: text })
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) { flush(); continue }
    // Migration markers and Markdown comments are metadata, not learner-facing prose.
    if (/^<!--.*-->$/.test(line)) { flush(); continue }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line)
    if (heading) {
      flush()
      currentSection = heading[2].trim()
      result.push({
        type: heading[1].length <= 2 ? 'heading' : 'subheading',
        content: currentSection,
      })
      continue
    }

    // Preserve fenced examples as one formatted block, not raw backticks
    // and separately rendered lines/Markdown headings.
    const fence = /^(`{3,}|~{3,})([^\s`~]*)\s*$/.exec(line)
    if (fence) {
      flush()
      const marker = fence[1]
      const code: string[] = []
      while (i + 1 < lines.length && !lines[i + 1].trim().startsWith(marker)) {
        code.push(lines[++i])
      }
      if (i + 1 < lines.length) i++
      result.push({ type: 'code', content: code.join('\n'), language: fence[2] || undefined })
      continue
    }

    if (line.startsWith('|') && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      flush()
      const headers = rowCells(line)
      const rows: string[][] = []
      i += 2
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = rowCells(lines[i])
        if (cells.length === headers.length) rows.push(cells)
        i++
      }
      i--
      result.push({
        type: 'table',
        headers,
        rows,
        content: [
          '| ' + headers.join(' | ') + ' |',
          '| ' + headers.map(() => '---').join(' | ') + ' |',
          ...rows.map(row => '| ' + row.join(' | ') + ' |'),
        ].join('\n'),
      })
      continue
    }

    const listMatch = /^([-*]|\d+[.)])\s+(.+)$/.exec(line)
    if (listMatch) {
      flush()
      const ordered = /^\d/.test(listMatch[1])
      const items = [listMatch[2]]
      while (i + 1 < lines.length) {
        const next = /^([-*]|\d+[.)])\s+(.+)$/.exec(lines[i + 1].trim())
        if (!next || /^\d/.test(next[1]) !== ordered) break
        items.push(next[2])
        i++
      }
      result.push({ type: 'list', content: items.join('\n'), items, ordered })
      continue
    }

    if (line.startsWith('>')) {
      flush()
      const content = line.replace(/^>\s*/, '')
      result.push({ type: sourceLine.test(content) ? 'source' : 'note', content })
      continue
    }
    paragraph.push(line)
  }
  flush()
  return result
}

export function overlayPublishedProfessionalLesson(
  staticContent: TopicContent,
  lesson: LessonSummary,
): TopicContent {
  if (lesson.status !== 'published' || !lesson.body_mdx?.trim()) return staticContent

  const sections = lesson.body_mdx.replace(/\r\n?/g, '\n').split('\n')
  const extraIndex = sections.findIndex(line => SUPPLEMENT_HEADING.test(line.trim()))
  const coreMarkdown = extraIndex < 0 ? lesson.body_mdx : sections.slice(0, extraIndex).join('\n')
  const extraMarkdown = extraIndex < 0 ? '' : sections.slice(extraIndex + 1).join('\n')
  const theory = markdownToTheoryBlocks(coreMarkdown)
  // Independently checked professional-standard/Cambridge explanations are
  // displayed after the canonical M16 published core. They do not modify the DB.
  const sourceAdditions = M16_SOURCE_THEORY_ADDITIONS[staticContent.subtopicId] ?? M14_NORMATIVE_SOURCE_ADDITIONS[staticContent.subtopicId] ?? []
  if (!theory.length) return staticContent

  // M14 used to repeat part of its reviewed professional-standard explanation
  // in a collapsed card below BookReader. Put distinct authored material in
  // the same linear chapter. Never replace the published canonical text.
  const m14Legacy = /^M14\.0[1-7]$/.test(staticContent.subtopicId)
    ? staticContent.theory.filter(block =>
        !sourceAdditions.includes(block) &&
        ['heading', 'subheading', 'definition', 'text', 'table', 'example', 'case', 'note', 'source', 'trap'].includes(block.type))
    : []
  const publishedCore = appendDistinctTheory(theory, m14Legacy)
  const withSources = appendDistinctTheory(publishedCore, sourceAdditions)
  // The published M14/M16 deep source corpus is canonical reading too; for
  // M02/M15 it is handled separately to retain their curated main chapters.
  const deeper = extraMarkdown.trim() ? markdownToTheoryBlocks(extraMarkdown) : []
  const isCanonicalProfessional = /^M1[46]\.\d{2}$/.test(staticContent.subtopicId)

  return {
    ...staticContent,
    title: lesson.title_uz || staticContent.title,
    theory: isCanonicalProfessional ? appendDistinctTheory(withSources, deeper) : withSources,
    supplementalTheory: !isCanonicalProfessional && deeper.length > 0 ? deeper : undefined,
    // Keep the existing offline static quiz as fallback. Live scoring remains on the backend.
    questions: staticContent.questions,
  }
}

/**
 * Deduplicate repeated source blocks while preserving authored order and
 * references. This helper never mutates the canonical questions or content.
 */
export function appendDistinctTheory(existing: TheoryBlock[], extras: TheoryBlock[]): TheoryBlock[] {
  if (extras.length === 0) return existing
  const fingerprint = (block: TheoryBlock) =>
    `${block.type}: ${block.content.replace(/\s+/g, ' ').trim()}`
  const seen = new Set(existing.map(fingerprint))
  const unique = extras.filter(block => {
    const key = fingerprint(block)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return unique.length ? [...existing, ...unique] : existing
}

/**
 * M02 and M15 must keep their original complete local chapters, rather than
 * displaying a short remote summary as the book. Only source-marked sections
 * from a PUBLISHED remote lesson join the primary reading flow, and the API
 * finishes before the first BookReader render to avoid reflow mid-reading.
 */
export function resolveLearnerTheoryContent(
  subtopicId: string,
  staticContent: TopicContent,
  publishedContent?: TopicContent | null,
): TopicContent {
  if (!/^M(?:02|15)\./.test(subtopicId)) return publishedContent ?? staticContent
  if (!publishedContent || publishedContent === staticContent) return staticContent
  const isM02 = subtopicId.startsWith('M02.')
  const extras = isM02 ? verifiedM02Supplement(publishedContent) : (publishedContent.supplementalTheory ?? [])
  if (extras.length === 0) return staticContent
  const withHeading: TheoryBlock[] = isM02 ? extras : [
    { type: 'heading', content: 'Manba korpusidan chuqurlashtirilgan nazariya' },
    ...extras,
  ]
  const merged = appendDistinctTheory(staticContent.theory, withHeading)
  return merged === staticContent.theory ? staticContent : {
    ...staticContent,
    theory: merged,
    supplementalTheory: undefined,
  }
}


/** A source-checked M02 addendum is never used to replace its full canonical book. */
export function verifiedM02Supplement(publishedContent: TopicContent | null): TheoryBlock[] {
  if (!publishedContent) return []
  const index = publishedContent.theory.findIndex(
    block => block.type === 'heading' && /^Tekshirilgan qo‘shimcha:/i.test(block.content),
  )
  return index < 0 ? [] : publishedContent.theory.slice(index)
}
