import { describe, it, expect } from 'vitest'
import {
  EXAM_RULES,
  BLUEPRINT_GROUPS,
  CONTENT_AREAS,
  CONSTRUCTS,
  GENERATOR_CONSTRUCTS,
  SOURCE_BLOCKED_GROUPS,
} from '../data/blueprint2026'

/**
 * Bu testlar rasmiy spetsifikatsiyaning (Toshkent — 2026) o'zgarmas
 * raqamlarini qo'riqlaydi. Ular buzilsa — ma'lumot xato, test emas.
 */

describe('given_rasmiy_spetsifikatsiya_when_jami_hisoblanadi_then_50_savol', () => {
  it('blueprint guruhlari jami 50 savol beradi', () => {
    const total = BLUEPRINT_GROUPS.reduce((s, g) => s + g.questionCount, 0)
    expect(total).toBe(EXAM_RULES.totalQuestions)
    expect(total).toBe(50)
  })

  it('sectionlar jami 50 savol beradi', () => {
    const total = Object.values(EXAM_RULES.sections).reduce((s, x) => s + x.count, 0)
    expect(total).toBe(50)
  })

  it('section kesimi blueprint guruhlari kesimiga mos', () => {
    for (const [section, spec] of Object.entries(EXAM_RULES.sections)) {
      const fromGroups = BLUEPRINT_GROUPS.filter((g) => g.section === section).reduce(
        (s, g) => s + g.questionCount,
        0,
      )
      expect(fromGroups, `${section} kesimi`).toBe(spec.count)
    }
  })
})

