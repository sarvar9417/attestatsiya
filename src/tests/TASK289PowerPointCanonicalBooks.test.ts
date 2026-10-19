import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M03_OFFICE_TEXTBOOK_ADDITIONS } from '../data/topics/m03OfficeTextbookAdditions'
import { M03_08_CANONICAL_BOOK } from '../data/topics/m03PowerPointDesignCanonicalBook'
import { M03_09_CANONICAL_BOOK } from '../data/topics/m03PowerPointMultimediaCanonicalBook'
import { M03_10_CANONICAL_BOOK } from '../data/topics/m03PowerPointAnimationCanonicalBook'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-289: PowerPoint chapters follow the complete M01-style reader', () => {
  const chapters = [
    ['M03.08', M03_08_CANONICAL_BOOK, [1, 1, 1, 1]],
    ['M03.09', M03_09_CANONICAL_BOOK, [1, 1, 1, 1]],
    ['M03.10', M03_10_CANONICAL_BOOK, [1, 2, 1, 1]],
  ] as const

  for (const [id, book, keys] of chapters) {
    it(`${id}: first reading contains 12 substantive sections with source trace`, () => {
      const topic = getTopicContent(id)!
      expect(topic).toBeDefined()
      expect(topic.kind).toBe('chapter')
      expect(topic.source).toContain('Cambridge+')
      expect(book.length).toBeGreaterThanOrEqual(65)
      expect(book.filter(block => block.type === 'heading')).toHaveLength(12)
      for (const type of ['goal','intro','heading','definition','table','example','trap','task','answers','summary','source']) {
        expect(book.some(block => block.type === type), `${id}: ${type}`).toBe(true)
      }
      expect(topic.theory.slice(0, book.length)).toEqual(book)
      expect(splitSections(topic.theory).flatMap(section => section.blocks)).toEqual(topic.theory)
      expect(splitSections(topic.theory)).toHaveLength(13)
      expect(book.at(-1)?.content).toContain('drive.google.com')
      expect(book.at(-1)?.content).toMatch(/tasdiqlanmagan|tekshiruv qilinmagan/i)
    })

    it(`${id}: preserves static questions, answer keys and source appendices`, () => {
      const topic = getTopicContent(id)!
      expect(topic.questions.map(q => q.id)).toEqual([1,2,3,4].map(i => `${id}-q${i}`))
      expect(topic.questions.map(q => q.correctIndex)).toEqual(keys)
      const appendix = M03_OFFICE_TEXTBOOK_ADDITIONS[id]
      expect(appendix.length).toBeGreaterThan(0)
      expect(topic.theory).toHaveLength(book.length + appendix.length)
      expect(topic.theory.slice(-appendix.length)).toEqual(appendix)
    })
  }

  it('does not change canonical Excel or other pedagogy lessons', () => {
    expect(getTopicContent('M03.07')?.source).toContain('Cambridge+')
    expect(getTopicContent('M15.07')?.source).toContain('Xoliqov')
    expect(getTopicContent('M03.08')?.questions[1].correctIndex).toBe(1)
    expect(getTopicContent('M03.10')?.questions[1].correctIndex).toBe(2)
  })

  it('keeps important conceptual distinctions as learner-readable facts', () => {
    const multimedia = M03_09_CANONICAL_BOOK.map(block => block.content).join('\n')
    const animation = M03_10_CANONICAL_BOOK.map(block => block.content).join('\n')
    expect(multimedia).toContain('kodek')
    expect(multimedia).toContain('SmartArt')
    expect(multimedia).toContain('Chart')
    expect(animation).toContain('With Previous')
    expect(animation).toContain('On Click')
    expect(animation).toContain('Duration')
    expect(animation).toContain('Delay')
  })
})
