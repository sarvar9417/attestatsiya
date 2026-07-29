/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import PhraseTypingGame from '../PhraseTypingGame'

// ═════════════════════════════════════════════════════════════════════════
// Sample data
// ═════════════════════════════════════════════════════════════════════════

const SAMPLE_PHRASES = [
  { id: 1, english: 'How are you?', uzbek: 'Qandaysiz?', level: 'A1' },
  { id: 2, english: 'I am a student.', uzbek: 'Men talabaman.', level: 'A1' },
  { id: 3, english: 'Good morning!', uzbek: 'Xayrli tong!', level: 'A1' },
]

// ═════════════════════════════════════════════════════════════════════════
// Hoisted mocks
// ═════════════════════════════════════════════════════════════════════════

const mockCheckPhraseTranslation = vi.hoisted(() => vi.fn())
const mockGetTodayTashkent = vi.hoisted(() => vi.fn(() => '2026-06-15'))

/** Query-builder chain — each method returns `qb` so the chain works */
const mockQB = vi.hoisted(() => {
  const qb: Record<string, ReturnType<typeof vi.fn>> & { then: ReturnType<typeof vi.fn> } = {
    select: vi.fn(() => qb as any),
    eq: vi.fn(() => qb as any),
    limit: vi.fn(() => qb as any),
    order: vi.fn(() => qb as any),
    range: vi.fn(() => qb as any),
    then: vi.fn((f: (v: unknown) => void) => f({ data: [], error: null })),
  }
  return qb as any
})

const mockSupabase = vi.hoisted(() => ({
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
  },
  from: vi.fn(() => mockQB),
}))

// ═════════════════════════════════════════════════════════════════════════
// Module mocks
// ═════════════════════════════════════════════════════════════════════════
// NOTE: from src/components/phrases/__tests__/, need ../../../ to reach src/
vi.mock('../../../lib/supabase', () => ({ supabase: mockSupabase }))
vi.mock('../../../lib/claude', () => ({ checkPhraseTranslation: mockCheckPhraseTranslation }))
vi.mock('../../../utils/tashkentDate', () => ({ getTodayTashkent: mockGetTodayTashkent }))

// ═════════════════════════════════════════════════════════════════════════
// Helpers
// ═════════════════════════════════════════════════════════════════════════

function mockPhrasesFetch(data: typeof SAMPLE_PHRASES) {
  mockSupabase.from.mockReturnValue(mockQB)
  mockQB.select.mockReturnThis()
  mockQB.eq.mockReturnThis()
  mockQB.limit.mockReturnThis()
  mockQB.then.mockImplementation(
    (f: (v: { data: unknown; error: unknown }) => void) => f({ data, error: null }),
  )
}

/** Click a level-select button by its text content (e.g. "A1") */
function clickLevel(level: string) {
  const buttons = screen.getAllByRole('button')
  const btn = buttons.find(b => b.textContent?.includes(level))
  if (!btn) throw new Error(`Level button "${level}" not found`)
  fireEvent.click(btn)
}

/** Type into the input and click the submit button */
function submitAnswer(text: string) {
  const input = screen.getByPlaceholderText("Inglizcha gapni yozing...")
  fireEvent.change(input, { target: { value: text } })
  act(() => {
    fireEvent.click(screen.getByRole('button', { name: /yuborish/i }))
  })
}

/** Click the "Keyingi" button to advance to next question */
function clickNext() {
  act(() => { fireEvent.click(screen.getByText('Keyingi')) })
}

// ═════════════════════════════════════════════════════════════════════════
// Tests — all use real timers; navigation uses "Keyingi" button click
// ═════════════════════════════════════════════════════════════════════════

