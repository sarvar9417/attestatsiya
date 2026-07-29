import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import type { SpeakingDay } from '../../../data/speakingPath/types'

// ── Mock service funksiyalari ──
const { mockSaveProgress, mockEnrollChunks } = vi.hoisted(() => ({
  mockSaveProgress: vi.fn(() => Promise.resolve()),
  mockEnrollChunks: vi.fn(() => Promise.resolve()),
}))

vi.mock('../../../services/speakingPathService', () => ({
  saveSpeakingDayProgress: mockSaveProgress,
  enrollChunks: mockEnrollChunks,
  loadSrsMap: vi.fn(() => Promise.resolve({})),
  computeSRSDistribution: vi.fn(() => []),
}))

// ── Mock step komponentlari ──
const capturedLevel = { current: '' }

vi.mock('../steps/ListenStep', () => ({
  default: ({ onNext }: { onNext: () => void }) => (
    <div data-testid="listen-step">
      <button data-testid="mock-listen-next" onClick={onNext}>Listen → Shadow</button>
    </div>
  ),
}))

vi.mock('../steps/ShadowStep', () => ({
  default: ({ level, onNext }: { level: string; onNext: () => void }) => {
    capturedLevel.current = level
    return (
      <div data-testid="shadow-step">
        <button data-testid="mock-shadow-next" onClick={onNext}>Shadow → Speak</button>
      </div>
    )
  },
}))

vi.mock('../steps/SpeakStep', () => ({
  default: ({ onNext }: { onNext: (avg: number) => void }) => (
    <div data-testid="speak-step">
      <button data-testid="mock-speak-next" onClick={() => onNext(85)}>Speak → Converse</button>
    </div>
  ),
}))

vi.mock('../steps/ConverseStep', () => ({
  default: ({ level, onNext }: { level: string; onNext: () => void }) => {
    capturedLevel.current = level
    return (
      <div data-testid="converse-step">
        <button data-testid="mock-converse-next" onClick={onNext}>Converse → Cooldown</button>
      </div>
    )
  },
}))

vi.mock('../steps/CooldownStep', () => ({
  default: ({ onNext }: { onNext: () => void }) => (
    <div data-testid="cooldown-step">
      <button data-testid="mock-cooldown-next" onClick={onNext}>Cooldown → Done</button>
    </div>
  ),
}))

vi.mock('../steps/WarmupStep', () => ({
  default: ({ onNext }: { onNext: () => void }) => (
    <div data-testid="warmup-step">
      <button data-testid="mock-warmup-next" onClick={onNext}>Warmup → Vocab</button>
    </div>
  ),
}))

vi.mock('../steps/VocabStep', () => ({
  default: ({ onNext }: { onNext: () => void }) => (
    <div data-testid="vocab-step">
      <button data-testid="mock-vocab-next" onClick={onNext}>Vocab → Grammar</button>
    </div>
  ),
}))

vi.mock('../steps/GrammarStep', () => ({
  default: ({ onNext }: { onNext: () => void }) => (
    <div data-testid="grammar-step">
      <button data-testid="mock-grammar-next" onClick={onNext}>Grammar → Listen</button>
    </div>
  ),
}))

import SpeakingDaySession from '../SpeakingDaySession'

const makeDay = (overrides?: Partial<SpeakingDay>): SpeakingDay => ({
  day: 3,
  cefr: 'A0',
  title: 'Raqamlar va yosh',
  subtitle: 'Test',
  goalUz: 'Yoshingizni ayta olasiz',
  chunks: [
    { id: 'sp-d3-c1', en: 'I am twenty', uz: 'Men yigirmaman' },
    { id: 'sp-d3-c2', en: 'How old', uz: 'Necha yosh' },
  ],
  scenario: { topic: 'age', aiRole: 'friend', userRole: 'you', opening: 'How old?', goalUz: 'test' },
  estMinutes: 12,
  ...overrides,
})

// Yordamchi: warmup'dan cooldown gacha tez o'tish
function goToCooldown() {
  fireEvent.click(screen.getByTestId('mock-warmup-next'))
  fireEvent.click(screen.getByTestId('mock-vocab-next'))
  fireEvent.click(screen.getByTestId('mock-grammar-next'))
  fireEvent.click(screen.getByTestId('mock-listen-next'))
  fireEvent.click(screen.getByTestId('mock-shadow-next'))
  fireEvent.click(screen.getByTestId('mock-speak-next'))
  fireEvent.click(screen.getByTestId('mock-converse-next'))
}

// Yordamchi: to'liq sessiyani yakunlash (cooldown → done)
function completeSession() {
  goToCooldown()
  fireEvent.click(screen.getByTestId('mock-cooldown-next'))
}

