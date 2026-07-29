// Re-export type
export type { DailyLesson } from '../dailyLessons'

// Re-export individual tense constants
export {
  simplePresent,
  presentContinuous,
  simplePast,
  pastContinuous,
  presentPerfect,
  presentPerfectContinuous,
  pastPerfect,
  pastPerfectContinuous,
  simpleFuture,
  futureContinuous,
  futurePerfect,
  futurePerfectContinuous,
} from './tensesData'

// Combined export arrays
import {
  simplePresent,
  presentContinuous,
  simplePast,
  pastContinuous,
  presentPerfect,
  presentPerfectContinuous,
  pastPerfect,
  pastPerfectContinuous,
  simpleFuture,
  futureContinuous,
  futurePerfect,
  futurePerfectContinuous,
} from './tensesData'
import type { DailyLesson } from '../dailyLessons'

export const TENSES_LESSONS: DailyLesson[] = [
  simplePresent,
  presentContinuous,
  simplePast,
  pastContinuous,
  presentPerfect,
  presentPerfectContinuous,
  pastPerfect,
  pastPerfectContinuous,
  simpleFuture,
  futureContinuous,
  futurePerfect,
  futurePerfectContinuous,
]

export const A1_TENSES: DailyLesson[] = [
  simplePresent,
  presentContinuous,
  simplePast,
  simpleFuture,
]

export const A2_TENSES: DailyLesson[] = [
  presentPerfect,
  pastContinuous,
]

export const B1_TENSES: DailyLesson[] = [
  presentPerfectContinuous,
  pastPerfect,
  pastPerfectContinuous,
  futureContinuous,
  futurePerfect,
]

export const B2_TENSES: DailyLesson[] = [
  futurePerfectContinuous,
]
