import { describe, expect, it } from 'vitest'
import { displayedCognitiveLevel, getTopicContent } from '../data/topicContent'

describe('TASK-266: preserve the pedagogic badge after static legacy Y2/Y3 MCQ normalization', () => {
  it('shows Qo‘llash for a four-option Y2-labeled legacy item but uses selectable Y1 interaction', () => {
    const q = getTopicContent('M07.04')?.questions.find(q => q.id === 'M07.04-q3')
    expect(q).toBeDefined()
    expect(q?.type).toBe('Y1')
    expect(q?.cognitiveLevel).toBe('Y2')
    if (q) expect(displayedCognitiveLevel(q)).toBe('Y2')
  })

  it('shows Mulohaza for a four-option Y3-labeled legacy item without turning it into an ordering widget', () => {
    const q = getTopicContent('M04.02')?.questions.find(q => q.id === 'M04.02-q3')
    expect(q).toBeDefined()
    expect(q?.type).toBe('Y1')
    if (q) expect(displayedCognitiveLevel(q)).toBe('Y3')
  })

  it('preserves the native Y1 and native Y2/Y3 badge category when no override exists', () => {
    expect(displayedCognitiveLevel({ type: 'Y1' })).toBe('Y1')
    expect(displayedCognitiveLevel({ type: 'Y2' })).toBe('Y2')
    expect(displayedCognitiveLevel({ type: 'Y3' })).toBe('Y3')
  })
})
