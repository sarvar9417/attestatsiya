import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import SpeakingLadder from '../SpeakingLadder'
import type { SpeakingDay, SpeakingDayProgress, SpeakingChunk, SpeakingScenario } from '../../../data/speakingPath/types'

const makeScenario = (overrides?: Partial<SpeakingScenario>): SpeakingScenario => ({
  topic: 'meeting someone new',
  aiRole: 'a friendly person',
  userRole: 'a traveler',
  opening: 'Hi there! What is your name?',
  goalUz: 'Salomlashish va tanishish',
  ...overrides,
})

const makeChunk = (id: string, en: string, uz: string, overrides?: Partial<SpeakingChunk>): SpeakingChunk => ({
  id, en, uz, ...overrides,
})

const makeDay = (day: number, cefr: 'A0' | 'A1' | 'A2' | 'B1', overrides?: Partial<SpeakingDay>): SpeakingDay => ({
  day,
  cefr,
  title: cefr === 'A0' ? 'Salomlashish' : 'Test kuni',
  subtitle: 'Test',
  goalUz: `${day}-kun maqsadi`,
  estMinutes: 12,
  chunks: [
    makeChunk(`sp-d${day}-c1`, 'Hello!', 'Salom!', { ipa: '/həˈloʊ/', pattern: 'Hello' }),
    makeChunk(`sp-d${day}-c2`, 'Goodbye!', 'Xayr!'),
  ],
  scenario: makeScenario(),
  ...overrides,
})

// ── 5 ta mock kun: turli CEFR va holatlar ──
const mockDays: SpeakingDay[] = [
  makeDay(1, 'A0', { title: 'Salomlashish' }),
  makeDay(2, 'A0', { title: 'Tanishish' }),
  makeDay(3, 'A0', { title: 'Raqamlar' }),
  makeDay(4, 'A1'),
  makeDay(5, 'A1'),
]

const makeProgress = (day: number, completed: boolean, overrides?: Partial<SpeakingDayProgress>): SpeakingDayProgress => ({
  day,
  completed,
  spokenSeconds: completed ? 120 : 0,
  bestSpeakScore: completed ? 85 : undefined,
  completedAt: completed ? '2026-06-15T10:00:00Z' : undefined,
  ...overrides,
})

const mockProgress: SpeakingDayProgress[] = [
  makeProgress(1, true, { bestSpeakScore: 92, spokenSeconds: 180 }),
  makeProgress(2, true, { bestSpeakScore: 78, spokenSeconds: 150 }),
  makeProgress(3, false),
  makeProgress(4, false),
  makeProgress(5, false),
]

afterEach(() => { cleanup(); vi.restoreAllMocks() })

