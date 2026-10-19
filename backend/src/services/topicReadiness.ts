import { AppError } from '../lib/errors.js'

export interface TopicReadinessBaseline {
  ready: boolean
  required: number
  available: number
  duration_sec: number
  reason: string
  coverage: unknown[]
  missing_required_objectives: string[]
  critical_objective_gaps: string[]
}

/**
 * Reconcile configured lesson coverage with a possibly stale adaptive RPC.
 * The real configured count is immutable here: a legacy 6/20 "ready" preview
 * must never silently downgrade a required 20-question topic test.
 */
export function reconcileStrictTopicPreview(
  baseline: TopicReadinessBaseline,
  preview: unknown,
): TopicReadinessBaseline {
  if (!preview || typeof preview !== 'object' || Array.isArray(preview)) {
    throw new AppError('Mavzu testi haqiqiy hajmini tekshirib bo‘lmadi', 503, 'TOPIC_PREFLIGHT_UNAVAILABLE')
  }
  const actual = preview as Record<string, unknown>
  const count = actual.question_count
  const available = actual.available_count
  const duration = actual.duration_sec

  if (typeof count !== 'number' || !Number.isInteger(count) || count < 0 ||
      typeof available !== 'number' || !Number.isInteger(available) || available < 0 ||
      typeof duration !== 'number' || !Number.isInteger(duration) || duration < 0) {
    throw new AppError('Mavzu testi hisoblash javobi noto‘g‘ri', 503, 'TOPIC_PREFLIGHT_INVALID')
  }

  const blockedByObjectives =
    baseline.reason === 'blueprint_missing' ||
    baseline.reason === 'blueprint_invalid' ||
    baseline.reason === 'objective_gap' ||
    baseline.missing_required_objectives.length > 0

  // This is intentionally more restrictive than old production preview().
  const ready = baseline.ready && !blockedByObjectives &&
    baseline.required > 0 && baseline.available >= baseline.required &&
    available >= baseline.required && count === baseline.required &&
    duration === baseline.required * 120 && actual.reason === null

  return {
    ...baseline,
    ready,
    required: baseline.required,
    available: Math.min(baseline.available, available),
    duration_sec: baseline.duration_sec,
    reason: blockedByObjectives ? baseline.reason :
      ready ? 'ready' : 'pool_insufficient',
  }
}
