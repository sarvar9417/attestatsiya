/**
 * A1 darslaridagi barcha acceptedAnswers ni tuzatadi.
 * - acceptedAnswers maydonini olib tashlaydi
 * - Savollarni aniq qiladi (1 ta to'g'ri javob)
 */
import { readFileSync, writeFileSync } from 'fs'

interface Fix {
  file: string
  search: string
  replace: string
}

const FIXES: Fix[] = [
  // === a1Part1.ts - foodAndDrinks (5 fixes) ===
  {
    file: 'src/data/daily/a1Part1.ts',
    search: `{ id: 1391, type: 'fill-blank', instruction: "Some yoki any:", question: 'She wants ___ oranges.', blanks: ['some'], acceptedAnswers: [['some', 'any']], explanation: "Ijobiy — some (lekin any ham grammatik to'g'ri, lekin kamroq muntazir)" }`,
    replace: `{ id: 1391, type: 'fill-blank', instruction: "Some yoki any:", question: 'She wants ___ oranges.', blanks: ['some'], explanation: "Ijobiy gapda — some" }`,
  },
  {
    file: 'src/data/daily/a1Part1.ts',
    search: `{ id: 1398, type: 'fill-blank', instruction: "Bo'sh joyni to'ldiring:", question: 'Would you like ___ coffee?', blanks: ['some'], acceptedAnswers: [['some', 'any']], explanation: "Taklif — some (lekin any ham grammatik to'g'ri)" }`,
    replace: `{ id: 1398, type: 'fill-blank', instruction: "Some yoki any:", question: 'Would you like ___ coffee?', blanks: ['some'], explanation: "Taklif/offer — some" }`,
  },
  {
    file: 'src/data/daily/a1Part1.ts',
    search: `{ id: 1416, type: 'fill-blank', instruction: "Some yoki any:", question: 'I have ___ cookies.', blanks: ['some'], acceptedAnswers: [['some', 'any']], explanation: "Ijobiy — some (lekin any ham grammatik to'g'ri)" }`,
    replace: `{ id: 1416, type: 'fill-blank', instruction: "Some yoki any:", question: 'I have ___ cookies.', blanks: ['some'], explanation: "Ijobiy gapda — some" }`,
  },
  {
    file: 'src/data/daily/a1Part1.ts',
    search: `{ id: 1417, type: 'fill-blank', instruction: "Some yoki any:", question: 'I don\\'t have ___ eggs.', blanks: ['any'], acceptedAnswers: [['any', 'some']], explanation: "Inkor — any (lekin some ham kamroq muntazir)" }`,
    replace: `{ id: 1417, type: 'fill-blank', instruction: "Some yoki any:", question: 'I don\\'t have ___ eggs.', blanks: ['any'], explanation: "Inkor gapda — any" }`,
  },
  {
    file: 'src/data/daily/a1Part1.ts',
    search: `{ id: 1423, type: 'fill-blank', instruction: "Bo'sh joyni to'ldiring:", question: 'Would you like ___ juice?', blanks: ['some'], acceptedAnswers: [['some', 'any']], explanation: "Taklif — some (lekin any ham grammatik to'g'ri)" }`,
    replace: `{ id: 1423, type: 'fill-blank', instruction: "Some yoki any:", question: 'Would you like ___ juice?', blanks: ['some'], explanation: "Taklif/offer — some" }`,
  },

  // === a1Part2.ts - demonstratives (12 fixes) ===
  // Exercises with context already in instruction - just remove acceptedAnswers
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2339, type: 'fill-blank', instruction: \"This/that:\", question: '___ is a cat. (yaqin)', blanks: ['This'], acceptedAnswers: [['This', 'That']], explanation: \"yaqin = this (lekin that ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2339, type: 'fill-blank', instruction: \"This/that [near me]:\", question: '___ is a cat. (yaqin)', blanks: ['This'], explanation: \"yaqin = this\" }`,
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2340, type: 'fill-blank', instruction: \"These/those:\", question: '___ are my parents. (uzoq)', blanks: ['Those'], acceptedAnswers: [['These', 'Those']], explanation: \"uzoq ko'plik = those (lekin these ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2340, type: 'fill-blank', instruction: \"These/those [far away]:\", question: '___ are my parents. (uzoq)', blanks: ['Those'], explanation: \"uzoq ko'plik = those\" }`,
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2344, type: 'fill-blank', instruction: \"This/that/these/those:\", question: '___ is an apple. (yaqin)', blanks: ['This'], acceptedAnswers: [['This', 'That']], explanation: \"yaqin birlik (lekin that ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2344, type: 'fill-blank', instruction: \"This/that [near me]:\", question: '___ is an apple. (yaqin)', blanks: ['This'], explanation: \"yaqin = this\" }`,
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2348, type: 'fill-blank', instruction: \"This/that/these/those:\", question: '___ is a mountain. (uzoq)', blanks: ['That'], acceptedAnswers: [['This', 'That']], explanation: \"uzoq birlik (lekin this ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2348, type: 'fill-blank', instruction: \"This/that [far away]:\", question: '___ is a mountain. (uzoq)', blanks: ['That'], explanation: \"uzoq = that\" }`,
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2351, type: 'fill-blank', instruction: \"This/that/these/those:\", question: '___ books are new. (yaqin)', blanks: ['These'], acceptedAnswers: [['These', 'Those']], explanation: \"yaqin ko'plik (lekin those ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2351, type: 'fill-blank', instruction: \"These/those [near me]:\", question: '___ books are new. (yaqin)', blanks: ['These'], explanation: \"yaqin ko'plik = these\" }`,
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2357, type: 'fill-blank', instruction: \"Bo'sh joyni to'ldiring:\", question: 'What are ___? (bular, yaqin)', blanks: ['these'], acceptedAnswers: [['these', 'those']], explanation: \"yaqin ko'plik = these (lekin those ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2357, type: 'fill-blank', instruction: \"Bo'sh joyni to'ldiring:\", question: 'What are ___? (bular, yaqin)', blanks: ['these'], explanation: \"yaqin ko'plik = these\" }`,
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2358, type: 'fill-blank', instruction: \"Bo'sh joyni to'ldiring:\", question: 'What is ___? (u, uzoq, birlik)', blanks: ['that'], acceptedAnswers: [['this', 'that']], explanation: \"uzoq birlik = that (lekin this ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2358, type: 'fill-blank', instruction: \"Bo'sh joyni to'ldiring:\", question: 'What is ___? (u, uzoq, birlik)', blanks: ['that'], explanation: \"uzoq birlik = that\" }`,
  },
  // Tests - add context to make unambiguous
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2359, type: 'fill-blank', instruction: \"This/that:\", question: '___ is my book.', blanks: ['This'], acceptedAnswers: [['this', 'that']], explanation: \"yaqin = this (lekin that ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2359, type: 'fill-blank', instruction: \"This/that [in my hand]:\", question: '___ [in my hand] is my book.', blanks: ['This'], explanation: \"qo'limdagi = this\" }`,
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2360, type: 'fill-blank', instruction: \"These/those:\", question: '___ are my friends.', blanks: ['These'], acceptedAnswers: [['these', 'those']], explanation: \"yaqin ko'plik (lekin those ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2360, type: 'fill-blank', instruction: \"These/those [next to me]:\", question: '___ [next to me] are my friends.', blanks: ['These'], explanation: \"yonimdagilar = these\" }`,
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2364, type: 'fill-blank', instruction: \"This/that/these/those:\", question: '___ is an apple.', blanks: ['This'], acceptedAnswers: [['this', 'that']], explanation: \"yaqin (lekin that ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2364, type: 'fill-blank', instruction: \"This/that [near me]:\", question: '___ [near me] is an apple.', blanks: ['This'], explanation: \"yaqin = this\" }`,
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2368, type: 'fill-blank', instruction: \"This/that/these/those:\", question: '___ is a mountain.', blanks: ['That'], acceptedAnswers: [['this', 'that']], explanation: \"uzoq (lekin this ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2368, type: 'fill-blank', instruction: \"This/that [far away]:\", question: '___ [far away] is a mountain.', blanks: ['That'], explanation: \"uzoq = that\" }`,
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `    { id: 2371, type: 'fill-blank', instruction: \"This/that/these/those:\", question: '___ books are new.', blanks: ['These'], acceptedAnswers: [['these', 'those']], explanation: \"yaqin ko'plik (lekin those ham grammatik to'g'ri)\" }`,
    replace: `    { id: 2371, type: 'fill-blank', instruction: \"These/those [near me]:\", question: '___ [near me] books are new.', blanks: ['These'], explanation: \"yaqin ko'plik = these\" }`,
  },

  // === a1Part2.ts - questionWords (2 fixes) ===
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `acceptedAnswers: [['much', 'many']], explanation: \"How many — ko'plik\"`,
    replace: `explanation: \"How much — narx so'rash\"`,
  },
  {
    file: 'src/data/daily/a1Part2.ts',
    search: `acceptedAnswers: [['much', 'many']], explanation: \"How much — sanalmas\"`,
    replace: `explanation: \"How much — sanalmas (water)\"`,
  },

  // === tenses/tensesData.ts - simpleFuture (3 fixes) ===
  {
    file: 'src/data/tenses/tensesData.ts',
    search: `acceptedAnswers: [['will', 'is going to']], explanation: \"Will — kelajak (is going to ham mumkin)\"`,
    replace: `explanation: \"Will — kutilmagan qaror\"`,
  },
  {
    file: 'src/data/tenses/tensesData.ts',
    search: `acceptedAnswers: [[\"'ll\", 'will be']], explanation: \"Will — kelajak\"`,
    replace: `explanation: \"Will — kelajak bashorat\"`,
  },
  {
    file: 'src/data/tenses/tensesData.ts',
    search: `acceptedAnswers: [['will', 'are you going to be']], explanation: \"Will — kelajak\"`,
    replace: `explanation: \"Will — kelajakda vaqt oralig'i\"`,
  },
]

function main(): void {
  const files = new Map<string, string[]>()
  
  for (const fix of FIXES) {
    if (!files.has(fix.file)) files.set(fix.file, [])
    files.get(fix.file)!.push(fix.search)
  }

  // Verify searches exist
  for (const [file, searches] of files) {
    const content = readFileSync(file, 'utf-8')
    for (const search of searches) {
      if (!content.includes(search)) {
        console.log(`⚠️  NOT FOUND in ${file}: ${search.substring(0, 80)}...`)
      }
    }
  }

  // Apply fixes
  for (const fix of FIXES) {
    const content = readFileSync(fix.file, 'utf-8')
    if (!content.includes(fix.search)) {
      console.log(`❌ SKIPPED: could not find in ${fix.file}`)
      continue
    }
    const newContent = content.replace(fix.search, fix.replace)
    writeFileSync(fix.file, newContent, 'utf-8')
    console.log(`✅ Fixed in ${fix.file}: ${fix.search.substring(0, 60)}...`)
  }

  console.log('\n✅ All acceptedAnswers fixes applied!')
}

main()
