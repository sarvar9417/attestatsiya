export type Level = 'A2+' | 'B1' | 'B1+' | 'B2'

export interface DailyChecklist {
  grammar:    boolean
  vocabulary: boolean
  phrases:    boolean
  listening:  boolean
  reading:    boolean
  writing:    boolean
  speaking:   boolean
}

export interface MockResult {
  score: number
  level: Level
  date: string
}

export interface LessonSessionData {
  tab: string
  currentSection: number
  testSection: number
  completedSections: Record<number, number>
  completedTestSections: Record<number, number>
  vocabDone?: boolean
  vocabPushedCount?: number
  reviewQuizCount?: number
  updatedAt: number
}
