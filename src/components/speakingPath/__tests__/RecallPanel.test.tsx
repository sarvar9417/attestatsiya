import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

const { mockGradeChunk } = vi.hoisted(() => ({ mockGradeChunk: vi.fn(() => Promise.resolve()) }))

vi.mock('../../../services/speakingPathService', () => ({ gradeChunk: mockGradeChunk }))
vi.mock('../../../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({ speak: vi.fn(), supported: false }),
  SPEED_OPTIONS: [],
}))
vi.mock('../../../hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: () => ({ isSupported: false, isRecording: false, transcript: '', interim: '', start: vi.fn(), stop: vi.fn(), reset: vi.fn() }),
  isMobileDevice: () => false,
}))

import RecallPanel from '../RecallPanel'
import type { SpeakingChunk } from '../../../data/speakingPath/types'

const chunk: SpeakingChunk = { id: 'c1', en: 'Hello there', uz: 'Salom' }

afterEach(() => { cleanup(); vi.clearAllMocks() })
beforeEach(() => { mockGradeChunk.mockClear() })

function typeAnswer(text: string) {
  const input = screen.getByPlaceholderText(/yoki bu yerga yozing/)
  fireEvent.change(input, { target: { value: text } })
  fireEvent.click(screen.getByLabelText('Tekshirish'))
}

describe('RecallPanel', () => {
  it('o\'zbekcha promptni ko\'rsatadi, inglizchasi yashirin', () => {
    render(<RecallPanel chunk={chunk} userId="u1" isLast={false} onDone={vi.fn()} />)
    expect(screen.getByText('Salom')).toBeInTheDocument()
    expect(screen.queryByText('Hello there')).not.toBeInTheDocument()
  })

  it('to\'g\'ri javob → ✅ + javob ochiladi + gradeChunk chaqiriladi', () => {
    render(<RecallPanel chunk={chunk} userId="u1" isLast={false} onDone={vi.fn()} />)
    typeAnswer('Hello there')

    expect(screen.getByText(/To'g'ri/)).toBeInTheDocument()
    expect(screen.getByText('Hello there')).toBeInTheDocument() // javob ochildi
    expect(mockGradeChunk).toHaveBeenCalledWith('u1', 'c1', 'yodladim')
  })

  it('noto\'g\'ri javob → ❌ + gradeChunk past rating bilan', () => {
    render(<RecallPanel chunk={chunk} userId="u1" isLast={false} onDone={vi.fn()} />)
    typeAnswer('completely wrong')

    expect(screen.getByText(/Yana urinib/)).toBeInTheDocument()
    expect(mockGradeChunk).toHaveBeenCalledWith('u1', 'c1', 'bilmadim')
  })

  it('"Keyingi" bosilganda onDone(bestSim) chaqiriladi', () => {
    const onDone = vi.fn()
    render(<RecallPanel chunk={chunk} userId="u1" isLast={false} onDone={onDone} />)
    typeAnswer('Hello there')
    fireEvent.click(screen.getByText(/Keyingi/))
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(onDone.mock.calls[0][0]).toBeCloseTo(1, 5) // to'liq mos → ~1
  })

  it('userId yo\'q bo\'lsa gradeChunk chaqirilmaydi', () => {
    render(<RecallPanel chunk={chunk} isLast={false} onDone={vi.fn()} />)
    typeAnswer('Hello there')
    expect(mockGradeChunk).not.toHaveBeenCalled()
  })
})
