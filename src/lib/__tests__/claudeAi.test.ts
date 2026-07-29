import { describe, it, expect, vi, beforeEach } from 'vitest'

// fetch ni mock qilamiz — har test javob matnini o'rnatadi
const mockText = vi.hoisted(() => ({ value: '{}' }))
const mockFetch = vi.hoisted(() => {
  const fn = vi.fn().mockImplementation(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ content: [{ type: 'text', text: mockText.value }] }),
  }))
  vi.stubGlobal('fetch', fn)
  return fn
})

import {
  getScenarioReport,
  analyzeWritingErrors,
  analyzePronunciation,
  generateLearningInsights,
  generatePracticeExercises,
} from '../claude'

const SCENE = { aiRole: 'a waiter', userRole: 'a customer', opening: 'Hi', title: 'Restaurant' }
const HISTORY = [{ role: 'user' as const, content: 'I want pizza' }]

beforeEach(() => { vi.clearAllMocks() })

describe('getScenarioReport', () => {
  it('to\'g\'ri JSON ni parse qiladi va ballarni cheklaydi', async () => {
    mockText.value = JSON.stringify({
      fluency: 8, taskSuccess: 15, // 15 > 10 → 10 ga cheklanadi
      newWords: [{ word: 'delicious', meaning: 'mazali' }],
      mistakes: [{ wrong: 'I want pizza', correct: "I'd like a pizza", tip: 'muloyimroq' }],
      encouragement: 'Zo\'r!',
    })
    const r = await getScenarioReport(SCENE, 'pizza buyurtma', 'B1', HISTORY)
    expect(r.fluency).toBe(8)
    expect(r.taskSuccess).toBe(10)        // cheklangan
    expect(r.newWords).toHaveLength(1)
    expect(r.mistakes[0].correct).toBe("I'd like a pizza")
  })

  it('buzuq javobda fallback qaytaradi', async () => {
    mockText.value = 'not json at all'
    const r = await getScenarioReport(SCENE, 'goal', 'B1', HISTORY)
    expect(r.fluency).toBe(0)
    expect(r.newWords).toEqual([])
    expect(r.encouragement).toBeTruthy() // fallback matni
  })

  it('newWords/mistakes ni 4 tagacha cheklaydi', async () => {
    mockText.value = JSON.stringify({
      fluency: 5, taskSuccess: 5,
      newWords: Array(10).fill({ word: 'w', meaning: 'm' }),
      mistakes: [], encouragement: 'ok',
    })
    const r = await getScenarioReport(SCENE, 'g', 'B1', HISTORY)
    expect(r.newWords.length).toBeLessThanOrEqual(4)
  })
})

describe('analyzeWritingErrors', () => {
  it('xatolarni parse qiladi', async () => {
    mockText.value = JSON.stringify({
      errors: [{ wrong: 'I has', correct: 'I have', explanation: 'I bilan have', category: 'Grammatika' }],
    })
    const errs = await analyzeWritingErrors('prompt', 'I has a cat', 'B1')
    expect(errs).toHaveLength(1)
    expect(errs[0].correct).toBe('I have')
    expect(errs[0].category).toBe('Grammatika')
  })

  it('wrong yoki correct bo\'sh xatolarni chiqarib tashlaydi', async () => {
    mockText.value = JSON.stringify({
      errors: [
        { wrong: '', correct: 'x', explanation: 'e', category: 'c' },     // wrong bo'sh → tushadi
        { wrong: 'a', correct: 'b', explanation: 'e', category: 'c' },     // to'liq → qoladi
      ],
    })
    const errs = await analyzeWritingErrors('p', 'e', 'B1')
    expect(errs).toHaveLength(1)
    expect(errs[0].wrong).toBe('a')
  })

  it('errors massiv bo\'lmasa bo\'sh massiv', async () => {
    mockText.value = JSON.stringify({ errors: 'nope' })
    expect(await analyzeWritingErrors('p', 'e', 'B1')).toEqual([])
  })
})

