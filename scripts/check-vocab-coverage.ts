import { readFileSync } from 'fs'

const content = readFileSync('src/data/daily/a1Part1.ts', 'utf-8')

// Find alphabetAndGreetings section
const start = content.indexOf('export const alphabetAndGreetings: DailyLesson = {')
const end = content.indexOf('export const numbers: DailyLesson = {', start)
const section = content.substring(start, end)

// Extract vocabulary
const vocab: string[] = []
// Match en: '...' or en: "..." 
const lines = section.split('\n')
let inVocab = false
for (const line of lines) {
  if (line.includes("vocabulary: [") || (inVocab && line.includes(']'))) {
    inVocab = inVocab ? false : true
  }
}

// Just extract all en: values from the vocabulary array
const vocabMatch = section.match(/vocabulary:\s*\[([\s\S]*?)\]\s*,/)
if (vocabMatch) {
  const vocabSection = vocabMatch[1]
  const enRegex = /en:\s*['"]([^'"]+)['"]/g
  let m
  while ((m = enRegex.exec(vocabSection)) !== null) {
    const word = m[1].toLowerCase().trim()
    if (!vocab.includes(word)) vocab.push(word)
  }
}

console.log('=== VOCABULARY ===')
console.log(vocab.join(', '))
console.log(`Total: ${vocab.length} words\n`)

// Find exercises + tests section
const exercisesStart = section.indexOf('exercises: [')
const testsEnd = section.indexOf('],\n  testSections:', section.indexOf('tests: ['))
if (testsEnd === -1) {
  const afterTests = section.indexOf('testSections:', section.indexOf('tests: ['))
  const testSectionEnd = section.indexOf('],\n  reading:', afterTests)
  // The tests array ends somewhere - just take up to testSections
}

// Alternative: just search the whole section minus specialCases
const specialCasesStart = section.indexOf("specialCases: [")
const specialCasesEnd = section.indexOf("],\n  exercises:", specialCasesStart)
const exTestSection = section.substring(specialCasesEnd + 1) // exercises onwards

console.log('=== VOCAB COVERAGE (exercises+tests only) ===')
const under2: string[] = []
for (const word of vocab) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escaped, 'gi')
  const matches = exTestSection.match(regex)
  const count = matches ? matches.length : 0
  const status = count >= 2 ? '✅' : '❌'
  console.log(`${status} ${word}: ${count}`)
  if (count < 2) under2.push(word)
}

console.log(`\nUnder 2: ${under2.join(', ') || 'none'}`)
