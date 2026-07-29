// Speaking Path — kontent kirish nuqtasi (getter'lar)
// Reja: docs/speaking-path-roadmap.md (5/7-bo'lim)

import { SPEAKING_DAYS } from './days'
import type { SpeakingChunk, SpeakingDay } from './types'

export { SPEAKING_DAYS }
export type { SpeakingChunk, SpeakingDay, SpeakingScenario, SpeakingDayProgress, PronunciationFocus, VocabItem } from './types'

/** CEFR darajalari tartibli ro'yxati */
export const CEFR_ORDER = ['A0', 'A1', 'A2', 'B1', 'B2'] as const

/** Kun raqamiga qarab CEFR darajasini qaytaradi.
 *  Dinamik — ma'lumotlardagi haqiqiy kun diapazonlaridan hisoblanadi. */
export function getCefrForDay(day: number): string {
  for (const cefr of [...CEFR_ORDER].reverse()) {
    const range = getLevelRange(cefr)
    if (range && day >= range.dayMin && day <= range.dayMax) return cefr
  }
  return CEFR_ORDER[0]
}

/** Jami kunlar soni */
export const TOTAL_SPEAKING_DAYS = SPEAKING_DAYS.length

/** Bitta kunni raqami bo'yicha olish */
export function getSpeakingDay(day: number): SpeakingDay | undefined {
  return SPEAKING_DAYS.find(d => d.day === day)
}

/** Barcha bloklarni tekis ro'yxat sifatida (SRS uchun) */
export function getAllChunks(): SpeakingChunk[] {
  return SPEAKING_DAYS.flatMap(d => d.chunks)
}

/** Blokni id bo'yicha topish */
export function getChunkById(id: string): SpeakingChunk | undefined {
  for (const d of SPEAKING_DAYS) {
    const c = d.chunks.find(ch => ch.id === id)
    if (c) return c
  }
  return undefined
}

/** Berilgan kungacha (shu kun ham) ochilgan barcha bloklar */
export function getChunksUpToDay(day: number): SpeakingChunk[] {
  return SPEAKING_DAYS.filter(d => d.day <= day).flatMap(d => d.chunks)
}

// ── Phase 2: Grammar-Driven Speaking helpers ──

/** CEFR darajasidagi barcha speaking kunlarni qaytaradi */
export function getDaysByLevel(cefr: string): SpeakingDay[] {
  return SPEAKING_DAYS.filter(d => d.cefr === cefr)
}

/** Berilgan daily lesson ID'ga bog'langan speaking kunni qaytaradi */
export function getDaysForLesson(lessonId: string): SpeakingDay[] {
  return SPEAKING_DAYS.filter(d => d.linkedLessonId === lessonId)
}

/** Daily lesson ID dan grammar point nomini topish uchun quick lookup */
export function getGrammarPointByLessonId(lessonId: string): string | undefined {
  const day = SPEAKING_DAYS.find(d => d.linkedLessonId === lessonId)
  return day?.grammarPoint ?? day?.title
}

/** Bir darajadagi umumiy grammar pointlar soni (linkedLessonId bor kunlar) */
export function getGrammarPointCountByLevel(cefr: string): number {
  return SPEAKING_DAYS.filter(d => d.cefr === cefr && d.linkedLessonId != null).length
}

/** Bir darajadagi umumiy vocab (chunk) soni */
export function getChunkCountByLevel(cefr: string): number {
  return SPEAKING_DAYS.filter(d => d.cefr === cefr).reduce((sum, d) => sum + d.chunks.length, 0)
}

/** CEFR darajasi bo'yicha kun diapazonini qaytaradi: { dayMin, dayMax } */
export function getLevelRange(cefr: string): { dayMin: number; dayMax: number } | undefined {
  const days = SPEAKING_DAYS.filter(d => d.cefr === cefr)
  if (days.length === 0) return undefined
  return { dayMin: days[0].day, dayMax: days[days.length - 1].day }
}
