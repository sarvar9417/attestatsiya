import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
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

  it('M02 does not call the API or append a second lesson until student opens optional source', async () => {
    mocks.getLessonDetail.mockResolvedValue(server([
      '## Qisqa server darsi',
      'Asosiy darsning o‘rnini egallamasligi kerak',
      '## Tekshirilgan qo‘shimcha: formatlar',
      'OMR belgilangan maydonlarni skanerlaydi.',
    ].join('\n')))

    mount('M02', 'M02.01')
    expect(screen.getByText('Birlamchi nazariya matni')).toBeDefined()
    expect(mocks.getLessonDetail).not.toHaveBeenCalled()
    expect(screen.queryByText('OMR belgilangan maydonlarni skanerlaydi.')).toBeNull()

    fireEvent.click(screen.getByText('Tekshirilgan qo‘shimcha material (ixtiyoriy)'))
    await waitFor(() => expect(mocks.getLessonDetail).toHaveBeenCalledTimes(1))
    expect(await screen.findByText('OMR belgilangan maydonlarni skanerlaydi.')).toBeDefined()
    expect(screen.getByText('Birlamchi nazariya matni')).toBeDefined()
    expect(screen.queryByText('Asosiy darsning o‘rnini egallamasligi kerak')).toBeNull()
  })
})
