import { describe, it, expect } from 'vitest'
import { playSfx } from '../sfx'

describe('sfx', () => {
  it('playSfx is a function', () => {
    expect(typeof playSfx).toBe('function')
  })

  it('playSfx does not throw for all sound names', () => {
    const sounds = ['correct', 'wrong', 'levelup', 'combo', 'milestone', 'streak-burn', 'xp-tick', 'click', 'unknown']
    for (const name of sounds) {
      expect(() => playSfx(name)).not.toThrow()
    }
  })

  it('playSfx with default arg does not throw', () => {
    expect(() => playSfx()).not.toThrow()
  })
})
