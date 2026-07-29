import { describe, it, expect } from 'vitest'
import { resolveSectionItems } from '../lessonHelpers'
import { loadAllLessons } from '../../../data/dailyLessons'

type Item = { id: number }
const items = (...ids: number[]): Item[] => ids.map((id) => ({ id }))

describe('resolveSectionItems', () => {
  it('resolves by matching IDs when section.ids point to real item IDs', () => {
    const sections = [{ ids: [10, 20] }, { ids: [30] }]
    const pool = items(10, 20, 30)
    expect(resolveSectionItems(sections, 0, pool, pool)).toEqual(items(10, 20))
    expect(resolveSectionItems(sections, 1, pool, pool)).toEqual(items(30))
  })

  it('falls back to positional slicing when IDs do not match (legacy data)', () => {
    // section.ids qiymatlari (1,2,3) mashq ID'lariga (100..) mos kelmaydi
    const sections = [{ ids: [1, 2] }, { ids: [3] }]
    const source = items(100, 200, 300)
    expect(resolveSectionItems(sections, 0, [], source)).toEqual(items(100, 200))
    expect(resolveSectionItems(sections, 1, [], source)).toEqual(items(300))
  })

  it('LAST section absorbs remaining items when section counts under-cover the pool', () => {
    // sections faqat 2 slot da'vo qiladi, lekin 4 mashq bor → oxirgi section qolganini yutadi
    const sections = [{ ids: [1] }, { ids: [2] }]
    const source = items(11, 22, 33, 44)
    expect(resolveSectionItems(sections, 0, [], source)).toEqual(items(11))
    expect(resolveSectionItems(sections, 1, [], source)).toEqual(items(22, 33, 44))
  })

  it('does not crash when section counts over-claim the pool', () => {
    const sections = [{ ids: [1, 2, 3] }, { ids: [4, 5, 6] }]
    const source = items(11, 22) // faqat 2 ta
    expect(resolveSectionItems(sections, 0, [], source)).toEqual(items(11, 22))
    expect(resolveSectionItems(sections, 1, [], source)).toEqual([]) // over-run → bo'sh, crash yo'q
  })

  it('returns [] for out-of-range section index', () => {
    expect(resolveSectionItems([{ ids: [1] }], 5, [], items(1))).toEqual([])
  })
})

describe('lesson section coverage (tracked legacy debt)', () => {
  // Pozitsion fallback yo'lida oxirgi section qolgan mashqlarni yutadi (yuqoridagi
  // unit-testlar buni qat'iy tekshiradi). Ammo section.ids REAL ID'larga mos kelib
  // byId yo'li ishlaydigan bir qism eski darslarda data'ning o'zi har mashqni
  // sectionга ro'yxatlamagan → bir nechta mashq ko'rinmay qoladi. Bu DATA migratsiyasi
  // talab qiladi (P2 debt), shuning uchun bu test BLOKLAMAYDI — faqat regressiyani
  // kuzatish uchun baseline'dan oshmasligini ta'minlaydi.
  const ORPHAN_LESSON_BASELINE = 44 // 2026-07-25 holati; bu son FAQAT kamayishi kerak

  it('orphaned-exercise lesson count does not regress above baseline', async () => {
    const all = (await loadAllLessons()) as Record<string, unknown>[]
    let orphanLessons = 0
    const details: string[] = []
    for (const l of all) {
      const check = (sections?: { ids: number[] }[], source?: { id: number }[]) => {
        if (!sections?.length || !source?.length) return false
        const covered = new Set<number>()
        sections.forEach((_, i) =>
          resolveSectionItems(sections, i, source, source).forEach((it) => covered.add(it.id)),
        )
        const missing = source.filter((it) => !covered.has(it.id))
        return missing.length > 0
      }
      const exOrphan = check(l.exerciseSections as { ids: number[] }[], l.exercises as { id: number }[])
      const tsOrphan = check(l.testSections as { ids: number[] }[], l.tests as { id: number }[])
      if (exOrphan || tsOrphan) {
        orphanLessons++
        details.push(`[${l.level}] ${l.id}`)
      }
    }
    if (orphanLessons > 0) {
      // eslint-disable-next-line no-console
      console.warn(`⚠️ ${orphanLessons} dars section-coverage debt (P2 migratsiya): ${details.join(', ')}`)
    }
    expect(orphanLessons).toBeLessThanOrEqual(ORPHAN_LESSON_BASELINE)
  })
})
