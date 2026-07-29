import { describe, it, expect } from 'vitest'
import { getCategoryStyle, PHRASE_CATEGORY_BADGES, PHRASE_BATCH_SIZE, PHRASES_PER_DAY, PHRASE_NUM_BATCHES } from '../phraseConfig'

describe('phraseConfig', () => {
  describe('constants', () => {
    it('PHRASE_BATCH_SIZE is 15', () => {
      expect(PHRASE_BATCH_SIZE).toBe(15)
    })
    it('PHRASES_PER_DAY is 45', () => {
      expect(PHRASES_PER_DAY).toBe(45)
    })
    it('PHRASE_NUM_BATCHES is 3', () => {
      expect(PHRASE_NUM_BATCHES).toBe(3)
    })
  })

  describe('PHRASE_CATEGORY_BADGES', () => {
    it('has badges for all expected categories', () => {
      const expectedCats = ['everyday', 'grammar', 'travel', 'formal', 'ielts', 'business', 'food', 'health', 'education', 'social']
      for (const cat of expectedCats) {
        expect(PHRASE_CATEGORY_BADGES[cat]).toBeDefined()
        expect(PHRASE_CATEGORY_BADGES[cat].bg).toBeTruthy()
        expect(PHRASE_CATEGORY_BADGES[cat].text).toBeTruthy()
        expect(PHRASE_CATEGORY_BADGES[cat].label).toBeTruthy()
      }
    })
  })

  describe('getCategoryStyle', () => {
    it('returns correct style for known category', () => {
      const style = getCategoryStyle('everyday')
      expect(style.label).toBe('Kundalik')
      expect(style.bg).toContain('emerald')
    })
    it('returns fallback for unknown category', () => {
      const style = getCategoryStyle('nonexistent')
      expect(style.label).toBe('Boshqa')
      expect(style.bg).toContain('gray')
    })
  })
})
