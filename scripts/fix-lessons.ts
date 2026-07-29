/**
 * scripts/fix-lessons.ts
 *
 * Har bir dars uchun:
 *  1. rules[] matni va vocabulary[] ni taqqoslaydi
 *  2. Yetishmayotgan so'zlarni aniqlaydi
 *  3. Barcha qoidalarni qamrab olmagan mashqlarni aniqlaydi
 *  4. Claude API orqali additions generatsiya qiladi
 *  5. TypeScript manba fayliga insertatsiya qiladi
 *
 * Usage:
 *   tsx scripts/fix-lessons.ts                      # barcha fayllar
 *   tsx scripts/fix-lessons.ts --file=a1Part1       # bitta fayl
 *   tsx scripts/fix-lessons.ts --file=a1Part1 --lesson=alphabet-greetings
 *   tsx scripts/fix-lessons.ts --file=a1Part1 --dry-run
 *   tsx scripts/fix-lessons.ts --skip-ts-check      # TypeScript tekshiruvini o'tkazib yubor
 */

import { readFileSync, writeFileSync, copyFileSync } from 'fs'
import { execSync } from 'child_process'
import { join, basename } from 'path'

const PROJECT_ROOT = join(process.cwd())

// ─── Config ──────────────────────────────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const CLAUDE_MODEL = 'claude-sonnet-4-6'
const API_TIMEOUT_MS = 60_000
const MAX_RETRIES = 3

