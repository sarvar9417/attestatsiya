import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// ─── Mock data ──────────────────────────────────────────────────────────────

const mockDueReviews = vi.hoisted(() => [
  {
    lessonId: 'verb-to-be',
    box: 3,
    nextReview: '2026-01-01',
    lastReviewed: '2026-01-01',
    lapses: 0,
    reps: 3,
    stability: 5,
    difficulty: 0.3,
  },
  {
    lessonId: 'present-simple',
    box: 2,
    nextReview: '2026-01-02',
    lastReviewed: '2026-01-01',
    lapses: 2,
    reps: 5,
    stability: 2,
    difficulty: 0.7,
  },
])

const mockGrammarTopics = vi.hoisted(() => [
  { id: 'verb-to-be', title: 'Verb "to be"', level: 'A1' },
  { id: 'present-simple', title: 'Present Simple', level: 'A2' },
])

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../lib/grammarSrs', () => ({
  getDueReviews: vi.fn(),
  strengthToPercent: vi.fn((stability: number) => Math.round(Math.min(100, stability * 10))),
}))

vi.mock('../../data/grammar', () => ({
  GRAMMAR_TOPICS: mockGrammarTopics,
}))

vi.mock('../../components/grammar/WeakAreasCard', () => ({
  default: () => <div data-testid="weak-areas-card" />,
}))

const mockT = vi.fn((key: string, _params?: Record<string, string>) => {
  const translations: Record<string, string> = {
    'grammarReview.noReviewsTitle': 'Takrorlash kerak emas',
    'grammarReview.noReviewsDesc': 'Barcha mavzular mustahkam',
    'grammarReview.goToLessons': 'Grammatika darslariga o\'tish',
    'grammarReview.mixedReview': 'Aralash takrorlash',
  }
  return translations[key] ?? key
})

vi.mock('../../i18n', () => ({
  useI18n: () => ({ t: mockT }),
}))

// ─── Import ─────────────────────────────────────────────────────────────────

import { getDueReviews } from '../../lib/grammarSrs'
import GrammarReview, { ReviewOverview } from '../GrammarReview'

function renderPage() {
  return render(<BrowserRouter><GrammarReview /></BrowserRouter>)
}

