// ── 30-Day Speaking Challenge — Type'lar ────────────────────────────────────

export interface ChallengeDay {
  id: string                    // 'day-1'
  day: number                   // 1-30
  title: string                 // Sarlavha
  level: string                 // CEFR: 'A1' | 'A2' | 'B1'

  // Video
  video?: ChallengeVideo

  // Transkript
  transcript: string            // To'liq matn (timestampsiz, backup sifatida)
  timestamps?: Timestamp[]      // Vaqt tamg'alari
  structuredTranscript?: TranscriptSection[]  // Strukturali dialog

  // O'quv maqsadlari
  learningObjectives: string[]

  // Dars bo'limlari
  highlights: LessonHighlight[]

  // Lug'at
  vocabulary: ChallengeVocab[]

  // Barcha jumlalar — tanlanma emas, to'liq
  sentenceBank: SentenceBank

  // Mashqlar
  exercises: ChallengeExercise[]

  // Test
  quiz: ChallengeQuiz[]

  // Speaking
  speaking: ChallengeSpeaking

  // Takrorlash
  review: ChallengeReview

  // Ish daftari (workbook)
  workbook?: WorkbookSectionData[]
}

export interface ChallengeVideo {
  youtubeId: string
  duration?: string
}

export interface Timestamp {
  time: string   // '0:03'
  text: string   // Shu vaqtdagi matn
}

export interface LessonHighlight {
  title: string
  content: string
  points?: string[]
  phrases?: HighlightItem[]
}

export type HighlightItem = HighlightPhrase | LegacyPhrase

export interface HighlightPhrase {
  speaker: string
  text: string
  translation?: string
}

export interface LegacyPhrase {
  phrase: string
  meaning: string
}

export interface ChallengeVocab {
  word: string
  meaning: string
  example: string
  translation?: string
}

// ── SentenceBank — Barcha jumlalar ──────────────────────────────────────────

export interface SentenceBank {
  categories: SentenceCategory[]
  all?: Phrase[]      // ixtiyoriy — agar bo'lmasa categories dan hosil qilinadi
}

export interface SentenceCategory {
  category: string
  phrases: Phrase[]
}

export interface Phrase {
  en: string
  uz: string
  speaker?: string    // Dialogdan olingan bo'lsa, kim gapirgan
  timestamp?: string  // Videodagi vaqti (masalan: '2:35')
}

// ── Mashqlar ────────────────────────────────────────────────────────────────

export type ChallengeExercise =
  | DialogueExercise
  | RoleplayExercise
  | ShadowingExercise
  | QuestionsExercise

export interface DialogueExercise {
  id: number
  type: 'dialogue-complete'
  instruction: string
  lines: DialogueLine[]
}

export interface DialogueLine {
  speaker: string
  text: string
  blank?: boolean
  answer?: string      // answer only required when blank is true
}

export interface RoleplayExercise {
  id: number
  type: 'roleplay'
  instruction: string
  scenario: string
  tips?: string[]
}

export interface ShadowingExercise {
  id: number
  type: 'shadowing'
  instruction: string
  sentences: string[]
}

export interface QuestionsExercise {
  id: number
  type: 'questions'
  instruction: string
  questions: string[]
  hints?: string[]
}

// ── Test ────────────────────────────────────────────────────────────────────

export type ChallengeQuiz =
  | MultipleChoiceQuiz
  | FillBlankQuiz

export interface MultipleChoiceQuiz {
  id: number
  type: 'multiple-choice'
  question: string
  options: string[]
  correct: number       // index (0-based)
  explanation: string
}

export interface FillBlankQuiz {
  id: number
  type: 'fill-blank'
  question: string      // Blank: 'I ___ up at 7'
  options: string[]
  correct: number       // index
  explanation: string
}

// ── Strukturali Transkript ─────────────────────────────────────────────────

export interface TranscriptSection {
  id: string
  title: string              // Bo'lim nomi (masalan: "Situation one — At a restaurant")
  icon: string               // Emoji (masalan: "💬", "🎯")
  lines: TranscriptLine[]
}

export interface TranscriptLine {
  speaker?: string            // 'Massu' | 'Fizu' | boshqa
  text: string
  timestamp?: string          // '0:03'
  isKey?: boolean             // Asosiy jumlalar uchun
}

// ── Speaking ────────────────────────────────────────────────────────────────

export interface ChallengeSpeaking {
  prompt: string
  tips: string[]
  practiceTime: number  // seconds
}

// ── Review ──────────────────────────────────────────────────────────────────

export interface ChallengeReview {
  vocabulary: string[]
  keyPhrases: string[]
  mainPoints: string[]
}

// ── Ish daftari (Workbook) ──────────────────────────────────────────────────

export interface WorkbookSectionData {
  id: string
  title: string
  icon: string
  items: WorkbookItem[]
}

export type WorkbookItem =
  | WorkbookText
  | WorkbookHeading
  | WorkbookList
  | WorkbookTable
  | WorkbookDialogue
  | WorkbookVocabList
  | WorkbookTip
  | WorkbookExercise

export interface WorkbookText {
  type: 'text'
  text: string
}

export interface WorkbookHeading {
  type: 'heading'
  text: string
  level?: 1 | 2 | 3
}

export interface WorkbookList {
  type: 'list'
  items: string[]
  ordered?: boolean
}

export interface WorkbookTable {
  type: 'table'
  headers: string[]
  rows: string[][]
}

export interface WorkbookDialogue {
  type: 'dialogue'
  lines: { speaker: string; text: string }[]
}

export interface WorkbookVocabList {
  type: 'vocabulary'
  items: { word: string; meaning: string; example: string }[]
}

export interface WorkbookTip {
  type: 'tip'
  text: string
}

export interface WorkbookExercise {
  type: 'exercise'
  exerciseType: 'mcq' | 'fill-blank' | 'true-false' | 'writing'
  question: string
  options?: string[]
  correctAnswer?: string | number
  explanation?: string
  hint?: string
}
