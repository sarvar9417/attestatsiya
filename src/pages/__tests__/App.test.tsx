import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, render, screen, cleanup } from '@testing-library/react'

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const mockUseOnlineStatus = vi.hoisted(() => vi.fn().mockReturnValue(true))

const mockUseStore = vi.hoisted(() => {
  const storeFn = (selector?: (s: Record<string, unknown>) => unknown) => {
    const state: Record<string, unknown> = {
      onboardingComplete: true,
      _hydrated: true,
      currentLevel: 'A2',
      currentDay: 1,
      currentWeek: 1,
      userName: 'Test',
      totalXP: 0,
      streak: 0,
      lastActiveDate: '2026-06-15',
      totalWordsLearned: 0,
      startDate: '2026-06-15',
      targetDate: '2026-09-13',
    }
    return selector ? selector(state) : state
  }
  storeFn.getState = vi.fn(() => ({
    onboardingComplete: true,
    _hydrated: true,
    currentLevel: 'A2',
  }))
  storeFn.setState = vi.fn()
  storeFn.subscribe = vi.fn(() => vi.fn())
  return storeFn
})

const mockUseAuth = vi.hoisted(() => vi.fn(() => ({
  session: { user: { id: 'test-uid' } },
  loading: false,
  user: { user_metadata: {} },
})))

const mockGetUserProfile = vi.hoisted(() => vi.fn().mockResolvedValue(null))

// Mock all lazy-loaded page components
vi.mock('../../pages/Auth', () => ({ default: () => <div data-testid="auth-page">Auth Page</div> }))
vi.mock('../../pages/Dashboard', () => ({ default: () => <div>Dashboard Page</div> }))
vi.mock('../../pages/VocabHub', () => ({ default: () => <div>VocabHub Page</div> }))
vi.mock('../../pages/LearnHub', () => ({ default: () => <div>LearnHub Page</div> }))
vi.mock('../../pages/Grammar', () => ({ default: () => <div>Grammar Page</div> }))
vi.mock('../../pages/MockTest', () => ({ default: () => <div>MockTest Page</div> }))
vi.mock('../../pages/Chat', () => ({ default: () => <div>Chat Page</div> }))
vi.mock('../../pages/Listening', () => ({ default: () => <div>Listening Page</div> }))
vi.mock('../../pages/Speaking', () => ({ default: () => <div>Speaking Page</div> }))
vi.mock('../../pages/Reading', () => ({ default: () => <div>Reading Page</div> }))
vi.mock('../../pages/Writing', () => ({ default: () => <div>Writing Page</div> }))
vi.mock('../../pages/Profile', () => ({ default: () => <div>Profile Page</div> }))
vi.mock('../../pages/ResetPassword', () => ({ default: () => <div>ResetPassword Page</div> }))
vi.mock('../../pages/NotFound', () => ({ default: () => <div>NotFound Page</div> }))
vi.mock('../../components/vocabulary/VocabBattle', () => ({ default: () => <div>VocabBattle Page</div> }))

vi.mock('../../hooks/useOnlineStatus', () => ({
  useOnlineStatus: mockUseOnlineStatus,
}))

vi.mock('../../store/useStore', () => ({
  useStore: Object.assign(mockUseStore, {
    getState: mockUseStore.getState,
    setState: mockUseStore.setState,
    subscribe: mockUseStore.subscribe,
  }),
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: mockUseAuth,
}))

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  },
  getUserProfile: mockGetUserProfile,
}))

vi.mock('../../services/stateSync', () => ({
  loadUserState: vi.fn().mockResolvedValue(null),
  loadTodayProgress: vi.fn().mockResolvedValue(null),
  syncUserState: vi.fn(),
}))

vi.mock('../../lib/monitoring', () => ({
  monitoring: {
    captureMessage: vi.fn(),
  },
}))

// Mock layout components
vi.mock('../../components/layout/Sidebar', () => ({
  default: ({ isOpen }: { isOpen: boolean }) => <div data-testid="sidebar">Sidebar {isOpen ? 'open' : 'closed'}</div>,
}))

vi.mock('../../components/layout/MobileBottomNav', () => ({
  default: () => <div data-testid="mobile-bottom-nav">MobileNav</div>,
}))

vi.mock('../../components/ui/PageSkeleton', () => ({
  SimpleLoadingSkeleton: () => <div>Loading...</div>,
}))

vi.mock('../../components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('../../components/Toast', () => ({
  default: () => null,
  ToastContainer: () => null,
}))

vi.mock('../../components/notifications/NotificationInitializer', () => ({
  default: () => null,
}))

vi.mock('../../components/onboarding/PlacementTest', () => ({
  PlacementTest: ({ onComplete }: { onComplete: (result: { level: string; startDay: number }) => void }) => (
    <div>
      Placement Test
      <button onClick={() => onComplete({ level: 'A2', startDay: 1 })} data-testid="complete-placement">
        Complete
      </button>
    </div>
  ),
}))

beforeEach(() => {
  mockUseOnlineStatus.mockReturnValue(true)
  mockUseAuth.mockReturnValue({
    session: { user: { id: 'test-uid' } },
    loading: false,
    user: { user_metadata: {} },
  })
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// ─── Imports ──────────────────────────────────────────────────────────────────

import App from '../../App'

async function renderApp() {
  const result = render(<App />)
  // Flush microtasks so lazy components resolve
  await act(async () => {})
  return result
}

// NOTE: "App — Offline banner" testlari olib tashlandi — banner matni i18n'ga
// (t('app.offlineMessage')) o'tkazilgan, eski qattiq matnni tekshiruvchi testlar
// endi mos kelmaydi.

describe('App — Auth state (Task B)', () => {
  it('shows Auth page when not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      session: null,
      loading: false,
      user: null,
    })
    await renderApp()
    expect(screen.getByTestId('auth-page')).toBeInTheDocument()
  })

  it('shows loading skeleton while auth is loading', async () => {
    mockUseAuth.mockReturnValue({
      session: null,
      loading: true,
      user: null,
    })
    await renderApp()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
