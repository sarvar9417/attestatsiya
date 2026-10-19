import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

describe('ICT6 Scratch conditional source correction', () => {
  it('distinguishes A greater, B greater, and equal values', () => {
    const topic = getTopicContent('M07.04')
    expect(topic).toBeDefined()
    const example = topic?.theory.find(block => block.type === 'example' && block.content.includes('A > B'))
    expect(example?.content).toContain('if (A > B)')
    expect(example?.content).toContain('else if (A < B)')
    expect(example?.content).toContain('else say "A va B teng"')
    expect(example?.content).not.toContain('then say "A katta" else say "B katta"')
  })
})
