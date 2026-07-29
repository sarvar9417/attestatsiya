/**
 * Noaniq (ko'p javobli) mashqlarni aniqlash skripti
 * 
 * Bu skript fill-blank mashqlarida kontekst yo'q bo'lsa,
 * bir nechta to'g'ri javob bo'lishi mumkin bo'lgan holatlarni topadi.
 * 
 * Noaniq bo'lishi mumkin bo'lgan patternlar:
 * - This/That/These/Those (demonstrative pronouns)
 * - A/An/The (articles)
 * - Will/Going to (future forms)
 * - Can/Could/May (modal verbs)
 * - Some/Any (quantifiers)
 * - Much/Many
 */

import { A1_LESSONS_NEW } from '../src/data/daily/index'
import { A2_LESSONS } from '../src/data/daily/lessonsA2'
import { B1_LESSONS_NEW } from '../src/data/daily/lessonsB1'
import { B1PLUS_LESSONS_NEW } from '../src/data/daily/lessonsB1plus'
import { B2_LESSONS_NEW } from '../src/data/daily/lessonsB2'
import type { DailyLesson, DailyExercise } from '../src/data/dailyLessons'

// Noaniq bo'lishi mumkin bo'lgan pattern lar
// E'tibor: a/an — talaffuzga qarab (undosh/unli), shu sababli ularni chalkashmaslik sifatida qabul qilamiz
// "that" ni relative clause kontekstida alohida tekshiramiz (relative pronoun emas, demonstrative)
const AMBIGUOUS_PATTERNS = [
  {
    words: ['this', 'these', 'those'],
    reason: 'Demonstrative pronouns — kontekstsiz ikkalasi ham to\'g\'ri'
  },
  {
    words: ['that'],
    reason: 'Demonstrative pronouns — kontekstsiz ikkalasi ham to\'g\'ri',
    // "that" ni relative clause kontekstida tekshirish (who/which/that)
    checkContext: (question: string) => !question.toLowerCase().includes('who') &&
                                       !question.toLowerCase().includes('which') &&
                                       !question.toLowerCase().includes('said') &&
                                       !question.toLowerCase().includes('you') &&
                                       !question.toLowerCase().includes('believe') &&
                                       !question.toLowerCase().includes('think') &&
                                       !question.toLowerCase().includes('know') &&
                                       !question.toLowerCase().includes('say')
  },
  {
    words: ['will', "'ll", 'going to'],
    reason: 'Future forms — ko\'pincha ikkalasi ham to\'g\'ri'
  },
  {
    words: ['can', 'could', 'may', 'might', 'must', 'should', 'would'],
    reason: 'Modal verbs — kontekstsiz bir nechta to\'g\'ri',
    // Modal verbs kontekstini tekshirish
    checkContext: (question: string) => {
      const q = question.toLowerCase()
      // "so" yoki "neither" javoblar kontekstida - aniq
      if (q.includes('so') || q.includes('neither') || q.includes('either')) return true
      // "wish" kontekstida - aniq (wish + could)
      if (q.includes('wish')) return true
      // "ought to" ham to'g'ri bo'lishi mumkin
      return false
    }
  },
  {
    words: ['some', 'any'],
    reason: 'Quantifiers — muhit farqsiz ikkalasi mumkin'
  },
  {
    words: ['much', 'many', 'a lot of', 'lots of'],
    reason: 'Quantifiers — much to\'g\'ri, a lot of ham'
  },
]

// Kontekst so'zlari — agar savolda bu so'zlar bo'lsa, aniq bo'ladi
const CONTEXT_WORDS = [
  'near', 'far', 'close', 'here', 'there', 'always', 'every day',
  'now', 'at the moment', 'right now', 'currently', 'today', 'tomorrow',
  'yesterday', 'next week', 'last night', 'soon', 'later', 'before',
  'after', 'when', 'while', 'as', 'because', 'since', 'if', 'unless', 'how',
  'by monday', 'by the end', 'by then', 'by the time', 'by 2026',
  // O'zbekcha kontekst so'zlari
  'yaqin', 'uzoq', 'bular', 'ular', 'birlik', 'ko\'plik'
]

interface FlaggedExercise {
  lessonId: string
  exerciseId: number
  question: string
  blank: string
  reason: string
  hasContext: boolean
}

/**
 * Barcha darslarni bitta massivga jamlash
 */