describe('analyzePronunciation', () => {
  it('ballni 0-100 ga cheklaydi', async () => {
    mockText.value = JSON.stringify({ score: 150, issues: [], encouragement: 'ok' })
    const r = await analyzePronunciation('think', 'sink', '/θɪŋk/', 'B1')
    expect(r.score).toBe(100)
  })

  it('issues ni parse qiladi va so\'zsizlarni chiqaradi', async () => {
    mockText.value = JSON.stringify({
      score: 70,
      issues: [
        { word: 'think', heard: 'sink', ipa: '/θɪŋk/', tip: 'til tishlar orasiga' },
        { word: '', heard: 'x', ipa: 'y', tip: 'z' }, // word bo'sh → tushadi
      ],
      encouragement: 'yaxshi',
    })
    const r = await analyzePronunciation('think', 'sink', '/θɪŋk/', 'B1')
    expect(r.issues).toHaveLength(1)
    expect(r.issues[0].word).toBe('think')
  })

  it('buzuq javobda fallback', async () => {
    mockText.value = 'garbage'
    const r = await analyzePronunciation('a', 'b', 'c', 'B1')
    expect(r.score).toBe(0)
    expect(r.encouragement).toBeTruthy()
  })
})

describe('generateLearningInsights', () => {
  const signals = { level: 'B1', streak: 5, skills: [{ name: 'Grammatika', pct: 40 }], weakGrammar: ['Present Perfect'] }

  it('insightlarni parse qiladi', async () => {
    mockText.value = JSON.stringify({
      strengths: ['Grammatika', 'Lug\'at'],
      focusArea: 'Tinglash',
      recommendation: 'Har kuni 10 daqiqa tinglang',
      motivation: 'Davom eting!',
    })
    const r = await generateLearningInsights(signals)
    expect(r.strengths).toContain('Grammatika')
    expect(r.focusArea).toBe('Tinglash')
  })

  it('strengths ni 3 tagacha cheklaydi', async () => {
    mockText.value = JSON.stringify({ strengths: ['a', 'b', 'c', 'd', 'e'], focusArea: '', recommendation: '', motivation: '' })
    const r = await generateLearningInsights(signals)
    expect(r.strengths.length).toBeLessThanOrEqual(3)
  })

  it('buzuq javobda fallback motivatsiya', async () => {
    mockText.value = '{{{'
    const r = await generateLearningInsights(signals)
    expect(r.motivation).toBeTruthy()
    expect(r.strengths).toEqual([])
  })
})

describe('generatePracticeExercises', () => {
  it('yaroqli mashqlarni parse qiladi', async () => {
    mockText.value = JSON.stringify({
      exercises: [
        { question: 'She ___ to school.', options: ['go', 'goes', 'going', 'gone'], correct: 'goes', explanation: 'She + goes' },
      ],
    })
    const ex = await generatePracticeExercises('Present Simple', 'Umumiy', 'B1')
    expect(ex).toHaveLength(1)
    expect(ex[0].correct).toBe('goes')
  })

  it('4 variantsiz yoki correct options ichida bo\'lmagan mashqlarni chiqaradi', async () => {
    mockText.value = JSON.stringify({
      exercises: [
        { question: 'a ___', options: ['x', 'y', 'z'], correct: 'x', explanation: 'e' },        // 3 variant → tushadi
        { question: 'b ___', options: ['p', 'q', 'r', 's'], correct: 'NOPE', explanation: 'e' }, // correct yo'q → tushadi
        { question: 'c ___', options: ['1', '2', '3', '4'], correct: '2', explanation: 'e' },     // to'g'ri → qoladi
      ],
    })
    const ex = await generatePracticeExercises('topic', 'Sport', 'B1')
    expect(ex).toHaveLength(1)
    expect(ex[0].question).toBe('c ___')
  })

  it('exercises massiv bo\'lmasa bo\'sh massiv', async () => {
    mockText.value = JSON.stringify({ exercises: null })
    expect(await generatePracticeExercises('t', 'Umumiy', 'B1')).toEqual([])
  })

  it('tema "Umumiy" bo\'lmasa system promptga qo\'shiladi', async () => {
    mockText.value = JSON.stringify({ exercises: [] })
    await generatePracticeExercises('Articles', 'Sayohat', 'B1')
    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.system).toContain('Sayohat')
  })
})
