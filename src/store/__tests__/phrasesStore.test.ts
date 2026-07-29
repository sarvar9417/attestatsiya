import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePhrasesStore, getBatchPhrases } from '../phrasesStore'
import type { GamePhrase } from '../phrasesStore'
import type { DailyPhraseRow } from '../../services/phrasesService'

vi.mock('../../services/phrasesService', () => ({
  computePhraseNextReview: vi.fn((box: number, rating: string) => {
    if (rating === 'yodladim') {
      return { box: Math.min(box + 2, 6), next_review: '2026-06-17', is_learned: box + 2 >= 6 }
    }
    if (rating === 'bildim') {
      return { box: Math.min(box + 1, 6), next_review: '2026-06-16', is_learned: box + 1 >= 6 }
    }
    if (rating === 'qiynaldim') {
      return { box: Math.max(box, 1), next_review: '2026-06-15', is_learned: false }
    }
    return { box: 1, next_review: '2026-06-15', is_learned: false }
  }),
}))

vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
}))

vi.mock('../../utils/phraseConfig', () => ({
  PHRASE_BATCH_SIZE: 3,
}))

function makePhrase(overrides: Partial<GamePhrase> = {}): GamePhrase {
  return {
    phrase_id: 1,
    english: 'Hello, how are you?',
    uzbek: 'Salom, qalaysiz?',
    level: 'A1',
    category: 'everyday',
    box: 1,
    next_review: '2026-06-15',
    is_learned: false,
    correct_count: 0,
    wrong_count: 0,
    is_new: true,
    ...overrides,
  }
}

const samplePhrases = ([
  makePhrase({ phrase_id: 1, english: 'Hello, how are you?', box: 1, level: 'A1' }),
  makePhrase({ phrase_id: 2, english: 'I am from Uzbekistan.', box: 2, level: 'A1' }),
  makePhrase({ phrase_id: 3, english: 'What time is it?', box: 1, level: 'A1' }),
  makePhrase({ phrase_id: 4, english: 'Where is the bathroom?', box: 3, level: 'A1' }),
  makePhrase({ phrase_id: 5, english: 'I like reading books.', box: 1, level: 'A1' }),
] as DailyPhraseRow[])

