import { describe, it, expect } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M08_DEEP_CHAPTERS } from '../data/topics/m08DeepChapters'
import { M11_DEEP_CHAPTERS } from '../data/topics/m11DeepChapters'
import { M15_DEEP_CHAPTERS } from '../data/topics/m15DeepChapters'
import { OFFICE_SQL_DEEP_CHAPTERS } from '../data/topics/officeSqlDeepChapters'
import { splitSections } from '../components/learning/theory/BookReader'
import { withPedagogyStudyNotes } from '../data/pedagogyStudyNotes'

const books = {
  ...M08_DEEP_CHAPTERS, ...M11_DEEP_CHAPTERS,
  ...M15_DEEP_CHAPTERS, ...OFFICE_SQL_DEEP_CHAPTERS,
}

describe('TASK-285 textbook-style theories in real learner data', () => {
  it('covers all ten explicitly authored chapters without a missing lesson ID', () => {
    expect(Object.keys(books).sort()).toEqual([
      'M03.01', 'M08.05', 'M08.06', 'M08.07',
      'M09.06', 'M11.01', 'M11.03', 'M11.05',
      'M15.03', 'M15.04',
    ])
    expect(Object.values(books).reduce((n, theory) => n + theory.length, 0)).toBe(300)
  })

  for (const [id, theory] of Object.entries(books)) {
    it(`${id} reads the full original chapter first and keeps all older blocks in one book`, () => {
      const content = getTopicContent(id)
      expect(content, id).toBeDefined()
      expect(content!.source).toContain('TASK-285')
      expect(theory.length, id).toBeGreaterThanOrEqual(25)
      expect(theory[0].type, id).toBe('goal')
      expect(theory[1].type, id).toBe('intro')
      expect(theory.at(-1)?.type, id).toBe('source')
      expect(theory.filter(x => x.type === 'heading').length, id).toBeGreaterThanOrEqual(6)
      expect(theory.some(x => x.type === 'solved' || x.type === 'case'), id).toBe(true)
      expect(theory.some(x => x.type === 'trap'), id).toBe(true)
      expect(theory.some(x => x.type === 'task'), id).toBe(true)
      expect(theory.some(x => x.type === 'answers'), id).toBe(true)
      expect(content!.theory.slice(0, theory.length)).toEqual(theory)
      expect(content!.theory.length, id).toBeGreaterThan(theory.length)
      expect(content!.theory[theory.length].type).toBe('heading')
      expect(splitSections(content!.theory).flatMap(x => x.blocks)).toEqual(content!.theory)
      expect(splitSections(content!.theory).length).toBeGreaterThanOrEqual(7)
      expect(Array.isArray(content!.questions)).toBe(true) // Existing practice questions are preserved.
      if (id.startsWith('M15.')) {
        const notes = withPedagogyStudyNotes(content!)
        expect(notes.theory.length).toBeGreaterThan(content!.theory.length)
      }
    })
  }

  it('does not overwrite the M01.02 benchmark or the earlier TASK-284 books', () => {
    const ref = getTopicContent('M01.02')!
    expect(ref.source).toContain('LaTeX')
    expect(ref.theory.length).toBeGreaterThan(60)
    for (const id of ['M03.05', 'M12.05', 'M15.01']) {
      expect(getTopicContent(id)!.theory.length).toBeGreaterThan(40)
    }
  })

  it('preserves numerical and language details in the three programming chapters', () => {
    const ifTheory = books['M08.05'].map(x => x.content).join('\n')
    expect(ifTheory).toContain('2000 True')
    expect(ifTheory).toContain('1900 False')
    const loopTheory = books['M08.06'].map(x => x.content).join('\n')
    expect(loopTheory).toContain('10,7,4')
    expect(loopTheory).toContain('27')
    const functionTheory = books['M08.07'].map(x => x.content).join('\n')
    expect(functionTheory).toContain('faktorial(4)')
    expect(functionTheory).toContain('None')
  })

  it('retains SQL updates and HTML forms without publishing answer keys', () => {
    expect(books['M09.06'].map(x => x.content).join('\n')).toContain('WHERE id = 17')
    expect(books['M11.03'].map(x => x.content).join('\n')).toContain('method="post"')
    expect(books['M11.05'].map(x => x.content).join('\n')).toContain('content-box')
  })
})
