import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const mockTexts = vi.hoisted(() => [{
  id: 'r1', title: 'Climate Change', level: 'B1', topic: 'Science',
  readingTime: 5, wordCount: 300, source: 'National Geographic',
  paragraphs: ['Climate change is one of the biggest challenges.'],
  vocabWords: [{
    word: 'challenge', definition: 'A difficult task',
    partOfSpeech: 'noun', example: 'This is a big challenge.',
  }],
  questions: [
    { id: 'q1', question: 'What is climate change?', options: ['A challenge', 'A game', 'A book', 'A city'], correctIndex: 0, explanation: 'It is a challenge.' },
  ],
}])

const mockFetchReadingTexts = vi.hoisted(() => vi.fn().mockResolvedValue(mockTexts))

vi.mock('@/services/readingService', () => ({
  fetchReadingTexts: mockFetchReadingTexts,
  saveReadingResult: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/claude', () => ({
  generateReadingQuestions: vi.fn(),
}))

vi.mock('@/store/useStore', () => ({
  useStore: (s?: (x: { addXP: unknown; updateSkillProgress: unknown }) => unknown) => {
    const state = { addXP: vi.fn(), updateSkillProgress: vi.fn() }
    return s ? s(state) : state
  },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'user-test' } } } }) },
  },
}))

vi.mock('@/lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn(), captureException: vi.fn() },
}))

vi.mock('../../components/exam/ExamTimer', () => ({
  default: () => <div data-testid="exam-timer" />,
}))

// ─── Import ──────────────────────────────────────────────────────────────────

import Reading from '../Reading'

function renderPage() {
  return render(<BrowserRouter><Reading /></BrowserRouter>)
}

describe('Reading', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Loading state ─────────────────────────────────────────────────────────

  it('shows loading while fetching texts', () => {
    renderPage()
    expect(screen.getByText('Matnlar yuklanmoqda...')).toBeInTheDocument()
  })

  // ── Text selector ─────────────────────────────────────────────────────────

  it('renders title after loading', async () => {
    renderPage()
    // uz.json: reading.title = "O'qish"
    await waitFor(() => {
      expect(screen.getByText("O'qish")).toBeInTheDocument()
    })
  })

  it('renders text cards after loading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Climate Change')).toBeInTheDocument()
    })
  })

  it('shows topic and level on cards', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Science')).toBeInTheDocument()
      expect(screen.getByText('B1')).toBeInTheDocument()
    })
  })

  // ── Open text ─────────────────────────────────────────────────────────────

  it('opens reading view when text is clicked', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Climate Change')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Climate Change'))

    await waitFor(() => {
      expect(screen.getByText(/Climate change is one of/)).toBeInTheDocument()
    })
  })

  it('shows vocabulary legend in read mode', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Climate Change')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Climate Change'))

    await waitFor(() => {
      // uz.json: reading.vocabLegend = "📖 Sariq so'zlarni bosing"
      expect(screen.getByText(/Sariq so'zlarni bosing/)).toBeInTheDocument()
    })
  })

  it('shows exam timer in read mode', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Climate Change')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Climate Change'))

    await waitFor(() => {
      expect(screen.getByTestId('exam-timer')).toBeInTheDocument()
    })
  })

  // ── Quiz ──────────────────────────────────────────────────────────────────

  it('goes to quiz when "Go to quiz" is clicked', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Climate Change')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Climate Change'))
    await waitFor(() => expect(screen.getByText(/Climate change is one of/)).toBeInTheDocument())

    // uz.json: reading.goToQuiz = "Mashqlarga o'tish →"
    fireEvent.click(screen.getByText("Mashqlarga o'tish →"))
    await waitFor(() => {
      // uz.json: reading.quizTitle = "Comprehension savollar"
      expect(screen.getByText(/Comprehension savollar/)).toBeInTheDocument()
    })
  })

  it('shows question in quiz mode', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Climate Change')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Climate Change'))
    await waitFor(() => expect(screen.getByText(/Climate change is one of/)).toBeInTheDocument())
    fireEvent.click(screen.getByText("Mashqlarga o'tish →"))

    await waitFor(() => {
      expect(screen.getByText('What is climate change?')).toBeInTheDocument()
    })
  })

  // ── Back to select ────────────────────────────────────────────────────────

  it('goes back to text selection from read mode', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Climate Change')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Climate Change'))
    await waitFor(() => expect(screen.getByText(/Climate change is one of/)).toBeInTheDocument())

    const backBtn = document.querySelector('.lucide-chevron-left')
    if (backBtn) fireEvent.click(backBtn)
    await waitFor(() => {
      expect(screen.getByText("O'qish")).toBeInTheDocument()
    })
  })
})
