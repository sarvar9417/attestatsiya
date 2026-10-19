import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M02_SOURCE_THEORY } from '../data/topics/m02SourceTheory'

describe('TASK-272: textbook correction for CPU frequency and capacity units', () => {
  it('never repeats incorrect 1000 Hz = 1 MHz as a true equality', () => {
    const blocks = M02_SOURCE_THEORY['M02.01']
    const note = blocks.find(b => b.type === 'trap' && b.content.includes('1000 Hz'))
    expect(note).toBeDefined()
    expect(note?.content).toContain('1000 Hz = 1 kHz')
    expect(note?.content).toContain('1000 kHz = 1 MHz')
    expect(note?.content).toContain('1000 MHz = 1 GHz')
    expect(note?.content).toContain('1 000 000 Hz')
    expect(note?.content).toContain('tengligi xato')
  })

  it('explains bit vs byte using eight bits per byte', () => {
    const caseBlock = M02_SOURCE_THEORY['M02.01'].find(
      b => b.type === 'case' && b.content.includes('128 Gb')
    )
    expect(caseBlock?.content).toContain('1 B = 8 bit')
    expect(caseBlock?.content).toContain('16 GB')
    expect(caseBlock?.content).toContain('128 GB')
  })

  it('renders corrections in canonical lesson and preserves the book trace', () => {
    const topic = getTopicContent('M02.01')
    expect(topic).toBeDefined()
    expect(topic?.theory.some(b => b.type === 'trap' && b.content.includes('1000 Hz = 1 kHz'))).toBe(true)
    expect(topic?.theory.some(b => b.type === 'source' && b.content.includes('10-sinf'))).toBe(true)
  })
})
