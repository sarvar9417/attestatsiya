import { test, expect } from 'vitest'
import { writeFileSync } from 'node:fs'
import { loadAllLessons } from '../dailyLessons'
import { LESSON_INDEX, type LessonMeta } from '../daily/lessonsIndex'

function toMeta(x: Record<string, unknown>): LessonMeta {
  const arr = (k: string) => Array.isArray(x[k]) ? (x[k] as unknown[]).length : 0
  return {
    id: x.id as string,
    title: (x.title as string) ?? '',
    subtitle: (x.subtitle as string) ?? '',
    level: (x.level as string) ?? '',
    day: x.day as number,
    isReview: 'type' in x && (x as { type?: string }).type === 'review',
    ...(x.category ? { category: x.category as string } : {}),
    ...(Array.isArray(x.coversTopics) ? { coversTopics: x.coversTopics as string[] } : {}),
    formulas: arr('formulas'),
    vocabulary: arr('vocabulary'),
    exercises: arr('exercises'),
    tests: arr('tests'),
    hasReading: !!x.reading,
    hasWriting: !!x.writing,
    hasListening: !!x.listening,
    hasSpeaking: !!x.speaking,
  }
}

test('LESSON_INDEX is in sync with loadAllLessons', async () => {
  const all = await loadAllLessons()
  const computed = (all as Record<string, unknown>[]).map(toMeta)

  if (process.env.UPDATE_INDEX) {
    const header = `// AVTO-GENERATSIYA — qo'lda tahrirlamang.\n` +
      `// Yangilash: \`UPDATE_INDEX=1 npx vitest run src/data/__tests__/lessonsIndex.test.ts\`\n` +
      `//\n` +
      `// Darslar RO'YXATI (LearnHub) uchun YENGIL metadata — to'liq dars kontenti\n` +
      `// (mashqlar, lug'at...) bu yerda YO'Q, shuning uchun ro'yxat tez ochiladi.\n` +
      `// To'liq kontent faqat dars OCHILGANDA yuklanadi.\n\n` +
      `export interface LessonMeta {\n` +
      `  id: string\n  title: string\n  subtitle: string\n  level: string\n  day: number\n` +
      `  isReview: boolean\n  category?: string\n  coversTopics?: string[]\n` +
      `  formulas: number\n  vocabulary: number\n  exercises: number\n  tests: number\n` +
      `  hasReading: boolean\n  hasWriting: boolean\n  hasListening: boolean\n  hasSpeaking: boolean\n}\n\n` +
      `export const LESSON_INDEX: LessonMeta[] = ${JSON.stringify(computed, null, 2)}\n`
    writeFileSync('src/data/daily/lessonsIndex.ts', header)
    return
  }

  expect(LESSON_INDEX).toEqual(computed)
}, 30000)
