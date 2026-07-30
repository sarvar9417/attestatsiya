import { describe, it, expect } from 'vitest'
import { MODULES, BLUEPRINT } from '../data/contentTree'

describe('contentTree', () => {
  it('16 modul bo\'lishi kerak', () => {
    expect(MODULES.length).toBe(16)
  })

  it('barcha modullar unique ID va code ga ega', () => {
    const ids = MODULES.map(m => m.id)
    const codes = MODULES.map(m => m.code)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('barcha modul IDlari M01-M16 formatida', () => {
    MODULES.forEach((m, i) => {
      expect(m.id).toBe(`M${String(i + 1).padStart(2, '0')}`)
    })
  })

  it('har bir modulda kamida 3 ta subtopic bo\'lishi kerak', () => {
    MODULES.forEach(m => {
      expect(m.subtopics.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('barcha subtopic IDlari unique', () => {
    const allIds = MODULES.flatMap(m => m.subtopics.map(s => s.id))
    expect(new Set(allIds).size).toBe(allIds.length)
  })

  it('subtopic IDlari modul ID bilan boshlanishi kerak', () => {
    MODULES.forEach(m => {
      m.subtopics.forEach(s => {
        expect(s.id.startsWith(m.id + '.')).toBe(true)
      })
    })
  })

  it('har bir modul to\'g\'ri sectionga tegishli', () => {
    const sections = MODULES.map(m => m.section)
    expect(sections.filter(s => s === 'specialty').length).toBe(13)
    expect(sections.filter(s => s === 'professional_standard').length).toBe(1)
    expect(sections.filter(s => s === 'pedagogy').length).toBe(1)
    expect(sections.filter(s => s === 'methodology').length).toBe(1)
  })
})

describe('BLUEPRINT', () => {
  it('jami 50 ta savol', () => {
    expect(BLUEPRINT.totalQuestions).toBe(50)
  })

  it('120 daqiqa vaqt', () => {
    expect(BLUEPRINT.durationMinutes).toBe(120)
  })

  it('2 ball per question, 100 max', () => {
    expect(BLUEPRINT.pointsPerQuestion).toBe(2)
    expect(BLUEPRINT.maxPoints).toBe(100)
  })

  it('section countlari yig\'indisi 50 ga teng', () => {
    const total = Object.values(BLUEPRINT.sections).reduce((sum, s) => sum + s.count, 0)
    expect(total).toBe(50)
  })

  it('cognitive countlari yig\'indisi 50 ga teng', () => {
    const total = Object.values(BLUEPRINT.cognitive).reduce((sum, c) => sum + c, 0)
    expect(total).toBe(50)
  })

  it('modul question countlari yig\'indisi 50 ga teng', () => {
    const total = Object.values(BLUEPRINT.moduleQuestionCount).reduce((sum, c) => sum + c, 0)
    expect(total).toBe(50)
  })

  it('har bir moduleQuestionCount blueprintdagi modulga mos', () => {
    const modIds = MODULES.map(m => m.id)
    Object.keys(BLUEPRINT.moduleQuestionCount).forEach(id => {
      expect(modIds).toContain(id)
    })
  })

  it('har bir modulning examQuestionCounti blueprintga teng', () => {
    MODULES.forEach(m => {
      const bpCount = BLUEPRINT.moduleQuestionCount[m.id as keyof typeof BLUEPRINT.moduleQuestionCount]
      expect(bpCount).toBeDefined()
      expect(m.examQuestionCount).toBe(bpCount)
    })
  })
})
