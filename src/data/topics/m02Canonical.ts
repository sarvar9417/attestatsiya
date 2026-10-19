/**
 * M02 2026 canonical learner topics.
 *
 * The source textbooks and former static curriculum covered nine narrower
 * topics, while the published DB curriculum and the specification have four
 * assessment constructs. Preserve ALL nine legacy theory/quiz collections
 * inside the four canonical learner lessons; do not silently discard content.
 *
 * This only reorganizes locally authored theory. It does not approve the
 * pending 528 KTD questions or expose their keys.
 */
import type { TopicContent, TheoryBlock } from '../topicContent'
import { M02_SOURCE_THEORY } from './m02SourceTheory'
import { ICT5_M02_BOOK_ADDENDA } from './m02TextbookAuditICT5'
import { ICT6_M02_BOOK_ADDENDA } from './m02TextbookAuditICT6'

export interface CanonicalM02Group {
  id: string
  title: string
  legacyParts: readonly string[]
  sourceHint: string
}

export const M02_CANONICAL_GROUPS: readonly CanonicalM02Group[] = [
  {
    id: 'M02.01',
    title: 'Kompyuter qurilmalari va ularning vazifalari',
    legacyParts: ['M02.01', 'M02.02', 'M02.03', 'M02.04', 'M02.05'],
    sourceHint: 'Manba yoʻriqnomasi: ICT 5-sinf PDF 25–32; ICT 10-sinf PDF 6–20; Cambridge+ 9-sinf PDF 8–16, 24–46; Cambridge+ 10–11-sinf PDF 32–42.',
  },
  {
    id: 'M02.02',
    title: 'Operatsion tizimlar va ularning imkoniyatlari',
    legacyParts: ['M02.07'],
    sourceHint: 'Manba yoʻriqnomasi: ICT 5-sinf PDF 39–42; ICT 10-sinf PDF 24–28; Cambridge+ 9-sinf PDF 9–13; Cambridge+ 10–11-sinf PDF 50–57.',
  },
  {
    id: 'M02.03',
    title: 'Fayl va papkalar bilan ishlash',
    legacyParts: ['M02.09'],
    sourceHint: 'Manba yoʻriqnomasi: ICT 5-sinf PDF 43–47; ICT 10-sinf PDF 24–28. Aniq sahifa dalili item darajasida alohida tekshiriladi.',
  },
  {
    id: 'M02.04',
    title: 'Tizimli, amaliy va xizmat ko‘rsatuvchi dasturlar',
    legacyParts: ['M02.06', 'M02.08'],
    sourceHint: 'Manba yoʻriqnomasi: ICT 5-sinf PDF 39–42; ICT 10-sinf PDF 28–31; Cambridge+ 9-sinf PDF 9–13; Cambridge+ 10–11-sinf PDF 43–61.',
  },
] as const

export function buildCanonicalM02Topic(
  id: string,
  original: Readonly<Record<string, TopicContent>>,
): TopicContent | undefined {
  const group = M02_CANONICAL_GROUPS.find(part => part.id === id)
  if (!group) return undefined
  const parts = group.legacyParts.map(part => original[part])
  if (parts.some(part => !part)) return undefined

  const theory: TheoryBlock[] = []
  const questions: TopicContent['questions'] = []
  const questionIds = new Set<string>()

  for (const part of parts) {
    if (!part) continue
    theory.push({ type: 'heading', content: part.title })
    theory.push(...part.theory)
    for (const q of part.questions) {
      if (questionIds.has(q.id)) continue
      questionIds.add(q.id)
      questions.push(q)
    }
  }
  theory.push(...(M02_SOURCE_THEORY[id] ?? []))
  theory.push(...(ICT5_M02_BOOK_ADDENDA[id] ?? []))
  theory.push(...(ICT6_M02_BOOK_ADDENDA[id] ?? []))
  theory.push({ type: 'source', content: group.sourceHint })
  return {
    subtopicId: id,
    title: group.title,
    theory,
    questions,
    kind: 'chapter',
  }
}
