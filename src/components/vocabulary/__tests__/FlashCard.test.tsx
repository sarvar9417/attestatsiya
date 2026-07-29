import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FlashCard from '../FlashCard'
import type { GameWord } from '../../../store/vocabularyStore'

// ─── Mock useSwipe ───────────────────────────────────────────────────────────

const mockSwipeState = { offsetX: 0, isDragging: false }
const mockBind = { onMouseDown: vi.fn(), onTouchStart: vi.fn() }

vi.mock('../../../hooks/useSwipe', () => ({
  useSwipe: () => [mockBind, mockSwipeState],
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeWord(overrides: Partial<GameWord> = {}): GameWord {
  return {
    word_id: 1,
    english: 'hello',
    uzbek: 'salom',
    level: 'A1',
    box: 1,
    next_review: '2026-06-16',
    is_learned: false,
    correct_count: 5,
    wrong_count: 2,
    is_new: false,
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSwipeState.isDragging = false
  mockSwipeState.offsetX = 0
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('FlashCard', () => {
  it('renders the english word at least once', () => {
    render(<FlashCard word={makeWord()} flipped={false} onFlip={vi.fn()} />)
    // The word appears on the front side
    const elements = screen.getAllByText('hello')
    expect(elements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the level badge on the front', () => {
    render(<FlashCard word={makeWord({ level: 'B1' })} flipped={false} onFlip={vi.fn()} />)
    const elements = screen.getAllByText('B1')
    expect(elements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the phonetic transcription when provided', () => {
    render(<FlashCard word={makeWord({ phonetic: 'həˈloʊ' })} flipped={false} onFlip={vi.fn()} />)
    const elements = screen.getAllByText('/həˈloʊ/')
    expect(elements.length).toBeGreaterThanOrEqual(1)
  })

  it('does not render phonetic when not provided', () => {
    render(<FlashCard word={makeWord({ phonetic: undefined })} flipped={false} onFlip={vi.fn()} />)
    // Box label has "1/6" which contains a /, but no phonetic word
    expect(screen.queryByText(/\/h[^/]+\//)).not.toBeInTheDocument()
  })

  it('shows "Yangi" badge when word is new', () => {
    render(<FlashCard word={makeWord({ is_new: true })} flipped={false} onFlip={vi.fn()} />)
    const elements = screen.getAllByText('Yangi')
    expect(elements.length).toBeGreaterThanOrEqual(1)
  })

  it('does not show "Yangi" badge for non-new words', () => {
    render(<FlashCard word={makeWord({ is_new: false })} flipped={false} onFlip={vi.fn()} />)
    expect(screen.queryByText('Yangi')).not.toBeInTheDocument()
  })

  it('shows the "Ko\'rish" button on the front', () => {
    render(<FlashCard word={makeWord()} flipped={false} onFlip={vi.fn()} />)
    expect(screen.getByText("Ko'rish")).toBeInTheDocument()
  })

  it('calls onFlip when "Ko\'rish" button is clicked', async () => {
    const user = userEvent.setup()
    const onFlip = vi.fn()
    render(<FlashCard word={makeWord()} flipped={false} onFlip={onFlip} />)

    await user.click(screen.getByText("Ko'rish"))
    expect(onFlip).toHaveBeenCalledTimes(1)
  })

  it('renders the uzbek translation on the back when flipped', () => {
    render(<FlashCard word={makeWord()} flipped={true} onFlip={vi.fn()} />)
    const elements = screen.getAllByText('salom')
    expect(elements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the example on the back when flipped and example exists', () => {
    render(
      <FlashCard
        word={makeWord({ example: 'Hello, how are you?' })}
        flipped={true}
        onFlip={vi.fn()}
      />,
    )
    // Component wraps example in curly quotes (\u201c...\u201d)
    expect(screen.getByText(/Hello, how are you\?/)).toBeInTheDocument()
  })

  it('does not show example on back when not provided', () => {
    render(<FlashCard word={makeWord({ example: undefined })} flipped={true} onFlip={vi.fn()} />)
    expect(screen.queryByText(/".*"/)).not.toBeInTheDocument()
  })

  it('shows correct and wrong counts on the back', () => {
    render(<FlashCard word={makeWord({ correct_count: 10, wrong_count: 3 })} flipped={true} onFlip={vi.fn()} />)
    expect(screen.getByText(/✅\s*10/)).toBeInTheDocument()
    expect(screen.getByText(/❌\s*3/)).toBeInTheDocument()
  })

  it('shows "Yodlagan" badge when word is learned', () => {
    render(<FlashCard word={makeWord({ is_learned: true })} flipped={true} onFlip={vi.fn()} />)
    expect(screen.getByText(/Yodlagan/)).toBeInTheDocument()
  })

  it('shows box number instead of Yodlagan when not learned', () => {
    render(<FlashCard word={makeWord({ is_learned: false, box: 3 })} flipped={true} onFlip={vi.fn()} />)
    expect(screen.getByText('Box 3')).toBeInTheDocument()
    expect(screen.queryByText(/Yodlagan/)).not.toBeInTheDocument()
  })

  it('shows box progression text on the front', () => {
    render(<FlashCard word={makeWord({ box: 3 })} flipped={false} onFlip={vi.fn()} />)
    expect(screen.getByText(/Box 3\/6/)).toBeInTheDocument()
  })

  it('applies drag transform when isDragging is true', () => {
    mockSwipeState.isDragging = true
    mockSwipeState.offsetX = 50

    const { container } = render(<FlashCard word={makeWord()} flipped={false} onFlip={vi.fn()} />)
    const inner = container.querySelector('[style*="translateX"]')
    expect(inner).toBeTruthy()
    expect(inner?.getAttribute('style')).toContain('translateX(50px)')

    // Reset for other tests
    mockSwipeState.isDragging = false
    mockSwipeState.offsetX = 0
  })

  it('hides the "Ko\'rish" button when flipped', () => {
    render(<FlashCard word={makeWord()} flipped={true} onFlip={vi.fn()} />)
    expect(screen.queryByText("Ko'rish")).not.toBeInTheDocument()
  })

  it('renders the box label text on the front', () => {
    render(<FlashCard word={makeWord({ box: 4 })} flipped={false} onFlip={vi.fn()} />)
    expect(screen.getByText(/14 kun/)).toBeInTheDocument()
  })

  it('still shows level badge on the back', () => {
    render(<FlashCard word={makeWord({ level: 'B2' })} flipped={true} onFlip={vi.fn()} />)
    const badges = screen.getAllByText('B2')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })
})
