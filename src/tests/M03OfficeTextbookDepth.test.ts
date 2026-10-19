import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M03_OFFICE_TEXTBOOK_ADDITIONS } from '../data/topics/m03OfficeTextbookAdditions'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'

describe('TASK-273 Cambridge Office source theory', () => {
  const ids = Array.from({ length: 10 }, (_, i) => `M03.${String(i + 1).padStart(2, '0')}`)

  it('covers every M03 topic with an authored source trace', () => {
    expect(Object.keys(M03_OFFICE_TEXTBOOK_ADDITIONS).sort()).toEqual(ids)
  })

  for (const id of ids) {
    it(`${id} keeps original blocks first and adds traceable Word/Excel/PowerPoint lessons`, () => {
      const staticContent = getTopicContent(id)
      const extras = M03_OFFICE_TEXTBOOK_ADDITIONS[id]
      expect(staticContent, id).toBeDefined()
      expect(extras.length, id).toBe(5)
      expect(extras.some(block => block.type === 'table')).toBe(true)
      expect(extras.some(block => block.type === 'example')).toBe(true)
      expect(extras.at(-1)?.type).toBe('source')
      expect(extras.at(-1)?.content).toContain('Cambridge+')
      expect(staticContent!.theory.slice(-extras.length)).toEqual(extras)
      expect(splitAdaptiveSections(staticContent!.theory).flatMap(page => page.blocks))
        .toEqual(staticContent!.theory)
    })
  }

  it('differentiates relative and absolute Excel references, sorting and filtering', () => {
    const formulas = M03_OFFICE_TEXTBOOK_ADDITIONS['M03.05'].map(x => x.content).join('\n')
    const sorting = M03_OFFICE_TEXTBOOK_ADDITIONS['M03.06'].map(x => x.content).join('\n')
    expect(formulas).toContain('$A$1')
    expect(formulas).toContain('A$1')
    expect(sorting).toContain('Filtrlash')
    expect(sorting).toContain('Saralash')
  })
})
