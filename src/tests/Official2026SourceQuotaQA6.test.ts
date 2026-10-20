import { describe, expect, it } from 'vitest'
import { BLUEPRINT_GROUPS, EXAM_RULES, CONTENT_AREAS } from '../data/blueprint2026'

/**
 * 2026 kuzgi rasmiy spetsifikatsiya (Google Drive: +INFORMATIKA_SPETSIFIKATSIYA_AUTUMN.pdf).
 * A second document entitled MALAKA SINOVI TOPSHIRIQLARI (TAFSILOTLARI) describes
 * the *35-question specialty subset*, not a different whole-exam 35-question mode.
 */
describe('TASK-346 source-verified 2026 official assessment contract', () => {
  it('keeps 50 questions, 120 minutes, 100 points and the exact 35/5/7/3 sections', () => {
    expect(EXAM_RULES.totalQuestions).toBe(50)
    expect(EXAM_RULES.durationMinutes).toBe(120)
    expect(EXAM_RULES.pointsPerQuestion).toBe(2)
    expect(EXAM_RULES.maxPoints).toBe(100)
    expect(EXAM_RULES.sections.specialty.count).toBe(35)
    expect(EXAM_RULES.sections.professional_standard.count).toBe(5)
    expect(EXAM_RULES.sections.pedagogy.count).toBe(7)
    expect(EXAM_RULES.sections.methodology.count).toBe(3)
  })

  it('preserves the global 8/35/7 cognitive quota, not the 35-item subset percentages', () => {
    expect(EXAM_RULES.cognitive).toEqual({ bilish: 8, qollash: 35, mulohaza: 7 })
    expect(Object.values(EXAM_RULES.cognitive).reduce((x, y) => x + y, 0)).toBe(50)
  })

  it('maps specialty 1..35 and pedagogy/professional 36..50 without overlaps', () => {
    const positions = CONTENT_AREAS.flatMap((area) =>
      Array.from({ length: area.questionTo - area.questionFrom + 1 }, (_, i) => area.questionFrom + i)
    )
    expect(positions).toEqual(Array.from({ length: 50 }, (_, i) => i + 1))
    expect(BLUEPRINT_GROUPS.reduce((n, group) => n + group.questionCount, 0)).toBe(50)
  })
})
