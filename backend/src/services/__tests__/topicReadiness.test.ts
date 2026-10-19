import { describe, expect, it } from 'vitest'
import { reconcileStrictTopicPreview, type TopicReadinessBaseline } from '../topicReadiness.js'

const configured = (overrides: Partial<TopicReadinessBaseline> = {}): TopicReadinessBaseline => ({
  ready: true,
  required: 20,
  available: 20,
  duration_sec: 2400,
  reason: 'ready',
  coverage: [],
  missing_required_objectives: [],
  critical_objective_gaps: [],
  ...overrides,
})

describe('configured topic test eligibility (never adaptive)', () => {
  it('rejects a legacy 6/20 preview even when RPC says reason=null', () => {
    const actual = reconcileStrictTopicPreview(
      configured({ ready: false, available: 6, reason: 'pool_insufficient' }),
      { question_count: 6, available_count: 6, duration_sec: 720, reason: null },
    )
    expect(actual).toMatchObject({
      ready: false, required: 20, available: 6,
      duration_sec: 2400, reason: 'pool_insufficient',
    })
  })

  it('rejects partial legacy preview even if a stale baseline incorrectly claims ready', () => {
    const actual = reconcileStrictTopicPreview(
      configured(),
      { question_count: 6, available_count: 20, duration_sec: 720, reason: null },
    )
    expect(actual).toMatchObject({ ready: false, required: 20, reason: 'pool_insufficient' })
  })

  it('rejects RPC count 20 when the independent baseline sees only six published keyed items', () => {
    const actual = reconcileStrictTopicPreview(
      configured({ ready: false, available: 6, reason: 'pool_insufficient' }),
      { question_count: 20, available_count: 20, duration_sec: 2400, reason: null },
    )
    expect(actual).toMatchObject({ ready: false, available: 6, required: 20 })
  })

  it('accepts a full configured 20/20 pool and preserves the duration', () => {
    const actual = reconcileStrictTopicPreview(
      configured({ available: 26 }),
      { question_count: 20, available_count: 26, duration_sec: 2400, reason: null },
    )
    expect(actual).toMatchObject({ ready: true, required: 20, available: 26, duration_sec: 2400, reason: 'ready' })
  })

  it('rejects inconsistent duration or required-objective gaps without lowering the size', () => {
    expect(reconcileStrictTopicPreview(configured(),
      { question_count: 20, available_count: 20, duration_sec: 720, reason: null }).ready).toBe(false)
    const covered = reconcileStrictTopicPreview(
      configured({ ready: false, reason: 'objective_gap', missing_required_objectives: ['C1'] }),
      { question_count: 20, available_count: 20, duration_sec: 2400, reason: null },
    )
    expect(covered).toMatchObject({ ready: false, reason: 'objective_gap', required: 20 })
  })

  it('fails closed on malformed or unavailable RPC output', () => {
    expect(() => reconcileStrictTopicPreview(configured(), null))
      .toThrow('Mavzu testi haqiqiy hajmini')
    expect(() => reconcileStrictTopicPreview(configured(),
      { question_count: '6', available_count: 6, duration_sec: 720, reason: null }))
      .toThrow('Mavzu testi hisoblash')
  })
})
