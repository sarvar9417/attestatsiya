import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import QuestionFormModal from '../components/admin/QuestionFormModal'

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  captureException: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  typedSupabase: {
    from: mocks.from,
  },
}))

vi.mock('../lib/monitoring', () => ({
  monitoring: {
    captureException: mocks.captureException,
  },
}))

function orderedResult(data: unknown[], error: { message: string } | null = null) {
  return {
    select: vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data, error }),
    }),
  }
}

function configureLoad() {
  mocks.from.mockImplementation((table: string) => {
    if (table === 'constructs') {
      return orderedResult([
        {
          id: 'construct-1',
          code: 'AX-01',
          title_uz: 'Axborot tushunchasi',
          subject_id: 'subject-1',
          group_code: 'S1.INFO',
        },
      ])
    }

    if (table === 'subjects') {
      return orderedResult([
        {
          id: 'subject-1',
          code: 'INF',
          name_uz: 'Informatika',
        },
      ])
    }

    throw new Error('Unexpected table: ' + table)
  })
}

describe('QuestionFormModal Figma UI', () => {
  beforeEach(() => {
    mocks.from.mockReset()
    mocks.captureException.mockReset()
  })

  it('konstruktlarni yuklaydi va Y2 cheklovini aniq ko‘rsatadi', async () => {
    const user = userEvent.setup()
    configureLoad()

    render(
      <QuestionFormModal
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />,
    )

    expect(
      await screen.findByRole('option', { name: 'AX-01 — Axborot tushunchasi' }),
    ).toBeDefined()

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Test turi' }),
      'Y2',
    )

    expect(
      screen.getByText('Y2/Y3 javob shabloni bu formadan kiritilmaydi.'),
    ).toBeDefined()
  })

  it('savol matni bo‘sh bo‘lsa inline validation ko‘rsatadi', async () => {
    const user = userEvent.setup()
    configureLoad()

    render(
      <QuestionFormModal
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />,
    )

    await screen.findByRole('option', { name: 'AX-01 — Axborot tushunchasi' })
    await user.click(screen.getByRole('button', { name: 'Yaratish' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Savol matnini kiriting',
    )
  })

  it('matn bor, konstrukt yo‘q bo‘lsa saqlashni to‘xtatadi', async () => {
    const user = userEvent.setup()
    configureLoad()

    render(
      <QuestionFormModal
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />,
    )

    await screen.findByRole('option', { name: 'AX-01 — Axborot tushunchasi' })
    await user.type(
      screen.getByLabelText('Savol matni'),
      'Axborot nima?',
    )
    await user.click(screen.getByRole('button', { name: 'Yaratish' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Konstruktni tanlang',
    )
    expect(mocks.captureException).not.toHaveBeenCalled()
  })
})
