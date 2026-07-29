/**
 * A1 darslaridagi barcha acceptedAnswers maydonlarini olib tashlaydi.
 * Har bir savolga FAQAT 1 ta to'g'ri javob qoladi (blanks yoki correct field).
 */
import { readFileSync, writeFileSync } from 'fs'

const FILES = [
  'src/data/daily/a1Part1.ts',
  'src/data/daily/a1Part2.ts',
  'src/data/tenses/tensesData.ts',
]

// acceptedAnswers pattern variants to remove
const AA_PATTERNS = [
  /,\s*acceptedAnswers:\s*\[\[['"](?:This|That|These|Those|this|that|these|those)['"],\s*['"](?:This|That|These|Those|this|that|these|those)['"]]\]/g,
  /,\s*acceptedAnswers:\s*\[\[['"](some|any)['"],\s*['"](some|any)['"]]\]/g,
  /,\s*acceptedAnswers:\s*\[\[['"](much|many)['"],\s*['"](much|many)['"]]\]/g,
  /,\s*acceptedAnswers:\s*\[\[['"](will|is going to)['"],\s*['"](will|is going to)['"]]\]/g,
  /,\s*acceptedAnswers:\s*\[\[["'](?:'ll|will be)["'],\s*["'](?:'ll|will be)["']\]\]/g,
  /,\s*acceptedAnswers:\s*\[\[['"](will|are you going to be)['"],\s*['"](will|are you going to be)['"]]\]/g,
]

// Also fix explanation text for a1Part2.ts demonstratives (remove "(lekin X ham...)" parts)
const EXPLANATION_FIXES: { file: string; pattern: RegExp; replacement: string }[] = [
  {
    file: 'src/data/daily/a1Part2.ts',
    pattern: /\(lekin that ham grammatik to'g'ri\)/g,
    replacement: '',
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    pattern: /\(lekin these ham grammatik to'g'ri\)/g,
    replacement: '',
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    pattern: /\(lekin this ham grammatik to'g'ri\)/g,
    replacement: '',
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    pattern: /\(lekin those ham grammatik to'g'ri\)/g,
    replacement: '',
  },
  {
    file: 'src/data/daily/a1Part1.ts',
    pattern: /\(lekin any ham grammatik to'g'ri, lekin kamroq muntazir\)/g,
    replacement: '',
  },
  {
    file: 'src/data/daily/a1Part1.ts',
    pattern: /\(lekin any ham grammatik to'g'ri\)/g,
    replacement: '',
  },
  {
    file: 'src/data/daily/a1Part1.ts',
    pattern: /\(lekin some ham kamroq muntazir\)/g,
    replacement: '',
  },
]

function main(): void {
  let totalRemoved = 0
  
  for (const file of FILES) {
    let content = readFileSync(file, 'utf-8')
    const beforeLen = content.length
    
    // Remove acceptedAnswers patterns
    for (const pattern of AA_PATTERNS) {
      const matches = content.match(pattern)
      if (matches) {
        totalRemoved += matches.length
        content = content.replace(pattern, '')
      }
    }
    
    // Fix explanations
    for (const fix of EXPLANATION_FIXES) {
      if (fix.file === file) {
        content = content.replace(fix.pattern, fix.replacement)
      }
    }
    
    if (content.length !== beforeLen) {
      writeFileSync(file, content, 'utf-8')
      console.log(`✅ ${file}: updated`)
    } else {
      console.log(`ℹ️  ${file}: no changes`)
    }
  }
  
  console.log(`\n✅ Removed ${totalRemoved} acceptedAnswers fields`)
  
  // Verify no remaining acceptedAnswers
  console.log('\n--- Verification ---')
  for (const file of FILES) {
    const content = readFileSync(file, 'utf-8')
    const remaining = content.match(/acceptedAnswers/g)
    if (remaining) {
      console.log(`❌ ${file}: ${remaining.length} remaining acceptedAnswers`)
      // Show context
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('acceptedAnswers')) {
          console.log(`  Line ${i + 1}: ${lines[i].trim().substring(0, 100)}`)
        }
      }
    } else {
      console.log(`✅ ${file}: 0 remaining acceptedAnswers`)
    }
  }
}

main()
