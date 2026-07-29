// ═══════════════════════════════════════════════════════════════════════════
// FriendNeyronProfile.test.tsx — Do'st Neyron Profili komponenti testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

const { mockSupabase, mockWeak, mockGetReactions } = vi.hoisted(() => ({
  mockSupabase: { auth: { getSession: vi.fn() }, from: vi.fn() } as Record<string, unknown>,
  mockWeak: vi.fn(),
  mockGetReactions: vi.fn(),
}))

vi.mock('../../../lib/supabase', () => ({ supabase: mockSupabase }))
vi.mock('../../../services/analyticsService', () => ({ fetchQuickWeakSpots: mockWeak }))
vi.mock('../../../services/reactionService', () => ({
  addReaction: vi.fn().mockResolvedValue(true),
  removeReaction: vi.fn().mockResolvedValue(true),
  getReactions: mockGetReactions,
  REACTION_EMOJIS: { fire: '🔥', muscle: '💪', laugh: '😂', clap: '👏', party: '🎉' },
  REACTION_LABELS: { fire: 'Q', muscle: 'K', laugh: 'L', clap: 'B', party: 'T' },
}))

import { buildQB } from '../../../test/supabaseMock'
import FriendNeyronProfile from '../FriendNeyronProfile'

function queueQB(data: unknown) {
  const { qb, setResult } = buildQB()
  setResult(data, null)
  ;(mockSupabase.from as ReturnType<typeof vi.fn>).mockReturnValueOnce(qb)
}

beforeEach(() => {
  (mockSupabase.auth as { getSession: ReturnType<typeof vi.fn> }).getSession.mockResolvedValue({ data: { session: { user: { id: 'me' } } } })
  ;(mockSupabase.from as ReturnType<typeof vi.fn>).mockReset()
  // friend stats, then my stats
  queueQB({ name: 'Bob', level: 'B1', streak: 7, xp: 1200, total_words_learned: 300, current_day: 20 })
  queueQB({ level: 'A2', streak: 3, xp: 500, total_words_learned: 100, current_day: 10 })
  mockWeak.mockResolvedValue([{ category: 'grammar', label: 'Grammar', score: 60, icon: '📐', detail: 'x' }])
  mockGetReactions.mockResolvedValue([{ type: 'fire', count: 2, iReacted: false }])
})
afterEach(() => { cleanup(); vi.clearAllMocks() })

describe('FriendNeyronProfile', () => {
  it('renders friend name and a reaction after loading', async () => {
    render(<FriendNeyronProfile friendId="bob" friendName="Bob" onClose={vi.fn()} />)
    // 'Bob' bir nechta joyda (h2 + insight) → findAllByText
    expect((await screen.findAllByText('Bob')).length).toBeGreaterThan(0)
    expect(screen.getByText('🔥')).toBeInTheDocument()       // reaksiya emoji
  })

  it('shows the weakest-area insight', async () => {
    render(<FriendNeyronProfile friendId="bob" friendName="Bob" onClose={vi.fn()} />)
    // insight matn tuguni: "... ning eng kuchsiz sohasi — ..."
    expect(await screen.findByText(/eng kuchsiz sohasi/)).toBeInTheDocument()
    expect(screen.getAllByText('Grammar').length).toBeGreaterThan(0)
  })

  it('calls onClose when the backdrop is clicked', async () => {
    const onClose = vi.fn()
    const { container } = render(<FriendNeyronProfile friendId="bob" friendName="Bob" onClose={onClose} />)
    await screen.findAllByText('Bob')  // yuklanishini kutamiz
    fireEvent.click(container.firstChild as Element) // backdrop onClick={onClose}
    expect(onClose).toHaveBeenCalled()
  })
})
