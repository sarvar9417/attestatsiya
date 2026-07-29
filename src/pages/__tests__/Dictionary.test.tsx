import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import type { DictWord } from '../../services/dictionaryService'

// ─── Hoisted mocks ───────────────────────────────────────────────────────────

const mockSupabase = vi.hoisted(() => ({
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    }),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
  })),
}))

const mockDictService = vi.hoisted(() => {
  // Use module-level variables so tests can update them
  const state = {
    fetchWordListResult: { words: [] as DictWord[], total: 0 },
    searchDictionaryResult: { words: [] as DictWord[] },
    addUserWordResult: { success: true, error: null as string | null },
    deleteUserWordResult: Promise.resolve(),
  }

  return {
    __state: state,
    fetchWordList: vi.fn(() => Promise.resolve(state.fetchWordListResult)),
    searchDictionary: vi.fn(() => Promise.resolve(state.searchDictionaryResult)),
    addUserWord: vi.fn(() => Promise.resolve(state.addUserWordResult)),
    deleteUserWord: vi.fn(() => state.deleteUserWordResult),
  }
})

// ─── Module mocks ────────────────────────────────────────────────────────────

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase,
}))

vi.mock('../../services/dictionaryService', () => ({
  fetchWordList: mockDictService.fetchWordList,
  searchDictionary: mockDictService.searchDictionary,
  addUserWord: mockDictService.addUserWord,
  deleteUserWord: mockDictService.deleteUserWord,
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeWord(overrides: Partial<DictWord> = {}): DictWord {
  return {
    word_id: 1,
    english: 'hello',
    uzbek: 'salom',
    level: 'A1',
    source: 'system',
    box: null,
    is_learned: false,
    correct_count: null,
    wrong_count: null,
    example: '',
    phonetic: '',
    ...overrides,
  }
}

// ─── Imports (after mocks) ───────────────────────────────────────────────────

import Dictionary from '../Dictionary'

async function renderPage() {
  const result = render(
    <BrowserRouter>
      <Dictionary />
    </BrowserRouter>
  )
  // Flush initial useEffect async effects (getSession → setUserId → loadAll)
  await vi.advanceTimersByTimeAsync(0)
  await vi.advanceTimersByTimeAsync(0)
  return result
}

describe('Dictionary — page integration tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T10:00:00Z'))
    window.confirm = vi.fn(() => true) as unknown as ((message?: string) => boolean)
    // Mock speechSynthesis
    Object.defineProperty(window, 'speechSynthesis', {
      value: { cancel: vi.fn(), speak: vi.fn() },
      writable: true,
    })
    // jsdom doesn't have SpeechSynthesisUtterance — mock it as a proper constructor
    class MockUtterance {
      lang = ''
      rate = 0
      text = ''
      pitch = 1
      volume = 1
      voice: SpeechSynthesisVoice | null = null
      onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
      onerror: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => void) | null = null
      onpause: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
      onresume: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
      onstart: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
      onboundary: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
      onmark: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
      constructor(text?: string) {
        this.text = text ?? ''
      }
      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() { return true }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).SpeechSynthesisUtterance = MockUtterance
    // Reset service mock state
    mockDictService.__state.fetchWordListResult = { words: [], total: 0 }
    mockDictService.__state.searchDictionaryResult = { words: [] }
    mockDictService.__state.addUserWordResult = { success: true, error: null }
    mockDictService.__state.deleteUserWordResult = Promise.resolve()
    // Re-apply supabase mocks that lose their implementation after vi.restoreAllMocks
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    cleanup()
  })

  // ── Loading state ──────────────────────────────────────────────────────────

  it('shows loading spinner while fetching word list', async () => {
    // fetchWordList returns a promise that hasn't resolved yet
    mockDictService.fetchWordList.mockReturnValueOnce(new Promise(() => {}))
    await renderPage()
    // Flush microtasks so getSession().then() sets userId and triggers loadAll
    await vi.advanceTimersByTimeAsync(0)
    // Flush React state update from loadAll's setLoading(true)
    await vi.advanceTimersByTimeAsync(0)
    expect(document.querySelector('.skeleton-shimmer')).toBeInTheDocument()
  })

  // ── Empty state ────────────────────────────────────────────────────────────

  it('renders initial empty state with add-word button', async () => {
    mockDictService.fetchWordList.mockResolvedValue({ words: [], total: 0 })
    await renderPage()
    await vi.advanceTimersByTimeAsync(100)
    await vi.advanceTimersByTimeAsync(0)
    expect(screen.getByText("Hozircha hech qanday so'z yo'q")).toBeInTheDocument()
    expect(screen.getByText("Birinchi so'zni qo'shish")).toBeInTheDocument()
  })

  // ── Word list rendering ────────────────────────────────────────────────────

  it('renders word list grouped by level', async () => {
    const words: DictWord[] = [
      makeWord({ word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1' }),
      makeWord({ word_id: 2, english: 'book', uzbek: 'kitob', level: 'A2' }),
    ]
    mockDictService.fetchWordList.mockResolvedValue({ words, total: 2 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)
    await vi.advanceTimersByTimeAsync(0)

    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByText('book')).toBeInTheDocument()
    // Both level badges
    // A1 appears in both LevelGroup header and WordCard badge (2 elements)
    const a1Badges = screen.getAllByText('A1')
    expect(a1Badges.length).toBeGreaterThanOrEqual(1)
    // A2 appears in both LevelGroup header and WordCard badge
    const a2Badges = screen.getAllByText('A2')
    expect(a2Badges.length).toBeGreaterThanOrEqual(1)
  })

  // ── Search flow ────────────────────────────────────────────────────────────

  it('searches when user types a query', async () => {
    const searchResult: DictWord[] = [
      makeWord({ word_id: 3, english: 'world', uzbek: 'dunyo', level: 'B1' }),
    ]
    mockDictService.searchDictionary.mockResolvedValue({ words: searchResult })
    mockDictService.fetchWordList.mockResolvedValue({ words: [], total: 0 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    const input = screen.getByPlaceholderText("Inglizcha yoki o'zbekcha so'z qidiring...")
    fireEvent.change(input, { target: { value: 'world' } })

    await vi.advanceTimersByTimeAsync(400) // 300ms debounce + resolution

    expect(mockDictService.searchDictionary).toHaveBeenCalledWith('world', 'user-1', undefined)
    expect(screen.getByText('world')).toBeInTheDocument()
    expect(screen.getByText('dunyo')).toBeInTheDocument()
  })

  it('shows no results state when search returns empty', async () => {
    mockDictService.searchDictionary.mockResolvedValue({ words: [] })
    mockDictService.fetchWordList.mockResolvedValue({ words: [], total: 0 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    const input = screen.getByPlaceholderText("Inglizcha yoki o'zbekcha so'z qidiring...")
    fireEvent.change(input, { target: { value: 'zzzzz' } })

    await vi.advanceTimersByTimeAsync(400)

    expect(screen.getByText(/bo'yicha hech narsa topilmadi/)).toBeInTheDocument()
  })

  // ── Level filters ──────────────────────────────────────────────────────────

  it('renders level filter chips and allows filtering', async () => {
    const words: DictWord[] = [
      makeWord({ word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1' }),
      makeWord({ word_id: 2, english: 'book', uzbek: 'kitob', level: 'A2' }),
    ]
    mockDictService.fetchWordList.mockResolvedValue({ words, total: 2 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    // Level filter buttons
    expect(screen.getByText('Barcha')).toBeInTheDocument()
    // A1 appears in filter chip + word card badge → use getAllByText
    expect(screen.getAllByText('A1').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('A2').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('B1')).toBeInTheDocument()
    expect(screen.getByText('B2')).toBeInTheDocument()
  })

  it('calls fetchWordList with level filter when clicking a level chip', async () => {
    mockDictService.fetchWordList.mockResolvedValue({ words: [], total: 0 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    // Click A1 level filter
    const a1Btn = screen.getByText('A1')
    fireEvent.click(a1Btn)

    // fetchWordList should be called with level filter
    expect(mockDictService.fetchWordList).toHaveBeenCalledWith('user-1', 'A1', 1, 20)
  })

  // ── Add word modal ─────────────────────────────────────────────────────────

  it('opens add word modal and submits new word', async () => {
    mockDictService.fetchWordList.mockResolvedValue({ words: [], total: 0 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    // Click "Qo'shish" button
    const addBtn = screen.getByText('Qo\'shish')
    fireEvent.click(addBtn)

    // Modal should be open
    expect(screen.getByText("Yangi so'z qo'shish")).toBeInTheDocument()

    // Fill form
    const englishInput = screen.getByPlaceholderText('hello')
    const uzbekInput = screen.getByPlaceholderText('salom')
    fireEvent.change(englishInput, { target: { value: 'sun' } })
    fireEvent.change(uzbekInput, { target: { value: 'quyosh' } })

    // Submit
    const submitBtn = screen.getByText("So'zni qo'shish")
    fireEvent.click(submitBtn)

    await vi.advanceTimersByTimeAsync(100)

    expect(mockDictService.addUserWord).toHaveBeenCalledWith('user-1', {
      english: 'sun',
      uzbek: 'quyosh',
      level: 'A2',
      example: '',
      phonetic: '',
    })
  })

  it('shows validation error when submitting empty form', async () => {
    mockDictService.fetchWordList.mockResolvedValue({ words: [], total: 0 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    // Open modal
    fireEvent.click(screen.getByText('Qo\'shish'))

    // Submit without filling
    fireEvent.click(screen.getByText("So'zni qo'shish"))

    expect(screen.getByText(/Inglizcha so'zni kiriting/)).toBeInTheDocument()
  })

  // ── Word card expand/collapse ──────────────────────────────────────────────

  it('expands word card on click to show details', async () => {
    const word = makeWord({
      word_id: 1,
      english: 'hello',
      uzbek: 'salom',
      level: 'A1',
      box: 3,
      is_learned: true,
      correct_count: 5,
      wrong_count: 1,
      example: 'Hello, how are you?',
      phonetic: 'həˈloʊ',
    })
    mockDictService.fetchWordList.mockResolvedValue({ words: [word], total: 1 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    // Word card should show basic info
    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByText('salom')).toBeInTheDocument()

    // Click to expand
    fireEvent.click(screen.getByText('hello'))

    // Expanded details should be visible
    expect(screen.getByText(/Hello, how are you\?/)).toBeInTheDocument()
    expect(screen.getByText(/Box 3\/5/)).toBeInTheDocument()
    expect(screen.getAllByText(/O'rganilgan/)[0]).toBeInTheDocument()
    expect(screen.getByText('+5 / -1')).toBeInTheDocument()
  })

  // ── Delete word ────────────────────────────────────────────────────────────

  it('deletes user word and reloads list', async () => {
    const userWord = makeWord({
      word_id: 1,
      english: 'myword',
      uzbek: 'meningsözüm',
      level: 'A2',
      source: 'user',
      box: 1,
    })
    mockDictService.fetchWordList.mockResolvedValue({ words: [userWord], total: 1 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    // Click to expand user word
    fireEvent.click(screen.getByText('myword'))

    // Find delete button (trash icon)
    const deleteBtn = screen.getByTitle("O'chirish")
    fireEvent.click(deleteBtn)

    expect(window.confirm).toHaveBeenCalled()
    expect(mockDictService.deleteUserWord).toHaveBeenCalledWith('user-1', 1)
  })

  // ── Speak button ───────────────────────────────────────────────────────────

  it('triggers speech synthesis on volume button click', async () => {
    const word = makeWord({ word_id: 1, english: 'hello', uzbek: 'salom', level: 'A1' })
    mockDictService.fetchWordList.mockResolvedValue({ words: [word], total: 1 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    // Click to expand
    fireEvent.click(screen.getByText('hello'))

    // Volume button
    const volumeBtn = screen.getByTitle('Talaffuz')
    fireEvent.click(volumeBtn)

    expect(window.speechSynthesis.cancel).toHaveBeenCalled()
    expect(window.speechSynthesis.speak).toHaveBeenCalled()
  })

  // ── Clear search ───────────────────────────────────────────────────────────

  it('clears search query when clicking X button', async () => {
    mockDictService.searchDictionary.mockResolvedValue({ words: [] })
    mockDictService.fetchWordList.mockResolvedValue({ words: [], total: 0 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    const input = screen.getByPlaceholderText("Inglizcha yoki o'zbekcha so'z qidiring...")
    fireEvent.change(input, { target: { value: 'test' } })

    await vi.advanceTimersByTimeAsync(400)

    // Clear button should appear (X icon button)
    const clearBtn = input.parentElement!.querySelector('button')
    expect(clearBtn).not.toBeNull()
    if (clearBtn) {
      fireEvent.click(clearBtn)
      expect(input).toHaveValue('')
    }
  })

  // ── Pagination ─────────────────────────────────────────────────────────────

  it('shows pagination when total count exceeds page size', async () => {
    const words = Array.from({ length: 20 }, (_, i) =>
      makeWord({ word_id: i + 1, english: `word${i + 1}`, uzbek: `soz${i + 1}`, level: i < 10 ? 'A1' : 'A2' })
    )
    mockDictService.fetchWordList.mockResolvedValue({ words, total: 45 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    // Pagination should be visible (total 45 > 20 page size = 3 pages)
    expect(screen.getByText('Sahifa 1/3')).toBeInTheDocument()
    // Page buttons
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()

    // Click page 2
    fireEvent.click(screen.getByText('2'))
    expect(mockDictService.fetchWordList).toHaveBeenCalledWith('user-1', undefined, 2, 20)
  })

  // ── Close modal on backdrop click ──────────────────────────────────────────

  it('closes add word modal on backdrop click', async () => {
    mockDictService.fetchWordList.mockResolvedValue({ words: [], total: 0 })

    await renderPage()
    await vi.advanceTimersByTimeAsync(100)

    // Open modal
    fireEvent.click(screen.getByText('Qo\'shish'))
    expect(screen.getByText("Yangi so'z qo'shish")).toBeInTheDocument()

    // Click backdrop (the overlay with bg-black/40)
    const backdrop = document.querySelector('.fixed.inset-0') as HTMLElement
    expect(backdrop).not.toBeNull()
    if (backdrop) {
      fireEvent.click(backdrop)
      expect(screen.queryByText("Yangi so'z qo'shish")).not.toBeInTheDocument()
    }
  })
})
