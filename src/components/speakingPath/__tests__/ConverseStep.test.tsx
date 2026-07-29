import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react'

const { mockStartSpeakingChat, mockGetSpeakingChatFeedback, mockCaptureException } = vi.hoisted(() => ({
  mockStartSpeakingChat: vi.fn(),
  mockGetSpeakingChatFeedback: vi.fn(),
  mockCaptureException: vi.fn(),
}))

vi.mock('../../../lib/claude', () => ({
  startSpeakingChat: mockStartSpeakingChat,
  getSpeakingChatFeedback: mockGetSpeakingChatFeedback,
}))

vi.mock('../../../lib/monitoring', () => ({
  monitoring: { captureException: mockCaptureException },
}))

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

import ConverseStep from '../steps/ConverseStep'
import type { SpeakingDay } from '../../../data/speakingPath/types'

/** Sync mock: calls onDelta + onDone immediately so the AI response is added synchronously */
function mockStreamResponse(fullText: string) {
  mockStartSpeakingChat.mockImplementationOnce(
    (_topic: string, _level: string, _history: unknown[], onDelta: (t: string) => void, onDone: (f: string) => void) => {
      onDelta(fullText)
      onDone(fullText)
    }
  )
}

const makeDay = (overrides?: Partial<SpeakingDay>): SpeakingDay => ({
  day: 1,
  cefr: 'A0',
  title: 'Salomlashish',
  subtitle: 'Test',
  goalUz: 'Salom berish va tanishish',
  chunks: [{ id: 'c1', en: 'Hello', uz: 'Salom' }],
  scenario: {
    aiRole: 'a stranger',
    userRole: 'a traveler',
    opening: 'Hello traveler! Welcome to our city.',
    goalUz: 'Salom berish va tanishish',
  },
  estMinutes: 10,
  ...overrides,
})

async function sendMessage(text: string) {
  const input = screen.getByPlaceholderText(/yoki javobni yozing/)
  fireEvent.change(input, { target: { value: text } })
  fireEvent.click(screen.getByLabelText('Yuborish'))
  await act(async () => {})
}

afterEach(() => { cleanup(); vi.clearAllMocks() })

describe('ConverseStep', () => {
  it('AI opening xabarini ko\'rsatadi', () => {
    // initial useEffect → runAi must have a mock to produce the AI opening
    mockStreamResponse('Hello traveler! Welcome to our city.')
    render(<ConverseStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    expect(screen.getByText('Hello traveler! Welcome to our city.')).toBeInTheDocument()
  })

  it('maqsadni ko\'rsatadi', () => {
    mockStreamResponse('Hello traveler! Welcome to our city.')
    render(<ConverseStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    // goalUz is rendered as "🎯 {day.scenario.goalUz}"
    expect(screen.getByText(/Salom berish va tanishish/)).toBeInTheDocument()
  })

  it('matn yozib yuborish startSpeakingChat ni chaqiradi (initial + user = 2)', async () => {
    mockStreamResponse('Nice to meet you too!')
    render(<ConverseStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    await sendMessage('Hello!')
    // 1st call = initial opening, 2nd call = user message
    expect(mockStartSpeakingChat).toHaveBeenCalledTimes(2)
  })

  it('AI javobi chatda ko\'rinadi', async () => {
    mockStreamResponse('Nice to meet you too!')
    render(<ConverseStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    await sendMessage('Hi!')
    expect(screen.getByText('Nice to meet you too!')).toBeInTheDocument()
  })

  it('MIN_USER_TURNS dan kam bo\'lsa yakunlash tugmasi ko\'rinmaydi', () => {
    mockStreamResponse('Hello traveler!')
    render(<ConverseStep day={makeDay()} level="A1" onNext={vi.fn()} />)
    expect(screen.queryByText(/Suhbatni yakunlash/)).not.toBeInTheDocument()
  })

  it('3+ almashinuvdan keyin "Suhbatni yakunlash" tugmasi chiqadi', async () => {
    // 1st mock — initial opening (consumed by useEffect on mount)
    mockStreamResponse('Hello!')
    render(<ConverseStep day={makeDay()} level="A1" onNext={vi.fn()} />)

    for (let i = 0; i < 3; i++) {
      // each user message triggers a new AI response
      mockStreamResponse('Response!')
      await sendMessage(`m${i}`)
    }

    await waitFor(() => {
      expect(screen.getByText(/Suhbatni yakunlash/)).toBeInTheDocument()
    })
  })

  it('"Suhbatni yakunlash" bosilganda getSpeakingChatFeedback chaqiriladi', async () => {
    mockGetSpeakingChatFeedback.mockResolvedValue('Zo\'r!')
    mockStreamResponse('Hello!')
    render(<ConverseStep day={makeDay()} level="A1" onNext={vi.fn()} />)

    for (let i = 0; i < 3; i++) {
      mockStreamResponse('R')
      await sendMessage(`m${i}`)
    }

    await waitFor(() => expect(screen.getByText(/Suhbatni yakunlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/Suhbatni yakunlash/))

    await waitFor(() => {
      expect(mockGetSpeakingChatFeedback).toHaveBeenCalledTimes(1)
    })
  })

  it('hisobot ekranida feedback matni ko\'rinadi', async () => {
    mockGetSpeakingChatFeedback.mockResolvedValue('Fluency 7/10. Zo\'r suhbat!')
    mockStreamResponse('Hello!')
    render(<ConverseStep day={makeDay()} level="A1" onNext={vi.fn()} />)

    for (let i = 0; i < 3; i++) {
      mockStreamResponse('R')
      await sendMessage(`m${i}`)
    }

    await waitFor(() => expect(screen.getByText(/Suhbatni yakunlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/Suhbatni yakunlash/))

    await waitFor(() => {
      expect(screen.getByText(/tugadi/)).toBeInTheDocument()
    })
    expect(screen.getByText(/Zo'r suhbat/)).toBeInTheDocument()
  })

  it('hisobotdan keyin "Kunni yakunlash" onNext ni chaqiradi', async () => {
    mockGetSpeakingChatFeedback.mockResolvedValue('Zo\'r!')
    mockStreamResponse('Hello!')
    const onNext = vi.fn()
    render(<ConverseStep day={makeDay()} level="A1" onNext={onNext} />)

    for (let i = 0; i < 3; i++) {
      mockStreamResponse('R')
      await sendMessage(`m${i}`)
    }

    await waitFor(() => expect(screen.getByText(/Suhbatni yakunlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/Suhbatni yakunlash/))
    await waitFor(() => expect(screen.getByText(/tugadi/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/Kunni yakunlash/))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('getSpeakingChatFeedback xato bersa fallback report ko\'rinadi', async () => {
    mockGetSpeakingChatFeedback.mockRejectedValueOnce(new Error('Report error'))
    mockStreamResponse('Hello!')
    render(<ConverseStep day={makeDay()} level="A1" onNext={vi.fn()} />)

    for (let i = 0; i < 3; i++) {
      mockStreamResponse('R')
      await sendMessage(`m${i}`)
    }

    await waitFor(() => expect(screen.getByText(/Suhbatni yakunlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/Suhbatni yakunlash/))
    await waitFor(() => expect(screen.getByText(/tugadi/)).toBeInTheDocument())
    expect(screen.getByText(/Ajoyib mashq/)).toBeInTheDocument()
  })
})
