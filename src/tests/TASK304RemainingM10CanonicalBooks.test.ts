import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { splitSections } from '../components/learning/theory/BookReader'
import { M10_GRAPHICS_TEXTBOOK_ADDITIONS } from '../data/topics/m10GraphicsTextbookAdditions'
import { M10_04_CANONICAL_BOOK } from '../data/topics/m10PhotoTextCanonicalBook'
import { M10_05_CANONICAL_BOOK } from '../data/topics/m10ThreeDCanonicalBook'
import { M10_06_CANONICAL_BOOK } from '../data/topics/m10AnimationCanonicalBook'
import { M10_07_CANONICAL_BOOK } from '../data/topics/m10AudioVideoCanonicalBook'

describe('TASK-304: M10.04–07 source-first reader books and assessment parity', () => {
  const specs = [
    { id: 'M10.04', book: M10_04_CANONICAL_BOOK, keys: [2, 1], types: ['Y2', 'Y1'] },
    { id: 'M10.05', book: M10_05_CANONICAL_BOOK, keys: [2, 1, 1], types: ['Y1', 'Y1', 'Y2'] },
    { id: 'M10.06', book: M10_06_CANONICAL_BOOK, keys: [0, 1], types: ['Y1', 'Y2'] },
    { id: 'M10.07', book: M10_07_CANONICAL_BOOK, keys: [1, 1, 1], types: ['Y1', 'Y1', 'Y2'] },
  ] as const

  for (const { id, book, keys, types } of specs) {
    it(`${id} exposes 12 complete authored sections before the original appendix`, () => {
      const topic = getTopicContent(id)!
      const appendix = M10_GRAPHICS_TEXTBOOK_ADDITIONS[id]
      expect(topic).toBeDefined()
      expect(topic.kind).toBe('chapter')
      expect(topic.source).toContain('Cambridge+')
      expect(book.length).toBeGreaterThanOrEqual(65)
      expect(book.filter(x => x.type === 'heading')).toHaveLength(12)
      for (const type of ['goal', 'intro', 'heading', 'definition', 'table', 'example', 'case', 'solved', 'trap', 'task', 'answers', 'summary', 'source']) {
        expect(book.some(x => x.type === type), `${id} missing ${type}`).toBe(true)
      }
      expect(book.at(-1)?.content).toContain('drive.google.com')
      expect(book.at(-1)?.content).toMatch(/1:1/)
      expect(topic.theory.slice(0, book.length)).toEqual(book)
      expect(topic.theory.slice(-appendix.length)).toEqual(appendix)
      expect(topic.theory).toHaveLength(book.length + appendix.length)
      expect(splitSections(topic.theory).flatMap(x => x.blocks)).toEqual(topic.theory)
      expect(splitSections(topic.theory)).toHaveLength(13)
    })

    it(`${id} retains the original unpublished offline test shape and answer keys`, () => {
      const q = getTopicContent(id)!.questions
      expect(q.map(x => x.id)).toEqual(keys.map((_, i) => `${id}-q${i + 1}`))
      expect(q.map(x => x.correctIndex)).toEqual(keys)
      expect(q.map(x => x.type)).toEqual(types)
    })
  }

  it('understands that Animate is in 2026 maintenance mode, not discontinued', () => {
    const s = M10_06_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(s).toContain('maintenance mode')
    expect(s).toContain('2026')
    expect(s).toContain('tugat')
    expect(s).toContain('FPS')
    expect(s).toContain('Tween')
    expect(s).toContain('Keyframe')
  })

  it('preserves correct audio fundamentals, codec/container and numerical example', () => {
    const s = M10_07_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(s).toContain('10 584 000')
    expect(s).toContain('44 100')
    expect(s).toContain('FLAC')
    expect(s).toContain('kodek')
    expect(s).toContain('MP4')
    expect(s).toContain('AAC')
    expect(s).toContain('48 000')
  })

  it('includes CAD/CAM and fundamental mesh facts and keeps earlier M10.01–03 books', () => {
    const s = M10_05_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(s).toContain('Vertex')
    expect(s).toContain('Edge')
    expect(s).toContain('Face')
    expect(s).toContain('8 uch, 12 qirra')
    expect(s).toContain('CAD')
    const old = getTopicContent('M10.01')!
    expect(old.kind).toBe('chapter')
    expect(old.theory.length).toBeGreaterThanOrEqual(70)
  })

  it('avoids the obsolete AAC-is-Apple-only and FPS-rigidity claims in the new chapters', () => {
    const media = M10_07_CANONICAL_BOOK.map(x => x.content).join('\n')
    const animation = M10_06_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(media).not.toContain('AAC (Apple)')
    expect(animation).not.toContain("Standart: 24 FPS")
  })
})
