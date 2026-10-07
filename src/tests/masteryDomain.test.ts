import { describe, expect, it } from 'vitest'
import {
  calculateMasterySnapshot,
  DEFAULT_MASTERY_CONFIG,
  evaluateProvisionalMastery,
  evaluateRegression,
  hasStableReviewSequence,
  type MasteryEvidence,
} from '../domain/mastery'

const NOW = new Date('2026-10-07T12:00:00.000Z')

function evidence(
  questionId: string,
  cognitiveLevel: MasteryEvidence['cognitiveLevel'],
  isCorrect: boolean,
  daysAgo: number,
  overrides: Partial<MasteryEvidence> = {}
): MasteryEvidence {
  return {
    questionId,
    cognitiveLevel,
    isCorrect,
    isIndependentFirstAttempt: true,
    occurredAt: new Date(
      NOW.getTime() - daysAgo * 24 * 60 * 60 * 1000
    ).toISOString(),
    ...overrides,
  }
}

describe('mastery domain', () => {
  it('faqat mustaqil birinchi urinishni hisoblaydi va bir savolni qayta sanamaydi', () => {
    const snapshot = calculateMasterySnapshot(
      [
        evidence('q1', 'bilish', false, 3),
        evidence('q1', 'bilish', true, 2),
        evidence('q2', 'qollash', true, 2, {
          isIndependentFirstAttempt: false,
        }),
        evidence('q3', 'mulohaza', true, 1),
      ],
      {
        ...DEFAULT_MASTERY_CONFIG,
        weights: { bilish: 0.5, qollash: 0, mulohaza: 0.5 },
      },
      NOW
    )

    expect(snapshot.distinctEvidenceCount).toBe(2)
    expect(snapshot.levels.bilish).toEqual({
      attemptedDistinct: 1,
      correctDistinct: 0,
      score: 0,
    })
    expect(snapshot.levels.qollash.score).toBeNull()
    expect(snapshot.levels.mulohaza.score).toBe(1)
    expect(snapshot.overallScore).toBe(0.5)
  })

  it('90 kunlik oynadan tashqaridagi birinchi exposure keyingi duplicate bilan qayta kirmaydi', () => {
    const snapshot = calculateMasterySnapshot(
      [
        evidence('old-question', 'bilish', false, 100),
        evidence('old-question', 'bilish', true, 1),
        evidence('fresh-question', 'bilish', true, 2),
      ],
      {
        ...DEFAULT_MASTERY_CONFIG,
        weights: { bilish: 1, qollash: 0, mulohaza: 0 },
      },
      NOW
    )

    expect(snapshot.distinctEvidenceCount).toBe(1)
    expect(snapshot.levels.bilish.score).toBe(1)
  })

  it('har cognitive level uchun eng so‘nggi 20 distinct evidence limitini saqlaydi', () => {
    const items = Array.from({ length: 25 }, (_, index) =>
      evidence(
        `q-${index}`,
        'qollash',
        index >= 5,
        25 - index
      )
    )

    const snapshot = calculateMasterySnapshot(
      items,
      {
        ...DEFAULT_MASTERY_CONFIG,
        weights: { bilish: 0, qollash: 1, mulohaza: 0 },
      },
      NOW
    )

    expect(snapshot.levels.qollash.attemptedDistinct).toBe(20)
    expect(snapshot.levels.qollash.correctDistinct).toBe(20)
    expect(snapshot.overallScore).toBe(1)
  })

  it('applicable cognitive levelda evidence yo‘q bo‘lsa overall null qoladi', () => {
    const snapshot = calculateMasterySnapshot(
      [evidence('q1', 'bilish', true, 1)],
      DEFAULT_MASTERY_CONFIG,
      NOW
    )

    expect(snapshot.levels.bilish.score).toBe(1)
    expect(snapshot.levels.qollash.score).toBeNull()
    expect(snapshot.overallScore).toBeNull()
  })

  it('reviewer levelni qo‘llanmaydi deb weight=0 qilsa qolgan weightlarni normalizatsiya qiladi', () => {
    const snapshot = calculateMasterySnapshot(
      [
        evidence('q1', 'bilish', true, 1),
        evidence('q2', 'qollash', false, 1),
      ],
      {
        ...DEFAULT_MASTERY_CONFIG,
        weights: { bilish: 0.2, qollash: 0.8, mulohaza: 0 },
      },
      NOW
    )

    expect(snapshot.overallScore).toBeCloseTo(0.2)
  })

  it('provisional mastery barcha 7 shart bajarilgandagina eligible bo‘ladi', () => {
    const items: MasteryEvidence[] = [
      ...Array.from({ length: 5 }, (_, index) =>
        evidence(`k-${index}`, 'bilish', true, index + 1)
      ),
      ...Array.from({ length: 7 }, (_, index) =>
        evidence(`a-${index}`, 'qollash', true, index + 1)
      ),
      ...Array.from({ length: 3 }, (_, index) =>
        evidence(`r-${index}`, 'mulohaza', true, index + 1)
      ),
    ]

    const snapshot = calculateMasterySnapshot(items, DEFAULT_MASTERY_CONFIG, NOW)
    const decision = evaluateProvisionalMastery(
      snapshot,
      {
        criticalObjectivesSatisfied: true,
        misconceptionsRemediated: true,
        checkpointPassed: true,
      },
      DEFAULT_MASTERY_CONFIG
    )

    expect(snapshot.distinctEvidenceCount).toBe(15)
    expect(snapshot.higherOrderDistinctCount).toBe(10)
    expect(decision).toEqual({ eligible: true, blockers: [] })
  })

  it('provisional mastery yetishmayotgan evidence va checkpoint sabablarini aniq qaytaradi', () => {
    const snapshot = calculateMasterySnapshot(
      [
        evidence('q1', 'bilish', true, 1),
        evidence('q2', 'qollash', false, 1),
      ],
      DEFAULT_MASTERY_CONFIG,
      NOW
    )

    const decision = evaluateProvisionalMastery(snapshot, {
      criticalObjectivesSatisfied: false,
      misconceptionsRemediated: false,
      checkpointPassed: false,
    })

    expect(decision.eligible).toBe(false)
    expect(decision.blockers).toEqual(
      expect.arrayContaining([
        'insufficient_distinct_evidence',
        'insufficient_higher_order_evidence',
        'overall_score_below_threshold',
        'higher_order_score_below_threshold',
        'critical_objectives_not_satisfied',
        'misconceptions_not_remediated',
        'checkpoint_not_passed',
      ])
    )
  })

  it('regressionning uchta rasmiy triggerini alohida qaytaradi', () => {
    const recent = Array.from({ length: 10 }, (_, index) =>
      evidence(`q-${index}`, 'qollash', index < 6, index)
    )
    const snapshot = calculateMasterySnapshot(
      recent,
      {
        ...DEFAULT_MASTERY_CONFIG,
        weights: { bilish: 0, qollash: 1, mulohaza: 0 },
      },
      NOW
    )

    const decision = evaluateRegression(snapshot, {
      consecutiveReviewFailures: 2,
      criticalObjectiveConsecutiveErrors: 2,
    })

    expect(snapshot.recentTenAccuracy).toBe(0.6)
    expect(decision.regressed).toBe(true)
    expect(decision.reasons).toEqual([
      'two_consecutive_review_failures',
      'recent_independent_accuracy_below_70',
      'critical_objective_consecutive_errors',
    ])
  })

  it('stable uchun 1/3/7/14/30 review ketma-ketligi to‘liq talab qilinadi', () => {
    expect(hasStableReviewSequence([1, 3, 7, 14])).toBe(false)
    expect(hasStableReviewSequence([30, 14, 7, 3, 1])).toBe(true)
  })

  it('noto‘g‘ri config va sanani rad qiladi', () => {
    expect(() =>
      calculateMasterySnapshot(
        [evidence('q1', 'bilish', true, 1, { occurredAt: 'not-a-date' })],
        DEFAULT_MASTERY_CONFIG,
        NOW
      )
    ).toThrow('mastery_evidence_invalid_date')

    expect(() =>
      calculateMasterySnapshot(
        [],
        {
          ...DEFAULT_MASTERY_CONFIG,
          weights: { bilish: 0, qollash: 0, mulohaza: 0 },
        },
        NOW
      )
    ).toThrow('mastery_config_invalid_weight')
  })
})
