import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'

const { mockGradeChunk } = vi.hoisted(() => ({ mockGradeChunk: vi.fn(() => Promise.resolve()) }))

vi.mock('../../../services/speakingPathService', () => ({ gradeChunk: mockGradeChunk }))

vi.mock('../../../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({ speak: vi.fn(), supported: false }),
  SPEED_OPTIONS: [],
}))

vi.mock('../../../hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: () => ({
    isSupported: false,
    isRecording: false,
    transcript: '',
    interim: '',
    start: vi.fn(),
    stop: vi.fn(),
    reset: vi.fn(),
  }),
  isMobileDevice: () => false,
}))

import SpeakStep from '../steps/SpeakStep'
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

describe('SpeakStep', () => {
  it('birinchi chunk ni ko\'rsatadi', () => {
    render(<SpeakStep day={makeDay()} userId="u1" onNext={vi.fn()} />)
    expect(screen.getByText('Buni inglizcha ayting')).toBeInTheDocument()
    expect(screen.getByText('Salom')).toBeInTheDocument()
  })

  it('progress counter to\'g\'ri "1 / 2"', () => {
    render(<SpeakStep day={makeDay()} userId="u1" onNext={vi.fn()} />)
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('to\'g\'ri javobdan keyin "Keyingi" ikkinchi chunk ga o\'tadi', () => {
    const onNext = vi.fn()
    render(<SpeakStep day={makeDay()} userId="u1" onNext={onNext} />)

    const input = screen.getByPlaceholderText(/yoki bu yerga yozing/)
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByLabelText('Tekshirish'))
    fireEvent.click(screen.getByText(/Keyingi/))

    expect(screen.getByText('Xayr')).toBeInTheDocument()
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
    expect(onNext).not.toHaveBeenCalled()
  })

  it('oxirgi chunk da yakunlangach "Suhbatga o\'tish" onNext(avg) ni chaqiradi', async () => {
    const onNext = vi.fn()
    render(<SpeakStep day={makeDay()} userId="u1" onNext={onNext} />)

    // Chunk 1
    const input1 = screen.getByPlaceholderText(/yoki bu yerga yozing/)
    fireEvent.change(input1, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByLabelText('Tekshirish'))
    fireEvent.click(screen.getByText(/Keyingi/))

    // Chunk 2 — last chunk
    const input2 = screen.getByPlaceholderText(/yoki bu yerga yozing/)
    fireEvent.change(input2, { target: { value: 'Goodbye' } })
    fireEvent.click(screen.getByLabelText('Tekshirish'))
    fireEvent.click(screen.getByText(/Yakunlash/))

    // Summary view should appear
    await waitFor(() => expect(screen.getByText(/Mashq yakunlandi/)).toBeInTheDocument())

    // Click "Suhbatga o'tish"
    fireEvent.click(screen.getByText(/Suhbatga o'tish/))

    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onNext.mock.calls[0][0]).toBeGreaterThanOrEqual(99)
  })

  it('userId bo\'lmasa gradeChunk chaqirilmaydi', () => {
    render(<SpeakStep day={makeDay()} onNext={vi.fn()} />)

    const input = screen.getByPlaceholderText(/yoki bu yerga yozing/)
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByLabelText('Tekshirish'))

    expect(mockGradeChunk).not.toHaveBeenCalled()
    expect(screen.getByText(/To'g'ri/)).toBeInTheDocument()
  })
})
