import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TopicView from '../components/learning/TopicView'
import type { TopicContent } from '../data/topicContent'
import type { LessonSummary } from '../features/content/contentApi'

const mocks = vi.hoisted(() => ({
  getTopicContent: vi.fn(),
  getLessonDetail: vi.fn(),
  getTopicTestPreflight: vi.fn(),
  getLessonTestQuestions: vi.fn(),
}))

vi.mock('../data/topicContent', () => ({ getTopicContent: mocks.getTopicContent }))
vi.mock('../features/content/contentApi', () => ({
  getLessonDetail: mocks.getLessonDetail,
  getTopicTestPreflight: mocks.getTopicTestPreflight,
}))
vi.mock('../features/content/lessonContentGateway', () => ({
  getLessonTestQuestions: mocks.getLessonTestQuestions,
  checkQuestionAnswer: vi.fn(),
}))

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(res => { resolve = res })
  return { promise, resolve }
}

const local = (id: string): TopicContent => ({
  subtopicId: id,
  title: 'Asosiy nazariya',
  theory: [{ type: 'definition', content: 'Birlamchi nazariya matni' }],
  questions: [],
})

const server = (markdown: string): LessonSummary => ({
  id: '90000000-0000-4000-8000-000000000001',
  module_id: '90000000-0000-4000-8000-000000000002',
  title_uz: 'Tasdiqlangan dars',
  slug: 'tasdiqlangan-dars',
  body_mdx: markdown,
  blocks: null, blocks_kind: 'chapter',
  status: 'published', est_minutes: 20, order_idx: 1, constructs: [],
})

function mount(moduleId: string, subtopicId: string) {
  return render(
    <MemoryRouter>
      <TopicView
        moduleId={moduleId}
        subtopicId={subtopicId}
        moduleTitle="Test moduli"
        onBack={vi.fn()}
        onComplete={vi.fn()}
      />
    </MemoryRouter>
  )
}

