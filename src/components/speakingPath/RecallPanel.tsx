// Speaking Path — bitta blok uchun ovozli recall paneli (qayta ishlatiladigan)
// Reja: docs/speaking-path-roadmap.md (Faza 3/5)
// SpeakStep (kunlik) va SpeakingReviewSession (SRS takror) ikkalasi ishlatadi.
// Parent har blokka key={chunk.id} beradi → holat avtomatik reset bo'ladi.

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { ArrowRight, RotateCcw, Check, X, Volume2, Send, BookOpen, Info } from 'lucide-react'
import HoldMicButton from './HoldMicButton'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import { useSpeechRecognition, isMobileDevice } from '../../hooks/useSpeechRecognition'
import { monitoring } from '../../lib/monitoring'
import { useAudioRecorder } from '../../hooks/useAudioRecorder'
import { gradeChunk } from '../../services/speakingPathService'
import { semanticSimilarity, semanticToRating, isSemanticCorrect } from './match'
import type { SemanticMatchResult } from './match'
import { useI18n } from '../../i18n'
import AudioPlayback from '../speaking/AudioPlayback'
import type { SpeakingChunk } from '../../data/speakingPath/types'

interface Props {
  chunk: SpeakingChunk
  userId?: string
  isLast: boolean
  onDone: (bestSim: number) => void
}

