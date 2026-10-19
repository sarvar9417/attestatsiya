import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M13_DIGITAL_TEXTBOOK_ADDITIONS } from '../data/topics/m13DigitalTextbookAdditions'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'

describe('TASK-273: source-grounded M13 cybersecurity and digital activity lessons', () => {
  const ids = Array.from({ length: 11 }, (_, i) => `M13.${String(i + 1).padStart(2, '0')}`)

  it('adds original theory to all eleven M13 topics', () => {
    expect(Object.keys(M13_DIGITAL_TEXTBOOK_ADDITIONS).sort()).toEqual(ids)
  })

  for (const id of ids) {
    it(`${id} preserves original blocks and appends grounded learning material`, () => {
      const topic = getTopicContent(id)
      const extras = M13_DIGITAL_TEXTBOOK_ADDITIONS[id]
      expect(topic, id).toBeDefined()
      expect(extras.length, id).toBe(5)
      expect(extras.some(x => x.type === 'table'), id).toBe(true)
      expect(extras.some(x => x.type === 'example'), id).toBe(true)
      expect(extras.at(-1)?.type).toBe('source')
      expect(extras.at(-1)?.content).toContain('drive.google.com')
      expect(topic!.theory.slice(-extras.length)).toEqual(extras)
      expect(splitAdaptiveSections(topic!.theory).flatMap(section => section.blocks))
        .toEqual(topic!.theory)
    })
  }

  it('does not mix CMS, LMS and MOOC or treat security measures as perfect guarantees', () => {
    const cms = M13_DIGITAL_TEXTBOOK_ADDITIONS['M13.08'].map(x => x.content).join('\n')
    const lms = M13_DIGITAL_TEXTBOOK_ADDITIONS['M13.09'].map(x => x.content).join('\n')
    const mooc = M13_DIGITAL_TEXTBOOK_ADDITIONS['M13.10'].map(x => x.content).join('\n')
    const security = M13_DIGITAL_TEXTBOOK_ADDITIONS['M13.03'].map(x => x.content).join('\n')
    expect(cms).toContain('kontent')
    expect(lms).toContain('LMS')
    expect(mooc).toContain('MOOC')
    expect(security).toContain('100%')
    expect(security).toContain('kafolat')
  })
})
