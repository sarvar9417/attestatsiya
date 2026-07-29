// Re-export type
export type { DailyLesson } from '../dailyLessons'

// Re-export A0 lesson constants
export {
  greetingsAndNames,
  numbersAndAlphabet,
  familyAndMe,
} from './a0Part1'

// Re-export A1 lesson constants
export {
  alphabetAndGreetings,
  numbers,
  colorsAndShapes,
  family,
  daysAndMonths,
  timeAndRoutines,
  foodAndDrinks,
  animals,
  bodyParts,
  clothes,
} from './a1Part1'

export {
  demonstratives,
  thereIsAre,
  canCant,
  haveGot,
  presentSimple,
  questionWords,
  conjunctions,
  a1Review,
  prepositionsOfPlace,
  basicAdjectives,
} from './a1Part2'

export { articles as articlesA1 } from './a1Articles'

export { greetingsAndIntroductions } from './a1Greetings'

// Re-export individual lesson constants
export {
  modalVerbs,
  articles,
  prepositions,
  questionsLesson,
  countableUncountable,
} from './a2Part1'

export {
  adjectiveAdverb,
  gerundsInfinitives,
  passiveVoice,
  reportedSpeech,
  firstConditional,
} from './a2Part2'

export {
  thereIsThereAre,
  possessives,
  someAnyNoEvery,
  verbPatterns,
  timePrepositions,
} from './a2Part3'

export {
  presentContinuousFuture,
  quantifiers,
  tooEnough,
  soSuch,
  a2Review2,
} from './a2Part4'

export {
  futureFormsReview,
  modalsObligation,
  modalsSpeculation,
  pastHabits,
  causatives,
  questionTags,
  bothEitherNeither,
  timeClauses,
  indirectQuestions,
  soNeitherAuxiliaries,
  wishesRegrets,
} from './b1Part1'

export { pragmaticsFormalInformal } from './b1Pragmatics'

export {
  narrativeTensesB1plus,
  advancedRelativeClausesB1plus,
  participleClausesB1plus,
  infinitiveGerundAdvancedB1plus,
  modalPerfectsB1plus,
  emphasisDoesB1plus,
  frontingB1plus,
  ellipsisSubstitutionB1plus,
  concessionB1plus,
} from './b1plusPart1'

export {
  linkingWordsAdvanced,
  collocationsMakeDoHaveTake,
  advancedPhrasalVerbs,
  idiomsCommon,
  prepositionalPhrases,
  wordFormation,
  reportingVerbs,
  determinersAdvanced,
  b1plusReview,
} from './b1plusPart2'

export {
  unrealPastB2,
  advancedConditionalsB2,
  nominalizationB2,
  subjunctiveB2,
  hedgingB2,
  complexPrepositionsB2,
  cohesionB2,
  registerB2,
} from './b2Part1'

export {
  britishAmericanDifferencesB2,
} from './b2BritishAmerican'

export {
  modalsPragmaticsB2,
} from './b2ModalsPragmatics'

export {
  complexSentencesB2,
  advancedModalsB2,
  contrastiveStructuresB2,
  punctuationB2,
  academicCollocationsB2,
  criticalThinkingB2,
  b2Review,
} from './b2Part2'

export {
  argumentStructureB2,
  stanceMarkersB2,
  paraphrasingB2,
  advancedVerbPatternsB2,
  b2ComprehensiveReview,
} from './b2Part3'

// Re-export A1 lesson constants
export { A1_LESSONS_NEW } from './a1Registry'

// Combined export arrays — re-export from lesson registries
import { A1_LESSONS_NEW } from './a1Registry'
import { A2_LESSONS } from './lessonsA2'
import { B1_LESSONS_NEW } from './lessonsB1'
import { B1PLUS_LESSONS_NEW } from './lessonsB1plus'
import { B2_LESSONS_NEW } from './lessonsB2'
import type { DailyLesson } from '../dailyLessons'

// Daraja massivlari — YAGONA manba lessonsX.ts (loadAllLessons aynan shularni ishlatadi;
// zamonlar va comparatives pedagogik tartibda o'sha fayllarga singdirilgan)

/** Barcha darslarni bitta massivga jamlash */
export function getAllLessons(): DailyLesson[] {
  return [
    ...A1_LESSONS_NEW,
    ...A2_LESSONS,
    ...B1_LESSONS_NEW,
    ...B1PLUS_LESSONS_NEW,
    ...B2_LESSONS_NEW,
  ]
}
