/**
 * Source-backed local theory chapters with NO independently approved published
 * topic-test edition as of 2026-10-23. Do not alias their tests to a larger
 * or unrelated published pool simply to suppress a 404.
 *
 * This list describes the static, locally available theory; it is NOT a new
 * exam question pool and never authorizes exam generation.
 */
export const THEORY_ONLY_LEGACY_TOPIC_CODES = [
  'M03.07', 'M03.09',
  'M09.02', 'M09.04', 'M09.05', 'M09.06',
  'M10.03', 'M10.04', 'M10.05', 'M10.06', 'M10.07',
  'M11.01', 'M11.04', 'M11.05', 'M11.06', 'M11.07',
  'M12.01', 'M12.02', 'M12.04', 'M12.06',
  'M12.07', 'M12.08', 'M12.09',
] as const

const theoryOnlySet: ReadonlySet<string> = new Set(THEORY_ONLY_LEGACY_TOPIC_CODES)

export function isKnownTheoryOnlyLegacyTopic(code: string): boolean {
  return theoryOnlySet.has(code.toUpperCase())
}

/** Truthful, non-exam response for static theory without a published test pool. */
export function theoryOnlyTopicPreflight() {
  return {
    ready: false,
    required: 0,
    available: 0,
    duration_sec: 0,
    reason: 'blueprint_missing' as const,
    coverage: [],
    missing_required_objectives: [],
    critical_objective_gaps: [],
  }
}
