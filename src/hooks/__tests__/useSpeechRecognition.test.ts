import { describe, it, expect, beforeEach } from 'vitest'
import { clearSharedMicStream, getSharedMicStream, waitForSharedMicStream } from '../useSpeechRecognition'

describe('clearSharedMicStream', () => {
  beforeEach(() => {
    clearSharedMicStream()
  })

  it('null/undefined stream da xatolik bermaydi', () => {
    expect(getSharedMicStream()).toBeNull()
    expect(() => clearSharedMicStream()).not.toThrow()
  })

  it('takroriy chaqiruvda idempotent', () => {
    clearSharedMicStream()
    clearSharedMicStream()
    clearSharedMicStream()
    expect(getSharedMicStream()).toBeNull()
  })
})

describe('waitForSharedMicStream', () => {
  beforeEach(() => {
    clearSharedMicStream()
  })

  it('shared stream bo\'lmasa timeout dan keyin null qaytaradi', async () => {
    const result = await waitForSharedMicStream(10)
    expect(result).toBeNull()
  })

  it('shared stream bo\'lsa darhol resolve bo\'ladi (getSharedMicStream)', () => {
    expect(getSharedMicStream()).toBeNull()
  })
})

describe('getSharedMicStream', () => {
  beforeEach(() => {
    clearSharedMicStream()
  })

  it('clearSharedMicStream dan keyin null qaytaradi', () => {
    clearSharedMicStream()
    expect(getSharedMicStream()).toBeNull()
  })
})
