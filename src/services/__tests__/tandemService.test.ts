// ═══════════════════════════════════════════════════════════════════════════
// tandemService.test.ts — Tandem servis e2e testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'

// ─── Hoisted mocks (single block to avoid hoisting order issues) ───────────────

const {
  mockSupabaseInstance,
  mockToast,
  mockAddXP,
  mockFetchQuestions,
} = vi.hoisted(() => {
  const mocks = {
    mockSupabaseInstance: { from: vi.fn(), rpc: vi.fn(), channel: vi.fn(), auth: { getSession: vi.fn() } } as Record<string, unknown>,
    mockToast: vi.fn(),
    mockAddXP: vi.fn(),
    mockFetchQuestions: vi.fn().mockResolvedValue({
      questions: [
        { id: 1, english: 'Hello', options: ['A', 'B', 'C', 'D'], correct: 0 },
        { id: 2, english: 'World', options: ['X', 'Y', 'Z', 'W'], correct: 1 },
      ],
    }),
  }
  return mocks
})

const mockSession = { data: { session: { user: { id: 'test-user-id' } } } }

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabaseInstance }))
vi.mock('../../utils/toastStore', () => ({ useToastStore: { getState: () => ({ toast: mockToast }) } }))
vi.mock('../../hooks/useNotifications', () => ({ sendBrowserNotification: vi.fn() }))
vi.mock('../../store/useStore', () => ({ useStore: { getState: () => ({ addXP: mockAddXP }) } }))
vi.mock('../../lib/monitoring', () => ({ monitoring: { captureMessage: vi.fn() } }))
vi.mock('../../data/leagues', () => ({ getWeekStart: () => '2026-06-15' }))
vi.mock('../../services/battleService', () => ({ fetchBattleQuestionsByMode: mockFetchQuestions }))

import { buildQB } from '../../test/supabaseMock'

import {
  addFriendByCode, sendFriendRequest, acceptFriendRequest, removeFriend,
  getFriends, createTandemPair, getTandemPair, updateTandemStreak,
  createDuel, submitDuelAnswers, getActiveDuels, getDuelHistory,
  getOrCreateWeeklyDuel, settleWeeklyDuel,
  getWeeklyDuelWins, cancelDuel, submitSpeakingDuelAnswer,
  lessonExercisesToDuelQuestions, createLessonDuel,
} from '../tandemService'
import type { DailyExercise } from '../../data/dailyLessons'

// ─── Helper: build QB with update support ──────────────────────────────────────

function buildQBWithUpdate() {
  const { qb, setResult } = buildQB()
  const updateMock = vi.fn(() => qb)
  ;(qb as Record<string, unknown>).update = updateMock
  return { qb: qb as QBWithUpdate, setResult }
}

// type + intersection ishlatamiz — `interface extends Indexed['key']` yaroqsiz
// sintaksis (eslint parser xato berardi; vitest esbuild type'ni tashlagani uchun
// ishlardi-yu, lint qilolmas edi).
type QBWithUpdate = ReturnType<typeof buildQB>['qb'] & {
  update: Mock
}

// ─── Lifecycle ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T10:30:00Z'))
  mockSupabaseInstance.auth.getSession.mockResolvedValue(mockSession)
  mockSupabaseInstance.from.mockClear()
  mockSupabaseInstance.rpc.mockClear()
  mockToast.mockClear()
  mockAddXP.mockClear()
  // Re-set battleService mock (restoreAllMocks clears it)
  mockFetchQuestions.mockResolvedValue({
    questions: [
      { id: 1, english: 'Hello', options: ['A', 'B', 'C', 'D'], correct: 0 },
      { id: 2, english: 'World', options: ['X', 'Y', 'Z', 'W'], correct: 1 },
    ],
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  // Re-apply getSession mock after restoreAllMocks clears it
  mockSupabaseInstance.auth.getSession.mockResolvedValue(mockSession)
})

// ═══════════════════════════════════════════════════════════════════════════════
//  DO'STLIK
// ═══════════════════════════════════════════════════════════════════════════════

