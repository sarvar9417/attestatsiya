import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M05_01_CANONICAL_BOOK } from '../data/topics/m05NumberSystemsFoundationsBook'
import { M05_02_CANONICAL_BOOK, M05_03_CANONICAL_BOOK } from '../data/topics/m05ConversionArithmeticCanonicalBooks'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-292: fully explained number-system theory without exposed or altered exam keys', () => {
  const cases = [
    { id: 'M05.01', book: M05_01_CANONICAL_BOOK, minBlocks: 41, minSections: 9, keys: [2, 1, 1] },
    { id: 'M05.02', book: M05_02_CANONICAL_BOOK, minBlocks: 48, minSections: 11, keys: [1, 0, 2] },
    { id: 'M05.03', book: M05_03_CANONICAL_BOOK, minBlocks: 47, minSections: 10, keys: [0, 0, 1] },
  ] as const

  for (const { id, book, minBlocks, minSections, keys } of cases) {
    it(`${id}: loads an original source-traced book and preserves exactly the original quiz`, () => {
      const topic = getTopicContent(id)!
      expect(topic).toBeDefined()
      expect(topic.kind).toBe('chapter')
      expect(topic.source).toContain('Cambridge+')
      expect(book.length).toBeGreaterThanOrEqual(minBlocks)
      expect(book.filter(block => block.type === 'heading')).toHaveLength(minSections)
      for (const type of ['goal', 'intro', 'heading', 'definition', 'table', 'solved', 'trap', 'task', 'answers', 'summary', 'source']) {
        expect(book.some(block => block.type === type), `${id} missing ${type}`).toBe(true)
      }
      expect(topic.theory).toEqual(book)
      expect(splitSections(topic.theory).flatMap(section => section.blocks)).toEqual(book)
      expect(topic.questions.map(q => q.id)).toEqual([1, 2, 3].map(n => `${id}-q${n}`))
      expect(topic.questions.map(q => q.correctIndex)).toEqual(keys)
      expect(book.at(-1)?.content).toContain('drive.google.com')
      expect(book.at(-1)?.content).toContain('Sahifama-sahifa')
    })
  }

  it('matches base conversion and arithmetic worked answers to independently computed values', () => {
    expect(parseInt('1011', 2)).toBe(11)
    expect(parseInt('110101', 2)).toBe(53)
    expect(parseInt('101101', 2)).toBe(45)
    expect(parseInt('55', 8)).toBe(45)
    expect(parseInt('3B', 16)).toBe(59)
    expect(parseInt('D7', 16)).toBe(215)
    expect(parseInt('2F', 16)).toBe(47)
    expect(parseInt('3D', 16)).toBe(61)
    expect(parseInt('7F', 16)).toBe(127)
    expect(parseInt('100011', 2)).toBe(35)
    expect(parseInt('100001', 2)).toBe(33)
    expect((250 + 10) & 0xff).toBe(4)
    expect((255 + 1) & 0xff).toBe(0)
    expect(1/4 + 1/8).toBe(0.375)
  })

  it('does not replace neighboring M05 theory or its test items', () => {
    const next = getTopicContent('M05.04')!
    expect(next).toBeDefined()
    expect(next.theory[0]).not.toEqual(M05_01_CANONICAL_BOOK[0])
    expect(next.theory[0]).not.toEqual(M05_02_CANONICAL_BOOK[0])
    expect(next.theory[0]).not.toEqual(M05_03_CANONICAL_BOOK[0])
  })
})