function getAllLessons(): DailyLesson[] {
  return [
    ...A1_LESSONS_NEW,
    ...A2_LESSONS,
    ...B1_LESSONS_NEW,
    ...B1PLUS_LESSONS_NEW,
    ...B2_LESSONS_NEW,
  ]
}

/**
 * Noaniq mashqlarni topish
 */
export function findAmbiguousExercises(): FlaggedExercise[] {
  const lessons = getAllLessons()
  const flagged: FlaggedExercise[] = []

  for (const lesson of lessons) {
    // Exercises
    for (const ex of lesson.exercises) {
      if (ex.type !== 'fill-blank') continue
      
      // Agar acceptedAnswers allaqachon mavjud bo'lsa, o'tkazib yuboramiz
      if (ex.acceptedAnswers) continue
      
      for (const blank of ex.blanks) {
        for (const pattern of AMBIGUOUS_PATTERNS) {
          if (pattern.words.some(w => w.toLowerCase() === blank.toLowerCase())) {
            // Kontekst so'zi savolda bormi?
            let hasContext = CONTEXT_WORDS.some(ctx => 
              (ex.question + ' ' + (ex.instruction ?? '')).toLowerCase().includes(ctx)
            )
            
            // Pattern-specific context check (masalan, "that" relative clause kontekstida)
            if (pattern.checkContext && !pattern.checkContext(ex.question)) {
              hasContext = true
            }

            if (!hasContext) {
              flagged.push({
                lessonId: lesson.id,
                exerciseId: ex.id,
                question: ex.question,
                blank,
                reason: pattern.reason,
                hasContext
              })
            }
            break
          }
        }
      }
    }

    // Tests
    for (const test of lesson.tests) {
      if (test.type !== 'fill-blank') continue
      
      // Agar acceptedAnswers allaqachon mavjud bo'lsa, o'tkazib yuboramiz
      if (test.acceptedAnswers) continue
      
      for (const blank of test.blanks) {
        for (const pattern of AMBIGUOUS_PATTERNS) {
          if (pattern.words.some(w => w.toLowerCase() === blank.toLowerCase())) {
            let hasContext = CONTEXT_WORDS.some(ctx => 
              (test.question + ' ' + (test.instruction ?? '')).toLowerCase().includes(ctx)
            )
            
            // Pattern-specific context check
            if (pattern.checkContext && !pattern.checkContext(test.question)) {
              hasContext = true
            }

            if (!hasContext) {
              flagged.push({
                lessonId: lesson.id,
                exerciseId: test.id,
                question: test.question,
                blank,
                reason: pattern.reason,
                hasContext
              })
            }
            break
          }
        }
      }
    }
  }

  return flagged
}

/**
 * Natijalarni konsolga chiqarish
 */
function printResults(): void {
  const flagged = findAmbiguousExercises()
  
  console.log(`\n🔍 ${flagged.length} ta noaniq mashq topildi:\n`)
  
  // Dars bo'yicha guruhlash
  const byLesson = flagged.reduce((acc, f) => {
    if (!acc[f.lessonId]) acc[f.lessonId] = []
    acc[f.lessonId].push(f)
    return acc
  }, {} as Record<string, FlaggedExercise[]>)

  for (const [lessonId, exercises] of Object.entries(byLesson)) {
    console.log(`\n📚 [${lessonId}] - ${exercises.length} ta noaniq mashq:`)
    for (const ex of exercises) {
      console.log(`  ID:${ex.exerciseId}`)
      console.log(`  Savol: "${ex.question}"`)
      console.log(`  Blank: "${ex.blank}" — ${ex.reason}`)
      console.log()
    }
  }

  // Statistika
  console.log(`\n📊 Statistika:`)
  console.log(`  - Jami noaniq mashqlar: ${flagged.length}`)
  console.log(`  - Darslar soni: ${Object.keys(byLesson).length}`)
  
  // Pattern bo'yicha statistika
  const patternStats = flagged.reduce((acc, f) => {
    const key = f.reason
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  console.log(`\n  Pattern bo'yicha taqsimot:`)
  for (const [pattern, count] of Object.entries(patternStats)) {
    console.log(`    - ${pattern}: ${count} ta`)
  }
}

// Agar skript to'xtidan-to'xtmasa ishga tushirilgan bo'lsa
if (import.meta.url === `file://${process.argv[1]}`) {
  printResults()
}