function renderOverview() {
  return render(<BrowserRouter><ReviewOverview /></BrowserRouter>)
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('GrammarReview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Empty state ────────────────────────────────────────────────────────────

  it('shows empty state when no due reviews', () => {
    vi.mocked(getDueReviews).mockReturnValue([])

    renderPage()

    expect(screen.getByText('Takrorlash kerak emas')).toBeInTheDocument()
    expect(screen.getByText('Barcha mavzular mustahkam')).toBeInTheDocument()
  })

  it('shows "go to lessons" button in empty state', () => {
    vi.mocked(getDueReviews).mockReturnValue([])

    renderPage()

    const goBtn = screen.getByText('Grammatika darslariga o\'tish')
    expect(goBtn).toBeInTheDocument()

    fireEvent.click(goBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/grammar')
  })

  it('shows "mixed review" button in empty state', () => {
    vi.mocked(getDueReviews).mockReturnValue([])

    renderPage()

    const mixedBtn = screen.getByText('Aralash takrorlash')
    expect(mixedBtn).toBeInTheDocument()

    fireEvent.click(mixedBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/mixed-review')
  })

  it('shows WeakAreasCard in empty state', () => {
    vi.mocked(getDueReviews).mockReturnValue([])

    renderPage()

    expect(screen.getByTestId('weak-areas-card')).toBeInTheDocument()
  })

  // ── Due review cards ───────────────────────────────────────────────────────

  it('renders due review cards when there are due reviews', () => {
    vi.mocked(getDueReviews).mockReturnValue(mockDueReviews)

    renderPage()

    expect(screen.getByText('Verb "to be"')).toBeInTheDocument()
    expect(screen.getByText('Present Simple')).toBeInTheDocument()
  })

  it('shows level badges on due review cards', () => {
    vi.mocked(getDueReviews).mockReturnValue(mockDueReviews)

    renderPage()

    expect(screen.getByText('A1')).toBeInTheDocument()
    expect(screen.getByText('A2')).toBeInTheDocument()
  })

  it('shows strength percentage for each review', () => {
    vi.mocked(getDueReviews).mockReturnValue(mockDueReviews)

    renderPage()

    // stability 5 → 50%, stability 2 → 20%
    expect(screen.getByText('Mustahkamlik: 50%')).toBeInTheDocument()
    expect(screen.getByText('Mustahkamlik: 20%')).toBeInTheDocument()
  })

  it('shows lapses count when > 0', () => {
    vi.mocked(getDueReviews).mockReturnValue(mockDueReviews)

    renderPage()

    // present-simple has 2 lapses
    expect(screen.getByText('2 marta qiyin')).toBeInTheDocument()
  })

  it('shows reps count for each review', () => {
    vi.mocked(getDueReviews).mockReturnValue(mockDueReviews)

    renderPage()

    expect(screen.getByText('3 marta takror')).toBeInTheDocument()
    expect(screen.getByText('5 marta takror')).toBeInTheDocument()
  })

  // ── Navigation from due review cards ───────────────────────────────────────

  it('navigates to /grammar with reviewTopicId when due review is clicked', () => {
    vi.mocked(getDueReviews).mockReturnValue(mockDueReviews)

    renderPage()

    fireEvent.click(screen.getByText('Verb "to be"'))
    expect(mockNavigate).toHaveBeenCalledWith('/grammar', {
      state: { reviewTopicId: 'verb-to-be' },
    })
  })

  it('navigates with correct topic ID for each review card', () => {
    vi.mocked(getDueReviews).mockReturnValue(mockDueReviews)

    renderPage()

    fireEvent.click(screen.getByText('Present Simple'))
    expect(mockNavigate).toHaveBeenCalledWith('/grammar', {
      state: { reviewTopicId: 'present-simple' },
    })
  })

  // ── Bottom CTA ─────────────────────────────────────────────────────────────

  it('bottom CTA navigates to /grammar', () => {
    vi.mocked(getDueReviews).mockReturnValue(mockDueReviews)

    renderPage()

    const cta = screen.getByText('Grammatika darslariga o\'tish')
    expect(cta).toBeInTheDocument()

    fireEvent.click(cta)
    expect(mockNavigate).toHaveBeenCalledWith('/grammar')
  })

  it('shows WeakAreasCard below due reviews', () => {
    vi.mocked(getDueReviews).mockReturnValue(mockDueReviews)

    renderPage()

    expect(screen.getByTestId('weak-areas-card')).toBeInTheDocument()
  })
})

// ─── ReviewOverview (Dashboard widget) ──────────────────────────────────────

describe('ReviewOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when no due reviews', () => {
    vi.mocked(getDueReviews).mockReturnValue([])

    const { container } = renderOverview()
    expect(container.innerHTML).toBe('')
  })

  it('renders up to 5 due review items and shows count', () => {
    const fiveReviews = Array.from({ length: 5 }, (_, i) => ({
      lessonId: 'verb-to-be', // uses real GRAMMAR_TOPICS entry so TOPIC_META resolves it
      box: 1,
      nextReview: '2026-01-01',
      lastReviewed: '2026-01-01',
      lapses: 0,
      reps: 1,
      stability: 1,
      difficulty: 0.5,
    }))
    vi.mocked(getDueReviews).mockReturnValue(fiveReviews)

    renderOverview()

    // Should show count "5 ta"
    expect(screen.getByText('5 ta')).toBeInTheDocument()
    // Indicates overview rendered (would return null if empty)
    expect(screen.getByText('Takrorlash vaqti keldi')).toBeInTheDocument()
  })

  it('navigates to /grammar with reviewTopicId when a review is clicked', () => {
    vi.mocked(getDueReviews).mockReturnValue(mockDueReviews.slice(0, 1))

    renderOverview()

    fireEvent.click(screen.getByText('Verb "to be"'))
    expect(mockNavigate).toHaveBeenCalledWith('/grammar', {
      state: { reviewTopicId: 'verb-to-be' },
    })
  })

  it('shows "Barchasini ko\'rish" button that goes to /review', () => {
    vi.mocked(getDueReviews).mockReturnValue(mockDueReviews)

    renderOverview()

    const allBtn = screen.getByText('Barchasini ko\'rish')
    expect(allBtn).toBeInTheDocument()

    fireEvent.click(allBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/review')
  })
})
