export type ReadinessConfidence = 'insufficient' | 'low' | 'medium' | 'high'
export type ReadinessNextActionKind = 'review' | 'weak' | 'diagnostic' | 'learn'

export interface ReadinessQuota {
  group_code: string
  question_count: number
}

export interface IndependentEvidence {
  group_code: string
  is_correct: boolean
}

export interface ReadinessCalculationInput {
  quotas: ReadinessQuota[]
  evidence: IndependentEvidence[]
  dueReviews: number
  regressedConstructs: number
}

export interface ReadinessCalculation {
  readiness_percent: number | null
  confidence: ReadinessConfidence
  independent_evidence: number
  covered_blueprint_questions: number
  total_blueprint_questions: number
  coverage_percent: number
  next_action: {
    kind: ReadinessNextActionKind
    href: string
    label: string
    reason: string
  }
}

/**
 * Readiness v1.
 *
 * Readiness is a blueprint-weighted estimate across groups that already have
 * independent evidence. Missing groups are represented by coverage/confidence
 * instead of being silently scored as zero.
 *
 * Confidence bands are deliberately conservative product heuristics, not an
 * official attestatsiya score guarantee:
 * - insufficient: <10 independent answers OR <20% blueprint coverage
 * - low: <50 answers OR <50% coverage
 * - medium: <200 answers OR <80% coverage
 * - high: >=200 answers AND >=80% coverage
 */
export function calculateReadiness(
  input: ReadinessCalculationInput
): ReadinessCalculation {
  const totalBlueprintQuestions = input.quotas.reduce(
    (sum, quota) => sum + Math.max(0, quota.question_count),
    0
  )

  const evidenceByGroup = new Map<string, { attempts: number; correct: number }>()
  for (const item of input.evidence) {
    const current = evidenceByGroup.get(item.group_code) ?? {
      attempts: 0,
      correct: 0,
    }
    current.attempts += 1
    if (item.is_correct) current.correct += 1
    evidenceByGroup.set(item.group_code, current)
  }

  let coveredBlueprintQuestions = 0
  let weightedAccuracy = 0

  for (const quota of input.quotas) {
    const group = evidenceByGroup.get(quota.group_code)
    if (!group || group.attempts === 0 || quota.question_count <= 0) continue

    coveredBlueprintQuestions += quota.question_count
    weightedAccuracy +=
      (group.correct / group.attempts) * quota.question_count
  }

  const independentEvidence = input.evidence.length
  const coveragePercent =
    totalBlueprintQuestions > 0
      ? Math.round((coveredBlueprintQuestions / totalBlueprintQuestions) * 100)
      : 0

  const readinessPercent =
    coveredBlueprintQuestions > 0
      ? Math.round((weightedAccuracy / coveredBlueprintQuestions) * 100)
      : null

  let confidence: ReadinessConfidence
  if (independentEvidence < 10 || coveragePercent < 20) {
    confidence = 'insufficient'
  } else if (independentEvidence < 50 || coveragePercent < 50) {
    confidence = 'low'
  } else if (independentEvidence < 200 || coveragePercent < 80) {
    confidence = 'medium'
  } else {
    confidence = 'high'
  }

  let nextAction: ReadinessCalculation['next_action']
  if (input.dueReviews > 0) {
    nextAction = {
      kind: 'review',
      href: '/review',
      label: 'Takrorlashlarni bajarish',
      reason: `${input.dueReviews} ta konstruktning takrorlash vaqti kelgan.`,
    }
  } else if (input.regressedConstructs > 0) {
    nextAction = {
      kind: 'weak',
      href: '/exam/zaif',
      label: 'Zaif mavzularni tekshirish',
      reason: `${input.regressedConstructs} ta konstrukt qayta mustahkamlashni talab qiladi.`,
    }
  } else if (confidence === 'insufficient') {
    nextAction = {
      kind: 'diagnostic',
      href: '/exam/diagnostika',
      label: 'Diagnostikani boshlash',
      reason: 'Taxminiy tayyorgarlik uchun mustaqil evidence hali yetarli emas.',
    }
  } else {
    nextAction = {
      kind: 'learn',
      href: '/learn',
      label: 'O‘rganishni davom ettirish',
      reason: 'Navbatdagi mavzu bilan blueprint qamrovini kengaytiring.',
    }
  }

  return {
    readiness_percent: readinessPercent,
    confidence,
    independent_evidence: independentEvidence,
    covered_blueprint_questions: coveredBlueprintQuestions,
    total_blueprint_questions: totalBlueprintQuestions,
    coverage_percent: coveragePercent,
    next_action: nextAction,
  }
}
