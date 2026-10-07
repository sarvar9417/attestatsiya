import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ReviewPage from '../pages/ReviewPage'
import { progressGateway } from '../features/progress/progressGateway'
import type { DueReviewItem } from '../features/exam/contracts'

const dueItems: DueReviewItem[] = [
  {
    construct_id: '00000000-0000-4000-8000-000000000101',
    title_uz: 'Axborot hajmini hisoblash',
    group_code: 'S1.INFO',
    due_at: '2026-10-07T08:00:00.000Z',
    accuracy: 42,
  },
  {
    construct_id: '00000000-0000-4000-8000-000000000102',
    title_uz: 'Sanoq sistemalarida amallar',
    group_code: 'S3.NUM',
    due_at: null,
    accuracy: 81,
  },
]

function renderPage() {
  return render(
    <MemoryRouter>
      <ReviewPage />
    </MemoryRouter>
  )
}

describe('ReviewPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('serverdagi due-review konstruktlarini va real aniqliklarni ko‘rsatadi', async () => {
    vi.spyOn(progressGateway, 'getDueReviews').mockResolvedValue(dueItems)

    renderPage()

    expect(await screen.findByText('Axborot hajmini hisoblash')).toBeDefined()
    expect(screen.getByText('Sanoq sistemalarida amallar')).toBeDefined()
    expect(screen.getByText('42%')).toBeDefined()
    expect(screen.getByText('81%')).toBeDefined()
    expect(screen.getByText('2', { selector: 'p' })).toBeDefined()
    expect(screen.getByText('1', { selector: 'p' })).toBeDefined()
    expect(screen.getByText('62%')).toBeDefined()
    expect(progressGateway.getDueReviews).toHaveBeenCalledTimes(1)
    expect(
      screen.getByRole('link', { name: /Qayta tekshirishni boshlash/ })
    ).toHaveAttribute('href', '/exam/takrorlash')
  })

  it('bo‘sh server ro‘yxatida xavfsiz empty state ko‘rsatadi', async () => {
    vi.spyOn(progressGateway, 'getDueReviews').mockResolvedValue([])

    renderPage()

    expect(
      await screen.findByRole('heading', {
        name: 'Hozircha takrorlash kerak emas',
      })
    ).toBeDefined()
    expect(screen.getByRole('link', { name: /O‘rganishga o‘tish/ })).toBeDefined()
  })

  it('API xatosidan keyin qayta urinish ishlaydi', async () => {
    const mock = vi
      .spyOn(progressGateway, 'getDueReviews')
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce([dueItems[0]])

    renderPage()

    expect(await screen.findByRole('alert')).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'Qayta urinish' }))

    await waitFor(() => {
      expect(mock).toHaveBeenCalledTimes(2)
    })
    expect(await screen.findByText('Axborot hajmini hisoblash')).toBeDefined()
  })
})