afterEach(() => { cleanup(); vi.clearAllMocks() })
beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })

describe('SpeakingDaySession', () => {
  it('header bilan day ma\'lumotlarini ko\'rsatadi', () => {
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={vi.fn()} />)
    expect(screen.getByText(/3-kun/)).toBeInTheDocument()
    expect(screen.getByText(/Raqamlar va yosh/)).toBeInTheDocument()
    expect(screen.getByText(/Yoshingizni ayta olasiz/)).toBeInTheDocument()
  })

  it('boshlang\'ich holatda WarmupStep ko\'rinadi, progress bar 8 qadam', () => {
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={vi.fn()} />)
    expect(screen.getByTestId('warmup-step')).toBeInTheDocument()
    expect(screen.getByTestId('mock-warmup-next')).toBeInTheDocument()
    // 8 qadam label (review yo'q)
    expect(screen.getByText('Kirish')).toBeInTheDocument()
    expect(screen.getByText("Lug'at")).toBeInTheDocument()
    expect(screen.getByText('Grammatika')).toBeInTheDocument()
    expect(screen.getByText('Eshit')).toBeInTheDocument()
    expect(screen.getByText('Shadow')).toBeInTheDocument()
    expect(screen.getByText('Gapir')).toBeInTheDocument()
    expect(screen.getByText('Suhbat')).toBeInTheDocument()
    expect(screen.getByText('Mulohaza')).toBeInTheDocument()
  })

  it('Warmup → Vocab → Grammar → Listen → Shadow → Speak → Converse ketma-ketlikda o\'tadi', () => {
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={vi.fn()} />)

    fireEvent.click(screen.getByTestId('mock-warmup-next'))
    expect(screen.getByTestId('vocab-step')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('mock-vocab-next'))
    expect(screen.getByTestId('grammar-step')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('mock-grammar-next'))
    expect(screen.getByTestId('listen-step')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('mock-listen-next'))
    expect(screen.getByTestId('shadow-step')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('mock-shadow-next'))
    expect(screen.getByTestId('speak-step')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('mock-speak-next'))
    expect(screen.getByTestId('converse-step')).toBeInTheDocument()
  })

  it('Converse → Cooldown → Done ketma-ketlikda o\'tadi', () => {
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={vi.fn()} />)

    goToCooldown()
    expect(screen.getByTestId('cooldown-step')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('mock-cooldown-next'))
    expect(screen.getByText(/3-kun yakunlandi/)).toBeInTheDocument()
    expect(screen.getByText(/85%/)).toBeInTheDocument()
  })

  it('done ekranida "Narvonga qaytish" tugmasi onExit ni chaqiradi', () => {
    const onExit = vi.fn()
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={onExit} />)

    completeSession()

    fireEvent.click(screen.getByText('Narvonga qaytish'))
    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('userId bilan tugaganda saveSpeakingDayProgress va enrollChunks chaqiriladi', () => {
    render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={vi.fn()} />)

    completeSession()

    expect(mockSaveProgress).toHaveBeenCalledWith('u1', expect.objectContaining({
      day: 3,
      completed: true,
      bestSpeakScore: 85,
    }))
    expect(mockEnrollChunks).toHaveBeenCalledWith('u1', ['sp-d3-c1', 'sp-d3-c2'])
  })

  it('userId yo\'q bo\'lsa save/enroll chaqirilmaydi', () => {
    render(<SpeakingDaySession day={makeDay()} onExit={vi.fn()} />)

    completeSession()

    expect(mockSaveProgress).not.toHaveBeenCalled()
    expect(mockEnrollChunks).not.toHaveBeenCalled()
  })

  it('X tugmasi onExit ni chaqiradi', () => {
    const onExit = vi.fn()
    const { container } = render(<SpeakingDaySession day={makeDay()} userId="u1" onExit={onExit} />)
    const xButton = container.querySelector('button')
    expect(xButton).not.toBeNull()
    fireEvent.click(xButton!)
    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('A0 level → level="A1" sifatida uzatiladi', () => {
    render(<SpeakingDaySession day={makeDay({ cefr: 'A0' })} userId="u1" onExit={vi.fn()} />)
    fireEvent.click(screen.getByTestId('mock-warmup-next')) // warmup → vocab
    fireEvent.click(screen.getByTestId('mock-vocab-next')) // vocab → grammar
    fireEvent.click(screen.getByTestId('mock-grammar-next')) // grammar → listen
    fireEvent.click(screen.getByTestId('mock-listen-next')) // listen → shadow, level saqlanadi
    expect(capturedLevel.current).toBe('A1')
  })
})
