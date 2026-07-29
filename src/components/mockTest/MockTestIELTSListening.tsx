import { useState, useEffect, useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import { useI18n } from '../../i18n'
import { useCountdown, Timer } from './mockTestHelpers'
import { useSpeechSynthesis, SPEED_OPTIONS } from '@/hooks/useSpeechSynthesis'
import type { MockTestData } from '@/services/mockTestService'

interface MockTestIELTSListeningProps {
  data: MockTestData | null
  onDone: (pct: number) => void
}

export default function MockTestIELTSListening({ data, onDone }: MockTestIELTSListeningProps) {
  const { t } = useI18n()
  const listeningMCQ = data?.listeningMCQ ?? []
  const listeningText = data?.listeningText ?? ''
  const tts = useSpeechSynthesis('en-US')
  const [answers, setAnswers] = useState<(number | null)[]>(Array(listeningMCQ.length).fill(null))
  const [plays, setPlays]     = useState(0)
  const [showScript, setShowScript] = useState(false)
  const timer = useCountdown(20 * 60)
  const mountRef = useRef({ start: timer.start, stop: tts.stop })
  mountRef.current = { start: timer.start, stop: tts.stop }
  useEffect(() => { mountRef.current.start(); return () => mountRef.current.stop() }, [])

  const MAX_PLAYS = 2
  const answered = answers.filter(a => a !== null).length

  function togglePlay() {
    if (tts.playing) { tts.stop(); return }
    if (plays >= MAX_PLAYS) return
    setPlays(p => p + 1)
    tts.speak(listeningText)
  }
  function pick(qi: number, oi: number) {
    setAnswers(prev => { const u = [...prev]; u[qi] = oi; return u })
  }
  function submit() {
    tts.stop()
    const correct = answers.filter((a, i) => a === listeningMCQ[i].ans).length
    onDone(Math.round((correct / Math.max(1, listeningMCQ.length)) * 100))
  }

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-orange-600">{t('mockTest.ieltsListeningTitle')}</span>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 120} />
      </div>
      <div className="h-1 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full transition-all"
          style={{ width: `${(answered / Math.max(1, listeningMCQ.length)) * 100}%` }} />
      </div>

      <div className="card bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800 mb-4">
        {tts.supported ? (
          <>
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} disabled={!tts.playing && plays >= MAX_PLAYS}
                aria-label={tts.playing ? t('mockTest.speakingStop') : 'Audio'}
                className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-orange-600 transition-colors">
                {tts.playing ? <Pause size={22} /> : <Play size={22} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                  {tts.playing ? t('common.loading') : plays >= MAX_PLAYS ? t('mockTest.listenPlayed') : plays === 0 ? t('mockTest.listenPrompt') : t('speaking.retryButton')}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                  {t('mockTest.listenPlays', { used: String(plays), max: String(MAX_PLAYS) })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <span className="text-xs text-gray-500">Tezlik:</span>
              {SPEED_OPTIONS.map(sp => (
                <button key={sp.value} onClick={() => tts.setSpeed(sp.value)}
                  className={`text-xs px-2 py-1 rounded-lg border transition-colors ${tts.speed === sp.value ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
                  {sp.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold text-orange-700 mb-2">{t('mockTest.listenNotSupported')}</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{listeningText}</p>
          </>
        )}
      </div>

      {plays > 0 && tts.supported && (
        <div className="mb-4">
          <button onClick={() => setShowScript(s => !s)} className="text-xs font-semibold text-orange-600 hover:underline">
            📄 {showScript ? 'Transkript yashirish' : "Transkript ko'rsatish"}
          </button>
          {showScript && (
            <div className="card bg-gray-50 dark:bg-gray-800/50 mt-2">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{listeningText}</p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {listeningMCQ.map((q, qi) => (
          <div key={qi} className="card">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{qi + 1}. {q.q}</p>
            <div className="space-y-2" role="radiogroup">
              {q.opts.map((opt, oi) => (
                <button key={oi} onClick={() => pick(qi, oi)} role="radio" aria-checked={answers[qi] === oi}
                  className={`w-full text-left p-2.5 rounded-xl border text-sm transition-all
                    ${answers[qi] === oi ? 'bg-orange-50 border-orange-400 text-orange-800 font-semibold' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-orange-200'}`}>
                  <span className="font-semibold mr-2 text-gray-400">{['A','B','C','D'][oi]}.</span>{opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={submit} disabled={answered === 0} className="w-full btn-primary text-sm mt-4">
        {t('mockTest.ieltsListeningFinish', { count: String(answered), total: String(listeningMCQ.length) })}
      </button>
    </div>
  )
}
