import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BookOpen } from 'lucide-react'
import EmptyState from '../EmptyState'

describe('EmptyState', () => {
  it('renders title and icon', () => {
    render(<EmptyState icon={BookOpen} title="No words yet" />)
    expect(screen.getByText('No words yet')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState icon={BookOpen} title="Empty" description="Add your first item" />)
    expect(screen.getByText('Add your first item')).toBeInTheDocument()
  })

  it('renders action button when provided', () => {
    const onClick = vi.fn()
    render(<EmptyState icon={BookOpen} title="Empty" action={{ label: 'Add', onClick }} />)
    const btn = screen.getByText('Add')
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not render description or action when not provided', () => {
    render(<EmptyState icon={BookOpen} title="Only title" />)
    expect(screen.getByText('Only title')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('applies sm size classes', () => {
    const { container } = render(<EmptyState icon={BookOpen} title="Small" size="sm" />)
    expect(container.querySelector('.py-8')).toBeInTheDocument()
  })

  it('applies lg size classes', () => {
    const { container } = render(<EmptyState icon={BookOpen} title="Large" size="lg" />)
    expect(container.querySelector('.py-16')).toBeInTheDocument()
  })
})
