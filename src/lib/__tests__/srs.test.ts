import { describe, it, expect } from 'vitest'
import {
  initStability,
  initDifficulty,
  retrievability,
  nextInterval,
  nextStabilitySuccess,
  nextStabilityFail,
  nextDifficulty,
  computeNextReviewFSRS,
  createDefaultFSRSState,
  ratingToGrade,
  type Grade,
} from '../srs'

describe('ratingToGrade', () => {
  it('maps bilmadim → 1', () => expect(ratingToGrade('bilmadim')).toBe(1))
  it('maps qiynaldim → 2', () => expect(ratingToGrade('qiynaldim')).toBe(2))
  it('maps bildim → 3', () => expect(ratingToGrade('bildim')).toBe(3))
  it('maps yodladim → 4', () => expect(ratingToGrade('yodladim')).toBe(4))
  it('defaults unknown to 3', () => expect(ratingToGrade('nimanidir')).toBe(3))
})

describe('initStability', () => {
  it('initStability(1) > 0.1', () => {
    const s = initStability(1)
    expect(s).toBeGreaterThanOrEqual(0.1)
    expect(s).toBeLessThan(3)
  })

  it('initStability(4) >= initStability(1)', () => {
    const s1 = initStability(1)
    const s4 = initStability(4)
    expect(s4).toBeGreaterThanOrEqual(s1)
  })

  it('returns higher values for better grades', () => {
    const grades: Grade[] = [1, 2, 3, 4]
    const values = grades.map(g => initStability(g))
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1])
    }
  })
})

describe('initDifficulty', () => {
  it('returns value between 1 and 10', () => {
    for (const g of [1, 2, 3, 4] as Grade[]) {
      const d = initDifficulty(g)
      expect(d).toBeGreaterThanOrEqual(1)
      expect(d).toBeLessThanOrEqual(10)
    }
  })

  it('higher grade → lower difficulty', () => {
    const d1 = initDifficulty(1)
    const d4 = initDifficulty(4)
    expect(d4).toBeLessThan(d1)
  })
})

describe('retrievability', () => {
  it('R = 1 when t = 0', () => {
    expect(retrievability(0, 10)).toBe(1)
  })

  it('R decreases as elapsed days increase', () => {
    const r1 = retrievability(1, 10)
    const r30 = retrievability(30, 10)
    expect(r30).toBeLessThan(r1)
  })

  it('R increases with higher stability', () => {
    const rLow = retrievability(10, 5)
    const rHigh = retrievability(10, 50)
    expect(rHigh).toBeGreaterThan(rLow)
  })

  it('returns 0 when stability is 0', () => {
    expect(retrievability(10, 0)).toBe(0)
  })

  it('R ≈ 0.9 when t = S', () => {
    const R = retrievability(10, 10)
    expect(R).toBeCloseTo(0.9, 1)
  })
})

describe('nextInterval', () => {
  it('returns at least 1 day', () => {
    expect(nextInterval(0.01)).toBeGreaterThanOrEqual(1)
  })

  it('higher stability → longer interval', () => {
    const i1 = nextInterval(10)
    const i2 = nextInterval(100)
    expect(i2).toBeGreaterThan(i1)
  })

  it('with default retention (0.9): I ≈ 9*S*(1/0.9 - 1)', () => {
    const I = nextInterval(10)
    const raw = 9 * 10 * (1 / 0.9 - 1)
    expect(I).toBeCloseTo(raw, 0)  // rounding allowed
    expect(I).toBe(10)  // 9*10*(1/0.9 - 1) = 10 exactly
  })
})

describe('nextStabilitySuccess', () => {
  it('Hard (grade 2) returns stability * w[12] multiplier', () => {
    const s = nextStabilitySuccess(10, 5, 0.9, 2)
    expect(s).toBeLessThan(10) // Hard should return lower stability
  })

  it('Good (grade 3) increases stability', () => {
    const s = nextStabilitySuccess(10, 5, 0.9, 3)
    expect(s).toBeGreaterThan(10)
  })

  it('Easy (grade 4) gives higher stability than Good', () => {
    const s3 = nextStabilitySuccess(10, 5, 0.9, 3)
    const s4 = nextStabilitySuccess(10, 5, 0.9, 4)
    expect(s4).toBeGreaterThanOrEqual(s3)
  })
})

describe('nextStabilityFail', () => {
  it('returns low stability on fail', () => {
    const s = nextStabilityFail(10, 5, 0.8)
    expect(s).toBeLessThan(5)
    expect(s).toBeGreaterThanOrEqual(0.1)
  })
})

