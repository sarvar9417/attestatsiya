import { monitoring } from '../lib/monitoring'
import { useState, useRef, useEffect, useCallback } from 'react'

interface SrAlternative { readonly transcript: string }
interface SrResult { readonly isFinal: boolean; readonly length: number; readonly [i: number]: SrAlternative }
interface SrResultList { readonly length: number; readonly [i: number]: SrResult }
interface SrEvent extends Event { readonly results: SrResultList; readonly resultIndex: number }

type SrCtor = new () => {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: SrEvent) => void) | null
  onend: (() => void) | null
  onerror: ((e: Event & { error?: string }) => void) | null
}

declare global {
  interface Window { SpeechRecognition?: SrCtor; webkitSpeechRecognition?: SrCtor }
}

export interface SpeechRecognitionState {
  isSupported: boolean
  isRecording: boolean
  transcript: string
  interim: string
  permissionError: boolean
  start(): void
  stop(): void
  reset(): void
}

/** Ikki marta getUserMedia chaqirmaslik uchun umumiy stream — useAudioRecorder
 *  ham shu stream'dan foydalanadi (agar mavjud bo'lsa). */
let _sharedMicStream: MediaStream | null = null
let _streamResolve: ((s: MediaStream) => void) | null = null
let _streamPromise: Promise<MediaStream> | null = null

export function getSharedMicStream(): MediaStream | null { return _sharedMicStream }

/** useAudioRecorder start() bu promise'ni kutadi — stream tayyor bo'lgach resolve
 *  bo'ladi (yoki 500ms timeout). */
export function waitForSharedMicStream(timeout = 500): Promise<MediaStream | null> {
  if (_sharedMicStream) return Promise.resolve(_sharedMicStream)
  if (!_streamPromise) {
    _streamPromise = new Promise((resolve) => {
      _streamResolve = (s: MediaStream) => resolve(s)
    })
  }
  return Promise.race([
    _streamPromise,
    new Promise<null>((r) => setTimeout(() => r(null), timeout)),
  ])
}

export function clearSharedMicStream(): void {
  _sharedMicStream?.getTracks().forEach(t => t.stop())
  _sharedMicStream = null
  _streamPromise = null
  _streamResolve = null
}

/** iOS'da Web Speech API (SpeechRecognition) ishlamaydi */
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/** Mobil qurilma (Android/telefon). Mobilда SpeechRecognition mikrofonni o'zi ochadi —
 *  shu sabab ochiq getUserMedia stream'i (MediaRecorder uchun) uni jim qoldirishi mumkin. */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent)
}

/** Mikrofon ruxsatini oldindan so'raydi.
 *  Android Chrome'da SpeechRecognition.start() ishlashi uchun ruxsat kerak.
 *  MUHIM (mobil): ruxsat olingach probe stream'ni DARHOL bo'shatamiz — aks holda
 *  ochiq mikrofon stream'i Android SpeechRecognition'ni jim qoldiradi (mic band).
 *  Desktop'da stream'ni saqlaymiz, useAudioRecorder uni qayta ishlatadi (ovoz yozish). */
