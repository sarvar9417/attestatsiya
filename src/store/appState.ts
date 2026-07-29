import type { AuthSlice } from './authSlice'
import type { ProgressSlice } from './progressSlice'
import type { LessonSlice } from './lessonSlice'
import type { PersonalVocabularySlice } from './personalVocabularySlice'

export type AppState = AuthSlice & ProgressSlice & LessonSlice & PersonalVocabularySlice
