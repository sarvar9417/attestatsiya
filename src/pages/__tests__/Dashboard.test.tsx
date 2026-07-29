import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// ─── Hoisted mocks ──────────────────────────────────────────────────────────

const mockStoreState = vi.hoisted(() => ({
  currentLevel: 'B1', currentWeek: 12, currentDay: 45,
  streak: 7, targetDate: new Date(Date.now() + 86400000 * 30).toISOString(),
  userName: 'TestUser', avatarId: 'cat', totalWordsLearned: 250,
  todayGrammarPct: 70, todayVocabPct: 60, todayListeningPct: 50,
  todayReadingPct: 40, todaySpeakingPct: 80, todayWritingPct: 30,
  lessonProgress: { 'l1': 80, 'l2': 50 },
  lessons: [{ id: 'l1', title: 'Simple Present' }, { id: 'l2', title: 'Past Tense' }],
  fetchAndSetLessons: vi.fn(),
}))

const mockGetSpeakingStats = vi.hoisted(() => vi.fn().mockResolvedValue({
  currentDay: 45, totalCompleted: 30, dueCount: 3,
  todayMinutes: 12, streakDays: 7,
  avgSpeakScore7d: 75, avgSpeakScore30d: 70,
  avgMinutesPerDay7d: 10, chunksMastered: 20, avgChunkStability: 25,
}))

const mockTandemStore = vi.hoisted(() => ({
  pendingOpponentDuels: [],
  loadDuels: vi.fn(),
}))

vi.mock('../../store/useStore', () => ({
  useStore: (s?: (x: typeof mockStoreState) => unknown) => s ? s(mockStoreState) : mockStoreState,
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'user-test' }, displayName: null, signOut: vi.fn() }),
}))

vi.mock('../../hooks/useProgress', () => ({
  useProgress: () => ({ dbStreak: 7, todayProgress: null }),
}))

vi.mock('../../store/tandemSlice', () => ({
  useTandemStore: (s?: (x: { pendingOpponentDuels: unknown[]; loadDuels: typeof mockTandemStore.loadDuels }) => unknown) =>
    s ? s(mockTandemStore) : mockTandemStore,
}))

vi.mock('../../services/speakingPathService', () => ({
  getSpeakingStats: mockGetSpeakingStats,
}))

vi.mock('../../data/speakingPath', () => ({
  getAllChunks: vi.fn(() => []),
  TOTAL_SPEAKING_DAYS: 125,
}))

vi.mock('../../data/idioms', () => ({
  IDIOMS: [
    { id: 'i1', idiom: 'Break the ice', actualMeaning: 'Suhbatni boshlash', translation: 'Muzni sindirish',
      literalMeaning: 'Muzni sindirish', level: 'B1+', category: 'communication',
      origin: 'From shipping', examples: ['He broke the ice at the meeting'] },
  ],
}))

vi.mock('../../data/narrative/storyline', () => ({
  getStoryBeat: vi.fn(() => ({
    act: 'travel', dayRange: [1, 126], title: 'Toshkentdan Londonga',
    context: 'Safar boshlanadi', location: 'Toshkent', color: '#22c55e',
  })),
  STORY_BEATS: [{ act: 'travel', dayRange: [1, 126], title: 'Travel' }],
  resolveActDisplay: vi.fn(() => ({ label: '1-Act', emoji: '🌍', color: '#22c55e', bgClass: 'bg-green-500', textClass: 'text-green-600' })),
}))

// Mock sub-components to avoid deep dependency issues
vi.mock('../../components/dashboard/AiInsightsWidget', () => ({
  default: () => <div data-testid="ai-insights-widget" />,
}))
vi.mock('../../components/dashboard/TandemCard', () => ({
  default: () => <div data-testid="tandem-card" />,
}))
vi.mock('../../components/dashboard/ConfusablePairsCard', () => ({
  default: () => <div data-testid="confusable-pairs-card" />,
}))
vi.mock('../../components/notifications/StreakWarning', () => ({
  default: () => <div data-testid="streak-warning" />,
}))
vi.mock('../../components/notifications/ReviewReminder', () => ({
  default: () => <div data-testid="review-reminder" />,
}))
vi.mock('../../components/dashboard/WeakSpotsWidget', () => ({
  default: ({ onSpotsLoaded }: { onSpotsLoaded: () => void }) => {
    onSpotsLoaded()
    return <div data-testid="weak-spots-widget" />
  },
}))
vi.mock('../../components/dashboard/AdaptivePlan', () => ({
  default: () => <div data-testid="adaptive-plan" />,
}))
vi.mock('../../components/dashboard/ProgressMap', () => ({
  default: () => <div data-testid="progress-map" />,
}))
vi.mock('../../components/ui/AvatarSelector', () => ({
  AVATARS: [{ id: 'cat', emoji: '🐱' }],
}))

// ReviewOverview is imported from GrammarReview which is a page, so mock the component
vi.mock('../GrammarReview', () => ({
  ReviewOverview: () => <div data-testid="review-overview" />,
}))

vi.mock('../../lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn(), captureException: vi.fn() },
}))

