import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PedagogyTheoryBlock from './PedagogyTheoryBlock'

describe('PedagogyTheoryBlock', () => {
  it('renders concepts with accessible emphasis, not raw Markdown stars', () => {
    const { container } = render(
      <PedagogyTheoryBlock block={{ type: 'definition', content: '**Didaktika** — ta’lim nazariyasidir.' }} />,
    )
    expect(screen.getByText('Didaktika').tagName).toBe('STRONG')
    expect(screen.getByText('Asosiy ta’rif')).toBeTruthy()
    expect(container.textContent).not.toContain('**')
  })

  it('shows tabular comparison with semantic headers and horizontal scrolling', () => {
    render(
      <PedagogyTheoryBlock block={{
        type: 'table', content: '',
        headers: ['Tushuncha', 'Misol'],
        rows: [['Metod', 'Suhbat'], ['Vosita', 'Slayd']],
      }} />,
    )
    expect(screen.getByRole('table')).toBeTruthy()
    expect(screen.getByRole('columnheader', { name: 'Tushuncha' })).toBeTruthy()
    expect(screen.getByText('Suhbat')).toBeTruthy()
  })

  it('does not interpret source HTML as markup', () => {
    const { container } = render(
      <PedagogyTheoryBlock block={{ type: 'text', content: '<script>alert("x")</script>' }} />,
    )
    expect(screen.getByText('<script>alert("x")</script>')).toBeTruthy()
    expect(container.querySelector('script')).toBeNull()
  })

  it('renders a separate source attribution with a readable label', () => {
    render(<PedagogyTheoryBlock block={{ type: 'source', content: '**Manba izi:** Xoliqov, 1-bet' }} />)
    expect(screen.getByLabelText('Foydalanilgan manba')).toBeTruthy()
    expect(screen.getByText(/Xoliqov/)).toBeTruthy()
  })
})
