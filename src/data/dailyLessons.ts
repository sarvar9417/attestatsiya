export interface SpecialCase {
  id: string
  title: string
  rule: string
  mnemonic: string       // yodda saqlash uchun maslahat
  commonMistakes: string // eng ko'p uchraydigan xato
  examples: { en: string; uz: string }[]
  drills: DailyExercise[]
}

export interface DailyLesson {
  id: string
  title: string
  subtitle: string
  level: string
  day: number
  category?: string
  formulas: { label: string; structure: string; color: string; explanation?: string; example?: string; whenToUse?: string; pronunciation?: string }[]
  rules: string[]
  vocabulary: { en: string; uz: string; example: string; rule: string }[]
  examples: { en: string; uz: string }[]
  specialCases: SpecialCase[]
  exercises: DailyExercise[]
  exerciseSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
  tests: DailyExercise[]
  testSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
  image?: string
  reading?: ReadingSection
  writing?: WritingSection
  listening?: ListeningSection
  speaking?: SpeakingSection
  dialogues?: Dialogue[]
  culturalNotes?: CulturalNote[]
}

export interface Dialogue {
  id: string
  title: string
  context: string
  lines: DialogueLine[]
}

export interface DialogueLine {
  speaker: string
  text: string
  translation: string
  en?: string
  uz?: string
}

export interface CulturalNote {
  id: string
  title: string
  description: string
  icon?: string
  category?: string
}

export interface ReadingSection {
  id?: string | number
  title?: string
  passage: string
  vocabulary?: { word: string; definition: string; example?: string }[]
  questions: ReadingQuestion[]
  mainIdea?: string[]
  discussion?: { question: string; hints: string[] }[]
}

export interface ReadingQuestion {
  id: number
  type: 'multiple-choice'
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface WritingSection {
  prompt: string
  wordLimit: number
  tips: string[]
  modelAnswer?: string
  keyPhrases?: { phrase: string; translation: string }[]
  structure?: string[]
}

export interface SpeakingSection {
  prompt: string
  tips: string[]
  keyPhrases?: { phrase: string; translation: string }[]
  sampleAnswer?: string
}

export interface ListeningSection {
  youtubeId?: string
  /** Zaxira video/audio manbasi (masalan Supabase Storage) — youtubeId o'chsa ishlatiladi (F9-1) */
  backupUrl?: string
  transcript: string
  source?: string
  duration?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  topic?: string
  vocabulary?: { word: string; definition: string; example?: string }[]
  questions: ListeningQuestion[]
  dictation?: { startLine: number; endLine: number }[]
  mainIdea?: string[]
  discussion?: { question: string; hints: string[] }[]
}

export type ListeningQuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'fill-blank'
  | 'multiple-answer'
  | 'ordering'
  | 'matching'

export interface ListeningQuestion {
  id: number
  type: ListeningQuestionType
  question: string
  options?: string[]
  correctIndex?: number
  correctIndices?: number[]
  correctOrder?: number[]
  blanks?: string[]
  answer?: string | boolean
  pairs?: { left: string; right: string }[]
  explanation: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export type DailyExercise =
  | { id: number; type: 'fill-blank'; instruction: string; question: string; blanks: string[]; acceptedAnswers?: string[][]; explanation: string; visualHint?: string }
  | { id: number; type: 'multiple-choice'; instruction: string; question: string; options: [string, string, string, string]; correct: string; explanation: string; visualHint?: string }
  | { id: number; type: 'error-correction'; instruction: string; question: string; errorPart: string; correct: string; explanation: string }
  | { id: number; type: 'transformation'; instruction: string; question: string; hint: string; correct: string; explanation: string }
  | { id: number; type: 'fill-table'; instruction: string; rows: { adj: string; comp: string; sup: string }[]; explanation: string }
  | { id: number; type: 'vocab-match'; instruction: string; word: string; options: string[]; correct: string; explanation: string }
  | { id: number; type: 'passage'; instruction: string; passage: string; blanks: string[]; acceptedAnswers?: string[][]; explanation: string }
  | { id: number; type: 'connection'; instruction: string; prompt: string; hints: string[]; exampleAnswer: string }
  | { id: number; type: 'elaborative'; instruction: string; question: string; exampleAnswer: string }


export interface ReviewLesson {
  id: string
  type: 'review'
  title: string
  subtitle: string
  level: string
  day?: number           // progressSlice lessons array'idagi ketma-ket raqam (loadAllLessons tomonidan beriladi)
  afterDay: number
  coversDays: number[]
  coversTopics: string[]
  keyRules?: { topic: string; icon: string; color: string; rules: string[] }[]
  exercises: DailyExercise[]
  exerciseSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
  tests: DailyExercise[]
  testSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
}

export async function loadAllLessons(): Promise<(DailyLesson | ReviewLesson)[]> {
  const [
    { A1_LESSONS_NEW },
    { A2_LESSONS },
    { B1_LESSONS_NEW },
    { B1PLUS_LESSONS_NEW },
    { B2_LESSONS_NEW },
    { REVIEW_LESSONS },
  ] = await Promise.all([
    import('./daily/a1Registry'),
    import('./daily/lessonsA2'),
    import('./daily/lessonsB1'),
    import('./daily/lessonsB1plus'),
    import('./daily/lessonsB2'),
    import('./daily/reviewLessons'),
  ])

  // Har bir daraja massivi endi o'z zamonlarini va comparatives ni o'z ichiga oladi
  // (pedagogik tartibda singdirilgan) — bu yerda faqat darajalarni ketma-ket ulaymiz
  const regularLessons: DailyLesson[] = [
    ...A1_LESSONS_NEW,
    ...A2_LESSONS,
    ...B1_LESSONS_NEW,
    ...B1PLUS_LESSONS_NEW,
    ...B2_LESSONS_NEW,
  ]

  // REVIEW_LESSONS larni "regular" KETMA-KETLIK POZITSIYASI bo'yicha joylashtirish.
  // coversDays = regular (review'siz) ketma-ketlikdagi pozitsiyalar (1..N), shuning
  // uchun review max(coversDays)-pozitsiyali darsdan KEYIN chiqadi.
  // (Oldin lesson.day — manba qiymati — ishlatilardi; u final pozitsiyaga teng emas edi.)
  const reviewsByPos = new Map<number, ReviewLesson[]>()
  for (const review of REVIEW_LESSONS) {
    const pos = Math.max(...review.coversDays)
    if (!reviewsByPos.has(pos)) reviewsByPos.set(pos, [])
    reviewsByPos.get(pos)!.push(review)
  }

  const result: (DailyLesson | ReviewLesson)[] = []
  regularLessons.forEach((lesson, idx) => {
    result.push(lesson)
    const reviews = reviewsByPos.get(idx + 1)
    if (reviews) result.push(...reviews)
  })

  // Agar biror review ning coversDays dagi max day oddiy darslar orasida topilmasa,
  // uni eng oxiriga qo'shamiz
  const placedIds = new Set(result.filter((r): r is ReviewLesson => 'type' in r && r.type === 'review').map(r => r.id))
  for (const review of REVIEW_LESSONS) {
    if (!placedIds.has(review.id)) {
      result.push(review)
    }
  }

  // Ketma-ket day raqamlari — review darslari va oddiy darslar bir xil raqamlanadi
  return result.map((item, index) => ({ ...item, day: index + 1 })) as (DailyLesson | ReviewLesson)[]
}
