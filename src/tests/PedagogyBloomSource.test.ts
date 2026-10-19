import { describe, expect, it } from 'vitest'
import { getPedagogyStudyNotes } from '../data/pedagogyStudyNotes'
import { getTopicContent } from '../data/topicContent'

describe('pedagogy source-based Bloom explanation', () => {
  const notes = getPedagogyStudyNotes('M15.02')
  const allText = notes.map(block => block.content).join('\n')

  it('contrasts the final levels of the 1956 and 2001 taxonomies correctly', () => {
    const comparison = notes.find(block => block.type === 'table' && block.content.includes('1956-yilgi'))
    expect(comparison).toBeDefined()
    expect(comparison?.content).toContain('| 5 | Sintez | Baholash |')
    expect(comparison?.content).toContain('| 6 | Baholash | Yaratish |')
    expect(comparison?.content).toContain('| 1 | Bilish | Eslash |')
  })

  it('provides a concrete computer-science learning example', () => {
    expect(allText).toContain('yangi algoritm')
    expect(allText).toContain('xato sababini')
    expect(allText).toContain('aniq mezonlar')
  })

  it('does not equate three attestation cognitive groups to six Bloom levels', () => {
    expect(allText).toContain('bilish / qo‘llash / mulohaza qilish')
    expect(allText).toContain('avtomatik 1:1 mos kelmaydi')
  })

  it('discloses secondary-source limitations and retains editorial provenance', () => {
    expect(allText).toContain('bet lokatori tekshirilmagan')
    expect(allText).toContain('Sarvar Drive')
    expect(allText).toContain('Cornell')
    expect(allText).toContain('barnoyevak ZIP')
  })

  it('uses the consistent perseptiv-ability terminology in M15.07', () => {
    const theory = getTopicContent('M15.07')?.theory.map(block => block.content).join('\n') ?? ''
    expect(theory).toContain('Perseptiv')
    expect(theory).not.toContain('Persiptiv')
  })
})
