/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Mock } from 'vitest'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
// ─── Hoisted mocks ───────────────────────────────────────────────────────────

const mockStoreState = vi.hoisted(() => ({
  addXP: vi.fn(),
  addLearnedWords: vi.fn(),
  updateSkillProgress: vi.fn(),
  setState: vi.fn(),
  getState: vi.fn(() => ({ startDate: '2026-06-01', streak: 5 })),
  streak: 5,
  totalWordsLearned: 25,
  startDate: '2026-06-01',
}))

const mockGetBatchWords = vi.hoisted(() => vi.fn(() => []))

const mockFetchMonthSessions = vi.hoisted(() => vi.fn().mockResolvedValue(new Map()))
const mockGetCachedLevelTotals = vi.hoisted(() => vi.fn().mockResolvedValue({ A1: 0, A2: 0, B1: 0, B2: 0 }))

const mockVocabState = vi.hoisted(() => ({
  dailyWords: [] as any[],
  reviewWords: [] as any[],
  currentBatch: 1,
  batchWords: [] as any[],
  currentIdx: 0,
  viewMode: 'catalog' as string,
  loading: false,
  correctCount: 0,
  totalAnswered: 0,
  sessionTime: 0,
  batchResults: {} as Record<string, string>,

  setDailyWords: vi.fn(),
  setReviewWords: vi.fn(),
  setLoading: vi.fn(),
  selectBatch: vi.fn(),
  selectReview: vi.fn(),
  nextWord: vi.fn(),
  rateWord: vi.fn(() => ({
    newBox: 2,
    nextReview: '2026-06-16',
    isLearned: false,
  })),
  finishBatch: vi.fn(),
  tick: vi.fn(),
  reset: vi.fn(),
  getBatchWords: mockGetBatchWords,
}))

const mockSupabase = vi.hoisted(() => ({
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'user-1' } } }, error: null }),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
  from: vi.fn(() => mockQB),
  rpc: vi.fn(() => mockQB),
}))

const mockQB = vi.hoisted(() => {
  const qb: Record<string, Mock> = {}
  const chain = (name: string) => {
    const fn = vi.fn(() => qb)
    qb[name] = fn
    return fn
  }
  const methods = ['select', 'insert', 'upsert', 'delete', 'eq', 'gte', 'lt', 'lte', 'order', 'range', 'single', 'maybeSingle', 'in', 'or']
  methods.forEach(m => qb[m] = chain(m))
  qb.then = vi.fn((f: any) => f({ data: [], error: null, count: 0 }))
  return qb as any
})

// ─── Module mocks ────────────────────────────────────────────────────────────

vi.mock('../../store/useStore', () => ({
  useStore: Object.assign(
    (selector?: (state: typeof mockStoreState) => unknown) =>
      selector ? selector(mockStoreState) : mockStoreState,
    {
      getState: () => ({ startDate: '2026-06-01', streak: 5, totalWordsLearned: 25 }),
      setState: vi.fn(),
      subscribe: vi.fn(),
    }
  ),
}))

vi.mock('../../store/vocabularyStore', () => ({
  useVocabStore: Object.assign(
    (selector?: (state: typeof mockVocabState) => unknown) =>
      selector ? selector(mockVocabState) : mockVocabState,
    { getState: () => mockVocabState }
  ),
  getBatchWords: mockGetBatchWords,
  BATCH_SIZE: 25,
}))

vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
  addDaysTashkent: (d: number) => {
    const date = new Date('2026-06-15T00:00:00Z')
    date.setUTCDate(date.getUTCDate() + d)
    return date.toISOString().split('T')[0]
  },
}))

vi.mock('../../utils/vocabConfig', () => ({
  BATCH_SIZE: 25,
}))

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase,
}))

vi.mock('../../lib/claude', () => ({
  generateUzbekSentence: vi.fn().mockResolvedValue('Bu bir test jumla.'),
  analyzeGrammar: vi.fn(() => {}),
}))

