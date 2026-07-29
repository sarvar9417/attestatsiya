import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockResponse = vi.hoisted(() => ({ text: 'CORRECT' }))
const mockFetch = vi.hoisted(() => {
  const fn = vi.fn().mockImplementation(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ content: [{ type: 'text', text: mockResponse.text }] }),
  }))
  vi.stubGlobal('fetch', fn)
  return fn
})

import {
  checkGrammar,
  checkVocabAnswer,
  checkPhraseTranslation,
  checkDailyExerciseAnswers,
  evaluateWriting,
} from '../claude'
import type { DailyExerciseCheckItem } from '../claude'

describe('checkGrammar', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('sends grammar check to proxy', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ content: [{ type: 'text', text: 'Your sentence is correct!' }] }),
    })
    const result = await checkGrammar('I go to school yesterday')
    expect(result).toBe('Your sentence is correct!')
    expect(mockFetch).toHaveBeenCalledTimes(1)
    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(callBody.model).toBeTruthy()
    expect(callBody.messages[0].content).toContain('I go to school yesterday')
  })
})

describe('checkVocabAnswer', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns true when answer is CORRECT', async () => {
    mockResponse.text = 'CORRECT'
    const result = await checkVocabAnswer('olma', 'apple', 'apple')
    expect(result).toBe(true)
  })

  it('returns false when answer is WRONG', async () => {
    mockResponse.text = 'WRONG'
    const result = await checkVocabAnswer('olma', 'apple', 'banana')
    expect(result).toBe(false)
  })
})

describe('checkPhraseTranslation', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns true for correct translation', async () => {
    mockResponse.text = 'CORRECT'
    const result = await checkPhraseTranslation(
      'Men maktabga boraman',
      'I go to school',
      'I am going to school',
    )
    expect(result).toBe(true)
  })

  it('returns false for wrong translation', async () => {
    mockResponse.text = 'WRONG'
    const result = await checkPhraseTranslation(
      'Men maktabga boraman',
      'I go to school',
      'I like pizza',
    )
    expect(result).toBe(false)
  })
})

describe('checkDailyExerciseAnswers', () => {
  beforeEach(() => { vi.clearAllMocks() })

  const items: DailyExerciseCheckItem[] = [
    { type: 'fill-blank', context: 'She ___ (go) to school.', correct: 'goes', userAnswer: 'goes' },
    { type: 'multiple-choice', context: 'Choose the correct word.', correct: 'bigger', userAnswer: 'more bigger' },
  ]

  it('parses JSON array response', async () => {
    mockResponse.text = '[true, false]'
    const result = await checkDailyExerciseAnswers(items)
    expect(result).toEqual([true, false])
  })

  it('returns all false on parse failure', async () => {
    mockResponse.text = 'invalid json'
    const result = await checkDailyExerciseAnswers(items)
    expect(result).toEqual([false, false])
  })

  it('returns empty array for no items', async () => {
    const result = await checkDailyExerciseAnswers([])
    expect(result).toEqual([])
    expect(mockFetch).not.toHaveBeenCalled()
  })
})

describe('evaluateWriting', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('calls onDone with completed response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => {
          const chunks = [
            'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"TASK_ACHIEVEMENT: 8\\n"}}\n\n',
            'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"FEEDBACK: Good"}}\n\n',
            'data: [DONE]\n\n',
          ]
          let i = 0
          return {
            read: () => {
              if (i < chunks.length) {
                return Promise.resolve({ done: false, value: new TextEncoder().encode(chunks[i++]) })
              }
              return Promise.resolve({ done: true, value: undefined })
            },
            cancel: vi.fn(),
            releaseLock: vi.fn(),
          }
        },
      },
    })

    const onDelta = vi.fn()
    const onDone = vi.fn()
    const onError = vi.fn()

    await evaluateWriting('Write about your hobby', 'I like playing football', 'B1', onDelta, onDone, onError)

    expect(onDone).toHaveBeenCalledTimes(1)
    expect(onDelta).toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('calls onError on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const onDelta = vi.fn()
    const onDone = vi.fn()
    const onError = vi.fn()

    await evaluateWriting('Write about your hobby', 'I like football', 'B1', onDelta, onDone, onError)

    expect(onError).toHaveBeenCalled()
    expect(onDone).not.toHaveBeenCalled()
  })
})
