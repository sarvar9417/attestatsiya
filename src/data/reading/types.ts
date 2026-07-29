export interface VocabWord {
  word:          string
  partOfSpeech:  string
  definition:    string
  example:       string
}

export interface CompQuestion {
  id:           number
  question:     string
  options:      string[]
  correctIndex: number
  explanation:  string
}

export interface ReadingText {
  id:          string
  title:       string
  level:       'A1' | 'A2' | 'B1' | 'B1+' | 'B2'
  topic:       string
  wordCount:   number
  readingTime: number   // minutes for countdown timer
  paragraphs:  string[]
  vocabWords:  VocabWord[]   // 10 highlighted words
  questions:   CompQuestion[] // 5 MCQ
}

