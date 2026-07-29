import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ToastContainer from '../Toast'
import { useToastStore } from '../../utils/toastStore'

beforeEach(() => {
  // Clear all toasts before each test
  useToastStore.getState().clear()
})

describe('ToastContainer', () => {
  it('returns null when no toasts', () => {
    const { container } = render(<ToastContainer />)
    expect(container.innerHTML).toBe('')
  })

  it('renders a toast with message and type', () => {
    useToastStore.getState().toast('Salom dunyo', 'info')

    render(<ToastContainer />)

    expect(screen.getByText('Salom dunyo')).toBeInTheDocument()
  })

  it('renders correct icon for each type', () => {
    useToastStore.getState().toast('Info', 'info')
    useToastStore.getState().toast('Success', 'success')
    useToastStore.getState().toast('Error', 'error')
    useToastStore.getState().toast('Warning', 'warning')

    render(<ToastContainer />)

    expect(screen.getByText('Info')).toBeInTheDocument()
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })

  it('dismisses toast when close button is clicked', async () => {
    const user = userEvent.setup()
    useToastStore.getState().toast('Dismiss me', 'info')

    render(<ToastContainer />)

    expect(screen.getByText('Dismiss me')).toBeInTheDocument()

    // Click the dismiss button
    const allButtons = screen.getAllByRole('button')
    await user.click(allButtons[0])

    // Toast should be removed
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument()
  })

  it('renders multiple toasts in order', () => {
    useToastStore.getState().toast('First', 'info')
    useToastStore.getState().toast('Second', 'info')
    useToastStore.getState().toast('Third', 'info')

    render(<ToastContainer />)

    // Verify all toasts are rendered
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
  })
})
