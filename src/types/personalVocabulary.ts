export type VocabSource = 'manual' | 'ai_generated' | 'imported'
export type VocabCategory =
  | 'custom' | 'grammar' | 'travel' | 'formal' | 'ielts' | 'business'
  | 'food' | 'health' | 'education' | 'social' | 'work' | 'shopping'
  | 'relationships' | 'environment' | 'economy' | 'culture' | 'feelings'
  | 'discussion' | 'technology' | 'communication'

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun' | 'interjection' | 'other'

export interface PersonalWord {
  id: number
  user_id: string
  english: string
  uzbek: string
  phonetic?: string | null
  example?: string | null
  example_uzbek?: string | null
  part_of_speech?: PartOfSpeech | null
  category: VocabCategory
  level: 'A1' | 'A2' | 'B1' | 'B2'
  source: VocabSource
  ai_suggested_translation?: string
  box: number
  next_review: string
  is_learned: boolean
  correct_count: number
  wrong_count: number
  last_rating?: string
  fsrs_stability?: number
  fsrs_difficulty?: number
  fsrs_reps?: number
  fsrs_lapses?: number
  created_at: string
  updated_at: string
}

export interface PersonalVocabSession {
  id: number
  user_id: string
  vocab_id: number
  session_date: string
  result: 'correct' | 'wrong'
  rating?: string
  created_at: string
}

export interface AddWordDTO {
  english: string
  uzbek: string
  phonetic?: string | null
  example?: string | null
  example_uzbek?: string | null
  part_of_speech?: PartOfSpeech | null
  category?: VocabCategory
  level?: 'A1' | 'A2' | 'B1' | 'B2'
  source?: VocabSource
  ai_suggested_translation?: string
}

export interface UpdateWordDTO {
  english?: string
  uzbek?: string
  phonetic?: string | null
  example?: string | null
  example_uzbek?: string | null
  part_of_speech?: PartOfSpeech | null
  category?: VocabCategory
  level?: 'A1' | 'A2' | 'B1' | 'B2'
}

export interface PersonalVocabularyImportResult {
  inserted: PersonalWord[]
  skipped: number
}

export interface WordSessionResult {
  vocabId: number
  english: string
  uzbek: string
  level: 'A1' | 'A2' | 'B1' | 'B2'
  box: number
  result: 'correct' | 'wrong'
  rating?: VocabRating
}

export type VocabRating = 'bildim' | 'qiynaldim' | 'bilmadim' | 'yodladim'
