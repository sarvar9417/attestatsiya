/**
 * Auto-generate unique exercise IDs for all lessons.
 * 
 * ID Schema (non-overlapping ranges per level, unique across ALL files):
 * - A1 files:  1001-4999
 * - A2 files: 14001-38999
 * - B1 files: 40001-49999
 * - B1+ files: 50001-53999
 * - B2 files: 54001-75999
 * - Review:    80001-89999
 * 
 * Each file within a level gets a non-overlapping sub-range to ensure
 * no cross-file duplicate IDs. Within each file, IDs are assigned
 * sequentially to eliminate all duplicates.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

interface LessonFile {
  path: string
  level: 'A1' | 'A2' | 'B1' | 'B1+' | 'B2' | 'REVIEW'
  idRange: [number, number]
}

const LESSON_FILES: LessonFile[] = [
  // A1
  { path: 'src/data/daily/a1Part1.ts', level: 'A1', idRange: [1001, 4999] },
  { path: 'src/data/daily/a1Part2.ts', level: 'A1', idRange: [1001, 4999] },
  { path: 'src/data/tenses/tensesData.ts', level: 'A1', idRange: [1001, 4999] },
  // A2
  { path: 'src/data/daily/a2Part1.ts', level: 'A2', idRange: [14001, 38999] },
  { path: 'src/data/daily/a2Part2.ts', level: 'A2', idRange: [14001, 38999] },
  { path: 'src/data/daily/a2Part3.ts', level: 'A2', idRange: [14001, 38999] },
  { path: 'src/data/daily/a2Part4.ts', level: 'A2', idRange: [14001, 38999] },
  { path: 'src/data/dailyLessons.ts', level: 'A2', idRange: [14001, 38999] },
  // B1
  { path: 'src/data/daily/b1Part1.ts', level: 'B1', idRange: [40001, 49999] },
  { path: 'src/data/daily/b1Extra.ts', level: 'B1', idRange: [40001, 49999] },
  // B1+
  { path: 'src/data/daily/b1plusPart1.ts', level: 'B1+', idRange: [50001, 53999] },
  { path: 'src/data/daily/b1plusPart2.ts', level: 'B1+', idRange: [50001, 53999] },
  // B2
  { path: 'src/data/daily/b2Part1.ts', level: 'B2', idRange: [54001, 75999] },
  { path: 'src/data/daily/b2Part2.ts', level: 'B2', idRange: [54001, 75999] },
  { path: 'src/data/daily/b2Part3.ts', level: 'B2', idRange: [54001, 75999] },
  { path: 'src/data/daily/b2Extra.ts', level: 'B2', idRange: [54001, 75999] },
  // Review
  { path: 'src/data/daily/reviewLessons.ts', level: 'REVIEW', idRange: [80001, 89999] },
]

function collectOldIds(content: string): number[] {
  const ids: number[] = []
  const regex = /([{\,]\s*)("?id"?\s*:\s*)(\d+)(?=\s*[,}])/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(content)) !== null) {
    ids.push(parseInt(match[3], 10))
  }
  return ids
}

function replaceIdsSequentially(content: string, startId: number): string {
  let nextId = startId
  let replaceCount = 0
  const result = content.replace(
    /([{\,]\s*)("?id"?\s*:\s*)(\d+)(?=\s*[,}])/g,
    (match, prefix, idPrefix) => {
      replaceCount++
      return `${prefix}${idPrefix}${nextId++}`
    }
  )

  return result
}

function main(): void {
  const isDryRun = process.argv.includes('--dry-run')
  if (isDryRun) console.log('🔍 DRY RUN — no files will be modified\n')
  else console.log('🔧 Exercise ID auto-generation (sequential per file, non-overlapping ranges)\n')

  const byLevel = new Map<string, LessonFile[]>()
  for (const file of LESSON_FILES) {
    const existing = byLevel.get(file.level) ?? []
    existing.push(file)
    byLevel.set(file.level, existing)
  }

  for (const [level, files] of byLevel) {
    console.log(`\n📚 ${level} lessons:`)
    const [rangeStart, rangeEnd] = files[0].idRange
    const totalRange = rangeEnd - rangeStart + 1
    const filesCount = files.length
    
    const subRangeSize = Math.floor(totalRange / filesCount)
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fullPath = join(process.cwd(), file.path)
      
      const fileRangeStart = rangeStart + (i * subRangeSize)
      const fileRangeEnd = i === files.length - 1 
        ? rangeEnd 
        : rangeStart + ((i + 1) * subRangeSize) - 1
      
      try {
        const content = readFileSync(fullPath, 'utf-8')
        const oldIds = collectOldIds(content)
        console.log(`  Found ${oldIds.length} IDs in ${file.path}`)

        const newContent = replaceIdsSequentially(content, fileRangeStart)
        if (isDryRun) {
          console.log(`  [DRY RUN] Would update ${file.path} (${oldIds.length} exercises, range ${fileRangeStart}-${fileRangeEnd})`)
          continue
        }
        writeFileSync(fullPath, newContent, 'utf-8')
        console.log(`  Processing ${file.path}...`)
        console.log(`    ✅ Updated (${oldIds.length} exercises, range ${fileRangeStart}-${fileRangeEnd})`)
      } catch (err) {
        console.error(`    ❌ Error processing ${file.path}: ${err}`)
      }
    }
  }

  if (isDryRun) console.log('\n🔍 Dry run complete. No files were modified.')
  else console.log('\n✅ Done! Run validate:ids to verify.')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
