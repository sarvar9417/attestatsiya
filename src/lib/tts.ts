// src/lib/tts.ts
// Web Speech API wrapper — bepul, barcha brauzerda ishlaydi
// O'zbek tilidagi xabarlar bilan foydalanuvchiga qulay interfeys

export interface TTSOptions {
  rate?: number    // 0.7 = sekin (o'rganish), 1.0 = normal, 1.3 = tez
  pitch?: number   // 1.0 = standart
  volume?: number  // 0.0 - 1.0
  lang?: string    // 'en-US' | 'en-GB'
  voice?: SpeechSynthesisVoice  // Tanlangan ovoz
}

let currentReject: ((reason: Error) => void) | null = null
let _isSpeaking = false
let _cachedVoices: SpeechSynthesisVoice[] = []

// Persistent utterance reference — Chrome GC'sidan saqlaydi
let _currentUtterance: SpeechSynthesisUtterance | null = null

// ====== Ovoz boshqaruvi ======

/** Brauzerdagi mavjud ovozlar ro'yxatini qaytaradi */
export function getVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return []
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) {
    _cachedVoices = voices
  }
  return _cachedVoices
}

// Chrome loads voices async — cache them when available
if ('speechSynthesis' in window) {
  const synth = window.speechSynthesis
  const loadVoices = () => {
    const voices = synth.getVoices()
    if (voices.length > 0) {
      _cachedVoices = voices
    }
  }
  loadVoices()
  synth.onvoiceschanged = loadVoices
}

/** Ingliz tili uchun eng yaxshi ovozni topadi (imkon qadar tabiiy) */
export function getBestVoice(lang = 'en-US'): SpeechSynthesisVoice | undefined {
  const voices = getVoices()

  // Tabiiy premium ovozlar ro'yxati (eng tabiiydan pastga)
  const premiumNames = [
    'Google UK',
    'Google US',
    'Karen',       // en-AU — juda tabiiy
    'Samantha',    // en-US — tabiiy ayol ovozi
    'Daniel',      // en-GB — tabiiy erkak ovozi
    'Moira',       // en-IE
    'Tessa',       // en-ZA
    'Fiona',       // en-GB
  ]
  for (const name of premiumNames) {
    const found = voices.find(v => v.name.includes(name))
    if (found) return found
  }

  // O'xshash tilga mos (en-US, en-GB, en-AU)
  const exact = voices.find(v => v.lang === lang)
  if (exact) return exact

  // Berilayotgan tilga mos birinchi ovoz (masalan 'en')
  const langMatch = voices.find(v => v.lang.startsWith(lang.slice(0, 2)))
  if (langMatch) return langMatch

  // Default
  return voices.find(v => v.default) ?? voices[0]
}

// ====== Nutq holati ======

/** Hozir gapirilyaptimi? */
export function isSpeaking(): boolean {
  return _isSpeaking || _currentUtterance !== null
}

/** Brauzer TTS ni qo'llaydimi? */
export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window
}

// ====== Asosiy funksiyalar ======

/** Matnni ovozli o'qish */
export function speak(text: string, options: TTSOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSupported()) {
      reject(new Error('Bu brauzer audio talaffuzni qo\'llamaydi'))
      return
    }

    // Oldingi gapni to'xtatish
    if (currentReject) {
      currentReject(new Error('Cancelled by new speak call'))
      currentReject = null
    }
    window.speechSynthesis.cancel()
    _isSpeaking = false

    // Eski utteranceni bo'shatamiz
    _currentUtterance = null

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate   = options.rate   ?? 0.9
    utterance.pitch  = options.pitch  ?? 1.0
    utterance.volume = options.volume ?? 1.0
    utterance.lang   = options.lang   ?? 'en-US'

    // Eng yaxshi ovozni tanlash
    if (options.voice) {
      utterance.voice = options.voice
    } else {
      const best = getBestVoice(utterance.lang)
      if (best) utterance.voice = best
    }

    let settled = false

    utterance.onstart = () => { _isSpeaking = true }
    utterance.onend   = () => {
      if (settled) return
      settled = true
      _isSpeaking = false
      _currentUtterance = null
      resolve()
    }
    utterance.onerror = (e) => {
      if (settled) return
      settled = true
      _isSpeaking = false
      _currentUtterance = null
      // 'canceled' is normal when a new speak call interrupts — don't reject
      if (e.error === 'canceled') {
        resolve()
        return
      }
      reject(new Error(`TTS xatosi: ${e.error}`))
    }

    currentReject = reject
    // Persistent reference — GC'dan saqlaydi
    _currentUtterance = utterance

    // Chrome compat: cancel() dan keyin engine "to'xtab" qolmasligi uchun
    try { window.speechSynthesis.resume() } catch { /* noop */ }

    window.speechSynthesis.speak(utterance)

    // Xavfsizlik taymer — Chrome ba'zan onend'ni ishga tushirmaydi
    const timeoutMs = Math.max(5000, text.length * 80)
    setTimeout(() => {
      if (settled) return
      settled = true
      _isSpeaking = false
      _currentUtterance = null
      resolve()
    }, timeoutMs)
  })
}

/** Bir necha matnni ketma-ket o'qish */
export async function speakChunked(
  chunks: string[],
  options: TTSOptions = {},
  pauseMs = 300
): Promise<void> {
  for (let i = 0; i < chunks.length; i++) {
    await speak(chunks[i], options)
    if (i < chunks.length - 1) {
      await new Promise(r => setTimeout(r, pauseMs))
    }
  }
}

/** So'zni avval sekin, keyin normal tezlikda o'qish */
export async function speakWord(word: string): Promise<void> {
  const opts: TTSOptions = { rate: 0.7 }
  await speak(word, opts)
  await speak(word, { rate: 0.9 })
}

/** Nutqni to'xtatish */
export function stopSpeaking(): void {
  window.speechSynthesis.cancel()
  _isSpeaking = false
  _currentUtterance = null

  if (currentReject) {
    currentReject(new Error('Nutq to\'xtatildi'))
    currentReject = null
  }
}

/** Nutqni pauza qilish */
export function pauseSpeaking(): void {
  if (isSpeechSupported() && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause()
  }
}

/** Pauzani davom ettirish */
export function resumeSpeaking(): void {
  if (isSpeechSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
  }
}
