import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from '../NotFound'

describe('NotFound — 404 page', () => {
  function renderPage() {
    return render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
  }

  it('renders 404 heading', () => {
    renderPage()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders not-found message', () => {
    renderPage()
    expect(screen.getByText('Sahifa topilmadi')).toBeInTheDocument()
  })

  it('renders description text', () => {
    renderPage()
    expect(screen.getByText(/Bu manzilda hech qanday sahifa mavjud emas/)).toBeInTheDocument()
  })

  it('renders "Bosh sahifa" link button', () => {
    renderPage()
    expect(screen.getByText('Bosh sahifa')).toBeInTheDocument()
  })

  it('renders "Orqaga" button', () => {
    renderPage()
    expect(screen.getByText('Orqaga')).toBeInTheDocument()
  })
})
