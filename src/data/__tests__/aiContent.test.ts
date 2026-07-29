import { describe, it, expect } from 'vitest'
import { CONVERSATION_SCENARIOS, getScenario } from '../conversationScenarios'
import { PRONUNCIATION_CATEGORIES, getPronCategory } from '../pronunciationDrills'

describe('conversationScenarios — data validligi', () => {
  it('kamida 8 ta stsenariy bor', () => {
    expect(CONVERSATION_SCENARIOS.length).toBeGreaterThanOrEqual(8)
  })

  it('har bir stsenariyda barcha majburiy maydonlar bor', () => {
    for (const s of CONVERSATION_SCENARIOS) {
      expect(s.id).toBeTruthy()
      expect(s.titleUz).toBeTruthy()
      expect(s.aiRole).toBeTruthy()
      expect(s.userRole).toBeTruthy()
      expect(s.goalUz).toBeTruthy()
      expect(s.opening).toBeTruthy()
      expect(s.hints.length).toBeGreaterThan(0)
      expect(['A1', 'A2', 'B1', 'B2']).toContain(s.minLevel)
      expect(['kundalik', 'sayohat', 'ish', 'ijtimoiy']).toContain(s.category)
    }
  })

  it('stsenariy id\'lari noyob', () => {
    const ids = CONVERSATION_SCENARIOS.map(s => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('getScenario id bo\'yicha topadi', () => {
    expect(getScenario('restaurant')?.id).toBe('restaurant')
    expect(getScenario('nope')).toBeUndefined()
  })
})

describe('pronunciationDrills — data validligi', () => {
  it('kamida 5 ta tovush kategoriyasi bor', () => {
    expect(PRONUNCIATION_CATEGORIES.length).toBeGreaterThanOrEqual(5)
  })

  it('har kategoriyada iboralar bor, har biri text+ipa+hint bilan', () => {
    for (const c of PRONUNCIATION_CATEGORIES) {
      expect(c.id).toBeTruthy()
      expect(c.titleUz).toBeTruthy()
      expect(c.whyUz).toBeTruthy()
      expect(c.phrases.length).toBeGreaterThan(0)
      for (const p of c.phrases) {
        expect(p.text).toBeTruthy()
        expect(p.ipa).toMatch(/^\/.*\/$|\//)  // IPA slash bilan
        expect(p.hintUz).toBeTruthy()
      }
    }
  })

  it('kategoriya id\'lari noyob', () => {
    const ids = PRONUNCIATION_CATEGORIES.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('getPronCategory id bo\'yicha topadi', () => {
    expect(getPronCategory('th')?.id).toBe('th')
    expect(getPronCategory('nope')).toBeUndefined()
  })
})
