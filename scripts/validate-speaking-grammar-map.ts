import { SPEAKING_DAYS } from '../src/data/speakingPath'
import { LESSON_INDEX } from '../src/data/daily/lessonsIndex'
import type { LessonMeta } from '../src/data/daily/lessonsIndex'

interface ValidationResult {
  unknownLessonIds: { day: number; lessonId: string }[]
  speakingDaysWithoutLink: { day: number; cefr: string; title: string }[]
  unlinkedRegularLessons: LessonMeta[]
  totalSpeakingDays: number
  linkedSpeakingDays: number
  coveragePct: string
  b1Count: number
  b1plusCount: number
  linkedIds: string[]
  linkedSet: Set<string>
}

export function validateSpeakingGrammarMap(): ValidationResult {
  // 1. Barcha linkedLessonId'lar
  const linkedIds: string[] = []
  const unknownLessonIds: { day: number; lessonId: string }[] = []
  const speakingDaysWithoutLink: { day: number; cefr: string; title: string }[] = []

  for (const d of SPEAKING_DAYS) {
    if (d.linkedLessonId) {
      linkedIds.push(d.linkedLessonId)
      const exists = LESSON_INDEX.find(m => m.id === d.linkedLessonId)
      if (!exists) {
        unknownLessonIds.push({ day: d.day, lessonId: d.linkedLessonId })
      }
    } else {
      speakingDaysWithoutLink.push({ day: d.day, cefr: d.cefr, title: d.title })
    }
  }

  // 2. Qaysi regular daily lesson'lar speaking day'ga bog'lanmagan?
  const linkedSet = new Set(linkedIds)
  const linkedIdsUnique = [...linkedSet]
  const unlinkedRegularLessons = LESSON_INDEX.filter(m => !m.isReview && !linkedSet.has(m.id))

  // 3. Coverage
  const totalSpeakingDays = SPEAKING_DAYS.length
  const linkedSpeakingDays = totalSpeakingDays - speakingDaysWithoutLink.length
  const coveragePct = ((linkedSpeakingDays / totalSpeakingDays) * 100).toFixed(1)

  // 4. B1 count
  const b1Count = SPEAKING_DAYS.filter(d => d.cefr === 'B1').length
  const b1plusCount = SPEAKING_DAYS.filter(d => d.cefr === 'B1+').length

  return {
    unknownLessonIds,
    speakingDaysWithoutLink,
    unlinkedRegularLessons,
    totalSpeakingDays,
    linkedSpeakingDays,
    coveragePct,
    b1Count,
    b1plusCount,
    linkedIds: linkedIdsUnique,
    linkedSet,
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = validateSpeakingGrammarMap()
  let hasErrors = false

  console.log('══════════════════════════════════════════════')
  console.log('  Speaking ↔ Grammar Map Validation')
  console.log('══════════════════════════════════════════════\n')

  // ── Umumiy statistika ──────────────────────────────────
  console.log(`📊  Umumiy:`)
  console.log(`   Speaking days:     ${r.totalSpeakingDays}`)
  console.log(`   linkedLessonId:    ${r.linkedSpeakingDays} / ${r.totalSpeakingDays} (${r.coveragePct}%)`)
  console.log(`   B1 (days 52-108):  ${r.b1Count} kun`)
  console.log(`   B1+ (days 63-80):  ${r.b1plusCount} kun`)
  console.log()

  // ── Noma'lum lesson ID'lar ──────────────────────────────
  if (r.unknownLessonIds.length > 0) {
    hasErrors = true
    console.log('❌  Noma\'lum linkedLessonId (LESSON_INDEX da yo\'q):')
    for (const u of r.unknownLessonIds) {
      console.log(`   Day ${u.day}: "${u.lessonId}"`)
    }
    console.log()
  } else {
    console.log('✅  Barcha linkedLessonId\'lar LESSON_INDEX da mavjud')
    console.log()
  }

  // ── Bog'lanmagan speaking kunlari ────────────────────────
  if (r.speakingDaysWithoutLink.length > 0) {
    console.log('ℹ️  Speaking kunlarida linkedLessonId yo\'q:')
    for (const d of r.speakingDaysWithoutLink) {
      console.log(`   Day ${d.day} (${d.cefr}): ${d.title}`)
    }
    console.log()
  }

  // ── Bog'lanmagan daily lesson'lar ────────────────────────
  if (r.unlinkedRegularLessons.length > 0) {
    console.log(`ℹ️  Speaking day\'ga bog'lanmagan regular daily lesson'lar (${r.unlinkedRegularLessons.length}):`)
    const byLevel: Record<string, LessonMeta[]> = {}
    for (const m of r.unlinkedRegularLessons) {
      (byLevel[m.level] ??= []).push(m)
    }
    for (const [level, lessons] of Object.entries(byLevel)) {
      console.log(`   ${level} (${lessons.length}): ${lessons.map(m => m.id).join(', ')}`)
    }
    console.log()
  }



  // ── B1/B1+ split tekshiruvi ────────────────────────────
  let splitOk = true
  for (const d of SPEAKING_DAYS) {
    if ((d.day >= 52 && d.day <= 62) && d.cefr !== 'B1') {
      console.log(`❌  Day ${d.day}: B1 bo'lishi kerak, lekin ${d.cefr}`)
      splitOk = false
    }
    if ((d.day >= 63 && d.day <= 80) && d.cefr !== 'B1+') {
      console.log(`❌  Day ${d.day}: B1+ bo'lishi kerak, lekin ${d.cefr}`)
      splitOk = false
    }
    if (d.day >= 81 && d.day <= 108 && d.cefr !== 'B1') {
      console.log(`❌  Day ${d.day}: B1 bo'lishi kerak, lekin ${d.cefr}`)
      splitOk = false
    }
  }
  if (splitOk) {
    console.log(`✅  B1 to'g'ri: days 52-62 = B1, 63-80 = B1+, 81-108 = B1 (jami ${r.b1Count} kun B1, ${r.b1plusCount} kun B1+)`)
  }
  console.log()

  // ── Xulosa ────────────────────────────────────────────────
  console.log('══════════════════════════════════════════════')
  if (hasErrors) {
    console.log('❌  Validation FAILED — xatoliklar bor')
    process.exitCode = 1
  } else {
    console.log('✅  Validation PASSED')
  }
}
