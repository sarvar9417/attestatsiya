import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

describe('TASK-263: M09.05 canonical Access query fallback', () => {
  const content = getTopicContent('M09.05')

  it('matches the canonical complex query objective and the ICT 11 textbook', () => {
    expect(content).toBeDefined()
    expect(content?.title).toContain('so‘rovlar')
    expect(content?.title).not.toContain('Import')
    const body = content?.theory.map(block => block.content).join(' ') ?? ''
    for (const construct of ['Like', 'Not Like', 'Between', '44–52-betlar']) {
      expect(body).toContain(construct)
    }
    expect(body).toContain('SQLdagi %')
  })

  it('uses new source-versioned MCQ IDs rather than reusing import/export item IDs', () => {
    const questions = content?.questions ?? []
    expect(questions.map(q => q.id)).toEqual([
      'M09.05-2021-query-q1',
      'M09.05-2021-query-q2',
      'M09.05-2021-query-q3',
    ])
    expect(questions.map(q => q.correctIndex)).toEqual([0, 2, 1])
    for (const q of questions) {
      expect(q.type).toBe('Y1')
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options.map(option => option.trim().toLowerCase())).size).toBe(4)
      expect(q.options[q.correctIndex]).toBeTruthy()
    }
  })
  it('keeps M09.04 simple Query Design and criteria separate from the M09.05 advanced wildcard lesson', () => {
    const simple = getTopicContent('M09.04')
    expect(simple?.title).toContain('so‘rovlar')
    const text = simple?.theory.map(block => block.content).join(' ') ?? ''
    for (const concept of ['Query Design', 'Criteria', '44–50-betlar']) {
      expect(text).toContain(concept)
    }
    expect(simple?.questions.map(q => q.id)).toEqual([
      'M09.04-2021-query-q1',
      'M09.04-2021-query-q2',
      'M09.04-2021-query-q3',
    ])
    expect(simple?.questions.map(q => q.correctIndex)).toEqual([1, 3, 0])
    for (const q of simple?.questions ?? []) {
      expect(q.type).toBe('Y1')
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options.map(option => option.trim().toLowerCase())).size).toBe(4)
    }
  })

})
