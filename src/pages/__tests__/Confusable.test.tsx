import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const mockPairs = vi.hoisted(() => [
  {
    id: 'accept-vs-except',
    words: ['accept', 'except'],
    uzTitle: 'Accept vs Except — farqi',
    rule: 'Accept = qabul qilmoq. Except = ...dan tashqari.',
    memoryHook: 'Accept = A(dd) + cept(take) — qabul qilmoq',
    examples: [
      { correct: 'I accept your invitation.', wrong: 'I except your invitation.', explanation: 'Accept = qabul qilish' },
    ],
  },
])

vi.mock('../../data/confusable-pairs', () => ({
  CONFUSABLE_PAIRS: mockPairs,
}))

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'user-test' } } } }) },
  },
}))

vi.mock('../../lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn(), captureException: vi.fn() },
}))

vi.mock('../../utils/toastStore', () => ({
  useToastStore: { getState: () => ({ toast: vi.fn() }) },
}))

vi.mock('../../services/vocabularyService', () => ({
  delayConfusablePartners: vi.fn().mockResolvedValue(undefined),
  pushWordsToSRS_FSRS: vi.fn().mockResolvedValue(undefined),
}))

// ─── Import ──────────────────────────────────────────────────────────────────

import Confusable from '../Confusable'

function renderPage() {
  return render(<BrowserRouter><Confusable /></BrowserRouter>)
}

describe('Confusable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Header and title ──────────────────────────────────────────────────────

  it('renders the title', () => {
    renderPage()
    expect(screen.getByText('Chalkash So\'zlar')).toBeInTheDocument()
  })

  // ── Search bar ────────────────────────────────────────────────────────────

  it('renders search input', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/Qidirish/)
    expect(searchInput).toBeInTheDocument()
  })

  // ── Results display ───────────────────────────────────────────────────────

  it('renders confusable pair cards', () => {
    renderPage()
    expect(screen.getByText(/accept/)).toBeInTheDocument()
    expect(screen.getByText(/except/)).toBeInTheDocument()
  })

  it('shows the uzTitle of each pair', () => {
    renderPage()
    expect(screen.getByText('Accept vs Except — farqi')).toBeInTheDocument()
  })

  // ── Quiz button ───────────────────────────────────────────────────────────

  it('renders quiz start button', () => {
    renderPage()
    // uz.json: confusable.quizButton = "🏆 Test"
    expect(screen.getByText('🧪 Test')).toBeInTheDocument()
  })

  // ── Quiz mode ─────────────────────────────────────────────────────────────

  it('enters quiz mode when quiz button is clicked', async () => {
    renderPage()
    fireEvent.click(screen.getByText('🧪 Test'))
    await waitFor(() => {
      // Quiz progress text: 'Orqaga1/1✓ 0To\'g\'ri so\'zni tanlang…'
      expect(document.body.textContent).toMatch(/1\/\d/)
    })
  })

  // ── Search filtering ──────────────────────────────────────────────────────

  it('filters pairs by search query', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/Qidirish/)
    fireEvent.change(searchInput, { target: { value: 'accept' } })
    // Should still show accept vs except
    expect(screen.getByText('Accept vs Except — farqi')).toBeInTheDocument()
  })

  it('shows no results message when search has no matches', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/Qidirish/)
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } })
    // uz.json: confusable.noResults = "Hech narsa topilmadi"
    expect(screen.getByText('Hech narsa topilmadi')).toBeInTheDocument()
  })

  // ── Clear search ──────────────────────────────────────────────────────────

  it('clears search when X is clicked', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/Qidirish/)
    fireEvent.change(searchInput, { target: { value: 'test' } })

    const clearButton = document.querySelector('.lucide-x')
    if (clearButton) fireEvent.click(clearButton)

    // After clear, the input value should be empty
    expect((searchInput as HTMLInputElement).value).toBe('')
  })

  // ── Detail view ───────────────────────────────────────────────────────────

  it('opens detail view when a card is clicked', async () => {
    renderPage()
    fireEvent.click(screen.getByText('Accept vs Except — farqi'))
    await waitFor(() => {
      expect(screen.getByText(/Qoida/)).toBeInTheDocument()
    })
  })

  it('shows rule section in detail view', async () => {
    renderPage()
    fireEvent.click(screen.getByText('Accept vs Except — farqi'))
    await waitFor(() => {
      expect(screen.getByText(/Accept = qabul qilmoq/)).toBeInTheDocument()
    })
  })

  it('shows memory hook in detail view', async () => {
    renderPage()
    fireEvent.click(screen.getByText('Accept vs Except — farqi'))
    await waitFor(() => {
      expect(screen.getByText(/Accept = A\(dd\)/)).toBeInTheDocument()
    })
  })

  // ── Back from detail ──────────────────────────────────────────────────────

  it('goes back from detail to browse view', async () => {
    renderPage()
    fireEvent.click(screen.getByText('Accept vs Except — farqi'))
    await waitFor(() => expect(screen.getByText(/Qoida/)).toBeInTheDocument())

    // uz.json: confusable.detailBack = "Orqaga"
    fireEvent.click(screen.getByText('Orqaga'))
    await waitFor(() => {
      expect(screen.getByText('Chalkash So\'zlar')).toBeInTheDocument()
    })
  })
})
