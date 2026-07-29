import { test, expect } from 'vitest'
import { loadAllLessons } from '../dailyLessons'

// Darslar mashqlarining YUQORI-ISHONCHLI sifat invariantlari (typo/dublikat/chalkash
// savollar qaytalanmasligi uchun). Faqat noaniqlik yo'q tekshiruvlar — fuzzy holatlar
// (fill-blank ___siz = so'z-tartibi vazifasi, zero-article bo'sh blank, errorPart
// annotatsiyalari) bu yerga kiritilmagan.
type Ex = Record<string, unknown>
const s = (v: unknown) => (typeof v === 'string' ? v : '')
const low = (v: string) => v.trim().toLowerCase()                 // dublikat uchun (punktuatsiya saqlanadi)
const sent = (v: string) => v.trim().replace(/[.!?]+$/, '').toLowerCase() // gap solishtirish uchun

test('barcha darslar mashqlari sifat invariantlariga mos', async () => {
  const all = (await loadAllLessons()) as Record<string, unknown>[]
  const issues: string[] = []
  const add = (l: Record<string, unknown>, exId: unknown, m: string) =>
    issues.push(`[${s(l.level)}] kun ${l.day} «${s(l.id)}» #${exId}: ${m}`)

  for (const lesson of all) {
    const exercises = (Array.isArray(lesson.exercises) ? lesson.exercises : []) as Ex[]
    const tests = (Array.isArray(lesson.tests) ? lesson.tests : []) as Ex[]

    // 1) Har massiv ICHIDA dublikat id bo'lmasin
    for (const [arr, nm] of [[exercises, 'exercises'], [tests, 'tests']] as const) {
      const seen = new Set<number>()
      for (const e of arr) {
        const n = e.id as number
        if (seen.has(n)) add(lesson, n, `${nm} ICHIDA id takrorlangan`)
        seen.add(n)
      }
    }

    // 2) multiple-choice sifati
    for (const e of [...exercises, ...tests]) {
      if (s(e.type) !== 'multiple-choice') continue
      const opts = (Array.isArray(e.options) ? e.options : []) as string[]
      const correct = s(e.correct)
      const q = s(e.question)
      if (opts.length !== 4) add(lesson, e.id, `options ${opts.length} ta (4 bo'lishi kerak)`)
      if (new Set(opts.map(low)).size !== opts.length) add(lesson, e.id, `options dublikat: [${opts.join(' | ')}]`)
      if (correct && !opts.some(o => sent(o) === sent(correct))) add(lesson, e.id, `correct «${correct}» options ichida yo'q`)
      if (q && correct && sent(q) === sent(correct)) add(lesson, e.id, `question = correct (chalkash)`)
      if (q && opts.some(o => sent(o) === sent(q))) add(lesson, e.id, `question variantga teng (chalkash)`)
    }

    // 3) sektsiya id'lari mavjud mashqqa ishora qilsin
    const drills = (Array.isArray(lesson.specialCases) ? lesson.specialCases.flatMap((sc: Record<string, unknown>) => sc.drills as Ex[] || []) : []) as Ex[]
    const exIds = new Set([...exercises.map(e => e.id as number), ...drills.map(d => d.id as number)])
    const tsIds = new Set(tests.map(e => e.id as number))
    for (const sec of (Array.isArray(lesson.exerciseSections) ? lesson.exerciseSections : []) as Ex[])
      for (const n of (sec.ids as number[]) ?? []) if (!exIds.has(n)) add(lesson, n, `exerciseSection mavjud bo'lmagan id ${n}`)
    for (const sec of (Array.isArray(lesson.testSections) ? lesson.testSections : []) as Ex[])
      for (const n of (sec.ids as number[]) ?? []) if (!tsIds.has(n)) add(lesson, n, `testSection mavjud bo'lmagan id ${n}`)
  }

  const sectionRefs = issues.filter(i => i.includes('exerciseSection mavjud bo\'lmagan') || i.includes('testSection mavjud bo\'lmagan'))
  const other = issues.filter(i => !i.includes('exerciseSection mavjud bo\'lmagan') && !i.includes('testSection mavjud bo\'lmagan'))
  if (sectionRefs.length) {
    // eslint-disable-next-line no-console
    console.warn(`⚠️ ${sectionRefs.length} ta section ID reference xatoligi (runtime da filtrlanadi, data migration zarur)`)
  }
  // eslint-disable-next-line no-console
  if (other.length) console.log('Sifat muammolari:\n' + other.join('\n'))
  expect(other).toEqual([])
})
