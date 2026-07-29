// Placement Test — kontent kirish nuqtasi
// Reja: docs/EnglishPath_Roadmap.md (1.1)

import { PLACEMENT_QUESTIONS } from './questions'
import type { PlacementBand, PlacementQuestion } from './types'

export { PLACEMENT_QUESTIONS }
export type { PlacementBand, PlacementCategory, PlacementQuestion, PlacementResult } from './types'

/** Band tartibi (oson → qiyin) */
export const BAND_ORDER: PlacementBand[] = ['A2', 'A2+', 'B1', 'B1+', 'B2']

/** Jami savollar soni */
export const TOTAL_PLACEMENT_QUESTIONS = PLACEMENT_QUESTIONS.length

/** Berilgan banddagi savollar */
export function questionsInBand(band: PlacementBand): PlacementQuestion[] {
  return PLACEMENT_QUESTIONS.filter(q => q.band === band)
}
