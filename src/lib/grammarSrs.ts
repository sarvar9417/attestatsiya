// ═══════════════════════════════════════════════════════════════════════════
// Grammar Spaced Repetition — FSRS-5 algoritmiga asoslangan grammatika takrori
//
// FSRS-5 individual o'quvchining xotira modelini hisobga oladi:
// stability (barqarorlik), difficulty (qiyinchilik), retrievability (eslab
// qolish ehtimoli) — Leitner tizimidan ancha aniqroq.
// ═══════════════════════════════════════════════════════════════════════════

import { monitoring } from './monitoring'
import {
  type FSRSState,
  createDefaultFSRSState,
  computeNextReviewFSRS,
} from './srs'

export interface GrammarReview {
  lessonId:     string
  box:          number   // 0..5 — eski Leitner box (backward compatibility)
  nextReview:   string   // ISO sana (YYYY-MM-DD)
  lastReviewed: string
  lapses:       number   // necha marta zaif natija
  reps:         number   // necha marta takrorlangan
  // FSRS-5 fieldlari
  stability:    number
  difficulty:   number
}

const STORAGE_KEY = 'grammar-srs-v2'

// ─── FSRS score → grade mapping ────────────────────────────────────────────
function scoreToGrade(score: number): string {
  if (score >= 90) return 'yodladim'    // Easy
  if (score >= 70) return 'bildim'      // Good
  if (score >= 40) return 'qiynaldim'   // Hard
  return 'bilmadim'                      // Again
}

function gradeToBox(grade: string): number {
  switch (grade) {
    case 'yodladim':  return 5
    case 'bildim':    return 3
    case 'qiynaldim': return 1
    default:          return 0
  }
}

// ─── Saqlash / o'qish ──────────────────────────────────────────────────────

function loadAll(): Record<string, GrammarReview> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    return parsed
  } catch { return {} }
}

function saveAll(data: Record<string, GrammarReview>): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { 
    monitoring.captureMessage('grammarSrs: save failed', 'warn')
  }
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

// ─── Asosiy API ────────────────────────────────────────────────────────────

/**
 * Dars tugagach takror jadvaliga qo'shadi/yangilaydi.
 * FSRS-5 algoritmi yordamida stability va difficulty hisoblanadi.
 * @param score 0-100 — natija foizi
 */
export function scheduleReview(lessonId: string, score: number): void {
  const all = loadAll()
  const today = todayISO()
  const existing = all[lessonId]
  const grade = scoreToGrade(score)

  // FSRS-5 hisobi
  const currentState: FSRSState = existing
    ? {
        stability:   existing.stability,
        difficulty:  existing.difficulty,
        due:         existing.nextReview,
        reps:        existing.reps,
        lapses:      existing.lapses,
      }
    : createDefaultFSRSState()

  const { state: nextState } = computeNextReviewFSRS(currentState, grade)

  all[lessonId] = {
    lessonId,
    box:          gradeToBox(grade),
    nextReview:   nextState.due,
    lastReviewed: today,
    lapses:       nextState.lapses,
    reps:         nextState.reps,
    stability:    nextState.stability,
    difficulty:   nextState.difficulty,
  }
  saveAll(all)
}

/** Bugun (yoki o'tib ketgan) takrorlash kerak bo'lgan darslar */
export function getDueReviews(): GrammarReview[] {
  const all = loadAll()
  const today = todayISO()
  return Object.values(all)
    .filter(r => r.nextReview <= today)
    .sort((a, b) => a.nextReview.localeCompare(b.nextReview))
}

/** Takrorlash kerak bo'lgan darslar soni */
export function getDueCount(): number {
  return getDueReviews().length
}

/** Kelgusi (hali vaqti kelmagan) takrorlar soni */
export function getScheduledCount(): number {
  const all = loadAll()
  const today = todayISO()
  return Object.values(all).filter(r => r.nextReview > today).length
}

/** Bitta darsning holati */
export function getReviewStatus(lessonId: string): GrammarReview | null {
  return loadAll()[lessonId] ?? null
}

/** Stability → "qanchalik mustahkam" foizi (progress bar uchun) */
export function strengthToPercent(stability: number): number {
  return Math.round(Math.min(100, stability * 10))
}

/** Keyingi takrorgacha qancha kun qolgani */
export function daysUntilReview(review: GrammarReview): number {
  const diff = (new Date(review.nextReview).getTime() - new Date(todayISO()).getTime()) / 86_400_000
  return Math.max(0, Math.round(diff))
}

/** Barcha takror yozuvlari */
export function getAllReviews(): GrammarReview[] {
  return Object.values(loadAll())
}

/** Eng zaif grammatika darslari — id ro'yxati */
export function getWeakGrammarLessonIds(limit = 5): string[] {
  return Object.values(loadAll())
    .filter(r => r.lapses > 0 || r.stability < 1)
    .sort((a, b) => (b.lapses - a.lapses) || (a.stability - b.stability))
    .slice(0, limit)
    .map(r => r.lessonId)
}