async function requestMicPermission(): Promise<boolean> {
  try {
    // Avvalgi stream'ni to'xtatamiz — aks holda brauzer mikrofoni indikatori yoniq qoladi
    if (_sharedMicStream) {
      _sharedMicStream.getTracks().forEach(t => t.stop())
      _sharedMicStream = null
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    if (isMobileDevice()) {
      // Mobil: SR mikrofonni mustaqil ochadi — probe'ni bo'shatamiz (toza mic).
      stream.getTracks().forEach(t => t.stop())
      _streamPromise = null
      _streamResolve = null
    } else {
      _sharedMicStream = stream
      _streamResolve?.(stream)
      _streamPromise = null
      _streamResolve = null
    }
    return true
  } catch (e) {
    monitoring.captureMessage('requestMicPermission failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return false
  }
}

export function useSpeechRecognition(): SpeechRecognitionState {
  const [isSupported, setIsSupported] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [permissionError, setPermissionError] = useState(false)
  const recRef = useRef<InstanceType<SrCtor> | null>(null)
  // Final va interim natijalarni ref'da saqlaymiz — stop()/onend paytida ishlatish uchun
  const transcriptRef = useRef('')
  const interimRef = useRef('')

  useEffect(() => {
    // 1) iOS → umuman qo'llab-quvvatlanmaydi
    if (isIOS()) {
      setIsSupported(false)
      return
    }
    // 2) Web Speech API mavjudmi?
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Ctor) setIsSupported(false)
  }, [])

  useEffect(() => {
    return () => {
      try { recRef.current?.abort() } catch { /* noop */ }
      // Komponent unmount bo'lganda shared stream'ni tozalaymiz — brauzer indikatori
      // o'chishi va mikrofonga ruxsat to'g'ri yopilishi uchun.
      clearSharedMicStream()
    }
  }, [])

  const start = useCallback(async () => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Ctor) return

    const hasPermission = await requestMicPermission()
    if (!hasPermission) {
      setPermissionError(true)
      monitoring.captureMessage('SpeechRecognition: Mikrofon ruxsati yo\'q yoki qurilmada mikrofon topilmadi', 'warn')
      return
    }
    setPermissionError(false)

    // Avvalgi instansiyani to'xtatamiz (dublikat tanishni oldini olish)
    try { recRef.current?.abort() } catch { 
      monitoring.captureMessage('useSpeechRecognition: abort failed during start', 'warn')
    }

    transcriptRef.current = ''
    interimRef.current = ''

    const rec = new Ctor()
    rec.lang = 'en-US'
    // continuous=true HAMMA qurilmada: foydalanuvchi STOP bosgunicha tinglaydi.
    // (Mobil non-continuous rejimda pauzada o'z-o'zidan tugab, stop'ni buzar edi.)
    rec.continuous = true
    rec.interimResults = true

    rec.onresult = (e: SrEvent) => {
      let final = ''
      let inter = ''
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) final += r[0].transcript + ' '
        else inter = r[0].transcript
      }
      if (final) { transcriptRef.current = final; setTranscript(final) }
      interimRef.current = inter
      setInterim(inter)
    }

    rec.onend = () => {
      // Mobil: final kelmasdan onend bo'lishi mumkin → interim'ni natija sifatida olamiz
      if (!transcriptRef.current.trim() && interimRef.current.trim()) {
        transcriptRef.current = interimRef.current.trim()
        setTranscript(interimRef.current.trim())
      }
      setInterim('')
      setIsRecording(false)
    }

    rec.onerror = (e) => {
      const err = e.error ?? 'unknown'
      monitoring.captureMessage(`SpeechRecognition xatolik: ${String(err)}`, 'warn')
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        setPermissionError(true)
      }
      setIsRecording(false)
    }

    recRef.current = rec
    try { rec.start() } catch { 
      monitoring.captureMessage('useSpeechRecognition: start() failed', 'warn')
    }
    setIsRecording(true)
  }, [])

  const stop = useCallback(() => {
    // Final hali kelmagan bo'lsa, interim'ni natija sifatida olamiz (mobil ishonchliligi)
    if (!transcriptRef.current.trim() && interimRef.current.trim()) {
      transcriptRef.current = interimRef.current.trim()
      setTranscript(interimRef.current.trim())
    }
    // Mobil Chrome'da stop() onend'ni ishonchli ishga tushirmaydi — shuning uchun
    // holatni darhol o'zimiz yangilaymiz (UI darrov javob beradi, natija yuboriladi).
    try { recRef.current?.stop() } catch { 
      monitoring.captureMessage('useSpeechRecognition: stop() failed', 'warn')
    }
    setInterim('')
    setIsRecording(false)
    // Yozish tugagach shared stream'ni tozalaymiz — brauzer indikatori o'chishi uchun.
    // AudioRecorder hali stream'dan foydalanayotgan bo'lsa ham, MediaRecorder
    // bufferlangan ma'lumotni saqlab qoladi (stop() chaqirilgan track'lar xavfsiz).
    clearSharedMicStream()
  }, [])

  const reset = useCallback(() => {
    try { recRef.current?.abort() } catch { 
      monitoring.captureMessage('useSpeechRecognition: abort() failed during reset', 'warn')
    }
    transcriptRef.current = ''
    interimRef.current = ''
    setTranscript('')
    setInterim('')
    setIsRecording(false)
    setPermissionError(false)
  }, [])

  return { isSupported, isRecording, transcript, interim, permissionError, start, stop, reset }
}
