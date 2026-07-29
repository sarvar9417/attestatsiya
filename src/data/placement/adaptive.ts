// Placement Test — adaptiv mantiq (band ladder)
// Reja: docs/EnglishPath_Roadmap.md (1.1)
// To'g'ri javob → band ko'tariladi, noto'g'ri → tushadi. Yakunda band → Level.

import { BAND_ORDER, questionsInBand } from './index'
import type { PlacementBand, PlacementQuestion, PlacementResult } from './types'
import type { Level } from '../../store/types'

/** Adaptiv testda so'raladigan savollar soni */
export const PLACEMENT_TEST_LENGTH = 15

/** Boshlang'ich band (o'rtadan) */
const START_BAND: PlacementBand = 'B1'

export interface PlacementSession {
  /** joriy band — BAND_ORDER indeksi */
  bandIndex: number
  askedIds: string[]
  bandScores: Record<PlacementBand, { correct: number; total: number }>
  asked: number
}

export function createSession(startBand: PlacementBand = START_BAND): PlacementSession {
  const scores = {} as Record<PlacementBand, { correct: number; total: number }>
  for (const b of BAND_ORDER) scores[b] = { correct: 0, total: 0 }
  return {
    bandIndex: BAND_ORDER.indexOf(startBand),
    askedIds: [],
    bandScores: scores,
    asked: 0,
  }
}

/** Joriy banddan (yoki eng yaqin banddan) so'ralmagan savol tanlaydi */
export function pickNextQuestion(s: PlacementSession): PlacementQuestion | null {
  const n = BAND_ORDER.length
  for (let dist = 0; dist < n; dist++) {
    // avval joriy band, keyin pastga, keyin yuqoriga kengayamiz
    for (const idx of [s.bandIndex - dist, s.bandIndex + dist]) {
      if (idx < 0 || idx >= n || (dist > 0 && idx === s.bandIndex)) continue
      const q = questionsInBand(BAND_ORDER[idx]).find(q => !s.askedIds.includes(q.id))
      if (q) return q
    }
  }
  return null
}

/** Javobni qo'llab, yangi sessiya holatini qaytaradi (band siljiydi) */
export function applyAnswer(s: PlacementSession, q: PlacementQuestion, correct: boolean): PlacementSession {
  const bandScores = {
    ...s.bandScores,
    [q.band]: {
      correct: s.bandScores[q.band].correct + (correct ? 1 : 0),
      total: s.bandScores[q.band].total + 1,
    },
  }
  const delta = correct ? 1 : -1
  const bandIndex = Math.max(0, Math.min(BAND_ORDER.length - 1, s.bandIndex + delta))
  return { bandIndex, askedIds: [...s.askedIds, q.id], bandScores, asked: s.asked + 1 }
}

/** Test tugadimi (yetarli savol so'raldi yoki savol qolmadi) */
export function isComplete(s: PlacementSession): boolean {
  return s.asked >= PLACEMENT_TEST_LENGTH || pickNextQuestion(s) === null
}

/** Level → 99-kunlik sayohatda boshlanish kuni (onboarding uchun) */
export function levelToStartDay(level: Level): number {
  switch (level) {
    case 'A2+': return 14
    case 'B1': return 28
    case 'B1+': return 56
    case 'B2': return 79
  }
}

/** Band → ilova Level'i (A2 → A2+ pol) */
export function bandToLevel(band: PlacementBand): Level {
  switch (band) {
    case 'A2':
    case 'A2+':
      return 'A2+'
    case 'B1':
      return 'B1'
    case 'B1+':
      return 'B1+'
    case 'B2':
      return 'B2'
  }
}

/** Yakuniy natija — eng yuqori band, unda ≥50% to'g'ri */
export function computeResult(s: PlacementSession): PlacementResult {
  let best: PlacementBand = 'A2'
  for (const band of BAND_ORDER) {
    const { correct, total } = s.bandScores[band]
    if (total > 0 && correct / total >= 0.5) best = band
  }
  const correctCount = BAND_ORDER.reduce((sum, b) => sum + s.bandScores[b].correct, 0)
  return {
    level: bandToLevel(best),
    bandScores: s.bandScores,
    correctCount,
    totalAsked: s.asked,
    takenAt: new Date().toISOString(),
  }
}
