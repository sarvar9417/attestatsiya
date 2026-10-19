import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M12_NETWORK_TEXTBOOK_ADDITIONS } from '../data/topics/m12NetworkTextbookAdditions'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'

describe('TASK-273 networking chapter source-backed depth', () => {
  for (let i = 1; i <= 9; i++) {
    const id = `M12.${String(i).padStart(2, '0')}`
    it(`${id} keeps original theory before verified-source study notes`, () => {
      const data = getTopicContent(id)
      const extras = M12_NETWORK_TEXTBOOK_ADDITIONS[id]
      expect(data).toBeDefined()
      expect(extras.length).toBeGreaterThanOrEqual(5)
      expect(extras.some(x => x.type === 'table')).toBe(true)
      expect(extras.some(x => x.type === 'example')).toBe(true)
      expect(extras.at(-1)?.type).toBe('source')
      expect(extras.at(-1)?.content).toContain('Cambridge+')
      expect(data!.theory.slice(-extras.length)).toEqual(extras)
      expect(splitAdaptiveSections(data!.theory).flatMap(x => x.blocks)).toEqual(data!.theory)
    })
  }

  it('uses the exact conventional IPv4 /26 subnet address and mask', () => {
    const theory = M12_NETWORK_TEXTBOOK_ADDITIONS['M12.05'].map(x => x.content).join('\n')
    expect(theory).toContain('255.255.255.192')
    expect(theory).toContain('192.168.1.64')
    expect(theory).toContain('192.168.1.127')
    expect(theory).toContain('192.168.1.65–192.168.1.126')
    expect(theory).toContain('/31')
  })

  it('differentiates the Internet, WWW, HTTPS and email services', () => {
    const lesson = M12_NETWORK_TEXTBOOK_ADDITIONS['M12.06'].map(x => x.content).join('\n')
    expect(lesson).toContain('WWW')
    expect(lesson).toContain('HTTPS')
    expect(lesson).toContain('Internet')
  })
})