describe('addFriendByCode', () => {
  it('adds new friend via base64 code (upsert)', async () => {
    // lookupUserIdByInviteCode — returns the decoded user id
    const { qb: userQB, setResult: setUser } = buildQBWithUpdate()
    setUser({ id: 'friend-123' }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(userQB)

    // select returns [] — no existing record
    const { qb: checkQB, setResult: setCheck } = buildQBWithUpdate()
    setCheck([], null)
    mockSupabaseInstance.from.mockReturnValueOnce(checkQB)

    // upsert returns success
    const { qb: upsertQB, setResult: setUpsert } = buildQBWithUpdate()
    setUpsert(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(upsertQB)

    const result = await addFriendByCode(btoa('friend-123'))

    expect(result.success).toBe(true)
    expect(upsertQB.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'test-user-id', friend_id: 'friend-123', status: 'accepted' }),
      expect.objectContaining({ onConflict: 'user_id,friend_id' }),
    )
  })

  it('rejects self-add', async () => {
    // lookupUserIdByInviteCode returns current user — self-add detection
    const { qb: userQB, setResult: setUser } = buildQBWithUpdate()
    setUser({ id: 'test-user-id' }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(userQB)

    const result = await addFriendByCode(btoa('test-user-id'))
    expect(result.success).toBe(false)
    expect(result.error).toContain("O'zingizni qo'sha olmaysiz")
  })

  it('rejects if already friends', async () => {
    // lookupUserIdByInviteCode returns the friend id
    const { qb: userQB, setResult: setUser } = buildQBWithUpdate()
    setUser({ id: 'friend-456' }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(userQB)

    const { qb, setResult } = buildQBWithUpdate()
    setResult([{ id: 'fs-1', status: 'accepted', user_id: 'test-user-id', friend_id: 'friend-456' }], null)
    mockSupabaseInstance.from.mockReturnValueOnce(qb)

    const result = await addFriendByCode(btoa('friend-456'))
    expect(result.success).toBe(false)
    expect(result.error).toContain("allaqachon do'stingiz")
  })

  it('accepts pending invite', async () => {
    // lookupUserIdByInviteCode returns the friend id
    const { qb: userQB, setResult: setUser } = buildQBWithUpdate()
    setUser({ id: 'friend-789' }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(userQB)

    // select returns pending row
    const { qb: checkQB, setResult: setCheck } = buildQBWithUpdate()
    setCheck([{ id: 'fs-pending', status: 'pending', user_id: 'friend-789', friend_id: 'test-user-id' }], null)
    mockSupabaseInstance.from.mockReturnValueOnce(checkQB)

    // update returns success
    const { qb: updateQB, setResult: setUpdate } = buildQBWithUpdate()
    setUpdate(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(updateQB)

    const result = await addFriendByCode(btoa('friend-789'))
    expect(result.success).toBe(true)
    expect(updateQB.update).toHaveBeenCalledWith({ status: 'accepted' })
    expect(updateQB.eq).toHaveBeenCalledWith('id', 'fs-pending')
  })

  it('rejects invalid code', async () => {
    const result = await addFriendByCode('invalid!')
    expect(result.success).toBe(false)
    expect(result.error).toContain("Noto'g'ri")
  })
})

describe('sendFriendRequest / acceptFriendRequest / removeFriend', () => {
  it('sends friend request', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await sendFriendRequest('friend-001')
    expect(result.success).toBe(true)
    expect(qb.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'test-user-id', friend_id: 'friend-001', status: 'pending' }),
      expect.objectContaining({ onConflict: 'user_id,friend_id' }),
    )
  })

  it('accepts friend request', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await acceptFriendRequest('fs-123')
    expect(result.success).toBe(true)
    expect(qb.update).toHaveBeenCalledWith({ status: 'accepted' })
    expect(qb.eq).toHaveBeenCalledWith('id', 'fs-123')
  })

  it('removes friend (deletes record)', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await removeFriend('fs-456')
    expect(result.success).toBe(true)
    expect(qb.delete).toHaveBeenCalled()
    expect(qb.eq).toHaveBeenCalledWith('id', 'fs-456')
  })
})

