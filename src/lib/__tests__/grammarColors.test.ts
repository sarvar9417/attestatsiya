import { describe, it, expect } from 'vitest'
import { GRAMMAR_CATEGORIES, GRAMMAR_COLORS, getLessonColor, LESSON_CATEGORY } from '../grammarColors'

describe('grammarColors', () => {
  describe('GRAMMAR_CATEGORIES', () => {
    it('has all expected categories', () => {
      expect(GRAMMAR_CATEGORIES.tenses).toBe('tenses')
      expect(GRAMMAR_CATEGORIES.modals).toBe('modals')
      expect(GRAMMAR_CATEGORIES.prepositions).toBe('prepositions')
      expect(GRAMMAR_CATEGORIES.conditionals).toBe('conditionals')
      expect(GRAMMAR_CATEGORIES.articles).toBe('articles')
      expect(GRAMMAR_CATEGORIES.passives).toBe('passives')
      expect(GRAMMAR_CATEGORIES.reported).toBe('reported')
      expect(GRAMMAR_CATEGORIES.vocabulary).toBe('vocabulary')
      expect(GRAMMAR_CATEGORIES.phrasal).toBe('phrasal')
      expect(GRAMMAR_CATEGORIES.other).toBe('other')
    })
  })

  describe('GRAMMAR_COLORS', () => {
    it('has colors for every category', () => {
      for (const cat of Object.values(GRAMMAR_CATEGORIES)) {
        const colors = GRAMMAR_COLORS[cat]
        expect(colors.bg).toBeTruthy()
        expect(colors.text).toBeTruthy()
        expect(colors.border).toBeTruthy()
        expect(colors.badge).toBeTruthy()
        expect(colors.dark).toBeTruthy()
      }
    })
  })

  describe('LESSON_CATEGORY', () => {
    it('maps tenses lessons correctly', () => {
      expect(LESSON_CATEGORY['simple-present']).toBe('tenses')
      expect(LESSON_CATEGORY['present-continuous']).toBe('tenses')
      expect(LESSON_CATEGORY['simple-past']).toBe('tenses')
    })
    it('maps modal lessons correctly', () => {
      expect(LESSON_CATEGORY['modal-verbs']).toBe('modals')
    })
    it('maps conditional lessons correctly', () => {
      expect(LESSON_CATEGORY['first-conditional']).toBe('conditionals')
    })
  })

  describe('getLessonColor', () => {
    it('returns correct color for known lesson', () => {
      const color = getLessonColor('simple-present')
      expect(color.bg).toContain('blue')
    })
    it('returns fallback color for unknown lesson', () => {
      const color = getLessonColor('unknown-lesson')
      expect(color.bg).toContain('gray')
    })
  })
})
