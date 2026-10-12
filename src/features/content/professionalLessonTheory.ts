/**
 * Convert canonical published lesson markdown to the learner's existing rich
 * TheoryBlock UI. No raw HTML injection or answer keys. This is a rendering
 * adapter, not a copy of Telegram channel contents.
 */
import type { TheoryBlock, TopicContent } from '../../data/topicContent'
import type { LessonSummary } from './contentApi'

const markdownTableSeparator = /^\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?$/
const rowCells = (line: string): string[] =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(x => x.trim())

export function markdownToTheoryBlocks(markdown: string): TheoryBlock[] {
  const result: TheoryBlock[] = []
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  let paragraph: string[] = []
  const flush = () => {
    const text = paragraph.join('\n').trim()
    if (text) result.push({ type: 'text', content: text })
    paragraph = []
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) { flush(); continue }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line)
    if (heading) {
      flush()
      result.push({ type: heading[1].length <= 2 ? 'heading' : 'subheading', content: heading[2] })
      continue
    }
    if (line.startsWith('|') && i+1 < lines.length && markdownTableSeparator.test(lines[i+1].trim())) {
      flush()
      const headers = rowCells(line)
      const rows: string[][] = []
      i += 2
      for (; i < lines.length && lines[i].trim().startsWith('|'); i++) {
        const cells = rowCells(lines[i])
        if (cells.length === headers.length) rows.push(cells)
      }
      i -= 1
      result.push({ type:'table', content:'', headers, rows })
      continue
    }
    if (/^[-*]\s+/.test(line) || /^\d+[.)]\s+/.test(line)) {
      flush()
      const ordered = /^\d+[.)]\s+/.test(line)
      const items: string[] = [line.replace(/^([-*]|\d+[.)])\s+/, '')]
      for (; i+1 < lines.length; i++) {
        const n = lines[i+1].trim()
        if (!(ordered ? /^\d+[.)]\s+/.test(n) : /^[-*]\s+/.test(n))) break
        items.push(n.replace(/^([-*]|\d+[.)])\s+/, ''))
      }
      result.push({ type:'list', content:'', items, ordered })
      continue
    }
    if (/^\*\*Manba izi:/.test(line) || /^Manba:/.test(line)) {
      flush()
      result.push({ type:'source', content: line })
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
  const theory = markdownToTheoryBlocks(lesson.body_mdx)
  if (!theory.length) return staticContent
  return {
    ...staticContent,
    title: lesson.title_uz || staticContent.title,
    theory,
    // Preserve static questions only as existing offline fallback.
    // Backend-first quizzes and answer validation remain server-authoritative.
    questions: staticContent.questions,
  }
}
