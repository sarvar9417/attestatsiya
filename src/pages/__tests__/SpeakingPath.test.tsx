import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// ─── Mock data ──────────────────────────────────────────────────────────────

const mockDays = vi.hoisted(() => [
  {
    day: 1, cefr: 'A0' as const, title: 'Salomlashish', subtitle: 'Assalomu alaykum',
    goalUz: 'Salomlashish va o\'zingizni tanishtirish',
    chunks: [{ id: 'sp-d1-c1', en: 'Hello!', uz: 'Salom!', pattern: 'Hello', ipa: '/həˈloʊ/' }],
    scenario: { topic: 'greetings', aiRole: 'a local', userRole: 'a tourist', opening: 'Hello!', goalUz: 'Salomlashish' },
    estMinutes: 12,
  },
  {
    day: 2, cefr: 'A0' as const, title: 'O\'zingiz haqingizda', subtitle: 'Tanishtirish',
    goalUz: 'O\'zingiz haqingizda gapirish',
    chunks: [{ id: 'sp-d2-c1', en: 'My name is...', uz: 'Mening ismim...', pattern: 'My name is' }],
    scenario: { topic: 'introduction', aiRole: 'a friend', userRole: 'yourself', opening: 'What is your name?', goalUz: 'Tanishtirish' },
    estMinutes: 12,
    linkedLessonId: 'alphabet-greetings',
    grammarPoint: 'be (am/is/are)',
  },
])

const mockProgress = vi.hoisted(() => [
  { day: 1, completed: true, bestSpeakScore: 85, spokenSeconds: 180, completedAt: new Date().toISOString() },
  { day: 2, completed: false, bestSpeakScore: undefined, spokenSeconds: 0 },
])

const mockStats = vi.hoisted(() => ({
  currentDay: 2,
  totalCompleted: 1,
  dueCount: 3,
  todayMinutes: 5,
  streakDays: 2,
  avgSpeakScore7d: 72,
  avgSpeakScore30d: 65,
  avgMinutesPerDay7d: 8,
  chunksMastered: 5,
  avgChunkStability: 18.5,
}))

const mockDueChunks = vi.hoisted(() => [
  { id: 'sp-d1-c1', en: 'Hello!', uz: 'Salom!', pattern: 'Hello' },
])

const mockTrend = vi.hoisted(() => [
  { date: '2026-06-10', label: 'Se', score: 70, minutes: 5 },
  { date: '2026-06-11', label: 'Pa', score: 85, minutes: 8 },
])

const mockSrsDist = vi.hoisted(() => [
  { range: '0-5', label: 'Yangi', count: 10, color: '#F87171' },
  { range: '5-15', label: "O'rganilayotgan", count: 5, color: '#FBBF24' },
  { range: '15-30', label: 'Mustahkamlanayotgan', count: 3, color: '#60A5FA' },
  { range: '30-90', label: "O'zlashtirilgan", count: 2, color: '#34D399' },
  { range: '90+', label: 'Yodda', count: 0, color: '#8B5CF6' },
])

// ─── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'user-test' }, loading: false }),
}))

vi.mock('../../data/speakingPath', () => ({
  SPEAKING_DAYS: mockDays,
  TOTAL_SPEAKING_DAYS: 2,
  getSpeakingDay: (day: number) => mockDays.find((d: { day: number }) => d.day === day) ?? mockDays[0],
  getAllChunks: () => mockDays.flatMap((d: { chunks: unknown[] }) => d.chunks),
  getCefrForDay: (day: number) => (day >= 2 ? 'A1' : 'A0'),
}))

vi.mock('../../services/speakingPathService', () => ({
  getSpeakingProgress: vi.fn().mockResolvedValue(mockProgress),
  getDueChunks: vi.fn().mockResolvedValue(mockDueChunks),
  getSpeakingStats: vi.fn().mockResolvedValue(mockStats),
  loadSrsMap: vi.fn().mockResolvedValue({
    'sp-d1-c1': { stability: 25, difficulty: 5, due: '2026-06-01', reps: 3, lapses: 0 },
  }),
  clearSrsCache: vi.fn(),
  computeTrend: vi.fn(() => mockTrend),
  computeSRSDistribution: vi.fn(() => mockSrsDist),
}))

vi.mock('../../components/speakingPath/SpeakingLadder', () => ({
  default: ({
    days, unlockedDay, completed, expandedDay, onToggle, onStart,
  }: {
    days: { day: number; title: string }[]
    unlockedDay: number
    completed: Set<number>
    expandedDay: number | null
    onToggle: (d: number) => void
    onStart?: (d: number) => void
  }) => (
    <div data-testid="speaking-ladder">
      <span data-testid="ladder-unlocked">{unlockedDay}</span>
      <span data-testid="ladder-completed">{completed.size}</span>
      <span data-testid="ladder-expanded">{expandedDay ?? 'null'}</span>
      {days.map(d => (
        <button key={d.day} data-day={d.day} onClick={() => onToggle(d.day)}>
          {d.day}-kun: {d.title}
        </button>
      ))}
      <button data-testid="start-day" onClick={() => onStart?.(unlockedDay)}>
        Boshlash
      </button>
    </div>
  ),
}))

