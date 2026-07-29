import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Volume2, Mic, MicOff, Square, ChevronLeft, ChevronRight, Sparkles, Trophy, RotateCcw, Gauge } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useI18n } from '../i18n'
import { PRONUNCIATION_CATEGORIES, type PronunciationCategory } from '../data/pronunciationDrills'
import { analyzePronunciation, type PronunciationAnalysis } from '../lib/claude'
import { useSpeechSynthesis, SPEED_OPTIONS } from '../hooks/useSpeechSynthesis'
import { feelLevelUp, feelTap } from '../lib/gameFeel'
import { monitoring } from '../lib/monitoring'
import { useSpeechRecognition, isMobileDevice } from '../hooks/useSpeechRecognition'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import AudioPlayback from '../components/speaking/AudioPlayback'
import { analyzeAudio, type PitchContourPoint } from '../hooks/useAudioAnalyser'
import { trackPronunciationErrors } from '../services/pronunciationErrorService'
import StressVisualizer from '../components/speaking/StressVisualizer'
import IntonationContour from '../components/speaking/IntonationContour'

type View = 'select' | 'practice'

function scoreBg(s: number) {
  if (s >= 80) return 'from-emerald-500 to-green-500'
  if (s >= 60) return 'from-amber-500 to-orange-500'
  return 'from-rose-500 to-red-500'
}

