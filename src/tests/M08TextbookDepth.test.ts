import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M08_TEXTBOOK_STUDY_ADDITIONS } from '../data/topics/m08TextbookStudyAdditions'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'

describe('TASK-273 national and Cambridge programming theory deepening', () => {
  const ids = Array.from({ length: 12 }, (_, i) => `M08.${String(i + 1).padStart(2, '0')}`)

  it('all twelve M08 topics have separately traced theory additions', () => {
    expect(Object.keys(M08_TEXTBOOK_STUDY_ADDITIONS).sort()).toEqual(ids)
  })

  for (const id of ids) {
    it(`${id} retains all original ordered blocks before supplemental theory`, () => {
      const data = getTopicContent(id)
      const extra = M08_TEXTBOOK_STUDY_ADDITIONS[id]
      expect(data, id).toBeDefined()
      expect(extra.length, id).toBeGreaterThanOrEqual(5)
      expect(data!.theory.slice(-extra.length)).toEqual(extra)
      expect(extra.filter(x => x.type === 'source').length, id).toBe(1)
      expect(extra.some(x => x.type === 'example'), id).toBe(true)
      expect(splitAdaptiveSections(data!.theory).flatMap(section => section.blocks))
        .toEqual(data!.theory)
      expect(data!.theory.at(-1)!.content).toContain('drive.google.com')
    })
  }

  it('keeps distinct Python vs JavaScript reading and source boundaries', () => {
    const py = M08_TEXTBOOK_STUDY_ADDITIONS['M08.07'].map(x => x.content).join('\n')
    const js = M08_TEXTBOOK_STUDY_ADDITIONS['M08.04'].map(x => x.content).join('\n')
    expect(py).toContain('def kvadrat')
    expect(py).toContain('return x * x')
    expect(js).toContain('addEventListener')
    expect(js).toContain('console.log')
    expect(py).toContain('2020')
    expect(js).toContain('2021')
  })

  it('does not replace the secret M14–M16 question bank with client keys', () => {
    for (const id of ['M14.01', 'M15.01', 'M16.01']) {
      const content = getTopicContent(id)
      expect(content?.questions, id).toEqual([])
    }
  })
})
