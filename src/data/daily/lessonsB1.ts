import type { DailyLesson } from '../dailyLessons'
import {
  futureFormsReview, modalsObligation, modalsSpeculation, pastHabits,
  causatives, questionTags, bothEitherNeither, timeClauses,
  indirectQuestions, soNeitherAuxiliaries, wishesRegrets,
} from './b1Part1'
// B1 zamonlari — darajaga singdirildi (oldin 5 tasi B1 oxiriga to'plangan edi)
import {
  presentPerfectContinuous, pastPerfect, pastPerfectContinuous,
  futureContinuous, futurePerfect,
} from '../tenses/tensesData'
// Kurikulum bo'shliqlari to'ldirildi (Supabase'dan): asosiy Relative Clauses va Phrasal Verbs
import { relativeClausesB1, phrasalVerbsB1 } from './b1Extra'
// B1 Second Conditional — unreal/hypothetical situations
import { secondConditionalB1 } from './b1SecondConditional'
import { pragmaticsFormalInformal } from './b1Pragmatics'
// CEFR bo'yicha B1 darslar — A2 registridan ko'chirildi (fayl joyi a2Part2.ts da qoldi)
import { gerundsInfinitives, firstConditional, passiveVoice, reportedSpeech } from './a2Part2'

// B1 — perfect/continuous zamonlari oldinroq, keyin modallar va murakkab tuzilmalar:
//   perfect zamonlar → past habits → kelasi zamonlar → modallar → relative → struktura → phrasal → wishes
export const B1_LESSONS_NEW: DailyLesson[] = [
  gerundsInfinitives,
  firstConditional,
  presentPerfectContinuous,
  pastPerfect,
  pastPerfectContinuous,
  pastHabits,
  futureFormsReview,
  futureContinuous,
  futurePerfect,
  modalsObligation,
  modalsSpeculation,
  causatives,
  passiveVoice,
  reportedSpeech,
  relativeClausesB1,
  questionTags,
  indirectQuestions,
  bothEitherNeither,
  soNeitherAuxiliaries,
  timeClauses,
  secondConditionalB1,
  phrasalVerbsB1,
  wishesRegrets,
  pragmaticsFormalInformal,
]
