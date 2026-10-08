import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CoveragePage from '../pages/admin/CoveragePage'

const { mockGetCoverage } = vi.hoisted(() => ({
  mockGetCoverage: vi.fn(),
}))

vi.mock('../features/admin/coverageApi', async importOriginal => {
  const actual =
    await importOriginal<typeof import('../features/admin/coverageApi')>()
  return {
    ...actual,
    getContentCoverage: mockGetCoverage,
  }
})

const REPORT = {
  module_code: 'M01',
  generated_at: '2026-10-08T10:00:00.000Z',
  summary: {
    construct_count: 2,
    question_count: 5,
    published_count: 4,
    issue_question_count: 1,
    no_published_construct_count: 1,
    published_without_source_reference: 1,
    published_without_source_lesson: 0,
    published_without_key: 0,
    group_mismatch: 0,
    source_lesson_construct_mismatch: 0,
    outside_active_blueprint: 0,
  },
  constructs: [
    {
      construct_id: '30000000-0000-4000-8000-000000000001',
      construct_code: 'S1.INFO.01',
      group_code: 'S1.INFO',
      title_uz: 'Axborot tushunchalari',
      lesson_slugs: ['m01-01'],
      question_count: 4,
      status_counts: { draft: 0, review: 0, published: 4, archived: 0 },
      format_counts: { Y1: 2, Y2: 1, Y3: 1 },
      cognitive_counts: { bilish: 1, qollash: 2, mulohaza: 1 },
      difficulty_counts: { '1': 0, '2': 1, '3': 2, '4': 1, '5': 0 },
      traceability: {
        with_source_reference: 3,
        with_source_lesson: 4,
        with_key: 4,
      },
      issues: ['published_without_source_reference'],
    },
    {
      construct_id: '30000000-0000-4000-8000-000000000002',
      construct_code: 'S1.INFO.02',
      group_code: 'S1.INFO',
      title_uz: 'Axborot manbalari',
      lesson_slugs: ['m01-02'],
      question_count: 1,
      status_counts: { draft: 1, review: 0, published: 0, archived: 0 },
      format_counts: { Y1: 0, Y2: 0, Y3: 0 },
      cognitive_counts: { bilish: 0, qollash: 0, mulohaza: 0 },
      difficulty_counts: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
      traceability: {
        with_source_reference: 0,
        with_source_lesson: 0,
        with_key: 0,
      },
      issues: ['no_published_questions'],
    },
  ],
  question_issues: [
    {
      question_id: '40000000-0000-4000-8000-000000000001',
      construct_code: 'S1.INFO.01',
      group_code: 'S1.INFO',
      source_lesson_slug: 'm01-01',
      stem_preview: 'Axborot nima?',
      issues: ['published_without_source_reference'],
    },
  ],
} as const

describe('CoveragePage', () => {
  beforeEach(() => {
    mockGetCoverage.mockReset()
  })

  it('M01 real coverage matrix va issue listini ko‘rsatadi', async () => {
    mockGetCoverage.mockResolvedValue(REPORT)

    render(<CoveragePage />)

    expect((await screen.findAllByText('S1.INFO.01')).length).toBeGreaterThan(0)
    expect(screen.getByText('S1.INFO.02')).toBeDefined()
    expect(screen.getByText('Axborot nima?')).toBeDefined()
    expect(screen.getAllByText('Manba reference yo‘q').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Published savol yo‘q').length).toBeGreaterThan(0)
    expect(mockGetCoverage).toHaveBeenCalledWith('M01')
  })

  it('global audit tanlansa modulesiz endpoint contractini chaqiradi', async () => {
    const user = userEvent.setup()
    mockGetCoverage.mockResolvedValue(REPORT)

    render(<CoveragePage />)
    await screen.findAllByText('S1.INFO.01')

    await user.selectOptions(screen.getByLabelText('Modul'), 'ALL')

    expect(mockGetCoverage).toHaveBeenLastCalledWith(undefined)
  })

  it('API xatosini alertda ko‘rsatadi va retry qiladi', async () => {
    const user = userEvent.setup()
    mockGetCoverage
      .mockRejectedValueOnce(new Error('Coverage server xatosi'))
      .mockResolvedValueOnce(REPORT)

    render(<CoveragePage />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Coverage server xatosi'
    )

    await user.click(screen.getByRole('button', { name: 'Yangilash' }))

    expect(await screen.findByText('S1.INFO.01')).toBeDefined()
    expect(mockGetCoverage).toHaveBeenCalledTimes(2)
  })
})
