import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ModulesPage from '../pages/admin/ModulesPage'
import QuestionsPage from '../pages/admin/QuestionsPage'
import AttemptsPage from '../pages/admin/AttemptsPage'

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  listAttempts: vi.fn(),
  getAttemptDetail: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: mocks.from,
  },
  typedSupabase: {
    from: mocks.from,
  },
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

function orderedResult(data: unknown[], error: { message: string } | null = null) {
  return {
    select: vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data, error }),
    }),
  }
}

function questionResult(data: unknown[], error: { message: string } | null = null) {
  return {
    select: vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({ data, error }),
      }),
    }),
  }
}

describe('Admin content pages Figma UI', () => {
  beforeEach(() => {
    mocks.from.mockReset()
    mocks.listAttempts.mockReset()
    mocks.getAttemptDetail.mockReset()
  })

  it('ModulesPage modul va darslarni ko‘rsatadi va expand qiladi', async () => {
    const user = userEvent.setup()

    mocks.from.mockImplementation((table: string) => {
      if (table === 'modules') {
        return orderedResult([
          {
            id: 'mod-1',
            code: 'M01',
            title_uz: 'Axborot va raqamli savodxonlik',
            summary_uz: 'Asosiy modul',
            order_idx: 1,
            slug: 'm01',
            status: 'published',
          },
        ])
      }
      if (table === 'lessons') {
        return orderedResult([
          {
            id: 'lesson-1',
            module_id: 'mod-1',
            title_uz: 'Axborot tushunchasi',
            est_minutes: 20,
            order_idx: 1,
            slug: 'm01-01',
            status: 'published',
          },
        ])
      }
      if (table === 'subjects') {
        return orderedResult([
          { id: 'sub-1', code: 'INF', name_uz: 'Informatika' },
        ])
      }
      throw new Error('Unexpected table: ' + table)
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
  })

  it('QuestionsPage savollarni render qiladi va qidiruvda empty state beradi', async () => {
    const user = userEvent.setup()

    mocks.from.mockImplementation((table: string) => {
      if (table !== 'questions') throw new Error('Unexpected table: ' + table)
      return questionResult([
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
    })

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
