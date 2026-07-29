import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../db/database', () => {
  const store: Array<Record<string, unknown>> = []
  return {
    db: {
      pronunciationErrors: {
        bulkAdd: vi.fn(async (records: Array<Record<string, unknown>>) => {
          store.push(...records)
        }),
        toArray: vi.fn(async () => store),
        where: vi.fn(() => ({
          above: vi.fn(() => ({
            toArray: vi.fn(async () => store),
          })),
        })),
        clear: vi.fn(async () => { store.length = 0 }),
      },
    },
  }
})

vi.mock('../../data/pronunciationSounds', () => ({
  classifySound: vi.fn((ipa: string) => ({
    id: ipa?.includes('θ') ? 'th-voiceless' : 'other',
    category: 'consonants',
    drillCategory: 'dental',
  })),
  SOUND_CATEGORIES: [
    { id: 'th-voiceless', category: 'consonants', drillCategory: 'dental' },
  ],
  getDrillLabel: vi.fn(() => 'Dental练习'),
}))

vi.mock('../../lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn(), captureException: vi.fn() },
}))

describe('pronunciationErrorService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports expected functions', async () => {
    const mod = await import('../pronunciationErrorService')
    expect(typeof mod.trackPronunciationErrors).toBe('function')
    expect(typeof mod.getFrequentErrors).toBe('function')
    expect(typeof mod.getErrorTrend).toBe('function')
    expect(typeof mod.getDrillSuggestions).toBe('function')
    expect(typeof mod.clearPronunciationErrors).toBe('function')
  })

  it('trackPronunciationErrors with empty issues does nothing', async () => {
    const { trackPronunciationErrors } = await import('../pronunciationErrorService')
    await trackPronunciationErrors([], 80, 'pronunciation')
    const { db } = await import('../../db/database')
    expect(db.pronunciationErrors.bulkAdd).not.toHaveBeenCalled()
  })

  it('trackPronunciationErrors stores records', async () => {
    const { trackPronunciationErrors } = await import('../pronunciationErrorService')
    await trackPronunciationErrors(
      [{ word: 'think', ipa: 'θɪŋk', tip: 'Use dental fricative', category: 'consonants' }],
      75,
      'shadow',
      'chunk-1'
    )
    const { db } = await import('../../db/database')
    expect(db.pronunciationErrors.bulkAdd).toHaveBeenCalled()
  })

  it('clearPronunciationErrors clears the store', async () => {
    const { clearPronunciationErrors } = await import('../pronunciationErrorService')
    await clearPronunciationErrors()
    const { db } = await import('../../db/database')
    expect(db.pronunciationErrors.clear).toHaveBeenCalled()
  })
})
