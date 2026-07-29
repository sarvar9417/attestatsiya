import { describe, it, expect } from 'vitest'

// ── XP Formulas (pure calculations from Speaking.tsx Chat Mode) ─────────────────
//
// These replicate the exact logic from src/pages/Speaking.tsx endChat() and
// the chat-feedback view so we can validate boundary conditions.

function calcXp(turnCount: number): number {
  return Math.max(5, Math.min(30, turnCount * 3))
}

function calcEstimatedScore(turnCount: number): number {
  return Math.max(5, Math.min(10, Math.round(turnCount * 0.7 + 3)))
}

function calcProgressPct(turnCount: number): number {
  return Math.min(100, Math.max(30, turnCount * 10))
}

// ═══════════════════════════════════════════════════════════════════════════════
//  XP formula
// ═══════════════════════════════════════════════════════════════════════════════

describe('XP formula (max(5, min(30, turns * 3)))', () => {
  it('awards minimum 5 XP for 1 turn', () => {
    expect(calcXp(1)).toBe(5)
  })

  it('awards minimum 5 XP for 0 turns', () => {
    expect(calcXp(0)).toBe(5)
  })

  it('awards 6 XP for 2 turns', () => {
    expect(calcXp(2)).toBe(6)
  })

  it('awards 15 XP for 5 turns', () => {
    expect(calcXp(5)).toBe(15)
  })

  it('caps at 30 XP for 10 turns', () => {
    expect(calcXp(10)).toBe(30)
  })

  it('caps at 30 XP for 15 turns (overflow)', () => {
    expect(calcXp(15)).toBe(30)
  })

  it('awards 3 XP per turn until cap', () => {
    for (let t = 1; t <= 10; t++) {
      const xp = calcXp(t)
      if (t <= 1) {
        expect(xp).toBe(5) // minimum
      } else if (t >= 10) {
        expect(xp).toBe(30) // capped
      } else {
        expect(xp).toBe(t * 3)
      }
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  Estimated score formula
// ═══════════════════════════════════════════════════════════════════════════════

describe('Estimated score formula (max(5, min(10, round(turns * 0.7 + 3))))', () => {
  it('minimum 5 for 0 turns', () => {
    expect(calcEstimatedScore(0)).toBe(5)
  })

  it('minimum 5 for 1 turn (round(3.7) = 4 → max(5) = 5)', () => {
    expect(calcEstimatedScore(1)).toBe(5)
  })

  it('5 for 3 turns (round(5.1) = 5)', () => {
    expect(calcEstimatedScore(3)).toBe(5)
  })

  it('7 for 5 turns (round(6.5) = 7)', () => {
    expect(calcEstimatedScore(5)).toBe(7)
  })

  it('10 for 10 turns (round(10) = 10)', () => {
    expect(calcEstimatedScore(10)).toBe(10)
  })

  it('caps at 10 for 20 turns', () => {
    expect(calcEstimatedScore(20)).toBe(10)
  })

  it('never drops below 5 even with negative turns', () => {
    // negative turnCount should not happen, but formula handles it
    expect(calcEstimatedScore(-5)).toBe(5)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  Progress percentage formula
// ═══════════════════════════════════════════════════════════════════════════════

describe('Progress percentage formula (min(100, max(30, turns * 10)))', () => {
  it('minimum 30% for 0 turns', () => {
    expect(calcProgressPct(0)).toBe(30)
  })

  it('minimum 30% for 1 turn', () => {
    expect(calcProgressPct(1)).toBe(30)
  })

  it('minimum 30% for 2 turns (2*10=20 → max(30)=30)', () => {
    expect(calcProgressPct(2)).toBe(30)
  })

  it('30% for 3 turns (3*10=30)', () => {
    expect(calcProgressPct(3)).toBe(30)
  })

  it('50% for 5 turns', () => {
    expect(calcProgressPct(5)).toBe(50)
  })

  it('80% for 8 turns', () => {
    expect(calcProgressPct(8)).toBe(80)
  })

  it('100% for 10 turns', () => {
    expect(calcProgressPct(10)).toBe(100)
  })

  it('caps at 100% for 15 turns', () => {
    expect(calcProgressPct(15)).toBe(100)
  })

  it('never drops below 30% even with negative turns', () => {
    expect(calcProgressPct(-1)).toBe(30)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  Combined formula scenarios (matching real endChat() logic)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Combined formulas — real endChat() scenarios', () => {
  it('short chat (2 turns): 6 XP, score 5, progress 30%', () => {
    const turns = 2
    expect(calcXp(turns)).toBe(6)
    expect(calcEstimatedScore(turns)).toBe(5)
    expect(calcProgressPct(turns)).toBe(30)
  })

  it('medium chat (5 turns): 15 XP, score 7, progress 50%', () => {
    const turns = 5
    expect(calcXp(turns)).toBe(15)
    expect(calcEstimatedScore(turns)).toBe(7)
    expect(calcProgressPct(turns)).toBe(50)
  })

  it('long chat (10 turns): 30 XP, score 10, progress 100%', () => {
    const turns = 10
    expect(calcXp(turns)).toBe(30)
    expect(calcEstimatedScore(turns)).toBe(10)
    expect(calcProgressPct(turns)).toBe(100)
  })

  it('empty chat guard (0 turns, 0 messages) — no XP/checklist awarded in endChat()', () => {
    // This replicates the early return guard in endChat():
    //   if (turnCount < 1 && chatMessages.length === 0) { return }
    // So formulas should not be called. But if called accidentally,
    // they return minimums (5 XP, score 5, progress 30%).
    const turns = 0
    expect(calcXp(turns)).toBe(5)
    expect(calcEstimatedScore(turns)).toBe(5)
    expect(calcProgressPct(turns)).toBe(30)
  })
})
