import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorDisplay from '../ErrorDisplay'

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
  })
})

describe('ErrorDisplay', () => {
  it('renders title and message', () => {
    render(<ErrorDisplay title="Error" message="Something went wrong" />)
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows retry button when retry handler is provided', () => {
    const retry = vi.fn()
    render(<ErrorDisplay title="Error" message="Oops" retry={retry} />)
    const btn = screen.getByText('Qayta urinish')
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(retry).toHaveBeenCalledTimes(1)
  })

  it('hides retry button when retry is not provided', () => {
    render(<ErrorDisplay title="Error" message="Oops" />)
    expect(screen.queryByText('Qayta urinish')).not.toBeInTheDocument()
  })

  it('shows detail section when detail is provided', () => {
    render(<ErrorDisplay title="Error" message="Oops" detail="Stack trace here" />)
    expect(screen.getByText('Tafsilot')).toBeInTheDocument()
  })

  it('toggles detail visibility on button click', () => {
    render(<ErrorDisplay title="Error" message="Oops" detail="Hidden detail" />)
    expect(screen.queryByText('Hidden detail')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Tafsilot'))
    expect(screen.getByText('Hidden detail')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Tafsilot'))
    expect(screen.queryByText('Hidden detail')).not.toBeInTheDocument()
  })

  it('shows copy button when detail is provided', () => {
    render(<ErrorDisplay title="Error" message="Oops" detail="Details" />)
    expect(screen.getByTitle('Nusxalash')).toBeInTheDocument()
  })

  it('applies offline variant styles', () => {
    const { container } = render(<ErrorDisplay title="Offline" message="No connection" variant="offline" />)
    expect(container.querySelector('.border-orange-100')).toBeInTheDocument()
  })

  it('applies warning variant styles', () => {
    const { container } = render(<ErrorDisplay title="Warning" message="Be careful" variant="warning" />)
    expect(container.querySelector('.border-amber-100')).toBeInTheDocument()
  })
})
