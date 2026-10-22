import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

describe('TASK-293: algorithm properties and Scratch 3.0 factual accuracy', () => {
  const m0601 = getTopicContent('M06.01')!
  const m0604 = getTopicContent('M06.04')!
  const m0701 = getTopicContent('M07.01')!
  const m0702 = getTopicContent('M07.02')!

  it('distinguishes discrete steps from termination without changing algorithm question keys', () => {
    expect(m0601.theory.map(b => b.content).join('\n')).toContain('aniqlik (noaniqlik')
    expect(m0601.questions.map(q => q.correctIndex)).toEqual([1, 1, 1])
    expect(m0601.questions[0].text).toContain('alohida bosqichlarga')
    expect(m0601.questions[0].options).toEqual(['Aniqlik', 'Diskretlik', 'Natijalilik', 'Ommaviylik'])
    expect(m0601.questions[0].explanation).toContain('natijalilik')
  })

  it('qualifies quicksort and time complexity by algorithm input and implementation', () => {
    const text = m0604.theory.map(x => x.content).join('\n')
    expect(text).toContain('eng yomon holatda O(n²)')
    expect(text).toContain('o‘rtacha O(n log n)')
    expect(text).not.toContain('1 000 000 taqqoslash')
    expect(m0604.questions.map(q => q.correctIndex)).toEqual([2, 1, 2])
    expect(m0604.questions[1].text).toContain('n ta elementni')
  })

  it('correctly attributes Scratch to the MIT Media Lab and distinguishes stage center from sprite origin', () => {
    const text = m0701.theory.map(x => x.content).join('\n')
    expect(text).toContain('Lifelong Kindergarten')
    expect(text).toContain('Scratch Foundation')
    expect(text).toContain('scratchfoundation.org')
    expect(text).not.toContain('Massachusets universiteti')
    expect(m0701.questions.map(q => q.correctIndex)).toEqual([1, 1, 1])
    expect(m0701.questions[2].text).toContain('sahnasining markazidagi')
    expect(m0701.questions[2].explanation).toContain('loyiha holati')
  })

  it('includes My Blocks as a core Scratch 3 category instead of an incorrect fixed eight-category answer', () => {
    const text = m0702.theory.map(x => x.content).join('\n')
    expect(text).toContain('| My Blocks |')
    expect(text).toContain('scratchfoundation.github.io/scratch-gui/')
    expect(m0702.questions.map(q => q.correctIndex)).toEqual([1, 1, 2])
    expect(m0702.questions[2].options[2]).toContain('Foydalanuvchi buyruq bloklarini')
    expect(m0702.questions[2].text).toContain('My Blocks')
    expect(text).toContain('Extensions')
  })
})
