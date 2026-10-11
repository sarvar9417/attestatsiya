import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'

const mocks = vi.hoisted(() => ({
  getAdminDashboardStats: vi.fn(),
}))

vi.mock('../features/admin/adminContentApi', () => ({
  getAdminDashboardStats: mocks.getAdminDashboardStats,
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>,
  )
}

describe('AdminDashboard backend boundary', () => {
  beforeEach(() => {
    mocks.getAdminDashboardStats.mockReset()
  })

  it('backend count natijalarini ko‘rsatadi', async () => {
    mocks.getAdminDashboardStats.mockResolvedValue({
      role: 'admin',
      modules: 16,
      questions: 3842,
      blueprints: 1,
      users: 1248,
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getAllByText('3 842').length).toBeGreaterThan(0)
    })

    expect(screen.getByText('1 248')).toBeDefined()
    expect(screen.getAllByText('16').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1').length).toBeGreaterThan(0)
    expect(mocks.getAdminDashboardStats).toHaveBeenCalledTimes(1)
  })

  it('editor uchun private user count ko‘rsatilmaydi', async () => {
    mocks.getAdminDashboardStats.mockResolvedValue({
      role: 'editor',
      modules: 16,
      questions: 100,
      blueprints: 1,
      users: null,
    })

    renderPage()

    await waitFor(() => {
      expect(mocks.getAdminDashboardStats).toHaveBeenCalledTimes(1)
    })
    expect(screen.getAllByText('—').length).toBeGreaterThan(0)
  })

  it('backend xatosida alert chiqaradi', async () => {
    mocks.getAdminDashboardStats.mockRejectedValue(new Error('Ruxsat berilmadi'))

    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Ruxsat berilmadi')
    expect(screen.getByRole('button', { name: 'Qayta urinish' })).toBeDefined()
  })

  it('Yangilash tugmasi backend count so‘rovini qayta yuboradi', async () => {
    const user = userEvent.setup()
    mocks.getAdminDashboardStats
      .mockResolvedValueOnce({
        role: 'admin',
        modules: 16,
        questions: 10,
        blueprints: 1,
        users: 3,
      })
      .mockResolvedValueOnce({
        role: 'admin',
        modules: 16,
        questions: 11,
        blueprints: 1,
        users: 4,
      })

    renderPage()

    await waitFor(() => {
      expect(screen.getAllByText('10').length).toBeGreaterThan(0)
    })

    await user.click(screen.getByRole('button', { name: 'Yangilash' }))

    await waitFor(() => {
      expect(screen.getAllByText('11').length).toBeGreaterThan(0)
    })

    expect(mocks.getAdminDashboardStats).toHaveBeenCalledTimes(2)
  })
})
