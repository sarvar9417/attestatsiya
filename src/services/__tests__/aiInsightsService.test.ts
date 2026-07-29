import { describe, it, expect, vi, beforeEach } from 'vitest'

// fetch mock (fetchAndCacheInsights → generateLearningInsights → proxy)
const mockText = vi.hoisted(() => ({ value: '{}' }))
vi.hoisted(() => {
  const fn = vi.fn().mockImplementation(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ content: [{ type: 'text', text: mockText.value }] }),
  }))
  vi.stubGlobal('fetch', fn)
  return fn
})

import {
  getCachedInsights,
  isInsightsStale,
  getWeakGrammarLabels,
  fetchAndCacheInsights,
} from '../aiInsightsService'
import { scheduleReview } from '../../lib/grammarSrs'

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

describe('isInsightsStale', () => {
  it('null kesh eskirgan hisoblanadi', () => {
    expect(isInsightsStale(null)).toBe(true)
  })

  it('7 kundan eski kesh eskirgan', () => {
    const old = { generatedAt: Date.now() - 8 * 24 * 60 * 60 * 1000, data: {} as never }
    expect(isInsightsStale(old)).toBe(true)
  })

  it('yangi kesh eskirmagan', () => {
    const fresh = { generatedAt: Date.now() - 60 * 1000, data: {} as never }
    expect(isInsightsStale(fresh)).toBe(false)
  })
})

describe('getCachedInsights', () => {
  it('kesh yo\'q bo\'lsa null', () => {
    expect(getCachedInsights()).toBeNull()
  })

  it('saqlangan keshni o\'qiydi', () => {
    const cached = { generatedAt: 123, data: { strengths: ['x'], focusArea: '', recommendation: '', motivation: 'm' } }
    localStorage.setItem('ai-insights-v1', JSON.stringify(cached))
    expect(getCachedInsights()?.generatedAt).toBe(123)
  })

  it('buzuq keshda null (xato bermaydi)', () => {
    localStorage.setItem('ai-insights-v1', 'broken{')
    expect(getCachedInsights()).toBeNull()
  })
})

describe('getWeakGrammarLabels', () => {
  it('zaif grammatika dars id\'larini qaytaradi', () => {
    scheduleReview('present-perfect-demo', 30) // zaif → lapse
    const labels = getWeakGrammarLabels()
    // demo topilsa skill nomi, topilmasa id qaytadi — har holda massiv
    expect(Array.isArray(labels)).toBe(true)
    expect(labels.length).toBeGreaterThan(0)
  })

  it('zaif dars yo\'q bo\'lsa bo\'sh massiv', () => {
    expect(getWeakGrammarLabels()).toEqual([])
  })
})

describe('fetchAndCacheInsights', () => {
  it('natijani localStorage ga keshlaydi', async () => {
    mockText.value = JSON.stringify({ strengths: ['Grammatika'], focusArea: 'Tinglash', recommendation: 'r', motivation: 'm' })
    const signals = { level: 'B1', streak: 3, skills: [{ name: 'Grammatika', pct: 50 }], weakGrammar: [] }
    const data = await fetchAndCacheInsights(signals)
    expect(data.focusArea).toBe('Tinglash')
    // Keshlangan bo'lishi kerak
    const cached = getCachedInsights()
    expect(cached?.data.focusArea).toBe('Tinglash')
    expect(cached?.generatedAt).toBeGreaterThan(0)
  })
})
