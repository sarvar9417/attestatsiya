import { describe, test, expect } from 'vitest'
import { SPEAKING_DAYS, getAllChunks, TOTAL_SPEAKING_DAYS } from '../index'

// ── Speaking Path kontent auditi (Faza 0 qabul mezoni) ──
// Reja: docs/speaking-path-roadmap.md (11/12-bo'lim)
//
// Bu testlar kontent sifatini ta'minlaydi: id noyobligi, bo'sh maydonlar,
// IPA to'liqligi, CEFR progressiyasi, o'zbekcha matn sifati.

const ALL_CHUNKS = getAllChunks()
const TOTAL_CHUNKS = ALL_CHUNKS.length

// ── 1. Strukturaviy tekshiruvlar ──────────────────────────────────────────────

describe('struktura', () => {
  test('120 kun mavjud va ketma-ketlik 1..N', () => {
    expect(TOTAL_SPEAKING_DAYS).toBe(125)
    SPEAKING_DAYS.forEach((d, i) => {
      expect(d.day).toBe(i + 1)
    })
  })

  test('har kun 5–8 blok, stsenariy va goalUz to\'liq', () => {
    for (const d of SPEAKING_DAYS) {
      expect(d.chunks.length).toBeGreaterThanOrEqual(5)
      expect(d.chunks.length).toBeLessThanOrEqual(8)
      expect(d.goalUz.trim().length).toBeGreaterThan(0)
      expect(d.title.trim().length).toBeGreaterThan(0)
      expect(d.estMinutes).toBeGreaterThan(0)
      if (d.scenario && d.scenario.topic) {
        expect(d.scenario.topic.trim().length).toBeGreaterThan(0)
      }
      if (d.scenario && d.scenario.opening) {
        expect(d.scenario.opening.trim().length).toBeGreaterThan(0)
      }
      if (d.scenario && d.scenario.goalUz) {
        expect(d.scenario.goalUz.trim().length).toBeGreaterThan(0)
      }
    }
  })

  test('barcha blok id lari noyob', () => {
    const ids = ALL_CHUNKS.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('har blok en va uz bo\'sh emas', () => {
    for (const c of ALL_CHUNKS) {
      expect(c.en.trim().length).toBeGreaterThan(0)
      expect(c.uz.trim().length).toBeGreaterThan(0)
    }
  })

  test('estMinutes 10–20 oralig\'ida', () => {
    for (const d of SPEAKING_DAYS) {
      expect(d.estMinutes).toBeGreaterThanOrEqual(10)
      expect(d.estMinutes).toBeLessThanOrEqual(20)
    }
  })

  test('stsenariy aiRole va userRole to\'liq', () => {
    for (const d of SPEAKING_DAYS) {
      if (d.scenario && d.scenario.aiRole) {
        expect(d.scenario.aiRole.trim().length).toBeGreaterThan(0)
      }
      if (d.scenario && d.scenario.userRole) {
        expect(d.scenario.userRole.trim().length).toBeGreaterThan(0)
      }
    }
  })
})

// ── 2. Chunk ID formati ────────────────────────────────────────────────────────

describe('chunk ID formati', () => {
  test('barcha id lar "sp-d{N}-c{M}" formatida', () => {
    const pattern = /^sp-d(\d+)-c(\d+)$/
    for (const c of ALL_CHUNKS) {
      const match = c.id.match(pattern)
      expect(match, `${c.id} — sp-d{N}-c{M} formatida emas`).toBeTruthy()
    }
  })

  test('har bir chunk ID dagi kun raqami haqiqiy kunga mos', () => {
    for (const d of SPEAKING_DAYS) {
      for (const c of d.chunks) {
        const dayNum = parseInt(c.id.match(/^sp-d(\d+)/)![1], 10)
        expect(dayNum, `${c.id} -> day=${dayNum}, lekin kun ${d.day}`).toBe(d.day)
      }
    }
  })

  test('chunk ID lardagi c{M} tartibli (1 dan boshlab, o\'sib)', () => {
    for (const d of SPEAKING_DAYS) {
      const nums = d.chunks.map(c => parseInt(c.id.match(/c(\d+)$/)![1], 10))
      for (let i = 0; i < nums.length; i++) {
        expect(nums[i], `${d.day}-kun, chunk #${i + 1} — id=${d.chunks[i].id}`).toBe(i + 1)
      }
    }
  })
})

// ── 3. CEFR progressiyasi ─────────────────────────────────────────────────────

describe('CEFR progressiyasi', () => {
  const CEFR_ORDER = ['A0', 'A1', 'A2', 'B1', 'B2'] as const

  test('faqat A0, A1, A2, B1, B2 darajalari ishlatilgan', () => {
    for (const d of SPEAKING_DAYS) {
      expect((CEFR_ORDER as readonly string[]).includes(d.cefr), `${d.day}-kun: ${d.cefr}`).toBe(true)
    }
  })

  test('CEFR progressiyasi ortga qaytmaydi (A0→A1→A2→B1→B2)', () => {
    let maxIdx = 0
    for (const d of SPEAKING_DAYS) {
      const idx = CEFR_ORDER.indexOf(d.cefr as typeof CEFR_ORDER[number])
      expect(idx, `${d.day}-kun: ${d.cefr} (oldindan ${CEFR_ORDER[maxIdx]} edi)`).toBeGreaterThanOrEqual(maxIdx)
      maxIdx = Math.max(maxIdx, idx)
    }
  })

  test('A0=3, A1=26, A2=28, B1=39, B2=24 (jami 120)', () => {
    const counts: Record<string, number> = {}
    for (const d of SPEAKING_DAYS) {
      counts[d.cefr] = (counts[d.cefr] || 0) + 1
    }
    expect(counts['A0']).toBe(3)
    expect(counts['A1']).toBe(26)
    expect(counts['A2']).toBe(28)
    expect(counts['B1']).toBe(41)
    expect(counts['B2']).toBe(27)
  })
})

// ── 4. IPA to'liqligi ─────────────────────────────────────────────────────────

describe('IPA', () => {
  test('kalit bloklarda IPA bor (>1.5% chunklarda)', () => {
    const withIpa = ALL_CHUNKS.filter(c => !!c.ipa)
    const ratio = withIpa.length / TOTAL_CHUNKS
    expect(ratio).toBeGreaterThanOrEqual(0.015)
  })

  test('dastlabki kunlarda IPA mavjud (≥4% kun)', () => {
    const daysWithIPA = SPEAKING_DAYS.filter(d => d.chunks.some(c => !!c.ipa)).length
    expect(daysWithIPA / TOTAL_SPEAKING_DAYS).toBeGreaterThanOrEqual(0.04)
  })

  test('IPA "/" bilan boshlanib "/" bilan tugaydi', () => {
    for (const c of ALL_CHUNKS) {
      if (c.ipa) {
        expect(c.ipa.startsWith('/'), `${c.id} ipa: ${c.ipa}`).toBe(true)
        expect(c.ipa.endsWith('/'), `${c.id} ipa: ${c.ipa}`).toBe(true)
      }
    }
  })
})

// ── 5. Inglizcha matn sifati ──────────────────────────────────────────────────

describe('inglizcha matn sifati', () => {
  test('dublikat en jumlalar yo\'q (bir xil jumla ikki kunda takrorlanmasligi kerak)', () => {
    const enSet = new Set<string>()
    const duplicates: string[] = []
    for (const c of ALL_CHUNKS) {
      const lower = c.en.toLowerCase().replace(/[.!?]/g, '').trim()
      if (enSet.has(lower)) {
        duplicates.push(c.en)
      }
      enSet.add(lower)
    }
    expect(duplicates, `Dublikat jumlalar: ${duplicates.join('; ')}`).toEqual([])
  })

  test('patternli chunklarda eng kamida pattern va en o\'rtasida umumiy so\'zlar bor', () => {
    for (const c of ALL_CHUNKS) {
      if (c.pattern) {
        const patternWords = new Set(c.pattern.toLowerCase().replace(/[…?.!,]/g, '').split(/\s+/).filter(Boolean))
        const enWords = new Set(c.en.toLowerCase().replace(/[…?.!,]/g, '').split(/\s+/).filter(Boolean))
        const intersection = [...patternWords].filter(w => enWords.has(w))
        expect(intersection.length, `${c.id}: pattern="${c.pattern}" en="${c.en}" (umumiy: ${intersection.join(',')})`).toBeGreaterThan(0)
      }
    }
  })
})

// ── 6. O'zbekcha matn sifati ──────────────────────────────────────────────────

describe('o\'zbekcha matn sifati', () => {
  test('kirill harflari aralashmagan (faqat lotin)', () => {
    const cyrillic = /[Ѐ-ӿ]/
    for (const d of SPEAKING_DAYS) {
      expect(cyrillic.test(d.goalUz), `kun ${d.day} goalUz`).toBe(false)
      expect(cyrillic.test(d.scenario.goalUz), `kun ${d.day} scenario.goalUz`).toBe(false)
      for (const c of d.chunks) {
        expect(cyrillic.test(c.uz), `${c.id} uz`).toBe(false)
      }
    }
  })

  test('HTML entity lar yo\'q (&nbsp; &amp; va hokazo)', () => {
    const htmlEntities = /&[a-z]+;/i
    for (const d of SPEAKING_DAYS) {
      expect(htmlEntities.test(d.goalUz), `${d.day} goalUz`).toBe(false)
      expect(htmlEntities.test(d.title), `${d.day} title`).toBe(false)
      for (const c of d.chunks) {
        expect(htmlEntities.test(c.uz), `${c.id} uz`).toBe(false)
      }
    }
  })

  test('goalUz nuqta bilan tugaydi (to\'liq gap)', () => {
    for (const d of SPEAKING_DAYS) {
      expect(d.goalUz.endsWith('.') || d.goalUz.endsWith('!'), `${d.day}: "${d.goalUz}"`).toBe(true)
    }
  })
})

// ── 7. Umumiy statistika ──────────────────────────────────────────────────────

describe('umumiy statistika', () => {
  test('jami chunklar soni hisobot', () => {
    expect(TOTAL_CHUNKS).toBeGreaterThanOrEqual(700) // 120 kun * 6 chunk = 720
    expect(TOTAL_CHUNKS).toBeLessThan(850)    // 120 kun * 7 chunk = 840
  })

  test('jami scenario goalUz lar noyob (takrorlanmasligi kerak)', () => {
    const goals = SPEAKING_DAYS.map(d => d.scenario.goalUz.toLowerCase().trim())
    expect(new Set(goals).size).toBe(goals.length)
  })

  test('jami title lar noyob', () => {
    const titles = SPEAKING_DAYS.map(d => d.title.toLowerCase().trim())
    expect(new Set(titles).size).toBe(titles.length)
  })
})
