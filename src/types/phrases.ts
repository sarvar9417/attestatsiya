export type PhraseLevel = 'A1' | 'A2' | 'B1' | 'B2'
export type PhraseCategory =
  | 'everyday' | 'grammar' | 'travel' | 'formal' | 'ielts' | 'business'
  | 'food' | 'health' | 'education' | 'social' | 'work' | 'shopping'
  | 'relationships' | 'environment' | 'economy' | 'culture' | 'feelings'
  | 'discussion' | 'technology' | 'communication'
export type PhraseRating = 'bildim' | 'qiynaldim' | 'bilmadim' | 'yodladim'

export interface DailyPhraseRow {
  phrase_id:    number
  english:      string
  uzbek:        string
  level:        PhraseLevel
  category:     PhraseCategory
  box:          number
  next_review:  string
  is_learned:   boolean
  correct_count: number
  wrong_count:  number
  is_new:       boolean
  last_rating?: string
}

export interface PhraseSessionResult {
  phrase_id: number
  english:   string
  uzbek:     string
  level:     PhraseLevel
  box:       number
  result:    'correct' | 'wrong'
}
