import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTodayTashkent, addDaysTashkent } from '../tashkentDate'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('getTodayTashkent', () => {
  it('returns YYYY-MM-DD format', () => {
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'))
    const result = getTodayTashkent()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns correct Tashkent date (UTC+5)', () => {
    // 2024-06-15 18:59 UTC → Tashkent 2024-06-15 23:59
    vi.setSystemTime(new Date('2024-06-15T18:59:00Z'))
    expect(getTodayTashkent()).toBe('2024-06-15')

    // 2024-06-15 19:00 UTC → Tashkent 2024-06-16 00:00
    vi.setSystemTime(new Date('2024-06-15T19:00:00Z'))
    expect(getTodayTashkent()).toBe('2024-06-16')
  })

  it('handles month boundary', () => {
    vi.setSystemTime(new Date('2024-01-31T19:00:00Z')) // Tashkent Feb 1
    expect(getTodayTashkent()).toBe('2024-02-01')
  })

  it('handles year boundary', () => {
    vi.setSystemTime(new Date('2024-12-31T19:00:00Z')) // Tashkent 2025-01-01
    expect(getTodayTashkent()).toBe('2025-01-01')
  })
})

describe('addDaysTashkent', () => {
  it('returns same day for 0 days', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    expect(addDaysTashkent(0)).toBe('2024-06-15')
  })

  it('adds positive days', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    expect(addDaysTashkent(1)).toBe('2024-06-16')
    expect(addDaysTashkent(30)).toBe('2024-07-15')
  })

  it('handles negative days (subtract)', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    expect(addDaysTashkent(-1)).toBe('2024-06-14')
  })

  it('works with SRS intervals', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    expect(addDaysTashkent(1)).toBe('2024-06-16')
    expect(addDaysTashkent(3)).toBe('2024-06-18')
    expect(addDaysTashkent(7)).toBe('2024-06-22')
    expect(addDaysTashkent(14)).toBe('2024-06-29')
    expect(addDaysTashkent(30)).toBe('2024-07-15')
    expect(addDaysTashkent(90)).toBe('2024-09-13')
  })
})
