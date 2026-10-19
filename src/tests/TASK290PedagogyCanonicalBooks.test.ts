import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { getPedagogyStudyNotes, withPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { splitSections } from '../components/learning/theory/BookReader'
import { M15_07_CANONICAL_BOOK } from '../data/topics/m15AbilitiesCanonicalBook'
import { M15_08_CANONICAL_BOOK } from '../data/topics/m15TeachingTechnologiesCanonicalBook'

describe('TASK-290: two coherent source-guided pedagogy books', () => {
  for (const [id, book] of [
    ['M15.07', M15_07_CANONICAL_BOOK],
    ['M15.08', M15_08_CANONICAL_BOOK],
  ] as const) {
    it(`${id} begins with a substantive 11-section reader chapter`, () => {
      const topic = getTopicContent(id)!
      expect(topic).toBeDefined()
      expect(topic.kind).toBe('chapter')
      expect(topic.source).toBeTruthy()
      expect(book.length).toBe(61)
      expect(book.filter(x => x.type === 'heading')).toHaveLength(11)
      for (const type of ['goal', 'intro', 'definition', 'table', 'example', 'case', 'trap', 'task', 'answers', 'summary', 'source']) {
        expect(book.some(x => x.type === type), `${id}: ${type}`).toBe(true)
      }
      expect(topic.theory).toEqual(book)
      expect(splitSections(topic.theory).flatMap(x => x.blocks)).toEqual(topic.theory)
      expect(book.at(-1)?.content).toMatch(/tasdiqlanmagan/i)
      expect(book.at(-1)?.content).toContain('drive.google.com')
    })

    it(`${id} does not publish answer keys or discard study-note appendices`, () => {
      const topic = getTopicContent(id)!
      expect(topic.questions).toEqual([])
      const notes = getPedagogyStudyNotes(id)
      expect(notes.length).toBeGreaterThan(0)
      const enriched = withPedagogyStudyNotes(topic)
      expect(enriched.theory.slice(0, topic.theory.length)).toEqual(topic.theory)
      expect(enriched.theory.slice(-notes.length)).toEqual(notes)
      expect(enriched.questions).toBe(topic.questions)
      expect(splitSections(enriched.theory).flatMap(x => x.blocks)).toEqual(enriched.theory)
    })
  }

  it('retains historically qualified terminology without endorsing coercion', () => {
    const text = M15_07_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(text).toContain('avtoritar')
    expect(text).toContain('zo‘ravonlik')
    expect(text).toContain('perseptiv')
  })

  it('teaching technologies chapter distinguishes inclusion, projects and methods', () => {
    const text = M15_08_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(text).toContain('Inklyuziv')
    expect(text).toContain('Loyihaga')
    expect(text).toContain('metod')
  })

  it('does not alter the already merged M15.05 and M15.06 books', () => {
    expect(getTopicContent('M15.05')?.source).toContain('kasbiy')
    expect(getTopicContent('M15.06')?.source).toContain('Mahmudov')
  })
})
