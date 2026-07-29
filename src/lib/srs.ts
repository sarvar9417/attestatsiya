/**
 * src/lib/srs.ts — FSRS-5 Algorithm
 *
 * Free Spaced Repetition Scheduler v5
 * Based on: https://github.com/open-spaced-repetition/awesome-fsrs
 *
 * Grades (G):
 *   1 = Again  (bilmadim)  → completely forgot
 *   2 = Hard   (qiynaldim) → recalled with difficulty
 *   3 = Good   (bildim)    → recalled correctly
 *   4 = Easy   (yodladim)  → recalled effortlessly
 *
 * Default desired retention (r): 0.9 (90%)
 */

// ─── FSRS-5 Default Weights (w1–w19) ───────────────────────────────────────
export const FSRS_WEIGHTS: readonly number[] = [
  0.40255,   // w[0]  — initial stability intercept
  1.18385,   // w[1]  — initial stability linear term
  3.173,     // w[2]  — initial stability quadratic term
  15.69105,  // w[3]  — initial difficulty intercept
  7.1949,    // w[4]  — initial difficulty slope
  0.5345,    // w[5]  — difficulty change coefficient (ΔD = -w[5]*(G-3))
  1.4604,    // w[6]  — (reserved for Hard difficulty delta)
  0.0046,    // w[7]  — reserved / unused in simplified version
  1.54575,   // w[8]  — stability increase multiplier (Good/Easy)
  0.1192,    // w[9]  — stability increase f(S) exponent
  1.01925,   // w[10] — stability increase f(R) coefficient
  1.9395,    // w[11] — reserved
  0.11,      // w[12] — stability after Hard multiplier
  0.29605,   // w[13] — stability after fail scaling
  2.2698,    // w[14] — stability after fail f(S) exponent
  0.2315,    // w[15] — stability after fail f(R) exponent
  2.9898,    // w[16] — reserved
  0.51655,   // w[17] — short-term stability factor
  0.6621,    // w[18] — short-term stability offset
] as const

export type Grade = 1 | 2 | 3 | 4

/** Mapping from our Rating strings to FSRS grades */
export function ratingToGrade(rating: string): Grade {
  switch (rating) {
    case 'bilmadim':  return 1
    case 'qiynaldim': return 2
    case 'bildim':    return 3
    case 'yodladim':  return 4
    default:          return 3
  }
}

// ─── FSRS Card State ────────────────────────────────────────────────────────

export interface FSRSState {
  stability:    number   // S — memory stability in days
  difficulty:   number   // D — item difficulty [1..10]
  due:          string   // ISO date of next review
  reps:         number   // total review count
  lapses:       number   // times forgotten (rating=1)
}

export function createDefaultFSRSState(): FSRSState {
  // Tomorrow — yangi chunk'lar darhol "due" bo'lib qolmasin.
  // Main review card (getDueChunks) faqat SRS bo'yicha haqiqatan
  // muddati o'tgan chunk'larni ko'rsatishi uchun.
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return {
    stability:  0,
    difficulty: 5,
    due:        tomorrow.toISOString().split('T')[0],
    reps:       0,
    lapses:     0,
  }
}

// ─── Core FSRS-5 Mathematics ────────────────────────────────────────────────

/**
 * Initial stability after the *first* rating.
 * S₀(G) = max(0.1, w₁ + w₂·(G−1) + w₃·(G−1)²)
 */
export function initStability(grade: Grade): number {
  const w = FSRS_WEIGHTS
  const g = grade - 1
  return Math.max(0.1, w[0] + w[1] * g + w[2] * g * g)
}

/**
 * Initial difficulty after the *first* rating.
 * D₀(G) = max(1, min(10, w₄ − w₅·(G−3)))
 *
 * Higher grade → lower difficulty (easier card).
 */
export function initDifficulty(grade: Grade): number {
  const w = FSRS_WEIGHTS
  return Math.max(1, Math.min(10, w[3] - w[4] * (grade - 3)))
}

/**
 * Forgetting curve — retrievability R at time t (days) given stability S.
 * R(t, S) = (1 + t / (9·S))⁻¹
 */
export function retrievability(elapsedDays: number, stability: number): number {
  if (stability <= 0) return 0
  return 1 / (1 + elapsedDays / (9 * stability))
}

/**
 * Next review interval from stability and desired retention.
 * I = max(1, round(9·S·(1/r − 1)))
 */
export function nextInterval(stability: number, desiredRetention: number = 0.9): number {
  const interval = 9 * stability * (1 / desiredRetention - 1)
  return Math.max(1, Math.round(interval))
}

