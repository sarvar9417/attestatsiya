import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M03_04_CANONICAL_BOOK } from '../data/topics/m03ExcelFoundationsCanonicalBook'
import { M15_04_CANONICAL_BOOK } from '../data/topics/m15LessonPlanningCanonicalBook'
import { M03_OFFICE_TEXTBOOK_ADDITIONS } from '../data/topics/m03OfficeTextbookAdditions'
import { getPedagogyStudyNotes, withPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-287: full source-guided Excel introduction and lesson-planning books', () => {
  const chapters = [
    { id: 'M03.04', book: M03_04_CANONICAL_BOOK, minBlocks: 61, minSections: 12, source: 'Cambridge+' },
    { id: 'M15.04', book: M15_04_CANONICAL_BOOK, minBlocks: 65, minSections: 15, source: 'Mirzayeva' },
  ] as const

  for (const { id, book, minBlocks, minSections, source } of chapters) {
    it(`${id} is a substantive linear textbook-based chapter rather than a shallow summary`, () => {
      const topic = getTopicContent(id)
      expect(topic).toBeDefined()
      if (!topic) return
      expect(topic.source).toContain(source)
      expect(topic.kind).toBe('chapter')
      expect(book.length).toBeGreaterThanOrEqual(minBlocks)
      expect(book.filter(block => block.type === 'heading')).toHaveLength(minSections)
      for (const type of ['goal', 'intro', 'definition', 'table', 'text', 'case', 'solved', 'trap', 'task', 'answers', 'summary', 'source']) {
        expect(book.some(x => x.type === type), `${id} missing ${type}`).toBe(true)
      }
      expect(topic.theory.slice(0, book.length)).toEqual(book)
      expect(splitSections(topic.theory).flatMap(section => section.blocks)).toEqual(topic.theory)
      expect(splitSections(topic.theory).length).toBeGreaterThanOrEqual(minSections)
      expect(book.at(-1)?.content).toContain('drive.google.com')
      expect(book.at(-1)?.content).toMatch(/sahifama-sahifa/i)
    })
  }

  it('M03.04 keeps all original questions/keys and genuine reviewed Office additions', () => {
    const topic = getTopicContent('M03.04')!
    expect(topic.questions).toHaveLength(4)
    expect(topic.questions.map(q => q.id)).toEqual([1, 2, 3, 4].map(n => `M03.04-q${n}`))
    expect(topic.questions.map(q => q.correctIndex)).toEqual([1, 2, 1, 1])
    const additions = M03_OFFICE_TEXTBOOK_ADDITIONS['M03.04']
    expect(additions.length).toBeGreaterThan(0)
    expect(topic.theory).toHaveLength(M03_04_CANONICAL_BOOK.length + additions.length)
    expect(topic.theory.slice(-additions.length)).toEqual(additions)
    // Deliberate: no second copy of the 5 legacy one-paragraph summary blocks.
    expect(topic.theory.some(block => block.content.startsWith('MS Excel — Microsoft elektron jadval dasturi.'))).toBe(false)
  })

  it('M15.04 keeps its source notes in the same reader without reintroducing the short summary', () => {
    const topic = getTopicContent('M15.04')!
    expect(topic.questions).toEqual([])
    expect(topic.theory).toEqual(M15_04_CANONICAL_BOOK)
    const notes = getPedagogyStudyNotes('M15.04')
    expect(notes.length).toBeGreaterThan(0)
    const enriched = withPedagogyStudyNotes(topic)
    expect(enriched.theory.slice(0, topic.theory.length)).toEqual(topic.theory)
    expect(enriched.theory.slice(-notes.length)).toEqual(notes)
    expect(enriched.questions).toBe(topic.questions)
    expect(splitSections(enriched.theory).flatMap(section => section.blocks)).toEqual(enriched.theory)
  })

  it('does not overwrite neighboring brief lessons or their assessments', () => {
    for (const id of ['M03.06', 'M15.05']) {
      const topic = getTopicContent(id)!
      expect(topic).toBeDefined()
      expect(topic.theory[0]).not.toEqual(M03_04_CANONICAL_BOOK[0])
      expect(topic.theory[0]).not.toEqual(M15_04_CANONICAL_BOOK[0])
    }
  })
})
