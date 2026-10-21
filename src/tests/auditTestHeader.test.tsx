import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import TestHeader from '../components/exam/TestHeader'

vi.mock('../components/exam/ThemeToggle', () => ({ default: () => null }))

describe('test header connectivity', () => {
  const original = Object.getOwnPropertyDescriptor(window.navigator, 'onLine')
  afterEach(() => {
    if (original) Object.defineProperty(window.navigator, 'onLine', original)
    else Reflect.deleteProperty(window.navigator, 'onLine')
  })

  function setOnline(online: boolean) {
    Object.defineProperty(window.navigator, 'onLine', { configurable: true, value: online })
    act(() => {
      window.dispatchEvent(new Event(online ? 'online' : 'offline'))
    })
  }

  it('updates the offline badge on network events without another page render', () => {
    setOnline(true)
    render(<TestHeader onExit={vi.fn()} onHelp={vi.fn()} />)
    expect(screen.getByText('Avtomatik saqlash')).toBeInTheDocument()

    setOnline(false)
    expect(screen.getByText('Oflayn')).toBeInTheDocument()
    expect(screen.queryByText('Avtomatik saqlash')).not.toBeInTheDocument()

    setOnline(true)
    expect(screen.getByText('Avtomatik saqlash')).toBeInTheDocument()
  })
})
