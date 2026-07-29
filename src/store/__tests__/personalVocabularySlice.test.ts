import { describe, it, expect, vi } from 'vitest'
import { createPersonalVocabularySlice } from '../personalVocabularySlice'

vi.mock('../../lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn(), captureException: vi.fn() },
}))

describe('personalVocabularySlice', () => {
  it('exports createPersonalVocabularySlice as a function', () => {
    expect(typeof createPersonalVocabularySlice).toBe('function')
  })

  it('creates initial state with correct defaults', () => {
    const set = vi.fn()
    const get = vi.fn(() => ({}))
    const slice = createPersonalVocabularySlice(set as never, get as never, {} as never)
    expect(slice.personalWords).toEqual([])
    expect(slice.personalWordsLoading).toBe(false)
    expect(slice.personalWordsFetched).toBe(false)
    expect(slice.personalWordsError).toBeNull()
  })

  it('setPersonalWords calls set with updated words', () => {
    const set = vi.fn()
    const get = vi.fn(() => ({}))
    const slice = createPersonalVocabularySlice(set as never, get as never, {} as never)
    const mockWords = [{ id: 1, english: 'hello' }] as never
    slice.setPersonalWords(mockWords)
    expect(set).toHaveBeenCalledWith({ personalWords: mockWords })
  })

  it('clearPersonalVocabulary calls set to reset', () => {
    const set = vi.fn()
    const get = vi.fn(() => ({}))
    const slice = createPersonalVocabularySlice(set as never, get as never, {} as never)
    slice.clearPersonalVocabulary()
    expect(set).toHaveBeenCalledWith({
      personalWords: [],
      personalWordsFetched: false,
      personalWordsLoading: false,
      personalWordsError: null,
    })
  })

  it('addPersonalWord sets loading and calls service', async () => {
    const set = vi.fn()
    const get = vi.fn(() => ({}))
    vi.doMock('../../services/personalVocabularyService', () => ({
      addPersonalWordToDB: vi.fn().mockResolvedValue({ id: 99, english: 'test' }),
    }))
    const slice = createPersonalVocabularySlice(set as never, get as never, {} as never)
    await slice.addPersonalWord({ english: 'test', uzbek: 'test' } as never, 'user1')
    expect(set).toHaveBeenCalledWith({ personalWordsLoading: true })
  })

  it('deletePersonalWord calls set to remove word', async () => {
    const set = vi.fn()
    const get = vi.fn(() => ({}))
    vi.doMock('../../services/personalVocabularyService', () => ({
      deletePersonalWordFromDB: vi.fn().mockResolvedValue(undefined),
    }))
    const slice = createPersonalVocabularySlice(set as never, get as never, {} as never)
    await slice.deletePersonalWord(42, 'user1')
    expect(set).toHaveBeenCalled()
  })
})
