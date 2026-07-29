import { findConfusablePair } from '../../data/confusable-pairs'

export function resolveSectionItems<T extends { id: number }>(
  sections: { ids: number[] }[],
  sectionIndex: number,
  pool: T[],
  source: T[],
): T[] {
  const section = sections[sectionIndex]
  if (!section) return []
  const byId = pool.filter((it) => section.ids.includes(it.id))
  if (byId.length > 0) return byId
  // Fallback: section.ids qiymatlari mashq ID'lariga mos kelmasa (eski data'da
  // fix-exercise-ids global ID'larga o'tkazgan, sectionlar yangilanmagan), pozitsion
  // bo'lib beramiz. MUHIM: oxirgi section qolgan BARCHA mashqlarni yutib yuboradi —
  // shunda section.ids.length yig'indisi source.length dan kam bo'lsa ham
  // (51 darsda shunday) hech bir mashq "yetim" qolib ko'rinmay qolmaydi.
  let cursor = 0
  for (let i = 0; i < sections.length; i++) {
    const isLast = i === sections.length - 1
    if (i === sectionIndex) {
      const end = isLast ? source.length : cursor + sections[i].ids.length
      return source.slice(cursor, Math.max(cursor, end))
    }
    cursor += sections[i].ids.length
  }
  return []
}

export function getConfusablePairs(vocabulary: { en: string }[]): { pairId: string; uzTitle: string; words: string[] }[] {
  const seen = new Set<string>()
  const result: { pairId: string; uzTitle: string; words: string[] }[] = []
  for (const v of vocabulary) {
    const pair = findConfusablePair(v.en)
    if (pair && !seen.has(pair.id)) {
      seen.add(pair.id)
      result.push({ pairId: pair.id, uzTitle: pair.uzTitle, words: pair.words })
    }
  }
  return result
}
