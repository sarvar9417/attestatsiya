import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { splitSections } from '../components/learning/theory/BookReader'
import { M11_WEB_TEXTBOOK_ADDITIONS } from '../data/topics/m11WebTextbookAdditions'
import { M11_01_CANONICAL_BOOK } from '../data/topics/m11HtmlFoundationsCanonicalBook'
import { M11_02_CANONICAL_BOOK } from '../data/topics/m11HtmlTextImagesCanonicalBook'
import { M11_03_CANONICAL_BOOK } from '../data/topics/m11HtmlTablesFormsCanonicalBook'

describe('TASK-305: source-guided M11.01–03 HTML reader parity', () => {
  const specs = [
    { id: 'M11.01', book: M11_01_CANONICAL_BOOK, keys: [0, 1, 1], types: ['Y1', 'Y1', 'Y2'] },
    { id: 'M11.02', book: M11_02_CANONICAL_BOOK, keys: [1, 1, 2], types: ['Y1', 'Y1', 'Y1'] },
    { id: 'M11.03', book: M11_03_CANONICAL_BOOK, keys: [1, 1], types: ['Y1', 'Y1'] },
  ] as const

  for (const { id, book, keys, types } of specs) {
    it(`${id}: long HTML source book comes before reviewed appendices`, () => {
      const topic = getTopicContent(id)!
      const appendix = M11_WEB_TEXTBOOK_ADDITIONS[id]
      expect(topic).toBeDefined()
      expect(topic.kind).toBe('chapter')
      expect(topic.source).toContain('Cambridge+')
      expect(book.length).toBeGreaterThanOrEqual(70)
      expect(book.filter(x => x.type === 'heading')).toHaveLength(12)
      expect(book.filter(x => x.type === 'code').length).toBeGreaterThan(0)
      for (const type of ['goal', 'intro', 'table', 'heading', 'definition', 'example', 'case', 'solved', 'trap', 'task', 'answers', 'summary', 'source']) {
        expect(book.some(x => x.type === type), `${id} missing ${type}`).toBe(true)
      }
      expect(book.at(-1)?.content).toContain('drive.google.com')
      expect(book.at(-1)?.content).toMatch(/1:1/)
      expect(topic.theory.slice(0, book.length)).toEqual(book)
      expect(topic.theory.slice(-appendix.length)).toEqual(appendix)
      expect(topic.theory).toHaveLength(book.length + appendix.length)
      expect(splitSections(topic.theory).flatMap(page => page.blocks)).toEqual(topic.theory)
      expect(splitSections(topic.theory).length).toBe(13)
    })

    it(`${id}: retains all static exam keys and question types`, () => {
      const questions = getTopicContent(id)!.questions
      expect(questions.map(q => q.id)).toEqual(keys.map((_, i) => `${id}-q${i + 1}`))
      expect(questions.map(q => q.correctIndex)).toEqual(keys)
      expect(questions.map(q => q.type)).toEqual(types)
    })
  }

  it('corrects HTML headings semantics vs default font size', () => {
    const q = getTopicContent('M11.01')!.questions[1]
    expect(q.text).toContain('eng yuqori darajali')
    expect(q.explanation).toContain('CSS')
    expect(q.correctIndex).toBe(1)
  })

  it('does not falsely claim src is the only possible image source attribute', () => {
    const q = getTopicContent('M11.02')!.questions[2]
    expect(q.text).toContain('oddiy fayl manzilini')
    expect(q.explanation).toContain('srcset')
    expect(q.correctIndex).toBe(2)
  })

  it('teaches that masking password text is not encryption or backend protection', () => {
    const q = getTopicContent('M11.03')!.questions[1]
    expect(q.explanation).toContain('avtomatik shifrlamaydi')
    const bookText = M11_03_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(bookText).toContain('HTTPS')
    expect(bookText).toContain('server')
  })

  it('does not disturb existing M11.04–05 or previously merged graphics chapters', () => {
    expect(getTopicContent('M11.04')?.theory.length).toBeGreaterThan(0)
    expect(getTopicContent('M11.05')?.theory.length).toBeGreaterThan(0)
    expect(getTopicContent('M10.01')?.theory.length).toBeGreaterThanOrEqual(70)
  })
})
