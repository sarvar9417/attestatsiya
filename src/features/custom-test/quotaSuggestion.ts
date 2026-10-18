export type Difficulty = 1 | 2 | 3 | 4 | 5
export type DifficultyWeights = Partial<Record<Difficulty, number>>

/** Deterministic largest-remainder rounding; never changes the grand total. */
function distribute(total: number, weights: number[]): number[] {
  if (total <= 0 || weights.length === 0) return weights.map(() => 0)
  const denominator = weights.reduce((sum, weight) => sum + weight, 0)
  const effective = denominator > 0 ? weights : weights.map(() => 1)
  const base = effective.reduce((sum, weight) => sum + weight, 0)
  const raw = effective.map(weight => total * weight / base)
  const counts = raw.map(value => Math.floor(value))
  const remainder = total - counts.reduce((sum, value) => sum + value, 0)
  const rank = raw.map((value, i) => ({ i, fract: value - counts[i]! }))
    .sort((a, b) => b.fract - a.fract || a.i - b.i)
  for (let i = 0; i < remainder; i++) counts[rank[i]!.i]! += 1
  return counts
}

/**
 * Equal per-topic quota. Each selected topic receives at least one question.
 * Previously chosen A-E proportions are retained with deterministic rounding.
 */
export function suggestEqualQuotas(total: number, selected: Record<string, DifficultyWeights>) {
  const ids = Object.keys(selected).sort()
  if (!Number.isInteger(total) || total < 1 || total > 100 ||
      ids.length === 0 || ids.length > 30 || total < ids.length) {
    throw new Error('Mavzular sonidan kam savol belgilanmasin (maksimal 100).')
  }
  const perTopic = distribute(total - ids.length, ids.map(() => 1)).map(value => value + 1)
  const result: Record<string, DifficultyWeights> = {}
  ids.forEach((id, i) => {
    const original = selected[id] ?? {}
    const levels = ([1, 2, 3, 4, 5] as const)
      .filter(level => (original[level] ?? 0) > 0)
    const usable = levels.length ? levels : [3 as const]
    const portions = distribute(perTopic[i]!, usable.map(level => original[level] || 1))
    const weights: DifficultyWeights = {}
    usable.forEach((level, j) => {
      if (portions[j]! > 0) weights[level] = portions[j]!
    })
    result[id] = weights
  })
  return result
}
