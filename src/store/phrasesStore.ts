import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { DailyPhraseRow, PhraseRating } from '../types/phrases'
import { computePhraseNextReview, upsertPhraseProgress } from '../services/phrasesService'
import { getTodayTashkent } from '../utils/tashkentDate'
import { PHRASE_BATCH_SIZE } from '../utils/phraseConfig'
import { monitoring } from '../lib/monitoring'

export type PhraseViewMode = 'catalog' | 'flashcard' | 'test' | 'game' | 'complete'

export interface GamePhrase {
  phrase_id:    number
  english:      string
  uzbek:        string
  level:        string
  category:     string
  box:          number
  next_review:  string
  is_learned:   boolean
  correct_count: number
  wrong_count:   number
  is_new:       boolean
  last_rating?: string
}

export interface PhrasesState {
  dailyPhrases:  GamePhrase[]
  reviewPhrases: GamePhrase[]
  currentBatch:   number
  batchPhrases:  GamePhrase[]
  currentIdx:     number
  viewMode:       PhraseViewMode
  batchResults:   Record<string, PhraseRating>
  correctCount:   number
  totalAnswered:  number
  loading:        boolean

  setDailyPhrases:  (phrases: DailyPhraseRow[]) => void
  setReviewPhrases: (phrases: DailyPhraseRow[]) => void
  setViewMode:      (mode: PhraseViewMode) => void
  setLoading:       (v: boolean) => void
  selectBatch:      (batch: number) => void
  selectReview:     () => void
  nextPhrase:       () => void
  ratePhrase:       (phraseId: number, rating: PhraseRating) => { newBox: number; nextReview: string; isLearned: boolean }
  finishBatch:      () => void
  reset:            () => void
}

export function getBatchPhrases(all: GamePhrase[], batch: number): GamePhrase[] {
  const start = (batch - 1) * PHRASE_BATCH_SIZE
  return all.slice(start, start + PHRASE_BATCH_SIZE)
}

export const usePhrasesStore = create<PhrasesState>()(
  persist(
    (set, get) => ({
      dailyPhrases:   [],
      reviewPhrases:  [],
      currentBatch:   1,
      batchPhrases:   [],
      currentIdx:     0,
      viewMode:       'catalog',
      batchResults:   {},
      correctCount:   0,
      totalAnswered:  0,
      loading:        false,

      setDailyPhrases: (phrases) =>
        set({
          dailyPhrases: phrases,
          currentBatch: 1,
          currentIdx: 0,
          viewMode: 'catalog',
          batchResults: {},
          correctCount: 0,
          totalAnswered: 0,
          batchPhrases: getBatchPhrases(phrases, 1),
        }),

      setReviewPhrases: (phrases) =>
        set({ reviewPhrases: phrases }),

      setViewMode: (mode) => set({ viewMode: mode, currentIdx: 0 }),

      setLoading: (v) => set({ loading: v }),

      selectBatch: (batch) =>
        set({
          currentBatch: batch,
          batchPhrases: getBatchPhrases(get().dailyPhrases, batch),
          currentIdx: 0,
          viewMode: 'catalog',
          batchResults: {},
          correctCount: 0,
          totalAnswered: 0,
        }),

      selectReview: () =>
        set({
          currentBatch: 0,
          batchPhrases: get().reviewPhrases,
          currentIdx: 0,
          viewMode: 'catalog',
          batchResults: {},
          correctCount: 0,
          totalAnswered: 0,
        }),

      nextPhrase: () =>
        set((s) => ({
          currentIdx: Math.min(s.currentIdx + 1, s.batchPhrases.length - 1),
        })),

      ratePhrase: (phraseId, rating) => {
        const phrase = get().batchPhrases.find((p) => p.phrase_id === phraseId)
        if (!phrase) return { newBox: 1, nextReview: getTodayTashkent(), isLearned: false }

        const srs = computePhraseNextReview(phrase.box, rating)
        const isCorrect = rating === 'bildim' || rating === 'yodladim'

        set((s) => {
          const isLearned = srs.is_learned
          const base = { box: srs.box, next_review: srs.next_review, is_learned: isLearned, is_new: false, last_rating: rating }
          const upd = (p: GamePhrase) =>
            p.phrase_id === phraseId
              ? { ...p, ...base, correct_count: p.correct_count + (isCorrect ? 1 : 0), wrong_count: p.wrong_count + (isCorrect ? 0 : 1) }
              : p
          return {
            batchPhrases: s.batchPhrases.map(upd),
            batchResults: { ...s.batchResults, [phraseId]: rating },
            correctCount: s.correctCount + (isCorrect ? 1 : 0),
            totalAnswered: s.totalAnswered + 1,
            dailyPhrases: s.dailyPhrases.map(upd),
            reviewPhrases: s.reviewPhrases.map(upd),
          }
        })

        // Sync SRS progress to Supabase
        import('../lib/supabase').then(({ supabase }) => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user.id) {
              upsertPhraseProgress(
                session.user.id, phraseId, srs.box, srs.next_review,
                phrase.correct_count + (isCorrect ? 1 : 0),
                phrase.wrong_count + (isCorrect ? 0 : 1),
                srs.is_learned,
                rating
              ).catch((e) => monitoring.captureMessage('ratePhrase sync error: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
            }
          }).catch((e) => monitoring.captureMessage('ratePhrase getSession error: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
        }).catch((e) => monitoring.captureMessage('ratePhrase supabase import error: ' + (e instanceof Error ? e.message : String(e)), 'warn'))

        return { newBox: srs.box, nextReview: srs.next_review, isLearned: srs.is_learned }
      },

      finishBatch: () => set({ viewMode: 'complete' }),

      reset: () =>
        set({
          dailyPhrases:   [],
          reviewPhrases:  [],
          currentBatch:   1,
          batchPhrases:   [],
          currentIdx:     0,
          viewMode:       'catalog',
          batchResults:   {},
          correctCount:   0,
          totalAnswered:  0,
          loading:        false,
        }),
    }),
    {
      name: 'phrases-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        dailyPhrases: state.dailyPhrases,
        reviewPhrases: state.reviewPhrases,
        batchResults: state.batchResults,
      }),
    }
  )
)
