import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

const codes = [
  ['M14.01', 'A/01.6'],
  ['M14.02', 'A/02.6'],
  ['M14.03', 'A/03.6'],
  ['M14.04', 'A/04.6'],
  ['M14.05', 'A/05.6'],
  ['M14.06', 'B/01.6'],
  ['M14.07', 'B/02.6'],
] as const

describe('TASK-252 scanned original professional standard provenance', () => {
  it('links all seven professional topics to their original A/B labor-function codes', () => {
    for (const [id, code] of codes) {
      const blocks = getTopicContent(id)?.theory ?? []
      const source = blocks.find(block => block.type === 'source')?.content ?? ''
      expect(source, id).toContain(code)
      expect(source, id).toContain('Maktab pedagoglari - Kasb standarti')
      expect(source, id).toContain('6-malaka darajasi')
      expect(source, id).toContain('PDF 2-sahifa')
    }
  })

  it('does not confuse scanned primary standard with derivative text or legal status', () => {
    for (const [id] of codes) {
      const source = getTopicContent(id)?.theory.find(block => block.type === 'source')?.content ?? ''
      expect(source).toContain('1IwpcwvNG4deDFtxwEw1tIU2G121RrVYB')
      expect(source).toContain('1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq')
      expect(source).toContain('yuridik kuchi')
      expect(source).toContain('17 sahifaning har bir bandi hali mustaqil tekshirilmagan')
    }
  })

  it('keeps all seven standard topics as keyless study materials', () => {
    for (const [id] of codes) expect(getTopicContent(id)?.questions, id).toEqual([])
  })
})
