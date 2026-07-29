import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// ─── Hoisted mocks ──────────────────────────────────────────────────────────

const mockStoreState = vi.hoisted(() => ({
  userName: 'TestUser', startDate: '2026-01-01', targetDate: '2026-12-31',
  totalXP: 12500, streak: 30, currentDay: 60,
}))

vi.mock('../../store/useStore', () => ({
  useStore: (s?: (x: typeof mockStoreState) => unknown) => s ? s(mockStoreState) : mockStoreState,
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'user-test' }, signOut: vi.fn() }),
}))

// Shared query builder that supports all chaining patterns
function makeQB() {
  const self: Record<string, unknown> = {
    select: vi.fn(() => self),
    eq: vi.fn(() => self),
    in: vi.fn(() => self),
    order: vi.fn(() => self),
    limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
    maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
  }
  return self as ReturnType<typeof vi.fn> & typeof self
}

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => makeQB()),
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'user-1' } } } }) },
  },
}))

vi.mock('../../components/ui/Breadcrumb', () => ({
  default: () => <nav data-testid="breadcrumb" />,
}))

vi.mock('../../components/profile/ProfileInfo', () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="profile-info">
      <span data-testid="profile-info-wins">{String(props.weeklyWins)}</span>
      <span data-testid="profile-info-rewards">{String((props.claimedRewardIds as string[]).length)}</span>
    </div>
  ),
}))

vi.mock('../../components/profile/ProfileProgress', () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="profile-progress">
      <span>Streak: {props.supaStreak as number}</span>
      <span>Timeline: {(props.timeline as unknown[]).length} days</span>
    </div>
  ),
}))

vi.mock('../../components/profile/ProfileAchievements', () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="profile-achievements">
      <button data-testid="category-all" onClick={() => (props.setSelectedCategory as (c: string) => void)('all')}>All</button>
    </div>
  ),
}))

vi.mock('../../components/profile/ProfileLeaders', () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="profile-leaders">
      <span>Sort: {props.sortBy as string}</span>
      <span>Loading: {String(props.leadersLoading)}</span>
    </div>
  ),
}))

vi.mock('../../components/ui/Certificate', () => ({
  Certificate: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="certificate">
      <button data-testid="cert-close" onClick={onClose}>Close</button>
    </div>
  ),
}))

vi.mock('../../services/rewardService', () => ({
  getClaimedRewardIds: vi.fn().mockResolvedValue([]),
  claimPendingRewards: vi.fn().mockResolvedValue([]),
}))

vi.mock('../../lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn(), captureException: vi.fn() },
}))

// ─── Import ──────────────────────────────────────────────────────────────────

import Profile from '../Profile'

function renderPage() {
  return render(<BrowserRouter><Profile /></BrowserRouter>)
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Header ────────────────────────────────────────────────────────────────

  it('renders profile title', () => {
    renderPage()
    // uz.json: profile.title = "Profil"
    expect(screen.getAllByText('Profil').length).toBeGreaterThanOrEqual(1)
  })

  it('shows greeting with user name', () => {
    renderPage()
    expect(screen.getByText(/TestUser/)).toBeInTheDocument()
  })

  // ── Tab Bar ───────────────────────────────────────────────────────────────

  it('renders all 4 profile tabs', () => {
    renderPage()
    expect(screen.getByText('👤')).toBeInTheDocument()
    expect(screen.getByText('📊')).toBeInTheDocument()
    expect(screen.getByText('🏆')).toBeInTheDocument()
    expect(screen.getByText('🏅')).toBeInTheDocument()
  })

  it('shows Info tab by default', () => {
    renderPage()
    expect(screen.getByTestId('profile-info')).toBeInTheDocument()
  })

  // ── Tab Switching ─────────────────────────────────────────────────────────

  it('switches to Progress tab', async () => {
    renderPage()
    fireEvent.click(screen.getByText('📊'))
    await waitFor(() => {
      expect(screen.getByTestId('profile-progress')).toBeInTheDocument()
    })
  })

  it('switches to Achievements tab', async () => {
    renderPage()
    fireEvent.click(screen.getByText('🏆'))
    await waitFor(() => {
      expect(screen.getByTestId('profile-achievements')).toBeInTheDocument()
    })
  })

  it('switches to Leaders tab', async () => {
    renderPage()
    fireEvent.click(screen.getByText('🏅'))
    await waitFor(() => {
      expect(screen.getByTestId('profile-leaders')).toBeInTheDocument()
    })
  })

  // ── Tab Styling ───────────────────────────────────────────────────────────

  it('highlights the active tab', () => {
    renderPage()
    const infoTab = screen.getByText('👤').closest('button')!
    expect(infoTab.className).toContain('bg-white')
  })

  it('changes active tab style when switching', () => {
    renderPage()
    fireEvent.click(screen.getByText('📊'))
    const progressTab = screen.getByText('📊').closest('button')!
    expect(progressTab.className).toContain('bg-white')
    const infoTab = screen.getByText('👤').closest('button')!
    expect(infoTab.className).not.toContain('bg-white')
  })

  // ── Sign Out Button ───────────────────────────────────────────────────────

  it('shows sign out button on Info tab only', () => {
    renderPage()
    // uz.json: profile.signOut = "Chiqish"
    expect(screen.getByText('Chiqish')).toBeInTheDocument()

    // Switch to another tab — sign out should disappear
    fireEvent.click(screen.getByText('📊'))
    expect(screen.queryByText('Chiqish')).not.toBeInTheDocument()
  })

  // ── Info Tab (default) ────────────────────────────────────────────────────

  it('passes weeklyWins to ProfileInfo', () => {
    renderPage()
    expect(screen.getByTestId('profile-info-wins').textContent).toBe('0')
  })

  // ── Active tab persists across renders ────────────────────────────────────

  it('keeps the active tab state after clicking', () => {
    renderPage()
    fireEvent.click(screen.getByText('🏆'))
    expect(screen.getByTestId('profile-achievements')).toBeInTheDocument()

    // Re-render shouldn't reset the tab (but the component is local state, so it depends on mount)
    // Just check that clicking again works
    fireEvent.click(screen.getByText('📊'))
    expect(screen.getByTestId('profile-progress')).toBeInTheDocument()
  })
})
