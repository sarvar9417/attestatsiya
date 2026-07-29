import type { DailyLesson } from '../dailyLessons'
import {
  unrealPastB2, advancedConditionalsB2, nominalizationB2, subjunctiveB2,
  hedgingB2, complexPrepositionsB2, cohesionB2, registerB2,
} from './b2Part1'
import { britishAmericanDifferencesB2 } from './b2BritishAmerican'
import { modalsPragmaticsB2 } from './b2ModalsPragmatics'
import {
  complexSentencesB2, advancedModalsB2, contrastiveStructuresB2,
  punctuationB2, academicCollocationsB2, criticalThinkingB2, b2Review,
} from './b2Part2'
import {
  argumentStructureB2, stanceMarkersB2, paraphrasingB2,
  advancedVerbPatternsB2, b2ComprehensiveReview,
} from './b2Part3'
// B2 ning yagona zamoni — 12 zamon tizimini yakunlaydi; Comprehensive Review OLDIGA qo'yildi
import { futurePerfectContinuous } from '../tenses/tensesData'
// Kurikulum bo'shliqlari to'ldirildi (Supabase'dan): IELTS uchun muhim B2 mavzulari
import { advancedPassiveB2, inversionB2, cleftSentencesB2, academicVocabularyB2 } from './b2Extra'
// B2 Advanced Relative Clauses — reduced clauses, preposition+relative, compounds
import { advancedRelativeClausesB2 } from './b2AdvancedRelativeClauses'

// B2 — eng murakkab; yakuniy "Comprehensive Review" eng oxirda turishi shart
export const B2_LESSONS_NEW: DailyLesson[] = [
  unrealPastB2,
  advancedConditionalsB2,
  futurePerfectContinuous,
  nominalizationB2,
  subjunctiveB2,
  advancedPassiveB2,
  hedgingB2,
  complexPrepositionsB2,
  cohesionB2,
  registerB2,
  complexSentencesB2,
  advancedRelativeClausesB2,
  advancedModalsB2,
  contrastiveStructuresB2,
  inversionB2,
  cleftSentencesB2,
  punctuationB2,
  academicCollocationsB2,
  academicVocabularyB2,
  criticalThinkingB2,
  britishAmericanDifferencesB2,
  modalsPragmaticsB2,
  b2Review,
  argumentStructureB2,
  stanceMarkersB2,
  paraphrasingB2,
  advancedVerbPatternsB2,
  b2ComprehensiveReview,
]
