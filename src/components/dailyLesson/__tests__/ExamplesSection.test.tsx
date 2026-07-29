import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ExamplesSection from '../ExamplesSection'

vi.mock('../../ui/AudioButton', () => ({
  AudioButton: () => <button aria-label="audio">🔊</button>,
}))

vi.mock('../../lib/tts', () => ({
  speak: vi.fn(() => Promise.resolve()),
}))

vi.mock('../../lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn() },
}))

const sampleExamples = [
  { en: 'I am a student.', uz: 'Men talabaman' },
  { en: 'She is a teacher.', uz: 'U o\'qituvchi' },
]

describe('ExamplesSection', () => {
  it('misollar sonini korsatadi', () => {
    render(<ExamplesSection examples={sampleExamples} />)
    expect(screen.getByText(/2 ta gap/)).toBeTruthy()
  })

  it('har bir misolni EN va UZ tilida korsatadi', () => {
    render(<ExamplesSection examples={sampleExamples} />)
    expect(screen.getByText('I am a student.')).toBeTruthy()
    expect(screen.getByText('Men talabaman')).toBeTruthy()
    expect(screen.getByText('She is a teacher.')).toBeTruthy()
  })

  it('Hammasini tinglash tugmasini korsatadi', () => {
    render(<ExamplesSection examples={sampleExamples} />)
    expect(screen.getByText(/Hammasini tinglash/)).toBeTruthy()
  })

  it('har bir misol uchun AudioButton mavjud', () => {
    render(<ExamplesSection examples={sampleExamples} />)
    const audioButtons = screen.getAllByRole('button', { name: /audio/ })
    expect(audioButtons).toHaveLength(2)
  })
})