describe('SpeakingLadder', () => {
  // ── Zona sarlavhalari ──
  it('CEFR zona sarlavhalarini ko\'rsatadi', () => {
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={null}
        onToggle={vi.fn()}
      />
    )
    // Zona nomlari ko'rinadi (getAllByText — A0 har kartada ham bor)
    expect(screen.getAllByText('A0').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("Boshlang'ich")).toBeInTheDocument()
    expect(screen.getByText('Asosiy')).toBeInTheDocument()
  })

  it('zona progressi to\'g\'ri ko\'rsatiladi', () => {
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={null}
        onToggle={vi.fn()}
      />
    )
    // A0: 3 kundan 2 tasi tugatilgan
    expect(screen.getByText('2/3 kun')).toBeInTheDocument()
    // A1: 2 kundan 0 tasi
    expect(screen.getByText('0/2 kun')).toBeInTheDocument()
  })

  it('qulflangan zona "Yopiq" belgisini ko\'rsatadi', () => {
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={null}
        onToggle={vi.fn()}
      />
    )
    // unlockedDay=3, A1 minimum day=4 → A1 zonasi yopiq
    expect(screen.getByText('Yopiq')).toBeInTheDocument()
  })

  // ── Kun kartalari ──
  it('tugatilgan kunlarda ✅ va ball ko\'rsatiladi', () => {
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={null}
        onToggle={vi.fn()}
      />
    )
    // Day 1: 92%, Day 2: 78%
    expect(screen.getByText('92%')).toBeInTheDocument()
    expect(screen.getByText('78%')).toBeInTheDocument()
  })

  it('tugatilgan kunlarda gapirilgan vaqt ko\'rsatiladi', () => {
    const progressWithSecs = [
      makeProgress(1, true, { spokenSeconds: 180 }),
      makeProgress(2, true, { spokenSeconds: 60 }),
      makeProgress(3, false),
      makeProgress(4, false),
      makeProgress(5, false),
    ]
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={progressWithSecs}
        expandedDay={null}
        onToggle={vi.fn()}
      />
    )
    // 180s = 3daq
    expect(screen.getByText('3daq')).toBeInTheDocument()
    // 60s = 1daq
    expect(screen.getByText('1daq')).toBeInTheDocument()
  })

  it('joriy kun (unlocked & tugallanmagan) "HOZIR" belgisini ko\'rsatadi', () => {
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={null}
        onToggle={vi.fn()}
      />
    )
    expect(screen.getByText('HOZIR')).toBeInTheDocument()
  })

  it('qulflangan kunlar (day > unlockedDay) disabled holatda', () => {
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={null}
        onToggle={vi.fn()}
      />
    )
    // Day 4 va 5 qulflangan
    const day4Btn = screen.getByText('4-kun').closest('button')
    const day5Btn = screen.getByText('5-kun').closest('button')
    expect(day4Btn).toBeDisabled()
    expect(day5Btn).toBeDisabled()
  })

  it('qulflangan kunlarda "~N daq" ko\'rinmaydi', () => {
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={null}
        onToggle={vi.fn()}
      />
    )
    // Day 3 ochiq va tugallanmagan → "~12 daq" ko'rinishi kerak
    expect(screen.getByText(/~12 daq/)).toBeInTheDocument()
    // Day 4-5 qulflangan → "~12 daq" faqat 3 uchun
    const daqElements = screen.getAllByText(/~12 daq/)
    expect(daqElements).toHaveLength(1)
  })

  // ── Toggle va detal paneli ──
  it('kun kartasiga bosganda onToggle chaqiriladi', () => {
    const onToggle = vi.fn()
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={null}
        onToggle={onToggle}
      />
    )
    fireEvent.click(screen.getByText('3-kun'))
    expect(onToggle).toHaveBeenCalledWith(3)
  })

  it('qulflangan kunga bosganda onToggle chaqirilmaydi', () => {
    const onToggle = vi.fn()
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={null}
        onToggle={onToggle}
      />
    )
    fireEvent.click(screen.getByText('4-kun'))
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('expandedDay berilganda detal paneli ochiladi', () => {
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={3}
        onToggle={vi.fn()}
      />
    )
    // Detal panelidan maqsad matni
    expect(screen.getByText(/3-kun maqsadi/)).toBeInTheDocument()
    // Bloklar ro'yxati
    expect(screen.getByText('Hello!')).toBeInTheDocument()
    expect(screen.getByText('Salom!')).toBeInTheDocument()
  })

  it('detal panelida IPA va pattern ko\'rsatiladi', () => {
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={3}
        onToggle={vi.fn()}
      />
    )
    expect(screen.getByText('/həˈloʊ/')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument() // pattern
  })

  it('detal panelida stsenariy prevyusi ko\'rsatiladi', () => {
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={3}
        onToggle={vi.fn()}
      />
    )
    expect(screen.getByText(/AI suhbat stsenariysi/)).toBeInTheDocument()
    expect(screen.getByText(/a friendly person/)).toBeInTheDocument()
    expect(screen.getByText(/a traveler/)).toBeInTheDocument()
  })

  it('joriy kunda "Mashg\'ulotni boshlash" tugmasi ko\'rinadi', () => {
    const onStart = vi.fn()
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={3}
        onToggle={vi.fn()}
        onStart={onStart}
      />
    )
    const startBtn = screen.getByText("Mashg'ulotni boshlash")
    expect(startBtn).toBeInTheDocument()
    fireEvent.click(startBtn)
    expect(onStart).toHaveBeenCalledWith(3)
  })

  it('tugallangan kunda "Qayta mashq qilish" tugmasi ko\'rinadi', () => {
    const onStart = vi.fn()
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1, 2])}
        progress={mockProgress}
        expandedDay={1}
        onToggle={vi.fn()}
        onStart={onStart}
      />
    )
    const restartBtn = screen.getByText('Qayta mashq qilish')
    expect(restartBtn).toBeInTheDocument()
    fireEvent.click(restartBtn)
    expect(onStart).toHaveBeenCalledWith(1)
  })

  it('tugallangan kunda ball/spokenSeconds bo\'lmasa badge ko\'rinmaydi', () => {
    const noScoreProgress = [
      makeProgress(1, true, { bestSpeakScore: undefined, spokenSeconds: 0 }),
      makeProgress(2, false),
      makeProgress(3, false),
      makeProgress(4, false),
      makeProgress(5, false),
    ]
    render(
      <SpeakingLadder
        days={mockDays}
        unlockedDay={3}
        completed={new Set([1])}
        progress={noScoreProgress}
        expandedDay={null}
        onToggle={vi.fn()}
      />
    )
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })
})
