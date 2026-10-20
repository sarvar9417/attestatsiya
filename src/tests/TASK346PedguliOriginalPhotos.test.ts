import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('TASK-346 original Telegram pedagogy method photos', () => {
  const verified = [
    {
      file: 'pedguli-4842-classroom-game.jpg',
      telegramId: 4842,
      bytes: 131219,
      sha256: '5a95d7874adc55bddd47fb966150a5051ec926379841d36c5e560fca072d9783',
    },
    {
      file: 'pedguli-4843-debate.jpg',
      telegramId: 4843,
      bytes: 96247,
      sha256: 'ef131306d4b4ff3e65cf457c64fdcb5d205fd51127147437b87076724e790419',
    },
  ] as const

  it('preserves both original images byte-for-byte, not fabricated placeholders', () => {
    for (const entry of verified) {
      const data = readFileSync(join(process.cwd(), 'public', 'pedguli-source', entry.file))
      expect(data.byteLength, String(entry.telegramId)).toBe(entry.bytes)
      expect(data.subarray(0, 3).toString('hex'), entry.file).toBe('ffd8ff')
      expect(createHash('sha256').update(data).digest('hex'), entry.file).toBe(entry.sha256)
    }
  })
})