/** Normalize text for word-level comparison */
function normalizeWord(w: string): string {
  return w.toLowerCase().replace(/[.,!?;:'"()…—-]/g, '').trim()
}

/** Word-level comparison result */
interface WordMatch {
  word: string
  correct: boolean
  index: number
}

function compareWords(userText: string, targetText: string): WordMatch[] {
  const targetWords = targetText.split(/\s+/).filter(Boolean)
  const userWords = userText.toLowerCase().split(/\s+/).filter(Boolean)
  const userSet = new Set(userWords.map(normalizeWord))

  return targetWords.map((w, i) => ({
    word: w,
    correct: userSet.has(normalizeWord(w)),
    index: i,
  }))
}

export default function RecallPanel({ chunk, userId, isLast, onDone }: Props) {
  const { t } = useI18n()
  const { speak, supported } = useSpeechSynthesis()
  const sr = useSpeechRecognition()
  const ar = useAudioRecorder()
  // Mobilда STT mikrofonni eksklyuziv oladi — MediaRecorder'ni o'tkazib yuboramiz.
  const mobile = isMobileDevice()

  const [attempted, setAttempted] = useState(false)
  const [lastText, setLastText] = useState('')
  const [lastResult, setLastResult] = useState<SemanticMatchResult>({ score: 0, details: { keyword: 0, wordOrder: 0, length: 0 } })
  const [bestScore, setBestScore] = useState(0)
  const [typed, setTyped] = useState('')
  const [recording, setRecording] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const readyRef = useRef(false)
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearStopTimer = () => {
    if (stopTimerRef.current) { clearTimeout(stopTimerRef.current); stopTimerRef.current = null }
  }
  // unmount'da timer'ni tozalaymiz
  useEffect(() => () => {
    clearStopTimer()
  }, [])

  const evaluate = useCallback((text: string) => {
    const result = semanticSimilarity(text, chunk.en)
    setLastText(text)
    setLastResult(result)
    setBestScore(prev => Math.max(prev, result.score))
    setAttempted(true)
    if (userId) gradeChunk(userId, chunk.id, semanticToRating(result.score)).catch((e: unknown) => {
      monitoring.captureMessage('SRS gradeChunk failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    })
  }, [chunk, userId])

  // STT transcript tayyor bo'lganda baholash
  useEffect(() => {
    if (!recording || sr.isRecording || !sr.transcript.trim() || !readyRef.current) return
    clearStopTimer()
    readyRef.current = false
    setRecording(false)
    evaluate(sr.transcript.trim())
  }, [recording, sr.isRecording, sr.transcript, evaluate])

  // ── Bosib-turib-gapirish (push-to-talk) ──
  const startRecord = useCallback(() => {
    if (recording) return
    clearStopTimer()
    setAttempted(false)
    sr.reset()
    ar.reset()
    sr.start()
    if (!mobile) ar.start()
    setRecording(true)
    readyRef.current = true
  }, [recording, sr, ar, mobile])

  const stopRecord = useCallback(() => {
    if (!recording) return
    sr.stop()
    ar.stop()
    // Transcript kelsa — yuqoridagi effect baholaydi. Jim turilgan bo'lsa (transcript yo'q),
    // 1.2s dan keyin idle holatga qaytaramiz (tugma "yopishib" qolmasin).
    clearStopTimer()
    stopTimerRef.current = setTimeout(() => {
      readyRef.current = false
      setRecording(false)
    }, 1200)
  }, [recording, sr, ar])

  const retry = useCallback(() => {
    clearStopTimer()
    setAttempted(false)
    setLastText('')
    setTyped('')
    setRecording(false)
    setShowDetails(false)
    sr.reset()
    ar.reset()
  }, [sr, ar])

  const correct = isSemanticCorrect(lastResult.score)

  // Word-level comparison
  const wordMatches = useMemo(() => {
    if (!lastText) return []
    return compareWords(lastText, chunk.en)
  }, [lastText, chunk.en])

  return (
    <div className="space-y-4">
      {/* O'zbekcha prompt (inglizchasi yashirin) + stressWord */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800/50 text-center">
        <p className="text-xs font-bold text-primary-500 dark:text-primary-400 uppercase tracking-wider">Buni inglizcha ayting</p>
        <p className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{chunk.uz}</p>
        {chunk.ipa && !attempted && (
          <p className="text-xs text-primary-400 dark:text-primary-500 mt-1 font-mono">{chunk.ipa}</p>
        )}
        {chunk.stressWord && !attempted && !recording && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">🎯 Urg'u: <span className="underline decoration-amber-400">{chunk.stressWord}</span></span>
          </div>
        )}
      </div>

      {!attempted ? (
        <div className="space-y-3">
          {/* Yagona push-to-talk(+lock) mikrofon — butun Speaking Path bilan bir xil */}
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
            idleLabel="🎤 Bosib turib gapiring"
            interim={sr.interim}
          />

          {/* type-to-recall fallback (faqat yozmaganda) */}
          {!recording && (
            <div className="flex items-center gap-2">
              <input
                value={typed}
                onChange={e => setTyped(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && typed.trim()) evaluate(typed.trim()) }}
                placeholder="…yoki bu yerga yozing"
                className="flex-1 px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button
                onClick={() => typed.trim() && evaluate(typed.trim())}
                disabled={!typed.trim()}
                className="p-2.5 rounded-xl bg-primary-600 text-white disabled:opacity-40"
                aria-label={t('aria.check')}
              >
                <Send size={18} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={`rounded-2xl p-4 border ${correct ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50'}`}>
          <div className="flex items-center gap-2 justify-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${correct ? 'bg-emerald-500' : 'bg-rose-500'}`}>
              {correct ? <Check size={18} className="text-white" /> : <X size={18} className="text-white" />}
            </div>
            <span className={`font-black text-lg ${correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
              {correct ? "To'g'ri!" : "Yana urinib ko'ring"} · {Math.round(lastResult.score * 100)}%
            </span>
          </div>

          {/* Word-level breakdown */}
          {lastText && wordMatches.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1">
              {wordMatches.map((wm) => (
                <span
                  key={wm.index}
                  className={`px-1.5 py-0.5 rounded text-sm font-semibold ${
                    wm.correct
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 line-through decoration-rose-400'
                  }`}
                >
                  {wm.word}
                </span>
              ))}
            </div>
          )}

          {/* Score breakdown details */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setShowDetails(v => !v)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Info size={12} />
              Batafsil
            </button>
          </div>
          {showDetails && (
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div className="p-1.5 rounded-lg bg-white/60 dark:bg-gray-800/60">
                <p className="text-xs text-gray-400">Kalit so'z</p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{Math.round(lastResult.details.keyword * 100)}%</p>
              </div>
              <div className="p-1.5 rounded-lg bg-white/60 dark:bg-gray-800/60">
                <p className="text-xs text-gray-400">So'z tartibi</p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{Math.round(lastResult.details.wordOrder * 100)}%</p>
              </div>
              <div className="p-1.5 rounded-lg bg-white/60 dark:bg-gray-800/60">
                <p className="text-xs text-gray-400">Uzunlik</p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{Math.round(lastResult.details.length * 100)}%</p>
              </div>
            </div>
          )}

          {/* Target answer display */}
          <div className="mt-3 flex items-center gap-2 justify-center">
            <p className="font-bold text-gray-900 dark:text-gray-100">{chunk.en}</p>
            <button onClick={() => supported && speak(chunk.en)} disabled={!supported} className="p-1.5 rounded-lg bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 disabled:opacity-50">
              <Volume2 size={15} />
            </button>
          </div>
          {lastText && <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-1">Siz: "{lastText}"</p>}

          {/* IPA pronunciation hint (show on low score) */}
          {!correct && chunk.ipa && (
            <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
              <Volume2 size={13} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Talaffuz</span>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight mt-0.5">
                  {chunk.en}: {chunk.ipa}
                </p>
              </div>
            </div>
          )}

          {/* Grammar tip */}
          {chunk.grammarTip && (
            <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
              <BookOpen size={13} className="text-primary-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase">Grammar</span>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight mt-0.5">{chunk.grammarTip}</p>
              </div>
            </div>
          )}

          {/* Stress word — Intonation Guide */}
          {chunk.stressWord && (
            <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
              <Info size={13} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Urg'u</span>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight mt-0.5">
                  <span className="underline decoration-amber-400 font-semibold">{chunk.stressWord}</span> so'ziga urg'u bering: "{chunk.en}"
                </p>
              </div>
            </div>
          )}

          {/* Audio playback */}
          {ar.audioUrl && (
            <div className="mt-3">
              <AudioPlayback audioUrl={ar.audioUrl} label="Sizning javobingiz" color={correct ? 'text-emerald-600' : 'text-rose-600'} />
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button onClick={retry} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm border border-gray-200 dark:border-gray-600">
              <RotateCcw size={14} /> Qayta
            </button>
            <button onClick={() => onDone(bestScore)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-600 text-white font-semibold text-sm">
              {isLast ? 'Yakunlash' : 'Keyingi'} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
