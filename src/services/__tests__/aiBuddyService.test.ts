// ═══════════════════════════════════════════════════════════════════════════
// aiBuddyService.test.ts — AI Study Buddy (Claude proxy) testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../lib/monitoring', () => ({ monitoring: { captureMessage: vi.fn() } }))
vi.mock('../../store/useStore', () => ({
  useStore: {
    getState: () => ({
      userName: '', currentLevel: 'B1', currentDay: 5, streak: 3,
      totalXP: 100, todayXP: 10, weeklyXP: 50, todayMinutes: 20, totalWordsLearned: 200,
    }),
  },
}))

import { generateDailyTip, chatWithBuddy, getContextFromStore, type BuddyContext } from '../aiBuddyService'

const ctx: BuddyContext = {
  userName: 'Ali', currentLevel: 'B1', currentDay: 5, streak: 3,
  totalXP: 100, todayXP: 10, weeklyXP: 50, todayMinutes: 20, totalWordsLearned: 200,
}

// SSE stream javobini soxtalashtirish
function streamResponse(chunks: string[]) {
  let i = 0
  return {
    ok: true,
    body: {
      getReader: () => ({
        read: async () =>
          i < chunks.length
            ? { done: false, value: new TextEncoder().encode(chunks[i++]) }
            : { done: true, value: undefined },
      }),
    },
  } as unknown as Response
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('generateDailyTip', () => {
  it('returns AI text on success', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ type: 'text', text: '💡 Drill prepositions today!' }] }),
    })
    const tip = await generateDailyTip(ctx)
    expect(tip).toBe('💡 Drill prepositions today!')
  })

  it('falls back when proxy errors', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false, statusText: 'fail', json: async () => ({ error: 'boom' }),
    })
    const tip = await generateDailyTip(ctx)
    expect(tip).toContain("Today's Tip")           // fallback shabloni
    expect(tip).toContain('3-day streak')          // ctx.streak ishlatilgan
  })

  it('falls back when response has no text block', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true, json: async () => ({ content: [{ type: 'tool_use' }] }),
    })
    const tip = await generateDailyTip(ctx)
    expect(tip).toContain("Today's Tip")
  })
})

describe('chatWithBuddy (streaming)', () => {
  it('emits deltas and final text', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(streamResponse([
      'data: {"delta":{"text":"Hello"}}\n',
      'data: {"delta":{"text":" there"}}\n',
      'data: [DONE]\n',
    ]))

    const deltas: string[] = []
    let full = ''
    const onError = vi.fn()
    await chatWithBuddy(ctx, [{ role: 'user', content: 'hi' }], t => deltas.push(t), f => { full = f }, onError)

    expect(deltas).toEqual(['Hello', ' there'])
    expect(full).toBe('Hello there')
    expect(onError).not.toHaveBeenCalled()
  })

  it('calls onError when proxy returns non-ok', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false, statusText: 'bad', json: async () => ({ error: 'denied' }),
    })
    const onError = vi.fn()
    const onDone = vi.fn()
    await chatWithBuddy(ctx, [{ role: 'user', content: 'hi' }], () => {}, onDone, onError)
    expect(onError).toHaveBeenCalled()
    expect(onDone).not.toHaveBeenCalled()
  })
})

describe('getContextFromStore', () => {
  it('maps store state and defaults empty name to "Student"', async () => {
    const res = await getContextFromStore()
    expect(res?.userName).toBe('Student')   // bo'sh ism → default
    expect(res?.currentLevel).toBe('B1')
    expect(res?.totalWordsLearned).toBe(200)
  })
})
