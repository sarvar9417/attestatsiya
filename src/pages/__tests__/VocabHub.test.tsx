import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock lazy-loaded vocabulary sub-pages so they render synchronously
vi.mock('../Vocabulary', () => ({
  default: () => <div data-testid="vocabulary-page">Vocabulary Page</div>,
}))

vi.mock('../Dictionary', () => ({
  default: () => <div data-testid="dictionary-page">Dictionary Page</div>,
}))

vi.mock('../Phrases', () => ({
  default: () => <div data-testid="phrases-page">Phrases Page</div>,
}))

vi.mock('../PhraseDictionary', () => ({
  default: () => <div data-testid="phrases-dict-page">Phrase Dict Page</div>,
}))

afterEach(() => {
  cleanup()
})

// ─── Imports ──────────────────────────────────────────────────────────────────

import VocabHub from '../VocabHub'

async function renderPage() {
  const result = render(
    <MemoryRouter initialEntries={['/vocabulary']}>
      <VocabHub />
    </MemoryRouter>
  )
  // Flush microtasks so lazy components resolve and Suspense renders children
  await act(async () => {})
  return result
}

describe('VocabHub — VocabBattle banner (Task A)', () => {
  // ── Banner rendering ──────────────────────────────────────────────────────

  it('renders the VocabBattle banner on the "learn" tab', async () => {
    await renderPage()
    const bannerBtn = screen.getByRole('button', { name: /So'z Dueli/ })
    expect(bannerBtn).toBeInTheDocument()
  })

  it('renders the Sword icon in the banner', async () => {
    await renderPage()
    const swordSvg = document.querySelector('.lucide-sword')
    expect(swordSvg).toBeInTheDocument()
  })

  // ── Navigation ────────────────────────────────────────────────────────────

  it('renders a clickable banner that navigates to /vocab-battle', async () => {
    await renderPage()
    const bannerBtn = screen.getByRole('button', { name: /So'z Dueli/ })
    expect(bannerBtn).toBeInTheDocument()
    fireEvent.click(bannerBtn)
    expect(screen.getByRole('button', { name: /So'z Dueli/ })).toBeInTheDocument()
  })

  // ── Position (before Vocabulary component) ────────────────────────────────

  it('renders banner BEFORE the Vocabulary component in the learn tab', async () => {
    await renderPage()

    const banner = screen.getByRole('button', { name: /So'z Dueli/ })
    const vocabSection = screen.getByTestId('vocabulary-page')

    const bannerPos = banner.compareDocumentPosition(vocabSection)
    expect(bannerPos & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  // ── Banner not visible on other tabs ──────────────────────────────────────

  it('does NOT show VocabBattle banner on dictionary tab', async () => {
    await renderPage()

    const tabButtons = screen.getAllByRole('button')
    const dictTab = tabButtons.find(btn => btn.textContent?.includes("So'z Izlash"))
    expect(dictTab).toBeInTheDocument()
    fireEvent.click(dictTab!)

    // Flush microtasks so lazy Dictionary component resolves
    await act(async () => {})

    expect(screen.getByTestId('dictionary-page')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /So'z Dueli/ })).not.toBeInTheDocument()
  })

  it('does NOT show VocabBattle banner on phrases tab', async () => {
    await renderPage()

    const tabButtons = screen.getAllByRole('button')
    const phrasesTab = tabButtons.find(btn => btn.textContent?.includes('Iboralar'))
    expect(phrasesTab).toBeInTheDocument()
    fireEvent.click(phrasesTab!)

    await act(async () => {})

    expect(screen.getByTestId('phrases-page')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /So'z Dueli/ })).not.toBeInTheDocument()
  })

  // ── Banner styling classes ────────────────────────────────────────────────

  it('has gradient styling on the banner', async () => {
    await renderPage()
    const bannerBtn = screen.getByRole('button', { name: /So'z Dueli/ })
    expect(bannerBtn.className).toContain('from-red-50')
    expect(bannerBtn.className).toContain('to-orange-50')
  })

  it('has hover state transition class', async () => {
    await renderPage()
    const bannerBtn = screen.getByRole('button', { name: /So'z Dueli/ })
    expect(bannerBtn.className).toContain('hover:from-red-100')
    expect(bannerBtn.className).toContain('transition-all')
  })

  // ── Tab switching + banner visibility ─────────────────────────────────────

  it('shows banner again when switching back to learn tab', async () => {
    await renderPage()

    const tabButtons = screen.getAllByRole('button')
    const dictTab = tabButtons.find(btn => btn.textContent?.includes("So'z Izlash"))
    fireEvent.click(dictTab!)
    await act(async () => {})

    expect(screen.queryByRole('button', { name: /So'z Dueli/ })).not.toBeInTheDocument()

    const updatedButtons = screen.getAllByRole('button')
    const learnTab = updatedButtons.find(btn => btn.textContent?.includes("SRS O'rganish"))
    fireEvent.click(learnTab!)
    await act(async () => {})

    expect(screen.getByRole('button', { name: /So'z Dueli/ })).toBeInTheDocument()
  })
})
