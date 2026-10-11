import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import QuestionFormModal from '../components/admin/QuestionFormModal'

const mocks = vi.hoisted(() => ({
  getAdminQuestionEditorMeta: vi.fn(),
  getAdminQuestionEditor: vi.fn(),
  createAdminQuestion: vi.fn(),
  updateAdminQuestion: vi.fn(),
  captureException: vi.fn(),
}))

vi.mock('../features/admin/adminContentApi', () => ({
  getAdminQuestionEditorMeta: mocks.getAdminQuestionEditorMeta,
  getAdminQuestionEditor: mocks.getAdminQuestionEditor,
  createAdminQuestion: mocks.createAdminQuestion,
  updateAdminQuestion: mocks.updateAdminQuestion,
}))

vi.mock('../lib/monitoring', () => ({
  monitoring: {
    captureException: mocks.captureException,
  },
}))

function configureLoad() {
  mocks.getAdminQuestionEditorMeta.mockResolvedValue({
    constructs: [
      {
        id: '11111111-1111-4111-8111-111111111111',
        code: 'AX-01',
        title_uz: 'Axborot tushunchasi',
        subject_id: '22222222-2222-4222-8222-222222222222',
        group_code: 'S1.INFO',
      },
    ],
    subjects: [
      {
        id: '22222222-2222-4222-8222-222222222222',
        code: 'INF',
        name_uz: 'Informatika',
      },
    ],
  })
}

describe('QuestionFormModal backend boundary', () => {
  beforeEach(() => {
    mocks.getAdminQuestionEditorMeta.mockReset()
    mocks.getAdminQuestionEditor.mockReset()
    mocks.createAdminQuestion.mockReset()
    mocks.updateAdminQuestion.mockReset()
    mocks.captureException.mockReset()
  })

  it('konstruktlarni backenddan yuklaydi va Y2 cheklovini aniq ko‘rsatadi', async () => {
    const user = userEvent.setup()
    configureLoad()

    render(<QuestionFormModal onClose={vi.fn()} onSaved={vi.fn()} />)

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

    render(<QuestionFormModal onClose={vi.fn()} onSaved={vi.fn()} />)

    await screen.findByRole('option', { name: 'AX-01 — Axborot tushunchasi' })
    await user.click(screen.getByRole('button', { name: 'Yaratish' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Savol matnini kiriting',
    )
  })

  it('matn bor, konstrukt yo‘q bo‘lsa saqlashni to‘xtatadi', async () => {
    const user = userEvent.setup()
    configureLoad()

    render(<QuestionFormModal onClose={vi.fn()} onSaved={vi.fn()} />)

    await screen.findByRole('option', { name: 'AX-01 — Axborot tushunchasi' })
    await user.type(screen.getByLabelText('Savol matni'), 'Axborot nima?')
    await user.click(screen.getByRole('button', { name: 'Yaratish' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Konstruktni tanlang',
    )
    expect(mocks.createAdminQuestion).not.toHaveBeenCalled()
    expect(mocks.captureException).not.toHaveBeenCalled()
  })
})
