import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ExamResultPage from '../pages/ExamResultPage'
import { backendGateway } from '../features/exam/backendGateway'
import type { ExamResultDetail } from '../features/exam/contracts'

const examId = '00000000-0000-4000-8000-000000000201'

const result: ExamResultDetail = {
  exam_id: examId,
  kind: 'mavzu',
  lesson_id: '00000000-0000-4000-8000-000000000301',
  lesson_slug: 'm01-02',
  lesson_title_uz: 'Axborot hajmini hisoblash',
  started_at: '2026-10-07T08:00:00.000Z',
  finished_at: '2026-10-07T08:20:00.000Z',
  total_score: 32,
  max_score: 40,
  passed: true,
  breakdown: [{ group_code: 'S1.INFO', jami: 20, togri: 16 }],
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={[`/results/${examId}`]}>
      <Routes>
        <Route path="/results/:examId" element={<ExamResultPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ExamResultPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('serverdagi finalized natijani va guruh kesimini ko‘rsatadi', async () => {
    const getResult = vi.spyOn(backendGateway, 'getResult').mockResolvedValue(result)
    const getReview = vi.spyOn(backendGateway, 'getReview').mockResolvedValue([])

    renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Axborot hajmini hisoblash' })
    ).toBeDefined()
    expect(screen.getByText('32 / 40')).toBeDefined()
    expect(screen.getByText('80% natija')).toBeDefined()
    expect(screen.getByText('S1.INFO')).toBeDefined()
    expect(screen.getByText('16 / 20')).toBeDefined()
    expect(getResult).toHaveBeenCalledWith(examId)
    expect(getReview).not.toHaveBeenCalled()
  })

  it('savollar tahlilini faqat foydalanuvchi ochganda serverdan oladi', async () => {
    vi.spyOn(backendGateway, 'getResult').mockResolvedValue(result)
    const getReview = vi.spyOn(backendGateway, 'getReview').mockResolvedValue([
      {
        order_idx: 1,
        stem_md: 'Axborot hajmi savoli',
        format: 'Y1',
        construct: 'S1.INFO.01',
        user_answer: { option_id: 'a' },
        is_correct: false,
        key: { option_id: 'b' },
        explanation_md: 'Bit va bayt nisbatini tekshiring.',
      },
    ])

    renderPage()

    await screen.findByText('32 / 40')
    expect(getReview).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /Tahlilni ochish/ }))

    expect(await screen.findByText('S1.INFO.01')).toBeDefined()
    expect(screen.getByText('Xato')).toBeDefined()
    expect(screen.getByText(/Bit va bayt nisbatini tekshiring/)).toBeDefined()
    expect(getReview).toHaveBeenCalledWith(examId)
  })

  it('result API xatosidan keyin retry qiladi', async () => {
    const getResult = vi
      .spyOn(backendGateway, 'getResult')
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(result)

    renderPage()

    expect(await screen.findByRole('alert')).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'Qayta urinish' }))

    await waitFor(() => expect(getResult).toHaveBeenCalledTimes(2))
    expect(
      await screen.findByRole('heading', { name: 'Axborot hajmini hisoblash' })
    ).toBeDefined()
  })
})
