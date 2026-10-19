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
}

type AnswerSender = (input: SubmitAnswerInput) => Promise<SubmitAnswerResponse>

function storage(): Storage | null {
  if (typeof window === 'undefined') return null
  return window.localStorage
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

  const raw = target.getItem(`${STORAGE_KEY}:${ownerId}`)
  if (!raw) return []

  try {
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
  if (!target) return

  if (queue.length === 0) {
    target.removeItem(`${STORAGE_KEY}:${ownerId}`)
    return
  }

  target.setItem(`${STORAGE_KEY}:${ownerId}`, JSON.stringify(queue))
}

function queueIdentity(input: Pick<SubmitAnswerInput, 'examId' | 'questionId'>): string {
  return `${input.examId}:${input.questionId}`
}

/**
 * Bir savolning birinchi offline urinishini saqlaydi.
 * Serverdagi first-submit immutable qoidasiga mos ravishda keyingi urinish
 * mavjud navbatdagi javobni almashtirmaydi.
 */
export function enqueuePendingAnswer(
  input: SubmitAnswerInput, ownerId = sessionStore.get()?.user.id
): PendingAnswer {
  const queue = readQueue(ownerId)
  const identity = queueIdentity(input)
  const existing = queue.find(item => queueIdentity(item) === identity)
  if (existing) return existing

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
  const snapshot = readQueue(ownerId).filter(forExam)
  let flushed = 0
  let stoppedByNetwork = false

  for (const pending of snapshot) {
    if (sessionStore.get()?.user.id !== ownerId) break
    try {
      const response = await sender(pending)
      if ('saved' in response || 'error' in response) {
        removePendingAnswer(pending.examId, pending.questionId, ownerId)
        flushed += 1
      }
    } catch (error) {
      if (isNetworkError(error)) {
        stoppedByNetwork = true
        break
      }

      // Validation/auth/server xatosida avtomatik ravishda o'chirmaymiz:
      // foydalanuvchi javobini jim yo'qotishdan ko'ra navbatda qoldirish xavfsiz.
      break
    }
  }

  return {
    flushed,
    remaining: readQueue(ownerId).filter(forExam).length,
    stoppedByNetwork,
  }
}

export const offlineAnswerQueueStorageKey = STORAGE_KEY
