import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { useNavigationGuard } from '../useNavigationGuard'

describe('useNavigationGuard', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('sets up beforeunload when shouldBlock is true', () => {
    const addListener = vi.spyOn(window, 'addEventListener')
    const removeListener = vi.spyOn(window, 'removeEventListener')

    const router = createMemoryRouter([
      { path: '/', element: <HookTest shouldBlock /> },
    ], { initialEntries: ['/'] })

    const { unmount } = renderHook(() => useNavigationGuard(true), {
      wrapper: () => <RouterProvider router={router} />
    })
    expect(addListener).toHaveBeenCalledWith('beforeunload', expect.any(Function))

    unmount()
    expect(removeListener).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })

  it('does not set up beforeunload when shouldBlock is false', () => {
    const addListener = vi.spyOn(window, 'addEventListener')

    const router = createMemoryRouter([
      { path: '/', element: <HookTest shouldBlock={false} /> },
    ], { initialEntries: ['/'] })

    renderHook(() => useNavigationGuard(false), {
      wrapper: () => <RouterProvider router={router} />
    })
    expect(addListener).not.toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })
})

function HookTest({ shouldBlock }: { shouldBlock: boolean }) {
  useNavigationGuard(shouldBlock)
  return null
}
