import { describe, expect, it } from 'vitest'
import {
  THEORY_ONLY_LEGACY_TOPIC_CODES,
  isKnownTheoryOnlyLegacyTopic,
  theoryOnlyTopicPreflight,
} from '../theoryOnlyLegacyTopicCodes.js'

describe('theory-only legacy topic preflight', () => {
  it('lists only independently unassessed legacy theory chapters', () => {
    expect(THEORY_ONLY_LEGACY_TOPIC_CODES).toHaveLength(23)
    expect(new Set(THEORY_ONLY_LEGACY_TOPIC_CODES).size).toBe(23)
    for (const code of THEORY_ONLY_LEGACY_TOPIC_CODES) {
      expect(code).toMatch(/^M(?:03|09|10|11|12)\.\d{2}$/)
      expect(isKnownTheoryOnlyLegacyTopic(code)).toBe(true)
    }
  })

  it('does not swallow unrelated unknown topics or published tested chapters', () => {
    for (const code of ['M03.01', 'M03.10', 'M09.01', 'M10.01', 'M11.02', 'M11.03', 'M12.03', 'M15.08', 'M11.99', 'INVALID']) {
      expect(isKnownTheoryOnlyLegacyTopic(code)).toBe(false)
    }
  })

  it('never invents a question pool, duration or keys', () => {
    const result = theoryOnlyTopicPreflight()
    expect(result).toEqual({
      ready: false,
      required: 0,
      available: 0,
      duration_sec: 0,
      reason: 'blueprint_missing',
      coverage: [],
      missing_required_objectives: [],
      critical_objective_gaps: [],
    })
    expect(Object.keys(result)).not.toContain('questions')
    expect(Object.keys(result)).not.toContain('keys')
  })
})
