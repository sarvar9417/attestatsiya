// ─── Exercise types ───────────────────────────────────────────────────────────

export interface FillBlankQ {
  id: number
  type: 'fill-blank'
  instruction: string
  question: string   // "If I _____ (have) time, I _____ (go)."
  blanks: string[]   // ["had", "would go"]
  explanation: string
}

export interface MCQ {
  id: number
  type: 'multiple-choice'
  instruction: string
  question: string
  options: [string, string, string, string]
  correct: string
  explanation: string
}

export interface ErrorQ {
  id: number
  type: 'error-correction'
  instruction: string
  question: string   // wrong sentence
  errorPart: string  // the incorrect fragment (for UI hint)
  correct: string    // corrected sentence
  explanation: string
}

export interface TransformQ {
  id: number
  type: 'transformation'
  instruction: string
  question: string   // source sentence
  hint: string       // start of the answer, e.g. "If I had..."
  correct: string    // expected output
  explanation: string
}

export type Exercise = FillBlankQ | MCQ | ErrorQ | TransformQ

// ─── Topic type ───────────────────────────────────────────────────────────────

export interface FormulaRow {
  label: string
  structure: string
  color: 'blue' | 'purple' | 'green' | 'orange'
}

export interface GrammarTopic {
  id: string
  title: string
  subtitle: string
  level: 'A1' | 'A2' | 'B1' | 'B1+' | 'B2'
  week: number
  tag: string
  formula: string          // one-line formula text
  formulaRows: FormulaRow[]
  usedFor: string[]
  examples: { en: string; uz: string }[]
  exercises: Exercise[]
}

