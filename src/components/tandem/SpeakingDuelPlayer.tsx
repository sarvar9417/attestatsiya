// ═══════════════════════════════════════════════════════════════════════════
// SpeakingDuelPlayer — Speaking duel: prompt + record + AI baholash
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Loader2, Sparkles, Trophy, ChevronRight, Volume2 } from 'lucide-react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { submitSpeakingDuelAnswer } from '../../services/tandemService'
import { useToastStore } from '../../utils/toastStore'
import type { Duel, DuelQuestion } from '../../types/tandem'

interface Props {
  duel: Duel
  question: DuelQuestion  // first question = prompt + tips
  onComplete: () => void
}

// ─── AI feedback parsing ─────────────────────────────────────────────────────

interface ParsedFeedback {
  fluency: number
  grammar: number
  vocabulary: number
  text: string
}

function parseFeedback(raw: string): ParsedFeedback {
  const flu = raw.match(/FLUENCY:\s*(\d+)/i)
  const gra = raw.match(/GRAMMAR:\s*(\d+)/i)
  const voc = raw.match(/VOCABULARY:\s*(\d+)/i)
  const text = raw.replace(/FLUENCY:.*?(\n|$)/gi, '')
    .replace(/GRAMMAR:.*?(\n|$)/gi, '')
    .replace(/VOCABULARY:.*?(\n|$)/gi, '')
    .replace(/FEEDBACK:\s*/i, '')
    .trim()

  return {
    fluency: flu ? Math.max(1, Math.min(10, parseInt(flu[1], 10))) : 0,
    grammar: gra ? Math.max(1, Math.min(10, parseInt(gra[1], 10))) : 0,
    vocabulary: voc ? Math.max(1, Math.min(10, parseInt(voc[1], 10))) : 0,
    text: text || 'Baholash yakunlandi.',
  }
}

// ─── Tips from question data ────────────────────────────────────────────────

