import { describe, expect, it } from 'vitest'
import {
  buildContentCoverageReport,
  type CoverageDataset,
} from '../content-coverage.service.js'

const ids = {
  module1: '10000000-0000-4000-8000-000000000001',
  module2: '10000000-0000-4000-8000-000000000002',
  lesson11: '20000000-0000-4000-8000-000000000011',
  lesson12: '20000000-0000-4000-8000-000000000012',
  lesson21: '20000000-0000-4000-8000-000000000021',
  c1: '30000000-0000-4000-8000-000000000001',
  c2: '30000000-0000-4000-8000-000000000002',
  c3: '30000000-0000-4000-8000-000000000003',
  c4: '30000000-0000-4000-8000-000000000004',
  q1: '40000000-0000-4000-8000-000000000001',
  q2: '40000000-0000-4000-8000-000000000002',
  q3: '40000000-0000-4000-8000-000000000003',
  q4: '40000000-0000-4000-8000-000000000004',
  q5: '40000000-0000-4000-8000-000000000005',
  blueprint: '50000000-0000-4000-8000-000000000001',
}

function fixture(): CoverageDataset {
  return {
    modules: [
      { id: ids.module1, code: 'M01' },
      { id: ids.module2, code: 'M02' },
    ],
    lessons: [
      { id: ids.lesson11, module_id: ids.module1, slug: 'm01-01' },
      { id: ids.lesson12, module_id: ids.module1, slug: 'm01-02' },
      { id: ids.lesson21, module_id: ids.module2, slug: 'm02-01' },
    ],
    lessonConstructs: [
      { lesson_id: ids.lesson11, construct_id: ids.c1 },
      { lesson_id: ids.lesson12, construct_id: ids.c2 },
      { lesson_id: ids.lesson12, construct_id: ids.c4 },
      { lesson_id: ids.lesson21, construct_id: ids.c3 },
    ],
    constructs: [
      {
        id: ids.c1,
        code: 'S1.INFO.01',
        group_code: 'S1.INFO',
        title_uz: 'Axborot tushunchalari',
      },
      {
        id: ids.c2,
        code: 'S1.INFO.02',
        group_code: 'S1.INFO',
        title_uz: 'Axborot manbalari',
      },
      {
        id: ids.c3,
        code: 'S2.HW.01',
        group_code: 'S2.HW',
        title_uz: 'Qurilmalar',
      },
      {
        id: ids.c4,
        code: 'S1.INFO.03',
        group_code: 'S1.INFO',
        title_uz: 'Kodlash',
      },
    ],
    questions: [
      {
        id: ids.q1,
        construct_id: ids.c1,
        group_code: 'S1.INFO',
        format: 'Y1',
        cognitive: 'bilish',
        difficulty: 2,
        status: 'published',
        source_reference: 'ICT5:p17',
        source_lesson_id: ids.lesson11,
        stem_md: 'Axborot nima?',
      },
      {
        id: ids.q2,
        construct_id: ids.c1,
        group_code: 'BAD.GROUP',
        format: 'Y2',
        cognitive: 'qollash',
        difficulty: 4,
        status: 'published',
        source_reference: null,
        source_lesson_id: ids.lesson12,
        stem_md: 'Noto‘g‘ri taxonomy bilan sinov savoli',
      },
      {
        id: ids.q3,
        construct_id: ids.c2,
        group_code: 'S1.INFO',
        format: 'Y3',
        cognitive: 'mulohaza',
        difficulty: 5,
        status: 'review',
        source_reference: null,
        source_lesson_id: ids.lesson12,
        stem_md: 'Hali review savoli',
      },
      {
        id: ids.q4,
        construct_id: ids.c2,
        group_code: 'S1.INFO',
        format: 'Y1',
        cognitive: 'qollash',
        difficulty: 3,
        status: 'published',
        source_reference: 'ICT7:p9',
        source_lesson_id: null,
        stem_md: 'Manba lesson va key yetishmaydigan savol',
      },
      {
        id: ids.q5,
        construct_id: ids.c3,
        group_code: 'S2.HW',
        format: 'Y1',
        cognitive: 'bilish',
        difficulty: 1,
        status: 'published',
        source_reference: 'ICT5:p24',
        source_lesson_id: ids.lesson21,
        stem_md: 'M02 savoli',
      },
    ],
    questionKeys: [
      { question_id: ids.q1 },
      { question_id: ids.q2 },
      { question_id: ids.q5 },
    ],
    activeBlueprints: [{ id: ids.blueprint }],
    blueprintQuotas: [
      { blueprint_id: ids.blueprint, group_code: 'S1.INFO' },
      { blueprint_id: ids.blueprint, group_code: 'S2.HW' },
    ],
  }
}

describe('buildContentCoverageReport', () => {
  it('M01 scope uchun objective matrix va published traceability muammolarini hisoblaydi', () => {
    const report = buildContentCoverageReport(fixture(), 'M01')

    expect(report.module_code).toBe('M01')
    expect(report.summary.construct_count).toBe(3)
    expect(report.summary.question_count).toBe(4)
    expect(report.summary.published_count).toBe(3)
    expect(report.summary.issue_question_count).toBe(2)
    expect(report.summary.no_published_construct_count).toBe(1)
    expect(report.summary.published_without_source_reference).toBe(1)
    expect(report.summary.published_without_source_lesson).toBe(1)
    expect(report.summary.published_without_key).toBe(1)
    expect(report.summary.group_mismatch).toBe(1)
    expect(report.summary.source_lesson_construct_mismatch).toBe(1)
    expect(report.summary.outside_active_blueprint).toBe(1)

    const c1 = report.constructs.find(row => row.construct_code === 'S1.INFO.01')
    expect(c1).toMatchObject({
      lesson_slugs: ['m01-01'],
      question_count: 2,
      status_counts: { draft: 0, review: 0, published: 2, archived: 0 },
      format_counts: { Y1: 1, Y2: 1, Y3: 0 },
      cognitive_counts: { bilish: 1, qollash: 1, mulohaza: 0 },
      traceability: {
        with_source_reference: 1,
        with_source_lesson: 2,
        with_key: 2,
      },
    })
    expect(c1?.issues).toEqual(
      expect.arrayContaining([
        'published_without_source_reference',
        'group_mismatch',
        'source_lesson_construct_mismatch',
        'outside_active_blueprint',
      ])
    )

    const c4 = report.constructs.find(row => row.construct_code === 'S1.INFO.03')
    expect(c4?.issues).toContain('no_published_questions')

    expect(report.question_issues.map(row => row.question_id)).not.toContain(ids.q5)
  })

  it('draft/review savollardagi source kamchiligini published issue sifatida sanamaydi', () => {
    const report = buildContentCoverageReport(fixture(), 'M01')
    const reviewQuestion = report.question_issues.find(row => row.question_id === ids.q3)
    expect(reviewQuestion).toBeUndefined()

    const c2 = report.constructs.find(row => row.construct_code === 'S1.INFO.02')
    expect(c2?.status_counts.review).toBe(1)
    expect(c2?.format_counts.Y3).toBe(0)
  })

  it('noma’lum module code uchun 404 semantik NotFoundError tashlaydi', () => {
    expect(() => buildContentCoverageReport(fixture(), 'M99')).toThrow(
      'M99 moduli topilmadi'
    )
  })

  it('module scope berilmasa barcha objective va savollarni qamrab oladi', () => {
    const report = buildContentCoverageReport(fixture())
    expect(report.module_code).toBeNull()
    expect(report.summary.construct_count).toBe(4)
    expect(report.summary.question_count).toBe(5)
    expect(report.summary.published_count).toBe(4)
  })
})
