import { playSfx } from './sfx'
import { hapticFeedback } from './haptics'

export function feelAnswer(params: { correct: boolean; combo?: number; critical?: boolean }): void {
  if (params.correct) {
    playSfx('correct')
    hapticFeedback(params.critical ? 'heavy' : 'light')
    if (params.combo && params.combo >= 3) {
      playSfx('combo')
    }
  } else {
    playSfx('wrong')
    hapticFeedback('medium')
  }
}

export function feelLevelUp(): void {
  playSfx('levelup')
  hapticFeedback('heavy')
}

export function feelStreakMilestone(streakDays: number): void {
  playSfx('milestone')
  hapticFeedback(streakDays >= 30 ? 'heavy' : 'medium')
  // Fire sound for longer streaks
  if (streakDays >= 7) {
    setTimeout(() => playSfx('streak-burn'), 400)
  }
}

export function feelCombo(combo: number): void {
  if (combo >= 2) {
    playSfx('combo')
    hapticFeedback(combo >= 5 ? 'medium' : 'light')
  }
}

export function feelXpTick(): void {
  playSfx('xp-tick')
}

export function feelTap(): void {
  hapticFeedback('light')
}

export function rollCritical(): boolean {
  return Math.random() < 0.12
}
