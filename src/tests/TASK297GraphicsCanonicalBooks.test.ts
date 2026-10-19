import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M10_GRAPHICS_TEXTBOOK_ADDITIONS } from '../data/topics/m10GraphicsTextbookAdditions'
import { M10_01_CANONICAL_BOOK } from '../data/topics/m10GraphicsFundamentalsCanonicalBook'
import { M10_02_CANONICAL_BOOK } from '../data/topics/m10PaintPhotoshopCanonicalBook'
import { M10_03_CANONICAL_BOOK } from '../data/topics/m10SelectionsLayersCanonicalBook'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-297 — coherent source-guided M10 graphics textbooks', () => {
  const books = [
    { id: 'M10.01', book: M10_01_CANONICAL_BOOK, chapters: 13, keys: [2, 1, 1] },
    { id: 'M10.02', book: M10_02_CANONICAL_BOOK, chapters: 12, keys: [1, 1, 2] },
    { id: 'M10.03', book: M10_03_CANONICAL_BOOK, chapters: 12, keys: [1, 1] },
  ] as const

  for (const { id, book, chapters, keys } of books) {
    it(`${id} renders the full authored book first with natural sections and no duplicated old summary`, () => {
      const topic = getTopicContent(id)!
      expect(topic).toBeDefined()
      expect(topic.kind).toBe('chapter')
      expect(topic.source).toBeTruthy()
      expect(book.length).toBeGreaterThanOrEqual(65)
      expect(book.filter(block => block.type === 'heading')).toHaveLength(chapters)
      for (const type of ['goal', 'intro', 'heading', 'definition', 'table', 'example', 'case', 'solved', 'trap', 'task', 'answers', 'summary', 'source']) {
        expect(book.some(block => block.type === type), `${id} missing ${type}`).toBe(true)
      }
      expect(topic.theory.slice(0, book.length)).toEqual(book)
      const appendix = M10_GRAPHICS_TEXTBOOK_ADDITIONS[id]
      expect(appendix.length).toBeGreaterThan(0)
      expect(topic.theory).toHaveLength(book.length + appendix.length)
      expect(topic.theory.slice(-appendix.length)).toEqual(appendix)
      expect(splitSections(topic.theory).flatMap(x => x.blocks)).toEqual(topic.theory)
      expect(splitSections(topic.theory).length).toBe(chapters + 1)
      expect(book.at(-1)?.content).toContain('drive.google.com')
      expect(book.at(-1)?.content).toMatch(/1:1/)
    })

    it(`${id} preserves all original offline assessment identifiers and answer indexes`, () => {
      const questions = getTopicContent(id)!.questions
      expect(questions.map(q => q.id)).toEqual(keys.map((_, i) => `${id}-q${i + 1}`))
      expect(questions.map(q => q.correctIndex)).toEqual(keys)
    })
  }

  it('corrects the 2026 Paint layers misconception in both theory and assessment', () => {
    const topic = getTopicContent('M10.02')!
    const text = topic.theory.map(block => block.content).join('\n')
    const quiz = topic.questions[0]
    expect(text).toContain('Windows 11')
    expect(text).toContain('qatlamlar')
    expect(text).toContain('Smart Object')
    expect(text).toContain('Layer Mask')
    expect(quiz.text).toContain('Paint ham qatlamlarni')
    expect(quiz.options[1]).toContain('Smart Object')
    expect(quiz.correctIndex).toBe(1)
    expect(quiz.explanation).toContain('Paintda ham qatlamlar bor')
    expect(quiz.options[2]).toContain('faqat Photoshopda')
    expect(quiz.options[2]).not.toBe(quiz.options[1])
  })

  it('leaves neighboring M10.04–M10.07 and M11 topics intact', () => {
    for (const id of ['M10.04', 'M10.05', 'M10.06', 'M10.07', 'M11.01']) {
      const topic = getTopicContent(id)!
      expect(topic.theory.length).toBeGreaterThan(0)
      expect(topic.theory[0]).not.toEqual(M10_01_CANONICAL_BOOK[0])
    }
  })

  it('has a worked uncompressed RGB memory example and formal source caveat', () => {
    const theory = M10_01_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(theory).toContain('1 440 000 bayt')
    expect(theory).toContain('RGB')
    expect(theory).toContain('CMYK')
    expect(theory).toContain('SVG')
    expect(theory).toContain('PPI')
  })
})
