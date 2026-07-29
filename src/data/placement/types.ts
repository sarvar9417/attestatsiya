// Placement Test — daraja aniqlash tiplari
// Reja: docs/EnglishPath_Roadmap.md (1.1)

import type { Level } from '../../store/types'

/** Savol qiyinlik bandi.
 *  Ilova Level'i A2+→B2; 'A2' bandi "poldan past" (boshlang'ich) detektori. */
export type PlacementBand = 'A2' | 'A2+' | 'B1' | 'B1+' | 'B2'
export type PlacementCategory = 'grammar' | 'vocabulary' | 'reading'

export interface PlacementQuestion {
  id: string
  band: PlacementBand
  category: PlacementCategory
  /** savol matni (reading uchun mini-kontekst shu yerga kiritiladi) */
  question: string
  options: string[]
  /** to'g'ri javob indeksi (0-based) */
  correct: number
  /** natija ekranida ko'rsatiladigan qisqa izoh */
  explanation?: string
}

export interface PlacementResult {
  /** ilovaga o'rnatiladigan daraja (A2+ pol, B2 shift) */
  level: Level
  /** band bo'yicha to'g'ri/jami */
  bandScores: Record<PlacementBand, { correct: number; total: number }>
  correctCount: number
  totalAsked: number
  /** ISO sana */
  takenAt: string
}
