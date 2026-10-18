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
    expect(screen.getByText('Ball: olingan / maksimal')).toBeDefined()
    expect(screen.getByText('16 / 20 ta savol to‘g‘ri')).toBeDefined()
    expect(screen.getByText('80% natija')).toBeDefined()
    expect(screen.getByText('S1.INFO')).toBeDefined()
    expect(screen.getByText('16 / 20')).toBeDefined()
    expect(getResult).toHaveBeenCalledWith(examId)
    expect(getReview).not.toHaveBeenCalled()
  })

  it('pedagogik mashq tarixida 15 savol va 30 ballni alohida ko‘rsatadi', async () => {
    vi.spyOn(backendGateway, 'getResult').mockResolvedValue({
      ...result,
      kind: 'pedagogik_15',
      lesson_id: null,
      lesson_slug: null,
      lesson_title_uz: null,
      total_score: 30,
      max_score: 30,
      passed: null,
      breakdown: [
        { group_code: 'KS', jami: 5, togri: 5 },
        { group_code: 'PM.GEN', jami: 7, togri: 7 },
        { group_code: 'PM.MET', jami: 3, togri: 3 },
      ],
    })

    renderPage()
    expect(await screen.findByText('30 / 30')).toBeDefined()
    expect(screen.getByText('Ball: olingan / maksimal')).toBeDefined()
    expect(screen.getByText('15 / 15 ta savol to‘g‘ri')).toBeDefined()
    expect(screen.getByRole('link', { name: 'Pedagogik mashqlarga qaytish' }).getAttribute('href')).toBe('/professional-practice')
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


  it('yakunlangan testda javobsiz savollarni xato emas, Javobsiz deb ko‘rsatadi', async () => {
    vi.spyOn(backendGateway, 'getResult').mockResolvedValue({
      ...result,
      total_score: 2,
      max_score: 100,
      passed: false,
      breakdown: [{ group_code: 'S1.INFO', jami: 50, togri: 1 }],
    })
    const getReview = vi.spyOn(backendGateway, 'getReview').mockResolvedValue([
      {
        order_idx: 1, stem_md: 'Bajarilgan savol', format: 'Y1',
        user_answer: { option_id: 'a' }, is_correct: true,
        key: { correct_option_id: 'a' }, explanation_md: 'Izoh',
      },
      {
        order_idx: 2, stem_md: 'Xato ishlangan savol', format: 'Y1',
        user_answer: { option_id: 'b' }, is_correct: false,
        key: { correct_option_id: 'a' }, explanation_md: null,
      },
      ...Array.from({ length: 48 }, (_, i) => ({
        order_idx: i + 3, stem_md: `Javobsiz savol ${i + 3}`,
        format: 'Y1' as const, user_answer: null, is_correct: null,
        key: { correct_option_id: 'a' }, explanation_md: null,
      })),
    ])

    renderPage()
    await screen.findByText('2 / 100')
    fireEvent.click(screen.getByRole('button', { name: /Tahlilni ochish/ }))
    expect(await screen.findByText('Javobsiz savol 50')).toBeDefined()
    expect(screen.getAllByText('Javobsiz')).toHaveLength(48)
    expect(screen.getAllByText('Xato')).toHaveLength(1)
    expect(screen.getAllByText('To‘g‘ri')).toHaveLength(1)
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
