import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.join(__dirname, '..', 'src', 'data', 'speakingPath', 'days.ts')
let content = fs.readFileSync(filePath, 'utf-8')
const lines = content.split('\n')

const linkedLessonMap: Record<number, string | null> = {
  1: null, 2: null, 3: null,
  4: 'alphabet-greetings', 5: 'numbers-1-100', 6: 'prepositions-of-place',
  7: 'time-routines', 8: 'family', 9: 'simple-present',
  10: 'alphabet-greetings', 11: 'food-drinks', 12: 'food-drinks',
  13: 'colors-shapes', 14: 'there-is-are', 15: 'animals',
  16: 'clothes', 17: 'basic-adjectives', 18: 'time-routines',
  19: 'gerunds-infinitives', 20: 'simple-past', 21: 'present-continuous-future',
  22: 'modal-verbs', 23: 'prepositions', 24: 'articles',
  25: 'questions', 26: 'there-is-are', 27: 'have-got',
  28: 'adjective-adverb', 29: 'demonstratives', 30: 'present-perfect',
  31: 'present-continuous-future', 32: 'possessives', 33: 'quantifiers',
  34: 'countable-uncountable', 35: 'modal-verbs', 36: 'gerunds-infinitives',
  37: 'modal-verbs', 38: 'questions', 39: 'modal-verbs',
  40: 'present-perfect', 41: 'time-prepositions', 42: 'modal-verbs',
  43: 'first-conditional', 44: 'conjunctions', 45: 'questions',
  46: 'countable-uncountable', 47: 'prepositions', 48: 'there-is-are',
  49: 'present-perfect', 50: 'modal-verbs', 51: 'first-conditional',
  52: 'modal-verbs', 53: 'countable-uncountable', 54: 'gerunds-infinitives',
  55: 'present-perfect', 56: 'verb-patterns', 57: 'modal-verbs',
  58: 'narrative-tenses-b1plus', 59: 'infinitive-gerund-advanced-b1plus',
  60: 'collocations-make-do-have-take-b1plus', 61: 'concession-b1plus',
  62: 'idioms-common-b1plus', 63: 'reporting-verbs-b1plus',
  64: 'linking-words-advanced-b1plus', 65: 'determiners-advanced-b1plus',
  66: 'narrative-tenses-b1plus', 67: 'modal-perfects-b1plus',
  68: 'ellipsis-substitution-b1plus', 69: 'participle-clauses-b1plus',
  70: 'infinitive-gerund-advanced-b1plus', 71: 'prepositional-phrases-b1plus',
  72: 'word-formation-b1plus', 73: 'emphasis-does-b1plus',
  74: 'collocations-make-do-have-take-b1plus', 75: null,
}

const b1plusDays = new Set([58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75])

let currentDay = 0
let addedLinkedForDay = false
const newLines: string[] = []

for (let i = 0; i < lines.length; i++) {
  let line = lines[i]
  const trimmed = line.trim()

  // Detect day start
  if (trimmed.startsWith('const day')) {
    const match = trimmed.match(/const day(\d+):/)
    if (match) {
      currentDay = parseInt(match[1])
      addedLinkedForDay = false
    }
  }

  // Change cefr for B1+ days
  if (b1plusDays.has(currentDay) && trimmed.startsWith('day:') && trimmed.includes("cefr: 'B1'")) {
    line = line.replace("cefr: 'B1'", "cefr: 'B1+'")
    console.log(`✓ Day ${currentDay}: cefr B1 → B1+`)
  }

  // Add linkedLessonId after FIRST goalUz line per day (not scenario.goalUz)
  if (!addedLinkedForDay && currentDay >= 1 && currentDay <= 75 && trimmed.startsWith('goalUz:')) {
    const lessonId = linkedLessonMap[currentDay]
    if (lessonId) {
      newLines.push(line)
      newLines.push(`  linkedLessonId: '${lessonId}',`)
      addedLinkedForDay = true
      console.log(`✓ Day ${currentDay}: linkedLessonId = ${lessonId}`)
      continue
    }
  }

  newLines.push(line)
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8')
console.log('\n✅ Transformation complete!')