describe('stable theory in learner module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('IntersectionObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    })
    mocks.getTopicContent.mockImplementation((id: string) => local(id))
    mocks.getLessonTestQuestions.mockResolvedValue([])
    mocks.getTopicTestPreflight.mockResolvedValue({
      ready: false, required: 0, available: 0, duration_sec: 0,
      reason: 'pool_insufficient', coverage: [],
      critical_objective_gaps: [], missing_required_objectives: [],
    })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('M04 never paints local theory before canonical published lesson resolves', async () => {
    const request = deferred<LessonSummary>()
    mocks.getLessonDetail.mockReturnValue(request.promise)

    mount('M04', 'M04.04')
    expect(screen.getByRole('status').textContent).toContain('Asosiy nazariya tayyorlanmoqda')
    expect(screen.queryByText('Birlamchi nazariya matni')).toBeNull()

    request.resolve(server('## Tekshirilgan mavzu\n\nAsosiy server nazariyasi'))
    expect(await screen.findByText('Asosiy server nazariyasi')).toBeDefined()
    expect(screen.queryByText('Birlamchi nazariya matni')).toBeNull()
    expect(mocks.getLessonDetail).toHaveBeenCalledTimes(1)
  })

  it('M14 network failure shows one stable local fallback instead of mixing content', async () => {
    const request = deferred<LessonSummary>()
    mocks.getLessonDetail.mockReturnValue(request.promise)
    mount('M14', 'M14.01')
    expect(screen.queryByText('Birlamchi nazariya matni')).toBeNull()
    request.resolve({ ...server('## vaqtinchalik'), status: 'draft' })
    expect(await screen.findByText('Birlamchi nazariya matni')).toBeDefined()
    expect(screen.queryByText('vaqtinchalik')).toBeNull()
  })

  it('M14 server-only published theory loads even without local content', async () => {
    mocks.getTopicContent.mockReturnValue(undefined)
    const request = deferred<LessonSummary>()
    mocks.getLessonDetail.mockReturnValue(request.promise)

    mount('M14', 'M14.06')
    expect(screen.getByRole('status').textContent).toContain('Asosiy nazariya tayyorlanmoqda')
    request.resolve(server('## Kasb standarti\n\nServerdagi tasdiqlangan nazariya'))
    expect(await screen.findByText('Serverdagi tasdiqlangan nazariya')).toBeDefined()
    expect(screen.queryByText('Bu mavzu uchun kontent tayyor emas')).toBeNull()
  })

  it('an unpublished remote-only M04 lesson does not appear as an empty theory', async () => {
    mocks.getTopicContent.mockReturnValue(undefined)
    mocks.getLessonDetail.mockResolvedValue({ ...server('## Yashirin dars'), status: 'draft' })

    mount('M04', 'M04.09')
    expect(await screen.findByText('Bu mavzu uchun kontent tayyor emas')).toBeDefined()
    expect(screen.queryByText('Yashirin dars')).toBeNull()
    expect(screen.getByRole('button', { name: /Orqaga qaytish/ })).toBeDefined()
  })

  it('a rejected request without local M16 theory ends loading and offers back', async () => {
    mocks.getTopicContent.mockReturnValue(undefined)
    mocks.getLessonDetail.mockRejectedValue(new Error('Network unavailable'))

    mount('M16', 'M16.03')
    expect(await screen.findByText('Bu mavzu uchun kontent tayyor emas')).toBeDefined()
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.getByRole('button', { name: /Orqaga qaytish/ })).toBeDefined()
  })

  it('M02 loads the source-marked published section before the first book render', async () => {
    mocks.getLessonDetail.mockResolvedValue(server([
      '## Qisqa server darsi',
      'Asosiy darsning o‘rnini egallamasligi kerak',
      '## Tekshirilgan qo‘shimcha: formatlar',
      'OMR belgilangan maydonlarni skanerlaydi.',
    ].join('\n')))

    mount('M02', 'M02.01')
    expect(screen.getByRole('status').textContent).toContain('Asosiy nazariya tayyorlanmoqda')
    expect(await screen.findByText('Birlamchi nazariya matni')).toBeDefined()
    expect(mocks.getLessonDetail).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Tekshirilgan qo‘shimcha material (ixtiyoriy)')).toBeNull()
    expect(screen.queryByText('Asosiy darsning o‘rnini egallamasligi kerak')).toBeNull()
    // The section is navigable through the same BookReader, not a second
    // disclosure panel below the main chapter.
    expect(screen.getAllByRole('tab').length).toBeGreaterThan(1)
    expect(screen.getByRole('tab', { name: /Tekshirilgan qo‘shimcha/i })).toBeDefined()
  })

  it('M15 integrates published deep source before rendering, but ignores unpublished text', async () => {
    mocks.getLessonDetail.mockResolvedValue(server([
      '## Qisqa eski konspekt',
      'Bu server xulosasi asosiy dars o‘rniga o‘tmasligi kerak.',
      '## Chuqurlashtirilgan nazariya — manba korpusi (2026-10-18)',
      '## Ilmiy-metodik qo‘shimcha',
      'O‘quvchining mustaqil o‘qishi davom ettiriladi.',
    ].join('\n')))
    mount('M15', 'M15.02')
    expect(screen.getByRole('status').textContent).toContain('Asosiy nazariya tayyorlanmoqda')
    expect(await screen.findByText('Birlamchi nazariya matni')).toBeDefined()
    expect(mocks.getLessonDetail).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Tekshirilgan qo‘shimcha material (ixtiyoriy)')).toBeNull()
    expect(screen.queryByText('Bu server xulosasi asosiy dars o‘rniga o‘tmasligi kerak.')).toBeNull()
    expect(screen.getByRole('tab', { name: /Ilmiy-metodik qo‘shimcha/ })).toBeDefined()
  })
})