vi.mock('../../components/speakingPath/SpeakingDaySession', () => ({
  default: ({ day, userId, onExit }: { day: { day: number }; userId?: string; onExit: () => void }) => (
    <div data-testid="speaking-day-session">
      <span>Day: {day.day}</span>
      <span>User: {userId}</span>
      <button data-testid="exit-session" onClick={onExit}>Chiqish</button>
    </div>
  ),
}))

vi.mock('../../components/speakingPath/SpeakingReviewSession', () => ({
  default: ({ chunks, onExit }: { chunks: unknown[]; onExit: () => void }) => (
    <div data-testid="speaking-review-session">
      <span>Chunks: {chunks.length}</span>
      <button data-testid="exit-review" onClick={onExit}>Chiqish</button>
    </div>
  ),
}))

vi.mock('../../components/speakingPath/SpeakingMetricsPanel', () => ({
  default: ({ stats }: { stats: { streakDays: number; todayMinutes: number } }) => (
    <div data-testid="metrics-panel">Streak: {stats.streakDays}, Today: {stats.todayMinutes}m</div>
  ),
}))

vi.mock('../../components/speakingPath/SpeakingCharts', () => ({
  default: ({ trend, srsDistribution }: { trend: unknown[]; srsDistribution: unknown[] }) => (
    <div data-testid="speaking-charts">Trend: {trend.length}, SRS: {srsDistribution.length}</div>
  ),
}))

vi.mock('../../components/speakingPath/SpeakingAchievements', () => ({
  default: ({ progress }: { progress: { daysCompleted: number } }) => (
    <div data-testid="speaking-achievements">Days: {progress.daysCompleted}</div>
  ),
}))

vi.mock('../../components/speakingPath/FreePractice', () => ({
  default: () => <div data-testid="free-practice">Free Practice</div>,
}))

vi.mock('../../store/useStore', () => ({
  useStore: (_s?: (x: { unlockedAchievements: string[] }) => unknown) =>
    (_s ? _s({ unlockedAchievements: [] }) : { unlockedAchievements: [] }),
}))

vi.mock('../../lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn() },
}))

// ─── Import ─────────────────────────────────────────────────────────────────

import SpeakingPath from '../SpeakingPath'

