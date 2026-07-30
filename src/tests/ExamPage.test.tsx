import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ExamPage from '../pages/ExamPage'

describe('ExamPage xavfsizlik holati', () => {
  it('client-scored mock o‘rniga xavfsiz placeholder ko‘rsatadi', () => {
    render(
      <MemoryRouter>
        <ExamPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Xavfsiz sinov moduli tayyorlanmoqda')).toBeDefined()
    expect(screen.queryByText('Attestatsiya sinov imtihoni')).toBeNull()
  })
})
