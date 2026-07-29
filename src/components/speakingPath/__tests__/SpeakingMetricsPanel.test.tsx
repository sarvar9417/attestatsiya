import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SpeakingMetricsPanel from '../SpeakingMetricsPanel'
import type { SpeakingStats } from '../../../services/speakingPathService'

vi.mock('../../../services/pronunciationErrorService', () => ({
  getFrequentErrors: vi.fn().mockResolvedValue([]),
  getDrillSuggestions: vi.fn().mockResolvedValue([]),
  getErrorTrend: vi.fn().mockResolvedValue([]),
}))

const baseStats: SpeakingStats = {
  currentDay: 15,
  totalCompleted: 10,
  dueCount: 3,
  todayMinutes: 8,
  streakDays: 5,
  avgSpeakScore7d: 72,
  avgSpeakScore30d: 65,
  avgMinutesPerDay7d: 4,
  chunksMastered: 24,
  avgChunkStability: 35.2,
}

afterEach(() => { cleanup() })

describe('SpeakingMetricsPanel', () => {
  it('boshlang\'ich holatda yopiq — metrikalar ko\'rinmaydi', () => {
    renderWithRouter(<SpeakingMetricsPanel stats={baseStats} />)
    expect(screen.queryByText(/Talaffuz aniqlik/)).not.toBeInTheDocument()
    expect(screen.queryByText(/O'rtacha gapirish/)).not.toBeInTheDocument()
  })

  it('toggle bosilganda panel ochiladi', () => {
    renderWithRouter(<SpeakingMetricsPanel stats={baseStats} />)
    fireEvent.click(screen.getByText(/Batafsil statistika/))
    expect(screen.getByText(/Talaffuz aniqlik \(7 kun\)/)).toBeInTheDocument()
    expect(screen.getByText(/Streak/)).toBeInTheDocument()
  })

  it('barcha metrikalarni to\'g\'ri ko\'rsatadi', () => {
    renderWithRouter(<SpeakingMetricsPanel stats={baseStats} />)
    fireEvent.click(screen.getByText(/Batafsil statistika/))

    expect(screen.getByText('72%')).toBeInTheDocument()
    expect(screen.getByText('65%')).toBeInTheDocument()
    expect(screen.getByText('4 daqiqa')).toBeInTheDocument()
    expect(screen.getByText('24 ta')).toBeInTheDocument()
    expect(screen.getByText('35.2')).toBeInTheDocument()
    expect(screen.getByText('5 kun')).toBeInTheDocument()
  })

  function renderWithRouter(ui: React.ReactElement) {
    return render(<MemoryRouter>{ui}</MemoryRouter>)
  }

  it('yuqori aniqlik (>=70) emerald rangda', () => {
    const highStats = { ...baseStats, avgSpeakScore7d: 85 }
    renderWithRouter(<SpeakingMetricsPanel stats={highStats} />)
    fireEvent.click(screen.getByText(/Batafsil statistika/))
    const el = screen.getByText('85%')
    expect(el.className).toContain('emerald')
  })

  it('o\'rtacha aniqlik (50-69) amber rangda', () => {
    const midStats = { ...baseStats, avgSpeakScore7d: 55 }
    renderWithRouter(<SpeakingMetricsPanel stats={midStats} />)
    fireEvent.click(screen.getByText(/Batafsil statistika/))
    const el = screen.getByText('55%')
    expect(el.className).toContain('amber')
  })

  it('past aniqlik (<50) rose rangda', () => {
    const lowStats = { ...baseStats, avgSpeakScore7d: 30 }
    renderWithRouter(<SpeakingMetricsPanel stats={lowStats} />)
    fireEvent.click(screen.getByText(/Batafsil statistika/))
    const el = screen.getByText('30%')
    expect(el.className).toContain('rose')
  })

  it('retention >=30 emerald, 15-29 amber, <15 rose', () => {
    renderWithRouter(<SpeakingMetricsPanel stats={baseStats} />) // 35.2 >= 30
    fireEvent.click(screen.getByText(/Batafsil statistika/))
    expect(screen.getByText('35.2').className).toContain('emerald')

    cleanup()
    const midRet = { ...baseStats, avgChunkStability: 20 }
    renderWithRouter(<SpeakingMetricsPanel stats={midRet} />)
    fireEvent.click(screen.getByText(/Batafsil statistika/))
    expect(screen.getByText('20.0').className).toContain('amber')

    cleanup()
    const lowRet = { ...baseStats, avgChunkStability: 10 }
    renderWithRouter(<SpeakingMetricsPanel stats={lowRet} />)
    fireEvent.click(screen.getByText(/Batafsil statistika/))
    expect(screen.getByText('10.0').className).toContain('rose')
  })

  it('showWeeklyGoal berilganda haftalik progress bar ko\'rinadi', () => {
    renderWithRouter(<SpeakingMetricsPanel stats={baseStats} showWeeklyGoal />)
    fireEvent.click(screen.getByText(/Batafsil statistika/))
    expect(screen.getByText(/Haftalik maqsad/)).toBeInTheDocument()
    expect(screen.getByText(/8\/15 daq bugun/)).toBeInTheDocument()
  })

  it('showWeeklyGoal berilmaganda haftalik progress bar ko\'rinmaydi', () => {
    renderWithRouter(<SpeakingMetricsPanel stats={baseStats} />)
    fireEvent.click(screen.getByText(/Batafsil statistika/))
    expect(screen.queryByText(/Haftalik maqsad/)).not.toBeInTheDocument()
  })

  it('toggle qayta bosilganda panel yopiladi', () => {
    renderWithRouter(<SpeakingMetricsPanel stats={baseStats} />)
    fireEvent.click(screen.getByText(/Batafsil statistika/))
    expect(screen.getByText(/Streak/)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/Batafsil statistika/))
    expect(screen.queryByText(/Streak/)).not.toBeInTheDocument()
  })

  it('className prop ishlatiladi', () => {
    const { container } = renderWithRouter(<SpeakingMetricsPanel stats={baseStats} className="mt-4" />)
    expect(container.firstChild).toHaveClass('mt-4')
  })
})
