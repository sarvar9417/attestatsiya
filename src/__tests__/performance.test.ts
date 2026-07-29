import { describe, it, expect } from 'vitest'

describe('Performance utilities', () => {
  it('measureRenderTime returns a cleanup function', async () => {
    const mod = await import('../lib/performance')
    const cleanup = mod.measureRenderTime('Test')
    expect(typeof cleanup).toBe('function')
    cleanup()
  })
})
