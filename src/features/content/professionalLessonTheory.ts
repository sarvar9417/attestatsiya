/**
 * Adapts source-backed lessons into meaningful theory blocks instead of flattening
 * headings, tables, emphasis and examples into visually identical paragraphs.
 *
 * The first eight M15 lessons remain the core curriculum. Optional 2026-10-18
 * source supplements are separated for progressive disclosure.
 */
import type { TheoryBlock, TopicContent } from '../../data/topicContent'
import type { LessonSummary } from './contentApi'

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
  if (!theory.length) return staticContent

  return {
    ...staticContent,
    title: lesson.title_uz || staticContent.title,
    theory,
    supplementalTheory: extraMarkdown.trim() ? markdownToTheoryBlocks(extraMarkdown) : undefined,
    // Keep the existing offline static quiz as fallback. Live scoring remains on the backend.
    questions: staticContent.questions,
  }
}

/**
 * M15 has a hand-designed, pedagogically structured primary lesson.
 * Server content is an optional deeper reading for M15, never a replacement.
 * This prevents the visible theory layout from switching after async fetch.
 * M14 and M16 retain their existing canonical backend-first behavior.
 */
export function resolveLearnerTheoryContent(
  subtopicId: string,
  staticContent: TopicContent,
  publishedContent?: TopicContent | null,
): TopicContent {
  if (subtopicId.startsWith('M15.')) return staticContent
  return publishedContent ?? staticContent
}
