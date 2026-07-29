import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import VocabStep from '../steps/VocabStep'
import type { SpeakingDay } from '../../../data/speakingPath/types'

const mockDay: SpeakingDay = {
  day: 1, cefr: 'A0', title: 'Test', subtitle: 'Test',
  goalUz: 'Test', estMinutes: 10,
  chunks: [{ id: 'sp-d1-c1', en: 'Hello!', uz: 'Salom!' }],
  scenario: { topic: 'test', aiRole: 'a', userRole: 'b', opening: 'Hi', goalUz: 'test' },
  vocab: [
    { en: 'hello', uz: 'salom', example: 'Hello there!' },
    { en: 'goodbye', uz: 'xayr', example: 'Goodbye for now.' },
    { en: 'please', uz: 'iltimos', example: 'Please sit.' },
    { en: 'thanks', uz: 'rahmat', example: 'Thanks a lot.' },
    { en: 'sorry', uz: 'uzr', example: 'Sorry about that.' },
  ],
}

const emptyDay: SpeakingDay = {
  ...mockDay,
  vocab: [],
}

describe('VocabStep', () => {
  it('renders vocabulary cards with en/uz/example', () => {
    render(<VocabStep day={mockDay} onNext={vi.fn()} />)
    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByText('salom')).toBeInTheDocument()
    expect(screen.getByText('"Hello there!"')).toBeInTheDocument()
  })

  it('shows progress counter 0/5', () => {
    render(<VocabStep day={mockDay} onNext={vi.fn()} />)
    expect(screen.getByText('0/5')).toBeInTheDocument()
  })

  it('toggles learned state on check button', () => {
    render(<VocabStep day={mockDay} onNext={vi.fn()} />)
    const card = screen.getByText('hello').closest('.rounded-xl')!
    const checkBtn = card.querySelector('button:last-child')!
    fireEvent.click(checkBtn)
    expect(screen.getByText('1/5')).toBeInTheDocument()
  })

  it('shows show all button when vocab > 4', () => {
    render(<VocabStep day={mockDay} onNext={vi.fn()} />)
    expect(screen.getByText(/Hammasini ko'rish/)).toBeInTheDocument()
  })

  it('expands all vocab when clicking show all', () => {
    render(<VocabStep day={mockDay} onNext={vi.fn()} />)
    fireEvent.click(screen.getByText(/Hammasini ko'rish/))
    expect(screen.getByText('sorry')).toBeInTheDocument()
  })

  it('calls onNext when continue button clicked', () => {
    const onNext = vi.fn()
    render(<VocabStep day={mockDay} onNext={onNext} />)
    fireEvent.click(screen.getByText(/Grammatikaga o'tish/))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('shows empty state when no vocab', () => {
    render(<VocabStep day={emptyDay} onNext={vi.fn()} />)
    expect(screen.getByText(/yangi so'zlar yo'q/)).toBeInTheDocument()
  })
})
