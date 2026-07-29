import type { DailyLesson } from '../dailyLessons'
import { comparativesSuperlatives } from './a2Comparatives'
import { modalVerbs, articles, prepositions, questionsLesson, countableUncountable } from './a2Part1'
// gerundsInfinitives, passiveVoice, reportedSpeech, firstConditional — CEFR bo'yicha B1
// darslar, shuning uchun B1 registriga (lessonsB1.ts) ko'chirildi. Bu yerda faqat adjectiveAdverb.
import { adjectiveAdverb } from './a2Part2'
// thereIsThereAre — A1 'There is/are' (thereIsAre) bilan dublikat → ketma-ketlikdan chiqarildi
import { possessives, someAnyNoEvery, verbPatterns, timePrepositions } from './a2Part3'
import { presentContinuousFuture, quantifiers, tooEnough, soSuch, a2Review2 } from './a2Part4'
// A2 Relative Clauses — asosiy who/which/that/where/when
import { basicRelativeClausesA2 } from './a2RelativeClauses'
// A2 zamonlari — darajaga singdirildi (oldin alohida blok bo'lib oxirda turardi)
import { pastContinuous, presentPerfect } from '../tenses/tensesData'
// 6 zamon aralash takrorlash
import { tensesMixedReview } from './tensesMixedReview'

// A2 — pedagogik tartibda (soddadan murakkabga), zamonlar singdirilgan, takror oxirida:
//   asoslar → sifat/comparatives → ZAMONLAR → qolgan struktura → relative → review
//   (gerund/passive/reported/first-conditional B1 ga ko'chirildi — CEFR mosligi uchun)
export const A2_LESSONS: DailyLesson[] = [
  modalVerbs,
  articles,
  prepositions,
  questionsLesson,
  countableUncountable,
  adjectiveAdverb,
  comparativesSuperlatives,
  pastContinuous,
  presentPerfect,
  tensesMixedReview,
  verbPatterns,
  timePrepositions,
  possessives,
  someAnyNoEvery,
  presentContinuousFuture,
  quantifiers,
  tooEnough,
  soSuch,
  basicRelativeClausesA2,
  a2Review2,
]
