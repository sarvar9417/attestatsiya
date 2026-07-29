export type Answers = Record<number, string[]>
export type Tab = 'exercises' | 'tests'

export const LEVEL_COLOR: Record<string, string> = {
  A1: 'bg-emerald-600',
  A2: 'bg-blue-600',
  B1: 'bg-violet-600',
  'B1+': 'bg-purple-700',
  B2: 'bg-rose-700',
}

export function getMasteryLevel(pct: number): { emoji: string; label: string; color: string } {
  if (pct >= 90) return { emoji: '🏆', label: 'Mukammal', color: 'text-green-600 dark:text-green-400' }
  if (pct >= 70) return { emoji: '👍', label: "Zo'r", color: 'text-blue-600 dark:text-blue-400' }
  if (pct >= 50) return { emoji: '📚', label: 'Yaxshi', color: 'text-amber-600 dark:text-amber-400' }
  return { emoji: '💪', label: "O'rganilmoqda", color: 'text-red-500 dark:text-red-400' }
}

export function scrollToTop(): void {
  setTimeout(() => {
    try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch { /* jsdom */ }
  }, 50)
}

export const REVIEW_EX_LS_PREFIX = 'review-ex-'
export const REVIEW_TEST_LS_PREFIX = 'review-test-'
export const REVIEW_RULES_LS_PREFIX = 'review-rules-'
