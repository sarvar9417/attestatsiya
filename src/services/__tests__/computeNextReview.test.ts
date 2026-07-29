import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { computeNextReview } from '../vocabularyService'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('computeNextReview', () => {
  it('yodladim advances box by 2', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    const result = computeNextReview(1, 'yodladim')
    expect(result.box).toBe(3)
    expect(result.is_learned).toBe(false)
  })

  it('bildim advances box by 1', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    const result = computeNextReview(2, 'bildim')
    expect(result.box).toBe(3)
    expect(result.is_learned).toBe(false)
  })

  it('qiynaldim keeps same box (min 1)', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    const result = computeNextReview(3, 'qiynaldim')
    expect(result.box).toBe(3)
  })

  it('bilmadim resets to box 1', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    const result = computeNextReview(5, 'bilmadim')
    expect(result.box).toBe(1)
    expect(result.is_learned).toBe(false)
  })

  it('box cannot exceed MAX_BOX (6)', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    const result = computeNextReview(5, 'yodladim')
    expect(result.box).toBe(6)
    expect(result.is_learned).toBe(true)
  })

  it('box 6 with bildim stays at 6 and is_learned', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    const result = computeNextReview(6, 'bildim')
    expect(result.box).toBe(6)
    expect(result.is_learned).toBe(true)
  })

  it('qiynaldim on box 0 returns box 1', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    const result = computeNextReview(0, 'qiynaldim')
    expect(result.box).toBe(1)
  })

  it('returns correct SRS intervals for each box', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))

    const expectations = [
      { box: 1, rating: 'bildim' as const, expectedBox: 2, expectedReview: '2024-06-18' },  // +3 days
      { box: 2, rating: 'bildim' as const, expectedBox: 3, expectedReview: '2024-06-22' },  // +7 days
      { box: 3, rating: 'bildim' as const, expectedBox: 4, expectedReview: '2024-06-29' },  // +14 days
      { box: 4, rating: 'bildim' as const, expectedBox: 5, expectedReview: '2024-07-15' },  // +30 days
      { box: 5, rating: 'bildim' as const, expectedBox: 6, expectedReview: '2024-09-13' },  // +90 days
    ]

    for (const { box, rating, expectedBox, expectedReview } of expectations) {
      const result = computeNextReview(box, rating)
      expect(result.box).toBe(expectedBox)
      expect(result.next_review).toBe(expectedReview)
    }
  })

  it('yodladim jumps from box 1 to 3 with 7-day review', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    const result = computeNextReview(1, 'yodladim')
    expect(result.box).toBe(3)
    expect(result.next_review).toBe('2024-06-22')
  })

  it('bilmadim resets to box 1 with 1-day review', () => {
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'))
    const result = computeNextReview(4, 'bilmadim')
    expect(result.box).toBe(1)
    expect(result.next_review).toBe('2024-06-16')
  })
})