describe('getFriends', () => {
  it('returns friend list with profiles', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult([
      { id: 'fs-1', status: 'accepted', friend: { id: 'friend-a', name: 'Ali', level: 'B1', streak: 5, last_active: '2026-06-15' }, inviter: null, user_id: 'test-user-id' },
      { id: 'fs-2', status: 'accepted', friend: { id: 'friend-b', name: 'Vali', level: 'A2', streak: 3, last_active: '2026-06-14' }, inviter: null, user_id: 'test-user-id' },
    ], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const friends = await getFriends()
    expect(friends).toHaveLength(2)
    expect(friends[0].name).toBe('Ali')
    expect(friends[1].name).toBe('Vali')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  TANDEM PAIR
// ═══════════════════════════════════════════════════════════════════════════════

describe('createTandemPair / getTandemPair', () => {
  it('creates pair', async () => {
    // 1. existing check — null (pair mavjud emas)
    const { qb: checkQB, setResult: setCheck } = buildQBWithUpdate()
    setCheck(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(checkQB)

    // 2. insert — yangi pair
    const { qb: insertQB, setResult: setInsert } = buildQBWithUpdate()
    setInsert({ id: 'pair-1', user_a: 'test-user-id', user_b: 'friend-a', combined_streak: 0, total_xp: 0 }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(insertQB)

    const result = await createTandemPair('friend-a')
    expect(result.success).toBe(true)
    expect(result.pair?.id).toBe('pair-1')
    // Kanonik tartib: 'friend-a' < 'test-user-id' → user_a='friend-a'
    expect(insertQB.insert).toHaveBeenCalledWith(expect.objectContaining({ user_a: 'friend-a', user_b: 'test-user-id' }))
  })

  it('retrieves pair', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult({ id: 'pair-1', user_a: 'test-user-id', user_b: 'friend-a' }, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const pair = await getTandemPair()
    expect(pair).not.toBeNull()
    expect(pair!.id).toBe('pair-1')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  STREAK
// ═══════════════════════════════════════════════════════════════════════════════

describe('updateTandemStreak', () => {
  beforeEach(() => {
    // mockReset() clears all state from previous test (calls, return queues, implementations)
    // This is essential in vitest 4.x where hoisted mocks retain state across tests
    mockSupabaseInstance.from.mockReset()
    const { qb, setResult } = buildQBWithUpdate()
    setResult({ id: 'pair-1', user_a: 'test-user-id', user_b: 'friend-a', combined_streak: 5, last_both_active: '2026-06-14', total_xp: 100, freeze_used_on: null }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(qb)
  })

  it('increments streak when both active today', async () => {
    const { qb: userQB, setResult: setUsers } = buildQBWithUpdate()
    setUsers([{ id: 'test-user-id', last_active: '2026-06-15', streak: 10 }, { id: 'friend-a', last_active: '2026-06-15', streak: 7 }], null)
    mockSupabaseInstance.from.mockReturnValueOnce(userQB)

    const { qb: updateQB, setResult: setUpdate } = buildQBWithUpdate()
    setUpdate(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(updateQB)

    const { qb: xpQB, setResult: setXp } = buildQBWithUpdate()
    setXp(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(xpQB)

    await updateTandemStreak()

    expect(updateQB.update).toHaveBeenCalledWith(
      expect.objectContaining({ combined_streak: 6, last_both_active: '2026-06-15', freeze_used_on: null }),
    )
  })

  it('does nothing if only one active', async () => {
    const { qb: userQB, setResult: setUsers } = buildQBWithUpdate()
    setUsers([{ id: 'test-user-id', last_active: '2026-06-15', streak: 10 }, { id: 'friend-a', last_active: '2026-06-14', streak: 7 }], null)
    mockSupabaseInstance.from.mockReturnValueOnce(userQB)

    await updateTandemStreak()
    expect(mockSupabaseInstance.from).toHaveBeenCalledTimes(2) // pair + users
  })

  it('does not double-count when already counted today (idempotent per day)', async () => {
    // beforeEach pair (last_both_active 2026-06-14) o'rniga bugungi sanani qo'yamiz
    mockSupabaseInstance.from.mockReset()
    const { qb: pairQB, setResult: setPair } = buildQBWithUpdate()
    setPair({ id: 'pair-1', user_a: 'test-user-id', user_b: 'friend-a', combined_streak: 5, last_both_active: '2026-06-15', total_xp: 100, freeze_used_on: null }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(pairQB)

    const { qb: userQB, setResult: setUsers } = buildQBWithUpdate()
    setUsers([{ id: 'test-user-id', last_active: '2026-06-15', streak: 10 }, { id: 'friend-a', last_active: '2026-06-15', streak: 7 }], null)
    mockSupabaseInstance.from.mockReturnValueOnce(userQB)

    await updateTandemStreak()
    // Guard ishlaydi: pair + users o'qiladi, lekin streak update QILINMAYDI
    expect(mockSupabaseInstance.from).toHaveBeenCalledTimes(2)
  })

  it('uses 1-day freeze grace when exactly yesterday was missed', async () => {
    mockSupabaseInstance.from.mockReset()
    // last_both_active = kechagi-oldingi kun (aniq 1 kun = kecha o'tkazildi)
    const { qb: pairQB, setResult: setPair } = buildQBWithUpdate()
    setPair({ id: 'pair-1', user_a: 'test-user-id', user_b: 'friend-a', combined_streak: 5, last_both_active: '2026-06-13', total_xp: 100, freeze_used_on: null }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(pairQB)

    const { qb: userQB, setResult: setUsers } = buildQBWithUpdate()
    setUsers([{ id: 'test-user-id', last_active: '2026-06-15', streak: 10 }, { id: 'friend-a', last_active: '2026-06-13', streak: 7 }], null)
    mockSupabaseInstance.from.mockReturnValueOnce(userQB)

    const { qb: updateQB, setResult: setUpdate } = buildQBWithUpdate()
    setUpdate(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(updateQB)

    await updateTandemStreak()
    // Grace: faqat freeze_used_on belgilanadi, streak SAQLANADI (reset emas)
    expect(updateQB.update).toHaveBeenCalledWith({ freeze_used_on: '2026-06-15' })
  })

  it('resets streak when 2+ days missed (grace exhausted)', async () => {
    mockSupabaseInstance.from.mockReset()
    // last_both_active 5 kun oldin — bo'shliq 1 kundan katta
    const { qb: pairQB, setResult: setPair } = buildQBWithUpdate()
    setPair({ id: 'pair-1', user_a: 'test-user-id', user_b: 'friend-a', combined_streak: 5, last_both_active: '2026-06-10', total_xp: 100, freeze_used_on: null }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(pairQB)

    const { qb: userQB, setResult: setUsers } = buildQBWithUpdate()
    setUsers([{ id: 'test-user-id', last_active: '2026-06-15', streak: 10 }, { id: 'friend-a', last_active: '2026-06-10', streak: 7 }], null)
    mockSupabaseInstance.from.mockReturnValueOnce(userQB)

    const { qb: updateQB, setResult: setUpdate } = buildQBWithUpdate()
    setUpdate(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(updateQB)

    await updateTandemStreak()
    expect(updateQB.update).toHaveBeenCalledWith({ combined_streak: 0, freeze_used_on: null, last_both_active: null })
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  DUEL
// ═══════════════════════════════════════════════════════════════════════════════

describe('createDuel', () => {
  it('creates duel with friend', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult({ id: 'duel-1', challenger: 'test-user-id', opponent: 'friend-a', mode: 'vocab', status: 'pending', is_bot: false }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(qb)

    const result = await createDuel('friend-a', 'vocab', 'B1')
    expect(result.success).toBe(true)
    expect(result.duel?.id).toBe('duel-1')
    expect(result.duel?.status).toBe('pending')
  })

  it('creates AI duel with auto-submit', async () => {
    const { qb: duelQB, setResult: setDuel } = buildQBWithUpdate()
    setDuel({ id: 'duel-ai-1', challenger: 'test-user-id', opponent: null, mode: 'vocab', status: 'pending', is_bot: true }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(duelQB)

    const { qb: aiQB, setResult: setAI } = buildQBWithUpdate()
    setAI(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(aiQB)

    const result = await createDuel(null, 'vocab', 'B1')
    expect(result.success).toBe(true)
    expect(result.duel?.is_bot).toBe(true)
    expect(aiQB.update).toHaveBeenCalled()
  })
})

describe('submitDuelAnswers / getActiveDuels / getDuelHistory', () => {
  it('submits answers and calculates score', async () => {
    const questionSet = [
      { id: 1, english: 'W1', options: ['A', 'B', 'C', 'D'], correct: 0 },
      { id: 2, english: 'W2', options: ['A', 'B', 'C', 'D'], correct: 2 },
      { id: 3, english: 'W3', options: ['A', 'B', 'C', 'D'], correct: 1 },
    ]

    const { qb: fetchQB, setResult: setFetch } = buildQBWithUpdate()
    setFetch({ id: 'duel-1', challenger: 'test-user-id', opponent: 'friend-a', question_set: questionSet, is_bot: false, mode: 'vocab', challenger_score: null, opponent_score: null, status: 'opponent_turn' }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(fetchQB)

    const { qb: updateQB, setResult: setUpdate } = buildQBWithUpdate()
    setUpdate(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(updateQB)

    const { qb: pairQB, setResult: setPair } = buildQBWithUpdate()
    setPair(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(pairQB)

    const answers = [
      { questionIndex: 0, answerIndex: 0 }, // correct
      { questionIndex: 1, answerIndex: 2 }, // correct
      { questionIndex: 2, answerIndex: 0 }, // wrong
    ]

    const result = await submitDuelAnswers('duel-1', answers)
    expect(result.success).toBe(true)
    expect(result.score).toBe(2)
    // Friend duel (is_bot=false, opponent mavjud) → challenger o'ynagach opponent_turn
    expect(updateQB.update).toHaveBeenCalledWith(expect.objectContaining({ challenger_score: 2, status: 'opponent_turn' }))
  })

  it('rejects re-submission when challenger already scored (idempotency)', async () => {
    const questionSet = [{ id: 1, english: 'W1', options: ['A', 'B', 'C', 'D'], correct: 0 }]
    const { qb: fetchQB, setResult: setFetch } = buildQBWithUpdate()
    // challenger_score allaqachon o'rnatilgan → qayta yuborish rad etilishi kerak
    setFetch({ id: 'duel-1', challenger: 'test-user-id', opponent: 'friend-a', question_set: questionSet, is_bot: false, mode: 'vocab', challenger_score: 3, opponent_score: null, status: 'opponent_turn' }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(fetchQB)

    const result = await submitDuelAnswers('duel-1', [{ questionIndex: 0, answerIndex: 0 }])
    expect(result.success).toBe(false)
    expect(result.error).toContain('allaqachon')
    // Hech qanday update/XP bo'lmasligi kerak — faqat duel o'qildi
    expect(fetchQB.update).not.toHaveBeenCalled()
  })

  it('gets active duels', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult([{ id: 'duel-1', challenger: 'test-user-id', opponent: 'friend-a', status: 'opponent_turn' }], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const duels = await getActiveDuels()
    expect(duels).toHaveLength(1)
  })

  it('gets duel history', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult([{ id: 'duel-done-1', challenger: 'test-user-id', opponent: 'friend-a', status: 'done', challenger_score: 8, opponent_score: 5 }], null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const history = await getDuelHistory()
    expect(history).toHaveLength(1)
  })
})

describe('submitSpeakingDuelAnswer', () => {
  it('rejects re-submission when challenger already scored (idempotency)', async () => {
    const { qb: fetchQB, setResult: setFetch } = buildQBWithUpdate()
    setFetch({ id: 'duel-s1', challenger: 'test-user-id', opponent: 'friend-a', is_bot: false, challenger_score: 7, opponent_score: null, status: 'opponent_turn' }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(fetchQB)

    const result = await submitSpeakingDuelAnswer('duel-s1', 'Describe your day', 'I had a great day', 'B1')
    expect(result.success).toBe(false)
    expect(result.error).toContain('allaqachon')
    expect(fetchQB.update).not.toHaveBeenCalled() // hech qanday XP/update yo'q
  })

  it('friend speaking duel → challenger sets opponent_turn, not done', async () => {
    const { qb: fetchQB, setResult: setFetch } = buildQBWithUpdate()
    setFetch({ id: 'duel-s2', challenger: 'test-user-id', opponent: 'friend-a', is_bot: false, challenger_score: null, opponent_score: null, status: 'pending' }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(fetchQB)

    const { qb: updateQB, setResult: setUpdate } = buildQBWithUpdate()
    setUpdate(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(updateQB)

    const { qb: resQB, setResult: setRes } = buildQBWithUpdate()
    setRes(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(resQB)

    // Bo'sh transcript → AI eval o'tkazib yuboriladi, to'g'ridan status mantig'iga
    const result = await submitSpeakingDuelAnswer('duel-s2', 'Describe your day', '', 'B1')
    expect(result.success).toBe(true)
    expect(updateQB.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'opponent_turn' }))
  })
})

describe('cancelDuel', () => {
  it('cancels duel (expired)', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult(null, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await cancelDuel('duel-1')
    expect(result.success).toBe(true)
    expect(qb.update).toHaveBeenCalledWith({ status: 'expired' })
    expect(qb.eq).toHaveBeenCalledWith('id', 'duel-1')
    expect(qb.eq).toHaveBeenCalledWith('challenger', 'test-user-id')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  WEEKLY DUEL
// ═══════════════════════════════════════════════════════════════════════════════

describe('Weekly Duel', () => {
  it('getOrCreateWeeklyDuel returns existing', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult({ id: 'wd-1', pair_id: 'pair-1', week_start: '2026-06-15', user_a_xp: 50, user_b_xp: 30, winner_id: null, settled_at: null }, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const wd = await getOrCreateWeeklyDuel('pair-1')
    expect(wd).not.toBeNull()
    expect(wd!.user_a_xp).toBe(50)
  })

  it('getOrCreateWeeklyDuel creates new', async () => {
    // 1. Check for existing — null (not found)
    const { qb: checkQB, setResult: setCheck } = buildQBWithUpdate()
    setCheck(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(checkQB)

    // 2. settleWeeklyDuel — previous week check returns null (no previous duel to settle)
    const { qb: settleQB, setResult: setSettle } = buildQBWithUpdate()
    setSettle(null, null)
    mockSupabaseInstance.from.mockReturnValueOnce(settleQB)

    // 3. Insert new weekly duel
    const { qb: createQB, setResult: setCreate } = buildQBWithUpdate()
    setCreate({ id: 'wd-new', pair_id: 'pair-1', week_start: '2026-06-15', user_a_xp: 0, user_b_xp: 0, winner_id: null, settled_at: null }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(createQB)

    const wd = await getOrCreateWeeklyDuel('pair-1')
    expect(wd).not.toBeNull()
    expect(wd!.user_a_xp).toBe(0)
  })

  it('settleWeeklyDuel determines winner', async () => {
    const { qb: fetchQB, setResult: setFetch } = buildQBWithUpdate()
    // Previous week = 2026-06-08 (getWeekStart returns 2026-06-15, minus 7 days)
    setFetch({ id: 'wd-old', pair_id: 'pair-1', week_start: '2026-06-08', user_a_xp: 100, user_b_xp: 60, winner_id: null, settled_at: null }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(fetchQB)

    const { qb: pairQB, setResult: setPair } = buildQBWithUpdate()
    setPair({ user_a: 'test-user-id', user_b: 'friend-a' }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(pairQB)

    const { qb: updateQB, setResult: setUpdate } = buildQBWithUpdate()
    setUpdate([{ id: 'wd-old' }], null) // CAS muvaffaqiyatli — bitta qator yangilandi
    mockSupabaseInstance.from.mockReturnValueOnce(updateQB)

    const result = await settleWeeklyDuel('pair-1')
    expect(result.winnerId).toBe('test-user-id')
    expect(result.draw).toBe(false)
  })

  it('settleWeeklyDuel does not award bonus when already settled (CAS race)', async () => {
    const { qb: fetchQB, setResult: setFetch } = buildQBWithUpdate()
    setFetch({ id: 'wd-old', pair_id: 'pair-1', week_start: '2026-06-08', user_a_xp: 100, user_b_xp: 60, winner_id: null, settled_at: null }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(fetchQB)

    const { qb: pairQB, setResult: setPair } = buildQBWithUpdate()
    setPair({ user_a: 'test-user-id', user_b: 'friend-a' }, null)
    mockSupabaseInstance.from.mockReturnValueOnce(pairQB)

    // CAS update bo'sh massiv qaytaradi → boshqa chaqiruv allaqachon yakunlagan
    const { qb: updateQB, setResult: setUpdate } = buildQBWithUpdate()
    setUpdate([], null)
    mockSupabaseInstance.from.mockReturnValueOnce(updateQB)

    const result = await settleWeeklyDuel('pair-1')
    expect(result.winnerId).toBe('test-user-id')
    expect(mockAddXP).not.toHaveBeenCalled() // takror bonus berilmaydi
  })

  it('getWeeklyDuelWins returns count', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult(null, null, 5)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const wins = await getWeeklyDuelWins('test-user-id')
    expect(wins).toBe(5)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
//  DARS DUEL'I (Lesson Duel)
// ═══════════════════════════════════════════════════════════════════════════════

describe('lessonExercisesToDuelQuestions', () => {
  const exercises: DailyExercise[] = [
    { id: 1, type: 'multiple-choice', instruction: 'Choose', question: 'Q1', options: ['a', 'b', 'c', 'd'], correct: 'b', explanation: '' },
    { id: 2, type: 'fill-blank', instruction: 'Fill', question: 'Q2 ___', blanks: ['x'], explanation: '' },
    { id: 3, type: 'multiple-choice', instruction: 'Choose', question: 'Q3', options: ['p', 'q', 'r', 's'], correct: 's', explanation: '' },
  ]

  it('faqat multiple-choice mashqlarni oladi va correct indeksini topadi', () => {
    const qs = lessonExercisesToDuelQuestions(exercises)
    expect(qs).toHaveLength(2)
    expect(qs[0]).toEqual({ id: 1, english: 'Q1', options: ['a', 'b', 'c', 'd'], correct: 1 })
    expect(qs[1]).toEqual({ id: 3, english: 'Q3', options: ['p', 'q', 'r', 's'], correct: 3 })
  })

  it('max limitga rioya qiladi', () => {
    const qs = lessonExercisesToDuelQuestions(exercises, 1)
    expect(qs).toHaveLength(1)
  })

  it('correct javob options ichida bo\'lmasa o\'tkazib yuboradi', () => {
    const bad: DailyExercise[] = [
      { id: 1, type: 'multiple-choice', instruction: '', question: 'Q', options: ['a', 'b', 'c', 'd'], correct: 'z', explanation: '' },
    ]
    expect(lessonExercisesToDuelQuestions(bad)).toHaveLength(0)
  })
})

describe('createLessonDuel', () => {
  const questions = [
    { id: 1, english: 'Q1', options: ['a', 'b', 'c', 'd'], correct: 1 },
    { id: 2, english: 'Q2', options: ['p', 'q', 'r', 's'], correct: 0 },
    { id: 3, english: 'Q3', options: ['x', 'y', 'z', 'w'], correct: 2 },
  ]

  it('do\'st bilan dars duel yaratadi (lesson_id va lesson_title bilan)', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult({ id: 'duel-1', mode: 'lesson', lesson_id: 'simple-past', lesson_title: 'Simple Past' }, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await createLessonDuel('friend-1', 'simple-past', 'Simple Past', questions)
    expect(result.success).toBe(true)
    expect(qb.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        challenger: 'test-user-id',
        opponent: 'friend-1',
        mode: 'lesson',
        lesson_id: 'simple-past',
        lesson_title: 'Simple Past',
        is_bot: false,
      }),
    )
  })

  it('savol bo\'lmasa xato qaytaradi', async () => {
    const result = await createLessonDuel('friend-1', 'x', 'X', [])
    expect(result.success).toBe(false)
    expect(result.error).toContain('savol')
  })

  it('AI bot bilan duel (opponentId=null)', async () => {
    const { qb, setResult } = buildQBWithUpdate()
    setResult({ id: 'duel-2', mode: 'lesson', is_bot: true }, null)
    mockSupabaseInstance.from.mockReturnValue(qb)

    const result = await createLessonDuel(null, 'simple-past', 'Simple Past', questions)
    expect(result.success).toBe(true)
    expect(qb.insert).toHaveBeenCalledWith(expect.objectContaining({ is_bot: true, opponent: null }))
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
