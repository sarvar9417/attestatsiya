import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RetentionBar } from '../RetentionBar'

// SRS_INTERVALS = [1, 3, 7, 14, 30, 90]
// retention = 100 * exp(-daysSinceReview / interval)
// daysSinceReview = (now - nextReview + interval * 86400000) / 86400000

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T00:00:00.000Z'))  // midnight UTC
})

afterEach(() => {
  vi.useRealTimers()
})

describe('RetentionBar', () => {
  // ── Box 1 (interval = 1 day) ──────────────────────────────────────────────

  it('shows 100% retention when nextReview is tomorrow (freshly reviewed)', () => {
    // nextReview = today + 1 day → daysSinceReview = 0 → 100%
    render(<RetentionBar box={1} nextReview="2026-06-16" />)
    expect(screen.getByText((content) => content.includes('100%'))).toBeInTheDocument()
  })

  it('shows ~37% retention on the due date (1 interval since review)', () => {
    // nextReview = today (due today) → daysSinceReview = 1 → 100*exp(-1) ≈ 37%
    render(<RetentionBar box={1} nextReview="2026-06-15" />)
    expect(screen.getByText((content) => content.includes('37%'))).toBeInTheDocument()
  })

  it('shows green color for retention >= 80%', () => {
    // Box 90 → interval defaults to 1, nextReview tomorrow → daysSinceReview ≈ 0 → 100% → green
    render(<RetentionBar box={90} nextReview="2026-06-16" />)
    const el = screen.getByText((content) => content.includes('100%'))
    expect(el.className).toMatch(/text-green-/)
  })

  it('shows yellow color for 50% <= retention < 80%', () => {
    // Box 3 (interval=7), nextReview = 2026-06-18 (3 days from now)
    // daysSinceReview = (now - June 18 + 7) / 1 = -3 + 7 = 4
    // retention = 100 * exp(-4/7) ≈ 56.5 → round to 56 → yellow
    render(<RetentionBar box={3} nextReview="2026-06-18" />)
    const el = screen.getByText((content) => content.includes('56%'))
    expect(el).toBeInTheDocument()
    expect(el.className).toMatch(/text-yellow-/)
  })

  it('shows red color for retention < 50%', () => {
    // Box 1 (interval=1), nextReview = 2026-06-14 (1 day overdue)
    // daysSinceReview = (now - June 14 + 1) / 1 = 1 + 1 = 2
    // retention = 100 * exp(-2/1) ≈ 13.5 → 14% → red
    render(<RetentionBar box={1} nextReview="2026-06-14" />)
    const el = screen.getByText((content) => content.includes('14%'))
    expect(el).toBeInTheDocument()
    expect(el.className).toMatch(/text-red-/)
  })

  // ── Box ranges ────────────────────────────────────────────────────────────

  it('renders with minimum 10% retention (never goes to 0)', () => {
    // Box 1, 10 days overdue: daysSinceReview = 10 + 1 = 11 → 100*exp(-11) ≈ 0 → clamped to 10%
    render(<RetentionBar box={1} nextReview="2026-06-05" />)
    expect(screen.getByText((content) => content.includes('10%'))).toBeInTheDocument()
  })

  it('handles box=0 gracefully (defaults interval to 1)', () => {
    render(<RetentionBar box={0} nextReview="2026-06-16" />)
    expect(screen.getByText((content) => content.includes('100%'))).toBeInTheDocument()
  })

  it('handles box=7 gracefully (beyond array bounds, defaults to 1)', () => {
    render(<RetentionBar box={7} nextReview="2026-06-16" />)
    expect(screen.getByText((content) => content.includes('100%'))).toBeInTheDocument()
  })

  it('renders progress bar div with correct width', () => {
    const { container } = render(<RetentionBar box={1} nextReview="2026-06-15" />)
    const innerBar = container.querySelector('[style]')
    expect(innerBar).toBeInTheDocument()
    expect(innerBar!.getAttribute('style')).toContain('width: 37%')
  })

  // ── Tooltip ───────────────────────────────────────────────────────────────

  it('renders title attribute with retention, box, and interval info', () => {
    render(<RetentionBar box={2} nextReview="2026-06-16" />)
    // Box 2 → interval = 3, nextReview = tomorrow (June 16)
    // daysSinceReview = (June 15 - June 16 + 3) / 1 = 2
    // retention = 100 * exp(-2/3) = 51.3 → round to 51%
    const container = screen.getByTitle(/Esda qolish/)
    expect(container.title).toContain('51%')
    expect(container.title).toContain('Box 2')
    expect(container.title).toContain('3 kun')
  })

  // ── Future / past dates ──────────────────────────────────────────────────

  it('shows 100% for nextReview far in the future', () => {
    render(<RetentionBar box={1} nextReview="2026-07-15" />)
    expect(screen.getByText((content) => content.includes('100%'))).toBeInTheDocument()
  })

  it('shows 10% for nextReview far in the past', () => {
    render(<RetentionBar box={1} nextReview="2026-05-16" />)
    expect(screen.getByText((content) => content.includes('10%'))).toBeInTheDocument()
  })
})
