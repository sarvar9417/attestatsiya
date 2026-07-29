import { getAllLessons } from '../src/data/daily'
import type { DailyLesson } from '../src/data/dailyLessons'

interface Duplicate {
  id: number
  lessons: string[]
}

/**
 * Validate all exercise/test IDs across all lessons for uniqueness.
 * Reports duplicates without throwing — safe for CI.
 */
export function validateLessonIds(): Duplicate[] {
  const lessons = getAllLessons()
  const seen = new Map<number, string[]>()
  const duplicates: Duplicate[] = []

  for (const lesson of lessons) {
    for (const ex of [...lesson.exercises, ...(lesson.tests ?? [])]) {
      const existing = seen.get(ex.id)
      if (existing) {
        existing.push(lesson.id)
        // Update or add to duplicates list
        const dup = duplicates.find(d => d.id === ex.id)
        if (dup) {
          dup.lessons.push(lesson.id)
        } else {
          duplicates.push({ id: ex.id, lessons: [existing[0], lesson.id] })
        }
      } else {
        seen.set(ex.id, [lesson.id])
      }
    }
  }

  const uniqueCount = seen.size
  const dupCount = duplicates.length

  if (dupCount === 0) {
    console.log(`✅ ${uniqueCount} ta unique exercise ID tekshirildi — duplikat yo'q`)
  } else {
    console.log(`⚠️  ${uniqueCount} ta unique ID, ${dupCount} ta duplikat topildi:`)
    for (const dup of duplicates) {
      console.log(`  ID ${dup.id}: ${dup.lessons.join(' ↔ ')}`)
    }
  }

  return duplicates
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const duplicates = validateLessonIds()
  if (duplicates.length > 0) {
    process.exitCode = 1
  }
}
