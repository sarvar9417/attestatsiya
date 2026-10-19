import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { getPedagogyStudyNotes, withPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'

describe('TASK-273: M15 source notes are part of the primary theory reader', () => {
  for (let index = 1; index <= 8; index++) {
    const id = `M15.${String(index).padStart(2, '0')}`

    it(`${id} preserves the original lesson and makes its source notes readable`, () => {
      const source = getTopicContent(id)
      expect(source, id).toBeDefined()
      if (!source) return

      const originalBlocks = [...source.theory]
      const notes = getPedagogyStudyNotes(id)
      expect(notes.length, id).toBeGreaterThan(0)
      expect(notes.some(block => block.type === 'source'), id).toBe(true)

      const enriched = withPedagogyStudyNotes(source)
      expect(enriched.theory.slice(0, originalBlocks.length)).toEqual(originalBlocks)
      expect(enriched.theory.slice(originalBlocks.length)).toEqual(notes)
      expect(enriched.theory.length).toBe(originalBlocks.length + notes.length)
      expect(enriched.questions).toBe(source.questions)
      expect(enriched.title).toBe(source.title)
      expect(source.theory).toEqual(originalBlocks)

      // Navigating the shared book must not omit or reorder the added material.
      expect(splitAdaptiveSections(enriched.theory).flatMap(section => section.blocks))
        .toEqual(enriched.theory)
    })
  }

  it('does not append pedagogy notes to non-pedagogy modules', () => {
    const m16 = getTopicContent('M16.01')
    expect(m16).toBeDefined()
    if (m16) expect(withPedagogyStudyNotes(m16)).toBe(m16)
  })

  it('does not replace the study notes with unverified remote material', () => {
    const core = getTopicContent('M15.01')
    expect(core).toBeDefined()
    if (!core) return
    const enriched = withPedagogyStudyNotes(core)
    const source = enriched.theory.map(block => block.content).join('\n')
    expect(source).toContain('Pedagogikaning obyekti, predmeti va tadqiqot metodlari')
    expect(source).toContain('Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf')
    expect(source).toContain('Xoliqov')
  })
})
