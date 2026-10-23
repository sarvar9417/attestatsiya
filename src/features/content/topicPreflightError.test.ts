import { describe, expect, it } from 'vitest'
import { ApiError } from '../../lib/apiClient'
import { describeTopicPreflightError, describeUnreadyTopic } from './topicPreflightError'

describe('topic readiness failure explanations', () => {
  it('never calls a missing lesson a network error', () => {
    const result = describeTopicPreflightError(new ApiError('Missing lesson', 404, 'NOT_FOUND'))
    expect(result.kind).toBe('not_found')
    expect(result.canRetry).toBe(false)
    expect(result.title).toContain('topilmadi')
  })

  it('allows retry for transient failures but not expired auth', () => {
    expect(describeTopicPreflightError(new ApiError('Offline', 0, 'NETWORK_ERROR')).canRetry).toBe(true)
    expect(describeTopicPreflightError(new ApiError('Busy', 503, 'TOPIC_PREFLIGHT_UNAVAILABLE')).kind).toBe('server')
    expect(describeTopicPreflightError(new ApiError('Expired', 401, 'SESSION_EXPIRED')).canRetry).toBe(false)
  })

  it('distinguishes a missing blueprint from an undersized test pool', () => {
    expect(describeUnreadyTopic('blueprint_missing', 0, 20)).toMatch(/qamrovi/)
    expect(describeUnreadyTopic('pool_insufficient', 15, 20)).toContain('15/20')
    expect(describeUnreadyTopic('objective_gap', 0, 20)).toMatch(/maqsadlari/)
  })
})
