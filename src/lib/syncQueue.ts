/**
 * syncQueue.ts — Offline Sync Queue
 *
 * Markazlashtirilgan offline-navbat tizimi. Agar Supabase chaqiruvi muvaffaqiyatsiz
 * bo'lsa (offline yoki tarmoq xatosi), operatsiya IndexedDB ga saqlanadi va
 * internet ulanganda avtomatik qayta uriniladi.
 *
 * Prinsiplar:
 * - Har bir operatsiya SyncQueueItem sifatida Dexie ga yoziladi
 * - Process: eng yuqori priority → eng eski → navbatma-navbat bajariladi
 * - Exponential backoff: 1s → 2s → 4s → 8s ... (maksimal 60 soniya)
 * - Max retries: default 10 (keyin o'tkazib yuboriladi)
 * - Process bir vaqtda faqat 1 marta ishlaydi (race condition oldini olish)
 */
import { monitoring } from './monitoring'
import { supabase } from './supabase'
import { db } from '../db/database'
import type { SyncQueueItem } from '../db/database'
import type { Database } from '../types/supabase'

/** Supabase table name type — SyncQueueItem.table runtime string'ni cast qilish uchun */
type TableName = keyof Database['public']['Tables']

// ─── Konfiguratsiya ─────────────────────────────────────────────────────────

const DEFAULT_MAX_RETRIES = 10
const BACKOFF_BASE_MS = 1000
const BACKOFF_MAX_MS = 60_000

// ─── Queue ga qo'shish ──────────────────────────────────────────────────────

export interface QueueItemInput {
  table: string
  operation: SyncQueueItem['operation']
  data: Record<string, unknown>
  conflictField?: string
  filterField?: string
  filterValue?: unknown
  priority?: number
  maxRetries?: number
}

/**
 * Sync queue ga yangi element qo'shadi.
 * Bu funksiya hech qachon throw qilmaydi — faqat monitoring ga yozadi.
 */
export async function addToSyncQueue(input: QueueItemInput): Promise<void> {
  try {
    await db.syncQueue.add({
      table: input.table,
      operation: input.operation,
      data: input.data,
      conflictField: input.conflictField,
      filterField: input.filterField,
      filterValue: input.filterValue,
      priority: input.priority ?? 0,
      retries: 0,
      maxRetries: input.maxRetries ?? DEFAULT_MAX_RETRIES,
      lastError: null,
      createdAt: Date.now(),
      nextRetryAt: Date.now(), // Darhol urinib ko'rish mumkin
    })
  } catch (e) {
    monitoring.captureMessage(
      'syncQueue: add failed: ' + (e instanceof Error ? e.message : String(e)),
      'error',
    )
  }
}

// ─── Queue ni qayta ishlash ─────────────────────────────────────────────────

let isProcessing = false

/**
 * Navbatdagi barcha elementlarni qayta ishlaydi.
 * Avtomatik chaqiriladi (online listener orqali) yoki qo'lda chaqirish mumkin.
 *
 * Process logikasi:
 * 1. nextRetryAt <= now bo'lgan elementlarni top (priority bo'yicha)
 * 2. Har birini navbatma-navbat supabase ga yubor
 * 3. Muvaffaqiyat → o'chir
 * 4. Xato → retries++, nextRetryAt ni exponential backoff bilan yangila
 * 5. maxRetries dan oshsa → o'chir (va monitoring ga yoz)
 */
export async function processSyncQueue(): Promise<void> {
  if (isProcessing) return
  isProcessing = true

  let processedCount = 0
  let errorCount = 0

  try {
    const now = Date.now()

    // Eng yuqori priority, eng eski elementlarni olish
    const items = await db.syncQueue
      .where('nextRetryAt')
      .belowOrEqual(now)
      .sortBy('priority') // priority bo'yicha (past = yuqori priority)

    for (const item of items) {
      if (!item.id) continue

      try {
        await executeSyncItem(item)
        await db.syncQueue.delete(item.id)
        processedCount++
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e)

        if (item.retries >= item.maxRetries) {
          // Max urinish — o'chirib, monitoring ga yoz
          await db.syncQueue.delete(item.id)
          monitoring.captureMessage(
            `syncQueue: max retries (${item.maxRetries}) for ${item.table}/${item.operation}: ${errMsg}`,
            'warn',
          )
        } else {
          // Exponential backoff bilan keyingi urinish
          const delay = Math.min(
            BACKOFF_BASE_MS * Math.pow(2, item.retries),
            BACKOFF_MAX_MS,
          )
          await db.syncQueue.update(item.id, {
            retries: item.retries + 1,
            lastError: errMsg,
            nextRetryAt: Date.now() + delay,
          })
          errorCount++
        }
      }
    }
  } catch (e) {
    monitoring.captureMessage(
      'syncQueue: process failed: ' + (e instanceof Error ? e.message : String(e)),
      'error',
    )
  } finally {
    isProcessing = false
  }

  if (processedCount > 0 || errorCount > 0) {
    monitoring.captureMessage(
      `syncQueue: processed=${processedCount} errors=${errorCount} remaining=${await getQueueLength()}`,
      'info',
    )
  }
}

