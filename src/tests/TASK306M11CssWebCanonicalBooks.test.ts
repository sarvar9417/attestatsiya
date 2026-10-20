import { describe, expect, it } from 'vitest'
import { getTopicContent, displayedCognitiveLevel } from '../data/topicContent'
import { M11_WEB_TEXTBOOK_ADDITIONS } from '../data/topics/m11WebTextbookAdditions'
import { M11_04_CANONICAL_BOOK } from '../data/topics/m11HtmlLinksMediaCanonicalBook'
import { M11_05_CANONICAL_BOOK } from '../data/topics/m11CssColorsCanonicalBook'
import { M11_06_CANONICAL_BOOK } from '../data/topics/m11CssLayoutCanonicalBook'
import { M11_07_CANONICAL_BOOK } from '../data/topics/m11WebDesignQaCanonicalBook'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-306 — final four M11 continuous source-guided books', () => {
  const specs = [
    { id: 'M11.04', book: M11_04_CANONICAL_BOOK, keys: [1, 1], types: ['Y1', 'Y1'] },
    { id: 'M11.05', book: M11_05_CANONICAL_BOOK, keys: [1, 2, 2], types: ['Y1', 'Y1', 'Y2'] },
    { id: 'M11.06', book: M11_06_CANONICAL_BOOK, keys: [1, 1], types: ['Y1', 'Y2'] },
    { id: 'M11.07', book: M11_07_CANONICAL_BOOK, keys: [2, 1], types: ['Y1', 'Y2'] },
  ] as const

  for (const { id, book, keys, types } of specs) {
    it(`${id} has 12 natural headings, source attribution and a single BookReader`, () => {
      const data = getTopicContent(id)!
      const appendix = M11_WEB_TEXTBOOK_ADDITIONS[id]
      expect(data).toBeDefined()
      expect(data.kind).toBe('chapter')
      expect(data.source).toContain('Cambridge+')
      expect(book.length).toBeGreaterThanOrEqual(70)
      expect(book.filter(x => x.type === 'heading')).toHaveLength(12)
      for (const type of ['goal', 'intro', 'heading', 'definition', 'table', 'case', 'solved', 'example', 'trap', 'task', 'answers', 'summary', 'source']) {
        expect(book.some(x => x.type === type), `${id}: ${type}`).toBe(true)
      }
      expect(book.at(-1)?.type).toBe('source')
      expect(book.at(-1)?.content).toContain('drive.google.com')
      expect(book.at(-1)?.content).toContain('1:1')
      expect(data.theory.slice(0, book.length)).toEqual(book)
      expect(data.theory.slice(-appendix.length)).toEqual(appendix)
      expect(data.theory.length).toBe(book.length + appendix.length)
      const sections = splitSections(data.theory)
      expect(sections.flatMap(section => section.blocks)).toEqual(data.theory)
      expect(sections.length).toBe(13)
    })
    it(`${id} preserves static question IDs, answer indexes and cognitive levels`, () => {
      const questions = getTopicContent(id)!.questions
      expect(questions.map(x => x.id)).toEqual(keys.map((_, i) => `${id}-q${i+1}`))
      expect(questions.map(x => x.correctIndex)).toEqual(keys)
      expect(questions.map(x => displayedCognitiveLevel(x))).toEqual(types)
      expect(questions.every(x => x.type === 'Y1')).toBe(true)
    })
  }

  it('fixes target=_blank new context semantics without changing the key', () => {
    const questions = getTopicContent('M11.04')!.questions
    expect(questions[0].text).toContain('tab yoki oynada')
    expect(questions[0].correctIndex).toBe(1)
    expect(questions[0].explanation).toContain('noopener')
    const text = M11_04_CANONICAL_BOOK.map(b => b.content).join('\n')
    expect(text).toContain('iframe')
    expect(text).toContain('sandbox')
    expect(text).toContain('captions')
  })

  it('distinguishes cascade precedence from simple last-rule-wins', () => {
    const text = M11_05_CANONICAL_BOOK.map(b => b.content).join('\n')
    expect(text).toContain('specificity')
    expect(text).toContain('!important')
    expect(text).toContain('cascade layer')
    expect(text).toContain('WCAG')
    expect(text).toContain('#FF0000')
  })

  it('includes correct content-box and border-box arithmetic', () => {
    const text = M11_06_CANONICAL_BOOK.map(b => b.content).join('\n')
    expect(text).toContain('224px')
    expect(text).toContain('256px')
    expect(text).toContain('334px')
    expect(text).toContain('324px')
    expect(text).toContain('overflow-x')
  })

  it('separates markup validation, security and accessibility audits', () => {
    const text = M11_07_CANONICAL_BOOK.map(b => b.content).join('\n')
    expect(text).toContain('Nu HTML Checker')
    expect(text).toContain('CSS Validator')
    expect(text).toContain('XSS')
    expect(text).toContain('regressiya')
    expect(text).toContain('Ruxsatsiz deploy yo‘q')
  })

  it('preserves the first three M11 topics and other module boundaries', () => {
    for (const id of ['M11.01', 'M11.02', 'M11.03', 'M10.01']) {
      expect(getTopicContent(id)?.theory.length).toBeGreaterThan(0)
    }
  })
})
