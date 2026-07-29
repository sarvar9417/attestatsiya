/**
 * fill-blank audit: har bir fill-blank exercise'ni tekshiradi
 *
 * Tekshiruv:
 * 1. question ichida ___ bormi? (agar blanks.length > 0 bo'lsa)
 * 2. ___ soni blanks.length ga tengmi?
 * 3. Agar ___ bo'lmasa → UI da to'ldirish maydoni ko'rinmaydi
 *
 * Ishga tushirish: npx tsx scripts/audit-fill-blank.ts
 */

import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dailyDir = path.resolve(__dirname, '..', 'src', 'data', 'daily')

interface FillBlankIssue {
  file: string
  id: number | string
  type: string
  message: string
  question?: string
  blanksCount?: number
}

// Count ___ or _____ occurrences in a string (3+ underscores = 1 blank)
function countBlanks(s: string): number {
  // _{3,} matches 3+ consecutive underscores as one blank
  // This avoids overlapping matches in _____ (5 underscores)
  return (s.match(/_{3,}/g) || []).length
}

function extractExercises(content: string): Array<{
  id: number | string
  type: string
  question?: string
  blanks?: string[]
  instruction?: string
}> {
  const exercises: Array<any> = []

  // Find exercise objects by scanning for id: ..., type: 'fill-blank'
  // Use a robust approach: parse each exercise object
  const objRegex = /\{\s*id:\s*(\d+|'[^']+'|"[^"]+"),\s*type:\s*'(fill-blank|multiple-choice|error-correction|transformation|passage|connection|fill-table)'/g

  let match
  while ((match = objRegex.exec(content)) !== null) {
    const startIdx = match.index
    const id = match[1]
    const type = match[2]

    // Find matching closing brace
    let depth = 0
    let endIdx = startIdx
    let inSingleQuote = false
    let inDoubleQuote = false
    let escaped = false

    for (let i = startIdx; i < content.length; i++) {
      const ch = content[i]

      if (escaped) { escaped = false; continue }
      if (ch === '\\') { escaped = true; continue }
      if (ch === "'" && !inDoubleQuote) { inSingleQuote = !inSingleQuote; continue }
      if (ch === '"' && !inSingleQuote) { inDoubleQuote = !inDoubleQuote; continue }

      if (!inSingleQuote && !inDoubleQuote) {
        if (ch === '{') depth++
        else if (ch === '}') {
          depth--
          if (depth === 0) { endIdx = i; break }
        }
      }
    }

    const objStr = content.substring(startIdx, endIdx + 1)

    const extractField = (field: string): string | undefined => {
      const re = new RegExp(`${field}:\\s*'((?:[^'\\\\]|\\\\.)*)'`)
      const re2 = new RegExp(`${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)
      const m = objStr.match(re) || objStr.match(re2)
      if (m) return m[1].replace(/\\(['"])/g, '$1')
      return undefined
    }

    const extractBlanks = (): string[] | undefined => {
      // Match blanks: ['...', '...', ...]
      const re = /blanks:\s*\[([^\]]*)\]/
      const m = objStr.match(re)
      if (!m) return undefined

      const arrStr = m[1]
      // Extract individual strings from array
      const items = arrStr.match(/'([^']*)'/g)
      if (items) return items.map(i => i.replace(/^'|'$/g, ''))
      const items2 = arrStr.match(/"([^"]*)"/g)
      if (items2) return items2.map(i => i.replace(/^"|"$/g, ''))
      return []
    }

    if (type === 'fill-blank') {
      const question = extractField('question')
      const blanks = extractBlanks()
      const instruction = extractField('instruction')
      exercises.push({ id, type, question, blanks, instruction })
    }
  }

  return exercises
}

// ---- MAIN ----

const files = readdirSync(dailyDir).filter(f => f.endsWith('.ts'))

let totalFB = 0
const issues: FillBlankIssue[] = []

for (const file of files) {
  const filePath = path.join(dailyDir, file)
  const content = readFileSync(filePath, 'utf-8')
  const exercises = extractExercises(content)

  for (const ex of exercises) {
    if (ex.type !== 'fill-blank') continue
    totalFB++

    const q = ex.question
    const blanks = ex.blanks

    if (!q) {
      issues.push({ file, id: ex.id, type: 'question_missing', message: 'question maydoni topilmadi' })
      continue
    }

    if (!blanks || blanks.length === 0) {
      issues.push({ file, id: ex.id, type: 'blanks_missing', message: 'blanks arrayi bo\'sh yoki topilmadi' })
      continue
    }

    const blankCount = countBlanks(q)
    const expectedCount = blanks.length

    if (blankCount === 0) {
      issues.push({
        file, id: ex.id, type: 'no_blank_in_question',
        message: `question da ___ yo'q, lekin blanks[${expectedCount}] mavjud! To'ldirish maydoni ko'rinmaydi.`,
        question: q.substring(0, 120),
        blanksCount: expectedCount,
      })
    } else if (blankCount !== expectedCount) {
      issues.push({
        file, id: ex.id, type: 'blank_count_mismatch',
        message: `question da ${blankCount} x ___ bor, lekin blanks[${expectedCount}]`,
        question: q.substring(0, 120),
        blanksCount: expectedCount,
      })
    }
  }
}

// Print results
console.log(`📋 fill-blank audit\n`)
console.log(`   ${files.length} fayl tekshirildi`)
console.log(`   ${totalFB} ta fill-blank mashqi topildi\n`)

if (issues.length === 0) {
  console.log('✅ Hech qanday muammo topilmadi!')
} else {
  console.log(`⚠️  ${issues.length} ta muammo:\n`)

  // Group by type
  const byType: Record<string, FillBlankIssue[]> = {}
  for (const iss of issues) {
    if (!byType[iss.type]) byType[iss.type] = []
    byType[iss.type].push(iss)
  }

  for (const [type, list] of Object.entries(byType)) {
    console.log(`── ${type} (${list.length} ta) ──`)
    for (const iss of list) {
      console.log(`  • ${iss.file} (ID: ${iss.id}): ${iss.message}`)
      if (iss.question) console.log(`    question: "${iss.question}"`)
    }
    console.log('')
  }
}
