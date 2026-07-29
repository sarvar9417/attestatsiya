// AI caching utility — in-memory + localStorage cache with TTL and in-flight deduplication
// Har bir AI chaqiruvi: cache key = funksiya nomi + argument hash
// TTL: 5 daqiqa (in-memory), 30 daqiqa (localStorage)

import { monitoring } from './monitoring'

const MEM_TTL_MS = 5 * 60 * 1000
const LS_TTL_MS = 30 * 60 * 1000
const LS_PREFIX = 'aich_'
const CLEANUP_INTERVAL = 60_000

// ── In-memory cache ─────────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T
  expiry: number
}

const memCache = new Map<string, CacheEntry<unknown>>()
const inflight = new Map<string, Promise<unknown>>()

// Periodic cleanup
let cleanupIntervalId: ReturnType<typeof setInterval> | undefined
if (typeof window !== 'undefined') {
  cleanupIntervalId = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of memCache) {
      if (now > entry.expiry) memCache.delete(key)
    }
  }, CLEANUP_INTERVAL)
}

/** Cleanup interval — hot-reload yoki test cleanup uchun */
export function destroyCache(): void {
  if (cleanupIntervalId !== undefined) {
    clearInterval(cleanupIntervalId)
    cleanupIntervalId = undefined
  }
}

// Vite HMR: modul hot-reloaded bo'lganda eski intervalni tozalaymiz
if (import.meta.hot) {
  import.meta.hot.dispose(() => destroyCache())
}

// ── localStorage cache ──────────────────────────────────────────────────────

function lsKey(k: string): string { return LS_PREFIX + k }

function lsGet<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(lsKey(key))
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as { data: T; expiry: number }
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(lsKey(key))
      return undefined
    }
    return parsed.data
  } catch (e) {
    monitoring.captureMessage('aiCache get failed (parse error): ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return undefined
  }
}

function lsSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(lsKey(key), JSON.stringify({ data, expiry: Date.now() + LS_TTL_MS }))
  } catch (e) {
    monitoring.captureMessage('aiCache set failed (quota?), clearing old entries: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    // localStorage full bo'lsa — eng eski entry larni tozalaymiz
    try {
      const keys: { k: string; t: number }[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k?.startsWith(LS_PREFIX)) {
          try {
            const parsed = JSON.parse(localStorage.getItem(k)!)
            keys.push({ k, t: parsed.expiry || 0 })
          } catch (e) {
            monitoring.captureMessage('aiCache cleanup parse error: ' + (e instanceof Error ? e.message : String(e)), 'warn')
            /* skip */ }
        }
      }
      keys.sort((a, b) => a.t - b.t)
      for (const { k } of keys.slice(0, Math.max(1, Math.floor(keys.length * 0.3)))) {
        localStorage.removeItem(k)
      }
      localStorage.setItem(lsKey(key), JSON.stringify({ data, expiry: Date.now() + LS_TTL_MS }))
    } catch (e) {
      monitoring.captureMessage('aiCache set failed (give up): ' + (e instanceof Error ? e.message : String(e)), 'warn')
      /* give up */ }
  }
}

export function invalidateCache(keyPrefix: string): void {
  for (const k of memCache.keys()) {
    if (k.startsWith(keyPrefix)) memCache.delete(k)
  }
  // localStorage ni prefix bo'yicha tozalash
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i)
    const storedKey = k?.startsWith(LS_PREFIX) ? k.slice(LS_PREFIX.length) : null
    if (storedKey?.startsWith(keyPrefix)) {
      localStorage.removeItem(k!)
    }
  }
}

