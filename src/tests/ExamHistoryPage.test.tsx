import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ExamHistoryPage from '../pages/ExamHistoryPage'
import { backendGateway } from '../features/exam/backendGateway'
import type { ExamHistoryResponse } from '../features/exam/contracts'

const firstPage: ExamHistoryResponse = {
  items: [
    {
      exam_id: '00000000-0000-4000-8000-000000000201',
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
    },
    {
      exam_id: '00000000-0000-4000-8000-000000000202',
      kind: 'mock',
      lesson_id: null,
      lesson_slug: null,
      lesson_title_uz: null,
      started_at: '2026-10-06T08:00:00.000Z',
      finished_at: '2026-10-06T10:00:00.000Z',
      total_score: 50,
      max_score: 100,
      passed: false,
      breakdown: null,
    },
  ],
  total: 2,
  page: 1,
  page_size: 20,
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ExamHistoryPage />
    </MemoryRouter>
  )
}

describe('ExamHistoryPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('serverdagi faqat learner natijalarini ko‘rsatadi', async () => {
    const mock = vi.spyOn(backendGateway, 'getHistory').mockResolvedValue(firstPage)

    renderPage()

    expect(await screen.findByText('Axborot hajmini hisoblash')).toBeDefined()
    expect(screen.getAllByText('Mock test').length).toBeGreaterThan(0)
    expect(screen.getByText('80%')).toBeDefined()
    expect(screen.getByText('50%')).toBeDefined()
    expect(screen.getByText('2', { selector: 'p' })).toBeDefined()
    expect(mock).toHaveBeenCalledWith(1, 20)
  })

  it('bo‘sh history xavfsiz empty state ko‘rsatadi', async () => {
    vi.spyOn(backendGateway, 'getHistory').mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 20,
    })

    renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Hali yakunlangan sinov yo‘q' })
    ).toBeDefined()
    expect(screen.getByRole('link', { name: /Sinovga o‘tish/ })).toBeDefined()
  })

  it('API xatosidan keyin qayta urinish ishlaydi', async () => {
    const mock = vi
      .spyOn(backendGateway, 'getHistory')
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(firstPage)

    renderPage()

    expect(await screen.findByRole('alert')).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'Qayta urinish' }))

    await waitFor(() => {
      expect(mock).toHaveBeenCalledTimes(2)
    })
    expect(await screen.findByText('Axborot hajmini hisoblash')).toBeDefined()
  })

  it('pagination keyingi sahifani serverdan so‘raydi', async () => {
    const mock = vi
      .spyOn(backendGateway, 'getHistory')
      .mockResolvedValueOnce({ ...firstPage, total: 21 })
      .mockResolvedValueOnce({
        items: [firstPage.items[0]],
        total: 21,
        page: 2,
        page_size: 20,
      })

    renderPage()

    expect(await screen.findByText('1 / 2')).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: /Keyingi/ }))

    await waitFor(() => {
      expect(mock).toHaveBeenLastCalledWith(2, 20)
    })
    expect(await screen.findByText('2 / 2')).toBeDefined()
  })
})
