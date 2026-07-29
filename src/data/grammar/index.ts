// Re-export types
export type {
  FillBlankQ,
  MCQ,
  ErrorQ,
  TransformQ,
  Exercise,
  FormulaRow,
  GrammarTopic,
} from './types'

// Re-export topic constants by level
export {
  verbToBe,
  haveGot,
  canCannot,
  presentSimpleIYou,
  presentSimpleHeShe,
  thereIsThereAre as thereIsThereAreA1,
  questionWords,
  basicPrepositions,
} from './a1Topics'

export {
  comparativesSuperlatives,
  modalVerbsA2,
  articlesA2,
  presentPerfectA2,
  firstConditional,
  passiveVoiceA2,
    presentContinuous,
  pastSimple,
  futureForms,
  thereIsThereAre,
  possessives,
  someAnyNoEvery,
} from './a2Topics'

export {
  secondConditional,
  presentPerfect,
  passiveVoice,
  reportedSpeech,
  relativeClauses,
  gerundsInfinitives,
  firstConditionalFull,
} from './b1Topics'

export {
  thirdConditional,
  wishIfOnly,
  advancedModals,
} from './b1plusTopics'

export {
  inversion,
  mixedConditionals,
  advancedPassive,
  cleftSentences,
    advancedRelativeClauses,
  advancedReportedSpeech,
  advancedWishIfOnly,
  phrasalVerbs,
  linkingDevices,
  hedgingStance,
} from './b2Topics'

// Combined GRAMMAR_TOPICS array (preserves original order)
import { verbToBe, haveGot, canCannot, presentSimpleIYou, presentSimpleHeShe, thereIsThereAre as thereIsThereAreA1, questionWords, basicPrepositions } from './a1Topics'
import { comparativesSuperlatives, modalVerbsA2, articlesA2, presentPerfectA2, firstConditional, passiveVoiceA2, presentContinuous, pastSimple, futureForms, thereIsThereAre, possessives, someAnyNoEvery } from './a2Topics'
import { secondConditional, presentPerfect, passiveVoice, reportedSpeech, relativeClauses, gerundsInfinitives, firstConditionalFull } from './b1Topics'
import { thirdConditional, wishIfOnly, advancedModals } from './b1plusTopics'
import { inversion, mixedConditionals, advancedPassive, cleftSentences, advancedRelativeClauses, advancedReportedSpeech, advancedWishIfOnly, phrasalVerbs, linkingDevices, hedgingStance } from './b2Topics'
import type { GrammarTopic } from './types'

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  // ── A1 ─────────────────────────────────────────────────────────────────
  verbToBe,
  haveGot,
  canCannot,
  presentSimpleIYou,
  presentSimpleHeShe,
  thereIsThereAreA1,
  questionWords,
  basicPrepositions,

  // ── A2 ─────────────────────────────────────────────────────────────────
  comparativesSuperlatives,
  modalVerbsA2,
  articlesA2,
  presentPerfectA2,
  firstConditional,
  passiveVoiceA2,

  // ── New A2 topics
  presentContinuous,
  pastSimple,
  futureForms,
  thereIsThereAre,
  possessives,
  someAnyNoEvery,

  // ── B1 ─────────────────────────────────────────────────────────────────
  secondConditional,
  presentPerfect,
  passiveVoice,
  reportedSpeech,
  relativeClauses,
  gerundsInfinitives,
  firstConditionalFull,

  // ── B1+ ────────────────────────────────────────────────────────────────
  thirdConditional,
  wishIfOnly,
  advancedModals,

  // ── B2 ─────────────────────────────────────────────────────────────────
  inversion,
  mixedConditionals,
  advancedPassive,
  cleftSentences,

  // ── New B2 topics
  advancedRelativeClauses,
  advancedReportedSpeech,
  advancedWishIfOnly,
  phrasalVerbs,
  linkingDevices,
  hedgingStance,
]
