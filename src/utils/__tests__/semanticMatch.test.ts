import { describe, it, expect } from 'vitest'
import { semanticSimilarity, semanticToRating, isSemanticCorrect } from '../semanticMatch'

describe('semanticMatch', () => {
  describe('semanticSimilarity', () => {
    it('returns score 1 for identical strings', () => {
      const r = semanticSimilarity('Hello world', 'Hello world')
      expect(r.score).toBe(1)
      expect(r.details.keyword).toBe(1)
    })

    it('returns score 1 for both empty strings (identical)', () => {
      expect(semanticSimilarity('', '').score).toBe(1)
    })
    it('returns score 0 for one empty string', () => {
      expect(semanticSimilarity('', 'hello').score).toBe(0)
      expect(semanticSimilarity('hello', '').score).toBe(0)
    })

    it('gives high score for similar meaning', () => {
      const r = semanticSimilarity('I want to eat pizza', 'I would like to eat pizza')
      expect(r.score).toBeGreaterThan(0.7)
    })

    it('gives low score for completely different text', () => {
      const r = semanticSimilarity('The cat sat on the mat', 'Quantum physics is fascinating')
      expect(r.score).toBeLessThan(0.4)
    })

    it('handles stop words correctly', () => {
      const r = semanticSimilarity('The big dog ran quickly', 'A large dog ran fast')
      expect(r.score).toBeGreaterThan(0.4)
    })

    it('handles synonym substitution', () => {
      const r = semanticSimilarity('I need to go', 'I have to go')
      expect(r.score).toBeGreaterThan(0.7)
    })

    it('handles number word normalization', () => {
      const r = semanticSimilarity('I have five apples', 'I have 5 apples')
      expect(r.score).toBe(1)
    })

    it('returns score between 0 and 1', () => {
      const r = semanticSimilarity('anything', 'something else entirely')
      expect(r.score).toBeGreaterThanOrEqual(0)
      expect(r.score).toBeLessThanOrEqual(1)
    })

    it('handles punctuation', () => {
      const r = semanticSimilarity('Hello, world!', 'Hello world')
      expect(r.score).toBe(1)
    })
  })

  describe('semanticToRating', () => {
    it('maps high scores to yodladim', () => {
      expect(semanticToRating(0.9)).toBe('yodladim')
      expect(semanticToRating(0.85)).toBe('yodladim')
    })
    it('maps medium scores to bildim', () => {
      expect(semanticToRating(0.7)).toBe('bildim')
      expect(semanticToRating(0.6)).toBe('bildim')
    })
    it('maps low scores to qiynaldim', () => {
      expect(semanticToRating(0.5)).toBe('qiynaldim')
      expect(semanticToRating(0.35)).toBe('qiynaldim')
    })
    it('maps very low scores to bilmadim', () => {
      expect(semanticToRating(0.2)).toBe('bilmadim')
      expect(semanticToRating(0)).toBe('bilmadim')
    })
  })

  describe('isSemanticCorrect', () => {
    it('returns true for score >= 0.6', () => {
      expect(isSemanticCorrect(0.6)).toBe(true)
      expect(isSemanticCorrect(0.85)).toBe(true)
      expect(isSemanticCorrect(1)).toBe(true)
    })
    it('returns false for score < 0.6', () => {
      expect(isSemanticCorrect(0.59)).toBe(false)
      expect(isSemanticCorrect(0)).toBe(false)
    })
  })
})
