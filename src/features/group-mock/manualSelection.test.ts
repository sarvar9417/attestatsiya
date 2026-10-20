import { describe, expect, it } from 'vitest'
import { reorderManualQuestions } from './manualSelection'

describe('manual group mock ordering', () => {
  const ids = ['question-a', 'question-b', 'question-c']

  it('moves the selected item up and down without mutating its original order', () => {
    expect(reorderManualQuestions(ids, 1, -1)).toEqual(['question-b', 'question-a', 'question-c'])
    expect(reorderManualQuestions(ids, 1, 1)).toEqual(['question-a', 'question-c', 'question-b'])
    expect(ids).toEqual(['question-a', 'question-b', 'question-c'])
  })

  it('rejects out-of-range moves and retains question identity', () => {
    expect(reorderManualQuestions(ids, 0, -1)).toEqual(ids)
    expect(reorderManualQuestions(ids, 2, 1)).toEqual(ids)
    expect(reorderManualQuestions(ids, -1, 1)).toEqual(ids)
    expect(reorderManualQuestions(ids, 100, -1)).toEqual(ids)
  })

  it('is reversible for the original order', () => {
    const moved = reorderManualQuestions(ids, 1, -1)
    expect(reorderManualQuestions(moved, 0, 1)).toEqual(ids)
  })
})
