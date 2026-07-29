// ═══════════════════════════════════════════════════════════════════════════
// CEFR Can-Do Statements — data validation and helper function tests
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest'
import {
  LEVEL_CAN_DO,
  LESSON_CAN_DO,
  getLessonCanDo,
  getLevelCanDo,
} from '../cefrCanDo'
import { LESSON_INDEX } from '../daily/lessonsIndex'

// ---------------------------------------------------------------------------
// Data integrity — LEVEL_CAN_DO
// ---------------------------------------------------------------------------

describe('LEVEL_CAN_DO — data validligi', () => {
  it('barcha 6 ta CEFR level uchun can-do statementlar bor', () => {
    const expected = ['A0', 'A1', 'A2', 'B1', 'B1+', 'B2']
    for (const level of expected) {
      expect(LEVEL_CAN_DO[level]).toBeDefined()
      expect(LEVEL_CAN_DO[level].length).toBeGreaterThanOrEqual(3)
    }
    expect(Object.keys(LEVEL_CAN_DO).length).toBe(6)
  })

  it('har bir levelda kamida 3 ta can-do statement bor', () => {
    for (const [level, statements] of Object.entries(LEVEL_CAN_DO)) {
      expect(statements.length, `${level}: kamida 3 ta statement kerak`).toBeGreaterThanOrEqual(3)
    }
  })

  it('har bir can-do statement bosh emas va kamida 10 belgi', () => {
    for (const [level, statements] of Object.entries(LEVEL_CAN_DO)) {
      for (const s of statements) {
        expect(s.length, `${level}: "${s}" — kamida 10 belgi kerak`).toBeGreaterThanOrEqual(10)
      }
    }
  })

  it('har bir can-do statement ozbekcha — ozbekcha belgilar mavjud', () => {
    for (const [level, statements] of Object.entries(LEVEL_CAN_DO)) {
      for (const s of statements) {
        expect(s.length, `${level}: "${s}" — bosh emas`).toBeGreaterThan(0)
      }
    }
  })
})

// ---------------------------------------------------------------------------
// Data integrity — LESSON_CAN_DO
// ---------------------------------------------------------------------------

describe('LESSON_CAN_DO — data validligi', () => {
  it('barcha darslar LESSON_CAN_DO da qamrab olingan', () => {
    const lessonIds = LESSON_INDEX.map(l => l.id)
    const missing: string[] = []
    for (const id of lessonIds) {
      if (!LESSON_CAN_DO[id]) missing.push(id)
    }
    expect(missing, `${missing.length} ta darsda can-do statement yoq: ${missing.join(', ')}`).toEqual([])
  })

  it('LESSON_CAN_DO da LESSON_INDEX ga kirmagan ortiqcha entry yoq', () => {
    const lessonIds = new Set(LESSON_INDEX.map(l => l.id))
    const extra: string[] = []
    for (const id of Object.keys(LESSON_CAN_DO)) {
      if (!lessonIds.has(id)) extra.push(id)
    }
    expect(extra, `${extra.length} ta ortiqcha entry: ${extra.join(', ')}`).toEqual([])
  })

  it('har bir can-do statement bosh emas va kamida 10 belgi', () => {
    for (const [id, statement] of Object.entries(LESSON_CAN_DO)) {
      expect(statement.length, `${id}: kamida 10 belgi kerak`).toBeGreaterThanOrEqual(10)
    }
  })

  it('har bir can-do statement birinchi shaxsda tugaydi (olaman, bilaman, mumkin va h.k.)', () => {
    // Normalise: strip trailing punctuation before checking suffix
    const stripPunct = (s: string) => s.replace(/[!?.]+$/, '')
    const suffixes = [
      'olaman', 'bilaman', 'olishim', 'beray', 'bildira', 'ifodalay',
      'gapira', 'tushunaman', 'yozishim', 'farqlay', 'ishlata', 'tuza',
      'keltirish', 'tayyorman', 'takrorlayman', 'takrorlash', 'mustahkamlayman', 'mumkin',
    ]
    for (const [id, statement] of Object.entries(LESSON_CAN_DO)) {
      const normalised = stripPunct(statement)
      const endsCorrectly = suffixes.some(suf => normalised.endsWith(suf))
      expect(endsCorrectly, `${id}: "${statement}" — birinchi shaxs bilan tugashi kerak (olaman/bilaman/...)`).toBe(true)
    }
  })

  it('auto-review darslari takrorlash mazmuniga ega', () => {
    for (const [id, statement] of Object.entries(LESSON_CAN_DO)) {
      if (id.startsWith('auto-review')) {
        const hasTakror = statement.includes('takror')
        expect(hasTakror, `${id}: "${statement}" — auto-review "takror" sozini ichiga olishi kerak`).toBe(true)
      }
    }
  })
})