/**
 * Stability after a *successful* review.
 *
 * Hard (grade 2): S' = S · w[12]   (stability decreases, shorter interval)
 * Good (grade 3): S' = S · (1 + w[8] · f(D) · f(S) · f(R))
 * Easy (grade 4): S' = S · (1 + w[8] · f(D) · f(S) · f(R)) · 1.1  (bonus)
 *
 * where:
 *   f(D) = (11 − D) / 9
 *   f(S) = S^(−w[9])
 *   f(R) = 1 + w[10] · (1 − R)
 */
export function nextStabilitySuccess(
  stability: number,
  difficulty: number,
  retriev: number,
  grade: Grade
): number {
  const w = FSRS_WEIGHTS

  if (grade === 2) {
    // Hard: stability decreases
    return Math.max(0.1, stability * w[12])
  }

  // Good (3) or Easy (4)
  const fD = (11 - difficulty) / 9
  const fS = Math.pow(stability, -w[9])
  const fR = 1 + w[10] * (1 - retriev)

  const increase = 1 + w[8] * fD * Math.max(0, fS) * fR

  // Easy gets a stability bonus
  const bonus = grade === 4 ? 1.1 : 1.0

  return stability * Math.max(1.05, increase * bonus)
}

/**
 * Stability after a *failed* review (grade 1).
 * S' = w[13] · f(D) · f(S) · f(R)
 * where f(R) uses (1-R) instead of a raw difference
 */
export function nextStabilityFail(
  stability: number,
  difficulty: number,
  retriev: number
): number {
  const w = FSRS_WEIGHTS
  const fD = (11 - difficulty) / 9
  const fS = Math.pow(stability, -w[14])
  const fR = Math.pow(1 - Math.max(0, Math.min(1, retriev)), w[15])

  return Math.max(0.1, w[13] * fD * fS * fR)
}

/**
 * Difficulty update after a review.
 *
 *   ΔD(G) = -w[5] · (G − 3)
 *   D' = D + ΔD
 *   D'' = clamp(D', 1, 10)
 *   D''' = α · D₀(4) + (1−α) · D''   (mean reversion, α = 0.1)
 *
 * Higher grade (Easy) → decreasing difficulty.
 * Lower grade (Again) → increasing difficulty.
 */
export function nextDifficulty(difficulty: number, grade: Grade): number {
  const w = FSRS_WEIGHTS

  // Δ = -w[5] * (G - 3)
  //   Again:  +2*w[5]   — difficulty increases (card is harder)
  //   Hard:   +1*w[5]   — slightly increases
  //   Good:    0        — stays same
  //   Easy:   -1*w[5]   — decreases (card is easier)
  const rawChange = -w[5] * (grade - 3)
  let D = difficulty + rawChange

  // Clamp to [1, 10]
  D = Math.max(1, Math.min(10, D))

  // Mean reversion toward D₀(4) to prevent "ease hell"
  const alpha = 0.1   // mean reversion factor
  const D0_4 = initDifficulty(4)
  D = alpha * D0_4 + (1 - alpha) * D

  return Math.max(1, Math.min(10, D))
}

/**
 * Compute full next FSRS state after a review.
 * This is the main entry point, analogous to the existing `computeNextReview`.
 */
export function computeNextReviewFSRS(
  currentState: FSRSState,
  rating: string
): { state: FSRSState; intervalDays: number } {
  const grade = ratingToGrade(rating)
  const now = new Date()

  // Parse due date to compute elapsed days
  const dueDateStr = currentState.due || now.toISOString().split('T')[0]
  const dueDate = new Date(dueDateStr + 'T00:00:00')
  const elapsedDays = Math.max(0, (now.getTime() - dueDate.getTime()) / 86_400_000)

  const isFirstReview = currentState.reps === 0 || currentState.stability <= 0

  let newStability: number
  let newDifficulty: number

  if (isFirstReview) {
    // First review — use initial values
    newStability = initStability(grade)
    newDifficulty = initDifficulty(grade)
  } else if (grade === 1) {
    // Failed review
    const R = retrievability(elapsedDays, currentState.stability)
    newStability = nextStabilityFail(currentState.stability, currentState.difficulty, R)
    newDifficulty = nextDifficulty(currentState.difficulty, grade)
  } else {
    // Successful review (2, 3, 4)
    const R = retrievability(elapsedDays, currentState.stability)
    newStability = nextStabilitySuccess(currentState.stability, currentState.difficulty, R, grade)
    newDifficulty = nextDifficulty(currentState.difficulty, grade)
  }

  // Calculate next interval
  const intervalDays = nextInterval(newStability, 0.9)

  // Build next due date
  const nextDue = new Date(now)
  nextDue.setDate(nextDue.getDate() + intervalDays)

  return {
    state: {
      stability:   Math.round(newStability * 100) / 100,
      difficulty:  Math.round(newDifficulty * 100) / 100,
      due:         nextDue.toISOString().split('T')[0],
      reps:        currentState.reps + 1,
      lapses:      currentState.lapses + (grade === 1 ? 1 : 0),
    },
    intervalDays,
  }
}