vi.mock('../../services/vocabularyService', () => ({
  saveSession: vi.fn(),
  fetchMonthSessions: mockFetchMonthSessions,
  getCachedLevelTotals: mockGetCachedLevelTotals,
  computeNextReview: vi.fn(() => ({
    box: 2,
    next_review: '2026-06-16',
    is_learned: false,
  })),
  getReviewMode: vi.fn(() => 'translation'),
  buildFillBlank: vi.fn((example: string) => example),
}))

vi.mock('../../utils/toastStore', () => ({
  useToastStore: { getState: () => ({ toast: vi.fn() }) },
}))

vi.mock('../../components/vocabulary/FlashCard', () => ({
  default: ({ word, onFlip }: any) => (
    <div data-testid="flashcard">
      <span>{word.english}</span>
      <span>{word.uzbek}</span>
      <button onClick={onFlip} data-testid="flip-btn">Flip</button>
    </div>
  ),
}))

vi.mock('../../components/vocabulary/WordTest', () => ({
  default: ({ word, onAnswer }: any) => (
    <div data-testid="word-test">
      <span>{word.english}</span>
      <button onClick={() => onAnswer(true)} data-testid="correct-btn">Correct</button>
      <button onClick={() => onAnswer(false)} data-testid="wrong-btn">Wrong</button>
    </div>
  ),
}))

vi.mock('../../components/vocabulary/WordGame', () => ({
  default: ({ words, onComplete }: any) => (
    <div data-testid="word-game">
      <span>{words.length} words</span>
      <button onClick={() => onComplete(8, 10)} data-testid="complete-btn">Complete</button>
    </div>
  ),
}))

vi.mock('../../components/vocabulary/VocabProgress', () => ({
  default: () => <div data-testid="vocab-progress">Progress</div>,
}))

vi.mock('../../components/vocabulary/VocabCalendar', () => ({
  default: ({ onContinue, onClose }: any) => (
    <div data-testid="vocab-calendar">
      <button onClick={onContinue} data-testid="calendar-continue">Continue</button>
      <button onClick={onClose} data-testid="calendar-close">Close</button>
    </div>
  ),
}))

vi.mock('../../components/vocabulary/VocabAnalytics', () => ({
  default: () => <div data-testid="vocab-analytics">Analytics</div>,
}))

