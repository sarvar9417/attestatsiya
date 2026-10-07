import { isNetworkError } from '../../lib/apiClient'
import type { SubmitAnswerResponse } from './contracts'
import type { SubmitAnswerInput } from './examGateway'

const STORAGE_KEY = 'attestatsiya:exam:pending-answers:v1'
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

function readQueue(): PendingAnswer[] {
  const target = storage()
  if (!target) return []

  const raw = target.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isPendingAnswer).slice(0, MAX_PENDING_ANSWERS)
  } catch {
    return []
  }
}

function writeQueue(queue: readonly PendingAnswer[]): void {
  const target = storage()
  if (!target) return

  if (queue.length === 0) {
    target.removeItem(STORAGE_KEY)
    return
  }

  target.setItem(STORAGE_KEY, JSON.stringify(queue.slice(0, MAX_PENDING_ANSWERS)))
}

function queueIdentity(input: Pick<SubmitAnswerInput, 'examId' | 'questionId'>): string {
  return `${input.examId}:${input.questionId}`
}

/**
 * Bir savolning birinchi offline urinishini saqlaydi.
 * Serverdagi first-submit immutable qoidasiga mos ravishda keyingi urinish
 * mavjud navbatdagi javobni almashtirmaydi.
 */
export function enqueuePendingAnswer(input: SubmitAnswerInput): PendingAnswer {
  const queue = readQueue()
  const identity = queueIdentity(input)
  const existing = queue.find(item => queueIdentity(item) === identity)
  if (existing) return existing

  const pending: PendingAnswer = {
    ...input,
    queuedAt: new Date().toISOString(),
  }
  writeQueue([...queue, pending])
  return pending
}

export function listPendingAnswers(): PendingAnswer[] {
  return readQueue()
}

export function clearPendingAnswers(): void {
  writeQueue([])
}

export function removePendingAnswer(examId: string, questionId: string): void {
  const identity = `${examId}:${questionId}`
  writeQueue(readQueue().filter(item => queueIdentity(item) !== identity))
}

/**
 * Navbatni ketma-ket yuboradi. Tarmoq yana uzilsa darhol to'xtaydi va
 * qolgan elementlar localStorage'da qoladi. Server terminal javob qaytarsa
 * (sinov tugagan/vaqt tugagan) element qayta yuborilmasligi uchun navbatdan
 * chiqariladi.
 */
export async function flushPendingAnswers(
  sender: AnswerSender
): Promise<FlushPendingAnswersResult> {
  const snapshot = readQueue()
  let flushed = 0
  let stoppedByNetwork = false

  for (const pending of snapshot) {
    try {
      const response = await sender(pending)
      if ('saved' in response || 'error' in response) {
        removePendingAnswer(pending.examId, pending.questionId)
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
    remaining: readQueue().length,
    stoppedByNetwork,
  }
}

export const offlineAnswerQueueStorageKey = STORAGE_KEY
