import { customExamConfigSchema, type CustomExamConfig } from '../schemas/custom-exam.js'

export interface CustomExamSlot {
  lesson_id: string
  difficulty: number
  count: number
}

/**
 * Converts a validated user request into exact (lesson, difficulty) quotas.
 * NO randomizing or database mutations take place in this layer.
 * Every slot must later be fulfilled by eligible published questions; if even
 * one fails, the server must reject the whole exam without a partial attempt.
 */
export function buildCustomExamPlan(input: unknown): {
  config: CustomExamConfig
  slots: CustomExamSlot[]
} {
  const config = customExamConfigSchema.parse(input)
  const slots = config.topics.flatMap(topic =>
    topic.difficulty_counts.map(level => ({
      lesson_id: topic.lesson_id,
      difficulty: level.difficulty,
      count: level.count,
    }))
  )

  return { config, slots }
}

export interface DifficultyWeight {
  difficulty: 1 | 2 | 3 | 4 | 5
  percentage: number
}

/**
 * Largest-remainder allocation avoids rounding drift, and ties always resolve
 * towards the lower numbered difficulty. No hidden change to total_count.
 */
export function allocateDifficultyCounts(
  count: number,
  weights: DifficultyWeight[]
): { difficulty: DifficultyWeight['difficulty']; count: number }[] {
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    throw new RangeError('Savollar soni 1–100 oralig‘ida bo‘lishi kerak')
  }
  if (!weights.length || weights.length > 5 || new Set(weights.map(x => x.difficulty)).size !== weights.length ||
      weights.some(x => !Number.isInteger(x.difficulty) || x.difficulty < 1 || x.difficulty > 5 ||
        !Number.isInteger(x.percentage) || x.percentage < 0 || x.percentage > 100) ||
      weights.reduce((sum, x) => sum + x.percentage, 0) !== 100) {
    throw new RangeError('Qiyinchilik foizlari noyob va yig‘indisi 100 bo‘lishi kerak')
  }

  const quotas = weights.map(weight => {
    const exact = count * weight.percentage / 100
    return {
      difficulty: weight.difficulty,
      count: Math.floor(exact),
      remainder: exact - Math.floor(exact),
    }
  })
  const remaining = count - quotas.reduce((sum, x) => sum + x.count, 0)
  const byRemainder = [...quotas].sort((a, b) =>
    b.remainder - a.remainder || a.difficulty - b.difficulty
  )
  for (let i = 0; i < remaining; i++) byRemainder[i].count++

  return quotas
    .filter(x => x.count > 0)
    .sort((a, b) => a.difficulty - b.difficulty)
    .map(({ difficulty, count: quantity }) => ({ difficulty, count: quantity }))
}
