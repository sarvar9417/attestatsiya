import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCatalog } from '../hooks/useCatalog'
import { MODULES } from '../data/contentTree'
import type { ModuleSummary } from '../features/content/contentApi'

const listModulesMock = vi.fn()

vi.mock('../features/content/contentApi', () => ({
  listModules: (...args: unknown[]) => listModulesMock(...args),
}))

const DB_M01: ModuleSummary = {
  id: 'uuid-m01',
  code: 'M01',
  title_uz: 'DB: Axborot va raqamli savodxonlik',
  summary_uz: 'DB: Rasmiy izoh',
  order_idx: 1,
  exam_section: 'specialty',
  status: 'published',
  exam_question_count: 3,
  lesson_count: 3,
}

describe('useCatalog', () => {
  beforeEach(() => {
    listModulesMock.mockReset()
  })

  it('dastlab statik katalog bilan render qiladi (loading=true)', () => {
    listModulesMock.mockImplementation(() => new Promise(() => {}))
    const { result } = renderHook(() => useCatalog())
    expect(result.current.loading).toBe(true)
    expect(result.current.online).toBe(false)
    expect(result.current.modules).toHaveLength(MODULES.length)
    expect(result.current.modules[0].source).toBe('static')
  })

  it('backend javobi kelgach DB meta-ma\'lumot bilan qoplanadi', async () => {
    listModulesMock.mockResolvedValue([DB_M01])
    const { result } = renderHook(() => useCatalog())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.online).toBe(true)
    expect(result.current.modules[0].title).toBe('DB: Axborot va raqamli savodxonlik')
    expect(result.current.modules[0].uuid).toBe('uuid-m01')
    expect(result.current.modules[0].source).toBe('db')
  })

  it('API xatosida statik katalog saqlanadi (online=false)', async () => {
    listModulesMock.mockRejectedValue(new Error('network down'))
    const { result } = renderHook(() => useCatalog())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.online).toBe(false)
    expect(result.current.modules).toHaveLength(MODULES.length)
    expect(result.current.modules[0].source).toBe('static')
    expect(result.current.modules[0].title).toBe(MODULES[0].title)
  })
})
