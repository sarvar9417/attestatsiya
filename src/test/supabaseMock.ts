import { vi } from 'vitest'
import type { Mock } from 'vitest'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface MockResult {
  data: unknown
  error: unknown
  count?: number | null
}

export interface QB {
  select: Mock
  insert: Mock
  upsert: Mock
  delete: Mock
  update: Mock
  eq: Mock
  neq: Mock
  gte: Mock
  lte: Mock
  gt: Mock
  lt: Mock
  or: Mock
  in: Mock
  order: Mock
  limit: Mock
  range: Mock
  single: Mock
  maybeSingle: Mock
  textSearch: Mock
  not: Mock
  filter: Mock
  match: Mock
  is: Mock
  then: (onFulfilled: (v: MockResult) => void) => void
  catch: (onRejected: (v: MockResult) => void) => void
}

// ─── Factory ────────────────────────────────────────────────────────────────────

export function buildQB(): {
  qb: QB
  setResult: (data: unknown, error?: unknown, count?: number | null) => void
} {
  let r: MockResult = { data: null, error: null }

  const then = (f: (v: MockResult) => void) => {
    f(r)
    return Promise.resolve()
  }

  const catchFn = (f: (v: MockResult) => void) => {
    f(r)
    return Promise.resolve()
  }

  const setResult = (
    data: unknown,
    error: unknown = null,
    count: number | null = null,
  ) => {
    r = { data, error, count }
  }

  const qb: QB = {
    select: vi.fn(() => qb),
    insert: vi.fn(() => qb),
    upsert: vi.fn(() => qb),
    delete: vi.fn(() => qb),
    update: vi.fn(() => qb),
    eq: vi.fn(() => qb),
    neq: vi.fn(() => qb),
    gte: vi.fn(() => qb),
    lte: vi.fn(() => qb),
    gt: vi.fn(() => qb),
    lt: vi.fn(() => qb),
    or: vi.fn(() => qb),
    in: vi.fn(() => qb),
    order: vi.fn(() => qb),
    limit: vi.fn(() => qb),
    range: vi.fn(() => qb),
    single: vi.fn(() => qb),
    maybeSingle: vi.fn(() => qb),
    textSearch: vi.fn(() => qb),
    not: vi.fn(() => qb),
    filter: vi.fn(() => qb),
    match: vi.fn(() => qb),
    is: vi.fn(() => qb),
    then,
    catch: catchFn,
  }

  return { qb, setResult }
}
