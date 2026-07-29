import { describe, it, expect } from 'vitest'
import { assignSpeakerVoices } from '../voiceGender'

describe('voiceGender', () => {
  describe('assignSpeakerVoices', () => {
    it('returns a Map for all speakers', () => {
      const result = assignSpeakerVoices(['Alice', 'Bob', 'Teacher'])
      expect(result).toBeInstanceOf(Map)
      expect(result.size).toBe(3)
    })

    it('returns default voice values for each speaker in jsdom (no speechSynthesis)', () => {
      const result = assignSpeakerVoices(['Alice', 'John'])
      const alice = result.get('Alice')!
      const john = result.get('John')!
      // In jsdom, speechSynthesis is not available, so all get default { pitch: 1, rate: 0.88, voice: null }
      expect(alice.voice).toBeNull()
      expect(john.voice).toBeNull()
      expect(alice.pitch).toBeGreaterThan(0)
      expect(alice.rate).toBeGreaterThan(0)
    })

    it('returns fallback values in non-browser environment', () => {
      const result = assignSpeakerVoices(['Test1', 'Test2'])
      for (const voice of result.values()) {
        expect(voice.voice).toBeNull()
        expect(voice.pitch).toBeGreaterThan(0)
        expect(voice.rate).toBeGreaterThan(0)
      }
    })

    it('handles empty array', () => {
      const result = assignSpeakerVoices([])
      expect(result.size).toBe(0)
    })

    it('handles single speaker', () => {
      const result = assignSpeakerVoices(['Alice'])
      expect(result.size).toBe(1)
      expect(result.has('Alice')).toBe(true)
    })
  })
})
