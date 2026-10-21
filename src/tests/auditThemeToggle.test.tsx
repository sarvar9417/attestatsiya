import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../components/exam/ThemeToggle'

describe('theme toggle regression', () => {
  beforeEach(() => {
    localStorage.setItem('theme', 'system')
    document.documentElement.classList.add('dark')
  })
  afterEach(() => {
    localStorage.removeItem('theme')
    document.documentElement.classList.remove('dark')
  })

  it('does not overwrite a saved system preference when mounted', () => {
    render(<ThemeToggle />)
    expect(localStorage.getItem('theme')).toBe('system')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(screen.getByRole('button', { name: /Yorug‘ rejimga/ })).toBeInTheDocument()
  })

  it('toggles the effective theme through the shared theme service', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: /Yorug‘ rejimga/ }))
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    await user.click(screen.getByRole('button', { name: /Qorong‘i rejimga/ }))
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
