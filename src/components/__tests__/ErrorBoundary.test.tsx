import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../ErrorBoundary'
import { monitoring } from '../../lib/monitoring'

const ThrowError = () => {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders children when no error', () => {
    render(<ErrorBoundary><div>Hello</div></ErrorBoundary>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('catches error and shows default fallback', () => {
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(screen.getByText('Nimadir xato ketdi')).toBeInTheDocument()
    expect(screen.getByText('Kutilmagan xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.')).toBeInTheDocument()
  })

  it('calls monitoring.captureException on error', () => {
    const spy = vi.spyOn(monitoring, 'captureException').mockImplementation(() => {})
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(spy.mock.calls[0][0].message).toBe('Test error')
    spy.mockRestore()
  })

  it('shows custom fallback when provided', () => {
    render(<ErrorBoundary fallback={<div>Custom fallback</div>}><ThrowError /></ErrorBoundary>)
    expect(screen.getByText('Custom fallback')).toBeInTheDocument()
  })

  it('shows custom title and message', () => {
    render(<ErrorBoundary title="Custom title" message="Custom message"><ThrowError /></ErrorBoundary>)
    expect(screen.getByText('Custom title')).toBeInTheDocument()
    expect(screen.getByText('Custom message')).toBeInTheDocument()
  })

  it('retry button is present in error UI', () => {
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(screen.getByText('Qayta urinish')).toBeInTheDocument()
  })

  it('shows error detail', () => {
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(screen.getByText('Tafsilot')).toBeInTheDocument()
  })
})
