export const heartsConfig = { maxHearts: 5, refillTime: 1800000 }
export const MAX_HEARTS = 5

// Heart shop pricing
export const HEART_SHOP_ITEMS = [
  { hearts: 1, xpCost: 50, label: "1 ta yurak", popular: false },
  { hearts: 3, xpCost: 120, label: "3 ta yurak", popular: true, savedXp: 30 },
  { hearts: 5, xpCost: 200, label: "5 ta yurak (to'liq)", popular: false, savedXp: 50 },
] as const

export function getHearts(): number {
  if (typeof window === 'undefined') return 5
  const stored = localStorage.getItem('hearts')
  if (!stored) return 5
  const { hearts, lastLostAt } = JSON.parse(stored)
  return regenerateHearts({ hearts, lastLostAt }).hearts
}

export function useHearts(): void {
  const h = getHearts()
  if (h <= 0) return
  if (typeof window === 'undefined') return
  localStorage.setItem('hearts', JSON.stringify({ hearts: h - 1, lastLostAt: new Date().toISOString() }))
}

export function refillHearts(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('hearts', JSON.stringify({ hearts: 5, lastLostAt: new Date().toISOString() }))
}

/** Buy hearts with XP — returns actual number of hearts added */
export function buyHearts(amount: number, totalXp: number): { success: boolean; heartsAdded: number; remainingXp: number } {
  const item = HEART_SHOP_ITEMS.find(i => i.hearts === amount)
  if (!item) return { success: false, heartsAdded: 0, remainingXp: totalXp }
  if (totalXp < item.xpCost) return { success: false, heartsAdded: 0, remainingXp: totalXp }

  const currentHearts = getHearts()
  if (currentHearts >= MAX_HEARTS) return { success: false, heartsAdded: 0, remainingXp: totalXp }

  const canAdd = Math.min(amount, MAX_HEARTS - currentHearts)
  if (canAdd <= 0) return { success: false, heartsAdded: 0, remainingXp: totalXp }

  const newHearts = currentHearts + canAdd
  localStorage.setItem('hearts', JSON.stringify({ hearts: newHearts, lastLostAt: new Date().toISOString() }))

  return { success: true, heartsAdded: canAdd, remainingXp: totalXp - item.xpCost }
}

/** 'Ustida Ishlash' (Practice Mode) — darslarda hearts sarflanmaydi, faqat Challenge/Duel da */
export const PRACTICE_MODE_KEY = 'practice_mode_enabled'

export function isPracticeMode(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(PRACTICE_MODE_KEY) !== 'false'
}

export function setPracticeMode(enabled: boolean): void {
  if (typeof window === 'undefined') return
  if (enabled) {
    localStorage.removeItem(PRACTICE_MODE_KEY)
  } else {
    localStorage.setItem(PRACTICE_MODE_KEY, 'false')
  }
}

export function getRegenTimeRemaining(hearts: number, lastLostAt: string): number {
  if (hearts >= MAX_HEARTS || !lastLostAt) return 0
  const elapsed = Date.now() - new Date(lastLostAt).getTime()
  const nextRegenAt = heartsConfig.refillTime - (elapsed % heartsConfig.refillTime)
  return Math.max(0, nextRegenAt)
}

export function regenerateHearts({ hearts, lastLostAt }: { hearts: number; lastLostAt: string }): { hearts: number; lastLostAt: string } {
  if (hearts >= 5) return { hearts: 5, lastLostAt }
  const elapsed = Date.now() - new Date(lastLostAt).getTime()
  const refilled = Math.floor(elapsed / heartsConfig.refillTime)
  const newHearts = Math.min(5, hearts + refilled)
  const newLastLostAt = newHearts >= 5 ? new Date().toISOString() : lastLostAt
  return { hearts: newHearts, lastLostAt: newLastLostAt }
}
