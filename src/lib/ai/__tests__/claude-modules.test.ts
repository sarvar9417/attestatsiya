import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../claudeClient', () => ({
  MODEL: 'claude-3-haiku',
  proxyFetch: vi.fn(),
  sendMessage: vi.fn(),
}))

vi.mock('../../monitoring', () => ({
  monitoring: { captureException: vi.fn(), captureMessage: vi.fn() },
}))

import { proxyFetch, sendMessage } from '../../claudeClient'

const mockProxyFetch = vi.mocked(proxyFetch)
const mockSendMessage = vi.mocked(sendMessage)

function mockClaudeResponse(text: string) {
  mockProxyFetch.mockResolvedValue({
    json: () => Promise.resolve({ content: [{ type: 'text', text }] }),
  } as Response)
}

function mockClaudeError(status = 500) {
  mockProxyFetch.mockRejectedValue(new Error(`HTTP ${status}`))
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── claude-vocab ──────────────────────────────────────────────────────────────

describe('claude-vocab', () => {
  it('explainWord calls sendMessage', async () => {
    mockSendMessage.mockResolvedValue('This word means abundance.')
    const { explainWord } = await import('../claude-vocab')
    const result = await explainWord('abundant')
    expect(mockSendMessage).toHaveBeenCalledWith(
      [{ role: 'user', content: 'Explain the word: "abundant"' }],
      'vocabulary'
    )
    expect(result).toBe('This word means abundance.')
  })

  it('generateWordCard parses TRANSLATION/PHONETIC/EXAMPLE', async () => {
    mockClaudeResponse("TRANSLATION: Ko'p, boy\nPHONETIC: /əˈbʌndənt/\nEXAMPLE: We have abundant resources.")
    const { generateWordCard } = await import('../claude-vocab')
    const card = await generateWordCard('abundant', 'A2')
    expect(card.translation).toContain("Ko'p")
    expect(card.phonetic).toContain('/əˈbʌndənt/')
    expect(card.example).toContain('abundant')
  })

  it('generateWordCard returns empty on bad response', async () => {
    mockClaudeResponse('random text')
    const { generateWordCard } = await import('../claude-vocab')
    const card = await generateWordCard('test', 'A1')
    expect(card.translation).toBe('')
  })

  it('checkVocabAnswer returns true for CORRECT', async () => {
    mockClaudeResponse('CORRECT')
    const { checkVocabAnswer } = await import('../claude-vocab')
    expect(await checkVocabAnswer('chiroyli', 'beautiful', 'beautiful')).toBe(true)
  })

  it('checkVocabAnswer returns false for WRONG', async () => {
    mockClaudeResponse('WRONG')
    const { checkVocabAnswer } = await import('../claude-vocab')
    expect(await checkVocabAnswer('chiroyli', 'beautiful', 'ugly')).toBe(false)
  })

  it('checkPhraseTranslation returns true for CORRECT', async () => {
    mockClaudeResponse('CORRECT')
    const { checkPhraseTranslation } = await import('../claude-vocab')
    expect(await checkPhraseTranslation('Men kitob o\'qiyapman', 'I am reading a book', 'I am reading a book')).toBe(true)
  })

  it('generateUzbekSentence returns text', async () => {
    mockClaudeResponse('Men bugun maktabga bordim.')
    const { generateUzbekSentence } = await import('../claude-vocab')
    const sentence = await generateUzbekSentence('school', 'maktab', 'A1')
    expect(sentence).toContain('maktab')
  })

  it('generateUzbekSentence returns fallback on empty', async () => {
    mockClaudeResponse('')
    const { generateUzbekSentence } = await import('../claude-vocab')
    const sentence = await generateUzbekSentence('go', 'borish', 'A1')
    expect(sentence).toBeTruthy()
  })

  it('checkSentenceTranslation parses CORRECT: yes', async () => {
    mockClaudeResponse('CORRECT: yes')
    const { checkSentenceTranslation } = await import('../claude-vocab')
    const result = await checkSentenceTranslation('Men kitob o\'qiyapman', 'read', 'I am reading a book', 'A2')
    expect(result.correct).toBe(true)
  })

  it('checkSentenceTranslation parses CORRECT: no', async () => {
    mockClaudeResponse('CORRECT: no\nEXPLANATION: "read" so\'zi yo\'q\nCORRECT_ANSWER: I am reading a book')
    const { checkSentenceTranslation } = await import('../claude-vocab')
    const result = await checkSentenceTranslation('Men kitob o\'qiyapman', 'read', 'I like books', 'A2')
    expect(result.correct).toBe(false)
    expect(result.explanation).toContain('read')
  })
})

// ─── claude-exercises ──────────────────────────────────────────────────────────

describe('claude-exercises', () => {
  it('checkDailyExerciseAnswers returns empty for empty input', async () => {
    const { checkDailyExerciseAnswers } = await import('../claude-exercises')
    expect(await checkDailyExerciseAnswers([])).toEqual([])
  })

  it('checkDailyExerciseAnswers parses boolean array', async () => {
    mockClaudeResponse('[true, false, true]')
    const { checkDailyExerciseAnswers } = await import('../claude-exercises')
    const items = [
      { id: 1, context: 'I ___ happy', correct: 'am', userAnswer: 'am', type: 'fill-blank' },
      { id: 2, context: 'She ___ fast', correct: 'runs', userAnswer: 'run', type: 'fill-blank' },
      { id: 3, context: 'They ___ here', correct: 'are', userAnswer: 'are', type: 'fill-blank' },
    ]
    expect(await checkDailyExerciseAnswers(items)).toEqual([true, false, true])
  })

  it('checkDailyExerciseAnswers returns all false on bad JSON', async () => {
    mockClaudeResponse('not json')
    const { checkDailyExerciseAnswers } = await import('../claude-exercises')
    const items = [{ id: 1, context: 'x', correct: 'y', userAnswer: 'z', type: 'fill' }]
    expect(await checkDailyExerciseAnswers(items)).toEqual([false])
  })

  it('generatePracticeExercises parses valid JSON', async () => {
    mockClaudeResponse(JSON.stringify({
      exercises: [
        { question: 'I ___ a student', options: ['am', 'is', 'are', 'be'], correct: 'am', explanation: 'Men talabaman' },
      ],
    }))
    const { generatePracticeExercises } = await import('../claude-exercises')
    const result = await generatePracticeExercises('be verbs', 'Umumiy', 'A1', 1)
    expect(result).toHaveLength(1)
    expect(result[0].correct).toBe('am')
  })

  it('generatePracticeExercises returns empty on bad JSON', async () => {
    mockClaudeResponse('invalid')
    const { generatePracticeExercises } = await import('../claude-exercises')
    expect(await generatePracticeExercises('topic', 'theme', 'A1', 2)).toEqual([])
  })

  it('generateLearningInsights parses JSON', async () => {
    mockClaudeResponse(JSON.stringify({
      strengths: ['Speaking yaxshi'],
      focusArea: 'Grammar',
      recommendation: 'Kuniga 10 ta gap yozing',
      motivation: 'Davom eting!',
    }))
    const { generateLearningInsights } = await import('../claude-exercises')
    const result = await generateLearningInsights({
      level: 'A2', streak: 5,
      skills: [{ name: 'Speaking', pct: 80 }, { name: 'Grammar', pct: 40 }],
      weakGrammar: ['Past Simple'],
    })
    expect(result.strengths).toContain('Speaking yaxshi')
    expect(result.focusArea).toBe('Grammar')
  })

  it('generateLearningInsights returns fallback on error', async () => {
    mockClaudeResponse('bad')
    const { generateLearningInsights } = await import('../claude-exercises')
    const result = await generateLearningInsights({ level: 'A1', streak: 0, skills: [], weakGrammar: [] })
    expect(result.motivation).toBeTruthy()
  })
})

// ─── claude-speaking ───────────────────────────────────────────────────────────

describe('claude-speaking', () => {
  it('getSpeakingChatFeedback returns feedback', async () => {
    mockClaudeResponse('✅ Kuchli tomon: Yaxshi gapirding\n📌 Yaxshilash: Grammatika')
    const { getSpeakingChatFeedback } = await import('../claude-speaking')
    const result = await getSpeakingChatFeedback('A2', [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ])
    expect(result).toContain('Kuchli tomon')
  })

  it('getSpeakingChatFeedback returns empty on error', async () => {
    mockClaudeError()
    const { getSpeakingChatFeedback } = await import('../claude-speaking')
    expect(await getSpeakingChatFeedback('A1', [{ role: 'user', content: 'test' }])).toBe('')
  })
})

// ─── claude-grammar ────────────────────────────────────────────────────────────

describe('claude-grammar', () => {
  it('checkGrammar calls sendMessage', async () => {
    mockSendMessage.mockResolvedValue('Your grammar is correct.')
    const { checkGrammar } = await import('../claude-grammar')
    const result = await checkGrammar('I go to school')
    expect(mockSendMessage).toHaveBeenCalled()
    expect(result).toContain('grammar')
  })

  it('getWritingFeedback calls sendMessage', async () => {
    mockSendMessage.mockResolvedValue('Good essay. Consider adding more details.')
    const { getWritingFeedback } = await import('../claude-grammar')
    const result = await getWritingFeedback('I like cats.')
    expect(result).toContain('essay')
  })

  it('analyzeWritingErrors parses error array', async () => {
    mockClaudeResponse(JSON.stringify({
      errors: [
        { wrong: 'I goes', correct: 'I go', explanation: 'Subject-verb agreement', category: 'Grammatika' },
      ],
    }))
    const { analyzeWritingErrors } = await import('../claude-grammar')
    const result = await analyzeWritingErrors('Write about yourself', 'I goes to school', 'A1')
    expect(result).toHaveLength(1)
    expect(result[0].correct).toBe('I go')
  })
})

// ─── claude-writing ────────────────────────────────────────────────────────────

describe('claude-writing', () => {
  it('generateWritingTask parses JSON', async () => {
    mockClaudeResponse(JSON.stringify({
      prompt: 'Write about your daily routine',
      wordLimit: 80,
      tips: ['Reja tuzing'],
      keyPhrases: [{ phrase: 'I usually', translation: 'Men odatda' }],
      structure: ['Introduction', 'Body', 'Conclusion'],
    }))
    const { generateWritingTask } = await import('../claude-writing')
    const result = await generateWritingTask('Daily routine', 'A1')
    expect(result.prompt).toContain('daily routine')
    expect(result.wordLimit).toBe(80)
  })

  it('generateWritingTask returns fallback on bad JSON', async () => {
    mockClaudeResponse('not json')
    const { generateWritingTask } = await import('../claude-writing')
    const result = await generateWritingTask('Topic', 'A1')
    expect(result.prompt).toBeTruthy()
    expect(result.structure.length).toBeGreaterThan(0)
  })
})

// ─── claude-duel ───────────────────────────────────────────────────────────────

describe('claude-duel', () => {
  it('generateDuelVerdict parses verdict', async () => {
    mockClaudeResponse(JSON.stringify({
      winner: 'player1',
      reason: 'Better vocabulary usage',
    }))
    const { generateDuelVerdict } = await import('../claude-duel')
    const result = await generateDuelVerdict(
      [{ role: 'user', content: 'I love programming' }],
      [{ role: 'user', content: 'I enjoy coding' }],
      'A2'
    )
    expect(result).toBeTruthy()
  })
})
