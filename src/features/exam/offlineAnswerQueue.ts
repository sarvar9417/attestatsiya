import { sessionStore } from '../auth/sessionStore'
import { isNetworkError } from '../../lib/apiClient'
import type { SubmitAnswerResponse } from './contracts'
import type { SubmitAnswerInput } from './examGateway'

const STORAGE_KEY = 'attestatsiya:exam:pending-answers:v2'
const MAX_PENDING_ANSWERS = 200

export interface PendingAnswer extends SubmitAnswerInput {
  queuedAt: string
}

export interface FlushPendingAnswersResult {
  flushed: number
  remaining: number
  stoppedByNetwork: boolean
  rejected?: string[]
}

type AnswerSender = (input: SubmitAnswerInput) => Promise<SubmitAnswerResponse>

function storage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    // Privacy mode / browser policies can disable even reading the property.
    return null
  }
}

function isPendingAnswer(value: unknown): value is PendingAnswer {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<PendingAnswer>
  return (
    typeof item.examId === 'string' &&
    typeof item.questionId === 'string' &&
    typeof item.examKind === 'string' &&
    typeof item.timeSpentSec === 'number' &&
    typeof item.queuedAt === 'string' &&
    'answer' in item
  )
}

function readQueue(ownerId = sessionStore.get()?.user.id): PendingAnswer[] {
  if (!ownerId) return []
  const target = storage()
  if (!target) return []

  try {
    const raw = target.getItem(`${STORAGE_KEY}:${ownerId}`)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isPendingAnswer).slice(0, MAX_PENDING_ANSWERS)
  } catch {
    return []
  }
}

function writeQueue(queue: readonly PendingAnswer[], ownerId = sessionStore.get()?.user.id): void {
  if (!ownerId) throw new Error('Javobni saqlash uchun hisobga kiring.')
  const target = storage()
  if (queue.length === 0) {
    // Clearing an already empty queue must not interrupt an online save.
    try { target?.removeItem(`${STORAGE_KEY}:${ownerId}`) } catch { /* storage unavailable */ }
    return
  }
  if (!target) {
    throw new Error('Brauzer xotirasi bloklangan. Javob qurilmada saqlanmadi.')
  }
  try {
    target.setItem(`${STORAGE_KEY}:${ownerId}`, JSON.stringify(queue))
  } catch {
    // Never claim an offline answer was saved when quota/storage denied it.
    throw new Error('Brauzer xotirasiga javobni yozib bo‘lmadi. Javob qurilmada saqlanmadi.')
  }
}

function queueIdentity(input: Pick<SubmitAnswerInput, 'examId' | 'questionId'>): string {
  return `${input.examId}:${input.questionId}`
}

/** Latest answer wins for every unfinished test; old in-flight acks cannot
 * drop a more recent local edit. */
export function enqueuePendingAnswer(
  input: SubmitAnswerInput, ownerId = sessionStore.get()?.user.id
): PendingAnswer {
  const queue = readQueue(ownerId)
  const identity = queueIdentity(input)
  const existing = queue.find(item => queueIdentity(item) === identity)
  if (existing) {
    const pending: PendingAnswer = { ...input, queuedAt: new Date().toISOString() }
    writeQueue(queue.map(item => queueIdentity(item) === identity ? pending : item), ownerId)
    return pending
  }

  if (queue.length >= MAX_PENDING_ANSWERS) {
    throw new Error('Saqlanmagan javoblar navbati to‘ldi. Internetga ulanib qayta urining.')
  }
  const pending: PendingAnswer = {
    ...input,
    queuedAt: new Date().toISOString(),
  }
  writeQueue([...queue, pending], ownerId)
  return pending
}

export function listPendingAnswers(): PendingAnswer[] {
  return readQueue()
}

/** Only acknowledge the exact payload sent; edits during an in-flight
 * request must never be deleted by the older response. */
export function acknowledgePendingAnswer(
  sent: PendingAnswer,
  ownerId = sessionStore.get()?.user.id,
): boolean {
  const queue = readQueue(ownerId)
  const current = queue.find(item => queueIdentity(item) === queueIdentity(sent))
  if (!current) return true
  if (current.queuedAt !== sent.queuedAt ||
      JSON.stringify(current.answer) !== JSON.stringify(sent.answer)) return false
  writeQueue(queue.filter(item => queueIdentity(item) !== queueIdentity(sent)), ownerId)
  return true
}

export function clearPendingAnswers(): void {
  writeQueue([])
}

export function removePendingAnswer(examId: string, questionId: string, ownerId = sessionStore.get()?.user.id): void {
  const identity = `${examId}:${questionId}`
  writeQueue(readQueue(ownerId).filter(item => queueIdentity(item) !== identity), ownerId)
}

/**
 * Navbatni ketma-ket yuboradi. Tarmoq yana uzilsa darhol to'xtaydi va
 * qolgan elementlar localStorage'da qoladi. Server terminal javob qaytarsa
 * (sinov tugagan/vaqt tugagan) element qayta yuborilmasligi uchun navbatdan
 * chiqariladi.
 */
export async function flushPendingAnswers(
  sender: AnswerSender,
  examId?: string,
): Promise<FlushPendingAnswersResult> {
  const ownerId = sessionStore.get()?.user.id
  const forExam = (item: PendingAnswer) => !examId || item.examId === examId
  let flushed = 0
  let stoppedByNetwork = false
  const rejected: string[] = []

  // A mock choice can be edited while a prior revision is in flight.
  // Re-read the queue to send the last edit without discarding it.
  // Bound one call so continuously edited questions cannot block the UI.
  for (let pass = 0; pass < 8; pass += 1) {
    const snapshot = readQueue(ownerId).filter(forExam)
    if (snapshot.length === 0) break
    let revisedDuringSend = false
    for (const pending of snapshot) {
    if (sessionStore.get()?.user.id !== ownerId) break
    try {
      const response = await sender(pending)
      if ('saved' in response || 'error' in response) {
        if (acknowledgePendingAnswer(pending, ownerId)) {
          flushed += 1
          if ('error' in response) rejected.push(pending.questionId)
        } else revisedDuringSend = true
      }
    } catch (error) {
      if (isNetworkError(error)) {
        stoppedByNetwork = true
        break
      }

      // Validation/auth/server xatosida avtomatik ravishda o'chirmaymiz:
      // foydalanuvchi javobini jim yo'qotishdan ko'ra navbatda qoldirish xavfsiz.
      return {
        flushed,
        remaining: readQueue(ownerId).filter(forExam).length,
        stoppedByNetwork,
        ...(rejected.length ? { rejected } : {}),
      }
    }
    }
    if (stoppedByNetwork || !revisedDuringSend) break
  }

  return {
    flushed,
    remaining: readQueue(ownerId).filter(forExam).length,
    stoppedByNetwork,
    ...(rejected.length ? { rejected } : {}),
  }
}

export const offlineAnswerQueueStorageKey = STORAGE_KEY
