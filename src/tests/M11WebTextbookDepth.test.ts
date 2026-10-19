import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M11_WEB_TEXTBOOK_ADDITIONS } from '../data/topics/m11WebTextbookAdditions'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'

describe('TASK-273: complete authored M11 HTML/CSS topic addenda', () => {
  for (let i = 1; i <= 7; i++) {
    const id = `M11.${String(i).padStart(2, '0')}`
    it(`${id} keeps original blocks and adds traceable HTML/CSS theory`, () => {
      const topic = getTopicContent(id)
      const additions = M11_WEB_TEXTBOOK_ADDITIONS[id]
      expect(topic).toBeDefined()
      expect(additions).toHaveLength(5)
      expect(additions.at(-1)?.type).toBe('source')
      expect(additions.some(x => x.type === 'code' || x.type === 'table')).toBe(true)
      expect(topic!.theory.slice(-additions.length)).toEqual(additions)
      expect(splitAdaptiveSections(topic!.theory).flatMap(p => p.blocks))
        .toEqual(topic!.theory)
    })
  }

  it('distinguishes navigation, HTML semantics and CSS layout', () => {
    const html = M11_WEB_TEXTBOOK_ADDITIONS['M11.01'].map(x => x.content).join('\n')
    const css = M11_WEB_TEXTBOOK_ADDITIONS['M11.05'].map(x => x.content).join('\n')
    const links = M11_WEB_TEXTBOOK_ADDITIONS['M11.04'].map(x => x.content).join('\n')
    expect(html).toContain('<!doctype html>')
    expect(css).toContain('Box model')
    expect(links).toContain('href')
  })
})
