import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

const { mockSpeak, mockSetSpeed } = vi.hoisted(() => ({
  mockSpeak: vi.fn(),
  mockSetSpeed: vi.fn(),
}))

vi.mock('../../../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({
    speak: mockSpeak,
    playing: false,
    speed: 1,
    setSpeed: mockSetSpeed,
    supported: true,
  }),
  SPEED_OPTIONS: [
    { value: 0.7, label: '0.7×' },
    { value: 0.85, label: '0.85×' },
    { value: 1, label: '1×' },
    { value: 1.15, label: '1.15×' },
    { value: 1.3, label: '1.3×' },
  ],
}))

import ListenStep from '../steps/ListenStep'
import type { SpeakingDay } from '../../../data/speakingPath/types'

const makeDay = (overrides?: Partial<SpeakingDay>): SpeakingDay => ({
  day: 1,
  cefr: 'A0',
  title: 'Salomlashish',
  subtitle: 'Test',
  goalUz: 'Salom berish',
  chunks: [
    { id: 'c1', en: 'Hello', uz: 'Salom' },
    { id: 'c2', en: 'Goodbye', uz: 'Xayr' },
  ],
  scenario: { aiRole: 'stranger', userRole: 'guest', opening: 'Hi', goalUz: 'test' },
  estMinutes: 10,
  ...overrides,
})

afterEach(() => { cleanup(); vi.clearAllMocks() })

describe('ListenStep', () => {
  it('barcha chunk larni en/uz bilan ko\'rsatadi', () => {
    render(<ListenStep day={makeDay()} onNext={vi.fn()} />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Salom')).toBeInTheDocument()
    expect(screen.getByText('Goodbye')).toBeInTheDocument()
    expect(screen.getByText('Xayr')).toBeInTheDocument()
  })

  it('tezlik selektori 5 ta variantni ko\'rsatadi', () => {
    render(<ListenStep day={makeDay()} onNext={vi.fn()} />)
    expect(screen.getByText('0.7×')).toBeInTheDocument()
    expect(screen.getByText('1×')).toBeInTheDocument()
    expect(screen.getByText('1.3×')).toBeInTheDocument()
  })

  it('tezlik tugmasi bosilganda setSpeed chaqiriladi', () => {
    render(<ListenStep day={makeDay()} onNext={vi.fn()} />)
    fireEvent.click(screen.getByText('0.7×'))
    expect(mockSetSpeed).toHaveBeenCalledWith(0.7)
  })

  it('chunk bosilganda speak() chaqiriladi', () => {
    render(<ListenStep day={makeDay()} onNext={vi.fn()} />)
    fireEvent.click(screen.getByText('Hello'))
    expect(mockSpeak).toHaveBeenCalledWith('Hello')
  })

  it('"Tushundim, davom etish" tugmasi bosilganda onNext chaqiriladi', () => {
    const onNext = vi.fn()
    render(<ListenStep day={makeDay()} onNext={onNext} />)
    fireEvent.click(screen.getByText(/Tushundim/))
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
