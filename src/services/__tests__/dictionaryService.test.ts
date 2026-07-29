import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import {
  fetchWordList,
  searchDictionary,
  addUserWord,
  deleteUserWord,
} from '../dictionaryService'

// ─── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockSupabaseInstance } = vi.hoisted(() => {
  const mockSupabaseInstance: { from: Mock; rpc: Mock } = {
    from: vi.fn(),
    rpc: vi.fn(),
  }
  return { mockSupabaseInstance }
})

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))

import { buildQB } from '../../test/supabaseMock'

// ─── Lifecycle ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T10:30:00Z'))
  // Explicitly clear mock calls to ensure clean state between tests
  mockSupabaseInstance.from.mockClear()
  mockSupabaseInstance.rpc.mockClear()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// ═══════════════════════════════════════════════════════════════════════════════
//  fetchWordList
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetchWordList', () => {
  it('fetches system words with progress and user words', async () => {
    const qbW = buildQB() // words table
    const qbV = buildQB() // vocabulary_progress table
    const qbU = buildQB() // user_words table

    qbW.setResult(
      [
        { id: 1, english: 'hello', uzbek: 'salom', level: 'A1', example: 'Hello!', phonetic: '/həˈloʊ/' },
        { id: 2, english: 'world', uzbek: 'dunyo', level: 'A1', example: 'World!', phonetic: '/wɜːrld/' },
      ],
      null, 2,
    )
    qbV.setResult(
      [{ word_id: 1, box: 3, is_learned: true, correct_count: 10, wrong_count: 1 }],
      null,
    )
    qbU.setResult(
      [{ id: 99, english: 'myword', uzbek: 'sozim', level: 'B1', example: '', phonetic: '' }],
      null,
    )

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'words') return qbW.qb
      if (table === 'vocabulary_progress') return qbV.qb
      if (table === 'user_words') return qbU.qb
      return buildQB().qb
    })

    const result = await fetchWordList('user-1', 'A1', 1, 20)

    expect(result.total).toBe(2)
    expect(result.words).toHaveLength(3) // 2 system + 1 user
    // System word with progress
    expect(result.words[0].english).toBe('hello')
    expect(result.words[0].box).toBe(3)
    expect(result.words[0].is_learned).toBe(true)
    expect(result.words[0].source).toBe('system')
    // System word without progress
    expect(result.words[1].english).toBe('world')
    expect(result.words[1].box).toBeNull()
    // User word
    expect(result.words[2].english).toBe('myword')
    expect(result.words[2].source).toBe('user')

    // Verify query chain
    expect(qbW.qb.select).toHaveBeenCalledWith('id, english, uzbek, level, example, phonetic', { count: 'exact' })
    expect(qbW.qb.eq).toHaveBeenCalledWith('level', 'A1')
    expect(qbW.qb.range).toHaveBeenCalledWith(0, 19)
    expect(qbU.qb.eq).toHaveBeenCalledWith('user_id', 'user-1')
  })

  it('returns only system words when no userId', async () => {
    const qbW = buildQB()
    qbW.setResult([{ id: 1, english: 'hello', uzbek: 'salom', level: 'A1', example: '', phonetic: '' }], null, 1)

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'words') return qbW.qb
      return buildQB().qb
    })

    const result = await fetchWordList()

    expect(result.words).toHaveLength(1)
    expect(result.words[0].source).toBe('system')
  })

  it('handles error gracefully returning empty array', async () => {
    const qbW = buildQB()
    qbW.setResult(null, new Error('Network error'))

    mockSupabaseInstance.from.mockReturnValue(qbW.qb)

    const result = await fetchWordList()

    expect(result.words).toEqual([])
    expect(result.total).toBe(0)
  })

  it('filters by level only when level is provided', async () => {
    const qbW = buildQB()
    qbW.setResult([{ id: 1, english: 'hello', uzbek: 'salom', level: 'A1', example: '', phonetic: '' }], null, 1)

    mockSupabaseInstance.from.mockReturnValue(qbW.qb)

    await fetchWordList('user-1', undefined, 1, 20)

    // When level is undefined, eq('level') should NOT be called
    expect(qbW.qb.eq).not.toHaveBeenCalledWith('level', expect.any(String))
  })

  it('returns only system words when userId is provided but no user words exist', async () => {
    const qbW = buildQB()
    const qbV = buildQB()
    const qbU = buildQB()

    qbW.setResult([{ id: 1, english: 'hello', uzbek: 'salom', level: 'A1', example: '', phonetic: '' }], null, 1)
    qbV.setResult([], null)  // no progress
    qbU.setResult([], null)  // no user words

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'words') return qbW.qb
      if (table === 'vocabulary_progress') return qbV.qb
      if (table === 'user_words') return qbU.qb
      return buildQB().qb
    })

    const result = await fetchWordList('user-1')

    expect(result.words).toHaveLength(1)
    expect(result.words[0].source).toBe('system')
    expect(result.words[0].box).toBeNull()
  })

  it('handles empty system words gracefully', async () => {
    const qbW = buildQB()
    qbW.setResult([], null, 0)

    mockSupabaseInstance.from.mockReturnValue(qbW.qb)

    const result = await fetchWordList('user-1', 'B2', 1, 20)

    expect(result.words).toEqual([])
    expect(result.total).toBe(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  searchDictionary
// ═══════════════════════════════════════════════════════════════════════════════

describe('searchDictionary', () => {
  it('returns empty for empty query', async () => {
    const result = await searchDictionary('', 'user-1')
    expect(result.words).toEqual([])
    expect(result.total).toBe(0)
  })

  it('returns empty for whitespace-only query', async () => {
    const result = await searchDictionary('   ', 'user-1')
    expect(result.words).toEqual([])
    expect(result.total).toBe(0)
  })

  it('searches system and user words with ILIKE', async () => {
    const qbW = buildQB()
    const qbU = buildQB()
    const qbV = buildQB()

    qbW.setResult([
      { id: 1, english: 'hello', uzbek: 'salom', level: 'A1', example: '', phonetic: '' },
    ], null)
    qbU.setResult([
      { id: 99, english: 'myhello', uzbek: 'mening salomim', level: 'B1', example: '', phonetic: '' },
    ], null)
    qbV.setResult([], null)

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'words') return qbW.qb
      if (table === 'user_words') return qbU.qb
      if (table === 'vocabulary_progress') return qbV.qb
      return buildQB().qb
    })

    const result = await searchDictionary('hello', 'user-1')

    expect(result.words).toHaveLength(2)
    expect(result.total).toBe(2)
    // or() should be called with ILIKE pattern
    expect(qbW.qb.or).toHaveBeenCalledWith('english.ilike.%hello%,uzbek.ilike.%hello%')
    expect(qbU.qb.eq).toHaveBeenCalledWith('user_id', 'user-1')
  })

  it('searches without userId', async () => {
    const qbW = buildQB()
    qbW.setResult([{ id: 1, english: 'hello', uzbek: 'salom', level: 'A1', example: '', phonetic: '' }], null)

    mockSupabaseInstance.from.mockReturnValue(qbW.qb)

    const result = await searchDictionary('hello')

    expect(result.words).toHaveLength(1)
    expect(qbW.qb.or).toHaveBeenCalled()
  })

  it('handles search error gracefully', async () => {
    const qbW = buildQB()
    qbW.setResult(null, new Error('Network error'))

    mockSupabaseInstance.from.mockReturnValue(qbW.qb)

    const result = await searchDictionary('hello')

    expect(result.words).toEqual([])
    expect(result.total).toBe(0)
  })

  it('filters by level in search', async () => {
    const qbW = buildQB()
    qbW.setResult([{ id: 1, english: 'hello', uzbek: 'salom', level: 'A1', example: '', phonetic: '' }], null)

    mockSupabaseInstance.from.mockReturnValue(qbW.qb)

    await searchDictionary('hello', 'user-1', 'A1')

    expect(qbW.qb.eq).toHaveBeenCalledWith('level', 'A1')
  })

  it('does not query user_words when no userId', async () => {
    const qbW = buildQB()
    qbW.setResult([{ id: 1, english: 'hello', uzbek: 'salom', level: 'A1', example: '', phonetic: '' }], null)

    mockSupabaseInstance.from.mockReturnValue(qbW.qb)

    await searchDictionary('hello')

    // Should not call user_words at all
    const calls = mockSupabaseInstance.from.mock.calls.filter((c: string[]) => c[0] === 'user_words')
    expect(calls).toHaveLength(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  addUserWord
// ═══════════════════════════════════════════════════════════════════════════════

describe('addUserWord', () => {
  it('adds a new word and returns the created word', async () => {
    const qbCheck = buildQB()
    const qbInsert = buildQB()

    // No existing word
    qbCheck.setResult(null, null)
    // Insert succeeds
    qbInsert.setResult(
      { id: 100, english: 'gratitude', uzbek: 'minnatdorchilik', level: 'B2', example: '', phonetic: '' },
      null,
    )

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'user_words') {
        // First call: check, Second call: insert
        if ((qbCheck.qb.maybeSingle as Mock).mock.calls.length === 0) return qbCheck.qb
        return qbInsert.qb
      }
      return buildQB().qb
    })

    const result = await addUserWord('user-1', {
      english: 'gratitude',
      uzbek: 'minnatdorchilik',
      level: 'B2',
    })

    expect(result.success).toBe(true)
    expect(result.word).toBeDefined()
    expect(result.word!.english).toBe('gratitude')
    expect(result.word!.source).toBe('user')
  })

  it('returns error if word already exists', async () => {
    const qbCheck = buildQB()
    qbCheck.setResult({ id: 50 }, null)

    mockSupabaseInstance.from.mockReturnValue(qbCheck.qb)

    const result = await addUserWord('user-1', {
      english: 'gratitude',
      uzbek: 'minnatdorchilik',
      level: 'B2',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('allaqachon')
  })

  it('returns error on insert failure', async () => {
    const qbCheck = buildQB()
    const qbInsert = buildQB()

    qbCheck.setResult(null, null)
    qbInsert.setResult(null, new Error('Constraint violation'))

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'user_words') {
        if ((qbCheck.qb.maybeSingle as Mock).mock.calls.length === 0) return qbCheck.qb
        return qbInsert.qb
      }
      return buildQB().qb
    })

    const result = await addUserWord('user-1', {
      english: 'gratitude',
      uzbek: 'minnatdorchilik',
      level: 'B2',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Constraint violation')
  })

  it('trims whitespace from english and uzbek', async () => {
    const qbCheck = buildQB()
    const qbInsert = buildQB()

    qbCheck.setResult(null, null)
    qbInsert.setResult(
      { id: 101, english: ' hello ', uzbek: ' salom ', level: 'A1', example: '', phonetic: '' },
      null,
    )

    mockSupabaseInstance.from.mockImplementation((table: string) => {
      if (table === 'user_words') {
        if ((qbCheck.qb.maybeSingle as Mock).mock.calls.length === 0) return qbCheck.qb
        return qbInsert.qb
      }
      return buildQB().qb
    })

    const result = await addUserWord('user-1', {
      english: '  hello  ',
      uzbek: '  salom  ',
      level: 'A1',
    })

    expect(result.success).toBe(true)
    // insert should receive trimmed values
    expect(qbInsert.qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({ english: 'hello', uzbek: 'salom' }),
    )
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  deleteUserWord
// ═══════════════════════════════════════════════════════════════════════════════

describe('deleteUserWord', () => {
  it('deletes word by id and userId', async () => {
    const qb = buildQB()
    qb.setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb.qb)

    const result = await deleteUserWord('user-1', 100)

    expect(result.success).toBe(true)
    expect(qb.qb.delete).toHaveBeenCalled()
    expect(qb.qb.eq).toHaveBeenCalledWith('id', 100)
    expect(qb.qb.eq).toHaveBeenCalledWith('user_id', 'user-1')
  })

  it('returns error on delete failure', async () => {
    const qb = buildQB()
    qb.setResult(null, new Error('Not found'))
    mockSupabaseInstance.from.mockReturnValue(qb.qb)

    const result = await deleteUserWord('user-1', 999)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Not found')
  })
})
