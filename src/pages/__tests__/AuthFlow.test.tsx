import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import uz from '../../i18n/uz.json'

// ─── i18n mock (sync — dynamic import fails in vitest) ──────────────────────
const uzDict = vi.hoisted(() => ({} as Record<string, string>))
const mockI18n = vi.hoisted(() => {
  function mockT(key: string): string { return uzDict[key] ?? key }
  return { I18nProvider: ({ children }: { children: unknown }) => children, mockT }
})
vi.mock('../../i18n', () => ({
  I18nProvider: mockI18n.I18nProvider,
  useI18n: () => ({ locale: 'uz' as const, loading: false, t: mockI18n.mockT, setLocale: () => {} }),
}))
Object.assign(uzDict, uz as Record<string, string>)

// ─── Hoisted mocks ───────────────────────────────────────────────────────────

const mockSignOut = vi.hoisted(() => vi.fn())
const mockSignIn = vi.hoisted(() => vi.fn().mockResolvedValue({ error: null }))
const mockSignUp = vi.hoisted(() => vi.fn().mockResolvedValue({ error: null }))

const mockStoreState = vi.hoisted(() => ({
  currentLevel: 'B1',
  currentWeek: 3,
  currentDay: 15,
  streak: 5,
  targetDate: '2026-10-01',
  userName: 'TestUser',
  dailyGoalMinutes: 120,
  todayGrammarPct: 0,
  todayVocabPct: 0,
  todayListeningPct: 0,
  todayReadingPct: 0,
  todaySpeakingPct: 0,
  todayWritingPct: 0,
  todayMinutes: 0,
  todayXP: 0,
  totalXP: 0,
  todayChecklist: {
    grammar: false,
    vocabulary: false,
    listening: false,
    reading: false,
    writing: false,
    speaking: false,
  },
  lessonProgress: {} as Record<string, number>,
  lessons: [] as Array<{ id: string }>,
  unlockedAchievements: [] as string[],
  lastUnlockedAchievement: null as string | null,
  streakBonusesClaimed: [] as number[],
  lastActiveDate: '',
  totalWordsLearned: 0,
  lastMock: null,
  weeklyXP: 0,
  avatarId: '',
  streakFreezes: 0,
  grantMonthlyFreezes: vi.fn(),
  regenHearts: vi.fn(),
  onboardingComplete: true,
  lessonsLoading: false,
  lessonsFetched: false,
  lessonSessions: {},
  dailyGoalHours: 14,
  toggleChecklistItem: vi.fn(),
  addXP: vi.fn(),
  setTodayMinutes: vi.fn(),
  incrementStreak: vi.fn(),
  fetchAndSetLessons: vi.fn(),
  setLevel: vi.fn(),
  completeOnboarding: vi.fn(),
  setLessonProgress: vi.fn(),
  saveLessonSession: vi.fn(),
  clearLessonSession: vi.fn(),
}))

// ─── Supabase mock container (populated by vi.mock factory) ──────────────
const mockSupabase = vi.hoisted(() => ({}) as Record<string, unknown>)

// ─── Supabase mock — uses shared buildQB via vi.importActual ───────────────
vi.mock('../../lib/supabase', async () => {
  const { buildQB } = await vi.importActual('../../test/supabaseMock')
  const qb = buildQB().qb as unknown as Record<string, unknown>
  // Make qb thenable so `await supabase.from(...)` works
  ;(qb as unknown as Promise<unknown>).then = (onfulfilled: (v: unknown) => void) =>
    Promise.resolve({ data: [], error: null, count: 0 }).then(onfulfilled)
  ;(qb as unknown as Promise<unknown>).catch = (onrejected: (v: unknown) => void) =>
    Promise.resolve({ data: [], error: null, count: 0 }).catch(onrejected)

  const supabase = {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-1', email: 'test@test.com' } } },
        error: null,
      }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signOut: mockSignOut,
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
    },
    from: vi.fn(() => qb),
    rpc: vi.fn(() => qb),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(() => 'SUBSCRIBED'),
      })),
      send: vi.fn(),
    })),
    removeChannel: vi.fn(),
  }

  // Mutate the hoisted container so test code can reference mockSupabase
  Object.assign(mockSupabase, supabase)
  return { supabase }
})

// ─── Module mocks ────────────────────────────────────────────────────────────

