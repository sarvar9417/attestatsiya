import { describe, it, expect } from 'vitest'
import { BLUEPRINT } from '../data/contentTree'

describe('Blueprint invariants', () => {
  it('specialty section counti modul countlari yig\'indisiga teng', () => {
    const specialtyMods: (keyof typeof BLUEPRINT.moduleQuestionCount)[] = [
      'M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12', 'M13'
    ]
    const total = specialtyMods.reduce((sum, m) => sum + BLUEPRINT.moduleQuestionCount[m], 0)
    expect(total).toBe(BLUEPRINT.sections.specialty.count)
  })

  it('professional_standard section counti M14 ga teng', () => {
    expect(BLUEPRINT.moduleQuestionCount.M14).toBe(BLUEPRINT.sections.professional_standard.count)
  })

  it('pedagogy section counti M15 ga teng', () => {
    expect(BLUEPRINT.moduleQuestionCount.M15).toBe(BLUEPRINT.sections.pedagogy.count)
  })

  it('methodology section counti M16 ga teng', () => {
    expect(BLUEPRINT.moduleQuestionCount.M16).toBe(BLUEPRINT.sections.methodology.count)
  })

  it('knowledge counti 8 dan ko\'p bo\'lmasligi kerak', () => {
    expect(BLUEPRINT.cognitive.knowledge).toBeLessThanOrEqual(8)
  })

  it('application counti eng katta cognitive group', () => {
    const { knowledge, application, reasoning } = BLUEPRINT.cognitive
    expect(application).toBeGreaterThan(knowledge)
    expect(application).toBeGreaterThan(reasoning)
  })

  it('barcha moduleQuestionCount musbat', () => {
    const counts = Object.values(BLUEPRINT.moduleQuestionCount)
    counts.forEach(c => {
      expect(c).toBeGreaterThan(0)
    })
  })

  it('moduleQuestionCount M15 eng katta', () => {
    const counts = Object.values(BLUEPRINT.moduleQuestionCount)
    const max = Math.max(...counts)
    expect(BLUEPRINT.moduleQuestionCount.M15).toBe(max)
  })

  it('pointsPerQuestion * totalQuestions = maxPoints', () => {
    expect(BLUEPRINT.pointsPerQuestion * BLUEPRINT.totalQuestions).toBe(BLUEPRINT.maxPoints)
  })
})
