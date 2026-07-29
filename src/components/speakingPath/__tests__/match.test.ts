import { test, expect } from 'vitest'
import { normalize, similarity, similarityToRating, isCorrect, semanticSimilarity, semanticToRating, isSemanticCorrect } from '../match'

test('normalize: kichik harf + tinish belgilarsiz', () => {
  expect(normalize("I'd like, please!")).toBe('i d like please')
  expect(normalize('  Hello   World  ')).toBe('hello world')
})

test('similarity: aynan bir xil = 1', () => {
  expect(similarity('Can I have a coffee', 'can i have a coffee.')).toBe(1)
})

test('similarity: butunlay boshqa = past', () => {
  expect(similarity('hello', 'xyzqwerty')).toBeLessThan(0.4)
})

test('similarity: yaqin (bitta so\'z farq) = yuqori', () => {
  expect(similarity('I am from Uzbekistan', 'I am from Uzbekistans')).toBeGreaterThan(0.9)
})

test('isCorrect va rating chegaralari', () => {
  expect(isCorrect(0.7)).toBe(true)
  expect(isCorrect(0.5)).toBe(false)
  expect(similarityToRating(0.95)).toBe('yodladim')
  expect(similarityToRating(0.7)).toBe('bildim')
  expect(similarityToRating(0.5)).toBe('qiynaldim')
  expect(similarityToRating(0.2)).toBe('bilmadim')
})

// ── Semantic matching (Faza 4) ──────────────────────────────────────────────

test('semantic: aynan bir xil = 1', () => {
  expect(semanticSimilarity('Can I have a coffee', 'Can I have a coffee').score).toBe(1)
})

test('semantic: sinonim bilan parafraz = yuqori', () => {
  const r = semanticSimilarity('I want coffee', "I would like coffee")
  expect(r.score).toBeGreaterThan(0.7)
})

test('semantic: bir xil ma\'no, boshqa so\'zlar = o\'rta', () => {
  const r = semanticSimilarity('Can I get a coffee please', 'I want some coffee')
  expect(r.score).toBeGreaterThan(0.5)
})

test('semantic: butunlay boshqa ma\'no = past', () => {
  const r = semanticSimilarity('I like apples', 'Can I have a coffee')
  expect(r.score).toBeLessThan(0.4)
})

test('semantic: qisqa javob = past', () => {
  const r = semanticSimilarity('yes', 'I would like a cup of coffee')
  expect(r.score).toBeLessThan(0.5)
})

test('semanticToRating va isSemanticCorrect', () => {
  expect(isSemanticCorrect(0.85)).toBe(true)
  expect(isSemanticCorrect(0.5)).toBe(false)
  expect(semanticToRating(0.9)).toBe('yodladim')
  expect(semanticToRating(0.7)).toBe('bildim')
  expect(semanticToRating(0.4)).toBe('qiynaldim')
  expect(semanticToRating(0.2)).toBe('bilmadim')
})
