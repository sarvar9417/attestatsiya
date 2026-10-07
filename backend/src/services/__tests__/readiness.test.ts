import { describe, expect, it } from 'vitest'
import { calculateReadiness } from '../readiness.js'

const quotas = [
  { group_code: 'G1', question_count: 30 },
  { group_code: 'G2', question_count: 20 },
]

describe('calculateReadiness', () => {
  it('blueprint vaznini faqat evidence bor guruhlarda hisoblaydi va coverage ni alohida ko‘rsatadi', () => {
    const result = calculateReadiness({
      quotas,
      evidence: [
        ...Array.from({ length: 8 }, (_, index) => ({
          group_code: 'G1',
          is_correct: index < 6,
        })),
      ],
      dueReviews: 0,
      regressedConstructs: 0,
    })

    expect(result.readiness_percent).toBe(75)
    expect(result.covered_blueprint_questions).toBe(30)
    expect(result.total_blueprint_questions).toBe(50)
    expect(result.coverage_percent).toBe(60)
    expect(result.confidence).toBe('insufficient')
    expect(result.next_action.kind).toBe('diagnostic')
  })

  it('due review ni boshqa actionlardan ustun qo‘yadi', () => {
    const evidence = Array.from({ length: 60 }, (_, index) => ({
      group_code: index % 2 === 0 ? 'G1' : 'G2',
      is_correct: index % 5 !== 0,
    }))

    const result = calculateReadiness({
      quotas,
      evidence,
      dueReviews: 3,
      regressedConstructs: 2,
    })

    expect(result.confidence).toBe('medium')
    expect(result.next_action).toMatchObject({
      kind: 'review',
      href: '/review',
    })
  })

  it('due bo‘lmasa regressed constructni zaif sessionga yuboradi', () => {
    const evidence = Array.from({ length: 60 }, (_, index) => ({
      group_code: index % 2 === 0 ? 'G1' : 'G2',
      is_correct: true,
    }))

    const result = calculateReadiness({
      quotas,
      evidence,
      dueReviews: 0,
      regressedConstructs: 1,
    })

    expect(result.next_action).toMatchObject({
      kind: 'weak',
      href: '/exam/zaif',
    })
  })

  it('200+ evidence va 80%+ qamrovda high confidence beradi', () => {
    const evidence = Array.from({ length: 220 }, (_, index) => ({
      group_code: index % 2 === 0 ? 'G1' : 'G2',
      is_correct: index % 10 !== 0,
    }))

    const result = calculateReadiness({
      quotas,
      evidence,
      dueReviews: 0,
      regressedConstructs: 0,
    })

    // Xatolar alternating evidence'da G1'ga ko‘proq tushadi; 30:20 blueprint
    // weighting oddiy global 90% emas, 88% estimate beradi.
    expect(result.readiness_percent).toBe(88)
    expect(result.coverage_percent).toBe(100)
    expect(result.confidence).toBe('high')
    expect(result.next_action.kind).toBe('learn')
  })
})
