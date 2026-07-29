/**
 * Darslar bo'limidagi BARCHA mashqlarni sifat tekshiruvidan o'tkazadi.
 * Ishga tushirish:  npx tsx scripts/audit-exercises.ts
 *
 * Tekshiruvlar:
 *  - fill-blank/passage: ___ soni ↔ blanks soni mos kelishi
 *  - fill-blank/passage: javobni bo'sh joyga qo'yganда takror so'z paydo bo'lishi (reported bug)
 *  - fill-blank: (ishora) so'zi javobда takrorlanishi
 *  - multiple-choice/vocab-match: correct optionlar ichida bormi, dublikat optionlar
 *  - error-correction: errorPart savolда mavjudmi, correct == errorPart
 *  - bo'sh majburiy maydonlar
 *  - exerciseSections/testSections: mavjud bo'lmagan id'ga ishora / orphan mashq
 *  - global dublikat id
 */
import { getAllLessons } from '../src/data/daily/index'
import type { DailyLesson, DailyExercise } from '../src/data/dailyLessons'

type Issue = { lesson: string; id: number | string; type: string; sev: 'HIGH' | 'MED' | 'LOW'; kind: string; detail: string }
const issues: Issue[] = []
const add = (i: Issue) => issues.push(i)

const norm = (s: string) =>
  s.toLowerCase().replace(/[''‘’`]/g, "'").replace(/[""“”]/g, '"').replace(/\s+/g, ' ').trim()

// "She ___ (can) speak English." + ["can speak"] -> "She can speak (can) speak English."
function fillBlanks(text: string, blanks: string[]): string {
  let i = 0
  return text.replace(/_{2,}/g, () => blanks[i++] ?? '___')
}
function stripParenHints(s: string): string {
  return s.replace(/\([^)]*\)/g, ' ')
}
function words(sentence: string): string[] {
  return stripParenHints(sentence)
    .toLowerCase()
    .replace(/[.,!?;:"']/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}
function hasAdjacentDup(sentence: string): string | null {
  const wordList = words(sentence)
  for (let i = 1; i < wordList.length; i++) {
    // raqamli tokenlarni o'tkazib yubor (1,000,000 → "000 000" false-positive)
    if (/^\d+$/.test(wordList[i])) continue
    if (wordList[i] === wordList[i - 1] && wordList[i].length > 1) return wordList[i]
  }
  return null
}

function auditExercise(lessonTitle: string, ex: DailyExercise) {
  const where = { lesson: lessonTitle, id: ex.id, type: ex.type }

  // bo'sh instruction
  if ('instruction' in ex && (!ex.instruction || !ex.instruction.trim()))
    add({ ...where, sev: 'LOW', kind: 'empty-instruction', detail: 'instruction bo\'sh' })

  switch (ex.type) {
    case 'fill-blank':
    case 'passage': {
      const text = ex.type === 'fill-blank' ? ex.question : ex.passage
      const blankCount = (text.match(/_{2,}/g) || []).length
      if (blankCount !== ex.blanks.length && !(blankCount === 0 && ex.blanks.length > 0))
        add({ ...where, sev: 'HIGH', kind: 'blank-count', detail: `___ soni ${blankCount} ≠ blanks ${ex.blanks.length}` })
      ex.blanks.forEach((b, i) => {
        if (!b || !String(b).trim())
          add({ ...where, sev: 'HIGH', kind: 'empty-blank', detail: `blanks[${i}] bo'sh` })
      })
      // takror so'z testi (reported bug)
      const filled = fillBlanks(text, ex.blanks.map(b => b.split('/')[0]))
      const dup = hasAdjacentDup(filled)
      if (dup)
        add({ ...where, sev: 'HIGH', kind: 'duplicate-word', detail: `javob qo'yilganda takror: "...${dup} ${dup}..." → "${filled.trim()}"` })
      break
    }
    case 'multiple-choice': {
      const opts = ex.options
      if (!opts || opts.length < 2)
        add({ ...where, sev: 'HIGH', kind: 'few-options', detail: `optionlar soni ${opts?.length}` })
      else {
        if (!opts.map(norm).includes(norm(ex.correct)))
          add({ ...where, sev: 'HIGH', kind: 'correct-not-in-options', detail: `correct "${ex.correct}" optionlarда yo'q: [${opts.join(', ')}]` })
        const seen = new Set<string>()
        opts.forEach(o => { const n = norm(o); if (seen.has(n)) add({ ...where, sev: 'MED', kind: 'dup-options', detail: `dublikat option "${o}"` }); seen.add(n) })
      }
      break
    }
    case 'vocab-match': {
      if (!ex.options.map(norm).includes(norm(ex.correct)))
        add({ ...where, sev: 'HIGH', kind: 'correct-not-in-options', detail: `correct "${ex.correct}" optionlarда yo'q: [${ex.options.join(', ')}]` })
      const seen = new Set<string>()
      ex.options.forEach(o => { const n = norm(o); if (seen.has(n)) add({ ...where, sev: 'MED', kind: 'dup-options', detail: `dublikat option "${o}"` }); seen.add(n) })
      break
    }
    case 'error-correction': {
      // tavsifiy errorPart (qavs/uchburchak/«...» bilan) literal substring bo'lishi shart emas
      const descriptive = /[()…]|\.\.\.|\//.test(ex.errorPart)
      if (!descriptive && !norm(ex.question).includes(norm(ex.errorPart)))
        add({ ...where, sev: 'MED', kind: 'errorpart-missing', detail: `errorPart "${ex.errorPart}" savolда yo'q (highlight ishlamaydi): "${ex.question}"` })
      if (norm(ex.errorPart) === norm(ex.correct))
        add({ ...where, sev: 'MED', kind: 'no-correction', detail: `errorPart == correct ("${ex.correct}")` })
      break
    }
    case 'transformation': {
      if (!ex.correct || !ex.correct.trim())
        add({ ...where, sev: 'HIGH', kind: 'empty-correct', detail: 'correct bo\'sh' })
      break
    }
    case 'fill-table': {
      if (!ex.rows || ex.rows.length === 0)
        add({ ...where, sev: 'HIGH', kind: 'empty-rows', detail: 'rows bo\'sh' })
      break
    }
    case 'connection': {
      if (!ex.exampleAnswer || !ex.exampleAnswer.trim())
        add({ ...where, sev: 'MED', kind: 'empty-example', detail: 'exampleAnswer bo\'sh' })
      break
    }
  }

  // explanation (connection'da yo'q)
  if (ex.type !== 'connection' && ex.type !== 'elaborative' && (!('explanation' in ex) || !ex.explanation || !ex.explanation.trim()))
    add({ ...where, sev: 'LOW', kind: 'empty-explanation', detail: 'explanation bo\'sh' })
  else if (ex.type !== 'connection' && 'explanation' in ex && ex.explanation) {
    const len = ex.explanation.trim().length
    if (len < 10)
      add({ ...where, sev: 'HIGH', kind: 'explanation-too-short', detail: `explanation juda qisqa (${len} belgi, min 10): "${ex.explanation.trim()}"` })
    else if (len < 20)
      add({ ...where, sev: 'MED', kind: 'explanation-too-short', detail: `explanation juda qisqa (${len} belgi, min 20): "${ex.explanation.trim()}"` })
  }
}

