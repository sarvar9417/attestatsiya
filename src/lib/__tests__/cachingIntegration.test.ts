import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clearAllCache } from '../aiCache'
import { startScenarioConversation } from '../claude'

// ── Mock streaming fetch ──────────────────────────────────────────────────
// Simulates an SSE streaming response with delay between chunks

function makeFetchMock(blocks: string[]) {
  return vi.fn().mockImplementation(async () => {
    return {
      ok: true,
      body: {
        getReader() {
          let i = 0
          const encoder = new TextEncoder()
          return {
            read() {
              if (i >= blocks.length) return Promise.resolve({ done: true, value: undefined })
              const chunk = `data: ${JSON.stringify({ type: 'content_block_delta', delta: { type: 'text_delta', text: blocks[i] } })}\n\n`
              i++
              return Promise.resolve({ done: false, value: encoder.encode(chunk) })
            },
            cancel() {},
            releaseLock() {},
          }
        },
      },
    } as Response
  })
}

const SCENARIO = {
  aiRole: 'a waiter',
  userRole: 'a customer',
  opening: 'Welcome to our restaurant!',
  title: 'At the Restaurant',
}

const level = 'B1'
const history: { role: 'user' | 'assistant'; content: string }[] = []

beforeEach(() => {
  vi.clearAllMocks()
  clearAllCache()
})

describe('startScenarioConversation streaming caching', () => {
  it('caches response so second call with same params uses cache instead of fetch', async () => {
    const fetchMock = makeFetchMock(['Hello', ' ', 'there', '!'])
    vi.stubGlobal('fetch', fetchMock)

    // First call — should trigger a real fetch
    const delta1: string[] = []
    const done1: string[] = []
    const err1: Error[] = []

    await startScenarioConversation(
      SCENARIO, level, history,
      (t) => { delta1.push(t) },
      (f) => { done1.push(f) },
      (e) => { err1.push(e) },
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(done1).toEqual(['Hello there!'])
    expect(err1).toHaveLength(0)

    // Second call — same params → should NOT call fetch, should use cached result
    const delta2: string[] = []
    const done2: string[] = []
    const err2: Error[] = []

    await startScenarioConversation(
      SCENARIO, level, history,
      (t) => { delta2.push(t) },
      (f) => { done2.push(f) },
      (e) => { err2.push(e) },
    )

    // No additional fetch call
    expect(fetchMock).toHaveBeenCalledTimes(1)

    // Cached result delivered — onDelta gets full text at once (not chunked)
    expect(delta2).toEqual(['Hello there!'])
    expect(done2).toEqual(['Hello there!'])
    expect(err2).toHaveLength(0)
  })

  it('different history produces different cache key and calls fetch again', async () => {
    const fetchMock = makeFetchMock(['First ', 'response'])
    vi.stubGlobal('fetch', fetchMock)

    // First call with empty history
    await startScenarioConversation(
      SCENARIO, level, [],
      () => {}, () => {}, () => {},
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)

    // Second call with different history
    await startScenarioConversation(
      SCENARIO, level,
      [{ role: 'user' as const, content: 'Hello' }],
      () => {}, () => {}, () => {},
    )

    // Should call fetch again because history differs
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('different scenario title produces different cache key', async () => {
    const fetchMock = makeFetchMock(['Response A'])
    vi.stubGlobal('fetch', fetchMock)

    // First scenario
    await startScenarioConversation(
      { ...SCENARIO, title: 'Scenario A' }, level, history,
      () => {}, () => {}, () => {},
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)

    // Different scenario title
    await startScenarioConversation(
      { ...SCENARIO, title: 'Scenario B' }, level, history,
      () => {}, () => {}, () => {},
    )

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('different level produces different cache key', async () => {
    const fetchMock = makeFetchMock(['Response'])
    vi.stubGlobal('fetch', fetchMock)

    // Level A2
    await startScenarioConversation(
      SCENARIO, 'A2', history,
      () => {}, () => {}, () => {},
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)

    // Different level
    await startScenarioConversation(
      SCENARIO, 'B2', history,
      () => {}, () => {}, () => {},
    )

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