describe('phrasesStore', () => {
  beforeEach(() => {
    usePhrasesStore.getState().reset()
  })

  describe('getBatchPhrases', () => {
    it('returns correct slice for given batch', () => {
      const batch = getBatchPhrases(samplePhrases, 1)
      expect(batch).toHaveLength(3)
      expect(batch[0].phrase_id).toBe(1)
      expect(batch[1].phrase_id).toBe(2)
      expect(batch[2].phrase_id).toBe(3)
    })

    it('returns second batch correctly', () => {
      const batch = getBatchPhrases(samplePhrases, 2)
      expect(batch).toHaveLength(2)
      expect(batch[0].phrase_id).toBe(4)
      expect(batch[1].phrase_id).toBe(5)
    })
  })

  describe('setDailyPhrases', () => {
    it('sets dailyPhrases and resets state', () => {
      usePhrasesStore.getState().setDailyPhrases(samplePhrases)

      const state = usePhrasesStore.getState()
      expect(state.dailyPhrases).toEqual(samplePhrases)
      expect(state.currentBatch).toBe(1)
      expect(state.currentIdx).toBe(0)
      expect(state.viewMode).toBe('catalog')
      expect(state.batchPhrases).toHaveLength(3)
      expect(state.correctCount).toBe(0)
      expect(state.totalAnswered).toBe(0)
    })
  })

  describe('setViewMode', () => {
    it('updates viewMode and resets currentIdx', () => {
      usePhrasesStore.getState().setDailyPhrases(samplePhrases)
      usePhrasesStore.getState().setViewMode('flashcard')

      const state = usePhrasesStore.getState()
      expect(state.viewMode).toBe('flashcard')
      expect(state.currentIdx).toBe(0)
    })
  })

  describe('selectBatch', () => {
    it('selects a batch of phrases and resets progress', () => {
      usePhrasesStore.getState().setDailyPhrases(samplePhrases)

      usePhrasesStore.getState().nextPhrase()
      expect(usePhrasesStore.getState().currentIdx).toBe(1)

      usePhrasesStore.getState().selectBatch(2)

      const state = usePhrasesStore.getState()
      expect(state.currentBatch).toBe(2)
      expect(state.batchPhrases).toHaveLength(2)
      expect(state.batchPhrases[0].phrase_id).toBe(4)
      expect(state.currentIdx).toBe(0)
      expect(state.correctCount).toBe(0)
      expect(state.totalAnswered).toBe(0)
    })
  })

  describe('nextPhrase', () => {
    it('advances to next phrase', () => {
      usePhrasesStore.getState().setDailyPhrases(samplePhrases)
      expect(usePhrasesStore.getState().currentIdx).toBe(0)

      usePhrasesStore.getState().nextPhrase()
      expect(usePhrasesStore.getState().currentIdx).toBe(1)
    })

    it('stops at last phrase', () => {
      usePhrasesStore.getState().setDailyPhrases(samplePhrases)
      usePhrasesStore.getState().nextPhrase()
      usePhrasesStore.getState().nextPhrase()
      usePhrasesStore.getState().nextPhrase()
      expect(usePhrasesStore.getState().currentIdx).toBe(2)
    })
  })

  describe('ratePhrase', () => {
    it('rates a phrase as correct (bildim) and updates box', () => {
      usePhrasesStore.getState().setDailyPhrases(samplePhrases)

      const result = usePhrasesStore.getState().ratePhrase(1, 'bildim')

      const state = usePhrasesStore.getState()
      expect(result.newBox).toBe(2)
      expect(result.isLearned).toBe(false)
      expect(state.correctCount).toBe(1)
      expect(state.totalAnswered).toBe(1)
      expect(state.batchResults[1]).toBe('bildim')
    })

    it('rates a phrase as wrong and increases wrong_count', () => {
      usePhrasesStore.getState().setDailyPhrases(samplePhrases)

      usePhrasesStore.getState().ratePhrase(1, 'bilmadim')

      const state = usePhrasesStore.getState()
      expect(state.correctCount).toBe(0)
      expect(state.totalAnswered).toBe(1)
      const phrase = state.batchPhrases.find(p => p.phrase_id === 1)
      expect(phrase?.wrong_count).toBe(1)
      expect(phrase?.box).toBe(1)
    })

    it('returns empty result for unknown phraseId', () => {
      usePhrasesStore.getState().setDailyPhrases(samplePhrases)

      const result = usePhrasesStore.getState().ratePhrase(999, 'bildim')

      expect(result.newBox).toBe(1)
      expect(result.isLearned).toBe(false)
    })
  })

  describe('finishBatch', () => {
    it('sets viewMode to complete', () => {
      usePhrasesStore.getState().setDailyPhrases(samplePhrases)

      usePhrasesStore.getState().finishBatch()
      expect(usePhrasesStore.getState().viewMode).toBe('complete')
    })
  })

  describe('reset', () => {
    it('resets all state to initial values', () => {
      usePhrasesStore.getState().setDailyPhrases(samplePhrases)
      usePhrasesStore.getState().selectBatch(2)
      usePhrasesStore.getState().ratePhrase(4, 'bildim')

      usePhrasesStore.getState().reset()

      const state = usePhrasesStore.getState()
      expect(state.dailyPhrases).toEqual([])
      expect(state.currentBatch).toBe(1)
      expect(state.batchPhrases).toEqual([])
      expect(state.viewMode).toBe('catalog')
      expect(state.correctCount).toBe(0)
      expect(state.totalAnswered).toBe(0)
    })
  })
})
