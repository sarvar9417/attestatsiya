// ═══════════════════════════════════════════════════════════════════════════
// SpeakingDuelPlayer.test.tsx — Speaking duel komponenti testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

const { mockUseSR, mockStart } = vi.hoisted(() => ({ mockUseSR: vi.fn(), mockStart: vi.fn() }))

vi.mock('../../../hooks/useSpeechRecognition', () => ({ useSpeechRecognition: mockUseSR }))
vi.mock('../../../services/tandemService', () => ({ submitSpeakingDuelAnswer: vi.fn() }))
vi.mock('../../../utils/toastStore', () => ({ useToastStore: { getState: () => ({ toast: vi.fn() }) } }))

import SpeakingDuelPlayer from '../SpeakingDuelPlayer'
import type { Duel, DuelQuestion } from '../../../types/tandem'

const duel = { id: 'd1', mode: 'speaking' } as Duel
const question: DuelQuestion = {
  id: 0, english: 'Describe your weekend', options: [], correct: 0,
  passage: 'Use past tense\nMention activities',
}

function srState(over: Record<string, unknown> = {}) {
  return { isSupported: true, transcript: '', interim: '', start: mockStart, stop: vi.fn(), reset: vi.fn(), ...over }
}

beforeEach(() => {
  vi.useFakeTimers()
  mockUseSR.mockReturnValue(srState())
})
afterEach(() => { cleanup(); vi.useRealTimers(); vi.clearAllMocks() })

describe('SpeakingDuelPlayer', () => {
  it('shows unsupported message when speech recognition unavailable', () => {
    mockUseSR.mockReturnValue(srState({ isSupported: false }))
    render(<SpeakingDuelPlayer duel={duel} question={question} onComplete={vi.fn()} />)
    expect(screen.getByText(/Brauzer qo'llab-quvvatlamaydi/)).toBeInTheDocument()
  })

  it('renders the prompt and tips in prepare stage', () => {
    render(<SpeakingDuelPlayer duel={duel} question={question} onComplete={vi.fn()} />)
    expect(screen.getByText('Describe your weekend')).toBeInTheDocument()
    expect(screen.getByText('Yozishni boshlash')).toBeInTheDocument()
    // passage → tips
    expect(screen.getByText('• Use past tense')).toBeInTheDocument()
    expect(screen.getByText('• Mention activities')).toBeInTheDocument()
  })

  it('starts recording when "Yozishni boshlash" clicked', () => {
    render(<SpeakingDuelPlayer duel={duel} question={question} onComplete={vi.fn()} />)
    fireEvent.click(screen.getByText('Yozishni boshlash'))
    expect(mockStart).toHaveBeenCalled()
    expect(screen.getByText(/Yozilmoqda/)).toBeInTheDocument() // recording stage
  })

  it('renders without tips when question has no passage', () => {
    render(<SpeakingDuelPlayer duel={duel} question={{ ...question, passage: undefined }} onComplete={vi.fn()} />)
    expect(screen.getByText('Describe your weekend')).toBeInTheDocument()
    expect(screen.queryByText(/Maslahatlar/)).not.toBeInTheDocument()
  })
})