const ALL_LESSON_FILES = [
  'a1Part1', 'a1Part2',
  'a2Part1', 'a2Part2', 'a2Part3', 'a2Part4',
  'b1Part1', 'b1Extra',
  'b1plusPart1', 'b1plusPart2',
  'b2Part1', 'b2Part2', 'b2Part3', 'b2Extra',
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface VocabWord {
  en: string
  uz: string
  example: string
  rule: string
}

interface Exercise {
  id: number
  type: 'fill-blank' | 'multiple-choice' | 'error-correction' | 'transformation' | 'fill-table'
  instruction: string
  question: string
  blanks?: string[]
  options?: [string, string, string, string]
  correct?: string
  errorPart?: string
  hint?: string
  rows?: { adj: string; comp: string; sup: string }[]
  explanation: string
}

interface ExerciseSection {
  title: string
  desc: string
  color: string
  icon: string
  ids: number[]
}

interface LessonAdditions {
  vocabulary: VocabWord[]
  exercises: Exercise[]
  tests?: Exercise[]
  newSections: ExerciseSection[]
  newTestSections?: ExerciseSection[]
  specialCaseDrills: Record<string, Exercise[]>
}

interface LessonSnapshot {
  id: string
  title: string
  level: string
  day: number
  rulesText: string
  currentVocab: string[]
  currentExerciseIds: number[]
  currentTestIds: number[]
  currentExerciseSummary: string
  currentTestSummary: string
  specialCaseSummary: string
  maxExId: number
  maxTestId: number
}

// ─── CRLF normalizatsiyasi ────────────────────────────────────────────────────

let originalLineEnding: '\n' | '\r\n' = '\n'
function detectLineEnding(content: string): '\n' | '\r\n' {
  return content.includes('\r\n') ? '\r\n' : '\n'
}

// ─── Claude API ──────────────────────────────────────────────────────────────

async function callClaude(prompt: string, attempt = 1): Promise<string> {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY env var kerak!')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    })

    clearTimeout(timer)

    if (res.status === 429 && attempt < MAX_RETRIES) {
      const wait = Math.pow(2, attempt) * 1000
      console.warn(`     ⏳ 429 rate limit, ${wait}ms kutib qayta urinish (${attempt}/${MAX_RETRIES})...`)
      await new Promise(r => setTimeout(r, wait))
      return callClaude(prompt, attempt + 1)
    }

    if (res.status >= 500 && attempt < MAX_RETRIES) {
      const wait = Math.pow(2, attempt) * 1000
      console.warn(`     ⏳ ${res.status} server xatosi, ${wait}ms kutib qayta urinish (${attempt}/${MAX_RETRIES})...`)
      await new Promise(r => setTimeout(r, wait))
      return callClaude(prompt, attempt + 1)
    }

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Claude API xatosi: ${res.status} — ${err}`)
    }

    const data = await res.json() as any
    return data.content?.[0]?.text ?? ''
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof DOMException && err.name === 'AbortError') {
      if (attempt < MAX_RETRIES) {
        console.warn(`     ⏳ Timeout, qayta urinish (${attempt}/${MAX_RETRIES})...`)
        await new Promise(r => setTimeout(r, 2000))
        return callClaude(prompt, attempt + 1)
      }
      throw new Error('Claude API timeout — 60 soniya ichida javob kelmadi')
    }
    throw err
  }
}

// ─── Lesson parsing (from source text) ───────────────────────────────────────

function findLessonsInFile(content: string): { exportName: string; lessonId: string }[] {
  const results: { exportName: string; lessonId: string }[] = []
  const pattern = /export\s+const\s+(\w+)\s*:\s*DailyLesson\s*=\s*\{/g
  let m: RegExpExecArray | null
  while ((m = pattern.exec(content)) !== null) {
    const blockStart = m.index
    const blockEnd = content.indexOf('};', blockStart)
    if (blockEnd === -1) continue
    const block = content.slice(blockStart, blockEnd + 2)
    const idMatch = block.match(/id\s*:\s*['"]([^'"]+)['"]/)
    if (idMatch) {
      results.push({ exportName: m[1], lessonId: idMatch[1] })
    }
  }
  return results
}

function findLessonStart(content: string, exportName: string): number {
  const pattern = new RegExp(`export\\s+const\\s+${exportName}\\s*:\\s*DailyLesson`)
  const m = content.match(pattern)
  return m?.index ?? -1
}

function getLessonBlock(content: string, start: number): string {
  const nextExport = content.indexOf('\nexport const', start + 1)
  return nextExport === -1 ? content.slice(start) : content.slice(start, nextExport)
}

function matchAllToArray(content: string, regex: RegExp): RegExpExecArray[] {
  const results: RegExpExecArray[] = []
  let m: RegExpExecArray | null
  while ((m = regex.exec(content)) !== null) {
    results.push(m)
  }
  return results
}

function extractCurrentVocab(lessonBlock: string): string[] {
  const vocabStart = lessonBlock.indexOf('vocabulary:')
  const examplesStart = lessonBlock.indexOf('examples:', vocabStart)
  if (vocabStart === -1 || examplesStart === -1) return []
  const section = lessonBlock.slice(vocabStart, examplesStart)
  return matchAllToArray(section, /en\s*:\s*['"]([^'"]+)['"]/g).map(m => m[1])
}

function extractExerciseIds(lessonBlock: string): number[] {
  const exStart = lessonBlock.indexOf('\n  exercises:')
  const secStart = lessonBlock.indexOf('exerciseSections:', exStart)
  if (exStart === -1 || secStart === -1) return []
  const section = lessonBlock.slice(exStart, secStart)
  return matchAllToArray(section, /\bid\s*:\s*(\d+)/g).map(m => parseInt(m[1]))
}

function extractTestIds(lessonBlock: string): number[] {
  const testStart = lessonBlock.indexOf('\n  tests:')
  const testSecStart = lessonBlock.indexOf('testSections:', testStart)
  if (testStart === -1 || testSecStart === -1) return []
  const section = lessonBlock.slice(testStart, testSecStart)
  return matchAllToArray(section, /\bid\s*:\s*(\d+)/g).map(m => parseInt(m[1]))
}

function extractRulesText(lessonBlock: string): string {
  const rulesStart = lessonBlock.indexOf('rules:')
  const vocabStart = lessonBlock.indexOf('vocabulary:', rulesStart)
  if (rulesStart === -1 || vocabStart === -1) return ''
  return lessonBlock.slice(rulesStart, vocabStart).substring(0, 3000)
}

function extractExerciseSummary(lessonBlock: string): string {
  const exStart = lessonBlock.indexOf('\n  exercises:')
  const secStart = lessonBlock.indexOf('exerciseSections:', exStart)
  if (exStart === -1 || secStart === -1) return ''
  return lessonBlock.slice(exStart, secStart).split('\n')
    .filter(l => l.includes('type:') || l.includes('question:'))
    .slice(0, 30)
    .join('\n')
}

function extractTestSummary(lessonBlock: string): string {
  const testStart = lessonBlock.indexOf('\n  tests:')
  const testSecStart = lessonBlock.indexOf('testSections:', testStart)
  if (testStart === -1 || testSecStart === -1) return ''
  return lessonBlock.slice(testStart, testSecStart).split('\n')
    .filter(l => l.includes('type:') || l.includes('question:'))
    .slice(0, 20)
    .join('\n')
}

function extractSpecialCaseSummary(lessonBlock: string): string {
  const scStart = lessonBlock.indexOf('specialCases:')
  const exStart = lessonBlock.indexOf('\n  exercises:', scStart)
  if (scStart === -1 || exStart === -1) return "yo'q"
  const section = lessonBlock.slice(scStart, exStart)
  const ids = matchAllToArray(section, /id\s*:\s*['"]([^'"]+)['"]/g).map(m => m[1])
  const drillCounts = matchAllToArray(section, /drills\s*:\s*\[/g).length
  return `${ids.length} ta specialCase, jami ${drillCounts} ta drills bloki`
}

function buildSnapshot(content: string, exportName: string, lessonId: string): LessonSnapshot | null {
  const start = findLessonStart(content, exportName)
  if (start === -1) return null

  const lessonBlock = getLessonBlock(content, start)
  const currentVocab = extractCurrentVocab(lessonBlock)
  const currentExerciseIds = extractExerciseIds(lessonBlock)
  const currentTestIds = extractTestIds(lessonBlock)
  const maxExId = currentExerciseIds.length > 0 ? Math.max(...currentExerciseIds) : 0
  const maxTestId = currentTestIds.length > 0 ? Math.max(...currentTestIds) : 0

  const titleMatch = lessonBlock.match(/title\s*:\s*['"]([^'"]+)['"]/)
  const levelMatch = lessonBlock.match(/level\s*:\s*['"]([^'"]+)['"]/)
  const dayMatch = lessonBlock.match(/day\s*:\s*(\d+)/)

  return {
    id: lessonId,
    title: titleMatch?.[1] ?? exportName,
    level: levelMatch?.[1] ?? '?',
    day: parseInt(dayMatch?.[1] ?? '0'),
    rulesText: extractRulesText(lessonBlock),
    currentVocab,
    currentExerciseIds,
    currentTestIds,
    currentExerciseSummary: extractExerciseSummary(lessonBlock),
    currentTestSummary: extractTestSummary(lessonBlock),
    specialCaseSummary: extractSpecialCaseSummary(lessonBlock),
    maxExId,
    maxTestId,
  }
}

// ─── Claude prompt ────────────────────────────────────────────────────────────

function buildPrompt(snap: LessonSnapshot): string {
  const nextExId = snap.maxExId + 1
  const nextTestId = Math.max(snap.maxTestId + 1, nextExId + 100)
  return `Sen ingliz tili o'rganish ilovasida kontent yaratuvchi yordam berasan (O'zbek o'quvchilar uchun, A1-B2 daraja).

DARS MA'LUMOTI:
- ID: ${snap.id}
- Sarlavha: ${snap.title}
- Daraja: ${snap.level}
- Kun: ${snap.day}

DARSDA O'QITILAYOTGAN QOIDALAR (rules[]):
${snap.rulesText}

JORIY LEKSIKA (${snap.currentVocab.length} ta so'z allaqachon bor):
${snap.currentVocab.join(', ')}

JORIY MASHQLAR (${snap.currentExerciseIds.length} ta, max ID: ${snap.maxExId}):
${snap.currentExerciseSummary}

JORIY TESTLAR (${snap.currentTestIds.length} ta, max ID: ${snap.maxTestId}):
${snap.currentTestSummary}

SPECIAL CASES: ${snap.specialCaseSummary}

═══ TOPSHIRIQ ═══

1. LEKSIKA: rules matni ichida o'qitilgan barcha muhim so'zlarni topib, hali vocabulary[] da yo'qlarini qo'sh.
   Faqat shu mezonlar bo'yicha:
   - Ot, fe'l, sifat, ravish (mazmunli so'zlar)
   - Grammar termlar (vowel, consonant, plural, singular) agar darsda o'qitilsa
   - Grammatik yordamchi so'zlarni (the, a, is, are) qo'shma, ular allaqachon bor deb hisoblash

2. MASHQLAR (exercises[]): Quyidagi qoidalar uchun exercises qo'sh (agar ular hali to'liq qamrab olinmagan bo'lsa):
   - Har bir rule elementi uchun kamida 2 ta mashq bo'lishi kerak
   - Yangi mashq ID lari ${nextExId} dan boshlansin
   - BARCHA 5 turni ishlat: fill-blank, multiple-choice, error-correction, transformation, fill-table
   - transformation: gapni o'zgartirish (masalan, zamonga qarab, egaga qarab)
   - fill-table: jadvalni to'ldirish (masalan, adjective comparative superlative)

3. SEKSIYALAR (exerciseSections): Yangi exercises uchun mos section(lar) yarat.
   Section ids maydoni yangi exercise ID larini ko'rsatishi kerak.

4. TESTLAR (tests[]): Agar mavjud testlar barcha qoidalarni qamrab olmagan bo'lsa,
   yangi testlar qo'sh. Test ID lari ${nextTestId} dan boshlansin.

5. TEST SEKSIYALARI (testSections): Yangi testlar uchun mos section(lar) yarat.

6. DRILL LAR: specialCase lar uchun (agar kerak bo'lsa) qo'shimcha drills qo'sh.

═══ JAVOB FORMATI ═══

Faqat quyidagi JSON formatda qaytargin (hech qanday izoh yoki markdown blok yo'q):

{
  "vocabulary": [
    {"en": "word", "uz": "tarjima", "example": "Example sentence.", "rule": "kategoriya"}
  ],
  "exercises": [
    {"id": ${nextExId}, "type": "fill-blank", "instruction": "Ko'rsatma:", "question": "Savol ___.", "blanks": ["javob"], "explanation": "Izoh"},
    {"id": ${nextExId + 1}, "type": "transformation", "instruction": "Ko'rsatma:", "question": "Savol?", "hint": "Yordam", "correct": "To'g'ri javob", "explanation": "Izoh"},
    {"id": ${nextExId + 2}, "type": "fill-table", "instruction": "Ko'rsatma:", "rows": [{"adj": "big", "comp": "bigger", "sup": "biggest"}], "explanation": "Izoh"}
  ],
  "tests": [
    {"id": ${nextTestId}, "type": "multiple-choice", "instruction": "Ko'rsatma:", "question": "Savol?", "options": ["a","b","c","d"], "correct": "a", "explanation": "Izoh"}
  ],
  "newSections": [
    {"title": "Bo'lim nomi", "desc": "Nima qamraydi", "color": "bg-amber-500", "icon": "🔤", "ids": [${nextExId}]}
  ],
  "newTestSections": [
    {"title": "Test bo'limi", "desc": "Nima qamraydi", "color": "bg-amber-500", "icon": "📝", "ids": [${nextTestId}]}
  ],
  "specialCaseDrills": {
    "special-case-id": [
      {"id": ${nextExId + 10}, "type": "fill-blank", "instruction": "...", "question": "...", "blanks": ["..."], "explanation": "..."}
    ]
  }
}

MUHIM QOIDALAR:
- multiple-choice da options DOIM 4 ta element bo'lishi shart
- Uzbekcha tarjimalar aniq va grammatik to'g'ri bo'lsin
- Ko'rsatmalar (instruction) o'zbek tilida
- Agar qo'shimcha narsa kerak bo'lmasa, bo'sh massiv qaytargin
- JSON toza bo'lsin: hech qanday // izoh yo'q, trailing comma yo'q`
}

// ─── Response parsing ─────────────────────────────────────────────────────────

function parseAdditions(raw: string, snap: LessonSnapshot): LessonAdditions {
  let jsonStr = raw.trim()

  // Markdown code bloklarini tozalash
  jsonStr = jsonStr.replace(/```(?:json)?\s*/g, '').replace(/\s*```/g, '')

  // JSON ni topish
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    console.warn(`  ⚠️  JSON topilmadi: ${snap.id}`)
    return { vocabulary: [], exercises: [], newSections: [], specialCaseDrills: {} }
  }

  let parsed: any
  try {
    parsed = JSON.parse(jsonMatch[0])
  } catch {
    // Recovery: trailing comma, single quotes, missing quotes
    let fixed = jsonMatch[0]
      .replace(/,(\s*[}\]])/g, '$1')
      .replace(/'/g, '"')
      .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
    try {
      parsed = JSON.parse(fixed)
    } catch {
      console.warn(`  ⚠️  JSON parse xatosi (${snap.id})`)
      return { vocabulary: [], exercises: [], newSections: [], specialCaseDrills: {} }
    }
  }

  return {
    vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
    exercises: Array.isArray(parsed.exercises) ? parsed.exercises : [],
    tests: Array.isArray(parsed.tests) ? parsed.tests : undefined,
    newSections: Array.isArray(parsed.newSections) ? parsed.newSections : [],
    newTestSections: Array.isArray(parsed.newTestSections) ? parsed.newTestSections : undefined,
    specialCaseDrills: typeof parsed.specialCaseDrills === 'object' ? parsed.specialCaseDrills : {},
  }
}

// ─── ID validation ────────────────────────────────────────────────────────────

function validateSectionIds(
  additions: LessonAdditions,
  snap: LessonSnapshot
): void {
  const exerciseIds = additions.exercises.map(e => e.id)
  const testIds = additions.tests?.map(t => t.id) ?? []

  for (const section of additions.newSections) {
    const invalidIds = section.ids.filter(id => !exerciseIds.includes(id))
    if (invalidIds.length > 0) {
      console.warn(`     ⚠️  Section "${section.title}" da exercise IDs mos kelmayapti: ${invalidIds.join(', ')}`)
      section.ids = section.ids.filter(id => exerciseIds.includes(id))
    }
  }

  if (additions.newTestSections) {
    for (const section of additions.newTestSections) {
      const invalidIds = section.ids.filter(id => !testIds.includes(id))
      if (invalidIds.length > 0) {
        console.warn(`     ⚠️  Test section "${section.title}" da test IDs mos kelmayapti: ${invalidIds.join(', ')}`)
        section.ids = section.ids.filter(id => testIds.includes(id))
      }
    }
  }
}

// ─── TypeScript source manipulation ──────────────────────────────────────────

function q(value: string): string {
  return value.includes("'") ? `"${value}"` : `'${value}'`
}

function serializeVocabWord(w: VocabWord): string {
  return `    { en: ${q(w.en)}, uz: ${q(w.uz)}, example: ${q(w.example)}, rule: ${q(w.rule)} },`
}

function serializeExercise(ex: Exercise, indent = '    '): string {
  let s = `${indent}{ id: ${ex.id}, type: '${ex.type}', instruction: ${q(ex.instruction)}, question: ${q(ex.question)},`

  if (ex.type === 'fill-blank' && ex.blanks) {
    s += ` blanks: [${ex.blanks.map(b => q(b)).join(', ')}],`
  } else if (ex.type === 'multiple-choice' && ex.options) {
    s += ` options: [${ex.options.map(o => q(o)).join(', ')}], correct: ${q(ex.correct ?? '')},`
  } else if (ex.type === 'error-correction') {
    s += ` errorPart: ${q(ex.errorPart ?? '')}, correct: ${q(ex.correct ?? '')},`
  } else if (ex.type === 'transformation') {
    s += ` hint: ${q(ex.hint ?? '')}, correct: ${q(ex.correct ?? '')},`
  } else if (ex.type === 'fill-table') {
    const rows = (ex.rows ?? []).map(r =>
      `{ adj: ${q(r.adj)}, comp: ${q(r.comp)}, sup: ${q(r.sup)} }`
    ).join(', ')
    s = `${indent}{ id: ${ex.id}, type: 'fill-table', instruction: ${q(ex.instruction)}, rows: [${rows}],`
  }

  s += ` explanation: ${q(ex.explanation)} },`
  return s
}

function serializeSection(sec: ExerciseSection): string {
  return `    { title: ${q(sec.title)}, desc: ${q(sec.desc)}, color: '${sec.color}', icon: '${sec.icon}', ids: [${sec.ids.join(', ')}] },`
}

function insertBeforeArrayEnd(
  content: string,
  lessonStart: number,
  nextKeyword: string,
  newLines: string,
  lineEnding: '\n' | '\r\n' = '\n'
): string {
  const after = content.slice(lessonStart)
  const le = lineEnding
  const pattern = new RegExp(`(\\s*\\],\\s*${le}\\s*${nextKeyword}:)`)
  const m = after.match(pattern)
  if (!m || m.index === undefined) {
    console.warn(`    ⚠️  "${nextKeyword}:" marker topilmadi`)
    return content
  }
  const insertAt = lessonStart + m.index
  return content.slice(0, insertAt) + le + newLines + content.slice(insertAt)
}

function insertVocab(content: string, lessonStart: number, words: VocabWord[], le: '\n' | '\r\n'): string {
  if (words.length === 0) return content
  return insertBeforeArrayEnd(content, lessonStart, 'examples', words.map(serializeVocabWord).join(le), le)
}

function insertExercises(content: string, lessonStart: number, exercises: Exercise[], le: '\n' | '\r\n'): string {
  if (exercises.length === 0) return content
  return insertBeforeArrayEnd(content, lessonStart, 'exerciseSections', exercises.map(ex => serializeExercise(ex)).join(le), le)
}

function insertTests(content: string, lessonStart: number, tests: Exercise[], le: '\n' | '\r\n'): string {
  if (tests.length === 0) return content
  return insertBeforeArrayEnd(content, lessonStart, 'testSections', tests.map(t => serializeExercise(t)).join(le), le)
}

function insertSections(content: string, lessonStart: number, sections: ExerciseSection[], le: '\n' | '\r\n'): string {
  if (sections.length === 0) return content
  return insertBeforeArrayEnd(content, lessonStart, 'tests', sections.map(serializeSection).join(le), le)
}

function insertTestSections(content: string, lessonStart: number, sections: ExerciseSection[], le: '\n' | '\r\n'): string {
  if (sections.length === 0) return content
  // testSections odatda tests: dan keyin keladi, lekin undan keyin yana hech narsa bo'lmasligi mumkin
  // testSections oxirgi bo'lsa, '},' keyingi lesson yoki fayl oxiriga qarab insert qilamiz
  const after = content.slice(lessonStart)
  const lePattern = le === '\r\n' ? '\\r\\n' : '\\n'
  // testSections: [...] yopilishini topamiz — keyin `  ],` va undan keyin `}` (lesson yopilishi) keladi
  const pattern = new RegExp(`(\\s*\\],\\s*${lePattern}\\s*\\})`)
  const m = after.match(pattern)
  if (!m || m.index === undefined) {
    console.warn(`    ⚠️  testSections insert: lesson yopilishi topilmadi`)
    return content
  }
  const insertAt = lessonStart + m.index
  return content.slice(0, insertAt) + le + sections.map(serializeSection).join(le) + content.slice(insertAt)
}

function insertSpecialCaseDrills(
  content: string,
  lessonStart: number,
  lessonEnd: number,
  drillPatches: Record<string, Exercise[]>,
  le: '\n' | '\r\n'
): string {
  let result = content
  let offset = 0

  for (const [caseId, drills] of Object.entries(drillPatches)) {
    if (drills.length === 0) continue

    const block = result.slice(lessonStart + offset, lessonEnd + offset)
    const caseIdPattern = new RegExp(`id\\s*:\\s*['"]${caseId}['"]`)
    const caseStart = block.search(caseIdPattern)
    if (caseStart === -1) {
      console.warn(`    ⚠️  specialCase "${caseId}" topilmadi`)
      continue
    }

    const afterCase = block.slice(caseStart)
    const lePattern = le === '\r\n' ? '\\r\\n' : '\\n'
    const drillsEndPattern = new RegExp(`(\\s*\\],\\s*${lePattern}\\s*\\},)`)
    const drillsEndMatch = afterCase.match(drillsEndPattern)
    if (!drillsEndMatch || drillsEndMatch.index === undefined) continue

    const insertAt = lessonStart + offset + caseStart + drillsEndMatch.index
    const newDrillLines = drills.map(d => serializeExercise(d, '        ')).join(le)
    result = result.slice(0, insertAt) + le + newDrillLines + result.slice(insertAt)
    offset += newDrillLines.length + le.length
  }

  return result
}

// ─── TypeScript tekshiruvi ──────────────────────────────────────────────────

function checkTypeScript(filePath: string): boolean {
  try {
    execSync('npx tsc --noEmit --pretty false', {
      cwd: PROJECT_ROOT,
      timeout: 30_000,
      stdio: 'pipe',
    })
    return true
  } catch (e: any) {
    console.error(`     ❌ TypeScript xatosi:`)
    console.error(e.stdout?.toString() || e.message)
    return false
  }
}

// ─── Main processing ──────────────────────────────────────────────────────────

async function fixFile(fileName: string, targetLessonId?: string, isDryRun = false, skipTsCheck = false) {
  const filePath = join(PROJECT_ROOT, 'src', 'data', 'daily', `${fileName}.ts`)
  console.log(`\n📂 ${fileName}.ts`)

  let content = readFileSync(filePath, 'utf-8')
  const le = detectLineEnding(content)
  let normalizedContent = content.replace(/\r\n/g, '\n')

  // Backup
  if (!isDryRun) {
    const bakPath = filePath + '.bak'
    copyFileSync(filePath, bakPath)
    console.log(`   📦 Backup: ${basename(filePath)}.bak`)
  }

  const lessons = findLessonsInFile(normalizedContent)
  console.log(`   ${lessons.length} ta dars topildi: ${lessons.map(l => l.lessonId).join(', ')}`)

  for (const { exportName, lessonId } of lessons) {
    if (targetLessonId && lessonId !== targetLessonId) continue

    let currentContent = normalizedContent
    const snap = buildSnapshot(currentContent, exportName, lessonId)
    if (!snap) {
      console.warn(`  ⚠️  ${lessonId} snapshot olinmadi`)
      continue
    }

    console.log(`\n  📖 ${lessonId} (${snap.title})`)
    console.log(`     Daraja: ${snap.level} | Kun: ${snap.day}`)
    console.log(`     Joriy vocab: ${snap.currentVocab.length} | Mashqlar: ${snap.currentExerciseIds.length} | Testlar: ${snap.currentTestIds.length} | Max Ex ID: ${snap.maxExId}`)

    try {
      console.log(`     → Claude so'ralmoqda...`)
      const raw = await callClaude(buildPrompt(snap))
      const additions = parseAdditions(raw, snap)

      validateSectionIds(additions, snap)

      console.log(`     → Vocab qo'shiladi: ${additions.vocabulary.length} ta`)
      console.log(`     → Mashqlar qo'shiladi: ${additions.exercises.length} ta`)
      console.log(`     → Seksiyalar qo'shiladi: ${additions.newSections.length} ta`)
      console.log(`     → Testlar qo'shiladi: ${(additions.tests?.length ?? 0)} ta`)

      if (isDryRun) {
        if (additions.vocabulary.length > 0) {
          console.log(`     [DRY-RUN] Vocab:`, additions.vocabulary.map(v => v.en).join(', '))
        }
        if (additions.exercises.length > 0) {
          console.log(`     [DRY-RUN] Ex IDs:`, additions.exercises.map(e => e.id).join(', '))
        }
        continue
      }

      const lessonStart = findLessonStart(currentContent, exportName)
      if (lessonStart === -1) continue

      // Insertatsiya (tartib muhim)
      currentContent = insertVocab(currentContent, lessonStart, additions.vocabulary, le)
      currentContent = insertExercises(currentContent, lessonStart, additions.exercises, le)
      currentContent = insertSections(currentContent, lessonStart, additions.newSections, le)

      if (additions.tests && additions.tests.length > 0) {
        currentContent = insertTests(currentContent, lessonStart, additions.tests, le)
      }
      if (additions.newTestSections && additions.newTestSections.length > 0) {
        currentContent = insertTestSections(currentContent, lessonStart, additions.newTestSections, le)
      }

      if (Object.keys(additions.specialCaseDrills).length > 0) {
        const updatedStart = findLessonStart(currentContent, exportName)
        const updatedEnd = currentContent.indexOf('\nexport const', updatedStart + 1)
        currentContent = insertSpecialCaseDrills(
          currentContent, updatedStart,
          updatedEnd === -1 ? currentContent.length : updatedEnd,
          additions.specialCaseDrills, le
        )
      }

      normalizedContent = currentContent
      console.log(`     ✅ Qo'shildi`)

    } catch (err) {
      console.error(`     ❌ Xato: ${(err as Error).message}`)
      console.error(`     ⏪ O'zgarishlar bekor qilindi (bu dars o'tkazib yuborildi)`)
      // Rollback: bak fayldan tiklash
      if (!isDryRun) {
        const bakPath = filePath + '.bak'
        try {
          const bakContent = readFileSync(bakPath, 'utf-8')
          normalizedContent = bakContent.replace(/\r\n/g, '\n')
          console.log(`     🔄 Backup dan tiklandi`)
        } catch {
          console.warn(`     ⚠️ Backup tiklanmadi, keyingi darslar uchun joriy content ishlatiladi`)
        }
      }
    }
  }

  if (!isDryRun) {
    const output = le === '\r\n' ? normalizedContent.replace(/\n/g, '\r\n') : normalizedContent
    writeFileSync(filePath, output, 'utf-8')
    console.log(`\n  💾 Fayl saqlandi: ${fileName}.ts`)

    if (!skipTsCheck) {
      console.log(`     🔍 TypeScript tekshirilmoqda...`)
      const tsOk = checkTypeScript(filePath)
      if (!tsOk) {
        console.error(`     ❌ TypeScript xatosi topildi! Backup: ${fileName}.ts.bak`)
        console.error(`     Backup dan tiklash: copy ${fileName}.ts.bak ${fileName}.ts`)
      } else {
        console.log(`     ✅ TypeScript toza`)
      }
    }
  }
}

// ─── Entry point ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const fileArg = args.find(a => a.startsWith('--file='))?.split('=')[1]
const lessonArg = args.find(a => a.startsWith('--lesson='))?.split('=')[1]
const isDryRun = args.includes('--dry-run')
const skipTsCheck = args.includes('--skip-ts-check')

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY muhit o\'zgaruvchisi kerak!')
  console.error('   Masalan: ANTHROPIC_API_KEY=sk-ant-... tsx scripts/fix-lessons.ts')
  process.exit(1)
}

const filesToProcess = fileArg ? [fileArg] : ALL_LESSON_FILES

async function main() {
  console.log('🚀 fix-lessons skripti ishga tushdi')
  console.log(`   Fayllar: ${filesToProcess.join(', ')}`)
  if (lessonArg) console.log(`   Faqat dars: ${lessonArg}`)
  console.log(`   Dry-run: ${isDryRun}`)
  console.log(`   Skip TS check: ${skipTsCheck}`)
  console.log(`   Model: ${CLAUDE_MODEL}`)

  for (const file of filesToProcess) {
    try {
      await fixFile(file, lessonArg, isDryRun, skipTsCheck)
    } catch (err) {
      console.error(`\n❌ ${file} faylida xato:`, (err as Error).message)
      console.error(`   Keyingi faylga o'tish...`)
    }
  }

  console.log('\n✅ Skript muvaffaqiyatli tugadi!')
}

main()
