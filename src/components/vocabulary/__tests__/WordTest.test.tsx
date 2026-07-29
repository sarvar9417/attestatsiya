import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import WordTest from '../WordTest'
import type { GameWord } from '../../../store/vocabularyStore'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeWord(id: number, overrides: Partial<GameWord> = {}): GameWord {
  return {
    word_id: id,
    english: `word${id}`,
    uzbek: `tarjima${id}`,
    level: 'A1',
    box: 1,
    next_review: '2026-06-16',
    is_learned: false,
    correct_count: 0,
    wrong_count: 0,
    is_new: false,
    ...overrides,
  }
}

const sampleWords = [
  makeWord(1, { english: 'hello', uzbek: 'salom', level: 'A1' }),
  makeWord(2, { english: 'goodbye', uzbek: 'xayr', level: 'A1' }),
  makeWord(3, { english: 'book', uzbek: 'kitob', level: 'A2' }),
  makeWord(4, { english: 'house', uzbek: 'uy', level: 'A1' }),
  makeWord(5, { english: 'car', uzbek: 'mashina', level: 'A1' }),
]

let randomSequence: number[] = []
let randomIdx = 0

beforeEach(() => {
  randomIdx = 0
  randomSequence = []
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function mockMathRandom(values: number[]) {
  randomSequence = values
  randomIdx = 0
  vi.spyOn(Math, 'random').mockImplementation(() => {
    const val = randomSequence[randomIdx % randomSequence.length]
    randomIdx++
    return val
  })
}

// Helper to click a button by its accessible name (text content)
function clickOption(buttonText: string) {
  const btn = screen.getByRole('button', { name: new RegExp(buttonText) })
  act(() => { fireEvent.click(btn) })
}

function advanceTimeout() {
  act(() => { vi.advanceTimersByTime(1200) })
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('WordTest', () => {
  it('renders the question in en→uz mode when random < 0.5', () => {
    // First Math.random() = 0.3 → direction = 'en→uz'
    mockMathRandom([0.3, 0.1, 0.2, 0.3, 0.4])
    const onAnswer = vi.fn()
    render(<WordTest word={sampleWords[0]} allWords={sampleWords} onAnswer={onAnswer} />)

    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByText(/O'zbekcha tarjimasini toping/)).toBeInTheDocument()
  })

  it('renders the question in uz→en mode when random >= 0.5', () => {
    // First Math.random() = 0.7 → direction = 'uz→en'
    mockMathRandom([0.7, 0.1, 0.2, 0.3, 0.4])
    const onAnswer = vi.fn()
    render(<WordTest word={sampleWords[0]} allWords={sampleWords} onAnswer={onAnswer} />)

    expect(screen.getByText('salom')).toBeInTheDocument()
    expect(screen.getByText(/Inglizcha tarjimasini toping/)).toBeInTheDocument()
  })

  it('renders 4 option buttons', () => {
    mockMathRandom([0.3, 0.1, 0.2, 0.3, 0.4])
    const onAnswer = vi.fn()
    render(<WordTest word={sampleWords[0]} allWords={sampleWords} onAnswer={onAnswer} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })

  it('includes the correct answer among the options', () => {
    mockMathRandom([0.3, 0.1, 0.2, 0.3, 0.4])
    const onAnswer = vi.fn()
    render(<WordTest word={sampleWords[0]} allWords={sampleWords} onAnswer={onAnswer} />)

    // In en→uz mode, correct answer is 'salom'
    expect(screen.getByText('salom')).toBeInTheDocument()
  })

  it('calls onAnswer with true when correct option is clicked', () => {
    mockMathRandom([0.3, 0.1, 0.2, 0.3, 0.4])
    const onAnswer = vi.fn()
    render(<WordTest word={sampleWords[0]} allWords={sampleWords} onAnswer={onAnswer} />)

    // In en→uz mode, correct answer is 'salom'
    clickOption('salom')
    advanceTimeout()

    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it('calls onAnswer with false when wrong option is clicked', () => {
    mockMathRandom([0.3, 0.1, 0.2, 0.3, 0.4])
    const onAnswer = vi.fn()
    render(<WordTest word={sampleWords[0]} allWords={sampleWords} onAnswer={onAnswer} />)

    // Click a wrong option (not 'salom')
    clickOption('kitob')
    advanceTimeout()

    expect(onAnswer).toHaveBeenCalledWith(false)
  })

  it('shows green highlight on the correct answer when revealed', () => {
    mockMathRandom([0.3, 0.1, 0.2, 0.3, 0.4])
    const onAnswer = vi.fn()
    render(<WordTest word={sampleWords[0]} allWords={sampleWords} onAnswer={onAnswer} />)

    clickOption('salom')

    // The green highlight class should be present on the <button> element
    const correctBtn = screen.getByRole('button', { name: /salom/ })
    expect(correctBtn.className).toMatch(/border-green-400/)
    expect(correctBtn.className).toMatch(/bg-green-50/)
  })

  it('shows red highlight on wrong selection and green on correct', () => {
    mockMathRandom([0.3, 0.1, 0.2, 0.3, 0.4])
    const onAnswer = vi.fn()
    render(<WordTest word={sampleWords[0]} allWords={sampleWords} onAnswer={onAnswer} />)

    clickOption('kitob')

    // Wrong button should have red styling (use getByRole to get the <button>, not the inner <span>)
    const wrongBtn = screen.getByRole('button', { name: /kitob/ })
    expect(wrongBtn.className).toMatch(/border-red-300/)
    expect(wrongBtn.className).toMatch(/bg-red-50/)

    // Correct answer should have green styling
    const correctBtn = screen.getByRole('button', { name: /salom/ })
    expect(correctBtn.className).toMatch(/border-green-400/)
    expect(correctBtn.className).toMatch(/bg-green-50/)
  })

  it('ignores clicks after answer is revealed', () => {
    mockMathRandom([0.3, 0.1, 0.2, 0.3, 0.4])
    const onAnswer = vi.fn()
    render(<WordTest word={sampleWords[0]} allWords={sampleWords} onAnswer={onAnswer} />)

    // Click correct answer first
    clickOption('salom')
    // Try clicking wrong answer while revealed
    clickOption('kitob')
    advanceTimeout()

    // Should only have been called once (with true)
    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it('resets state after timeout and renders new word', () => {
    mockMathRandom([0.3, 0.1, 0.2, 0.3, 0.4])
    const onAnswer = vi.fn()
    const { rerender } = render(
      <WordTest word={sampleWords[0]} allWords={sampleWords} onAnswer={onAnswer} />,
    )

    // Answer correctly
    clickOption('salom')
    advanceTimeout()

    // Rerender with new word (simulates parent skipping to next word)
    rerender(<WordTest word={sampleWords[1]} allWords={sampleWords} onAnswer={onAnswer} />)

    // Should render the new word's content
    expect(screen.getByText('goodbye')).toBeInTheDocument()
  })

  it('renders the level badge', () => {
    mockMathRandom([0.3, 0.1, 0.2, 0.3, 0.4])
    const onAnswer = vi.fn()
    render(<WordTest word={sampleWords[2]} allWords={sampleWords} onAnswer={onAnswer} />)

    expect(screen.getByText('A2')).toBeInTheDocument()
  })
})
