import { beforeEach, describe, expect, it, vi } from 'vitest'
import { customExamConfigSchema, getCustomTestCatalog, previewCustomTest } from '../customTestApi'
import { api } from '../../../lib/apiClient'

vi.mock('../../../lib/apiClient', () => ({ api: { get: vi.fn(), post: vi.fn() } }))

const moduleId = '10000000-0000-0000-0000-000000000001'
const lessonId = '20000000-0000-0000-0000-000000000001'
const modernId = '10000000-0000-4000-8000-000000000015'
const config = {
  total_count: 1,
  topics: [{ lesson_id: lessonId, count: 1, difficulty_counts: [{ difficulty: 3, count: 1 }] }],
  formats: ['Y1'], exposure: 'all', mode: 'exam', duration_sec: 900,
}

describe('TASK-210 PostgreSQL canonical UUID compatibility', () => {
  beforeEach(() => vi.clearAllMocks())

  it('parses real-world legacy non-RFC IDs in module and lesson catalog', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([
      { id: moduleId, code: 'M01', title_uz: 'Informatika', order_idx: 1,
        lessons: [{ id: lessonId, module_id: moduleId, title_uz: 'Sanoq sistemalari',
          slug: 'sanoq', order_idx: 1 }] },
      { id: modernId, code: 'M15', title_uz: 'Pedagogika', order_idx: 15,
        lessons: [{ id: '20000000-0000-4000-8000-000000000015', module_id: modernId,
          title_uz: 'Didaktika', slug: 'didaktika', order_idx: 1 }] },
    ])
    const modules = await getCustomTestCatalog()
    expect(modules).toHaveLength(2)
    expect(modules[0]?.id).toBe(moduleId)
    expect(modules[0]?.lessons[0]?.module_id).toBe(moduleId)
    expect(modules[1]?.id).toBe(modernId)
  })

  it('supports legacy lesson IDs in config + preflight without converting them', async () => {
    const parsed = customExamConfigSchema.parse(config)
    vi.mocked(api.post).mockResolvedValueOnce({
      ready: true, requested: 1, available: 1, gaps: [],
      slots: [{ lesson_id: lessonId, difficulty: 3, requested: 1, available: 1 }],
    })
    const result = await previewCustomTest(parsed)
    expect(result.slots[0]?.lesson_id).toBe(lessonId)
    expect(api.post).toHaveBeenCalledWith('/api/custom-tests/preflight', parsed)
  })

  it('still rejects non-UUID and malformed hex values', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([
      { id: 'M01', code: 'M01', title_uz: 'Bad', order_idx: 1, lessons: [] },
    ])
    await expect(getCustomTestCatalog()).rejects.toThrow()
    expect(customExamConfigSchema.safeParse({
      ...config, topics: [{ ...config.topics[0], lesson_id: 'not-a-uuid' }],
    }).success).toBe(false)
    expect(customExamConfigSchema.safeParse({
      ...config, topics: [{ ...config.topics[0],
        lesson_id: '20000000-0000-0000-0000-00000000000z' }],
    }).success).toBe(false)
  })
})
