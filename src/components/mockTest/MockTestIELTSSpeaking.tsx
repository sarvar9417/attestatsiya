import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Loader2, AlertTriangle } from 'lucide-react'
import { useI18n } from '../../i18n'
import { useCountdown, Timer, parseAIScore, type SpeechRec } from './mockTestHelpers'
import { evaluateSpeech } from '@/lib/claude'
import type { SpeakingPrompt } from '@/services/speakingService'

interface MockTestIELTSSpeakingProps {
  prompts: SpeakingPrompt[]
  onDone: (s1: number, s2: number) => void
}

export default function MockTestIELTSSpeaking({ prompts, onDone }: MockTestIELTSSpeakingProps) {
  const { t } = useI18n()
  const [pIdx,      setPIdx]      = useState(0)
  const [recording, setRecording] = useState(false)
  const [transcript,setTranscript]= useState('')
  const [score1,    setScore1]    = useState(0)
  const [loading,   setLoading]   = useState(false)
  const recRef = useRef<SpeechRec | null>(null)
  const timer = useCountdown(15 * 60)
  const startRef = useRef(timer.start)
  startRef.current = timer.start
  useEffect(() => { startRef.current() }, [])

  function startRec() {
    const win = window as Window & typeof globalThis & { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec }
    const Ctor = win.SpeechRecognition || win.webkitSpeechRecognition
    if (!Ctor) return
    const r = new Ctor() as SpeechRec
    r.lang     = 'en-US'; r.continuous = true; r.interimResults = true
    r.onresult = (e) => {
      let t = ''
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript
      setTranscript(t)
    }
    r.onend = () => setRecording(false)
    r.onerror = () => { setRecording(false) }
    r.start(); recRef.current = r; setRecording(true)
  }

  function stopRec() { recRef.current?.stop(); setRecording(false) }

  async function submit() {
    setLoading(true)
    let full = ''
    await evaluateSpeech(prompts[pIdx].prompt, transcript, 'B2',
      (tok) => { full += tok },
      (text) => {
        const avg = Math.round(
          (parseAIScore(text, 'FLUENCY') + parseAIScore(text, 'GRAMMAR') + parseAIScore(text, 'VOCABULARY')) / 3
        )
        setLoading(false)
        if (pIdx === 0) {
          setScore1(avg); setPIdx(1); setTranscript('')
        } else {
          onDone(score1, avg)
        }
      },
      () => setLoading(false)
    )
    void full
  }

  const p = prompts[pIdx]
  const noSpeech = !(window.SpeechRecognition || window.webkitSpeechRecognition)

  if (!p) return null

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-purple-600">{t('mockTest.ieltsSpeakingTitle', { current: String(pIdx + 1), total: '2' })}</span>
        </div>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 120} />
      </div>

      {noSpeech && (
        <div className="card bg-orange-50 border-orange-100 mb-3 flex items-center gap-2">
          <AlertTriangle size={14} className="text-orange-500 flex-shrink-0" />
          <p className="text-xs text-orange-700">{t('mockTest.speakingNoSpeech')}</p>
        </div>
      )}

      <div className="card bg-purple-50 border-purple-100 mb-4">
        <p className="text-xs text-purple-500 mb-1">{t('mockTest.speakingQuestion')}</p>
        <p className="text-sm font-medium text-purple-900 leading-relaxed">{p.prompt}</p>
        <div className="mt-2 space-y-1">
          {p.tips.map((tip, i) => (
            <p key={i} className="text-xs text-purple-600">💡 {tip}</p>
          ))}
        </div>
      </div>

      <div className="card mb-3">
        {noSpeech ? (
          <textarea
            className="w-full min-h-[120px] text-sm text-gray-800 leading-relaxed resize-none outline-none placeholder-gray-300"
            placeholder={t('mockTest.speakingPlaceholder')}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        ) : (
          <div className="min-h-[80px]">
            {transcript
              ? <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
              : <p className="text-sm text-gray-400 italic">{t('mockTest.speakingMicHint')}</p>}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!noSpeech && (
          <button onClick={recording ? stopRec : startRec}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all
              ${recording ? 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-600' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            {recording ? <><MicOff size={14} /> {t('mockTest.speakingStop')}</> : <><Mic size={14} /> {t('mockTest.speakingRecord')}</>}
          </button>
        )}
        <button onClick={submit} disabled={!transcript.trim() || loading || recording}
          className="flex-1 btn-primary text-sm flex items-center justify-center gap-2">
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> {t('mockTest.speakingEval')}</>
            : pIdx === 0 ? t('mockTest.speakingNext') : t('mockTest.speakingFinish')}
        </button>
      </div>
    </div>
  )
}
