import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ModulesPage from '../pages/admin/ModulesPage'
import QuestionsPage from '../pages/admin/QuestionsPage'
import AttemptsPage from '../pages/admin/AttemptsPage'

const mocks = vi.hoisted(() => ({
  getAdminModules: vi.fn(),
  createAdminModule: vi.fn(),
  listAdminQuestions: vi.fn(),
  transitionAdminQuestionStatus: vi.fn(),
  listAttempts: vi.fn(),
  getAttemptDetail: vi.fn(),
}))

vi.mock('../features/admin/adminContentApi', () => ({
  getAdminModules: mocks.getAdminModules,
  createAdminModule: mocks.createAdminModule,
  listAdminQuestions: mocks.listAdminQuestions,
  transitionAdminQuestionStatus: mocks.transitionAdminQuestionStatus,
}))

vi.mock('../features/admin/attemptsApi', async importOriginal => {
  const actual =
    await importOriginal<typeof import('../features/admin/attemptsApi')>()
  return {
    ...actual,
    listAttempts: mocks.listAttempts,
    getAttemptDetail: mocks.getAttemptDetail,
  }
})

describe('Admin content pages backend boundary', () => {
  beforeEach(() => {
    mocks.getAdminModules.mockReset()
    mocks.createAdminModule.mockReset()
    mocks.listAdminQuestions.mockReset()
    mocks.transitionAdminQuestionStatus.mockReset()
    mocks.listAttempts.mockReset()
    mocks.getAttemptDetail.mockReset()
  })

  it('ModulesPage backenddan modul va darslarni ko‘rsatadi va expand qiladi', async () => {
    const user = userEvent.setup()

    mocks.getAdminModules.mockResolvedValue({
      modules: [
        {
          id: 'mod-1',
          code: 'M01',
          title_uz: 'Axborot va raqamli savodxonlik',
          summary_uz: 'Asosiy modul',
          order_idx: 1,
          slug: 'm01',
          status: 'published',
        },
      ],
      lessons: [
        {
          id: 'lesson-1',
          module_id: 'mod-1',
          title_uz: 'Axborot tushunchasi',
          est_minutes: 20,
          order_idx: 1,
          slug: 'm01-01',
          status: 'published',
        },
      ],
      subjects: [{ id: 'sub-1', code: 'INF', name_uz: 'Informatika' }],
    })

    render(<ModulesPage />)

    expect(
      await screen.findByText('Axborot va raqamli savodxonlik'),
    ).toBeDefined()

    await user.click(
      screen.getByRole('button', {
        name: /Axborot va raqamli savodxonlik/,
      }),
    )

    expect(await screen.findByText('Axborot tushunchasi')).toBeDefined()
    expect(screen.getByText('20 min')).toBeDefined()
    expect(mocks.getAdminModules).toHaveBeenCalledTimes(1)
  })

  it('QuestionsPage backend savollarini render qiladi va qidiruvda empty state beradi', async () => {
    const user = userEvent.setup()

    mocks.listAdminQuestions.mockResolvedValue([
      {
        id: 'q-1',
        stem_md: 'Axborot hajmi qanday hisoblanadi?',
        format: 'Y1',
        cognitive: 'bilish',
        difficulty: 2,
        status: 'published',
        group_code: 'S1.INFO',
        construct_id: null,
        subject_id: 'sub-1',
        created_at: '2026-10-06T10:00:00.000Z',
      },
    ])

    render(<QuestionsPage />)

    expect(
      await screen.findByText('Axborot hajmi qanday hisoblanadi?'),
    ).toBeDefined()

    await user.type(
      screen.getByRole('textbox', { name: 'Savol matnidan qidirish' }),
      'mavjud emas',
    )

    expect(await screen.findByText('Savol topilmadi')).toBeDefined()
  })

  it('QuestionsPage faqat admin muharrirga tegishli sifat risklarini ko‘rsatadi', async () => {
    mocks.listAdminQuestions.mockResolvedValue({
      items: [{
        id: 'q-pm', stem_md: 'Pedagogika sinov savoli', format: 'Y1',
        cognitive: 'qollash', difficulty: 3, status: 'review',
        group_code: 'PM.GEN', construct_id: 'con', subject_id: 'sub',
        created_at: '2026-10-18T10:00:00.000Z', source_reference: null,
        quality_flags: {
          question_id: 'q-pm',
          answer_length_signal: true,
          publish_word_balance_risk: true,
          absolute_word_cue: true,
          invalid_y1_contract: false,
          authorship_unknown: true,
        },
      }],
      total: 1, page: 1, page_size: 25,
    })

    render(<QuestionsPage />)
    expect(await screen.findByText('Pedagogika sinov savoli')).toBeDefined()
    expect(screen.getByText('Javob uzunligi ishorasi')).toBeDefined()
    expect(screen.getByText('“Faqat” ishorasi')).toBeDefined()
    expect(screen.getByText('Muallif tasdiqlanmagan')).toBeDefined()
  })

  it('QuestionsPage status transitionni backendga yuboradi', async () => {
    const user = userEvent.setup()
    mocks.listAdminQuestions.mockResolvedValue([
      {
        id: 'q-1',
        stem_md: 'Draft savol?',
        format: 'Y1',
        cognitive: 'bilish',
        difficulty: 1,
        status: 'draft',
        group_code: 'S1.INFO',
        construct_id: 'construct-1',
        subject_id: 'sub-1',
        created_at: '2026-10-06T10:00:00.000Z',
      },
    ])
    mocks.transitionAdminQuestionStatus.mockResolvedValue({
      id: 'q-1',
      status: 'review',
    })

    render(<QuestionsPage />)
    await screen.findByText('Draft savol?')
    await user.click(screen.getByRole('button', { name: /Tekshiruvda/ }))

    await waitFor(() => {
      expect(mocks.transitionAdminQuestionStatus).toHaveBeenCalledWith('q-1', 'review')
    })
  })

  it('AttemptsPage API xatosini foydalanuvchiga ko‘rsatadi', async () => {
    mocks.listAttempts.mockRejectedValue(new Error('Serverga ulanib bo‘lmadi'))

    render(<AttemptsPage />)

    expect(await screen.findByText('Serverga ulanib bo‘lmadi')).toBeDefined()
  })

  it('AttemptsPage bo‘sh natijada empty state va nol ko‘rsatkichlarni beradi', async () => {
    mocks.listAttempts.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 20,
    })

    render(<AttemptsPage />)

    expect(await screen.findByText('Urinishlar topilmadi')).toBeDefined()
    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
    expect(screen.getByText('Jami 0 ta urinish — 1 / 1 sahifa')).toBeDefined()
  })
})
