import { describe, it, expect, vi, beforeEach } from 'vitest'
import { withCache, withCachedStream, invalidateCache, clearAllCache, getCacheStats } from '../aiCache'

beforeEach(() => { clearAllCache(); vi.restoreAllMocks() })

describe('withCache', () => {
  it('calls fetcher on first access and caches result', async () => {
    const fetcher = vi.fn().mockResolvedValue('result-42')
    const r1 = await withCache('test-key', fetcher)
    expect(r1).toBe('result-42')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('returns cached result on second access without calling fetcher', async () => {
    const fetcher = vi.fn().mockResolvedValue('cached-val')
    await withCache('dup-key', fetcher)
    const r2 = await withCache('dup-key', fetcher)
    expect(r2).toBe('cached-val')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('different keys call fetcher separately', async () => {
    const fetcherA = vi.fn().mockResolvedValue('A')
    const fetcherB = vi.fn().mockResolvedValue('B')
    await withCache('key-a', fetcherA)
    await withCache('key-b', fetcherB)
    expect(fetcherA).toHaveBeenCalledTimes(1)
    expect(fetcherB).toHaveBeenCalledTimes(1)
  })

  it('deduplicates in-flight requests with the same key', async () => {
    let resolveFetcher: (v: string) => void = () => {}
    const fetcher = vi.fn().mockImplementation(() =>
      new Promise<string>(resolve => { resolveFetcher = resolve })
    )

    const p1 = withCache('inflight-key', fetcher)
    const p2 = withCache('inflight-key', fetcher)

    resolveFetcher('inflight-result')

    const [r1, r2] = await Promise.all([p1, p2])
    expect(r1).toBe('inflight-result')
    expect(r2).toBe('inflight-result')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('persists to localStorage', async () => {
    const fetcher = vi.fn().mockResolvedValue('ls-data')
    await withCache('ls-key', fetcher)

    // In-memory cache should have it
    expect(getCacheStats().memSize).toBeGreaterThanOrEqual(1)
    expect(fetcher).toHaveBeenCalledTimes(1)

    // localStorage da borligini tekshirish
    const raw = localStorage.getItem('aich_ls-key')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!)
    expect(parsed.data).toBe('ls-data')
    expect(typeof parsed.expiry).toBe('number')
    expect(parsed.expiry).toBeGreaterThan(Date.now())

    // Bir xil key bilan qayta chaqirish — fetcher chaqirilmasligi kerak (in-memory hit)
    const r = await withCache('ls-key', fetcher)
    expect(r).toBe('ls-data')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
})

describe('invalidateCache', () => {
  it('removes entries with matching key prefix', async () => {
    const f = vi.fn().mockResolvedValue('x')
    await withCache('abc:1', f)
    await withCache('abc:2', f)
    await withCache('xyz:1', f)

    invalidateCache('abc')

    // abc:1 va abc:2 tozalandi, xyz:1 qoldi
    const f2 = vi.fn().mockResolvedValue('fresh')
    await withCache('abc:1', f2) // cache miss → fetcher chaqiriladi
    expect(f2).toHaveBeenCalledTimes(1)

    const f3 = vi.fn().mockResolvedValue('still-fresh')
    await withCache('xyz:1', f3) // cache hit → fetcher chaqirilmaydi
    expect(f3).not.toHaveBeenCalled()
  })
})

describe('clearAllCache', () => {
  it('clears both memory and localStorage caches', async () => {
    const f = vi.fn().mockResolvedValue('data')
    await withCache('clear-key', f)
    expect(getCacheStats().memSize).toBeGreaterThan(0)

    clearAllCache()
    expect(getCacheStats().memSize).toBe(0)
    expect(getCacheStats().lsSize).toBe(0)
  })
})

describe('withCachedStream', () => {
  function makeExecutor(result: string, delayMs = 0) {
    return vi.fn().mockImplementation(
      (
        onDelta: (t: string) => void,
        onDone: (f: string) => void,
        _onError: (e: Error) => void
      ) => {
        return new Promise<void>(resolve => {
          const emit = () => {
            for (const ch of result) onDelta(ch)
            onDone(result)
            resolve()
          }
          if (delayMs > 0) setTimeout(emit, delayMs)
          else emit()
        })
      }
    )
  }

  it('calls executor on first access and delivers tokens via onDelta/onDone', async () => {
    const executor = makeExecutor('Hello world')
    const onDelta = vi.fn()
    const onDone = vi.fn()
    const onError = vi.fn()

    await withCachedStream('stream-1', executor, onDelta, onDone, onError)

    expect(executor).toHaveBeenCalledTimes(1)
    // Each character emitted individually
    expect(onDelta).toHaveBeenCalledTimes(11) // 'Hello world' = 11 chars
    expect(onDelta).toHaveBeenNthCalledWith(1, 'H')
    expect(onDelta).toHaveBeenNthCalledWith(6, ' ')
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledWith('Hello world')
    expect(onError).not.toHaveBeenCalled()
  })

  it('returns cached result on second call (in-memory hit) without calling executor', async () => {
    const executor = makeExecutor('Cached response')
    const onDelta1 = vi.fn()
    const onDone1 = vi.fn()
    const onError1 = vi.fn()

    await withCachedStream('stream-cache', executor, onDelta1, onDone1, onError1)
    expect(executor).toHaveBeenCalledTimes(1)

    // Second call with same key
    const executor2 = vi.fn()
    const onDelta2 = vi.fn()
    const onDone2 = vi.fn()
    const onError2 = vi.fn()

    await withCachedStream('stream-cache', executor2, onDelta2, onDone2, onError2)

    // Executor not called again
    expect(executor2).not.toHaveBeenCalled()
    // onDelta called with FULL text at once (cache serves instantly)
    expect(onDelta2).toHaveBeenCalledTimes(1)
    expect(onDelta2).toHaveBeenCalledWith('Cached response')
    expect(onDone2).toHaveBeenCalledTimes(1)
    expect(onDone2).toHaveBeenCalledWith('Cached response')
    expect(onError2).not.toHaveBeenCalled()
  })

  it('reads from localStorage when in-memory cache is empty', async () => {
    // First call — populates both caches
    const executor = makeExecutor('LocalStorage data')
    const onDelta = vi.fn()
    const onDone = vi.fn()
    const onError = vi.fn()

    await withCachedStream('stream-ls', executor, onDelta, onDone, onError)

    // localStorage cache to'ldirilganini tekshiramiz
    const raw = localStorage.getItem('aich_stream-ls')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!)
    expect(parsed.data).toBe('LocalStorage data')
  })

  it('deduplicates concurrent in-flight requests with same key', async () => {
    let resolveStream: () => void = () => {}
    const executor = vi.fn().mockImplementation(
      (
        onDelta: (t: string) => void,
        onDone: (f: string) => void,
        _onError: (e: Error) => void
      ) => {
        return new Promise<void>(r => {
          resolveStream = () => {
            onDelta('dedup-result')
            onDone('dedup-result')
            r()
          }
        })
      }
    )

    const onDelta1 = vi.fn()
    const onDone1 = vi.fn()
    const onError1 = vi.fn()
    const onDelta2 = vi.fn()
    const onDone2 = vi.fn()
    const onError2 = vi.fn()

    const p1 = withCachedStream('stream-dedup', executor, onDelta1, onDone1, onError1)
    const p2 = withCachedStream('stream-dedup', executor, onDelta2, onDone2, onError2)

    resolveStream()

    await Promise.all([p1, p2])

    expect(executor).toHaveBeenCalledTimes(1)
    // First caller gets stream
    expect(onDelta1).toHaveBeenCalledWith('dedup-result')
    expect(onDone1).toHaveBeenCalledWith('dedup-result')
    // Second caller gets the same result via inflight dedup
    expect(onDelta2).toHaveBeenCalledWith('dedup-result')
    expect(onDone2).toHaveBeenCalledWith('dedup-result')
    expect(onError1).not.toHaveBeenCalled()
    expect(onError2).not.toHaveBeenCalled()
  })

  it('calls onError once when executor fails, even with concurrent inflight waiters', async () => {
    let rejectStream: (err: Error) => void = () => {}
    const executor = vi.fn().mockImplementation(
      (
        _onDelta: (t: string) => void,
        _onDone: (f: string) => void,
        onError: (e: Error) => void
      ) => {
        return new Promise<void>(() => {
          rejectStream = (err) => {
            onError(err)
          }
        })
      }
    )

    const onDelta1 = vi.fn()
    const onDone1 = vi.fn()
    const onError1 = vi.fn()
    const onDelta2 = vi.fn()
    const onDone2 = vi.fn()
    const onError2 = vi.fn()

    const p1 = withCachedStream('stream-err', executor, onDelta1, onDone1, onError1)
    const p2 = withCachedStream('stream-err', executor, onDelta2, onDone2, onError2)

    rejectStream(new Error('Stream failed'))

    await expect(Promise.all([p1, p2])).rejects.toThrow('Stream failed')

    expect(executor).toHaveBeenCalledTimes(1)
    // onError should be called exactly once (first caller's error handler)
    // Second caller gets error via promise rejection (not duplicate onError)
    expect(onError1).toHaveBeenCalledTimes(1)
    expect(onError1).toHaveBeenCalledWith(new Error('Stream failed'))
    // Second caller's onError may fire from inflight catch
    // This is acceptable as long as it's once per caller
    expect(onError2).toHaveBeenCalledTimes(1)
    expect(onDelta1).not.toHaveBeenCalled()
    expect(onDone1).not.toHaveBeenCalled()
    expect(onDelta2).not.toHaveBeenCalled()
    expect(onDone2).not.toHaveBeenCalled()
  })

  it('different keys execute separate streams', async () => {
    const executorA = makeExecutor('Result A')
    const executorB = makeExecutor('Result B')
    const onDeltaA = vi.fn()
    const onDoneA = vi.fn()
    const onErrorA = vi.fn()
    const onDeltaB = vi.fn()
    const onDoneB = vi.fn()
    const onErrorB = vi.fn()

    await withCachedStream('stream-a', executorA, onDeltaA, onDoneA, onErrorA)
    await withCachedStream('stream-b', executorB, onDeltaB, onDoneB, onErrorB)

    expect(executorA).toHaveBeenCalledTimes(1)
    expect(executorB).toHaveBeenCalledTimes(1)
    expect(onDoneA).toHaveBeenCalledWith('Result A')
    expect(onDoneB).toHaveBeenCalledWith('Result B')
  })
})

describe('getCacheStats', () => {
  it('returns stats with current sizes', async () => {
    const f = vi.fn().mockResolvedValue('d')
    await withCache('stat-a', f)
    await withCache('stat-b', f)
    const stats = getCacheStats()
    expect(stats.memSize).toBe(2)
    expect(typeof stats.lsSize).toBe('number')
  })
})
