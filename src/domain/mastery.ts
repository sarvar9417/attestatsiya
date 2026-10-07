export type MasteryCognitiveLevel = 'bilish' | 'qollash' | 'mulohaza'

export interface MasteryEvidence {
  questionId: string
  cognitiveLevel: MasteryCognitiveLevel
  isCorrect: boolean
  isIndependentFirstAttempt: boolean
  occurredAt: string
}

export interface MasteryConfig {
  evidenceWindowDays: number
  perLevelDistinctLimit: number
  minDistinctQuestions: number
  minHigherOrderQuestions: number
  overallThreshold: number
  higherOrderThreshold: number
  weights: Record<MasteryCognitiveLevel, number>
}

export interface MasteryLevelSnapshot {
  attemptedDistinct: number
  correctDistinct: number
  score: number | null
}

export interface MasterySnapshot {
  levels: Record<MasteryCognitiveLevel, MasteryLevelSnapshot>
  distinctEvidenceCount: number
  higherOrderDistinctCount: number
  higherOrderScore: number | null
  overallScore: number | null
  recentTenAccuracy: number | null
}

export interface ProvisionalContext {
  criticalObjectivesSatisfied: boolean
  misconceptionsRemediated: boolean
  checkpointPassed: boolean
}

export type ProvisionalBlocker =
  | 'insufficient_distinct_evidence'
  | 'insufficient_higher_order_evidence'
  | 'overall_score_below_threshold'
  | 'higher_order_score_below_threshold'
  | 'critical_objectives_not_satisfied'
  | 'misconceptions_not_remediated'
  | 'checkpoint_not_passed'

export interface ProvisionalDecision {
  eligible: boolean
  blockers: ProvisionalBlocker[]
}

export interface RegressionContext {
  consecutiveReviewFailures: number
  criticalObjectiveConsecutiveErrors: number
}

export type RegressionReason =
  | 'two_consecutive_review_failures'
  | 'recent_independent_accuracy_below_70'
  | 'critical_objective_consecutive_errors'

export interface RegressionDecision {
  regressed: boolean
  reasons: RegressionReason[]
}

export const DEFAULT_MASTERY_CONFIG: MasteryConfig = {
  evidenceWindowDays: 90,
  perLevelDistinctLimit: 20,
  minDistinctQuestions: 15,
  minHigherOrderQuestions: 8,
  overallThreshold: 0.9,
  higherOrderThreshold: 0.8,
  weights: {
    bilish: 0.2,
    qollash: 0.5,
    mulohaza: 0.3,
  },
}

const DAY_MS = 24 * 60 * 60 * 1000
const LEVELS: readonly MasteryCognitiveLevel[] = [
  'bilish',
  'qollash',
  'mulohaza',
]

function epoch(value: string): number {
  const parsed = Date.parse(value)
  if (!Number.isFinite(parsed)) {
    throw new Error('mastery_evidence_invalid_date')
  }
  return parsed
}

function assertConfig(config: MasteryConfig): void {
  if (config.evidenceWindowDays <= 0 || config.perLevelDistinctLimit <= 0) {
    throw new Error('mastery_config_invalid_window')
  }

  if (
    config.minDistinctQuestions < 0 ||
    config.minHigherOrderQuestions < 0 ||
    config.overallThreshold < 0 ||
    config.overallThreshold > 1 ||
    config.higherOrderThreshold < 0 ||
    config.higherOrderThreshold > 1
  ) {
    throw new Error('mastery_config_invalid_threshold')
  }

  const weightTotal = LEVELS.reduce(
    (sum, level) => sum + config.weights[level],
    0
  )

  if (
    weightTotal <= 0 ||
    LEVELS.some(
      level =>
        !Number.isFinite(config.weights[level]) || config.weights[level] < 0
    )
  ) {
    throw new Error('mastery_config_invalid_weight')
  }
}

function firstIndependentEvidence(
  evidence: readonly MasteryEvidence[]
): MasteryEvidence[] {
  const chronological = [...evidence].sort(
    (left, right) => epoch(left.occurredAt) - epoch(right.occurredAt)
  )
  const seen = new Set<string>()
  const first: MasteryEvidence[] = []

  for (const item of chronological) {
    if (!item.isIndependentFirstAttempt || seen.has(item.questionId)) continue
    seen.add(item.questionId)
    first.push(item)
  }

  return first
}

function levelSnapshot(
  evidence: readonly MasteryEvidence[]
): MasteryLevelSnapshot {
  const attemptedDistinct = evidence.length
  const correctDistinct = evidence.filter(item => item.isCorrect).length

  return {
    attemptedDistinct,
    correctDistinct,
    score:
      attemptedDistinct === 0 ? null : correctDistinct / attemptedDistinct,
  }
}

