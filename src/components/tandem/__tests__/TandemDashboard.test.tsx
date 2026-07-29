// ═══════════════════════════════════════════════════════════════════════════
// TandemDashboard.test.tsx — Tandem Dashboard component tests
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import type { Mock } from 'vitest'

const { mockUseTandemStore } = vi.hoisted(() => {
  const store: Record<string, unknown> = {
    friends: [],
    pendingInvites: [],
    loadingFriends: false,
    tandemPair: null,
    activeDuels: [],
    duelHistory: [],
    pendingOpponentDuels: [],
    roleplaySessions: [],
    loadAll: vi.fn(),
    removeFriend: vi.fn(),
    initTandemPair: vi.fn(),
    startDuel: vi.fn(),
    cancelDuel: vi.fn(),
    loadRoleplaySessions: vi.fn(),
  }
  return { mockUseTandemStore: store }
})

vi.mock('../../store/tandemSlice', () => ({
  useTandemStore: (selector?: (s: Record<string, unknown>) => unknown) =>
    selector ? selector(mockUseTandemStore as Record<string, unknown>) : mockUseTandemStore,
}))

vi.mock('./HotSeatDuel', () => ({ default: () => <div data-testid="hotseat-duel">HS</div> }))

// Mock supabase for the dynamic import in the component's useEffect
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'test-uid' } } },
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { name: 'TestUser' }, error: null }),
        })),
      })),
    })),
  },
}))

import TandemDashboard from '../TandemDashboard'

beforeEach(() => {
  mockUseTandemStore.friends = []
  mockUseTandemStore.tandemPair = null
  mockUseTandemStore.startDuel = vi.fn()
  ;(mockUseTandemStore.loadAll as Mock).mockReset()
  ;(mockUseTandemStore.removeFriend as Mock).mockReset()
})

afterEach(() => {
  cleanup()
})

// Simple tests that verify the component renders key UI elements

describe('TandemDashboard', () => {
  it('renders header', () => {
    render(<TandemDashboard />)
    expect(screen.getByText('Tandem')).toBeInTheDocument()
  })

  it('shows AI duel buttons', () => {
    render(<TandemDashboard />)
    expect(screen.getByText(/AI bilan duel/)).toBeInTheDocument()
    expect(screen.getByText("📚 So'z")).toBeInTheDocument()
    expect(screen.getByText(/Hot Seat/)).toBeInTheDocument()
  })

  it('disables buttons while creating duel', () => {
    mockUseTandemStore.startDuel = vi.fn().mockResolvedValue({})
    render(<TandemDashboard />)
    const buttons = screen.getAllByRole('button')
    const vocabBtn = buttons.find(b => b.textContent?.includes("So'z"))
    expect(vocabBtn).toBeTruthy()
    // Click should trigger handleAIDuel which sets creatingDuel = true
    fireEvent.click(vocabBtn!)
    // After click, buttons should be disabled
    expect(vocabBtn).toBeDisabled()
  })
})
