import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SpeakingPathLink from '../SpeakingPathLink'

const mockNavigate = vi.fn()

vi.mock('../../../data/speakingPath', () => ({
  getDaysForLesson: () => [{ day: 42 }],
}))

describe('SpeakingPathLink', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('kun raqamini korsatadi', () => {
    render(<SpeakingPathLink lessonId="test" navigate={mockNavigate} />)
    expect(screen.getByText(/42-kun/)).toBeTruthy()
  })

  it('bosilganda navigate chaqiriladi', () => {
    render(<SpeakingPathLink lessonId="test" navigate={mockNavigate} />)
    const card = screen.getByText(/42-kun/)
    fireEvent.click(card)
    expect(mockNavigate).toHaveBeenCalledWith('/speaking-path?day=42')
  })

  it('mikrofon iconini korsatadi', () => {
    render(<SpeakingPathLink lessonId="test" navigate={mockNavigate} />)
    expect(screen.getByText(/Shu grammatikani gapirib mashq qilish/)).toBeTruthy()
  })

  it('Speaking Path descriptionni korsatadi', () => {
    render(<SpeakingPathLink lessonId="test" navigate={mockNavigate} />)
    expect(screen.getByText(/real suhbat stsenariylari/)).toBeTruthy()
  })
})
