import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useVocabStore, getBatchWords } from '../vocabularyStore'
import type { GameWord } from '../vocabularyStore'
import type { DailyWordRow, WordLevel } from '../../services/vocabularyService'

// Mock external dependencies
vi.mock('../../services/vocabularyService', () => ({
  computeNextReview: vi.fn((box: number, rating: string) => {
    if (rating === 'yodladim' || rating === 'bildim') {
      return { box: Math.min(box + 1, 7), next_review: '2026-06-16', is_learned: box + 1 >= 7 }
    }
    return { box: Math.max(box - 1, 1), next_review: '2026-06-15', is_learned: false }
  }),
}))

vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
}))

vi.mock('../../utils/vocabConfig', () => ({
  BATCH_SIZE: 3,
}))

function makeWord(overrides: Partial<GameWord> = {}): GameWord {
  return {
    word_id: 1,
    english: 'hello',
    uzbek: 'salom',
    level: 'A2' as WordLevel,
    box: 1,
    next_review: '2026-06-15',
    is_learned: false,
    correct_count: 0,
    wrong_count: 0,
    is_new: true,
    ...overrides,
  }
}

const sampleWords = ([
  makeWord({ word_id: 1, english: 'hello', box: 1, level: 'A2' as WordLevel }),
  makeWord({ word_id: 2, english: 'world', box: 2, level: 'A2' as WordLevel }),
  makeWord({ word_id: 3, english: 'apple', box: 1, level: 'B1' as WordLevel }),
  makeWord({ word_id: 4, english: 'banana', box: 3, level: 'B1' as WordLevel }),
  makeWord({ word_id: 5, english: 'cat', box: 1, level: 'A2' as WordLevel }),
] as DailyWordRow[])

describe('vocabularyStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useVocabStore.getState().reset()
  })

  describe('getBatchWords', () => {
    it('returns correct slice for given batch', () => {
      const batch = getBatchWords(sampleWords, 1)
      expect(batch).toHaveLength(3) // BATCH_SIZE=3
      expect(batch[0].english).toBe('hello')
      expect(batch[1].english).toBe('world')
      expect(batch[2].english).toBe('apple')
    })

    it('returns second batch correctly', () => {
      const batch = getBatchWords(sampleWords, 2)
      expect(batch).toHaveLength(2) // remaining words
      expect(batch[0].english).toBe('banana')
      expect(batch[1].english).toBe('cat')
    })
  })

  describe('setDailyWords', () => {
    it('sets dailyWords and resets state', () => {
      useVocabStore.getState().setDailyWords(sampleWords)

      const state = useVocabStore.getState()
      expect(state.dailyWords).toEqual(sampleWords)
      expect(state.currentBatch).toBe(1)
      expect(state.currentIdx).toBe(0)
      expect(state.viewMode).toBe('catalog')
      expect(state.batchWords).toHaveLength(3) // first batch
      expect(state.correctCount).toBe(0)
      expect(state.totalAnswered).toBe(0)
    })
  })

  describe('setViewMode', () => {
    it('updates viewMode and resets currentIdx', () => {
      useVocabStore.getState().setDailyWords(sampleWords)
      useVocabStore.getState().setViewMode('flashcard')

      const state = useVocabStore.getState()
      expect(state.viewMode).toBe('flashcard')
      expect(state.currentIdx).toBe(0)
    })
  })

  describe('selectBatch', () => {
    it('selects a batch of words and resets progress', () => {
      useVocabStore.getState().setDailyWords(sampleWords)

      // Simulate some progress
      useVocabStore.getState().nextWord()
      expect(useVocabStore.getState().currentIdx).toBe(1)

      // Switch to batch 2
      useVocabStore.getState().selectBatch(2)

      const state = useVocabStore.getState()
      expect(state.currentBatch).toBe(2)
      expect(state.batchWords).toHaveLength(2)
      expect(state.batchWords[0].english).toBe('banana')
      expect(state.currentIdx).toBe(0)
      expect(state.correctCount).toBe(0)
      expect(state.totalAnswered).toBe(0)
    })
  })

  describe('nextWord', () => {
    it('advances to next word', () => {
      useVocabStore.getState().setDailyWords(sampleWords)
      expect(useVocabStore.getState().currentIdx).toBe(0)

      useVocabStore.getState().nextWord()
      expect(useVocabStore.getState().currentIdx).toBe(1)
    })

    it('stops at last word', () => {
      useVocabStore.getState().setDailyWords(sampleWords)
      // Advance to last word
      useVocabStore.getState().nextWord() // idx 1
      useVocabStore.getState().nextWord() // idx 2
      useVocabStore.getState().nextWord() // idx 2 (last, batch has 3 words)
      expect(useVocabStore.getState().currentIdx).toBe(2)
    })
  })

  describe('rateWord', () => {
    it('rates a word as correct (bildim) and updates box', () => {
      useVocabStore.getState().setDailyWords(sampleWords)

      const result = useVocabStore.getState().rateWord(1, 'bildim')

      const state = useVocabStore.getState()
      expect(result.newBox).toBe(2)
      expect(result.isLearned).toBe(false)
      expect(state.correctCount).toBe(1)
      expect(state.totalAnswered).toBe(1)
      expect(state.batchResults[1]).toBe('bildim')
    })

    it('rates a word as wrong and increases wrong_count', () => {
      useVocabStore.getState().setDailyWords(sampleWords)

      useVocabStore.getState().rateWord(1, 'bilmadim')

      const state = useVocabStore.getState()
      expect(state.correctCount).toBe(0)
      expect(state.totalAnswered).toBe(1)
      const word = state.batchWords.find(w => w.word_id === 1)
      expect(word?.wrong_count).toBe(1)
      expect(word?.box).toBe(1) // minimum box
    })

    it('returns empty result for unknown wordId', () => {
      useVocabStore.getState().setDailyWords(sampleWords)

      const result = useVocabStore.getState().rateWord(999, 'bildim')

      expect(result.newBox).toBe(1)
      expect(result.isLearned).toBe(false)
    })
  })

  describe('finishBatch', () => {
    it('sets viewMode to complete', () => {
      useVocabStore.getState().setDailyWords(sampleWords)

      useVocabStore.getState().finishBatch()
      expect(useVocabStore.getState().viewMode).toBe('complete')
    })
  })

  describe('reset', () => {
    it('resets all state to initial values', () => {
      useVocabStore.getState().setDailyWords(sampleWords)
      useVocabStore.getState().selectBatch(2)
      useVocabStore.getState().rateWord(4, 'bildim')

      useVocabStore.getState().reset()

      const state = useVocabStore.getState()
      expect(state.dailyWords).toEqual([])
      expect(state.currentBatch).toBe(1)
      expect(state.batchWords).toEqual([])
      expect(state.viewMode).toBe('catalog')
      expect(state.correctCount).toBe(0)
      expect(state.totalAnswered).toBe(0)
    })
  })
})
