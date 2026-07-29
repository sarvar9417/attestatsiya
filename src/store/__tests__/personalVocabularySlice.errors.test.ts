import { describe, expect, it, vi } from 'vitest'
import { createPersonalVocabularySlice } from '../personalVocabularySlice'

const addPersonalWordToDB = vi.fn()
const deletePersonalWordFromDB = vi.fn()

vi.mock('../../services/personalVocabularyService', () => ({
  addPersonalWordToDB,
  deletePersonalWordFromDB,
}))
vi.mock('../../lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn(), captureException: vi.fn() },
}))

describe('personalVocabularySlice error propagation', () => {
  it('rejects add when persistence fails instead of reporting false success', async () => {
    addPersonalWordToDB.mockRejectedValueOnce(new Error('database unavailable'))
    const set = vi.fn()
    const slice = createPersonalVocabularySlice(set as never, vi.fn() as never, {} as never)

    await expect(
      slice.addPersonalWord({ english: 'cat', uzbek: 'mushuk' }, 'user-1')
    ).rejects.toThrow('database unavailable')
    expect(set).toHaveBeenLastCalledWith({
      personalWordsLoading: false,
      personalWordsError: 'database unavailable',
    })
  })

  it('rejects delete when persistence fails and leaves local state untouched', async () => {
    deletePersonalWordFromDB.mockRejectedValueOnce(new Error('delete failed'))
    const set = vi.fn()
    const slice = createPersonalVocabularySlice(set as never, vi.fn() as never, {} as never)

    await expect(slice.deletePersonalWord(1, 'user-1')).rejects.toThrow('delete failed')
    expect(set).not.toHaveBeenCalled()
  })
})
