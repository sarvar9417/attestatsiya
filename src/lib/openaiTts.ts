// src/lib/openaiTts.ts
// OpenAI TTS (Text-to-Speech) client — proxy orqali chaqiradi, audio cache'laydi
// Browser TTS dan ancha tabiiy ovoz beradi

import { speak, isSpeechSupported } from './tts'
import { monitoring } from './monitoring'

/** Hozirgi audio holati */
let currentAudio: HTMLAudioElement | null = null
let currentResolve: (() => void) | null = null
let currentReject: ((err: Error) => void) | null = null

/** Audio blob URL cache — bir xil matnni qayta yuklamaslik uchun */
const audioCache = new Map<string, string>()

/**
 * Matnni OpenAI TTS orqali ovozli o'qish.
 * @param text - O'qiladigan matn (ingliz tilida)
 * @param voice - OpenAI ovoz nomi: alloy | echo | fable | onyx | nova | shimmer
 * @param speed - Tezlik (0.25 – 4.0, default 0.9)
 * @returns Promise — audio tugaganda resolve bo'ladi
 */
export async function speakOpenAITTS(
  text: string,
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'alloy',
  speed = 0.9,
): Promise<void> {
  if (!text.trim()) return

  // Oldingi audioni to'xtatish
  stopOpenAITTS()

  const cacheKey = `${voice}:${speed}:${text.toLowerCase().trim()}`
  let audioUrl = audioCache.get(cacheKey)

  try {
    if (!audioUrl) {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text.trim(), voice, speed }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errData.error || `TTS API xatosi (${response.status})`)
      }

      const blob = await response.blob()
      audioUrl = URL.createObjectURL(blob)
      audioCache.set(cacheKey, audioUrl)

      // Cache o'lchamini cheklash (max 100 ta)
      if (audioCache.size > 100) {
        const firstKey = audioCache.keys().next().value
        if (firstKey) {
          const firstUrl = audioCache.get(firstKey)
          if (firstUrl) URL.revokeObjectURL(firstUrl)
          audioCache.delete(firstKey)
        }
      }
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl)
      currentAudio = audio
      currentResolve = resolve
      currentReject = reject

      audio.onended = () => {
        currentAudio = null
        currentResolve = null
        currentReject = null
        resolve()
      }

      audio.onerror = () => {
        currentAudio = null
        currentResolve = null
        currentReject = null
        reject(new Error('Audio playback xatosi'))
      }

      audio.play().catch((err) => {
        currentAudio = null
        currentResolve = null
        currentReject = null
        reject(err)
      })
    })
  } catch (err) {
    // OpenAI TTS ishlamasa — browser TTS ga fallback
    monitoring.captureMessage(
      'OpenAI TTS failed, falling back to browser TTS: ' + (err instanceof Error ? err.message : String(err)),
      'warn',
    )

    if (isSpeechSupported()) {
      return speak(text, { rate: speed })
    }
    throw err
  }
}

/** OpenAI TTS audioni to'xtatish */
export function stopOpenAITTS(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
  if (currentResolve) {
    currentResolve()
    currentResolve = null
  }
  if (currentReject) {
    currentReject = null
  }
}

/** Audio cache ni tozalash */
export function clearTtsCache(): void {
  for (const url of audioCache.values()) {
    URL.revokeObjectURL(url)
  }
  audioCache.clear()
}

/**
 * Matnni OpenAI TTS bilan o'qish (fallbackli).
 * Agar OpenAI TTS mavjud bo'lmasa, browser TTS ga o'tadi.
 */
export async function speakNatural(text: string, rate = 0.9): Promise<void> {
  try {
    await speakOpenAITTS(text, 'alloy', rate)
  } catch {
    // Final fallback
    if (isSpeechSupported()) {
      await speak(text, { rate })
    }
  }
}
