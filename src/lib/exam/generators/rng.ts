function hashSeed(seed: string): number {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export class SeededRng {
  private state: number

  constructor(seed: string | number) {
    const value = String(seed)
    this.state = hashSeed(value) || 0x9e3779b9
  }

  next(): number {
    this.state = (Math.imul(this.state, 1664525) + 1013904223) >>> 0
    return this.state / 0x100000000
  }

  int(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
      throw new Error('invalid_rng_range')
    }
    return min + Math.floor(this.next() * (max - min + 1))
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) throw new Error('cannot_pick_empty_array')
    return values[this.int(0, values.length - 1)]
  }

  shuffle<T>(values: readonly T[]): T[] {
    const result = [...values]
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = this.int(0, index)
      ;[result[index], result[target]] = [result[target], result[index]]
    }
    return result
  }
}

export function asSeed(seed: string | number): string {
  return String(seed)
}

export function ensureConstruct(
  requested: string | undefined,
  supported: readonly string[],
  rng: SeededRng,
): string {
  if (requested === undefined) return rng.pick(supported)
  if (!supported.includes(requested)) {
    throw new Error(`unsupported_construct:${requested}`)
  }
  return requested
}

export function uniqueNumbers(
  correct: number,
  candidates: readonly number[],
  count: number,
): number[] {
  const values: number[] = []
  for (const candidate of candidates) {
    if (!Number.isFinite(candidate) || candidate < 0) continue
    if (candidate === correct || values.includes(candidate)) continue
    values.push(candidate)
    if (values.length === count) break
  }
  if (values.length !== count) throw new Error('insufficient_unique_distractors')
  return values
}

export function fingerprint(parts: readonly (string | number)[]): string {
  return parts.map(String).join('|')
}
