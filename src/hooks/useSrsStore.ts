import { useState, useCallback, useEffect } from 'react'
import { computeNextReviewFSRS, createDefaultFSRSState, type FSRSState } from '../lib/srs'
import type { ChallengeDay } from '../data/30dayChallenge'

// ── Types ───────────────────────────────────────────────────────────────────

export type SrsCardType = 'sentence' | 'vocab'

export interface SrsCard {
  id: string
  type: SrsCardType
  front: string       // O'zbekcha / prompt
  back: string        // Inglizcha javob
  dayNumber: number
  topicTitle: string
  fsrs: FSRSState
}

interface SrsStore {
  cards: SrsCard[]
  lastUpdated: string  // ISO date
}

// ── Key ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'srs_cards_store'

function loadStore(): SrsStore {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { cards: [], lastUpdated: new Date().toISOString().split('T')[0] }
}

function saveStore(store: SrsStore) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)) } catch {}
}

// ── Helper: generate cards from a day's data ────────────────────────────────

export function generateDayCards(day: ChallengeDay): SrsCard[] {
  const cards: SrsCard[] = []

  // Sentence cards — from sentenceBank (pick key ones, max 12)
  // Front: kalit so'z yoki qisqa prompt asosida esga olish
  const keySentences = (day.sentenceBank.all ?? day.sentenceBank.categories.flatMap(c => c.phrases)).slice(0, 12)
  keySentences.forEach((phrase, i) => {
    // Extract first unique keyword as hint
    const words = phrase.en.replace(/[^a-zA-Z\s]/g, '').split(/\s+/).filter(Boolean)
    const keyword = words.length > 2 ? words.slice(1, 3).join(' ') : words[0] || ''
    const front = `"... ${keyword} ..." gapini to'ldiring:`
    cards.push({
      id: `sent-${day.day}-${i}`,
      type: 'sentence',
      front,
      back: phrase.en,
      dayNumber: day.day,
      topicTitle: day.title,
      fsrs: createDefaultFSRSState(),  // due: tomorrow — today's content reviewed TOMORROW
    })
  })

  // Vocab cards — from vocabulary
  // Front: Uzbek meaning → active recall of English word
  day.vocabulary.forEach((v, i) => {
    cards.push({
      id: `vocab-${day.day}-${i}`,
      type: 'vocab',
      front: v.meaning,
      back: `${v.word} — ${v.example}`,
      dayNumber: day.day,
      topicTitle: day.title,
      fsrs: createDefaultFSRSState(),  // due: tomorrow
    })
  })

  return cards
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useSrsStore() {
  const [store, setStore] = useState<SrsStore>(loadStore)
  const [reviewQueue, setReviewQueue] = useState<SrsCard[]>([])
  const [isReviewing, setIsReviewing] = useState(false)

  // Persist store changes
  useEffect(() => {
    saveStore(store)
  }, [store])

  /** Ensure cards exist for a given day */
  const ensureDayCards = useCallback((day: ChallengeDay) => {
    setStore(prev => {
      const existingIds = new Set(prev.cards.map(c => c.id))
      const newCards = generateDayCards(day).filter(c => !existingIds.has(c.id))
      if (newCards.length === 0) return prev
      return { ...prev, cards: [...prev.cards, ...newCards] }
    })
  }, [])

  /** Get due cards for today */
  const getDueCards = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return store.cards.filter(c => c.fsrs.due <= today)
  }, [store.cards])

  /** Due count */
  const dueCount = store.cards.filter(c => {
    const today = new Date().toISOString().split('T')[0]
    return c.fsrs.due <= today
  }).length

  /** Start a review session */
  const startReview = useCallback(() => {
    const due = store.cards.filter(c => {
      const today = new Date().toISOString().split('T')[0]
      return c.fsrs.due <= today
    })
    // Shuffle
    for (let i = due.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [due[i], due[j]] = [due[j], due[i]]
    }
    setReviewQueue(due.map(c => ({ ...c, fsrs: { ...c.fsrs } })))
    setIsReviewing(true)
  }, [store.cards])

  /** Rate the current card and move to next */
  const rateCard = useCallback((rating: string) => {
    setReviewQueue(prev => {
      if (prev.length === 0) return prev
      const [current, ...rest] = prev
      const result = computeNextReviewFSRS(current.fsrs, rating)
      const updatedCard: SrsCard = {
        ...current,
        fsrs: result.state,
      }

      // Update the card in the global store
      setStore(s => ({
        ...s,
        cards: s.cards.map(c => c.id === updatedCard.id ? updatedCard : c),
      }))

      return rest
    })
  }, [])

  /** End the review session */
  const endReview = useCallback(() => {
    setReviewQueue([])
    setIsReviewing(false)
  }, [])

  /** Card stats */
  const getStats = useCallback(() => {
    const total = store.cards.length
    const due = store.cards.filter(c => {
      const today = new Date().toISOString().split('T')[0]
      return c.fsrs.due <= today
    }).length
    const reviewed = store.cards.filter(c => c.fsrs.reps > 0).length
    return { total, due, reviewed, newCards: total - reviewed }
  }, [store.cards])

  return {
    store,
    dueCount,
    reviewQueue,
    isReviewing,
    currentCard: reviewQueue[0] ?? null,
    ensureDayCards,
    getDueCards,
    startReview,
    rateCard,
    endReview,
    getStats,
  }
}
