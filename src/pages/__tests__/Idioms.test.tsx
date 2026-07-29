import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const mockIdioms = vi.hoisted(() => [{
  id: 'idiom1', idiom: 'Break the ice', actualMeaning: 'Suhbatni boshlash',
  translation: 'Muzni sindirish', literalMeaning: 'Muzni sindirish',
  level: 'B1+' as const, category: 'communication',
  origin: 'From old shipping practices where ships would break ice to clear a path.',
  examples: ['He broke the ice at the meeting by telling a joke.'],
}])

vi.mock('../../data/idioms', () => ({
  IDIOMS: mockIdioms,
}))

// ─── Import ──────────────────────────────────────────────────────────────────

import Idioms from '../Idioms'

function renderPage() {
  return render(<BrowserRouter><Idioms /></BrowserRouter>)
}

describe('Idioms', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Header ────────────────────────────────────────────────────────────────

  it('renders the title', () => {
    renderPage()
    // uz.json: idioms.title = "Idiomalar"
    expect(screen.getByText('Idiomalar')).toBeInTheDocument()
  })

  it('shows the count in subtitle', () => {
    renderPage()
    // uz.json: idioms.subtitle = "{count} ta idioma"
    expect(screen.getByText(/1 ta idiom/)).toBeInTheDocument()
  })

  // ── Search ────────────────────────────────────────────────────────────────

  it('renders search input', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/Qidirish/)
    expect(searchInput).toBeInTheDocument()
  })

  // ── Filters ───────────────────────────────────────────────────────────────

  it('renders category filter chips', () => {
    renderPage()
    // uz.json: idioms.filterAll = "Hammasi"
    expect(screen.getByText('Hammasi')).toBeInTheDocument()
    // Categories include 'communication' - may also appear in card badge
    const commElements = screen.getAllByText(/communication/i)
    expect(commElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders level filter chips', () => {
    renderPage()
    // B1+ appears in filter chip AND card badges
    const b1plusElements = screen.getAllByText('B1+')
    expect(b1plusElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('B2')).toBeInTheDocument()
  })

  // ── Results ───────────────────────────────────────────────────────────────

  it('renders idiom cards grouped by category', () => {
    renderPage()
    expect(screen.getByText('Break the ice')).toBeInTheDocument()
  })

  it('shows translation on cards', () => {
    renderPage()
    expect(screen.getByText('Muzni sindirish')).toBeInTheDocument()
  })

  // ── Category filter ───────────────────────────────────────────────────────

  it('filters by category', () => {
    renderPage()
    // Click on 'food' category — 'Break the ice' is 'communication', so it should disappear
    const foodBtn = screen.getByText(/food/)
    fireEvent.click(foodBtn)
    expect(screen.queryByText('Break the ice')).not.toBeInTheDocument()
  })

  // ── Level filter ──────────────────────────────────────────────────────────

  it('filters by level', () => {
    renderPage()
    // Click B2 — 'Break the ice' is B1+, so it should disappear
    fireEvent.click(screen.getByText('B2'))
    expect(screen.queryByText('Break the ice')).not.toBeInTheDocument()
  })

  // ── Search filtering ──────────────────────────────────────────────────────

  it('filters by search query', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/Qidirish/)
    fireEvent.change(searchInput, { target: { value: 'ice' } })
    expect(screen.getByText('Break the ice')).toBeInTheDocument()
  })

  it('shows empty state when no matches', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/Qidirish/)
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } })
    // uz.json: idioms.noResults = "Hech narsa topilmadi"
    expect(screen.getByText('Hech narsa topilmadi')).toBeInTheDocument()
  })

  // ── Detail view ───────────────────────────────────────────────────────────

  it('opens detail view when a card is clicked', async () => {
    renderPage()
    fireEvent.click(screen.getByText('Break the ice'))
    await waitFor(() => {
      // uz.json: idioms.detailMeaning = "Ma'nosi"
      expect(screen.getByText(/Ma'nosi/)).toBeInTheDocument()
    })
  })

  it('shows actual meaning in detail', async () => {
    renderPage()
    fireEvent.click(screen.getByText('Break the ice'))
    await waitFor(() => {
      expect(screen.getByText('Suhbatni boshlash')).toBeInTheDocument()
    })
  })

  it('shows literal meaning in detail', async () => {
    renderPage()
    fireEvent.click(screen.getByText('Break the ice'))
    await waitFor(() => {
      expect(screen.getAllByText(/Muzni sindirish/).length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows examples in detail', async () => {
    renderPage()
    fireEvent.click(screen.getByText('Break the ice'))
    await waitFor(() => {
      expect(screen.getByText(/"He broke the ice at the meeting by telling a joke."/)).toBeInTheDocument()
    })
  })

  it('shows origin in detail', async () => {
    renderPage()
    fireEvent.click(screen.getByText('Break the ice'))
    await waitFor(() => {
      expect(screen.getByText(/From old shipping practices/)).toBeInTheDocument()
    })
  })

  // ── Back from detail ──────────────────────────────────────────────────────

  it('goes back from detail to browse', async () => {
    renderPage()
    fireEvent.click(screen.getByText('Break the ice'))
    await waitFor(() => expect(screen.getByText(/Ma'nosi/)).toBeInTheDocument())

    // uz.json: idioms.detailBack = "Orqaga"
    fireEvent.click(screen.getByText('Orqaga'))
    await waitFor(() => {
      expect(screen.getByText('Idiomalar')).toBeInTheDocument()
    })
  })

  // ── Quiz button ───────────────────────────────────────────────────────────

  it('renders quiz start button', () => {
    renderPage()
    // uz.json: idioms.quizButton = "🏆 Test"
    expect(screen.getByText('🧪 Test')).toBeInTheDocument()
  })

  // ── Quiz mode ─────────────────────────────────────────────────────────────

  it('enters quiz mode when quiz button is clicked', async () => {
    renderPage()
    fireEvent.click(screen.getByText('🧪 Test'))
    await waitFor(() => {
      // Quiz progress text: 'Orqaga1/1✓ 0 Idiom ma'n…'
      expect(document.body.textContent).toMatch(/1\/\d/)
    })
  })

  // ── Clear search ──────────────────────────────────────────────────────────

  it('clears search when X is clicked', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/Qidirish/) as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: 'test' } })

    const clearButton = document.querySelector('.lucide-x')
    if (clearButton) fireEvent.click(clearButton)

    expect(searchInput.value).toBe('')
  })
})
