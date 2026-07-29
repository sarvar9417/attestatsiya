import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const mockLessons = vi.hoisted(() => [
  {
    id: 'l1', title: 'Breaking News', level: 'B1', source: 'BBC News',
    description: 'A news report about technology',
    duration: '3:45', youtubeId: 'abc123',
    transcript: [
      { startSec: 0, text: 'Welcome to the news.', speaker: 'Anchor' },
      { startSec: 30, text: 'New technology is changing our lives.' },
    ],
    vocabulary: [{ word: 'breakthrough', definition: 'A major achievement' }],
    fillBlanks: [
      { id: 'fb1', sentence: 'Welcome ___ the news.', answer: 'to', startSec: 0 },
    ],
    trueFalse: [
      { id: 'tf1', statement: 'The report is about technology.', answer: true },
    ],
  },
])

const mockFetchListeningLessons = vi.hoisted(() => vi.fn().mockResolvedValue(mockLessons))

vi.mock('@/services/listeningService', () => ({
  fetchListeningLessons: mockFetchListeningLessons,
  saveListeningResult: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/store/useStore', () => ({
  useStore: (s?: (x: { addXP: unknown; updateSkillProgress: unknown }) => unknown) => {
    const state = { addXP: vi.fn(), updateSkillProgress: vi.fn() }
    return s ? s(state) : state
  },
}))

vi.mock('@/lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn(), captureException: vi.fn() },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'user-test' } } } }) },
  },
}))

// ─── Import ──────────────────────────────────────────────────────────────────

import Listening from '../Listening'

function renderPage() {
  return render(<BrowserRouter><Listening /></BrowserRouter>)
}

describe('Listening', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Loading state ─────────────────────────────────────────────────────────

  it('shows loading while fetching lessons', () => {
    renderPage()
    expect(screen.getByText('Darslar yuklanmoqda...')).toBeInTheDocument()
  })

  // ── Lesson selector ───────────────────────────────────────────────────────

  it('renders title after loading', async () => {
    renderPage()
    // uz.json: listening.title = "Tinglab tushunish"
    await waitFor(() => {
      expect(screen.getByText('Tinglab tushunish')).toBeInTheDocument()
    })
  })

  it('renders lesson cards after loading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Breaking News')).toBeInTheDocument()
    })
  })

  it('shows lesson level and source', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('B1')).toBeInTheDocument()
      expect(screen.getByText('BBC News')).toBeInTheDocument()
    })
  })

  // ── Lesson open ──────────────────────────────────────────────────────────

  it('opens lesson when card is clicked', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Breaking News')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Breaking News'))

    await waitFor(() => {
      // uz.json: listening.tabWatch = "👁️ Watch"
      expect(screen.getByText('▶ Ko\'rish')).toBeInTheDocument()
    })
  })

  it('shows vocabulary section in watch tab', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Breaking News')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Breaking News'))

    await waitFor(() => {
      expect(screen.getByText('breakthrough')).toBeInTheDocument()
    })
  })

  // ── Tab switching ─────────────────────────────────────────────────────────

  it('switches to transcript tab', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Breaking News')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Breaking News'))
    await waitFor(() => expect(screen.getByText('▶ Ko\'rish')).toBeInTheDocument())

    // uz.json: listening.tabTranscript = '📄 Matn'
    fireEvent.click(screen.getByText('📄 Matn'))
    await waitFor(() => {
      expect(screen.getByText(/Welcome to the news/)).toBeInTheDocument()
    })
  })

  // ── Exercises flow ────────────────────────────────────────────────────────

  it('goes to exercises from watch tab', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Breaking News')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Breaking News'))
    await waitFor(() => expect(screen.getByText('▶ Ko\'rish')).toBeInTheDocument())

    // uz.json: listening.goToExercises = "Mashqlarga o'tish"
    fireEvent.click(screen.getByText('Mashqlarga o\'tish →'))
    await waitFor(() => {
      // uz.json: listening.fillBlanks = 'Fill-in-the-blank'
      expect(screen.getByText('Fill-in-the-blank')).toBeInTheDocument()
    })
  })

  it('shows fill-blank exercise with input', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Breaking News')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Breaking News'))
    await waitFor(() => expect(screen.getByText('▶ Ko\'rish')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Mashqlarga o\'tish →'))

    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText('...')
      expect(inputs.length).toBeGreaterThanOrEqual(1)
    })
  })

  // ── Back to select ────────────────────────────────────────────────────────

  it('goes back to lesson selection', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Breaking News')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Breaking News'))
    await waitFor(() => expect(screen.getByText('▶ Ko\'rish')).toBeInTheDocument())

    const backBtn = document.querySelector('.lucide-chevron-left')
    if (backBtn) fireEvent.click(backBtn)
    await waitFor(() => {
      expect(screen.getByText('Tinglab tushunish')).toBeInTheDocument()
    })
  })
})