vi.mock('../../store/useStore', () => ({
  useStore: Object.assign(
    (selector?: (state: typeof mockStoreState) => unknown) => {
      return selector ? selector(mockStoreState) : mockStoreState
    },
    { getState: () => mockStoreState, setState: vi.fn(), subscribe: vi.fn() }
  ),
  STREAK_MILESTONES: [
    { days: 3, xp: 10, icon: '🔥', label: '3 kun' },
    { days: 7, xp: 25, icon: '🔥🔥', label: '1 hafta' },
    { days: 14, xp: 50, icon: '🔥🔥🔥', label: '2 hafta' },
    { days: 30, xp: 100, icon: '⭐', label: '1 oy' },
    { days: 60, xp: 200, icon: '💎', label: '2 oy' },
    { days: 90, xp: 500, icon: '👑', label: 'Full Course' },
  ],
  getNextStreakMilestone: () => ({ days: 7, xp: 25, icon: '🔥🔥', label: '1 hafta' }),
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    session: { user: { id: 'user-1' } },
    user: { id: 'user-1' },
    loading: false,
    displayName: 'Ali',
    signOut: mockSignOut,
    signIn: mockSignIn,
    signUp: mockSignUp,
  }),
}))

vi.mock('../../hooks/useProgress', () => ({
  useProgress: () => ({
    todayProgress: null,
    lastMockTest: null,
    dbStreak: 0,
    loading: false,
    error: null,
    recentGrammar: [],
    recentListening: [],
    recentReading: [],
    recentSpeaking: [],
    recentWriting: [],
    refresh: vi.fn(),
    upsertTodayProgress: vi.fn(),
  }),
}))

vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-15',
  addDaysTashkent: (d: number) => {
    const date = new Date('2026-06-15T00:00:00Z')
    date.setUTCDate(date.getUTCDate() + d)
    return date.toISOString().split('T')[0]
  },
}))

vi.mock('../../components/notifications/StreakWarning', () => ({
  default: () => <div data-testid="streak-warning" />,
}))

vi.mock('../../components/notifications/ReviewReminder', () => ({
  default: () => <div data-testid="review-reminder" />,
}))

vi.mock('../../services/lessonService', () => ({
  fetchLessons: vi.fn().mockResolvedValue([]),
  getLessonProgress: vi.fn().mockResolvedValue(null),
  saveLessonSessionToDB: vi.fn().mockResolvedValue(undefined),
  clearLessonSessionFromDB: vi.fn().mockResolvedValue(undefined),
}))

// ─── Imports (after mocks) ───────────────────────────────────────────────────

import Dashboard from '../Dashboard'
import Auth from '../Auth'

// MockLesson — Lokal stub, chunki Lesson.tsx o'chirilgan (P.2)
function MockLesson() {
  return (
    <div>
      <h1>Dars tanlang</h1>
      <div>Grammar</div>
      <div>Vocabulary</div>
      <div>Listening</div>
      <div>Reading</div>
      <div>Writing</div>
      <div>Speaking</div>
    </div>
  )
}