/** Clear all AI cache */
export function clearAllCache(): void {
  memCache.clear()
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i)
    if (k?.startsWith(LS_PREFIX)) localStorage.removeItem(k!)
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Cache bilan o'ralgan async funksiya.
 * 1) In-memory dan tekshiradi (agar topilsa → qaytaradi)
 * 2) localStorage dan tekshiradi (agar topilsa → in-memory ga ko'chiradi va qaytaradi)
 * 3) Agar ayni shu key bilan chaqiruv ketayotgan bo'lsa (in-flight), uning natijasini kutadi
 * 4) Aks holda fetcher() ni chaqiradi, natijani ikkala cache ga yozadi va qaytaradi
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = MEM_TTL_MS,
): Promise<T> {
  // 1. In-memory
  const memHit = memCache.get(key)
  if (memHit && Date.now() < memHit.expiry) {
    return memHit.data as T
  }

  // 2. localStorage
  const lsHit = lsGet<T>(key)
  if (lsHit !== undefined) {
    memCache.set(key, { data: lsHit, expiry: Date.now() + ttlMs })
    return lsHit
  }

  // 3. In-flight dedup
  const pending = inflight.get(key)
  if (pending) return pending as Promise<T>

  // 4. Haqiqiy chaqiruv
  const promise = fetcher()
    .then((data) => {
      memCache.set(key, { data, expiry: Date.now() + ttlMs })
      lsSet(key, data)
      return data
    })
    .finally(() => {
      if (inflight.get(key) === promise) inflight.delete(key)
    })

  inflight.set(key, promise)
  return promise
}

// ── Streaming cache ────────────────────────────────────────────────────────

const inflightStreams = new Map<string, Promise<string>>()

/**
 * Streaming (callback-based) AI funksiyalari uchun cache + in-flight dedup.
 *
 * 1) Agar to'liq javob allaqachon cache da bo'lsa → onDelta(full) + onDone(full)
 * 2) Agar ayni shu key bilan chaqiruv ketayotgan bo'lsa → natijani kutadi
 * 3) Aks holda streamExecutorni chaqiradi, to'liq javobni accumulyatsiya qiladi,
 *    cache ga yozadi va onDone orqali qaytaradi
 */
export async function withCachedStream(
  key: string,
  executor: (
    onDelta: (token: string) => void,
    onDone: (full: string) => void,
    onError: (err: Error) => void
  ) => Promise<void>,
  onDelta: (token: string) => void,
  onDone: (full: string) => void,
  onError: (err: Error) => void
): Promise<void> {
  // 1. In-memory cache
  const memHit = memCache.get(key)
  if (memHit && Date.now() < memHit.expiry) {
    const text = memHit.data as string
    onDelta(text)
    onDone(text)
    return
  }

  // 2. localStorage cache
  const lsHit = lsGet<string>(key)
  if (lsHit !== undefined) {
    memCache.set(key, { data: lsHit, expiry: Date.now() + MEM_TTL_MS })
    onDelta(lsHit)
    onDone(lsHit)
    return
  }

  // Guard — onError faqat bir marta chaqiriladi (in-flight dedup + stream error conflict)
  let errorFired = false
  let guardOnError: (err: Error) => void = (err) => {
    if (errorFired) return
    errorFired = true
    inflightStreams.delete(key)
    onError(err)
  }

  // 3. In-flight dedup
  const pending = inflightStreams.get(key)
  if (pending) {
    try {
      const text = await pending
      guardOnError = () => {} // inflight succeeded, no error to guard
      onDelta(text)
      onDone(text)
    } catch (err) {
      guardOnError(err as Error)
      throw err // consistent: both callers reject on error
    }
    return
  }

  // 4. Haqiqiy stream chaqiruvi
  const promise = new Promise<string>((resolve, reject) => {
    let full = ''
    executor(
      (token) => {
        full += token
        onDelta(token)
      },
      (fullText) => {
        const result = fullText || full
        memCache.set(key, { data: result, expiry: Date.now() + MEM_TTL_MS })
        lsSet(key, result)
        onDone(result)
        resolve(result)
      },
      (err) => {
        guardOnError(err)
        reject(err)
      }
    )
  }).finally(() => {
    if (inflightStreams.get(key) === promise) inflightStreams.delete(key)
  })

  inflightStreams.set(key, promise)
  await promise
}

// ── Monitoring (cache hit/miss track) ──────────────────────────────────────

export interface CacheStats {
  memSize: number
  lsSize: number
}

export function getCacheStats(): CacheStats {
  let lsCount = 0
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i)?.startsWith(LS_PREFIX)) lsCount++
  }
  return {
    memSize: memCache.size,
    lsSize: lsCount,
  }
}
