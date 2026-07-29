import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getVoices, getBestVoice, isSpeaking, isSpeechSupported, speak, stopSpeaking, pauseSpeaking, resumeSpeaking } from '../tts'

describe('tts', () => {
  const mockSpeechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    paused: false,
    getVoices: vi.fn(() => []),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'speechSynthesis', {
      value: mockSpeechSynthesis,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    stopSpeaking()
  })

  describe('isSpeechSupported', () => {
    it('returns true when speechSynthesis exists', () => {
      expect(isSpeechSupported()).toBe(true)
    })
  })

  describe('isSpeaking', () => {
    it('returns false initially', () => {
      expect(isSpeaking()).toBe(false)
    })
  })

  describe('getVoices', () => {
    it('returns voices from speechSynthesis', () => {
      mockSpeechSynthesis.getVoices.mockReturnValue([{ name: 'Google UK', lang: 'en-GB' }])
      const voices = getVoices()
      expect(voices).toHaveLength(1)
    })
  })

  describe('getBestVoice', () => {
    it('returns Google UK voice when available', () => {
      mockSpeechSynthesis.getVoices.mockReturnValue([
        { name: 'Google US', lang: 'en-US' },
        { name: 'Google UK English Female', lang: 'en-GB' },
      ])
      const voice = getBestVoice()
      expect(voice?.name).toContain('Google UK')
    })

    it('falls back to Google US', () => {
      mockSpeechSynthesis.getVoices.mockReturnValue([
        { name: 'Google US', lang: 'en-US' },
      ])
      const voice = getBestVoice()
      expect(voice?.name).toContain('Google US')
    })

    it('falls back to language match', () => {
      mockSpeechSynthesis.getVoices.mockReturnValue([
        { name: 'Custom English', lang: 'en-US' },
      ])
      const voice = getBestVoice('en-US')
      expect(voice?.name).toBe('Custom English')
    })

    it('returns first voice as last resort', () => {
      mockSpeechSynthesis.getVoices.mockReturnValue([
        { name: 'Any Voice', lang: 'fr-FR' },
      ])
      const voice = getBestVoice()
      expect(voice?.name).toBe('Any Voice')
    })

    it('returns undefined when no voices', () => {
      mockSpeechSynthesis.getVoices.mockReturnValue([])
      const voice = getBestVoice()
      expect(voice).toBeUndefined()
    })
  })

  describe('speak', () => {
    it('rejects when speechSynthesis not supported', async () => {
      // @ts-expect-error testing unsupported
      delete window.speechSynthesis
      await expect(speak('hello')).rejects.toThrow()
      // Restore
      Object.defineProperty(window, 'speechSynthesis', {
        value: mockSpeechSynthesis,
        writable: true,
        configurable: true,
      })
    })

    it('calls speechSynthesis.speak', async () => {
      // Mock SpeechSynthesisUtterance as a constructor
      class MockUtterance {
        rate = 0.9; pitch = 1; volume = 1; lang = 'en-US'; voice = null; text = ''
        onstart: (() => void) | null = null
        onend: (() => void) | null = null
        onerror: ((e: { error: string }) => void) | null = null
        constructor(t: string) { this.text = t }
      }
      // @ts-expect-error testing
      globalThis.SpeechSynthesisUtterance = MockUtterance

      mockSpeechSynthesis.speak.mockImplementation((u: MockUtterance) => {
        setTimeout(() => u.onend?.(), 0)
      })

      await speak('hello world')
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled()
    })
  })

  describe('stopSpeaking', () => {
    it('calls cancel and resets state', () => {
      stopSpeaking()
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled()
      expect(isSpeaking()).toBe(false)
    })
  })

  describe('pauseSpeaking', () => {
    it('calls pause when not already paused', () => {
      mockSpeechSynthesis.paused = false
      pauseSpeaking()
      expect(mockSpeechSynthesis.pause).toHaveBeenCalled()
    })

    it('does not call pause when already paused', () => {
      mockSpeechSynthesis.paused = true
      pauseSpeaking()
      expect(mockSpeechSynthesis.pause).not.toHaveBeenCalled()
    })
  })

  describe('resumeSpeaking', () => {
    it('calls resume when paused', () => {
      mockSpeechSynthesis.paused = true
      resumeSpeaking()
      expect(mockSpeechSynthesis.resume).toHaveBeenCalled()
    })

    it('does not call resume when not paused', () => {
      mockSpeechSynthesis.paused = false
      resumeSpeaking()
      expect(mockSpeechSynthesis.resume).not.toHaveBeenCalled()
    })
  })
})
