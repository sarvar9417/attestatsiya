import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  typedSupabase: {
    from: mocks.from,
  },
}))

type CountResult = {
  count: number | null
  error: { message: string } | null
}

function queueResults(results: CountResult[]) {
  for (const result of results) {
    mocks.from.mockReturnValueOnce({
      select: vi.fn().mockResolvedValue(result),
    })
  }
}

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>,
  )
}

describe('AdminDashboard Figma UI', () => {
  beforeEach(() => {
    mocks.from.mockReset()
  })

  it('Supabase count natijalarini ko‘rsatadi', async () => {
    queueResults([
      { count: 16, error: null },
      { count: 3842, error: null },
      { count: 1, error: null },
      { count: 1248, error: null },
    ])

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('3 842')).toBeDefined()
    })

    expect(screen.getByText('1 248')).toBeDefined()
    expect(screen.getAllByText('16').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1').length).toBeGreaterThan(0)
    expect(mocks.from).toHaveBeenCalledWith('modules')
    expect(mocks.from).toHaveBeenCalledWith('questions')
    expect(mocks.from).toHaveBeenCalledWith('blueprints')
    expect(mocks.from).toHaveBeenCalledWith('profiles')
  })

  it('count so‘rovlaridan biri xato bersa alert chiqaradi', async () => {
    queueResults([
      { count: null, error: { message: 'Ruxsat berilmadi' } },
      { count: 0, error: null },
      { count: 0, error: null },
      { count: 0, error: null },
    ])

    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Ruxsat berilmadi')
    expect(
      screen.getByRole('button', { name: 'Qayta urinish' }),
    ).toBeDefined()
  })

  it('Yangilash tugmasi count so‘rovlarini qayta yuboradi', async () => {
    const user = userEvent.setup()

    queueResults([
      { count: 16, error: null },
      { count: 10, error: null },
      { count: 1, error: null },
      { count: 3, error: null },
    ])
    queueResults([
      { count: 16, error: null },
      { count: 11, error: null },
      { count: 1, error: null },
      { count: 4, error: null },
    ])

    renderPage()

    await waitFor(() => {
      expect(screen.getAllByText('10').length).toBeGreaterThan(0)
    })

    await user.click(screen.getByRole('button', { name: 'Yangilash' }))

    await waitFor(() => {
      expect(screen.getAllByText('11').length).toBeGreaterThan(0)
    })

    expect(mocks.from).toHaveBeenCalledTimes(8)
  })
})
