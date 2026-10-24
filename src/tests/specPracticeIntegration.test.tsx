import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SpecSectionPracticePage from '../pages/SpecSectionPracticePage'
import type { SpecQuestion } from '../features/content/specPracticeApi'

const mocks = vi.hoisted(() => ({
  getSpecQuestions: vi.fn(),
  checkSpecAnswer: vi.fn(),
}))

vi.mock('../features/content/specPracticeApi', async importOriginal => {
  const original = await importOriginal<typeof import('../features/content/specPracticeApi')>()
  return {
    ...original,
    getSpecQuestions: mocks.getSpecQuestions,
    checkSpecAnswer: mocks.checkSpecAnswer,
  }
})

vi.mock('../components/learning/theory/InlineText', () => ({
  default: ({ text }: { text: string }) => <span>{text}</span>,
}))

const id = (n: number) => '22222222-2222-4222-8222-' + n.toString(16).padStart(12, '0')

const first: SpecQuestion = {
  id: id(1), group_code: 'S3.NUM', format: 'Y1', stem_md: 'Birinchi savol',
  assets: [],
  options: [1, 2, 3, 4].map(n => ({
    id: id(10 + n), side: 'a', order_idx: n,
    content_md: n === 1 ? 'A variant' : n === 2 ? 'B variant' : 'Variant ' + n,
  })),
}
const second: SpecQuestion = {
  id: id(2), group_code: 'S3.LOGIC', format: 'Y2', stem_md: 'Moslashtirish savoli',
  assets: [],
  options: [
    { id: id(31), side: 'a', order_idx: 1, content_md: 'Chap 1' },
    { id: id(32), side: 'a', order_idx: 2, content_md: 'Chap 2' },
    { id: id(33), side: 'b', order_idx: 1, content_md: 'O‘ng 1' },
    { id: id(34), side: 'b', order_idx: 2, content_md: 'O‘ng 2' },
  ],
}
const third: SpecQuestion = {
  id: id(3), group_code: 'S3.ALGO', format: 'Y3', stem_md: 'Tartiblash savoli',
  assets: [],
  options: [
    { id: id(41), side: 'a', order_idx: 1, content_md: 'Qadam 1' },
    { id: id(42), side: 'a', order_idx: 2, content_md: 'Qadam 2' },
  ],
}

describe('TASK-600: specification section practice screen', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mocks.getSpecQuestions.mockResolvedValue({
      questions: [first, second, third], total: 3, next_cursor: null,
    })
    mocks.checkSpecAnswer.mockImplementation(async (_section: string, qid: string) => {
      if (qid === first.id) return {
        correct: false,
        correct_answer: { option_id: first.options[1].id },
        explanation_md: 'Birinchi savol izohi',
      }
      if (qid === second.id) return {
        correct: true,
        correct_answer: { pairs: { [id(31)]: id(33), [id(32)]: id(34) } },
        explanation_md: 'Juftliklar izohi',
      }
      return {
        correct: true,
        correct_answer: { order: [id(42), id(41)] },
        explanation_md: 'Ketma-ketlik izohi',
      }
    })
  })

  it('shows explanation immediately after Y1 selection, checks Y2/Y3, and retains answers on Back', async () => {
    render(<MemoryRouter initialEntries={['/learn/spec/S3']}>
      <Routes>
        <Route path="/learn/spec/:sectionCode" element={<SpecSectionPracticePage />} />
      </Routes>
    </MemoryRouter>)

    expect(await screen.findByText('Birinchi savol')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /A variant/ }))
    expect(await screen.findByText('Birinchi savol izohi')).toBeInTheDocument()
    expect(screen.getByText('Noto‘g‘ri javob')).toBeInTheDocument()
    expect(mocks.checkSpecAnswer).toHaveBeenCalledWith(
      'S3', first.id, { option_id: first.options[0].id },
    )

    fireEvent.click(screen.getByRole('button', { name: /Keyingi savol/ }))
    expect(screen.getByText('Moslashtirish savoli')).toBeInTheDocument()
    const selectsY2 = screen.getAllByRole('combobox')
    fireEvent.change(selectsY2[0], { target: { value: id(33) } })
    fireEvent.change(selectsY2[1], { target: { value: id(34) } })
    fireEvent.click(screen.getByRole('button', { name: 'Javobni tekshirish' }))
    expect(await screen.findByText('Juftliklar izohi')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Keyingi savol/ }))
    expect(screen.getByText('Tartiblash savoli')).toBeInTheDocument()
    const selectsY3 = screen.getAllByRole('combobox')
    fireEvent.change(selectsY3[0], { target: { value: id(42) } })
    fireEvent.change(selectsY3[1], { target: { value: id(41) } })
    fireEvent.click(screen.getByRole('button', { name: 'Javobni tekshirish' }))
    expect(await screen.findByText('Ketma-ketlik izohi')).toBeInTheDocument()
    expect(mocks.checkSpecAnswer).toHaveBeenCalledTimes(3)

    fireEvent.click(screen.getByRole('button', { name: /Oldingi/ }))
    expect(screen.getByText('Moslashtirish savoli')).toBeInTheDocument()
    const stored = screen.getAllByRole('combobox') as HTMLSelectElement[]
    await waitFor(() => {
      expect(stored[0].value).toBe(id(33))
      expect(stored[1].value).toBe(id(34))
    })
    expect(screen.getByText('Juftliklar izohi')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Oldingi/ }))
    expect(screen.getByText('Birinchi savol izohi')).toBeInTheDocument()
    expect(within(screen.getByRole('button', { name: /A variant/ })).getByText('A variant')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /A variant/ })).toBeDisabled()
  })

  it('rejects invalid specification section without contacting backend', () => {
    render(<MemoryRouter initialEntries={['/learn/spec/M05']}>
      <Routes>
        <Route path="/learn/spec/:sectionCode" element={<SpecSectionPracticePage />} />
      </Routes>
    </MemoryRouter>)
    expect(screen.getByText('Bunday spetsifikatsiya bo‘limi mavjud emas.')).toBeInTheDocument()
    expect(mocks.getSpecQuestions).not.toHaveBeenCalled()
  })
})
