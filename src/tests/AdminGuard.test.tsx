import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminGuard from '../components/auth/AdminGuard'

function renderGuard(loadRole: (userId: string) => Promise<string | null>, userId = 'user-1') {
  return render(
    <MemoryRouter>
      <AdminGuard userId={userId} loadRole={loadRole}>
        <div>Himoyalangan admin kontenti</div>
      </AdminGuard>
    </MemoryRouter>
  )
}

describe('AdminGuard', () => {
  it.each(['admin', 'editor'])('%s roliga admin panelni ko‘rsatadi', async (role) => {
    renderGuard(vi.fn().mockResolvedValue(role))

    expect(await screen.findByText('Himoyalangan admin kontenti')).toBeDefined()
  })

  it('oddiy foydalanuvchini deny-by-default bilan bloklaydi', async () => {
    renderGuard(vi.fn().mockResolvedValue('user'))

    expect(await screen.findByText('Kirish taqiqlangan')).toBeDefined()
    expect(screen.queryByText('Himoyalangan admin kontenti')).toBeNull()
  })

  it('profilni yuklash xatosida admin kontentni ochmaydi', async () => {
    renderGuard(vi.fn().mockRejectedValue(new Error('profile unavailable')))

    expect(await screen.findByText('Kirish taqiqlangan')).toBeDefined()
    expect(screen.queryByText('Himoyalangan admin kontenti')).toBeNull()
  })

  it('user id bo‘lmasa admin kontentni ochmaydi', () => {
    renderGuard(vi.fn(), '')

    expect(screen.getByText('Kirish taqiqlangan')).toBeDefined()
    expect(screen.queryByText('Himoyalangan admin kontenti')).toBeNull()
  })
})
