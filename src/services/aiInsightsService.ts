// ═══════════════════════════════════════════════════════════════════════════
// AI Shaxsiy Tahlil xizmati — ko'rsatkichlarni yig'adi, AI tahlilni keshlaydi.
// Qimmat AI chaqiruvini har dashboard yuklanishida emas, haftada bir marta
// (yoki qo'lda yangilash) ishlatadi.
// ═══════════════════════════════════════════════════════════════════════════

import { generateLearningInsights, type LearningInsights, type LearningSignals } from '../lib/claude'
import { getWeakGrammarLessonIds } from '../lib/grammarSrs'
import { monitoring } from '../lib/monitoring'

const CACHE_KEY = 'ai-insights-v1'
const STALE_MS = 7 * 24 * 60 * 60 * 1000  // 7 kun

interface CachedInsights {
  generatedAt: number
  data: LearningInsights
}

export function getCachedInsights(): CachedInsights | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function isInsightsStale(cached: CachedInsights | null): boolean {
  if (!cached) return true
  return Date.now() - cached.generatedAt > STALE_MS
}

/** Zaif grammatika dars id'larini qaytaradi (nomlarsiz) */
export function getWeakGrammarLabels(limit = 5): string[] {
  return getWeakGrammarLessonIds(limit)
}

/** AI tahlilni oladi va keshlaydi */
export async function fetchAndCacheInsights(signals: LearningSignals): Promise<LearningInsights> {
  const data = await generateLearningInsights(signals)
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ generatedAt: Date.now(), data }))
  } catch { 
    monitoring.captureMessage('aiInsightsService: cache write failed', 'warn')
  }
  return data
}
