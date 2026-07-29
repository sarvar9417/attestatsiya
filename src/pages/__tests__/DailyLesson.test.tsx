import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Ro'yxat endi LESSON_INDEX (haqiqiy metadata) dan chiziladi; store.lessons faqat
// dars OCHILGANDA to'liq kontent uchun ishlatiladi. Shu sabab openable mock dars
// haqiqiy LESSON_INDEX id si bilan mos bo'lishi kerak ('alphabet-greetings', A1, kun 1).
const mockLesson = {
  id: 'greetings-names',
  title: 'Salomlashish va ismlar',
  subtitle: 'Hello, My name is...',
  level: 'A0',
  day: 1,
  formulas: [],
  rules: [],
  vocabulary: [],
  examples: [],
  specialCases: [],
  exercises: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1, type: 'fill-blank' as const, instruction: '', question: '', blanks: [''], explanation: '',
  })),
  exerciseSections: [{ title: 'Sec', desc: '', color: '', icon: '', ids: [1, 2, 3, 4, 5] }],
  tests: [],
  testSections: [],
}

const mockStoreState = vi.hoisted(() => ({
  lessons: [] as typeof mockLesson[],
  lessonsLoading: false,
  lessonsFetched: false,
  lessonProgress: {} as Record<string, number>,
  lessonSessions: {} as Record<string, unknown>,
  fetchAndSetLessons: vi.fn(),
  setLessonProgress: vi.fn(),
  currentDay: 1,
  currentLevel: 'A2+',
}))

vi.mock('../../store/useStore', () => ({
  useStore: (selector?: (state: typeof mockStoreState) => unknown) =>
    selector ? selector(mockStoreState) : mockStoreState,
}))

vi.mock('../../store/tandemSlice', () => ({
  useTandemStore: () => ({ pendingOpponentDuels: [], loadDuels: vi.fn() }),
}))

vi.mock('../../services/lessonService', () => ({
  fetchAllLessonProgress: vi.fn().mockResolvedValue({}),
  fetchReviewLessons: vi.fn().mockResolvedValue([]),
}))

vi.mock('../../components/dailyLesson/LessonView', () => ({
  default: ({ lesson, onBack }: { lesson: typeof mockLesson; onBack: () => void }) => (
    <div data-testid="lesson-view">
      <div>{lesson.title}</div>
      <button data-testid="back-button" onClick={onBack}>Orqaga</button>
    </div>
  ),
}))

import LearnHub from '../LearnHub'

function renderPage() {
  return render(<BrowserRouter><LearnHub /></BrowserRouter>)
}

describe('LearnHub', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStoreState.lessons = []
    mockStoreState.lessonsLoading = false
    mockStoreState.lessonsFetched = false
    mockStoreState.lessonProgress = {}
    mockStoreState.lessonSessions = {}
    mockStoreState.currentDay = 1
    mockStoreState.currentLevel = 'A2+'
  })

  it('renders header and level tabs (A1..B2)', () => {
    renderPage()
    expect(screen.getByText('Kunlik Darslar')).toBeInTheDocument()
    for (const lv of ['A1', 'A2', 'B1', 'B1+', 'B2']) {
      // tab nomi "<level> <count>" — darajadan keyin bo'sh joy (B1 ni B1+ dan ajratish uchun)
      expect(screen.getByRole('button', { name: new RegExp(`^${lv.replace('+', '\\+')}\\s`) })).toBeInTheDocument()
    }
  })

  it('shows lessons of the default level (A1 — currentDay 1)', () => {
    renderPage()
    // A1 darslari index'dan chiziladi (store.lessons bo'sh bo'lsa ham)
    // A0 darslar ham A1 ichida (greetings-names, numbers-alphabet, family-me)
    expect(screen.getByRole('heading', { name: 'Salomlashish va ismlar' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Raqamlar va alifbo' })).toBeInTheDocument()
  })

  it('shows progress overview', () => {
    mockStoreState.lessonProgress = { 'alphabet-greetings': 80 }
    renderPage()
    expect(screen.getByText('Bajarildi')).toBeInTheDocument()
    expect(screen.getByText('Umumiy progress')).toBeInTheDocument()
  })

  it('switches level when a tab is clicked', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Salomlashish va ismlar' })).toBeInTheDocument() // A0/A1
    fireEvent.click(screen.getByRole('button', { name: /^A2\b/ }))
    expect(screen.getByRole('heading', { name: 'Modal Verbs' })).toBeInTheDocument()          // A2
    expect(screen.queryByRole('heading', { name: 'Salomlashish va ismlar' })).not.toBeInTheDocument()
  })

  it('opens LessonView when a lesson is clicked (content loaded)', () => {
    mockStoreState.lessonsFetched = true
    mockStoreState.lessons = [mockLesson]
    renderPage()
    fireEvent.click(screen.getByRole('heading', { name: 'Salomlashish va ismlar' }))
    expect(screen.getByTestId('lesson-view')).toBeInTheDocument()
  })

  it('shows a loader when opening before full content is ready', () => {
    mockStoreState.lessonsFetched = false
    mockStoreState.lessonsLoading = true
    mockStoreState.lessons = []
    const { container } = renderPage()
    fireEvent.click(screen.getByRole('heading', { name: 'Salomlashish va ismlar' }))
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('back button returns to the list', () => {
    mockStoreState.lessonsFetched = true
    mockStoreState.lessons = [mockLesson]
    renderPage()
    fireEvent.click(screen.getByRole('heading', { name: 'Salomlashish va ismlar' }))
    expect(screen.getByTestId('lesson-view')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('back-button'))
    expect(screen.queryByTestId('lesson-view')).not.toBeInTheDocument()
    expect(screen.getByText('Kunlik Darslar')).toBeInTheDocument()
  })
})