function parseTips(question: DuelQuestion): string[] {
  if (question.passage) {
    return question.passage.split('\n').filter(Boolean)
  }
  return []
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SpeakingDuelPlayer({ duel, question, onComplete }: Props) {
  const { isSupported, transcript, interim, start, stop, reset } = useSpeechRecognition()
  const [stage, setStage] = useState<'prepare' | 'recording' | 'review' | 'submitting' | 'done'>('prepare')
  const [recordingTimer, setRecordingTimer] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null)
  const tips = parseTips(question)

  // ── Timer ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startRecording = () => {
    reset()
    start()
    setStage('recording')
    setRecordingTimer(0)
    timerRef.current = setInterval(() => {
      setRecordingTimer((prev) => {
        if (prev >= 45) {
          // Auto-stop after 45 seconds
          stopRecording()
          return 45
        }
        return prev + 1
      })
    }, 1000)
  }

  const stopRecording = () => {
    stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setStage('review')
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setStage('submitting')
    const finalTranscript = transcript || interim

    const res = await submitSpeakingDuelAnswer(
      duel.id,
      question.english,
      finalTranscript,
    )

    if (res.success) {
      setResult({ score: res.score ?? 0, feedback: res.feedback ?? '' })
      setStage('done')
      useToastStore.getState().toast(`🎤 Baholandi: ${res.score}/10!`, 'success')
    } else {
      useToastStore.getState().toast(res.error || 'Xatolik', 'error')
      setStage('review')
    }
  }

  // ── Render: Done ➤ Results ──────────────────────────────────────────────

  if (stage === 'done' && result) {
    const fb = parseFeedback(result.feedback)
    const avgScore = result.score

    return (
      <div className="max-w-lg mx-auto space-y-6 animate-page-enter p-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
              avgScore >= 7 ? 'bg-green-100 dark:bg-green-900/30'
              : avgScore >= 5 ? 'bg-yellow-100 dark:bg-yellow-900/30'
              : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              <Trophy size={40} className={
                avgScore >= 7 ? 'text-yellow-500'
                : avgScore >= 5 ? 'text-gray-400'
                : 'text-gray-300'
              } />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Speaking Duel tugadi!
          </h2>
          <p className="text-sm text-gray-500">AI tomonidan baholandi</p>
        </div>

        {/* Score */}
        <div className="card p-6 text-center space-y-3">
          <p className="text-5xl font-bold text-primary-600">{avgScore}/10</p>

          {/* Sub-scores */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2">
              <p className="text-lg font-bold text-blue-600">{fb.fluency}</p>
              <p className="text-xs text-gray-500">Ravonlik</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-2">
              <p className="text-lg font-bold text-green-600">{fb.grammar}</p>
              <p className="text-xs text-gray-500">Grammatika</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-2">
              <p className="text-lg font-bold text-purple-600">{fb.vocabulary}</p>
              <p className="text-xs text-gray-500">Lug'at</p>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {fb.text && (
          <div className="card p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-100 dark:border-indigo-900/50">
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {fb.text}
            </p>
          </div>
        )}

        <button
          onClick={onComplete}
          className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
        >
          <Sparkles size={18} />
          Yakunlash
        </button>
      </div>
    )
  }

  // ── Render: Submitting ────────────────────────────────────────────────────

  if (stage === 'submitting') {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 size={40} className="animate-spin text-primary-600" />
        <p className="text-sm text-gray-500">AI baholamoqda...</p>
        <p className="text-xs text-gray-400">Nutqingiz tahlil qilinmoqda</p>
      </div>
    )
  }

  // ── Render: Not supported ─────────────────────────────────────────────────

  if (!isSupported) {
    return (
      <div className="max-w-lg mx-auto p-4 text-center space-y-4">
        <div className="card p-8">
          <MicOff size={48} className="mx-auto text-gray-300 mb-3" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            Brauzer qo'llab-quvvatlamaydi
          </h2>
          <p className="text-sm text-gray-500">
            Speaking duel uchun Chrome yoki Safari brauzeridan foydalaning.
          </p>
          <button onClick={onComplete} className="btn-secondary mt-4">
            Orqaga
          </button>
        </div>
      </div>
    )
  }

  // ── Render: Transcript review ────────────────────────────────────────────

  if (stage === 'review') {
    const finalText = (transcript || interim).trim()
    return (
      <div className="max-w-lg mx-auto space-y-4 p-4 animate-fade-in">
        <div className="card p-5 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
            <Volume2 size={16} className="text-primary-500" />
            Sizning javobingiz
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed min-h-[80px] max-h-48 overflow-y-auto">
            {finalText || <span className="text-gray-400 italic">Hech narsa eshitilmadi</span>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { reset(); startRecording() }}
              className="btn-secondary flex-1 py-2.5 text-sm"
            >
              Qayta yozish
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} />
              Baholash
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Render: Recording ────────────────────────────────────────────────────

  if (stage === 'recording') {
    const timerPct = (recordingTimer / 45) * 100
    return (
      <div className="max-w-lg mx-auto space-y-4 p-4 animate-fade-in">
        <div className="card p-6 space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center animate-pulse">
              <Mic size={36} className="text-red-500" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-500 mb-1">Yozilmoqda...</p>
            <p className="text-xs text-gray-400">45 soniya — yetarli vaqt</p>
          </div>

          {/* Timer bar */}
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${timerPct}%` }}
            />
          </div>

          {/* Live transcript */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-sm text-gray-600 dark:text-gray-400 min-h-[60px] max-h-32 overflow-y-auto italic">
            {(transcript || interim || <span className="text-gray-300">Gapiring...</span>)}
          </div>

          <button
            onClick={stopRecording}
            className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700"
          >
            <MicOff size={16} />
            To'xtatish
          </button>
        </div>
      </div>
    )
  }

  // ── Render: Prepare ⬄ Start ──────────────────────────────────────────────

  return (
    <div className="max-w-lg mx-auto space-y-4 animate-page-enter p-4">
      {/* Header */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎤</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Speaking Duel</span>
        </div>
        <span className="text-xs font-bold text-gray-400">1 ta topshiriq</span>
      </div>

      {/* Prompt */}
      <div className="card p-6 space-y-4">
        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
          Speaking — gapiring va AI baholaydi
        </span>

        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 text-center py-2 leading-relaxed">
          {question.english}
        </h3>

        {/* Tips */}
        {tips.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 space-y-1 border border-blue-100 dark:border-blue-900/50">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">💡 Maslahatlar:</p>
            {tips.map((tip, i) => (
              <p key={i} className="text-xs text-gray-600 dark:text-gray-400">• {tip}</p>
            ))}
          </div>
        )}
      </div>

      {/* Start button */}
      <button
        onClick={startRecording}
        className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 rounded-2xl text-lg"
      >
        <Mic size={20} />
        Yozishni boshlash
        <ChevronRight size={18} />
      </button>

      {/* Info */}
      <div className="text-center text-xs text-gray-400 space-y-1">
        <p>🎤 45 soniya davomida gapiring</p>
        <p>🤖 AI ravonlik, grammatika va lug'atni baholaydi</p>
      </div>
    </div>
  )
}
