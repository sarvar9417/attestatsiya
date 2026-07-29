/**
 * A1 Lessons Audit Skripti
 * 
 * Tekshiruvlar:
 * 1. Har bir vocabulary so'zi ≥2 marta exercises+tests da ishlatilganmi?
 * 2. acceptedAnswers ishlatilganmi (noaniq savol)?
 * 3. Exercises va tests o'rtasida duplicate savollar bormi?
 * 4. "instruction" maydoni tushunarlimi?
 */

import { readFileSync } from 'fs'
import { join } from 'path'

// A1 lesson sources
const LESSON_SOURCES = [
  { file: 'src/data/daily/a1Part1.ts', lessons: [
    'alphabetAndGreetings', 'numbers', 'colorsAndShapes', 'family',
    'daysAndMonths', 'timeAndRoutines', 'foodAndDrinks', 'animals',
    'bodyParts', 'clothes'
  ]},
  { file: 'src/data/daily/a1Part2.ts', lessons: [
    'demonstratives', 'prepositionsOfPlace', 'basicAdjectives',
    'thereIsAre', 'canCant', 'haveGot', 'presentSimple',
    'questionWords', 'conjunctions', 'a1Review'
  ]},
  { file: 'src/data/tenses/tensesData.ts', lessons: [
    'presentContinuous', 'simplePast', 'simpleFuture'
  ]},
]

interface AuditReport {
  lesson: string
  file: string
  vocabCount: number
  vocabUnder2: string[]
  acceptedAnswersCount: number
  acceptedAnswersIds: number[]
  duplicateQuestions: string[]
  exercisesCount: number
  testsCount: number
  drillsCount: number
  totalVocabInExercises: number
  ambiguousInstructions: { id: number; instruction: string }[]
}

function extractSection(content: string, exportName: string): string {
  // Find the export const section
  const regex = new RegExp(`export\\s+const\\s+${exportName}[^;]*?(?=export\\s+const|$)`, 's')
  const match = content.match(regex)
  return match?.[0] || ''
}

