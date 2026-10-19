import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M03_02_CANONICAL_BOOK, M03_03_CANONICAL_BOOK } from '../data/topics/m03WordAdvancedCanonicalBooks'
import { M15_03_CANONICAL_BOOK } from '../data/topics/m15UpbringingCanonicalBook'
import { M03_OFFICE_TEXTBOOK_ADDITIONS } from '../data/topics/m03OfficeTextbookAdditions'
import { getPedagogyStudyNotes, withPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-286: next three deeply sourced lessons', () => {
  const cases = [
    { id: 'M03.02', book: M03_02_CANONICAL_BOOK, minBlocks: 52, minSections: 11, source: 'Cambridge' },
    { id: 'M03.03', book: M03_03_CANONICAL_BOOK, minBlocks: 57, minSections: 13, source: 'Cambridge' },
    { id: 'M15.03', book: M15_03_CANONICAL_BOOK, minBlocks: 55, minSections: 12, source: 'Mirzayeva' },
  ] as const

  for (const { id, book, minBlocks, minSections, source } of cases) {
    it(`${id}: the first reading is a substantive authored book before the previous summary`, () => {
      const topic = getTopicContent(id)!
      expect(topic.source).toContain(source)
      expect(topic.kind).toBe('chapter')
      expect(book.length).toBeGreaterThanOrEqual(minBlocks)
      expect(book.filter(x => x.type === 'heading').length).toBeGreaterThanOrEqual(minSections)
      for (const type of ['goal', 'intro', 'definition', 'text', 'table', 'example', 'solved', 'trap', 'task', 'answers', 'summary', 'source']) {
        expect(book.some(block => block.type === type), `${id} missing ${type}`).toBe(true)
      }
      expect(topic.theory.slice(0, book.length)).toEqual(book)
      expect(topic.theory[book.length]).toEqual({ type: 'heading', content: 'Oldingi qisqa konspekt va manbaviy izohlar' })
      expect(topic.theory.length).toBeGreaterThan(book.length + 3)
      expect(splitSections(topic.theory).flatMap(section => section.blocks)).toEqual(topic.theory)
      expect(splitSections(topic.theory).length).toBeGreaterThanOrEqual(minSections)
      expect(book.at(-1)?.type).toBe('source')
      expect(book.at(-1)?.content).toContain('drive.google.com')
      expect(book.at(-1)?.content).toMatch(/sahifama-sahifa/i)
    })
  }

  for (const [id, book] of [['M03.02', M03_02_CANONICAL_BOOK], ['M03.03', M03_03_CANONICAL_BOOK]] as const) {
    it(`${id}: preserves all four original assessment questions and verified Office notes`, () => {
      const topic = getTopicContent(id)!
      expect(topic.questions).toHaveLength(4)
      expect(topic.questions.map(q => q.id)).toEqual([1,2,3,4].map(n => `${id}-q${n}`))
      expect(topic.questions.every(q => q.correctIndex >= 0 && q.correctIndex < q.options.length)).toBe(true)
      const notes = M03_OFFICE_TEXTBOOK_ADDITIONS[id]
      expect(notes.length).toBeGreaterThan(0)
      expect(topic.theory.slice(-notes.length)).toEqual(notes)
      expect(topic.theory.slice(0, book.length)).toEqual(book)
    })
  }

  it('M15.03 retains pedagogy notes and does not add offline exam keys', () => {
    const topic = getTopicContent('M15.03')!
    const notes = getPedagogyStudyNotes('M15.03')
    expect(notes.length).toBeGreaterThan(0)
    const enriched = withPedagogyStudyNotes(topic)
    expect(enriched.theory.slice(0, topic.theory.length)).toEqual(topic.theory)
    expect(enriched.theory.slice(-notes.length)).toEqual(notes)
    expect(enriched.questions).toBe(topic.questions)
    expect(topic.questions).toEqual([])
  })

  it('next brief lessons retain their own independent material', () => {
    for (const id of ['M03.04', 'M15.04']) {
      const topic = getTopicContent(id)!
      expect(topic.theory[0]).not.toEqual(M03_02_CANONICAL_BOOK[0])
      expect(topic.theory[0]).not.toEqual(M03_03_CANONICAL_BOOK[0])
      expect(topic.theory[0]).not.toEqual(M15_03_CANONICAL_BOOK[0])
    }
  })
})