describe('PhraseTypingGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // deterministic shuffle
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    mockPhrasesFetch(SAMPLE_PHRASES)
    mockCheckPhraseTranslation.mockResolvedValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ── Level select ────────────────────────────────────────────────────────

  it('renders level select screen on mount', () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    expect(screen.getByText("Gap yozish o'yini")).toBeInTheDocument()
    expect(screen.getByText('A1')).toBeInTheDocument()
    expect(screen.getByText('A2')).toBeInTheDocument()
    expect(screen.getByText('B1')).toBeInTheDocument()
    expect(screen.getByText('B2')).toBeInTheDocument()
  })

  it('calls onClose when X button is clicked', () => {
    const onClose = vi.fn()
    render(<PhraseTypingGame onClose={onClose} />)
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  // ── Game start ──────────────────────────────────────────────────────────

  it('starts game and fetches phrases from supabase', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)

    act(() => { clickLevel('A1') })

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Inglizcha gapni yozing...")).toBeInTheDocument()
    })

    expect(mockSupabase.from).toHaveBeenCalledWith('phrases')
    expect(screen.getByText('Qandaysiz?')).toBeInTheDocument()
    expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument()
  })

  // ── Exact match (no AI call) ────────────────────────────────────────────

  it('marks correct on exact match without calling AI', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('How are you?')

    expect(mockCheckPhraseTranslation).not.toHaveBeenCalled()
    expect(screen.getByText("To'g'ri!")).toBeInTheDocument()
  })

  it('marks correct on normalized match (lowercase, no punctuation) without AI', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('how are you')

    expect(mockCheckPhraseTranslation).not.toHaveBeenCalled()
    expect(screen.getByText("To'g'ri!")).toBeInTheDocument()
  })

  it('marks correct with extra spaces without AI', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('  How are you?  ')

    expect(mockCheckPhraseTranslation).not.toHaveBeenCalled()
    expect(screen.getByText("To'g'ri!")).toBeInTheDocument()
  })

  // ── AI fallback — correct ───────────────────────────────────────────────

  it('calls AI and marks correct when AI returns true', async () => {
    mockCheckPhraseTranslation.mockResolvedValue(true)
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('How are you doing?')

    // Should show AI checking indicator
    expect(screen.getByText('AI tekshirilmoqda...')).toBeInTheDocument()

    // Wait for AI to resolve
    await waitFor(() => expect(screen.getByText("To'g'ri!")).toBeInTheDocument())

    expect(mockCheckPhraseTranslation).toHaveBeenCalledWith(
      'Qandaysiz?', 'How are you?', 'How are you doing?',
    )
  })

  it('shows yellow background while AI is checking', async () => {
    // Never-resolving promise keeps the component in checking state
    mockCheckPhraseTranslation.mockImplementation(() => new Promise(() => {}))
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('How are you doing?')

    const card = screen.getByText('AI tekshirilmoqda...').closest('.rounded-2xl')
    expect(card?.className).toMatch(/bg-yellow-50/)
  })

  // ── AI fallback — wrong / error ─────────────────────────────────────────

  it('calls AI and marks wrong when AI returns false', async () => {
    mockCheckPhraseTranslation.mockResolvedValue(false)
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('Where are you?')

    await waitFor(() => expect(screen.getByText("Noto'g'ri")).toBeInTheDocument())
    expect(mockCheckPhraseTranslation).toHaveBeenCalled()
  })

  it('marks wrong when AI throws an error', async () => {
    mockCheckPhraseTranslation.mockRejectedValue(new Error('Network error'))
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('How are you doing?')

    await waitFor(() => expect(screen.getByText("Noto'g'ri")).toBeInTheDocument())
  })

  // ── Lock / disabled state ───────────────────────────────────────────────

  it('prevents double submit while locked', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('How are you?')

    expect(screen.getByPlaceholderText("Inglizcha gapni yozing...")).toBeDisabled()
    expect(screen.getByRole('button', { name: /yuborish/i })).toBeDisabled()
  })

  it('submits on Enter key press', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    const input = screen.getByPlaceholderText("Inglizcha gapni yozing...")
    fireEvent.change(input, { target: { value: 'How are you?' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => expect(screen.getByText("To'g'ri!")).toBeInTheDocument())
  })

  it('disables input after submit while locked', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    const input = screen.getByPlaceholderText("Inglizcha gapni yozing...")
    expect(input).not.toBeDisabled()

    submitAnswer('How are you?')
    await waitFor(() => expect(input).toBeDisabled())
  })

  // ── Misc UI during playing ──────────────────────────────────────────────

  it('shows level badge during playing', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    expect(screen.getByText(/^A1$/)).toBeInTheDocument()
  })

  it('shows progress counter during playing', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument()
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Navigation & result screen — use "Keyingi" button click (no fake timers)
  // ═══════════════════════════════════════════════════════════════════════

  it('advances to next question by clicking Keyingi (exact match)', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('How are you?')
    clickNext()

    await waitFor(() => expect(screen.getByText('Men talabaman.')).toBeInTheDocument())
  })

  it('advances to next question with AI check', async () => {
    mockCheckPhraseTranslation.mockResolvedValue(true)
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    const input = screen.getByPlaceholderText("Inglizcha gapni yozing...")
    fireEvent.change(input, { target: { value: 'How are you doing?' } })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /yuborish/i })) })

    // Wait for AI to resolve and show Keyingi button
    await waitFor(() => expect(screen.getByText('Keyingi')).toBeInTheDocument())
    clickNext()

    await waitFor(() => expect(screen.getByText('Men talabaman.')).toBeInTheDocument())
  })

  it('shows result screen after all questions', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('How are you?')
    clickNext()
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('I am a student.')
    clickNext()
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('Good morning!')
    clickNext()

    await waitFor(() => expect(screen.getByText(/100% to'g'ri/)).toBeInTheDocument())
  })

  it('shows mistakes on result screen', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    // Q1: exact match → correct
    submitAnswer('How are you?')
    clickNext()
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    // Q2: AI says false → wrong
    mockCheckPhraseTranslation.mockResolvedValue(false)
    const input2 = screen.getByPlaceholderText("Inglizcha gapni yozing...")
    fireEvent.change(input2, { target: { value: 'completely wrong' } })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /yuborish/i })) })
    // Wait for AI to resolve
    await waitFor(() => expect(screen.getByText('Keyingi')).toBeInTheDocument())
    clickNext()
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    // Q3: exact match → correct
    mockCheckPhraseTranslation.mockResolvedValue(true)
    submitAnswer('Good morning!')
    clickNext()

    await waitFor(() => expect(screen.getByText(/Xatolar — 1 ta/)).toBeInTheDocument())
  })

  it('shows play again button on result screen', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('How are you?')
    clickNext()
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('I am a student.')
    clickNext()
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('Good morning!')
    clickNext()

    await waitFor(() => expect(screen.getByText("Qayta o'ynash")).toBeInTheDocument())
  })

  it('starts a new game when play again is clicked', async () => {
    render(<PhraseTypingGame onClose={vi.fn()} />)
    act(() => { clickLevel('A1') })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('How are you?')
    clickNext()
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('I am a student.')
    clickNext()
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))

    submitAnswer('Good morning!')
    clickNext()

    await waitFor(() => expect(screen.getByText("Qayta o'ynash")).toBeInTheDocument())

    act(() => { fireEvent.click(screen.getByText("Qayta o'ynash")) })
    await waitFor(() => screen.getByPlaceholderText("Inglizcha gapni yozing..."))
    expect(screen.getByText('Qandaysiz?')).toBeInTheDocument()
  })
})