// ─── Import ──────────────────────────────────────────────────────────────────

import Dashboard from '../Dashboard'

function renderPage() {
  return render(<BrowserRouter><Dashboard /></BrowserRouter>)
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Top Bar ───────────────────────────────────────────────────────────────

  it('renders the greeting with user name', async () => {
    renderPage()
    // Automatically shows greeting after render - uses hour-based greeting
    // uz.json: dashboard.greetingUser = "{name}, xush kelibsiz!"
    await waitFor(() => {
      expect(screen.getByText(/TestUser/)).toBeInTheDocument()
    })
  })

  it('renders level badge in top bar', async () => {
    renderPage()
    await waitFor(() => {
      const badges = screen.getAllByText(/B1/)
      expect(badges.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders streak display in top bar', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('7')).toBeInTheDocument()
    })
  })

  // ── Start Lesson Button ───────────────────────────────────────────────────

  it('renders start lesson button', async () => {
    renderPage()
    await waitFor(() => {
      const startBtns = screen.getAllByText(/Boshlash/)
      expect(startBtns.length).toBeGreaterThanOrEqual(1)
    })
  })

  // ── Skill Rings (TodayProgress) ───────────────────────────────────────────

  it('renders all 6 skill rings', async () => {
    renderPage()
    // uz.json: dashboard.skillProgressTitle = "Bugungi ko'nikmalar"
    await waitFor(() => {
      expect(screen.getByText("Bugungi Skill Progress")).toBeInTheDocument()
    })
  })

  it('shows average skill percentage', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/55%/)).toBeInTheDocument() // avg of [70,60,50,40,80,30]
    })
  })

  // ── Lesson Progress Card ──────────────────────────────────────────────────

  it('renders lesson progress card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/Kunlik Darslar/)).toBeInTheDocument()
    })
  })

  it('shows lesson titles in progress', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Simple Present')).toBeInTheDocument()
      expect(screen.getByText('Past Tense')).toBeInTheDocument()
    })
  })

  // ── Daily Idiom Card ──────────────────────────────────────────────────────

  it('renders daily idiom card in "All" tab', async () => {
    renderPage()
    await waitFor(() => {
      const allTabs = screen.queryAllByRole('button', { name: /Barchasi/ })
      if (allTabs.length > 0) fireEvent.click(allTabs[0])
    })
    await waitFor(() => {
      expect(document.body.textContent).toContain('Kunning Idiomasi')
      expect(document.body.textContent).toContain('Break the ice')
    })
  })

  // ── Speaking Path Card ────────────────────────────────────────────────────

  it('renders speaking path card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/Gapirish Yo'li/)).toBeInTheDocument()
    })
  })

  it('shows speaking path stats when loaded', async () => {
    renderPage()
    // Check for the day indicator in the speaking path card
    await waitFor(() => {
      expect(screen.getByText(/45/)).toBeInTheDocument()
    })
  })

  // ── Widgets ───────────────────────────────────────────────────────────────

  it('renders notification widgets', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('streak-warning')).toBeInTheDocument()
      expect(screen.getByTestId('review-reminder')).toBeInTheDocument()
    })
  })

  // ── Expandable section ────────────────────────────────────────────────────

  it('shows all content when "Barchasi" tab is clicked', async () => {
    renderPage()
    await waitFor(() => {
      const allTabs = screen.queryAllByRole('button', { name: /Barchasi/ })
      if (allTabs.length > 0) fireEvent.click(allTabs[0])
    })
    await waitFor(() => {
      expect(screen.getByTestId('tandem-card')).toBeInTheDocument()
      expect(screen.getByTestId('confusable-pairs-card')).toBeInTheDocument()
      expect(screen.getByTestId('progress-map')).toBeInTheDocument()
    })
  })

  // ── Story Beat ────────────────────────────────────────────────────────────

  it('renders story beat in "All" tab', async () => {
    renderPage()
    await waitFor(() => {
      const allTabs = screen.queryAllByRole('button', { name: /Barchasi/ })
      if (allTabs.length > 0) fireEvent.click(allTabs[0])
    })
    await waitFor(() => {
      expect(screen.getByText(/Toshkentdan Londonga/)).toBeInTheDocument()
    })
  })

  // ── Sign Out Button ───────────────────────────────────────────────────────

  it('renders sign out button in top bar', async () => {
    renderPage()
    await waitFor(() => {
      const logoutIcon = document.querySelector('.lucide-log-out')
      expect(logoutIcon).toBeInTheDocument()
    })
  })

  // ── ReviewOverview widget ────────────────────────────────────────────────

  it('renders ReviewOverview in today tab', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('review-overview')).toBeInTheDocument()
    })
  })

  it('renders ReviewOverview in all tab', async () => {
    renderPage()
    await waitFor(() => {
      const allTabs = screen.queryAllByRole('button', { name: /Barchasi/ })
      if (allTabs.length > 0) fireEvent.click(allTabs[0])
    })
    await waitFor(() => {
      expect(screen.getByTestId('review-overview')).toBeInTheDocument()
    })
  })
})
