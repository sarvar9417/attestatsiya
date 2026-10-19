import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M03_01_CANONICAL_BOOK } from '../data/topics/m03WordCanonicalBook'
import { M15_02_CANONICAL_BOOK } from '../data/topics/m15LearningPrinciplesCanonicalBook'
import { getPedagogyStudyNotes, withPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-285: authentic source-guided full reading chapters', () => {
  const chapters = [
    { id: 'M03.01', book: M03_01_CANONICAL_BOOK, source: 'Cambridge', minHeadings: 12 },
    { id: 'M15.02', book: M15_02_CANONICAL_BOOK, source: 'Mirzayeva', minHeadings: 13 },
  ] as const

  for (const { id, book, source, minHeadings } of chapters) {
    it(`${id} begins with a substantive self-contained book and preserves the earlier theory`, () => {
      const topic = getTopicContent(id)
      expect(topic).toBeDefined()
      if (!topic) return
      expect(topic.source).toContain(source)
      expect(topic.kind).toBe('chapter')
      expect(book.length).toBeGreaterThanOrEqual(58)
      expect(book.filter(x => x.type === 'heading').length).toBeGreaterThanOrEqual(minHeadings)
      for (const type of ['goal', 'intro', 'definition', 'table', 'example', 'solved', 'trap', 'task', 'answers', 'summary', 'source']) {
        expect(book.some(block => block.type === type), `${id}: ${type}`).toBe(true)
      }
      expect(topic.theory.slice(0, book.length)).toEqual(book)
      expect(topic.theory.length).toBeGreaterThan(book.length)
      expect(topic.theory[book.length].type).toBe('heading')
      expect(splitSections(topic.theory).flatMap(section => section.blocks)).toEqual(topic.theory)
      expect(splitSections(topic.theory).length).toBeGreaterThanOrEqual(minHeadings)
      expect(book.at(-1)?.content).toContain('drive.google.com')
      expect(book.at(-1)?.content).toMatch(/sahifama-sahifa/)
    })
  }

  it('M03.01 continues to expose original Word exam questions with their answer keys', () => {
    const topic = getTopicContent('M03.01')!
    expect(topic.questions).toHaveLength(4)
    expect(topic.questions.map(q => q.id)).toEqual([
      'M03.01-q1', 'M03.01-q2', 'M03.01-q3', 'M03.01-q4',
    ])
    expect(topic.questions.map(q => q.correctIndex)).toEqual([1, 1, 1, 1])
    expect(topic.theory.map(block => block.content).join('\n')).toContain('Ctrl+N')
    expect(topic.theory.map(block => block.content).join('\n')).toContain('Save As')
    expect(topic.theory.map(block => block.content).join('\n')).toContain('Shift+Enter')
  })

  it('M15.02 includes previously reviewed notes after the new full chapter', () => {
    const topic = getTopicContent('M15.02')!
    const notes = getPedagogyStudyNotes('M15.02')
    expect(notes.length).toBeGreaterThan(0)
    const enriched = withPedagogyStudyNotes(topic)
    expect(enriched.theory.slice(0, topic.theory.length)).toEqual(topic.theory)
    expect(enriched.theory.slice(-notes.length)).toEqual(notes)
    expect(enriched.questions).toBe(topic.questions)
    expect(splitSections(enriched.theory).flatMap(section => section.blocks)).toEqual(enriched.theory)
    const text = enriched.theory.map(block => block.content).join('\n')
    expect(text).toContain('Tizimlilik')
    expect(text).toContain('Ko‘rgazmalilik')
    expect(text).toContain('Informatika')
  })

  it('does not overwrite neighboring M03 or M15 lessons with the wrong book', () => {
    for (const id of ['M03.02', 'M03.03', 'M15.03', 'M15.04']) {
      const topic = getTopicContent(id)
      expect(topic).toBeDefined()
      expect(topic?.theory[0]).not.toEqual(M03_01_CANONICAL_BOOK[0])
      expect(topic?.theory[0]).not.toEqual(M15_02_CANONICAL_BOOK[0])
    }
  })
})