// Eslatma: exerciseSections POZITSION (1,2,3..) yoki byId bilan ishlaydi (resolveSectionItems),
// shu sabab section ref tekshiruvi ishonchsiz — bu yerda o'tkazib yuborilди.

// === RUN ===
const lessons: DailyLesson[] = [...getAllLessons()]
const globalIds = new Map<number, string>()
let exCount = 0

for (const lesson of lessons) {
  const drills = (lesson.specialCases || []).flatMap(sc => sc.drills || [])
  const all = [...(lesson.exercises || []), ...(lesson.tests || []), ...drills]
  for (const ex of all) {
    exCount++
    if (globalIds.has(ex.id))
      add({ lesson: lesson.title, id: ex.id, type: ex.type, sev: 'HIGH', kind: 'duplicate-id', detail: `id ${ex.id} avval "${globalIds.get(ex.id)}" da ishlatilgan` })
    else globalIds.set(ex.id, lesson.title)
    auditExercise(lesson.title, ex)
  }
}

// === REPORT ===
const byKind = new Map<string, Issue[]>()
issues.forEach(i => { const k = `${i.sev}:${i.kind}`; if (!byKind.has(k)) byKind.set(k, []); byKind.get(k)!.push(i) })
const order = ['HIGH', 'MED', 'LOW']
const sorted = [...byKind.entries()].sort((a, b) => order.indexOf(a[0].split(':')[0]) - order.indexOf(b[0].split(':')[0]))

console.log(`\n=== MASHQLAR SIFAT AUDITI ===`)
console.log(`Darslar: ${lessons.length} · Mashqlar (exercises+tests): ${exCount} · Topilgan muammolar: ${issues.length}\n`)
const high = issues.filter(i => i.sev === 'HIGH').length
const med = issues.filter(i => i.sev === 'MED').length
const low = issues.filter(i => i.sev === 'LOW').length
console.log(`🔴 HIGH: ${high}  🟡 MED: ${med}  ⚪ LOW: ${low}\n`)

for (const [k, list] of sorted) {
  console.log(`\n### [${k}] — ${list.length} ta`)
  list.slice(0, 40).forEach(i => console.log(`  • #${i.id} (${i.type}) [${i.lesson}] — ${i.detail}`))
  if (list.length > 40) console.log(`  … va yana ${list.length - 40} ta`)
}

console.log(`\nAUDIT_EXIT=${high > 0 ? 1 : 0}`)
