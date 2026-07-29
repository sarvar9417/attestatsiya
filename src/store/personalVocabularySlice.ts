import type { StateCreator } from 'zustand'
import { monitoring } from '../lib/monitoring'
import type { PersonalWord, AddWordDTO, UpdateWordDTO, VocabRating, PersonalVocabularyImportResult } from '../types/personalVocabulary'
import type { AppState } from './appState'

// ═══════════════════════════════════════════════════════════════════════════
// Personal Vocabulary Slice
// ═══════════════════════════════════════════════════════════════════════════

export interface PersonalVocabularySlice {
  // State
  personalWords: PersonalWord[]
  personalWordsLoading: boolean
  personalWordsFetched: boolean
  personalWordsError: string | null
  
  // Actions
  setPersonalWords: (words: PersonalWord[]) => void
  addPersonalWord: (wordData: AddWordDTO, userId?: string) => Promise<PersonalWord>
  batchAddPersonalWords: (wordsData: AddWordDTO[], userId?: string) => Promise<PersonalVocabularyImportResult>
  updatePersonalWord: (id: number, updates: UpdateWordDTO, userId?: string) => Promise<void>
  deletePersonalWord: (id: number, userId?: string) => Promise<void>
  ratePersonalWord: (id: number, rating: VocabRating, userId?: string) => Promise<PersonalWord>
  ratePersonalWords: (ratings: { id: number; rating: VocabRating }[], userId?: string) => Promise<PersonalWord[]>
  fetchPersonalWords: (userId: string) => Promise<void>
  fetchWordsForReview: (userId: string) => Promise<PersonalWord[]>
  clearPersonalVocabulary: () => void
}

export const createPersonalVocabularySlice: StateCreator<AppState, [], [], PersonalVocabularySlice> = (set) => ({
  // Initial state
  personalWords: [],
  personalWordsLoading: false,
  personalWordsFetched: false,
  personalWordsError: null,

  setPersonalWords: (words) => set({ personalWords: words }),

  batchAddPersonalWords: async (wordsData, userId = 'guest') => {
    set({ personalWordsLoading: true })
    try {
      const { batchAddPersonalWordsToDB } = await import('../services/personalVocabularyService')
      const result = await batchAddPersonalWordsToDB(userId, wordsData)
      set((s) => ({
        personalWords: [...s.personalWords, ...result.inserted],
        personalWordsLoading: false,
        personalWordsError: null,
      }))
      return result
    } catch (e) {
      monitoring.captureMessage(`batchAddPersonalWords error: ${e instanceof Error ? e.message : String(e)}`, 'error')
      set({ personalWordsLoading: false, personalWordsError: e instanceof Error ? e.message : String(e) })
      throw e
    }
  },

  addPersonalWord: async (wordData, userId = 'guest') => {
    set({ personalWordsLoading: true })
    try {
      const { addPersonalWordToDB } = await import('../services/personalVocabularyService')
      const newWord = await addPersonalWordToDB(userId, wordData)
      set((s) => ({
        personalWords: [...s.personalWords, newWord],
        personalWordsLoading: false,
        personalWordsError: null,
      }))
      return newWord
    } catch (e) {
      monitoring.captureMessage(`addPersonalWord error: ${e instanceof Error ? e.message : String(e)}`, 'error')
      set({ personalWordsLoading: false, personalWordsError: e instanceof Error ? e.message : String(e) })
      throw e
    }
  },

  updatePersonalWord: async (id, updates, userId = 'guest') => {
    const { updatePersonalWordInDB } = await import('../services/personalVocabularyService')
    await updatePersonalWordInDB(userId, id, updates)
    set((s) => ({
      personalWords: s.personalWords.map((w) =>
        w.id === id ? { ...w, ...updates, updated_at: new Date().toISOString() } : w
      ),
    }))
  },

  deletePersonalWord: async (id, userId = 'guest') => {
    const { deletePersonalWordFromDB } = await import('../services/personalVocabularyService')
    await deletePersonalWordFromDB(userId, id)
    set((s) => ({
      personalWords: s.personalWords.filter((w) => w.id !== id),
    }))
  },

  ratePersonalWord: async (id, rating, userId = 'guest') => {
    const { ratePersonalWordInDB } = await import('../services/personalVocabularyService')
    const updated = await ratePersonalWordInDB(userId, id, rating)
    set((s) => ({
      personalWords: s.personalWords.map((w) => (w.id === id ? updated : w)),
    }))
    return updated
  },

  ratePersonalWords: async (ratings, userId = 'guest') => {
    const { ratePersonalWordsBatchInDB } = await import('../services/personalVocabularyService')
    const updated = await ratePersonalWordsBatchInDB(userId, ratings)
    const byId = new Map(updated.map((word) => [word.id, word]))
    set((s) => ({
      personalWords: s.personalWords.map((word) => byId.get(word.id) ?? word),
    }))
    return updated
  },

  fetchPersonalWords: async (userId) => {
    set({ personalWordsLoading: true, personalWordsFetched: false, personalWordsError: null })
    try {
      const { fetchPersonalWordsFromDB } = await import('../services/personalVocabularyService')
      const words = await fetchPersonalWordsFromDB(userId)
      set({ personalWords: words, personalWordsLoading: false, personalWordsFetched: true, personalWordsError: null })
    } catch (e) {
      monitoring.captureMessage(`fetchPersonalWords error: ${e instanceof Error ? e.message : String(e)}`, 'error')
      set({ personalWordsLoading: false, personalWordsFetched: false, personalWordsError: e instanceof Error ? e.message : String(e) })
      throw e
    }
  },

  fetchWordsForReview: async (userId) => {
    try {
      const { fetchWordsForReviewFromDB } = await import('../services/personalVocabularyService')
      return await fetchWordsForReviewFromDB(userId)
    } catch (e) {
      monitoring.captureMessage(`fetchWordsForReview error: ${e instanceof Error ? e.message : String(e)}`, 'error')
      return []
    }
  },

  clearPersonalVocabulary: () => set({ personalWords: [], personalWordsFetched: false, personalWordsLoading: false, personalWordsError: null }),
})
