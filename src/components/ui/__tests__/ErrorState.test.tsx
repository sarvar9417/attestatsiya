import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { AlertTriangle } from 'lucide-react'
import ErrorState from '../ErrorState'

describe('ErrorState', () => {
  it('renders title', () => {
    render(<ErrorState title="Xatolik yuz berdi" />)
    expect(screen.getByText('Xatolik yuz berdi')).toBeInTheDocument()
  })

  it('renders default title when not provided', () => {
    render(<ErrorState />)
    expect(screen.getByText('Xatolik yuz berdi')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<ErrorState title="Error" description="Try again later" />)
    expect(screen.getByText('Try again later')).toBeInTheDocument()
  })

  it('renders error message from Error object when no description', () => {
    render(<ErrorState title="Error" error={new Error('Network failed')} />)
    expect(screen.getByText('Network failed')).toBeInTheDocument()
  })

  it('renders error message from string when no description', () => {
    render(<ErrorState title="Error" error="Connection lost" />)
    expect(screen.getByText('Connection lost')).toBeInTheDocument()
  })

  it('description takes priority over error message', () => {
    render(
      <ErrorState
        title="Error"
        description="Custom description"
        error="From error"
      />
    )
    expect(screen.getByText('Custom description')).toBeInTheDocument()
    expect(screen.queryByText('From error')).not.toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', () => {
    const onRetry = vi.fn()
    render(<ErrorState title="Error" onRetry={onRetry} />)
    const btn = screen.getByRole('button', { name: /Qayta urinish/ })
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('uses custom retry label when provided', () => {
    render(<ErrorState title="Error" onRetry={() => {}} retryLabel="Try again" />)
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorState title="Error" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('has role="alert" for screen readers', () => {
    const { container } = render(<ErrorState title="Error" />)
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <ErrorState
        icon={AlertTriangle}
        title="Xatolik"
        description="Tarmoq xatosi"
        onRetry={() => {}}
      />
    )
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })

  it('applies sm size classes', () => {
    const { container } = render(<ErrorState title="Error" size="sm" />)
    expect(container.querySelector('.py-8')).toBeInTheDocument()
  })

  it('applies lg size classes', () => {
    const { container } = render(<ErrorState title="Error" size="lg" />)
    expect(container.querySelector('.py-16')).toBeInTheDocument()
  })
})