function weightedOverall(
  levels: Record<MasteryCognitiveLevel, MasteryLevelSnapshot>,
  config: MasteryConfig
): number | null {
  const applicable = LEVELS.filter(level => config.weights[level] > 0)
  if (applicable.length === 0) return null

  if (applicable.some(level => levels[level].score === null)) {
    return null
  }

  const weightTotal = applicable.reduce(
    (sum, level) => sum + config.weights[level],
    0
  )

  return applicable.reduce((sum, level) => {
    const score = levels[level].score
    return sum + (score ?? 0) * (config.weights[level] / weightTotal)
  }, 0)
}

export function calculateMasterySnapshot(
  evidence: readonly MasteryEvidence[],
  config: MasteryConfig = DEFAULT_MASTERY_CONFIG,
  now: Date = new Date()
): MasterySnapshot {
  assertConfig(config)

  const nowMs = now.getTime()
  if (!Number.isFinite(nowMs)) throw new Error('mastery_now_invalid_date')

  const windowStart = nowMs - config.evidenceWindowDays * DAY_MS
  const firstIndependent = firstIndependentEvidence(evidence)
    .filter(item => {
      const occurred = epoch(item.occurredAt)
      return occurred >= windowStart && occurred <= nowMs
    })
    .sort((left, right) => epoch(right.occurredAt) - epoch(left.occurredAt))

  const selectedByLevel = Object.fromEntries(
    LEVELS.map(level => [
      level,
      firstIndependent
        .filter(item => item.cognitiveLevel === level)
        .slice(0, config.perLevelDistinctLimit),
    ])
  ) as Record<MasteryCognitiveLevel, MasteryEvidence[]>

  const levels = Object.fromEntries(
    LEVELS.map(level => [level, levelSnapshot(selectedByLevel[level])])
  ) as Record<MasteryCognitiveLevel, MasteryLevelSnapshot>

  const selected = LEVELS.flatMap(level => selectedByLevel[level])
  const higherOrder = selected.filter(
    item =>
      item.cognitiveLevel === 'qollash' ||
      item.cognitiveLevel === 'mulohaza'
  )
  const higherOrderCorrect = higherOrder.filter(item => item.isCorrect).length
  const recentTen = firstIndependent.slice(0, 10)
  const recentTenCorrect = recentTen.filter(item => item.isCorrect).length

  return {
    levels,
    distinctEvidenceCount: selected.length,
    higherOrderDistinctCount: higherOrder.length,
    higherOrderScore:
      higherOrder.length === 0
        ? null
        : higherOrderCorrect / higherOrder.length,
    overallScore: weightedOverall(levels, config),
    recentTenAccuracy:
      recentTen.length === 0 ? null : recentTenCorrect / recentTen.length,
  }
}

export function evaluateProvisionalMastery(
  snapshot: MasterySnapshot,
  context: ProvisionalContext,
  config: MasteryConfig = DEFAULT_MASTERY_CONFIG
): ProvisionalDecision {
  assertConfig(config)
  const blockers: ProvisionalBlocker[] = []

  if (snapshot.distinctEvidenceCount < config.minDistinctQuestions) {
    blockers.push('insufficient_distinct_evidence')
  }

  if (snapshot.higherOrderDistinctCount < config.minHigherOrderQuestions) {
    blockers.push('insufficient_higher_order_evidence')
  }

  if (
    snapshot.overallScore === null ||
    snapshot.overallScore < config.overallThreshold
  ) {
    blockers.push('overall_score_below_threshold')
  }

  if (
    snapshot.higherOrderScore === null ||
    snapshot.higherOrderScore < config.higherOrderThreshold
  ) {
    blockers.push('higher_order_score_below_threshold')
  }

  if (!context.criticalObjectivesSatisfied) {
    blockers.push('critical_objectives_not_satisfied')
  }

  if (!context.misconceptionsRemediated) {
    blockers.push('misconceptions_not_remediated')
  }

  if (!context.checkpointPassed) {
    blockers.push('checkpoint_not_passed')
  }

  return {
    eligible: blockers.length === 0,
    blockers,
  }
}

export function evaluateRegression(
  snapshot: MasterySnapshot,
  context: RegressionContext
): RegressionDecision {
  const reasons: RegressionReason[] = []

  if (context.consecutiveReviewFailures >= 2) {
    reasons.push('two_consecutive_review_failures')
  }

  if (
    snapshot.recentTenAccuracy !== null &&
    snapshot.recentTenAccuracy < 0.7
  ) {
    reasons.push('recent_independent_accuracy_below_70')
  }

  if (context.criticalObjectiveConsecutiveErrors >= 2) {
    reasons.push('critical_objective_consecutive_errors')
  }

  return {
    regressed: reasons.length > 0,
    reasons,
  }
}

export function hasStableReviewSequence(
  passedIntervals: readonly number[]
): boolean {
  const required = [1, 3, 7, 14, 30]
  const passed = new Set(passedIntervals)
  return required.every(interval => passed.has(interval))
}
