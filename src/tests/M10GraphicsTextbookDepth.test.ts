import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M10_GRAPHICS_TEXTBOOK_ADDITIONS } from '../data/topics/m10GraphicsTextbookAdditions'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'

describe('TASK-273 graphics textbook coverage regression', () => {
  for (let i = 1; i <= 7; i++) {
    const id = `M10.${String(i).padStart(2, '0')}`
    it(`${id} retains previous lesson and appends original source study`, () => {
      const data = getTopicContent(id)
      const extra = M10_GRAPHICS_TEXTBOOK_ADDITIONS[id]
      expect(data).toBeDefined()
      expect(extra.length).toBeGreaterThanOrEqual(5)
      expect(extra.some(block => block.type === 'table')).toBe(true)
      expect(extra.some(block => block.type === 'example')).toBe(true)
      expect(extra.at(-1)?.type).toBe('source')
      expect(data!.theory.slice(-extra.length)).toEqual(extra)
      expect(splitAdaptiveSections(data!.theory).flatMap(x => x.blocks)).toEqual(data!.theory)
    })
  }
  it('explicitly distinguishes raster/vector and codec/container', () => {
    const graphics = M10_GRAPHICS_TEXTBOOK_ADDITIONS['M10.01'].map(x => x.content).join('\n')
    const media = M10_GRAPHICS_TEXTBOOK_ADDITIONS['M10.07'].map(x => x.content).join('\n')
    expect(graphics).toContain('Rastr')
    expect(graphics).toContain('Vektor')
    expect(media).toContain('Kodek')
    expect(media).toContain('10 584 000')
  })
})