describe('nextDifficulty', () => {
  it('Again (grade 1) increases difficulty', () => {
    const d = nextDifficulty(5, 1)
    expect(d).toBeGreaterThan(5)
  })

  it('Easy (grade 4) decreases difficulty', () => {
    const d = nextDifficulty(5, 4)
    expect(d).toBeLessThan(5)
  })

  it('clamps to [1, 10]', () => {
    const dLow = nextDifficulty(1, 4)
    const dHigh = nextDifficulty(10, 1)
    expect(dLow).toBeGreaterThanOrEqual(1)
    expect(dHigh).toBeLessThanOrEqual(10)
  })
})

describe('computeNextReviewFSRS', () => {
  const defaultState = createDefaultFSRSState()

  it('handles first review with bildim (Again)', () => {
    const { state, intervalDays } = computeNextReviewFSRS(defaultState, 'bilmadim')
    expect(state.reps).toBe(1)
    expect(state.lapses).toBe(1)
    expect(state.stability).toBeGreaterThanOrEqual(0.1)
    expect(intervalDays).toBeGreaterThanOrEqual(1)
    expect(state.due).toBeDefined()
  })

  it('handles first review with yodladim (Easy)', () => {
    const { state } = computeNextReviewFSRS(defaultState, 'yodladim')
    expect(state.reps).toBe(1)
    expect(state.lapses).toBe(0)
    expect(state.stability).toBeGreaterThan(0.1)
  })

  it('second review with Good increases stability', () => {
    const first = computeNextReviewFSRS(defaultState, 'bildim')
    const second = computeNextReviewFSRS(first.state, 'bildim')
    expect(second.state.stability).toBeGreaterThan(first.state.stability)
  })

  it('fail after success decreases stability', () => {
    const first = computeNextReviewFSRS(defaultState, 'yodladim')
    const second = computeNextReviewFSRS(first.state, 'bilmadim')
    expect(second.state.stability).toBeLessThan(first.state.stability)
    expect(second.state.lapses).toBe(1)
  })

  it('multiple correct reviews increase stability over time', () => {
    let state = defaultState
    const stabilities: number[] = []

    for (let i = 0; i < 5; i++) {
      const result = computeNextReviewFSRS(state, 'bildim')
      state = result.state
      stabilities.push(state.stability)
    }

    // Each subsequent stability should be higher
    for (let i = 1; i < stabilities.length; i++) {
      expect(stabilities[i]).toBeGreaterThan(stabilities[i - 1])
    }
  })

  it('produces reasonable intervals (increasing with stability)', () => {
    let state = defaultState
    const intervals: number[] = []

    for (let i = 0; i < 4; i++) {
      const result = computeNextReviewFSRS(state, 'bildim')
      state = result.state
      intervals.push(result.intervalDays)
    }

    // Intervals should generally increase with stability
    // Since "Good" consistently increases stability
    expect(intervals[intervals.length - 1]).toBeGreaterThanOrEqual(intervals[0])
  })
})

describe('end-to-end FSRS flow', () => {
  it('simulates realistic learning scenario', () => {
    let state = createDefaultFSRSState()

    // User learns word for first time (Easy recall)
    const r1 = computeNextReviewFSRS(state, 'bildim')
    state = r1.state
    expect(state.stability).toBeGreaterThan(1)
    expect(state.reps).toBe(1)

    // First review (after interval) - still remembers (Good)
    const r2 = computeNextReviewFSRS(state, 'bildim')
    state = r2.state
    expect(state.stability).toBeGreaterThan(r1.state.stability)
    expect(state.reps).toBe(2)

    // Second review - strong recall (Easy)
    const r3 = computeNextReviewFSRS(state, 'yodladim')
    state = r3.state
    expect(state.stability).toBeGreaterThan(r2.state.stability)

    // Third review - forgot (Again)
    const r4 = computeNextReviewFSRS(state, 'bilmadim')
    state = r4.state
    expect(state.stability).toBeLessThan(r3.state.stability)
    expect(state.lapses).toBe(1)

    // After failure, review again (Good) - should recover somewhat
    const r5 = computeNextReviewFSRS(state, 'bildim')
    state = r5.state
    expect(state.stability).toBeGreaterThan(r4.state.stability)
    expect(state.reps).toBe(5)

    // All values within reasonable bounds
    expect(state.difficulty).toBeGreaterThanOrEqual(1)
    expect(state.difficulty).toBeLessThanOrEqual(10)
    expect(state.due).toBeDefined()
  })
})
