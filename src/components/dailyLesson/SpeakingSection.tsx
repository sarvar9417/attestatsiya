import { useState, useEffect, useRef } from 'react'
import { Mic, Square, Volume2, Loader2, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { generateSpeakingTask, evaluateSpeech, type SpeakingTask } from '../../lib/claude'
import { speak } from '../../lib/tts'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { feelLevelUp } from '../../lib/gameFeel'
import { useI18n } from '../../i18n'

interface SpeakingSectionProps {
  topic: string
  level: string
  addXP: (n: number) => void
  onSkillProgress?: (pct: number) => void
  formulas?: { label: string; structure: string; color?: string }[]
  rules?: string[]
  vocabulary?: { en: string; uz: string; example?: string; rule?: string }[]
}

function parseScores(text: string) {
  const get = (k: string) => Math.min(10, Math.max(0, parseInt(text.match(new RegExp(`${k}:\\s*(\\d+)`))?.[1] ?? '0')))
  return { fluency: get('FLUENCY'), grammar: get('GRAMMAR'), vocabulary: get('VOCABULARY') }
}
function parseFeedback(text: string) {
  return text.split('FEEDBACK:')[1]?.trim() ?? ''
}

export default function SpeakingSection({ topic, level, addXP, onSkillProgress, formulas, rules, vocabulary }: SpeakingSectionProps) {
  const { t } = useI18n()
  const [task, setTask] = useState<SpeakingTask | null>(null)
  const [loadingTask, setLoadingTask] = useState(true)
  const [evaluating, setEvaluating] = useState(false)
  const [scores, setScores] = useState<{ fluency: number; grammar: number; vocabulary: number } | null>(null)
  const [feedback, setFeedback] = useState('')
  const awarded = useRef(false)
  const sr = useSpeechRecognition()

  useEffect(() => {
    let active = true
    setLoadingTask(true)
    generateSpeakingTask(topic, level, formulas, rules, vocabulary)
      .then(t => { if (active) setTask(t) })
      .finally(() => { if (active) setLoadingTask(false) })
    return () => { active = false; if (sr.isRecording) sr.stop() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, level, formulas, rules, vocabulary])

  function toggleMic() {
    if (sr.isRecording) sr.stop()
    else { if ('speechSynthesis' in window) speechSynthesis.cancel(); sr.reset(); setScores(null); setFeedback(''); sr.start() }
  }

  function evaluate() {
    if (!task || !sr.transcript.trim()) return
    if (sr.isRecording) sr.stop()
    setEvaluating(true)
    setFeedback('')
    evaluateSpeech(
      task.prompt, sr.transcript, level,
      () => { /* streaming tokenlar — yakuniy matn onDone'da */ },
      (text) => {
        const s = parseScores(text)
        setScores(s)
        setFeedback(parseFeedback(text))
        const avg = Math.round((s.fluency + s.grammar + s.vocabulary) / 3)
        if (!awarded.current) {
          awarded.current = true
          addXP(avg * 3)
          onSkillProgress?.(avg * 10)
          if (avg >= 8) feelLevelUp()
        }
        setEvaluating(false)
      },
      () => setEvaluating(false),
    )
  }

  if (loadingTask) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Loader2 size={28} className="animate-spin mb-2" />
        <p className="text-sm">{t('dailySpeaking.aiGeneratingTask')}</p>
      </div>
    )
  }
  if (!task) return null

  return (
    <div className="space-y-4">
      {/* Topshiriq */}
      <div className="card bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40">
        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">
          <Sparkles size={13} /> {t('dailySpeaking.taskTitle')}
        </div>
        <p className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">{task.prompt}</p>
        <button onClick={() => speak(task.prompt)} className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-300 font-semibold">
          <Volume2 size={13} /> {t('dailySpeaking.listen')}
        </button>
      </div>

      {/* Maslahatlar */}
      {task.tips.length > 0 && (
        <div className="card">
          <p className="text-xs font-bold text-gray-500 mb-2">{t('dailySpeaking.tips')}</p>
          <ul className="space-y-1">
            {task.tips.map((t, i) => <li key={i} className="text-sm text-gray-700 dark:text-gray-300">• {t}</li>)}
          </ul>
        </div>
      )}

      {/* Foydali iboralar */}
      {task.keyPhrases.length > 0 && (
        <div className="card">
          <p className="text-xs font-bold text-gray-500 mb-2">{t('dailySpeaking.keyPhrases')}</p>
          <div className="space-y-1.5">
            {task.keyPhrases.map((k, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-sm">
                <button onClick={() => speak(k.phrase)} className="flex items-center gap-1.5 font-semibold text-gray-800 dark:text-gray-200">
                  <Volume2 size={12} className="text-gray-400" /> {k.phrase}
                </button>
                <span className="text-xs text-gray-500 text-right">{k.translation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mikrofon */}
      {sr.isSupported ? (
        <div className="flex flex-col items-center gap-2 py-2">
          {sr.isRecording && <p className="text-xs text-rose-500 font-semibold animate-pulse">{t('dailySpeaking.speakNow')}</p>}
          <button onClick={toggleMic} disabled={evaluating}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition disabled:opacity-50 ${sr.isRecording ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-br from-rose-500 to-pink-600'}`}>
            {sr.isRecording ? <Square size={24} /> : <Mic size={26} />}
          </button>
          {sr.transcript && !sr.isRecording && (
            <p className="text-xs text-gray-500 italic max-w-md text-center">"{sr.transcript}"</p>
          )}
          {sr.transcript.trim() && !sr.isRecording && !scores && (
            <button onClick={evaluate} disabled={evaluating} className="btn-primary px-6 py-2.5 font-bold flex items-center gap-1.5 mt-1">
              {evaluating ? <><Loader2 size={15} className="animate-spin" /> {t('dailySpeaking.evaluating')}</> : t('dailySpeaking.evaluate')}
            </button>
          )}
        </div>
      ) : (
        <p className="text-xs text-amber-600 text-center">{t('dailySpeaking.browserNotSupported')}</p>
      )}

      {/* Natija */}
      {scores && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[[t('dailySpeaking.fluency'), scores.fluency], [t('dailySpeaking.grammar'), scores.grammar], [t('dailySpeaking.vocabulary'), scores.vocabulary]].map(([l, v]) => (
              <div key={l as string} className="card text-center py-3">
                <p className="text-2xl font-black text-rose-500">{v as number}<span className="text-sm text-gray-400">/10</span></p>
                <p className="text-xs text-gray-500">{l as string}</p>
              </div>
            ))}
          </div>
          {feedback && <div className="card text-sm text-gray-700 dark:text-gray-300">{feedback}</div>}
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-600 font-bold">
            <Trophy size={13} /> {t('dailySpeaking.xpEarned', { xp: String(Math.round((scores.fluency + scores.grammar + scores.vocabulary) / 3) * 3) })}
          </div>
          <button onClick={() => { sr.reset(); setScores(null); setFeedback(''); awarded.current = false }} className="w-full btn-secondary py-2.5 font-bold flex items-center justify-center gap-1.5">
            <RotateCcw size={15} /> {t('dailySpeaking.retry')}
          </button>
        </div>
      )}
    </div>
  )
}
