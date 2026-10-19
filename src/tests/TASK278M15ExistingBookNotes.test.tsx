import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { getPedagogyStudyNotes, withExistingPedagogyNotes } from '../data/pedagogyStudyNotes'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'

describe('TASK-278: existing M15 study notes are in the primary book', () => {
  for (let n = 1; n <= 8; n++) {
    const id = `M15.${String(n).padStart(2, '0')}`
    it(`${id} retains all original blocks and study notes in order without touching keys`, () => {
      const original = getTopicContent(id)
      expect(original).toBeDefined()
      if (!original) return
      const notes = getPedagogyStudyNotes(id)
      expect(notes.length).toBeGreaterThan(0)
      const combined = withExistingPedagogyNotes(original)
      expect(combined.theory).toEqual([...original.theory, ...notes])
      expect(splitAdaptiveSections(combined.theory).flatMap(s => s.blocks)).toEqual(combined.theory)
      expect(combined.questions).toBe(original.questions)
      expect(original.theory.length).toBeGreaterThan(0)
    })
  }
  it('does not affect other modules or modify the source object', () => {
    const m16 = getTopicContent('M16.01')
    expect(m16).toBeDefined()
    if (m16) expect(withExistingPedagogyNotes(m16)).toBe(m16)
  })
})
