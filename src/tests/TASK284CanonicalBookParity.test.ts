import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M03_05_CANONICAL_BOOK } from '../data/topics/m03ExcelCanonicalBook'
import { M15_01_CANONICAL_BOOK } from '../data/topics/m15PedagogyCanonicalBook'
import { getPedagogyStudyNotes, withPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { splitSections } from '../components/learning/theory/BookReader'
import { M03_OFFICE_TEXTBOOK_ADDITIONS } from '../data/topics/m03OfficeTextbookAdditions'

describe('TASK-284: M01-style content is a substantive chapter, not a design skin', () => {
  it('establishes the original M01.02 long-form benchmark without overwriting it', () => {
    const original = getTopicContent('M01.02')
    expect(original?.source).toContain('LaTeX')
    expect(original?.theory.length).toBeGreaterThan(60)
    expect(splitSections(original!.theory).length).toBeGreaterThan(5)
  })

  it('Excel chapter is structured, long-form and keeps all earlier content intact', () => {
    const topic = getTopicContent('M03.05')
    expect(topic?.source).toContain('Cambridge')
    expect(M03_05_CANONICAL_BOOK.length).toBeGreaterThanOrEqual(50)
    expect(M03_05_CANONICAL_BOOK.filter(x => x.type === 'heading').length).toBeGreaterThanOrEqual(8)
    expect(M03_05_CANONICAL_BOOK.some(x => x.type === 'goal')).toBe(true)
    expect(M03_05_CANONICAL_BOOK.some(x => x.type === 'intro')).toBe(true)
    expect(M03_05_CANONICAL_BOOK.some(x => x.type === 'solved')).toBe(true)
    expect(M03_05_CANONICAL_BOOK.some(x => x.type === 'task')).toBe(true)
    expect(M03_05_CANONICAL_BOOK.some(x => x.type === 'answers')).toBe(true)
    expect(M03_05_CANONICAL_BOOK.some(x => x.type === 'source')).toBe(true)
    expect(topic?.theory.slice(0, M03_05_CANONICAL_BOOK.length)).toEqual(M03_05_CANONICAL_BOOK)
    expect(topic?.theory.slice(-M03_OFFICE_TEXTBOOK_ADDITIONS['M03.05'].length))
      .toEqual(M03_OFFICE_TEXTBOOK_ADDITIONS['M03.05'])
    expect(splitSections(topic!.theory).flatMap(x => x.blocks)).toEqual(topic!.theory)
    expect(splitSections(topic!.theory).length).toBeGreaterThanOrEqual(9)
    expect(topic?.theory.map(x => x.content).join('\n')).toContain('VLOOKUP')
  })

  it('pedagogy book remains first, legacy theory and source notes remain readable', () => {
    const staticTopic = getTopicContent('M15.01')
    expect(staticTopic?.source).toContain('Mirzayeva')
    expect(M15_01_CANONICAL_BOOK.length).toBeGreaterThanOrEqual(40)
    expect(M15_01_CANONICAL_BOOK.some(x => x.type === 'solved')).toBe(true)
    expect(M15_01_CANONICAL_BOOK.some(x => x.type === 'answers')).toBe(true)
    expect(staticTopic?.theory.slice(0, M15_01_CANONICAL_BOOK.length)).toEqual(M15_01_CANONICAL_BOOK)
    const enriched = withPedagogyStudyNotes(staticTopic!)
    const notes = getPedagogyStudyNotes('M15.01')
    expect(enriched.theory.slice(0, staticTopic!.theory.length)).toEqual(staticTopic!.theory)
    expect(enriched.theory.slice(-notes.length)).toEqual(notes)
    expect(splitSections(enriched.theory).flatMap(x => x.blocks)).toEqual(enriched.theory)
    expect(splitSections(enriched.theory).length).toBeGreaterThanOrEqual(9)
    expect(enriched.questions).toBe(staticTopic?.questions)
  })

  it('does not label unrelated short chapters as source-complete books', () => {
    const old = getTopicContent('M03.01')
    expect(old).toBeDefined()
    expect(old?.source).toBeUndefined()
    expect(M03_05_CANONICAL_BOOK.at(-1)?.content).toContain('PDF')
    expect(M15_01_CANONICAL_BOOK.at(-1)?.content).toContain('Mirzayeva')
  })
})
