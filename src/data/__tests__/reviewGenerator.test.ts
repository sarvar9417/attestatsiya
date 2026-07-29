import { describe, it, expect } from 'vitest'
import { REVIEW_LESSONS } from '../daily/reviewLessons'

// Avto-generatsiya qilingan oraliq takror darslari ReviewView ning invariantlariga
// mos kelishini kafolatlaydi (aks holda runtime'da crash bo'ladi — masalan test
// bo'limi har bir test savolining t.options massivini iteratsiya qiladi).
describe('auto-generated review lessons', () => {
  it('generates a reasonable number of reviews', () => {
    expect(REVIEW_LESSONS.length).toBeGreaterThanOrEqual(10)
  })

  it('every review is well-formed and has content', () => {
    for (const r of REVIEW_LESSONS) {
      expect(r.type).toBe('review')
      expect(r.id).toBeTruthy()
      expect(r.title).toBeTruthy()
      expect(r.level).toMatch(/^(A0|A1|A2|B1|B1\+|B2)$/)
      expect(r.coversDays.length).toBeGreaterThan(0)
      expect(r.afterDay).toBe(Math.max(...r.coversDays))
      expect(r.coversTopics.length).toBe(r.coversDays.length)
      expect(r.exercises.length).toBeGreaterThan(0)
      expect(r.tests.length).toBeGreaterThan(0)
    }
  })

  // ReviewView test bo'limi t.options ni iteratsiya qiladi → testlar multiple-choice afzal
  it('every test question has a valid type (ReviewView invariant)', () => {
    for (const r of REVIEW_LESSONS) {
      for (const t of r.tests) {
        expect(['multiple-choice', 'fill-blank', 'true-false', 'textInput', 'error-correction', 'transformation']).toContain(t.type)
        if (t.type === 'multiple-choice') {
          expect(Array.isArray((t as { options?: unknown }).options)).toBe(true)
        }
      }
    }
  })

  it('exercise/test ids are unique and sections reference exactly them', () => {
    const seenIds = new Set<number>()
    for (const r of REVIEW_LESSONS) {
      const exIds = r.exercises.map(e => e.id)
      const tsIds = r.tests.map(t => t.id)
      expect(new Set(exIds).size).toBe(exIds.length)
      expect(new Set(tsIds).size).toBe(tsIds.length)
      // sections aynan shu id'larni ko'rsatsin
      expect(new Set(r.exerciseSections.flatMap(s => s.ids))).toEqual(new Set(exIds))
      expect(new Set(r.testSections.flatMap(s => s.ids))).toEqual(new Set(tsIds))
      // id'lar review'lar orasida ham takrorlanmasin
      for (const id of [...exIds, ...tsIds]) {
        expect(seenIds.has(id)).toBe(false)
        seenIds.add(id)
      }
    }
  })

  it('review ids are unique', () => {
    const ids = REVIEW_LESSONS.map(r => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