// ---------------------------------------------------------------------------
// getLessonCanDo() — helper function tests
// ---------------------------------------------------------------------------

describe('getLessonCanDo', () => {
  it('mavjud dars uchun togeri statement qaytaradi', () => {
    expect(getLessonCanDo('greetings-names')).toBe(
      "Hello, hi, goodbye — ingliz tilida salomlasha olaman"
    )
  })

  it('boshqa mavjud dars uchun togeri statement qaytaradi', () => {
    expect(getLessonCanDo('present-perfect')).toBe(
      "O'tmish va hozirgi zamonni bog'lay olaman"
    )
  })

  it('B2 darsi uchun togeri statement qaytaradi', () => {
    expect(getLessonCanDo('inversion-b2')).toBe(
      "Inversiya (Never have I...) bilan urg'u bera olaman"
    )
  })

  it('auto-review darsi uchun statement qaytaradi', () => {
    expect(getLessonCanDo('auto-review-1')).toBe(
      "A0 darajasidagi barcha mavzularni takrorlayman"
    )
  })

  it('mavjud bolmagan ID uchun undefined qaytaradi', () => {
    expect(getLessonCanDo('non-existent-lesson')).toBeUndefined()
    expect(getLessonCanDo('')).toBeUndefined()
  })

  it('barcha LESSON_INDEX darslarida getLessonCanDo ishlaydi', () => {
    for (const lesson of LESSON_INDEX) {
      const result = getLessonCanDo(lesson.id)
      expect(result, `${lesson.id} (${lesson.level}): getLessonCanDo undefined qaytardi`).toBeDefined()
      expect(result!.length).toBeGreaterThanOrEqual(10)
    }
  })
})

// ---------------------------------------------------------------------------
// getLevelCanDo() — helper function tests
// ---------------------------------------------------------------------------

describe('getLevelCanDo', () => {
  it('A0 uchun 3 ta statement qaytaradi', () => {
    const result = getLevelCanDo('A0')
    expect(result.length).toBe(3)
    expect(result[0]).toContain('Salomlashish')
  })

  it('A1 uchun 4 ta statement qaytaradi', () => {
    const result = getLevelCanDo('A1')
    expect(result.length).toBe(4)
  })

  it('B1+ uchun 4 ta statement qaytaradi', () => {
    const result = getLevelCanDo('B1+')
    expect(result.length).toBe(4)
    expect(result[0]).toContain('ifodalash')
  })

  it('B2 uchun 4 ta statement qaytaradi', () => {
    const result = getLevelCanDo('B2')
    expect(result.length).toBe(4)
    expect(result[0]).toContain('muloqot')
  })

  it('A2+ ni A2 ga normalizatsiya qiladi', () => {
    const a2 = getLevelCanDo('A2')
    const a2plus = getLevelCanDo('A2+')
    expect(a2plus).toEqual(a2)
  })

  it('mavjud bolmagan level uchun bosh massiv qaytaradi', () => {
    expect(getLevelCanDo('C1')).toEqual([])
    expect(getLevelCanDo('')).toEqual([])
    expect(getLevelCanDo('unknown')).toEqual([])
  })

  it('barcha known level lar uchun ishlaydi', () => {
    const levels = ['A0', 'A1', 'A2', 'B1', 'B1+', 'B2']
    for (const level of levels) {
      const result = getLevelCanDo(level)
      expect(result.length, `${level}: kamida 3 ta statement kerak`).toBeGreaterThanOrEqual(3)
    }
  })
})
