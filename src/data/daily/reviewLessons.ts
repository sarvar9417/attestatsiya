// ═══════════════════════════════════════════════════════════════════════════
// reviewLessons.ts — Oraliq takror (spaced-review) checkpoint'lari
//
// Bular AVTOMATIK generatsiya qilinadi: har bir review o'zidan oldingi darslarning
// O'Z formula va mashqlaridan to'planadi. Shu sabab darslar tartibi/kontenti
// o'zgarsa, takrorlar HAR DOIM ular bilan sinxron qoladi (eski qo'lda yozilgan
// 9000+ qatorli desinxron versiya o'rniga).
//
// coversDays — bu yerda "regular" (review'siz) ketma-ketlikdagi POZITSIYA (1..101).
// loadAllLessons aynan shu pozitsiyadan keyin review'ni joylashtiradi.
// ═══════════════════════════════════════════════════════════════════════════

import type { DailyLesson, DailyExercise, ReviewLesson } from '../dailyLessons'
import { A1_LESSONS_NEW } from './a1Registry'
import { A2_LESSONS } from './lessonsA2'
import { B1_LESSONS_NEW } from './lessonsB1'
import { B1PLUS_LESSONS_NEW } from './lessonsB1plus'
import { B2_LESSONS_NEW } from './lessonsB2'

// loadAllLessons bilan AYNAN bir xil tartib
const REGULAR: DailyLesson[] = [
  ...A1_LESSONS_NEW,
  ...A2_LESSONS,
  ...B1_LESSONS_NEW,
  ...B1PLUS_LESSONS_NEW,
  ...B2_LESSONS_NEW,
]

const WINDOW = 5      // har necha darsdan keyin takror
const EX_PER = 2      // har darsdan nechta mashq olinadi
const TEST_PER = 1    // har darsdan nechta test olinadi

// Daraja-oxiri to'liq takror darslari (a1Review, a2Review2, ...) — window'ga kirmaydi
const isLevelReview = (l: DailyLesson) => /\breview\b|takror/i.test(l.title)
const cleanTitle = (t: string) => t.split('—')[0].trim()

interface Win { lesson: DailyLesson; pos: number }

function buildReview(win: Win[], idx: number): ReviewLesson {
  const level = win[win.length - 1].lesson.level
  const positions = win.map(w => w.pos)
  const topics = win.map(w => cleanTitle(w.lesson.title))

  let exId = 700000 + idx * 1000
  let tsId = 700000 + idx * 1000 + 500
  const exercises: DailyExercise[] = []
  const tests: DailyExercise[] = []
  for (const { lesson } of win) {
    // Mashqlar — fill-blank afzal (ReviewView input bo'limi shunday ishlaydi, original
    // review1 ham shunday edi). multiple-choice mashqlar variantsiz chiqadi, shuning
    // uchun ulardan qochamiz: fill-blank → boshqa matn-input turlari → (oxirgi chora) hammasi
    const allEx = lesson.exercises ?? []
    const fb = allEx.filter(e => e.type === 'fill-blank')
    const nonMc = allEx.filter(e => e.type !== 'multiple-choice')
    const exPool = fb.length ? fb : nonMc.length ? nonMc : allEx
    for (const e of exPool.slice(0, EX_PER)) exercises.push({ ...e, id: ++exId } as DailyExercise)
    // MUHIM: ReviewView test bo'limi faqat multiple-choice (t.options) bilan ishlaydi,
    // shuning uchun testlarga FAQAT multiple-choice savollar olinadi
    const mcTests = (lesson.tests ?? []).filter(t => t.type === 'multiple-choice')
    if (mcTests.length === 0) {
      // Agar MC test qolmagan bo'lsa, barcha testlarni olish (ReviewView shunga moslashtirilishi kerak)
      const allTests = (lesson.tests ?? [])
      for (const t of allTests.slice(0, TEST_PER)) tests.push({ ...t, id: ++tsId } as DailyExercise)
    } else {
      for (const t of mcTests.slice(0, TEST_PER)) tests.push({ ...t, id: ++tsId } as DailyExercise)
    }
  }

  // keyRules — har darsning formulalaridan qisqa eslatma kartasi
  const keyRules = win
    .filter(w => (w.lesson.formulas ?? []).length > 0)
    .map(w => ({
      topic: cleanTitle(w.lesson.title),
      icon: '📌',
      color: w.lesson.formulas[0]?.color ?? 'blue',
      rules: w.lesson.formulas.map(f => `${f.label}: ${f.structure.replace(/\n/g, ' / ')}`),
    }))

  return {
    id: `auto-review-${idx + 1}`,
    type: 'review',
    title: `🔁 ${level} takror`,
    subtitle: topics.join(' · '),
    level,
    afterDay: Math.max(...positions),
    coversDays: positions,
    coversTopics: topics,
    keyRules,
    exercises,
    exerciseSections: [
      { title: 'Takrorlash mashqlari', desc: topics.join(', '), color: 'amber', icon: '🔁', ids: exercises.map(e => e.id) },
    ],
    tests,
    testSections: [
      { title: 'Nazorat testi', desc: 'Aralash savollar', color: 'orange', icon: '✅', ids: tests.map(t => t.id) },
    ],
  }
}

function generate(): ReviewLesson[] {
  const reviews: ReviewLesson[] = []
  let buffer: Win[] = []
  let lastLevel = REGULAR[0]?.level
  let idx = 0
  const flush = () => {
    // kamida 3 ta dars bo'lsa takror chiqaramiz — daraja-review oldidagi 1-2 darslik
    // qoldiq ortiqcha mini-takror yaratmaydi (ularni daraja-review qamrab oladi)
    if (buffer.length >= 3) reviews.push(buildReview(buffer, idx++))
    buffer = []
  }
  REGULAR.forEach((lesson, i) => {
    if (lesson.level !== lastLevel) { flush(); lastLevel = lesson.level }
    if (isLevelReview(lesson)) { flush(); return } // daraja-takrori oldidan flush, uni qamramaymiz
    buffer.push({ lesson, pos: i + 1 })
    if (buffer.length >= WINDOW) flush()
  })
  flush()
  return reviews
}

export const REVIEW_LESSONS: ReviewLesson[] = generate()
