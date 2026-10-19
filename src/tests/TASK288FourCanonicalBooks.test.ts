import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M03_06_CANONICAL_BOOK, M03_07_CANONICAL_BOOK } from '../data/topics/m03ExcelAnalysisCanonicalBooks'
import { M15_05_CANONICAL_BOOK, M15_06_CANONICAL_BOOK } from '../data/topics/m15ProfessionalPracticeCanonicalBooks'
import { M03_OFFICE_TEXTBOOK_ADDITIONS } from '../data/topics/m03OfficeTextbookAdditions'
import { withPedagogyStudyNotes, getPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-288 four sourced and coherent books', () => {
  const chapters = [
    ['M03.06', M03_06_CANONICAL_BOOK, 55, 12],
    ['M03.07', M03_07_CANONICAL_BOOK, 54, 12],
    ['M15.05', M15_05_CANONICAL_BOOK, 53, 12],
    ['M15.06', M15_06_CANONICAL_BOOK, 53, 12],
  ] as const
  for (const [id, book, minBlocks, sectionCount] of chapters) {
    it(`${id} is the first reading with full educational structure and source trace`, () => {
      const topic = getTopicContent(id)!
      expect(topic).toBeDefined()
      expect(topic.kind).toBe('chapter')
      expect(topic.source).toBeTruthy()
      expect(book.length).toBeGreaterThanOrEqual(minBlocks)
      expect(book.filter(block => block.type === 'heading')).toHaveLength(sectionCount)
      for (const type of ['goal','intro','definition','table','case','solved','trap','task','answers','summary','source']) {
        expect(book.some(block => block.type === type), `${id}: ${type}`).toBe(true)
      }
      expect(topic.theory.slice(0, book.length)).toEqual(book)
      expect(splitSections(topic.theory).flatMap(s => s.blocks)).toEqual(topic.theory)
      expect(book.at(-1)?.content).toContain('drive.google.com')
    })
  }

  for (const [id,book] of [['M03.06',M03_06_CANONICAL_BOOK], ['M03.07',M03_07_CANONICAL_BOOK]] as const) {
    it(`${id} preserves four quiz questions and exact source appendix`, () => {
      const topic = getTopicContent(id)!
      expect(topic.questions.map(q => q.id)).toEqual([1,2,3,4].map(i => `${id}-q${i}`))
      expect(topic.questions.map(q => q.correctIndex)).toEqual([1,1,1,1])
      const additions = M03_OFFICE_TEXTBOOK_ADDITIONS[id]
      expect(additions.length).toBeGreaterThan(0)
      expect(topic.theory).toHaveLength(book.length + additions.length)
      expect(topic.theory.slice(-additions.length)).toEqual(additions)
    })
  }

  for (const id of ['M15.05','M15.06']) {
    it(`${id} retains server-only assessment and all pedagogy evidence notes`, () => {
      const topic = getTopicContent(id)!
      expect(topic.questions).toEqual([])
      const notes = getPedagogyStudyNotes(id)
      expect(notes.length).toBeGreaterThan(0)
      const enriched = withPedagogyStudyNotes(topic)
      expect(enriched.theory.slice(0, topic.theory.length)).toEqual(topic.theory)
      expect(enriched.theory.slice(-notes.length)).toEqual(notes)
      expect(enriched.questions).toBe(topic.questions)
    })
  }
  it('leaves neighboring remaining brief topics isolated', () => {
    for (const id of ['M03.08','M15.07']) {
      const topic = getTopicContent(id)!
      expect(topic.theory[0]).not.toEqual(M03_06_CANONICAL_BOOK[0])
      expect(topic.theory[0]).not.toEqual(M15_05_CANONICAL_BOOK[0])
    }
  })
})
