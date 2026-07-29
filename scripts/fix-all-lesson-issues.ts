/**
 * Darslardagi barcha xatolarni avtomatik tuzatish skripti.
 * Ishga tushirish: npx tsx scripts/fix-all-lesson-issues.ts
 *
 * Tuzatiladigan muammolar:
 *  - blank-count: ___ soni ≠ blanks soni
 *  - duplicate-word: javob qo'yilganda takror so'z
 *  - explanation-too-short: izoh juda qisqa
 *  - errorpart-missing: errorPart savolda yo'q
 *  - dup-options: dublikat option
 *  - empty-explanation: bo'sh explanation
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DAILY_DIR = path.resolve(__dirname, '../src/data/daily')

interface ExerciseFix {
  id: number
  file: string
  kind: string
  detail: string
}

// === KO'PIK IZOHLAR (short → expanded) ===
const EXPLANATIONS: Record<number, string> = {
  // HIGH (< 10 chars)
  100010: "3 soni ingliz tilida 'three' deb yoziladi.",
  100011: "'Seven' ingliz tilida 7 sonini bildiradi.",
  200010: "'Five' soni 5 ni anglatadi.",
}

// === BLANK-COUNT FIXLAR (id → {question?, blanks?}) ===
const BLANK_FIXES: Record<number, { blanks?: string[]; question?: string }> = {
  // 900024: 2 ta ___ bor, lekin blanks da 1 ta element ['The, the']
  900024: { blanks: ['The', 'the'] },
}

// === DUPLICATE-WORD FIXLAR (id → new question) ===
const DUP_FIXES: Record<number, { question: string }> = {
  // 100003: "I am a student. Student = ___" → "student Student"
  100003: { question: "Translate: Student = ___" },
  // 1368: "What time is it? It is 5 PM." → "it it"
  1368: { question: "Look at the clock! It is 5 PM." },
  // 19087: "I stopped ___ smoking." + blanks ["smoking"] → "smoking smoking"
  19087: { question: "I stopped ___ (smoking)." },
  // 59601: "I ___ have rushed" + blanks ["needn't have"] → "have have"
  59601: { question: "I ___ rushed — the meeting was cancelled!" },
  // 900024: Actually add ___ marks
}

// === ERRORPART FIXLAR ===
const ERRORPART_FIXES: Record<number, { errorPart?: string; question?: string }> = {
  // 900048: errorPart 'the Tashkent, the football, a music' missing from question
  // Wrap in parentheses to make it descriptive
  900048: { errorPart: '(...the Tashkent, ...the football, ...a music)' },
  // 54307: question "Which means 'sababli'?" errorPart "in spite of" not in question
  54307: { errorPart: '(in spite of → due to)', question: "Which means 'sababli'? (in spite of or due to)" },
  // 54355: question "What is anaphoric reference?" errorPart "Forward reference" not in question
  54355: { errorPart: '(Forward reference → Backward reference)', question: 'What is anaphoric reference? (Forward/Backward reference)' },
  // 54391: question "Which is informal?" errorPart "investigate" not in question
  54391: { errorPart: '(investigate → look into)', question: 'Which is informal? (investigate or look into)' },
  // 59533: question "Subordinator nima?" errorPart "teng bog'lovchi" not in question
  59533: { errorPart: '(teng bog\'lovchi → tobe bog\'lovchi)', question: 'Subordinator nima? (teng/tobe bog\'lovchi)' },
}

// === EMPTY EXPLANATION FIXLAR (elaborative exercises) ===
const EMPTY_EXPL_FIXES: Record<number, { explanation: string }> = {
  99700: { explanation: "'Good night' kechasi yotishdan oldin aytiladigan xayrlashish iborasi, salomlashish emas." },
  99701: { explanation: "Ingliz tilida 'I' olmoshi bilan doim 'am' fe'li ishlatiladi — bu 'be' fe'lining shakli." },
  99702: { explanation: "O'zbek alifbosida ingliz tilida yo'q harflar bor (o', g', q, sh, ch), shuning uchun uzbek tilida 35 harf." },
}

// === DUP-OPTIONS FIXLAR ===
const DUP_OPTIONS_FIXES: Record<number, { options: string[] }> = {
  5120: { options: ['am knowing', 'know', 'knew'] },
}

// === ASOSIY FIX FUNKSIYASI ===
function fixFile(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8')
  let modified = false

  // 1) BLANK-COUNT FIXES — null yo'qotish
  for (const [idStr, fix] of Object.entries(BLANK_FIXES)) {
    const id = Number(idStr)

    // Find the exercise by ID and replace blanks
    // Pattern: `id: <N>, ... blanks: [...]`
    // We need to match the blanks array
    if (fix.blanks) {
      const blanksStr = JSON.stringify(fix.blanks)
      // Match id: N, ... blanks: ['...', '...']
      // This is tricky because of different quote styles. Let's use a broader approach.
      const regex = new RegExp(`(id:\\s*${id}[\\s\\S]*?blanks:\\s*)\\[([^\\]]+)\\]`)
      if (regex.test(content)) {
        content = content.replace(regex, (match, prefix) => {
          return `${prefix}${blanksStr}`
        })
        modified = true
        console.log(`  ✅ Fixed blank-count for #${id} in ${path.basename(filePath)}`)
      }
    }
  }

  // 2) EXPLANATION FIXES
  for (const [id, newExpl] of Object.entries(EXPLANATIONS)) {
    const regex = new RegExp(`(id:\\s*${id}[\\s\\S]*?explanation:\\s*')([^']+)(')`)
    const regex2 = new RegExp(`(id:\\s*${id}[\\s\\S]*?explanation:\\s*")([^"]+)(")`)
    
    let replaced = false
    content = content.replace(regex, (match, prefix, _, suffix) => {
      replaced = true
      return `${prefix}${newExpl}${suffix}`
    })
    if (!replaced) {
      content = content.replace(regex2, (match, prefix, _, suffix) => {
        replaced = true
        return `${prefix}${newExpl}${suffix}`
      })
    }
    if (replaced) {
      modified = true
      console.log(`  ✅ Fixed explanation for #${id} in ${path.basename(filePath)}`)
    }
  }

  // 3) EMPTY EXPLANATION FIXES (elaborative)
  for (const [id, fix] of Object.entries(EMPTY_EXPL_FIXES)) {
    // These elaborative exercises don't have an explanation field. Add one.
    // Pattern: { id: N, type: 'elaborative', ... }
    // Add explanation: '...'
    const explStr = fix.explanation.replace(/'/g, "\\'")
    const regex = new RegExp(`(id:\\s*${id}[\\s\\S]*?type:\\s*'elaborative'[\\s\\S]*?)(\\}[\\s\\S]*?\\n\\s*\\})`)
    // Simpler: find the line with this id and add explanation before the closing }
    const lineRegex = new RegExp(`({[\\s\\S]{0,200}id:\\s*${id}[\\s\\S]{0,500}type:\\s*'elaborative'[\\s\\S]{0,500}exampleAnswer:\\s*'[^']*'\\s*})`)
    
    if (lineRegex.test(content)) {
      content = content.replace(lineRegex, (match) => {
        // Add explanation just before the last }
        const lastBrace = match.lastIndexOf('}')
        if (lastBrace > 0) {
          const before = match.substring(0, lastBrace)
          const after = match.substring(lastBrace)
          return `${before},\n      explanation: '${fix.explanation}'\n    ${after}`
        }
        return match
      })
      modified = true
      console.log(`  ✅ Fixed empty-explanation for #${id} in ${path.basename(filePath)}`)
    } else {
      // Try with regex for the specific line
      const simpleRegex = new RegExp(`(\\{ id:\\s*${id}[^}]*?exampleAnswer:\\s*'[^']*')\\s*}`)
      content = content.replace(simpleRegex, (match, capture) => {
        return `${capture},\n      explanation: '${fix.explanation}'\n    }`
      })
      modified = true
      console.log(`  ✅ Fixed empty-explanation for #${id} in ${path.basename(filePath)} (simple regex)`)
    }
  }

  // 4) DUP-OPTIONS FIXES
  for (const [id, fix] of Object.entries(DUP_OPTIONS_FIXES)) {
    const optsStr = JSON.stringify(fix.options).replace(/,/g, ', ')
    const regex = new RegExp(`(id:\\s*${id}[\\s\\S]*?options:\\s*)\\[[^\\]]+\\]`)
    if (regex.test(content)) {
      content = content.replace(regex, (match, prefix) => {
        return `${prefix}${optsStr}`
      })
      modified = true
      console.log(`  ✅ Fixed dup-options for #${id} in ${path.basename(filePath)}`)
    }
  }

  // 5) ERRORPART FIXES
  for (const [id, fix] of Object.entries(ERRORPART_FIXES)) {
    if (fix.errorPart) {
      const errorPartStr = fix.errorPart.replace(/'/g, "\\'")
      const regex = new RegExp(`(id:\\s*${id}[\\s\\S]*?errorPart:\\s*)'[^']+'`)
      if (regex.test(content)) {
        content = content.replace(regex, (match, prefix) => {
          return `${prefix}'${fix.errorPart}'`
        })
        modified = true
        console.log(`  ✅ Fixed errorpart for #${id} in ${path.basename(filePath)}`)
      }
    }
    
    // Also fix question if provided
    if (fix.question) {
      const qRegex = new RegExp(`(id:\\s*${id}[\\s\\S]*?question:\\s*)'[^']+'`)
      const qRegex2 = new RegExp(`(id:\\s*${id}[\\s\\S]*?question:\\s*)"[^"]+"`)
      if (qRegex.test(content)) {
        content = content.replace(qRegex, (match, prefix) => {
          return `${prefix}'${fix.question}'`
        })
        modified = true
        console.log(`  ✅ Fixed question for #${id} in ${path.basename(filePath)}`)
      } else if (qRegex2.test(content)) {
        content = content.replace(qRegex2, (match, prefix) => {
          return `${prefix}"${fix.question}"`
        })
        modified = true
        console.log(`  ✅ Fixed question for #${id} in ${path.basename(filePath)} (double quotes)`)
      }
    }
  }

  // 6) DUPLICATE-WORD FIXES
  for (const [id, fix] of Object.entries(DUP_FIXES)) {
    const newQ = fix.question
    // Try single quotes first, then double quotes
    const qRegex = new RegExp(`(id:\\s*${id}[\\s\\S]*?question:\\s*)'[^']+'`)
    const qRegex2 = new RegExp(`(id:\\s*${id}[\\s\\S]*?question:\\s*)"[^"]+"`)
    
    let replaced = false
    const result = content.replace(qRegex, (match, prefix) => {
      replaced = true
      return `${prefix}'${newQ}'`
    })
    content = result
    if (!replaced) {
      content = content.replace(qRegex2, (match, prefix) => {
        replaced = true
        return `${prefix}"${newQ}"`
      })
    }
    if (replaced) {
      modified = true
      console.log(`  ✅ Fixed duplicate-word for #${id} in ${path.basename(filePath)}`)
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`  💾 Saved: ${path.basename(filePath)}`)
    return true
  }
  return false
}

// === RUN ===
function main() {
  console.log('=== DARSLAR XATOLARINI AVTOMATIK TUZATISH ===\n')

  // Get all TS files in daily directory (exclude index and safe files)
  const files = fs.readdirSync(DAILY_DIR)
    .filter(f => f.endsWith('.ts') && !f.includes('index') && !f.endsWith('.safe'))

  let fixedCount = 0
  let totalFiles = 0

  for (const file of files) {
    const filePath = path.join(DAILY_DIR, file)
    console.log(`\n📄 ${file}:`)
    const fixed = fixFile(filePath)
    if (fixed) fixedCount++
    totalFiles++
  }

  console.log(`\n=== TUZATISH YAKUNLANDI ===`)
  console.log(`Jami fayllar: ${totalFiles}`)
  console.log(`O'zgartirilgan fayllar: ${fixedCount}`)
}

main()
