import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError } from '../lib/apiClient'
import { sessionStore, type AuthSession } from '../features/auth/sessionStore'
import { backendGateway } from '../features/exam/backendGateway'
import { enqueuePendingAnswer, listPendingAnswers, flushPendingAnswers } from '../features/exam/offlineAnswerQueue'
import type { SubmitAnswerInput } from '../features/exam/examGateway'

const answer: SubmitAnswerInput = {
  examId: '30000000-0000-4000-8000-000000000001', examKind: 'mock',
  questionId: '30000000-0000-4000-8000-000000000021',
  answer: { option_id: '30000000-0000-4000-8000-000000000031' }, timeSpentSec: 12,
}
const finish = {
  exam_id: answer.examId, total_score: 2, max_score: 2, passed: true,
  breakdown: null, already_finished: false,
}
function session(id: string): AuthSession {
  return { access_token: `access-${id}`, refresh_token: `refresh-${id}`, expires_at: Date.now() + 3600000,
    user: { id, email: `${id}@example.invalid`, display_name: id, role: 'user' } }
}
beforeEach(() => { localStorage.clear(); sessionStore.set(session('alice')) })
afterEach(() => { vi.restoreAllMocks(); sessionStore.clear() })

describe('offline exam persistence', () => {
  it('does not expose or flush another account’s pending answers', async () => {
    enqueuePendingAnswer(answer)
    sessionStore.set(session('bob'))
    expect(listPendingAnswers()).toEqual([])
    const sender = vi.fn().mockResolvedValue({ saved: true })
    await flushPendingAnswers(sender)
    expect(sender).not.toHaveBeenCalled()
    sessionStore.set(session('alice'))
    expect(listPendingAnswers()).toHaveLength(1)
  })

  it('flushes pending answers before sending the finish request', async () => {
    enqueuePendingAnswer(answer)
    const post = vi.spyOn(api, 'post').mockResolvedValueOnce({ saved: true }).mockResolvedValueOnce(finish)
    await backendGateway.finishExam(answer.examId)
    expect(post.mock.calls.map(call => call[0])).toEqual(['/api/exam/submit', '/api/exam/finish'])
    expect(listPendingAnswers()).toEqual([])
  })

  it('does not finalize while an answer still cannot be saved', async () => {
    enqueuePendingAnswer(answer)
    const post = vi.spyOn(api, 'post').mockRejectedValue(new ApiError('offline', 0, 'NETWORK_ERROR'))
    await expect(backendGateway.finishExam(answer.examId)).rejects.toMatchObject({ code: 'PENDING_ANSWERS' })
    expect(post.mock.calls.map(call => call[0])).toEqual(['/api/exam/submit'])
    expect(listPendingAnswers()).toHaveLength(1)
  })

  it('queues changed mock answers locally and flushes newest choice', async () => {
    backendGateway.queueMockAnswer?.(answer)
    backendGateway.queueMockAnswer?.({ ...answer, answer: { option_id: 'updated', _client_revision: 100 } })
    const post = vi.spyOn(api, 'post').mockResolvedValue({ saved: true })
    await backendGateway.flushQueuedAnswers?.(answer.examId)
    expect(post).toHaveBeenCalledWith('/api/exam/submit', expect.objectContaining({
      answer: { option_id: 'updated', _client_revision: 100 },
    }))
    expect(listPendingAnswers()).toHaveLength(0)
  })

  it('does not let an unrelated exam’s stale queue block the current finish', async () => {
    enqueuePendingAnswer({ ...answer, examId: '30000000-0000-4000-8000-000000000002' })
    const post = vi.spyOn(api, 'post').mockResolvedValue(finish)
    await backendGateway.finishExam(answer.examId)
    expect(post.mock.calls.map(call => call[0])).toEqual(['/api/exam/finish'])
    expect(listPendingAnswers()).toHaveLength(1)
  })

  it('retries the first queued answer and removes it only after server acknowledgment', async () => {
    enqueuePendingAnswer(answer)
    const post = vi.spyOn(api, 'post').mockResolvedValue({ saved: true })
    await backendGateway.submitAnswer({ ...answer, examKind: 'bolim', answer: { option_id: 'different-option' } })
    expect(post).toHaveBeenCalledWith('/api/exam/submit', expect.objectContaining({ answer: answer.answer }))
    expect(listPendingAnswers()).toEqual([])
  })

  it('stops a flush after an account switch without sending the next answer', async () => {
    enqueuePendingAnswer(answer)
    enqueuePendingAnswer({ ...answer, questionId: 'next-question' })
    const sender = vi.fn().mockImplementation(async () => {
      sessionStore.set(session('bob'))
      return { saved: true }
    })
    await flushPendingAnswers(sender)
    expect(sender).toHaveBeenCalledTimes(1)
    sessionStore.set(session('alice'))
    expect(listPendingAnswers()).toHaveLength(1)
  })
  it('does not automatically assign an owner to the legacy unscoped queue', async () => {
    localStorage.setItem('attestatsiya:exam:pending-answers:v1', JSON.stringify([
      { ...answer, queuedAt: new Date().toISOString() },
    ]))
    const sender = vi.fn()
    await flushPendingAnswers(sender)
    expect(sender).not.toHaveBeenCalled()
    expect(localStorage.getItem('attestatsiya:exam:pending-answers:v1')).not.toBeNull()
  })

  it('reports a full queue instead of silently discarding the 201st answer', () => {
    for (let i = 0; i < 200; i++) enqueuePendingAnswer({ ...answer, questionId: `question-${i}` })
    expect(() => enqueuePendingAnswer(answer)).toThrow(/navbati to‘ldi/)
    expect(listPendingAnswers()).toHaveLength(200)
  })

  it('never sends finish under a different account after flushing', async () => {
    enqueuePendingAnswer(answer)
    const post = vi.spyOn(api, 'post').mockImplementation(async () => {
      sessionStore.set(session('bob'))
      return { saved: true }
    })
    await expect(backendGateway.finishExam(answer.examId)).rejects.toMatchObject({ code: 'SESSION_CHANGED' })
    expect(post.mock.calls.map(call => call[0])).toEqual(['/api/exam/submit'])
  })

})
