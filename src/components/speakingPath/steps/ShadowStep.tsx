// Speaking Path — Qadam 2: Shadow (takrorlash)
// Reja: docs/speaking-path-roadmap.md (6-bo'lim)
// Har blok navbatma-navbat: AI aytadi → foydalanuvchi takrorlaydi. STT bo'lsa
// analyzePronunciation bilan talaffuz balli. STT yo'q bo'lsa oqim buzilmaydi.

import { useState, useCallback, useEffect, useRef } from 'react'
import { Volume2, ArrowRight, Loader2, RotateCcw, BookOpen } from 'lucide-react'
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis'
import { useSpeechRecognition, isMobileDevice } from '../../../hooks/useSpeechRecognition'
import { useAudioRecorder } from '../../../hooks/useAudioRecorder'
import HoldMicButton from '../HoldMicButton'
import { analyzePronunciation, type PronunciationAnalysis } from '../../../lib/claude'
import { monitoring } from '../../../lib/monitoring'
import AudioPlayback from '../../speaking/AudioPlayback'
import { analyzeAudio } from '../../../hooks/useAudioAnalyser'
import { trackPronunciationErrors } from '../../../services/pronunciationErrorService'
import type { SpeakingDay } from '../../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  level: string
  onNext: () => void
}

function scoreColor(s: number) {
  if (s >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (s >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}

export default function ShadowStep({ day, level, onNext }: Props) {
  const { speak, supported } = useSpeechSynthesis()
  const sr = useSpeechRecognition()
  const ar = useAudioRecorder()
  // Mobilда SpeechRecognition mikrofonni eksklyuziv oladi — MediaRecorder bilan
  // bir vaqtda ishlatsak, Android'da STT jim qoladi. Shu sabab mobilда ovoz
  // yozishni o'tkazib yuboramiz (matn ustuvor; ovoz playback faqat desktop'da).
  const mobile = isMobileDevice()

  const [index, setIndex] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<PronunciationAnalysis | null>(null)
  const [recording, setRecording] = useState(false)
  const [noSpeech, setNoSpeech] = useState(false)
  const chunkRef = useRef<SpeakingDay['chunks'][0] | null>(null)
  const analysisDoneRef = useRef(false)
  const srStartedRef = useRef(false)

  const chunk = day.chunks[index]
  chunkRef.current = chunk
  const isLast = index >= day.chunks.length - 1

  // Yozish tugagach (sr to'xtagach) natijani qayta ishlaymiz.
  // Mobil/iOS: STT hech narsa eshitmasligi mumkin — bunday holatda "stuck"
  // qolmaymiz, idle'ga qaytib qayta urinish/o'tkazish imkonini beramiz.
  // srStartedRef orqali sr real ishga tushganini tekshiramiz — aks holda
  // async sr.start() hali ishga tushmagan paytda "no speech" berib qo'yamiz.
  useEffect(() => {
    if (sr.isRecording) srStartedRef.current = true
  }, [sr.isRecording])

  useEffect(() => {
    if (!recording || sr.isRecording) return
    if (analysisDoneRef.current) return

    const text = sr.transcript.trim()
    if (!text) {
      if (!srStartedRef.current) return
      analysisDoneRef.current = true
      setRecording(false)
      setNoSpeech(true)
      return
    }

    // Desktop: ovoz yozilishini kutamiz. Mobil: ovoz yo'q — faqat matn bilan davom etamiz.
    if (!mobile && !ar.audioUrl) return

    analysisDoneRef.current = true
    setRecording(false)

    const currentChunk = chunkRef.current
    if (!currentChunk) return

    setAnalyzing(true)
    setResult(null)

    ;(async () => {
      try {
        let acoustic
        const audioUrl = ar.audioUrl
        if (audioUrl) {
          try {
            const a = await analyzeAudio(audioUrl, text)
            acoustic = { pitchMean: a.pitchMean, pitchStddev: a.pitchStddev, avgEnergy: a.fluency.avgEnergy, energyVariation: a.fluency.energyVariation }
          } catch { /* acoustic remains undefined */ }
        }
        const r = await analyzePronunciation(currentChunk.en, text, currentChunk.ipa ?? '', level, acoustic)
        setResult(r)
        if (r.issues.length > 0) {
          trackPronunciationErrors(r.issues, r.score, 'shadow', currentChunk.en).catch((e: unknown) => {
            monitoring.captureMessage('trackPronunciationErrors (shadow) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
          })
        }
      } catch (err) {
        monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'ShadowStep.analyze' })
        setResult({ score: 0, issues: [], encouragement: "Tahlil qilib bo'lmadi — yana urinib ko'ring." })
      } finally {
        setAnalyzing(false)
      }
    })()
  }, [recording, sr.isRecording, sr.transcript, level, ar.audioUrl, mobile])

  // Push-to-talk: bosib turing → gapiring → qo'yib yuboring.
  const startRecord = useCallback(() => {
    setResult(null)
    setNoSpeech(false)
    analysisDoneRef.current = false
    srStartedRef.current = false
    sr.reset()
    ar.reset()
    sr.start()
    // Mobilда MediaRecorder'ni ishga tushirmaymiz — SpeechRecognition mikrofonni
    // eksklyuziv oladi (Android STT ishonchli ishlashi uchun).
    if (!mobile) ar.start()
    setRecording(true)
  }, [sr, ar, mobile])

  const stopRecord = useCallback(() => {
    sr.stop()
    ar.stop()
  }, [sr, ar])

  const advance = useCallback(() => {
    setResult(null)
    setRecording(false)
    setNoSpeech(false)
    sr.reset()
    ar.reset()
    if (isLast) onNext()
    else setIndex(i => i + 1)
  }, [isLast, onNext, sr, ar])

  const retry = useCallback(() => {
    setResult(null)
    setRecording(false)
    setNoSpeech(false)
    sr.reset()
    ar.reset()
  }, [sr, ar])

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">🗣️ Eshiting va takrorlang</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{index + 1} / {day.chunks.length}</p>
      </div>

      {/* Joriy blok — grammarTip bilan */}
      <div className="rounded-2xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-lg font-black text-gray-900 dark:text-gray-100">{chunk.en}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{chunk.uz}</p>
        {chunk.ipa && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">{chunk.ipa}</p>}
        {chunk.grammarTip && (
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800/40">
            <BookOpen size={11} className="text-primary-500" />
            <span className="text-xs text-primary-600 dark:text-primary-400">{chunk.grammarTip}</span>
          </div>
        )}
        <button
          onClick={() => supported && speak(chunk.en)}
          disabled={!supported}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold text-sm hover:bg-primary-200 dark:hover:bg-primary-900/60 transition-colors disabled:opacity-60"
        >
          <Volume2 size={16} /> Tinglash
        </button>
      </div>

      {/* Pronunciation focus micro-tip */}
      {day.pronunciationFocus && index === 0 && !result && !analyzing && (
        <div className="rounded-xl p-2.5 bg-amber-50/70 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/40">
          <div className="flex items-start gap-2">
            <span className="text-lg font-black font-mono text-amber-600 dark:text-amber-400 leading-none mt-0.5">{day.pronunciationFocus.sound}</span>
            <p className="text-xs text-gray-600 dark:text-gray-300">{day.pronunciationFocus.tipUz}</p>
          </div>
        </div>
      )}

      {/* Mikrofon / natija */}
      <div className="flex flex-col items-center justify-center gap-3">
        {analyzing ? (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <Loader2 size={18} className="animate-spin" /> Talaffuz tekshirilmoqda…
          </div>
        ) : result ? (
          <div className="w-full space-y-3">
            {/* Score + issues */}
            <div className="rounded-2xl p-4 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2">
                <span className={`text-3xl font-black ${scoreColor(result.score)}`}>{result.score}</span>
                <span className="text-sm text-gray-400">/ 100</span>
              </div>
              <p className="text-xs text-center text-gray-600 dark:text-gray-300 mt-2">{result.encouragement}</p>
              {result.issues.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {result.issues.map((iss, i) => (
                    <div key={i} className="text-xs bg-white dark:bg-gray-700/50 rounded-lg p-2">
                      <span className="font-bold text-gray-800 dark:text-gray-100">{iss.word}</span>
                      <span className="text-gray-400 font-mono ml-1">{iss.ipa}</span>
                      <p className="text-gray-500 dark:text-gray-400 mt-0.5">{iss.tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audio playback — o'z ovozini eshitish */}
            {ar.audioUrl && (
              <AudioPlayback
                audioUrl={ar.audioUrl}
                label="Sizning talaffuzingiz"
                color="text-rose-600"
              />
            )}

            {/* Namuna eshitish */}
            <button
              onClick={() => supported && speak(chunk.en)}
              disabled={!supported}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300 font-semibold text-sm hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors active:scale-[0.98]"
            >
              <Volume2 size={15} /> Namunani eshitish
            </button>

            <div className="flex gap-2">
              <button onClick={retry} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                <RotateCcw size={14} /> Qayta
              </button>
              <button onClick={advance} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-600 text-white font-semibold text-sm">
                {isLast ? 'Yakunlash' : 'Keyingi'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {sr.permissionError && !recording && (
              <div className="text-center">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  🎤 Mikrofon ruxsati yo'q.
                </p>
                <button
                  onClick={() => { sr.reset(); sr.start() }}
                  className="mt-1 text-xs font-semibold text-amber-700 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-800/60 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <RotateCcw size={10} className="inline mr-1" />
                  Qayta urinish
                </button>
              </div>
            )}
            <HoldMicButton
              isRecording={recording}
              onStart={startRecord}
              onStop={stopRecord}
              disabled={analyzing}
              idleLabel="Bosib turib takrorlang"
              interim={sr.interim}
            />
            {noSpeech && (
              <div className="text-center mt-1">
                <p className="text-xs text-amber-600 dark:text-amber-400">Ovoz eshitilmadi — yana bir bor urinib ko'ring.</p>
                <button onClick={advance} className="mt-1.5 text-xs font-semibold text-primary-600 hover:underline">
                  O'tkazib yuborish →
                </button>
              </div>
            )}
            {sr.interim && (
              <p className="text-xs text-gray-400 italic max-w-md text-center">"{sr.interim}"</p>
            )}
          </div>
        )}
      </div>

      {/* STT yo'q — qo'lda davom etish */}
      {!sr.isSupported && !analyzing && !result && (
        <button
          onClick={advance}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm hover:from-primary-700 hover:to-primary-800 active:scale-[0.98] transition-all"
        >
          Takrorladim, keyingi <ArrowRight size={16} />
        </button>
      )}
    </div>
  )
}