// ─── Bitta elementni bajarish ────────────────────────────────────────────────

async function executeSyncItem(item: SyncQueueItem): Promise<void> {
  const qb = supabase.from(item.table as TableName)

  switch (item.operation) {
    case 'upsert': {
      const { error } = await qb.upsert(item.data as any, {
        onConflict: item.conflictField ?? undefined,
      })
      if (error) throw error
      break
    }

    case 'insert': {
      const { error } = await qb.insert(item.data as any)
      if (error) throw error
      break
    }

    case 'update': {
      if (!item.filterField || item.filterValue === undefined) {
        throw new Error('update requires filterField and filterValue')
      }
      const { error } = await qb
        .update(item.data as any)
        .eq(item.filterField as string, item.filterValue as any)
      if (error) throw error
      break
    }

    case 'delete': {
      if (!item.filterField || item.filterValue === undefined) {
        throw new Error('delete requires filterField and filterValue')
      }
      const { error } = await qb
        .delete()
        .eq(item.filterField as string, item.filterValue as any)
      if (error) throw error
      break
    }

    default:
      throw new Error(`Unknown operation: ${item.operation}`)
  }
}

// ─── Queue status ────────────────────────────────────────────────────────────

export interface SyncQueueStatus {
  length: number
  isProcessing: boolean
  items: Array<{
    id: number
    table: string
    operation: string
    priority: number
    retries: number
    maxRetries: number
    lastError: string | null
    createdAt: number
    nextRetryAt: number
  }>
}

/** Queue dagi elementlar soni */
export async function getQueueLength(): Promise<number> {
  try {
    return await db.syncQueue.count()
  } catch {
    return 0
  }
}

/** Queue holati (debaging uchun) */
export async function getQueueStatus(): Promise<SyncQueueStatus> {
  try {
    const items = await db.syncQueue.toArray()
    return {
      length: items.length,
      isProcessing,
      items: items.map((i) => ({
        id: i.id!,
        table: i.table,
        operation: i.operation,
        priority: i.priority,
        retries: i.retries,
        maxRetries: i.maxRetries,
        lastError: i.lastError,
        createdAt: i.createdAt,
        nextRetryAt: i.nextRetryAt,
      })),
    }
  } catch {
    return { length: 0, isProcessing: false, items: [] }
  }
}

/** Queue ni tozalash (masalan, chiqishda) */
export async function clearSyncQueue(): Promise<void> {
  try {
    await db.syncQueue.clear()
  } catch (e) {
    monitoring.captureMessage(
      'syncQueue: clear failed: ' + (e instanceof Error ? e.message : String(e)),
      'warn',
    )
  }
}

// ─── Online listener — internet ulanganda avtomatik sync ─────────────────────

let listenerInitialized = false

/**
 * Online/offline listener ni ishga tushiradi.
 * Internet ulanganda avtomatik processSyncQueue() chaqiradi.
 * App boshida 1 marta chaqiriladi.
 */
export function initSyncQueueListener(): void {
  if (listenerInitialized) return
  listenerInitialized = true

  const handleOnline = () => {
    monitoring.captureMessage('syncQueue: Online detected — processing queue...', 'info')
    processSyncQueue()
  }

  window.addEventListener('online', handleOnline)

  // App boshlanganda ham bir marta urinib ko'ramiz
  if (navigator.onLine) {
    setTimeout(() => processSyncQueue(), 1000) // 1s kechikish — app yuklanishi uchun
  }

  // Cleanup (optional, agar hot-reload bo'lsa)
  const cleanup = () => window.removeEventListener('online', handleOnline)

  // Agar Vite HMR bo'lsa, oldingi listenerlarni tozalaymiz
  if (import.meta.hot) {
    import.meta.hot.dispose(cleanup)
  }
}