export default function Pronunciation() {
  const { t } = useI18n()
  const currentLevel = useStore(s => s.currentLevel)
  const addXP = useStore(s => s.addXP)
  const level = (currentLevel || 'B1').replace('+', '')

  const [view, setView] = useState<View>('select')
  const [category, setCategory] = useState<PronunciationCategory | null>(null)
  const [idx, setIdx] = useState(0)
  const [analysis, setAnalysis] = useState<PronunciationAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [pitchContour, setPitchContour] = useState<PitchContourPoint[]>([])
  const awardedRef = useRef<Set<string>>(new Set())
  const [showSpeedSettings, setShowSpeedSettings] = useState(false)

  const sr = useSpeechRecognition()
  const ar = useAudioRecorder()
  const tts = useSpeechSynthesis()
  const phrase = category?.phrases[idx]

  useEffect(() => () => { if ('speechSynthesis' in window) speechSynthesis.cancel() }, [])

  function openCategory(c: PronunciationCategory) {
    feelTap()
    setCategory(c); setIdx(0); setAnalysis(null); setView('practice')
  }

  function goTo(newIdx: number) {
    if (sr.isRecording) sr.stop()
    sr.reset()
    ar.reset()
    setIdx(newIdx); setAnalysis(null); setPitchContour([])
  }

  function hearIt() {
    if (!phrase) return
    if (sr.isRecording) sr.stop()
    tts.speak(phrase.text).catch((e) => monitoring.captureMessage('Pronunciation TTS failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
  }

  async function handleMic() {
    if (!phrase) return
    if (sr.isRecording) {
      sr.stop()
      ar.stop()
      const said = sr.transcript.trim()
      setAnalyzing(true)
      let acoustic
      if (ar.audioUrl) {
        try {
          const a = await analyzeAudio(ar.audioUrl, said)
          acoustic = { pitchMean: a.pitchMean, pitchStddev: a.pitchStddev, avgEnergy: a.fluency.avgEnergy, energyVariation: a.fluency.energyVariation }
          setPitchContour(a.pitchContour)
        } catch (e) { monitoring.captureMessage('analyzeAudio failed (non-critical): ' + (e instanceof Error ? e.message : String(e)), 'warn'); setPitchContour([]) }
      }
      const result = await analyzePronunciation(phrase.text, said, phrase.ipa, level, acoustic)
      setAnalysis(result)
      setAnalyzing(false)

      if (result.issues.length > 0) {
        trackPronunciationErrors(result.issues, result.score, 'pronunciation', phrase.text).catch((e: unknown) => {
          monitoring.captureMessage('trackPronunciationErrors (pronunciation) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
        })
      }

      const key = `${category?.id}-${idx}`
      if (result.score >= 70 && !awardedRef.current.has(key)) {
        awardedRef.current.add(key)
        const xp = Math.round(result.score / 10)
        addXP(xp)
        feelLevelUp()
      }
    } else {
      if ('speechSynthesis' in window) speechSynthesis.cancel()
      setAnalysis(null)
      sr.reset()
      ar.reset()
      sr.start()
      // Mobilда STT mikrofonni eksklyuziv oladi — ovoz yozishni o'tkazib yuboramiz.
      if (!isMobileDevice()) ar.start()
    }
  }

  function exit() {
    if (sr.isRecording) sr.stop()
    sr.reset()
    ar.reset()
    if ('speechSynthesis' in window) speechSynthesis.cancel()
    setView('select'); setCategory(null); setAnalysis(null)
  }

  // ═══ SELECT ═══
  if (view === 'select') {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Mic size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">{t('pronunciation.title')}</h1>
            <p className="text-xs text-gray-500">{t('pronunciation.subtitle')}</p>
          </div>
        </div>

        <div className="rounded-2xl p-3.5 bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-800 dark:text-rose-200 flex gap-2">
          <Sparkles size={16} className="shrink-0 mt-0.5" />
          <span>{t('pronunciation.tip')}</span>
        </div>

        {sr.permissionError && (
          <div className="rounded-xl p-3 bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-700 dark:text-amber-300">
            <p className="font-medium flex items-center gap-1.5">
              <MicOff size={14} className="text-amber-500 shrink-0" />
              {t('speaking.micPermissionDenied')}
            </p>
            <button
              onClick={() => { sr.reset(); sr.start() }}
              className="mt-1.5 text-xs font-semibold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors"
            >
              <RotateCcw size={11} className="inline mr-1" />
              {t('speaking.micRetry')}
            </button>
          </div>
        )}
        {!sr.isSupported && (
          <div className="rounded-xl p-3 bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-700 dark:text-amber-300">
            {t('pronunciation.browserWarn')}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          {PRONUNCIATION_CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => openCategory(c)}
              className="text-left p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-rose-300 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-3xl">{c.emoji}</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">{t('pronunciation.phrasesCount', { count: String(c.phrases.length) })}</span>
              </div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{c.titleUz}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{c.whyUz}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ═══ PRACTICE ═══
  if (!category || !phrase) return null

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={exit} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ArrowLeft size={18} /></button>
        <span className="text-2xl">{category.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{category.titleUz}</p>
          <p className="text-xs text-gray-400">{t('pronunciation.phraseIndex', { current: String(idx + 1), total: String(category.phrases.length) })}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5">{category.whyUz}</p>

      {/* Phrase card */}
      <div className="card text-center py-6 space-y-3 relative">
        <p className="text-xl font-bold text-gray-900 dark:text-white leading-snug">{phrase.text}</p>
        <p className="text-sm text-violet-500 font-mono">{phrase.ipa}</p>
        <p className="text-xs text-gray-500">💡 {phrase.hintUz}</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={hearIt} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300 font-semibold text-sm active:scale-95 transition">
            <Volume2 size={16} /> {t('pronunciation.listenButton')}
          </button>
          <button
            onClick={() => setShowSpeedSettings(o => !o)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/40 text-xs font-semibold transition-all active:scale-95"
            title={t('pronunciation.speedSettingsLabel')}
            aria-label={t('pronunciation.speedSettingsAria')}
          >
            <Gauge size={14} />
            <span>{tts.speed}x</span>
          </button>
        </div>

        {/* Speed & Voice settings popover */}
        {showSpeedSettings && (
          <VoiceSettingsPopover
            speed={tts.speed}
            voices={tts.voices}
            selectedVoice={tts.selectedVoice}
            onSpeedChange={tts.setSpeed}
            onVoiceChange={tts.setVoice}
            onClose={() => setShowSpeedSettings(false)}
          />
        )}
      </div>

      {/* Mic */}
      {sr.isSupported && (
        <div className="flex flex-col items-center gap-2">
          {sr.permissionError && !sr.isRecording && !analyzing && (
            <div className="rounded-xl p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 w-full text-center">
              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center justify-center gap-1">
                <MicOff size={12} className="text-amber-500" />
                {t('speaking.micPermissionDenied')}
              </p>
              <button
                onClick={() => { sr.reset(); sr.start() }}
                className="mt-1 text-xs font-semibold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                <RotateCcw size={10} className="inline mr-1" />
                {t('speaking.micRetry')}
              </button>
            </div>
          )}
          {sr.isRecording && (
            <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 bg-rose-500 rounded-full" /> {t('pronunciation.listeningMic')}
            </p>
          )}
          <button
            onClick={handleMic}
            disabled={analyzing}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition disabled:opacity-50 ${
              sr.isRecording ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-br from-rose-500 to-pink-600'
            }`}
          >
            {sr.isRecording ? <Square size={24} /> : <Mic size={26} />}
          </button>
          <p className="text-xs text-gray-400">{sr.isRecording ? t('pronunciation.micStopHint') : analyzing ? t('pronunciation.analyzing') : sr.permissionError ? '' : t('pronunciation.micStartHint')}</p>
        </div>
      )}

      {/* Analyzing */}
      {analyzing && (
        <div className="text-center text-sm text-gray-500">{t('pronunciation.analyzingTitle')}</div>
      )}

      {/* Analysis result */}
      {analysis && !analyzing && (
        <div className="space-y-3">
          <div className={`card text-center bg-gradient-to-r ${scoreBg(analysis.score)} text-white`}>
            <p className="text-xs text-white/80">{t('pronunciation.scoreLabel')}</p>
            <p className="text-4xl font-black">{analysis.score}<span className="text-xl font-normal text-white/70">/100</span></p>
          </div>

          <div className="card">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{analysis.encouragement}</p>
          </div>

          {analysis.issues.length > 0 && (
            <div className="card">
              <p className="text-sm font-bold text-gray-800 dark:text-white mb-2.5">{t('pronunciation.issuesTitle')}</p>
              <div className="space-y-2">
                {analysis.issues.map((iss, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <button onClick={() => tts.speak(iss.word)} className="flex items-center gap-1 font-bold text-gray-800 dark:text-gray-200">
                        <Volume2 size={12} className="text-gray-400" /> {iss.word}
                      </button>
                      <span className="text-violet-500 font-mono text-xs">{iss.ipa}</span>
                    </div>
                    {iss.heard && iss.heard !== '—' && <p className="text-gray-400">{t('pronunciation.heardPrefix')}"{iss.heard}"</p>}
                    <p className="text-gray-600 dark:text-gray-400">💡 {iss.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stress visualization */}
          {analysis.issues.length > 0 && (
            <div className="space-y-2">
              {analysis.issues.map((iss, i) => (
                <StressVisualizer
                  key={i}
                  word={iss.word}
                  ipa={iss.ipa}
                  onSpeak={(w) => tts.speak(w)}
                />
              ))}
            </div>
          )}

          {/* Intonation contour */}
          {pitchContour.length > 1 && (
            <div className="card">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">{t('pronunciation.intonationTitle')}</p>
              <div className="h-16">
                <IntonationContour
                  pitchData={pitchContour}
                  duration={ar.duration}
                  width={480}
                  height={64}
                />
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                <span><span className="text-emerald-500">↗</span> {t('pronunciation.intonationRise')}</span>
                <span><span className="text-red-500">↘</span> {t('pronunciation.intonationFall')}</span>
                <span>{t('pronunciation.intonationLine')}</span>
              </div>
            </div>
          )}

          {/* Audio playback */}
          {ar.audioUrl && (
            <div className="space-y-2">
              <AudioPlayback
                audioUrl={ar.audioUrl}
                label={t('pronunciation.yourAudio')}
                color="text-rose-600"
                intonationData={pitchContour}
              />
              <button
                onClick={() => tts.speak(phrase?.text || '')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300 font-semibold text-sm hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors active:scale-[0.98]"
              >
                <Volume2 size={15} /> {t('pronunciation.hearSample')}
              </button>
            </div>
          )}

          <button onClick={() => { sr.reset(); ar.reset(); setAnalysis(null); setPitchContour([]) }} className="w-full btn-secondary py-2.5 font-bold flex items-center justify-center gap-1.5">
            <RotateCcw size={15} /> {t('pronunciation.retryButton')}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-1">
        <button onClick={() => goTo(Math.max(0, idx - 1))} disabled={idx === 0} className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-30">
          <ChevronLeft size={16} /> {t('pronunciation.prevButton')}
        </button>
        {analysis && analysis.score >= 70 && (
          <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-bold"><Trophy size={13} /> {t('pronunciation.xpEarned', { xp: String(Math.round(analysis.score / 10)) })}</span>
        )}
        <button onClick={() => goTo(Math.min(category.phrases.length - 1, idx + 1))} disabled={idx === category.phrases.length - 1} className="flex items-center gap-1 text-sm text-violet-500 font-semibold disabled:opacity-30">
          {t('pronunciation.nextButton')} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ─── Voice & Speed Settings Popover ──────────────────────────────────────

interface VoiceSettingsPopoverProps {
  speed: number
  voices: { name: string; lang: string; voice: SpeechSynthesisVoice }[]
  selectedVoice: { name: string; lang: string; voice: SpeechSynthesisVoice } | null
  onSpeedChange: (rate: number) => void
  onVoiceChange: (name: string) => void
  onClose: () => void
}

function VoiceSettingsPopover({ speed, voices, selectedVoice, onSpeedChange, onVoiceChange, onClose }: VoiceSettingsPopoverProps) {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 min-w-[220px] space-y-3"
    >
      {/* Speed */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
          <Gauge size={12} />
          <span>{t('pronunciation.speedLabel')}</span>
          <span className="ml-auto text-gray-400 font-mono">{speed}x</span>
        </div>
        <div className="flex gap-1">
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSpeedChange(opt.value)}
              className={`flex-1 text-xs font-semibold px-1 py-1.5 rounded-lg transition-colors ${
                speed === opt.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={opt.label}
            >
              {opt.value}x
            </button>
          ))}
        </div>
      </div>

      {/* Voice */}
      {voices.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('pronunciation.voiceLabel')}</div>
          <div className="max-h-[120px] overflow-y-auto space-y-0.5">
            {voices.map((v) => (
              <button
                key={v.name}
                onClick={() => onVoiceChange(v.name)}
                className={`w-full text-left text-xs px-2 py-1 rounded-lg transition-colors ${
                  selectedVoice?.name === v.name
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="block truncate">{v.name.replace(/^Microsoft |Google /, '')}</span>
                <span className="text-[9px] text-gray-400">{v.lang}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