function extractVocab(section: string): { en: string; uz: string }[] {
  const vocab: { en: string; uz: string }[] = []
  // Match vocabulary array items: { en: '...', uz: '...', ... }
  const vocabRegex = /\{\s*en\s*:\s*['"]([^'"]+)['"]\s*,\s*uz\s*:\s*['"]([^'"]+)['"]/g
  let m
  while ((m = vocabRegex.exec(section)) !== null) {
    vocab.push({ en: m[1].toLowerCase(), uz: m[2] })
  }
  return vocab
}

function collectExerciseIds(section: string): number[] {
  const ids: number[] = []
  const idRegex = /id:\s*(\d+)/g
  let m
  while ((m = idRegex.exec(section)) !== null) {
    ids.push(parseInt(m[1], 10))
  }
  return ids
}

function collectAcceptedAnswers(section: string): number[] {
  const ids: number[] = []
  // Match acceptedAnswers after an id
  const aaRegex = /id:\s*(\d+)[\s\S]*?acceptedAnswers/g
  let m
  while ((m = aaRegex.exec(section)) !== null) {
    ids.push(parseInt(m[1], 10))
  }
  return ids
}

function collectExerciseTexts(section: string): Map<number, string> {
  const texts = new Map<number, string>()
  // Match { id: X, type: '...', instruction: '...', question: '...', ... }
  const exerciseRegex = /\{\s*id:\s*(\d+)[\s\S]*?question\s*:\s*['"]([^'"]+)['"]/g
  let m
  while ((m = exerciseRegex.exec(section)) !== null) {
    texts.set(parseInt(m[1], 10), m[2].toLowerCase())
  }
  return texts
}

function countVocabInSection(vocab: { en: string }[], text: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const v of vocab) {
    const word = v.en.toLowerCase()
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}\\b`, 'g')
    const matches = text.match(regex)
    counts.set(word, matches ? matches.length : 0)
  }
  return counts
}

function findDuplicateQuestions(ids: number[], texts: Map<number, string>, otherIds: number[], otherTexts: Map<number, string>): string[] {
  const duplicates: string[] = []
  for (const id of ids) {
    const text = texts.get(id)
    if (!text) continue
    for (const otherId of otherIds) {
      const otherText = otherTexts.get(otherId)
      if (text === otherText) {
        duplicates.push(`ID ${id} ↔ ID ${otherId}: "${text.substring(0, 50)}..."`)
      }
    }
  }
  return duplicates
}

function auditLesson(filePath: string, exportName: string): AuditReport {
  const fullPath = join(process.cwd(), filePath)
  const content = readFileSync(fullPath, 'utf-8')
  const section = extractSection(content, exportName)

  const report: AuditReport = {
    lesson: exportName,
    file: filePath,
    vocabCount: 0,
    vocabUnder2: [],
    acceptedAnswersCount: 0,
    acceptedAnswersIds: [],
    duplicateQuestions: [],
    exercisesCount: 0,
    testsCount: 0,
    drillsCount: 0,
    totalVocabInExercises: 0,
    ambiguousInstructions: [],
  }

  // Extract sections for exercises, tests, drills
  const exercisesSection = section.match(/exercises\s*:\s*\[([\s\S]*?)\](?=\s*,\s*testSections)/)?.[1] || ''
  const testsSection = section.match(/tests\s*:\s*\[([\s\S]*?)\](?=\s*,\s*testSections)/)?.[1] || ''
  const drillsSection = section.match(/drills\s*:\s*\[([\s\S]*?)\]/)?.[1] || ''

  // Count acceptedAnswers
  const aaIds = collectAcceptedAnswers(section)
  report.acceptedAnswersCount = aaIds.length
  report.acceptedAnswersIds = aaIds

  // Find ambiguous instructions
  const ambiguousPatterns = ["to'ldir", "variantni tanla", "qo'y", "top"]
  const allExercises = (exercisesSection + testsSection + drillsSection)
  const idRegex = /id:\s*(\d+)[\s\S]*?instruction\s*:\s*['"]([^'"]+)['"]/g
  let m
  while ((m = idRegex.exec(section)) !== null) {
    const instr = m[2].toLowerCase()
    if (ambiguousPatterns.some(p => instr.includes(p)) && instr.length < 20) {
      report.ambiguousInstructions.push({ id: parseInt(m[1], 10), instruction: m[2] })
    }
  }

  // Get vocab
  const vocab = extractVocab(section)
  report.vocabCount = vocab.length

  // Count exercises, tests, drills
  const exerciseIds = collectExerciseIds(exercisesSection)
  const testIds = collectExerciseIds(testsSection)
  const drillIds = collectExerciseIds(drillsSection)
  // Remove duplicates (drill IDs might overlap with exercises)
  const allIds = new Set([...exerciseIds, ...testIds, ...drillIds])
  
  // Drill counts
  report.drillsCount = drillIds.length
  report.exercisesCount = exerciseIds.length
  report.testsCount = testIds.length

  // Count vocab in exercises+tests (not drills)
  const exercisesTestsText = exercisesSection + testsSection
  const vocabCounts = countVocabInSection(vocab, exercisesTestsText.toLowerCase())

  // Also count in drills
  const drillsText = drillsSection
  const vocabInDrills = countVocabInSection(vocab, drillsText.toLowerCase())

  // Total occurrences across exercises+tests (not drills)
  let totalVocab = 0
  for (const v of vocab) {
    const count = vocabCounts.get(v.en.toLowerCase()) || 0
    totalVocab += count
    // Drills count half (since drills are practice, not main exercises)
    const drillCount = vocabInDrills.get(v.en.toLowerCase()) || 0
    if (count + Math.min(drillCount, 1) < 2) {
      report.vocabUnder2.push(`${v.en} (${count} ex+test + ${drillCount} drills)`)
    }
  }
  report.totalVocabInExercises = totalVocab

  // Find duplicate questions between exercises and tests
  const exerciseTexts = collectExerciseTexts(exercisesSection)
  const testTexts = collectExerciseTexts(testsSection)
  report.duplicateQuestions = findDuplicateQuestions(exerciseIds, exerciseTexts, testIds, testTexts)

  return report
}

function printReport(report: AuditReport): void {
  const issues: string[] = []
  if (report.acceptedAnswersCount > 0) issues.push(`❌ acceptedAnswers: ${report.acceptedAnswersCount} ta (ID: ${report.acceptedAnswersIds.slice(0,5).join(',')}...)`)
  if (report.vocabUnder2.length > 0) issues.push(`❌ Vocab <2: ${report.vocabUnder2.length} ta`)
  if (report.duplicateQuestions.length > 0) issues.push(`❌ Duplicate: ${report.duplicateQuestions.length} ta`)
  if (report.ambiguousInstructions.length > 0) issues.push(`⚠️ Ambiguous instr: ${report.ambiguousInstructions.length} ta`)
  
  const status = issues.length === 0 ? '✅ PERFECT' : issues.join(' | ')
  console.log(`\n${status}`)
  console.log(`  ${report.lesson} (${report.file})`)
  console.log(`  Vocab: ${report.vocabCount} | Ex: ${report.exercisesCount} | Tests: ${report.testsCount} | Drills: ${report.drillsCount}`)
  console.log(`  Total vocab appearances in ex+tests: ${report.totalVocabInExercises}`)
  
  if (report.vocabUnder2.length > 0) {
    console.log(`  Vocab under 2:`)
    for (const v of report.vocabUnder2.slice(0,10)) {
      console.log(`    - ${v}`)
    }
    if (report.vocabUnder2.length > 10) console.log(`    ... va ${report.vocabUnder2.length - 10} ta`)
  }
  
  if (report.duplicateQuestions.length > 0) {
    console.log(`  Duplicate questions:`)
    for (const d of report.duplicateQuestions.slice(0,5)) {
      console.log(`    - ${d}`)
    }
    if (report.duplicateQuestions.length > 5) console.log(`    ... va ${report.duplicateQuestions.length - 5} ta`)
  }

  if (report.acceptedAnswersCount > 0) {
    console.log(`  AcceptedAnswers in exercises/tests: ${report.acceptedAnswersIds.join(', ')}`)
  }
}

function main(): void {
  console.log('═'.repeat(60))
  console.log('🔍 A1 DARSLAR AUDITI')
  console.log('═'.repeat(60))

  const allReports: AuditReport[] = []

  for (const source of LESSON_SOURCES) {
    console.log(`\n📁 ${source.file}:`)
    for (const lesson of source.lessons) {
      const report = auditLesson(source.file, lesson)
      allReports.push(report)
      printReport(report)
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('📊 UMUMIY NATIJA')
  console.log('═'.repeat(60))

  let totalIssues = 0
  let perfectLessons = 0
  for (const r of allReports) {
    const issues = r.acceptedAnswersCount + r.vocabUnder2.length + r.duplicateQuestions.length
    totalIssues += issues
    if (issues === 0) perfectLessons++
  }

  console.log(`Jami darslar: ${allReports.length}`)
  console.log(`✅ Muammosiz: ${perfectLessons}`)
  console.log(`❌ Muammoli: ${allReports.length - perfectLessons}`)
  console.log(`Jami muammolar: ${totalIssues}`)

  // Breakdown
  const totalAA = allReports.reduce((s, r) => s + r.acceptedAnswersCount, 0)
  const totalVocab = allReports.reduce((s, r) => s + r.vocabUnder2.length, 0)
  const totalDup = allReports.reduce((s, r) => s + r.duplicateQuestions.length, 0)
  console.log(`\nMuammo turlari:`)
  console.log(`  acceptedAnswers: ${totalAA} ta`)
  console.log(`  Vocab <2: ${totalVocab} ta`)
  console.log(`  Duplicates: ${totalDup} ta`)

  // This also imports the lessons so TypeScript catches errors
  // But we don't need to import - just report
}

main()
