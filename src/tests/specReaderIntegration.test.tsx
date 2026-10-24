import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SpecSectionReaderPage from '../pages/SpecSectionReaderPage'

const mocks = vi.hoisted(() => ({
  getReaderPage: vi.fn(),
  getReaderState: vi.fn(),
  saveReaderPosition: vi.fn(),
  changeReaderMark: vi.fn(),
}))
vi.mock('../features/content/specReaderApi', async original => {
  const actual = await original<typeof import('../features/content/specReaderApi')>()
  return { ...actual, ...mocks }
})
vi.mock('../components/learning/theory/InlineText', () => ({
  default: ({ text }: { text: string }) => <span>{text}</span>,
}))
vi.mock('../components/exam/CodeBlock', () => ({
  default: ({ code }: { code: string }) => <pre><code>{code}</code></pre>,
  parseCodeBlocks: (s: string) => [{ type: 'text', content: s }],
}))

const id = (i: number) => '11111111-1111-4111-8111-' + String(i).padStart(12, '0')
const first = {
  id: id(1), format: 'Y1', group_code: 'S3.LOGIC', stem_md: 'Mantiqiy savol',
  options: [2, 3, 4, 5].map((i, n) => ({
    id: id(i), side: 'a', order_idx: n + 1, content_md: ['A var', 'B var', 'C var', 'D var'][n],
  })),
  correct_answer: { correct_option_id: id(3) }, explanation_md: 'Mantiqiy javobning sababi.',
}
const second = {
  id: id(10), format: 'Y2', group_code: 'S3.ALG', stem_md: 'Juftliklarni aniqlang',
  options: [
    { id: id(11), side: 'a', order_idx: 1, content_md: 'Chap A' },
    { id: id(12), side: 'a', order_idx: 2, content_md: 'Chap B' },
    { id: id(13), side: 'b', order_idx: 1, content_md: 'O‘ng A' },
    { id: id(14), side: 'b', order_idx: 2, content_md: 'O‘ng B' },
    { id: id(15), side: 'b', order_idx: 3, content_md: 'Chalg‘ituvchi' },
  ],
  correct_answer: { pairs: { [id(11)]: id(13), [id(12)]: id(14) } },
  explanation_md: 'Mosliklar tushuntirildi.',
}
const third = {
  id: id(20), format: 'Y3', group_code: 'S3.ALG', stem_md: 'Ketma-ketlik savoli',
  options: [
    { id: id(21), side: 'a', order_idx: 1, content_md: 'Oldingi bosqich' },
    { id: id(22), side: 'a', order_idx: 2, content_md: 'Keyingi bosqich' },
  ],
  correct_answer: { order: [id(22), id(21)] }, explanation_md: 'Tartib izohi.',
}
function mount(code = 'S3') {
  return render(<MemoryRouter initialEntries={[`/learn/spec/${code}/read`]}>
    <Routes>
      <Route path="/learn/spec/:sectionCode/read" element={<SpecSectionReaderPage />} />
    </Routes>
  </MemoryRouter>)
}

describe('TASK-601 reading pages: display, reveal, mark, filter and resume', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mocks.getReaderState.mockResolvedValue({
      page: 1, page_size: 30, search: '', review_only: false, marks: {},
    })
    mocks.getReaderPage.mockImplementation(async (_: string, p: { page: number; pageSize: number }) => ({
      questions: [first, second, third], total: p.pageSize === 50 ? 75 : 65,
      page: p.page, page_size: p.pageSize,
    }))
    mocks.saveReaderPosition.mockResolvedValue({ saved: true })
    mocks.changeReaderMark.mockResolvedValue({ saved: true })
  })

  it('renders all 3 formats with Y1 correct choice, Y2 pairing, Y3 sequence and explanations', async () => {
    mount()
    expect(await screen.findByText('Mantiqiy savol')).toBeInTheDocument()
    expect(screen.getByText('Juftliklarni aniqlang')).toBeInTheDocument()
    expect(screen.getByText('Ketma-ketlik savoli')).toBeInTheDocument()
    expect(screen.getByText('To‘g‘ri mosliklar')).toBeInTheDocument()
    expect(screen.getByText('Tartib izohi.')).toBeInTheDocument()
    expect(screen.getByText('Mantiqiy javobning sababi.')).toBeInTheDocument()
    expect(screen.getByText('Chalg‘ituvchi')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Test ishlash' })).toHaveAttribute('href', '/learn/spec/S3')
  })

  it('hides both keys and explanations; restores visibility without new network calls', async () => {
    mount()
    await screen.findByText('Mantiqiy savol')
    fireEvent.click(screen.getByRole('checkbox', { name: /Javoblarni ko‘rsatish/ }))
    expect(screen.queryByText('To‘g‘ri mosliklar')).not.toBeInTheDocument()
    expect(screen.queryByText('Tartib izohi.')).not.toBeInTheDocument()
    expect(screen.getByText('B var')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('checkbox', { name: /Javoblarni ko‘rsatish/ }))
    expect(screen.getByText('To‘g‘ri mosliklar')).toBeInTheDocument()
    expect(mocks.getReaderPage).toHaveBeenCalledTimes(1)
  })

  it('persists a marked question and switches review-only, search and 50-per-page', async () => {
    mount()
    await screen.findByText('Mantiqiy savol')
    const mark = screen.getAllByRole('button', { name: 'Qayta ko‘raman' })[0]
    fireEvent.click(mark)
    await waitFor(() => expect(mocks.changeReaderMark).toHaveBeenCalledWith('S3', first.id, 'review'))
    await waitFor(() => expect(screen.getByText(/Qayta ko‘raman: 1 ta/)).toBeInTheDocument())
    fireEvent.click(screen.getByRole('checkbox', { name: /Faqat «Qayta ko‘raman»/ }))
    await waitFor(() => expect(mocks.getReaderPage).toHaveBeenCalledWith('S3', expect.objectContaining({ reviewOnly: true })))
    fireEvent.change(screen.getByRole('textbox', { name: /Savol matnidan qidirish/ }), { target: { value: 'Python' } })
    fireEvent.click(screen.getByRole('button', { name: 'Qidirish' }))
    await waitFor(() => expect(mocks.getReaderPage).toHaveBeenCalledWith('S3', expect.objectContaining({ search: 'Python' })))
    fireEvent.change(screen.getByRole('combobox', { name: /Sahifadagi savollar soni/ }), { target: { value: '50' } })
    await waitFor(() => expect(mocks.saveReaderPosition).toHaveBeenCalledWith('S3', expect.objectContaining({ pageSize: 50 })))
  })

  it('restores saved page, size and search from account state', async () => {
    mocks.getReaderState.mockResolvedValueOnce({
      page: 3, page_size: 50, search: 'algoritm', review_only: true,
      marks: { [first.id]: 'memorized' },
    })
    mocks.getReaderPage.mockResolvedValue({
      questions: [first], total: 151, page: 3, page_size: 50,
    })
    mount()
    expect(await screen.findByText('Mantiqiy savol')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /Savol matnidan qidirish/ })).toHaveValue('algoritm')
    expect(mocks.getReaderPage).toHaveBeenCalledWith('S3', {
      page: 3, pageSize: 50, search: 'algoritm', reviewOnly: true,
    })
    expect(screen.getByRole('button', { name: 'Yodladim' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('does not query invalid main section', () => {
    mount('M01')
    expect(screen.getByText(/Bunday bo‘lim topilmadi/)).toBeInTheDocument()
    expect(mocks.getReaderState).not.toHaveBeenCalled()
  })
})
