import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

describe('pedagogika manbasi aniqligi', () => {
  it('does not present an unsupported 70-percent computer-time requirement as official', () => {
    const theory = getTopicContent('M16.02')?.theory
    expect(theory?.length).toBeGreaterThan(0)
    const text = theory?.map(block => block.content).join('\n') ?? ''
    expect(text).not.toMatch(/70\s*%/)
    expect(text).toContain('darsning aniq maqsadi')
  })

  it('keeps the professional bank behind server-authoritative exam routes', () => {
    for (const code of ['M14', 'M15', 'M16']) {
      const count = code === 'M14' ? 7 : code === 'M15' ? 8 : 3
      for (let n = 1; n <= count; n++) {
        const id = code + '.' + String(n).padStart(2, '0')
        const topic = getTopicContent(id)
        expect(topic?.theory.length, id).toBeGreaterThan(0)
        expect(topic?.questions, id).toEqual([])
      }
    }
  })
})