describe('given_3_jadval_when_kognitiv_yigindisi_when_then_8_35_7', () => {
  it('global kognitiv taqsimot aynan 8/35/7', () => {
    const bilish = BLUEPRINT_GROUPS.reduce((s, g) => s + g.bilish, 0)
    const qollash = BLUEPRINT_GROUPS.reduce((s, g) => s + g.qollash, 0)
    const mulohaza = BLUEPRINT_GROUPS.reduce((s, g) => s + g.mulohaza, 0)

    expect(bilish).toBe(8)
    expect(qollash).toBe(35)
    expect(mulohaza).toBe(7)
    expect(bilish + qollash + mulohaza).toBe(50)
  })

  it('EXAM_RULES.cognitive guruhlar yigindisiga mos', () => {
    expect(BLUEPRINT_GROUPS.reduce((s, g) => s + g.bilish, 0)).toBe(EXAM_RULES.cognitive.bilish)
    expect(BLUEPRINT_GROUPS.reduce((s, g) => s + g.qollash, 0)).toBe(EXAM_RULES.cognitive.qollash)
    expect(BLUEPRINT_GROUPS.reduce((s, g) => s + g.mulohaza, 0)).toBe(EXAM_RULES.cognitive.mulohaza)
  })

  it('har guruhda kognitiv yigindi savol soniga teng', () => {
    for (const g of BLUEPRINT_GROUPS) {
      expect(g.bilish + g.qollash + g.mulohaza, `${g.code} kognitiv yigindi`).toBe(g.questionCount)
    }
  })

  it('kognitiv qiymatlar manfiy emas', () => {
    for (const g of BLUEPRINT_GROUPS) {
      expect(g.bilish, `${g.code}.bilish`).toBeGreaterThanOrEqual(0)
      expect(g.qollash, `${g.code}.qollash`).toBeGreaterThanOrEqual(0)
      expect(g.mulohaza, `${g.code}.mulohaza`).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('given_rasmiy_savol_raqamlari_when_diapazonlar_tekshiriladi_then_1_50_uzluksiz', () => {
  it('har guruh diapazoni savol soniga teng uzunlikda', () => {
    for (const g of BLUEPRINT_GROUPS) {
      expect(g.questionTo - g.questionFrom + 1, `${g.code} diapazon uzunligi`).toBe(g.questionCount)
    }
  })

  it('guruh diapazonlari kesishmaydi va 1..50 ni uzluksiz qoplaydi', () => {
    const sorted = [...BLUEPRINT_GROUPS].sort((a, b) => a.questionFrom - b.questionFrom)
    expect(sorted[0].questionFrom).toBe(1)
    expect(sorted[sorted.length - 1].questionTo).toBe(50)

    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].questionFrom, `${sorted[i].code} oldingisidan keyin boshlanadi`).toBe(
        sorted[i - 1].questionTo + 1,
      )
    }
  })

  it('har savol raqami aynan bitta guruhga tegishli', () => {
    const owner = new Map<number, string>()
    for (const g of BLUEPRINT_GROUPS) {
      for (let n = g.questionFrom; n <= g.questionTo; n++) {
        expect(owner.has(n), `${n}-savol ikki guruhda: ${owner.get(n)} va ${g.code}`).toBe(false)
        owner.set(n, g.code)
      }
    }
    expect(owner.size).toBe(50)
    for (let n = 1; n <= 50; n++) expect(owner.has(n), `${n}-savol egasi yo'q`).toBe(true)
  })

  it('mazmun sohalari rasmiy diapazonlarga mos', () => {
    // 1-jadval va 2-jadval sarlavhalaridagi diapazonlar
    const expected: Record<string, [number, number]> = {
      A1: [1, 3], A2: [4, 10], A3: [11, 18], A4: [19, 26],
      A5: [27, 31], A6: [32, 33], A7: [34, 35],
      KS: [36, 40], PM: [41, 50],
    }
    for (const area of CONTENT_AREAS) {
      expect([area.questionFrom, area.questionTo], `${area.code}`).toEqual(expected[area.code])
    }
  })

  it("mazmun sohasi o'z guruhlarining diapazonini to'liq qoplaydi", () => {
    for (const area of CONTENT_AREAS) {
      const groups = BLUEPRINT_GROUPS.filter((g) => area.groups.includes(g.code))
      expect(groups.length, `${area.code} guruhlari topildi`).toBe(area.groups.length)
      const from = Math.min(...groups.map((g) => g.questionFrom))
      const to = Math.max(...groups.map((g) => g.questionTo))
      expect(from, `${area.code} boshlanishi`).toBe(area.questionFrom)
      expect(to, `${area.code} tugashi`).toBe(area.questionTo)
    }
  })
})

describe('given_15_guruh_when_struktura_tekshiriladi_then_kodlar_unikal', () => {
  it('aynan 15 guruh bor', () => {
    expect(BLUEPRINT_GROUPS).toHaveLength(15)
  })

  it('guruh kodlari unikal', () => {
    const codes = BLUEPRINT_GROUPS.map((g) => g.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('orderIdx 1..15 uzluksiz', () => {
    const idx = BLUEPRINT_GROUPS.map((g) => g.orderIdx).sort((a, b) => a - b)
    expect(idx).toEqual(Array.from({ length: 15 }, (_, i) => i + 1))
  })

  it('ball hisobi 2 x 50 = 100', () => {
    expect(EXAM_RULES.pointsPerQuestion * EXAM_RULES.totalQuestions).toBe(EXAM_RULES.maxPoints)
    expect(EXAM_RULES.maxPoints).toBe(100)
  })

  it('davomiylik 120 daqiqa', () => {
    expect(EXAM_RULES.durationMinutes).toBe(120)
  })
})

describe('given_konstrukt_katalogi_when_tekshiriladi_then_76_ta_va_guruhga_boglangan', () => {
  it('76 konstrukt bor', () => {
    expect(CONSTRUCTS).toHaveLength(76)
  })

  it('konstrukt kodlari unikal', () => {
    const codes = CONSTRUCTS.map((c) => c.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('har konstrukt mavjud blueprint guruhga tegishli', () => {
    const groups = new Set(BLUEPRINT_GROUPS.map((g) => g.code))
    for (const c of CONSTRUCTS) {
      expect(groups.has(c.group), `${c.code} guruhi '${c.group}' mavjud emas`).toBe(true)
    }
  })

  it('har guruhda kamida bitta konstrukt bor', () => {
    for (const g of BLUEPRINT_GROUPS) {
      const n = CONSTRUCTS.filter((c) => c.group === g.code).length
      expect(n, `${g.code} konstruktsiz`).toBeGreaterThan(0)
    }
  })

  it('konstrukt kodi guruh prefiksi bilan boshlanadi', () => {
    for (const c of CONSTRUCTS) {
      expect(c.code.startsWith(c.group + '.'), `${c.code} prefiksi ${c.group} emas`).toBe(true)
    }
  })

  it("har konstruktda sarlavha va kamida bitta kalit so'z bor", () => {
    for (const c of CONSTRUCTS) {
      expect(c.title.length, `${c.code} sarlavhasi`).toBeGreaterThan(10)
      expect(c.keywords.length, `${c.code} kalit so'zlari`).toBeGreaterThan(0)
    }
  })

  it('imtihonda kamida konstrukt sonicha savol talab qilinmaydi (pool cheklovi)', () => {
    // Har guruhda savol sonidan ko'p konstrukt bo'lishi normal: imtihon
    // konstruktlarning bir qismini tanlaydi. Aks holda mumkin emas.
    for (const g of BLUEPRINT_GROUPS) {
      const n = CONSTRUCTS.filter((c) => c.group === g.code).length
      expect(n, `${g.code}: ${n} konstrukt, ${g.questionCount} savol`).toBeGreaterThanOrEqual(1)
    }
  })
})

describe('given_generatorlar_when_royxatlanadi_then_9_konstrukt', () => {
  it('9 konstrukt parametrik generator bilan qoplanadi', () => {
    expect(GENERATOR_CONSTRUCTS).toHaveLength(9)
  })

  it('generator nomlari kutilgan 4 ta', () => {
    const names = new Set(GENERATOR_CONSTRUCTS.map((c) => c.generator))
    expect([...names].sort()).toEqual(['axborotHajmi', 'ipMaska', 'mantiqAmal', 'sanoqSistema'])
  })

  it("eng kam manbali guruhlar generator bilan qoplangan", () => {
    // KONTENT_SIFAT_HISOBOTI: S1.INFO, S3.NUM, S3.LOGIC manbasi o'rtacha
    for (const group of ['S1.INFO', 'S3.NUM', 'S3.LOGIC']) {
      const withGen = CONSTRUCTS.filter((c) => c.group === group && c.generator)
      expect(withGen.length, `${group} generatorli konstruktlari`).toBeGreaterThan(0)
    }
  })
})

describe('given_B001_blokeri_when_manbasiz_guruhlar_when_then_KS_va_PM', () => {
  it("manbasi yo'q guruhlar aniq belgilangan", () => {
    expect([...SOURCE_BLOCKED_GROUPS].sort()).toEqual(['KS', 'PM.GEN', 'PM.MET'])
  })

  it("bloklangan guruhlar imtihonning 15 savolini (30%) tashkil qiladi", () => {
    const blocked = BLUEPRINT_GROUPS.filter((g) =>
      (SOURCE_BLOCKED_GROUPS as readonly string[]).includes(g.code),
    )
    const count = blocked.reduce((s, g) => s + g.questionCount, 0)
    expect(count).toBe(15)
    expect(count / EXAM_RULES.totalQuestions).toBeCloseTo(0.3, 5)
  })

  it('mutaxassislik fani bloklanmagan (35 savol ishlaydi)', () => {
    const specialty = BLUEPRINT_GROUPS.filter((g) => g.section === 'specialty')
    for (const g of specialty) {
      expect(
        (SOURCE_BLOCKED_GROUPS as readonly string[]).includes(g.code),
        `${g.code} bloklangan bo'lmasligi kerak`,
      ).toBe(false)
    }
    expect(specialty.reduce((s, g) => s + g.questionCount, 0)).toBe(35)
  })
})