function renderPage() {
  return render(<BrowserRouter><SpeakingPath /></BrowserRouter>)
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('SpeakingPath', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Loading state ────────────────────────────────────────────────────────

  it('shows skeleton while loading', () => {
    const { container } = renderPage()
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  // ── Render after loading ──────────────────────────────────────────────────

  it('renders title and subtitle after loading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText("Gapirish Yo'li")).toBeInTheDocument()
    })
    expect(screen.getByText('0 dan suhbatgacha — har kuni 15 daqiqa')).toBeInTheDocument()
  })

  it('renders stats cards with current day badge', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('JORIY KUN')).toBeInTheDocument()
    })
    // Text is split across <p> and <span>, check via textContent
    const card = screen.getByText('JORIY KUN').closest('.rounded-2xl')
    expect(card?.textContent).toMatch(/2 \/ 2/)
  })

  it('renders stats cards with completed count', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('TUGATILGAN')).toBeInTheDocument()
    })
    // Text is split across <p> and <span>, check via textContent
    const card = screen.getByText('TUGATILGAN').closest('.rounded-2xl')
    expect(card?.textContent).toMatch(/1 kun/)
  })

  // ── Review card ───────────────────────────────────────────────────────────

  it('shows review card when due chunks are available', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Takrorlash vaqti keldi')).toBeInTheDocument()
    })
  })

  it('review card shows due chunk count', async () => {
    renderPage()
    // dueChunks has 1 element from mock, so text is "1 ta ibora takrorga tayyor"
    await waitFor(() => {
      expect(screen.getByText(/1 ta ibora takrorga tayyor/)).toBeInTheDocument()
    })
  })

  // ── Ladder rendering ──────────────────────────────────────────────────────

  it('renders SpeakingLadder after loading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('speaking-ladder')).toBeInTheDocument()
    })
    expect(screen.getByTestId('ladder-unlocked')).toHaveTextContent('2')
    expect(screen.getByTestId('ladder-completed')).toHaveTextContent('1')
  })

  it('renders all day buttons in the ladder', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('1-kun: Salomlashish')).toBeInTheDocument()
      expect(screen.getByText('2-kun: O\'zingiz haqingizda')).toBeInTheDocument()
    })
  })

  // ── Expanded day default ──────────────────────────────────────────────────

  it('expands the current day by default', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('ladder-expanded')).toHaveTextContent('2')
    })
  })

  // ── Day expansion toggle ──────────────────────────────────────────────────

  it('toggles expanded day when clicking a day button', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByTestId('speaking-ladder')).toBeInTheDocument())

    expect(screen.getByTestId('ladder-expanded')).toHaveTextContent('2')

    fireEvent.click(screen.getByText('1-kun: Salomlashish'))
    await waitFor(() => expect(screen.getByTestId('ladder-expanded')).toHaveTextContent('1'))

    // Click again should toggle to null
    fireEvent.click(screen.getByText('1-kun: Salomlashish'))
    await waitFor(() => expect(screen.getByTestId('ladder-expanded')).toHaveTextContent('null'))
  })

  // ── Start day session ─────────────────────────────────────────────────────

  it('shows SpeakingDaySession when a day is started', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByTestId('speaking-ladder')).toBeInTheDocument())

    fireEvent.click(screen.getByTestId('start-day'))
    await waitFor(() => {
      expect(screen.getByTestId('speaking-day-session')).toBeInTheDocument()
    })
    expect(screen.getByText('Day: 2')).toBeInTheDocument()
    expect(screen.getByText('User: user-test')).toBeInTheDocument()
  })

  it('exits SpeakingDaySession back to the ladder', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByTestId('speaking-ladder')).toBeInTheDocument())

    fireEvent.click(screen.getByTestId('start-day'))
    await waitFor(() => expect(screen.getByTestId('speaking-day-session')).toBeInTheDocument())

    fireEvent.click(screen.getByTestId('exit-session'))
    await waitFor(() => expect(screen.getByTestId('speaking-ladder')).toBeInTheDocument())
  })

  // ── Review mode ───────────────────────────────────────────────────────────

  it('shows SpeakingReviewSession when review mode is activated', async () => {
    renderPage()
    await waitFor(() => {
      // Find the review button by its gradient classes (the whole button is clickable)
      const reviewBtn = Array.from(document.querySelectorAll('button')).find(
        btn => btn.textContent?.includes('Takrorlash vaqti keldi')
      )
      if (reviewBtn) fireEvent.click(reviewBtn)
      expect(screen.queryByTestId('speaking-review-session')).toBeInTheDocument()
    })
    expect(screen.getByText('Chunks: 1')).toBeInTheDocument()
  })

  it('exits review mode back to the ladder', async () => {
    renderPage()
    await waitFor(() => {
      const reviewBtn = Array.from(document.querySelectorAll('button')).find(
        btn => btn.textContent?.includes('Takrorlash vaqti keldi')
      )
      if (reviewBtn) fireEvent.click(reviewBtn)
      expect(screen.getByTestId('speaking-review-session')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('exit-review'))
    await waitFor(() => expect(screen.getByTestId('speaking-ladder')).toBeInTheDocument())
  })

  // ── Free practice tab ─────────────────────────────────────────────────────

  it('switches to free practice tab', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('🎤 Erkin amaliyot')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('🎤 Erkin amaliyot'))
    await waitFor(() => expect(screen.getByTestId('free-practice')).toBeInTheDocument())
  })

  it('switches back to path tab from free practice', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('🪜 Narvon')).toBeInTheDocument())

    fireEvent.click(screen.getByText('🎤 Erkin amaliyot'))
    await waitFor(() => expect(screen.getByTestId('free-practice')).toBeInTheDocument())

    fireEvent.click(screen.getByText('🪜 Narvon'))
    await waitFor(() => expect(screen.getByTestId('speaking-ladder')).toBeInTheDocument())
  })

  // ── Metrics and charts ────────────────────────────────────────────────────

  it('renders metrics panel with stats', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('metrics-panel')).toBeInTheDocument()
    })
    expect(screen.getByText('Streak: 2, Today: 5m')).toBeInTheDocument()
  })

  it('renders charts with trend and SRS data', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('speaking-charts')).toBeInTheDocument()
    })
    expect(screen.getByText('Trend: 2, SRS: 5')).toBeInTheDocument()
  })

  // ── Achievements ──────────────────────────────────────────────────────────

  it('renders achievements section', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('speaking-achievements')).toBeInTheDocument()
    })
    expect(screen.getByText('Days: 1')).toBeInTheDocument()
  })

  // ── Tab styling ───────────────────────────────────────────────────────────

  it('highlights the active path tab with white background', async () => {
    renderPage()
    await waitFor(() => {
      const pathTab = screen.getByText('🪜 Narvon')
      expect(pathTab.className).toContain('bg-white')
    })
  })

  it('changes active tab styling when switching to free tab', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('🎤 Erkin amaliyot')).toBeInTheDocument())

    fireEvent.click(screen.getByText('🎤 Erkin amaliyot'))
    const freeTab = screen.getByText('🎤 Erkin amaliyot')
    expect(freeTab.className).toContain('bg-white')
  })

  // ── Navigation back button ────────────────────────────────────────────────

  it('renders a back button (ArrowLeft icon)', async () => {
    renderPage()
    await waitFor(() => {
      const arrow = document.querySelector('.lucide-arrow-left')
      expect(arrow).toBeInTheDocument()
    })
  })

  // ── Review button styling ─────────────────────────────────────────────────

  it('review card has gradient styling', async () => {
    renderPage()
    await waitFor(() => {
      const reviewBtn = screen.queryByText('Takrorlash vaqti keldi')
      if (reviewBtn) {
        // The button is the parent of the text, need to check the parent button
        const parentButton = reviewBtn.closest('button')
        expect(parentButton?.className).toContain('from-amber-500')
        expect(parentButton?.className).toContain('to-orange-500')
      }
    })
  })
})
