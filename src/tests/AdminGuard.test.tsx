import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminGuard from '../components/auth/AdminGuard'

describe('AdminGuard', () => {
  it('demo rejimda admin kontentni doimiy ravishda ko‘rsatadi', () => {
    render(
      <MemoryRouter>
        <AdminGuard>
          <div>Himoyalangan admin kontenti</div>
        </AdminGuard>
      </MemoryRouter>
    )

    expect(screen.getByText('Himoyalangan admin kontenti')).toBeDefined()
  })
})