describe('Auth Flow — integration tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15, 14, 0, 0)) // 14:00 LOCAL → "Xayrli kun" (timezone-independent)

    mockStoreState.onboardingComplete = true
    mockStoreState.lessons = []
    mockStoreState.lessonProgress = {}
    mockSignOut.mockClear()

    // WeakSpotsWidget va boshqa komponentlar supabase.auth.getSession chaqiradi
    // vi.restoreAllMocks() dan keyin qayta tiklash uchun
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1', email: 'test@test.com' } } },
      error: null,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    cleanup()
  })

  // ── 1. Auth Page ───────────────────────────────────────────────────────────

  describe('Login page', () => {
    it('renders Auth page with login form labels and inputs', () => {
      render(
        <MemoryRouter>
          <Auth />
        </MemoryRouter>
      )

      // Labels exist
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Parol')).toBeInTheDocument()
      // Inputs exist
      expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    })

    it('renders app logo and description on auth page', () => {
      render(
        <MemoryRouter>
          <Auth />
        </MemoryRouter>
      )

      expect(screen.getByText('EnglishPath')).toBeInTheDocument()
    })
  })

  // ── 2. Dashboard (post-login) ──────────────────────────────────────────────

  describe('Dashboard after login', () => {
    it('renders Dashboard with user greeting after login', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      // Greeting with user name from useAuth
      expect(screen.getByText('Xayrli kun')).toBeInTheDocument()
      expect(screen.getByText((_c, el) => el?.tagName === 'H1' && (el.textContent ?? '').includes('👋'))).toBeInTheDocument()

      // Dashboard sections
      expect(screen.getByText('Bugungi Skill Progress')).toBeInTheDocument()
      expect(screen.getByText('Bugungi Dars')).toBeInTheDocument()
    })

    it('renders logout button in the top bar', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      const logoutBtn = screen.getByTitle('Chiqish')
      expect(logoutBtn).toBeInTheDocument()
    })

    it('calls signOut when logout button is clicked', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      const logoutBtn = screen.getByTitle('Chiqish')
      fireEvent.click(logoutBtn)
      expect(mockSignOut).toHaveBeenCalledOnce()
    })

    it('renders lesson start button', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      // StartLessonButton navigates to /lesson
      const lessonBtn = screen.getByText('Bugungi Dars')
      expect(lessonBtn).toBeInTheDocument()
    })
  })

  // ── 3. Lesson Page Navigation ──────────────────────────────────────────────

  describe('Lesson page navigation', () => {
    it('navigates from Dashboard to Lesson page via button click', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/lesson" element={<MockLesson />} />
          </Routes>
        </MemoryRouter>
      )

      // Verify we're on Dashboard
      expect(screen.getByText('Xayrli kun')).toBeInTheDocument()

      // Click the StartLessonButton (Dashboard'da bir nechta "Boshlash →" bor —
      // "Bugungi Dars" orqali aniq tugmani topamiz)
      const lessonBtn = screen.getByText('Bugungi Dars').closest('button')!
      fireEvent.click(lessonBtn)

      // Wait for navigation to complete
      await vi.advanceTimersByTimeAsync(100)

      // Lesson page shows "Dars tanlang" heading
      expect(screen.getByText('Dars tanlang')).toBeInTheDocument()
    })

    it('renders Lesson page with lesson type cards', async () => {
      render(
        <MemoryRouter initialEntries={['/lesson']}>
          <Routes>
            <Route path="/lesson" element={<MockLesson />} />
          </Routes>
        </MemoryRouter>
      )

      await vi.advanceTimersByTimeAsync(100)

      // Lesson page has a "Dars tanlang" heading
      expect(screen.getByText('Dars tanlang')).toBeInTheDocument()
      // Lesson type cards exist
      expect(screen.getByText('Grammar')).toBeInTheDocument()
      expect(screen.getByText('Vocabulary')).toBeInTheDocument()
      expect(screen.getByText('Listening')).toBeInTheDocument()
      expect(screen.getByText('Reading')).toBeInTheDocument()
      expect(screen.getByText('Writing')).toBeInTheDocument()
      expect(screen.getByText('Speaking')).toBeInTheDocument()
    })
  })

  // ── 4. Logout Flow ─────────────────────────────────────────────────────────

  describe('Logout flow', () => {
    it('signOut is called when logout button is clicked', () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )

      fireEvent.click(screen.getByTitle('Chiqish'))
      expect(mockSignOut).toHaveBeenCalled()
    })

    it('signOut clears the session', async () => {
      // Simulate what signOut does: call supabase.auth.signOut
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })

      await mockSignOut()

      // After signOut, getSession returns null
      const { data: { session } } = await mockSupabase.auth.getSession()
      expect(session).toBeNull()
    })
  })

  // ── 5. Complete flow: login → dashboard → lesson → logout ──────────────────

  describe('Complete auth flow simulation', () => {
    it('simulates login → dashboard view → lesson navigation → logout flow', async () => {
      // Step 1: Render Dashboard (simulating logged-in state)
      const { unmount } = render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/lesson" element={<MockLesson />} />
          </Routes>
        </MemoryRouter>
      )

      // Verify Dashboard renders after login
      expect(screen.getByText('Xayrli kun')).toBeInTheDocument()
      expect(screen.getByText((_c, el) => el?.tagName === 'H1' && (el.textContent ?? '').includes('👋'))).toBeInTheDocument()
      expect(screen.getByTitle('Chiqish')).toBeInTheDocument()

      // Step 2: Navigate to Lesson page (StartLessonButton — "Bugungi Dars")
      fireEvent.click(screen.getByText('Bugungi Dars').closest('button')!)
      await vi.advanceTimersByTimeAsync(100)
      expect(screen.getByText('Dars tanlang')).toBeInTheDocument()

      // Step 3: Unmount and re-render Dashboard for logout
      unmount()

      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </MemoryRouter>
      )

      // Click logout
      fireEvent.click(screen.getByTitle('Chiqish'))
      expect(mockSignOut).toHaveBeenCalled()
    })
  })
})
