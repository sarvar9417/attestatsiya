import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const mockPhrasalVerbs = vi.hoisted(() => [
  {
    id: 'pv1', phrasalVerb: 'give up', verb: 'give', level: 'B1+' as const,
    meaning: 'To stop trying', translation: 'Taslim bo\'lmoq',
    examples: ['Don\'t give up on your dreams.'], category: 'action',
    collocations: ['give up hope', 'give up smoking'],
  },
])

vi.mock('../../data/phrasalVerbs', () => ({
  PHRASAL_VERBS: mockPhrasalVerbs,
}))

// ─── Import ──────────────────────────────────────────────────────────────────

import PhrasalVerbs from '../PhrasalVerbs'

function renderPage() {
  return render(<BrowserRouter><PhrasalVerbs /></BrowserRouter>)
}

describe('PhrasalVerbs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Header ────────────────────────────────────────────────────────────────

  it('renders the title', () => {
    renderPage()
    expect(screen.getByText('Phrasal Verbs')).toBeInTheDocument()
  })

  it('shows the count in subtitle', () => {
    renderPage()
    expect(screen.getByText(/phrasal verb/)).toBeInTheDocument()
  })

  // ── Search ────────────────────────────────────────────────────────────────

  it('renders search input', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/Qidirish/)
    expect(searchInput).toBeInTheDocument()
  })

  // ── Filters ───────────────────────────────────────────────────────────────

  it('renders filter chips for verbs', () => {
    renderPage()
    // VERBS array includes 'give', 'get', 'take', 'put', etc.
    // 'give' appears as filter chip AND in card title, so use getAllByText
    const giveElements = screen.getAllByText('give')
    expect(giveElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('get')).toBeInTheDocument()
    expect(screen.getByText('take')).toBeInTheDocument()
  })

  it('shows all filter active by default', () => {
    renderPage()
    // uz.json: phrasalVerbs.filterAll = "Barchasi"
    expect(screen.getByText('Hammasi')).toBeInTheDocument()
  })

  it('renders level filters', () => {
    renderPage()
    // B1+ might appear in both filter chip and card badge
    const b1plusElements = screen.getAllByText('B1+')
    expect(b1plusElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('B2')).toBeInTheDocument()
  })

  // ── Results ───────────────────────────────────────────────────────────────

  it('renders phrasal verb cards grouped by verb', () => {
    renderPage()
    // 'give' appears in both filter chip and card group header
    const giveElements = screen.getAllByText('give')
    expect(giveElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('give up')).toBeInTheDocument()
  })

  it('shows translation on cards', () => {
    renderPage()
    expect(screen.getByText("Taslim bo'lmoq")).toBeInTheDocument()
  })

  // ── Verb filter ───────────────────────────────────────────────────────────

  it('filters by verb chip', () => {
    renderPage()
    // Click on 'get' filter — 'give up' should disappear
    fireEvent.click(screen.getByText('get'))
    expect(screen.queryByText('give up')).not.toBeInTheDocument()
  })

  it('resets filter when clicking the same verb chip again', () => {
    renderPage()
    // uz.json: phrasalVerbs.filterAll = "Barchasi"
    fireEvent.click(screen.getByText('get'))
    expect(screen.queryByText('give up')).not.toBeInTheDocument()

    // Click 'Barchasi' to show all
    fireEvent.click(screen.getByText('Hammasi'))
    expect(screen.getByText('give up')).toBeInTheDocument()
  })

  // ── Level filter ──────────────────────────────────────────────────────────

  it('filters by level', () => {
    renderPage()
    // Click B2 — 'give up' is B1+, so it should disappear
    fireEvent.click(screen.getByText('B2'))
    expect(screen.queryByText('give up')).not.toBeInTheDocument()
  })

  // ── Search filtering ──────────────────────────────────────────────────────

  it('filters by search query', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/Qidirish/)
    fireEvent.change(searchInput, { target: { value: 'give' } })
    expect(screen.getByText('give up')).toBeInTheDocument()
  })

  it('shows empty state when no matches', () => {
    renderPage()
    const searchInput = screen.getByPlaceholderText(/Qidirish/)
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } })
    // uz.json: phrasalVerbs.noResults = "Hech narsa topilmadi"
    expect(screen.getByText('Hech narsa topilmadi')).toBeInTheDocument()
  })

  // ── Detail view ───────────────────────────────────────────────────────────

  it('opens detail view when a card is clicked', async () => {
    renderPage()
    fireEvent.click(screen.getByText('give up'))
    await vi.waitFor(() => {
      expect(screen.getByText(/Ma\u02BBnosi/)).toBeInTheDocument()
    })
  })

  it('shows meaning in detail', async () => {
    renderPage()
    fireEvent.click(screen.getByText('give up'))
    await vi.waitFor(() => {
      expect(screen.getByText('To stop trying')).toBeInTheDocument()
    })
  })

  it('shows examples in detail', async () => {
    renderPage()
    fireEvent.click(screen.getByText('give up'))
    await vi.waitFor(() => {
      expect(screen.getByText(/"Don't give up on your dreams."/)).toBeInTheDocument()
    })
  })

  // ── Back from detail ──────────────────────────────────────────────────────

  it('goes back from detail to browse', async () => {
    renderPage()
    fireEvent.click(screen.getByText('give up'))
    await vi.waitFor(() => expect(screen.getByText(/Ma\u02BBnosi/)).toBeInTheDocument())

    // uz.json: phrasalVerbs.detailBack = "Orqaga"
    fireEvent.click(screen.getByText('Orqaga'))
    await vi.waitFor(() => {
      expect(screen.getByText('Phrasal Verbs')).toBeInTheDocument()
    })
  })
})
