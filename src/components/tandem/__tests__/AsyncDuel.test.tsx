// ═══════════════════════════════════════════════════════════════════════════
// AsyncDuel.test.tsx — Asinxron duel o'yini komponenti testlari
// (setInterval/setTimeout bor → fake timers majburiy, aks holda vitest osiladi)
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('../../../store/useStore', () => ({
  useStore: (sel?: (s: Record<string, unknown>) => unknown) => {
    const state = { userName: 'Ali' }
    return sel ? sel(state) : state
  },
}))
vi.mock('../../../lib/gameFeel', () => ({ feelTap: vi.fn(), feelAnswer: vi.fn() }))
vi.mock('../../ui/XpBurst', () => ({ emitXpBurst: vi.fn() }))
vi.mock('../../../services/tandemService', () => ({ submitDuelAnswers: vi.fn() }))
vi.mock('../../../utils/toastStore', () => ({ useToastStore: { getState: () => ({ toast: vi.fn() }) } }))
vi.mock('../SpeakingDuelPlayer', () => ({ default: () => <div>SPEAKING_PLAYER</div> }))

import AsyncDuel from '../AsyncDuel'
import type { Duel, DuelQuestion } from '../../../types/tandem'

const questions: DuelQuestion[] = [
  { id: 1, english: 'cat', options: ['mushuk', 'it', 'olma', 'non'], correct: 0 },
  { id: 2, english: 'dog', options: ['it', 'mushuk', 'suv', 'non'], correct: 0 },
]

function duel(over: Partial<Duel> = {}): Duel {
  return {
    id: 'd1', challenger: 'me', opponent: 'friend', mode: 'vocab', status: 'pending',
    question_set: questions, challenger_score: null, opponent_score: null,
    is_bot: false, expires_at: '', created_at: '',
    ...over,
  } as Duel
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => { cleanup(); vi.useRealTimers(); vi.clearAllMocks() })

describe('AsyncDuel', () => {
  it('shows loading spinner when no questions', () => {
    const { container } = render(
      <AsyncDuel duel={duel({ question_set: [] })} mode="vocab" onComplete={vi.fn()} userRole="challenger" />,
    )
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders the first question with options and progress', () => {
    render(<AsyncDuel duel={duel()} mode="vocab" onComplete={vi.fn()} userRole="challenger" />)
    expect(screen.getByText('cat')).toBeInTheDocument()
    expect(screen.getByText('mushuk')).toBeInTheDocument()
    expect(screen.getByText('it')).toBeInTheDocument()
    expect(screen.getByText('1/2')).toBeInTheDocument()   // savol indikatori
    expect(screen.getByText('Ali')).toBeInTheDocument()   // store'dan userName
  })

  it('shows bot hint for AI duels', () => {
    render(<AsyncDuel duel={duel({ is_bot: true })} mode="vocab" onComplete={vi.fn()} userRole="challenger" />)
    expect(screen.getByText(/AI botga qarshi/)).toBeInTheDocument()
  })

  it('delegates to SpeakingDuelPlayer in speaking mode', () => {
    render(<AsyncDuel duel={duel({ mode: 'speaking' })} mode="speaking" onComplete={vi.fn()} userRole="challenger" />)
    expect(screen.getByText('SPEAKING_PLAYER')).toBeInTheDocument()
  })

  it('shows lesson title label in lesson mode', () => {
    render(
      <AsyncDuel duel={duel({ mode: 'lesson', lesson_title: 'Present Simple' })} mode="lesson" onComplete={vi.fn()} userRole="challenger" />,
    )
    expect(screen.getByText('Present Simple')).toBeInTheDocument()
  })
})
