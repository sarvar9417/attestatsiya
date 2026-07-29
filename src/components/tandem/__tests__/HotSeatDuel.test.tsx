// ═══════════════════════════════════════════════════════════════════════════
// HotSeatDuel.test.tsx — Hot Seat component e2e testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockSupabaseInstance, mockFetchQuestions, mockAddXP } = vi.hoisted(() => ({
  mockSupabaseInstance: {
    auth: { getSession: vi.fn() },
    channel: vi.fn(() => ({
      on: vi.fn(() => ({ subscribe: vi.fn() })),
      subscribe: vi.fn(),
      send: vi.fn(),
    })),
    removeChannel: vi.fn(),
  },
  mockFetchQuestions: vi.fn().mockResolvedValue({
    questions: [
      { id: 1, english: 'Apple', options: ['Olma', 'Banan', 'Gilos', 'Shaftoli'], correct: 0 },
    ],
  }),
  mockAddXP: vi.fn(),
}))

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))
vi.mock('../../services/battleService', () => ({ fetchBattleQuestionsByMode: mockFetchQuestions }))
vi.mock('../../store/useStore', () => ({
  useStore: (selector?: (s: Record<string, unknown>) => unknown) => {
    const state = { userName: 'TestUser', addXP: mockAddXP }
    return selector ? selector(state) : state
  },
}))
vi.mock('../../utils/toastStore', () => ({ useToastStore: { getState: () => ({ toast: vi.fn() }) } }))
vi.mock('../../lib/gameFeel', () => ({ feelAnswer: vi.fn() }))
vi.mock('../ui/XpBurst', () => ({ emitXpBurst: vi.fn() }))

import HotSeatDuel from '../HotSeatDuel'

beforeEach(() => {
  mockFetchQuestions.mockClear()
  mockSupabaseInstance.channel.mockClear()
  // vi.restoreAllMocks() in afterEach clears return values
  mockFetchQuestions.mockResolvedValue({
    questions: [
      { id: 1, english: 'Apple', options: ['Olma', 'Banan', 'Gilos', 'Shaftoli'], correct: 0 },
    ],
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

// ═══════════════════════════════════════════════════════════════════════════════

describe('Setup screen', () => {
  it('renders all mode and level selections', () => {
    render(<HotSeatDuel onBack={vi.fn()} />)
    expect(screen.getByText('Hot Seat 🔥')).toBeInTheDocument()
    expect(screen.getByText(/5 soniya tezkor duel/)).toBeInTheDocument()
    expect(screen.getByText("📚 So'z")).toBeInTheDocument()
    expect(screen.getByText('📖 Grammatika')).toBeInTheDocument()
    ;['A1', 'A2', 'B1', 'B2'].forEach(l => expect(screen.getByText(l)).toBeInTheDocument())
    expect(screen.getByText(/Same Device — Bir telefonda/)).toBeInTheDocument()
    expect(screen.getByText(/Online — Ikki telefonda/)).toBeInTheDocument()
    expect(screen.getByText('Ortga')).toBeInTheDocument()
  })

  it('switches mode and level on click', () => {
    render(<HotSeatDuel onBack={vi.fn()} />)

    const vocabBtn = screen.getByText("📚 So'z")
    expect(vocabBtn.className).toContain('border-primary-400')

    fireEvent.click(screen.getByText('📖 Grammatika'))
    expect(screen.getByText('📖 Grammatika').className).toContain('border-primary-400')

    fireEvent.click(screen.getByText('A2'))
    expect(screen.getByText('A2').className).toContain('ring-2')
  })

  it('calls onBack when clicking Ortga', () => {
    const onBack = vi.fn()
    render(<HotSeatDuel onBack={onBack} />)
    fireEvent.click(screen.getByText('Ortga'))
    expect(onBack).toHaveBeenCalled()
  })

  it('shows countdown when Same Device clicked', () => {
    render(<HotSeatDuel onBack={vi.fn()} />)
    // Clicking Same Device changes gameMode synchronously
    fireEvent.click(screen.getByText(/Same Device — Bir telefonda/))
    // The countdown screen appears synchronously (sdCountdown > 1 by default)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════

describe('Online lobby', () => {
  it('shows lobby screen when Online clicked', () => {
    render(<HotSeatDuel onBack={vi.fn()} />)
    fireEvent.click(screen.getByText(/Online — Ikki telefonda/))

    expect(screen.getByText('Online Hot Seat')).toBeInTheDocument()
    expect(screen.getByText('Yangi xona yaratish')).toBeInTheDocument()
    expect(screen.getByText("Xonaga qo'shilish")).toBeInTheDocument()
  })

  it('shows waiting screen when room created', async () => {
    const mockOn = vi.fn(() => ({ subscribe: vi.fn() }))
    mockSupabaseInstance.channel.mockReturnValue({
      on: mockOn,
      subscribe: vi.fn(),
      send: vi.fn(),
    })

    render(<HotSeatDuel onBack={vi.fn()} />)
    fireEvent.click(screen.getByText(/Online — Ikki telefonda/))
    fireEvent.click(screen.getByText('Yangi xona yaratish'))

    // Waiting screen should appear
    expect(screen.getByText(/Raqib kutilmoqda/)).toBeInTheDocument()
  })

  it('disables join button with short ID', () => {
    render(<HotSeatDuel onBack={vi.fn()} />)
    fireEvent.click(screen.getByText(/Online — Ikki telefonda/))

    const input = screen.getByPlaceholderText('XONA ID') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'AB' } })
    expect(screen.getByText("Xonaga qo'shilish")).toBeDisabled()
  })

  it('enables join button with valid ID', () => {
    render(<HotSeatDuel onBack={vi.fn()} />)
    fireEvent.click(screen.getByText(/Online — Ikki telefonda/))

    const input = screen.getByPlaceholderText('XONA ID') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'ABC123' } })
    expect(screen.getByText("Xonaga qo'shilish")).not.toBeDisabled()
  })
})