vi.mock('../../components/vocabulary/VocabTypingGame', () => ({
  default: ({ onClose }: any) => (
    <div data-testid="typing-game">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

vi.mock('../../components/vocabulary/VocabSentenceGame', () => ({
  default: ({ onClose }: any) => (
    <div data-testid="sentence-game">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

vi.mock('../../components/vocabulary/WordRow', () => ({
  default: ({ word }: any) => (
    <div data-testid="word-row">
      <span>{word.english}</span>
      <span>{word.uzbek}</span>
    </div>
  ),
}))

vi.mock('../../components/vocabulary/GrammarAnalysisPanel', () => ({
  default: ({ text, loading }: any) => (
    <div data-testid="grammar-analysis">
      {loading ? 'Loading...' : text || 'Analysis'}
    </div>
  ),
}))

vi.mock('../../components/vocabulary/VocabExportModal', () => ({
  default: ({ open }: any) =>
    open ? <div data-testid="export-modal">Export Modal</div> : null,
}))

// ─── Imports (after mocks) ───────────────────────────────────────────────────

import Vocabulary from '../Vocabulary'

async function renderPage() {
  const result = render(
    <BrowserRouter>
      <Vocabulary />
    </BrowserRouter>
  )
  // Flush initial useEffect async effects (loadDailyData → getSession → state updates)
  await vi.advanceTimersByTimeAsync(0)
  await vi.advanceTimersByTimeAsync(0)
  return result
}

describe('Vocabulary — page integration tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T10:00:00Z'))
    // Reset vocab state to defaults
    mockVocabState.dailyWords = []
    mockVocabState.reviewWords = []
    mockVocabState.batchWords = []
    mockVocabState.currentIdx = 0
    mockVocabState.viewMode = 'catalog'
    mockVocabState.loading = false
    mockVocabState.correctCount = 0
    mockVocabState.totalAnswered = 0
    mockVocabState.currentBatch = 1
    mockVocabState.batchResults = {}
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    })
    // Default supabase from() returns empty arrays
    mockQB.select.mockReturnThis()
    mockQB.eq.mockReturnThis()
    mockQB.gte.mockReturnThis()
    mockQB.lt.mockReturnThis()
    mockQB.order.mockReturnThis()
    mockQB.range.mockReturnThis()
    mockQB.single.mockReturnThis()
    mockQB.maybeSingle.mockReturnThis()
    mockQB.in.mockReturnThis()
    mockQB.then.mockImplementation((f: any) => f({ data: [], error: null, count: 0 }))
    // Reset mockQB chain defaults
    mockQB.select.mockReturnThis()
    mockQB.eq.mockReturnThis()
    mockQB.gte.mockReturnThis()
    mockQB.lt.mockReturnThis()
    mockQB.lte.mockReturnThis()
    mockQB.order.mockReturnThis()
    mockQB.range.mockReturnThis()
    mockQB.single.mockReturnThis()
    mockQB.maybeSingle.mockReturnThis()
    mockQB.in.mockReturnThis()
    mockQB.or.mockReturnThis()
    mockQB.then.mockImplementation((f: any) => f({ data: [], error: null, count: 0 }))
    mockFetchMonthSessions.mockResolvedValue(new Map())
    mockGetCachedLevelTotals.mockResolvedValue({ A1: 0, A2: 0, B1: 0, B2: 0 })
    // getCachedLevelTotals localStorage'ga keshlaydi — testlar orasida tozalaymiz
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    cleanup()
  })

  // ── Loading state ──────────────────────────────────────────────────────────

  it('renders loading spinner when loading is true', async () => {
    mockVocabState.loading = true
    await renderPage()
    expect(screen.getByText("So'zlar yuklanmoqda...")).toBeInTheDocument()
  })

  // ── Empty state — no words in DB ───────────────────────────────────────────

  it('renders empty state when no words in DB', async () => {
    mockVocabState.loading = false
    await renderPage()
    // The paragraph says "So'zlar bazasi bo'sh. Terminalda yugurting:" — use regex for partial match
    expect(screen.getByText(/So'zlar bazasi bo'sh/)).toBeInTheDocument()
    expect(screen.getByText('Yangilash')).toBeInTheDocument()
  })

  // ── Empty state — words exist but none for today ───────────────────────────

  it('renders "all done" message when dailyWords empty but words in DB', async () => {
    mockVocabState.loading = false
    mockVocabState.dailyWords = []
    mockVocabState.batchWords = []
    // Simulate levelStats having total > 0 (indicates words exist in DB)
    // Level totals endi getCachedLevelTotals orqali keladi (5 ta query emas)
    mockGetCachedLevelTotals.mockResolvedValue({ A1: 100, A2: 100, B1: 100, B2: 100 })
    mockQB.then.mockImplementation((f: any) =>
      f({ data: [{ id: 1 }], error: null, count: 100 })
    )
    await renderPage()
    // loadDailyData runs async in useEffect — need to flush microtasks
    // First: flush getSession() then → sets userId
    await vi.advanceTimersByTimeAsync(0)
    // When dailyWords is empty but hasWordsInDB is true,
    // the component shows the "Bugungi so'zlar tugadi" message
    expect(screen.getByText("Bugungi so'zlar tugadi")).toBeInTheDocument()
    expect(screen.getByText('Yangilash')).toBeInTheDocument()
  })

  // ── Catalog view with word list ────────────────────────────────────────────

  it('renders catalog view with VocabProgress', async () => {
    mockVocabState.dailyWords = [
      {
        word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
    ]
    mockVocabState.batchWords = [
      {
        word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
    ]
    mockQB.then.mockImplementation((f: any) =>
      f({ data: [{ id: 1, english: 'hello', uzbek: 'salom', level: 'A1' }], error: null, count: 100 })
    )

    await renderPage()
    // Page title and main sections
    expect(screen.getByText("Lug'at & Iboralar")).toBeInTheDocument()
    expect(screen.getByTestId('vocab-progress')).toBeInTheDocument()
    // Action buttons (icon-only in compact header)
    expect(screen.getByTitle('O\'yin')).toBeInTheDocument()
    expect(screen.getByTitle('Gap tarjima')).toBeInTheDocument()
    expect(screen.getByTitle('Kalendar')).toBeInTheDocument()
    expect(screen.getByTitle('Analytics')).toBeInTheDocument()
    expect(screen.getByTitle('Eksport')).toBeInTheDocument()
    expect(screen.getByTitle('Yangilash')).toBeInTheDocument()
  })

  it('renders phase navigation when batch words exist', async () => {
    mockVocabState.dailyWords = [
      {
        word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
    ]
    mockVocabState.batchWords = [
      {
        word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
    ]
    mockGetBatchWords.mockReturnValue(mockVocabState.dailyWords as any[])
    await renderPage()
    expect(screen.getByText('FlashCard')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText("O'yin")).toBeInTheDocument()
  })

  // ── Review section ─────────────────────────────────────────────────────────

  it('renders review section when reviewWords exist', async () => {
    mockVocabState.dailyWords = [
      {
        word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
    ]
    mockVocabState.batchWords = [
      {
        word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
    ]
    mockVocabState.reviewWords = [
      {
        word_id: 2, english: 'goodbye', uzbek: 'xayr', level: 'A1',
        box: 2, next_review: '2026-06-14', is_learned: false,
        correct_count: 1, wrong_count: 0, is_new: false,
        example: '', phonetic: '',
      },
    ]
    await renderPage()
    expect(screen.getByText(/takrorlanishi kerak/)).toBeInTheDocument()
    expect(screen.getByText('Boshlash')).toBeInTheDocument()
  })

  // ── Batch tabs ─────────────────────────────────────────────────────────────

  it('renders batch tabs (1-4)', async () => {
    mockVocabState.dailyWords = [
      {
        word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
      {
        word_id: 2, english: 'goodbye', uzbek: 'xayr', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
    ]
    mockVocabState.batchWords = mockVocabState.dailyWords as any[]
    // Mock getBatchWords to return words for batch 1
    (mockGetBatchWords as any).mockImplementation((words: any[], batch: number) => {
      if (batch === 1) return words.slice(0, 25)
      return []
    })

    await renderPage()
    // Batch tabs should exist
    expect(screen.getByText("1-Batch")).toBeInTheDocument()
    expect(screen.getByText("2-Batch")).toBeInTheDocument()
    expect(screen.getByText("3-Batch")).toBeInTheDocument()
    expect(screen.getByText("4-Batch")).toBeInTheDocument()
  })

  // ── FlashCard view mode ────────────────────────────────────────────────────

  it('renders FlashCard view when viewMode is flashcard', async () => {
    mockVocabState.viewMode = 'flashcard'
    mockVocabState.dailyWords = [{
      word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
      box: 1, next_review: '2026-06-15', is_learned: false,
      correct_count: 0, wrong_count: 0, is_new: true,
      example: '', phonetic: '',
    }]
    mockVocabState.batchWords = mockVocabState.dailyWords as any[]
    mockVocabState.currentIdx = 0
    await renderPage()
    expect(screen.getByTestId('flashcard')).toBeInTheDocument()
    expect(screen.getByText('hello')).toBeInTheDocument()
    // Back button
    expect(screen.getByText('← Chiqish')).toBeInTheDocument()
  })

  // ── Test view mode ─────────────────────────────────────────────────────────

  it('renders Test view when viewMode is test', async () => {
    mockVocabState.viewMode = 'test'
    mockVocabState.dailyWords = [{
      word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
      box: 1, next_review: '2026-06-15', is_learned: false,
      correct_count: 0, wrong_count: 0, is_new: true,
      example: '', phonetic: '',
    }]
    mockVocabState.batchWords = mockVocabState.dailyWords as any[]
    mockVocabState.currentIdx = 0
    await renderPage()
    expect(screen.getByTestId('word-test')).toBeInTheDocument()
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  // ── Game view mode ─────────────────────────────────────────────────────────

  it('renders Game view when viewMode is game', async () => {
    mockVocabState.viewMode = 'game'
    mockVocabState.dailyWords = [{
      word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
      box: 1, next_review: '2026-06-15', is_learned: false,
      correct_count: 0, wrong_count: 0, is_new: true,
      example: '', phonetic: '',
    }]
    mockVocabState.batchWords = mockVocabState.dailyWords as any[]
    await renderPage()
    expect(screen.getByTestId('word-game')).toBeInTheDocument()
    expect(screen.getByText('1 words')).toBeInTheDocument()
  })

  // ── Complete view mode ─────────────────────────────────────────────────────

  it('renders Complete view when viewMode is complete', async () => {
    mockVocabState.viewMode = 'complete'
    mockVocabState.dailyWords = [
      {
        word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
      {
        word_id: 2, english: 'goodbye', uzbek: 'xayr', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
    ]
    mockVocabState.batchWords = [
      {
        word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
      {
        word_id: 2, english: 'goodbye', uzbek: 'xayr', level: 'A1',
        box: 1, next_review: '2026-06-15', is_learned: false,
        correct_count: 0, wrong_count: 0, is_new: true,
        example: '', phonetic: '',
      },
    ]
    mockVocabState.correctCount = 8
    mockVocabState.currentBatch = 1
    await renderPage()
    expect(screen.getByText('1-Batch tugadi!')).toBeInTheDocument()
    expect(screen.getByText('Keyingi batch')).toBeInTheDocument()
  })

  // ── Filter bar ─────────────────────────────────────────────────────────────

  it('renders filter bar and toggles filters', async () => {
    mockVocabState.dailyWords = [{
      word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
      box: 1, next_review: '2026-06-15', is_learned: false,
      correct_count: 0, wrong_count: 0, is_new: true,
      example: '', phonetic: '',
    }]
    mockVocabState.batchWords = mockVocabState.dailyWords as any[]
    await renderPage()
    // Search input exists
    const searchInput = screen.getByPlaceholderText("So'z qidirish...")
    expect(searchInput).toBeInTheDocument()
    // Type in search bar filters words
    fireEvent.change(searchInput, { target: { value: 'hello' } })
    expect(searchInput).toHaveValue('hello')
    // WordRow should still be visible (matches filter)
    expect(screen.getByText('hello')).toBeInTheDocument()
    // Type non-matching text
    fireEvent.change(searchInput, { target: { value: 'zzzzz' } })
    // "Hech narsa topilmadi" shown when filter removes all results
    expect(screen.getByText('Hech narsa topilmadi')).toBeInTheDocument()
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } })
    expect(screen.queryByText('Hech narsa topilmadi')).not.toBeInTheDocument()
  })

  // ── Sub-games (typing game, sentence game) ─────────────────────────────────

  it('opens typing game when clicking game button and shows close button', async () => {
    mockVocabState.dailyWords = [{
      word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1',
      box: 1, next_review: '2026-06-15', is_learned: false,
      correct_count: 0, wrong_count: 0, is_new: true,
      example: '', phonetic: '',
    }]
    mockVocabState.batchWords = mockVocabState.dailyWords as any[]
    await renderPage()
    // Click the game button (icon-only, referenced by title)
    fireEvent.click(screen.getByTitle("O'yin"))
    // Typing game should now be visible
    expect(screen.getByTestId('typing-game')).toBeInTheDocument()
    // Click the close button inside the typing game
    fireEvent.click(screen.getByText('Close'))
    // After closing, catalog view should be visible again
    expect(screen.queryByTestId('typing-game')).not.toBeInTheDocument()
    expect(screen.getByText("Lug'at & Iboralar")).toBeInTheDocument()
  })
})
