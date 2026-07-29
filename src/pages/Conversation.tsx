import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Sparkles, Trophy, BookOpen, AlertCircle, Volume2, Lightbulb, Mic, MicOff, Square, RotateCcw } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useI18n } from '../i18n'
import type { TranslationStrings } from '../i18n/types'
import { CONVERSATION_SCENARIOS, type ConversationScenario } from '../data/conversationScenarios'
import { startScenarioConversation, getScenarioReport, type ScenarioReport } from '../lib/claude'
import { feelLevelUp, feelTap } from '../lib/gameFeel'
import { monitoring } from '../lib/monitoring'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

type View = 'select' | 'chat' | 'loading-report' | 'report'
interface Msg { role: 'user' | 'assistant'; content: string }

function catLabel(cat: ConversationScenario['category'], t: (key: keyof TranslationStrings, params?: Record<string, string>) => string): string {
  const labels: Record<ConversationScenario['category'], string> = {
    kundalik: t('conversation.categoryDaily'),
    sayohat: t('conversation.categoryTravel'),
    ish: t('conversation.categoryWork'),
    ijtimoiy: t('conversation.categorySocial'),
  }
  return labels[cat]
}
const CATEGORY_COLOR: Record<ConversationScenario['category'], string> = {
  kundalik: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  sayohat:  'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  ish:      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  ijtimoiy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

export default function Conversation() {
  const { t } = useI18n()
  const currentLevel = useStore(s => s.currentLevel)
  const addXP = useStore(s => s.addXP)
  const level = (currentLevel || 'B1').replace('+', '')

  const [view, setView] = useState<View>('select')
  const [scenario, setScenario] = useState<ConversationScenario | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [streaming, setStreaming] = useState('')
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [voiceOn, setVoiceOn] = useState(true)
  const [showHints, setShowHints] = useState(false)
  const [report, setReport] = useState<ScenarioReport | null>(null)
  const [xpEarned, setXpEarned] = useState(0)

  const sr = useSpeechRecognition()
  const tts = useSpeechSynthesis()
  const scrollRef = useRef<HTMLDivElement>(null)
  const turnCount = messages.filter(m => m.role === 'user').length

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, streaming])

  // Ovozli kiritish: gapirilganda matnni input maydoniga yozamiz
  useEffect(() => {
    if (sr.isRecording) setInput((sr.transcript + ' ' + sr.interim).trim())
  }, [sr.transcript, sr.interim, sr.isRecording])

  function toggleMic() {
    if (sr.isRecording) {
      sr.stop()
    } else {
      tts.stop()  // AI ovozini to'xtatamiz
      setInput('')
      sr.reset()
      sr.start()
    }
  }

  function sceneCtx(s: ConversationScenario) {
    return { aiRole: s.aiRole, userRole: s.userRole, opening: s.opening, title: s.title }
  }

  function startScenario(s: ConversationScenario) {
    feelTap()
    setScenario(s)
    setMessages([{ role: 'assistant', content: s.opening }])
    setView('chat')
    setShowHints(false)
    if (voiceOn) tts.speak(s.opening).catch((e) => monitoring.captureMessage('TTS speak (opening) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
  }

  function send() {
    const text = input.trim()
    if (!text || loading || !scenario) return
    if (sr.isRecording) sr.stop()
    sr.reset()
    const history: Msg[] = [...messages, { role: 'user', content: text }]
    setMessages(history)
    setInput('')
    setStreaming('')
    setLoading(true)

    startScenarioConversation(
      sceneCtx(scenario), level,
      history.map(m => ({ role: m.role, content: m.content })),
      (token) => setStreaming(prev => prev + token),
      (full) => {
        setMessages(prev => [...prev, { role: 'assistant', content: full }])
        setStreaming('')
        setLoading(false)
        if (voiceOn) tts.speak(full).catch((e) => monitoring.captureMessage('TTS speak (response) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
      },
      () => { setLoading(false); setStreaming(''); monitoring.captureMessage('Streaming error in conversation', 'warn') },
    )
  }

  async function endConversation() {
    if (!scenario) return
    if (sr.isRecording) sr.stop()
    tts.stop()
    setView('loading-report')
    const r = await getScenarioReport(
      sceneCtx(scenario), scenario.goalUz, level,
      messages.map(m => ({ role: m.role, content: m.content })),
    )
    setReport(r)
    // XP: asosiy 10 + maqsad bonusi + ravonlik bonusi
    const xp = 10 + Math.round(r.taskSuccess * 1.5) + Math.round(r.fluency)
    setXpEarned(xp)
    addXP(xp)
    feelLevelUp()
    setView('report')
  }

  function reset() {
    tts.stop()
    if (sr.isRecording) sr.stop()
    sr.reset()
    setView('select'); setScenario(null); setMessages([]); setStreaming(''); setReport(null); setInput('')
  }

  // ═══ SELECT ═══
  if (view === 'select') {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">{t('conversation.title')}</h1>
            <p className="text-xs text-gray-500">{t('conversation.subtitle')}</p>
          </div>
        </div>

        <div className="rounded-2xl p-3.5 bg-violet-50 dark:bg-violet-950/30 text-xs text-violet-800 dark:text-violet-200 flex gap-2">
          <Lightbulb size={16} className="shrink-0 mt-0.5" />
          <span>{t('conversation.tip')}</span>
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

        <div className="grid sm:grid-cols-2 gap-3">
          {CONVERSATION_SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => startScenario(s)}
              className="text-left p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-violet-300 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-3xl">{s.emoji}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${CATEGORY_COLOR[s.category]}`}>{catLabel(s.category, t)}</span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">{s.minLevel}+</span>
                </div>
              </div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{s.titleUz}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{s.goalUz}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ═══ LOADING REPORT ═══
  if (view === 'loading-report') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="text-6xl mb-4 animate-bounce">🧠</div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('conversation.loadingTitle')}</h2>
        <p className="text-sm text-gray-500">{t('conversation.loadingDesc')}</p>
      </div>
    )
  }

  // ═══ REPORT ═══
  if (view === 'report' && report && scenario) {
    const Bar = ({ label, value }: { label: string; value: number }) => (
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">{label}</span>
          <span className="font-bold text-gray-800 dark:text-gray-200">{value}/10</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all" style={{ width: `${value * 10}%` }} />
        </div>
      </div>
    )
    return (
      <div className="max-w-xl mx-auto p-4 space-y-4">
        <div className="text-center pt-2">
          <div className="text-6xl mb-2">{report.taskSuccess >= 7 ? '🎉' : '💪'}</div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">{t('conversation.reportCompleted', { emoji: scenario.emoji, title: scenario.titleUz })}</h1>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold text-sm">
            <Trophy size={15} /> +{xpEarned} XP
          </div>
        </div>

        <div className="card space-y-3">
          <Bar label={t('conversation.barFluency')} value={report.fluency} />
          <Bar label={t('conversation.barTaskSuccess')} value={report.taskSuccess} />
        </div>

        <div className="card">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{report.encouragement}</p>
        </div>

        {report.newWords.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-2.5">
              <BookOpen size={16} className="text-emerald-500" />
              <h3 className="text-sm font-bold text-gray-800 dark:text-white">{t('conversation.newWordsTitle')}</h3>
            </div>
            <div className="space-y-1.5">
              {report.newWords.map((w) => (
                <div key={w.word} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <button onClick={() => tts.speak(w.word)} className="flex items-center gap-1.5 font-semibold text-sm text-gray-800 dark:text-gray-200">
                    <Volume2 size={13} className="text-gray-400" /> {w.word}
                  </button>
                  <span className="text-xs text-gray-500 text-right">{w.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {report.mistakes.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertCircle size={16} className="text-rose-500" />
              <h3 className="text-sm font-bold text-gray-800 dark:text-white">{t('conversation.mistakesTitle')}</h3>
            </div>
            <div className="space-y-2">
              {report.mistakes.map((m, i) => (
                <div key={`${m.wrong}-${i}`} className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs space-y-0.5">
                  <p className="text-rose-500 line-through">{m.wrong}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">{m.correct}</p>
                  <p className="text-gray-500">💡 {m.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={() => startScenario(scenario)} className="flex-1 btn-secondary py-3 font-bold">{t('conversation.retryButton')}</button>
          <button onClick={reset} className="flex-1 btn-primary py-3 font-bold">{t('conversation.otherScenario')}</button>
        </div>
      </div>
    )
  }

  // ═══ CHAT ═══
  return (
    <div className="flex flex-col max-w-2xl mx-auto" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <button onClick={reset} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center"><ArrowLeft size={18} /></button>
        <span className="text-2xl">{scenario?.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{scenario?.titleUz}</p>
          <p className="text-xs text-gray-400 truncate">🎯 {scenario?.goalUz}</p>
        </div>
        <button onClick={() => setVoiceOn(v => !v)} title={t('conversation.voiceTitle')} className={`p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center ${voiceOn ? 'text-violet-500 bg-violet-50 dark:bg-violet-950/40' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
          <Volume2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.map((m, i) => (
          <div key={`msg-${i}-${m.role}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-violet-500 text-white rounded-br-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-3.5 py-2 rounded-2xl rounded-bl-md text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">{streaming}<span className="animate-pulse">▋</span></div>
          </div>
        )}
        {loading && !streaming && (
          <div className="flex justify-start"><div className="px-3.5 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 flex gap-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div></div>
        )}
      </div>

      {/* Hints */}
      {showHints && scenario && (
        <div className="px-3 pb-1 flex flex-wrap gap-1.5">
          {scenario.hints.map((h) => (
            <button key={h} onClick={() => { setInput(h); setShowHints(false) }} className="text-xs px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-800">{h}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-2">
        <div className="flex items-center justify-between">
          <button onClick={() => setShowHints(v => !v)} className="text-xs text-violet-500 font-semibold flex items-center gap-1 min-h-[44px]"><Lightbulb size={14} /> {t('conversation.hintsButton')}</button>
          {turnCount >= 2 && (
            <button onClick={endConversation} className="text-xs text-gray-500 font-semibold underline min-h-[44px]">{t('conversation.endButton')}</button>
          )}
        </div>

        {sr.isRecording && (            <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 bg-rose-500 rounded-full" /> {t('conversation.listeningMic')}
            </p>
        )}

        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send() }}
            placeholder={sr.isRecording ? t('conversation.listeningMic') : t('conversation.inputPlaceholder')}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none focus:ring-2 ring-violet-400"
          />
          {sr.isSupported && (
            <button
              onClick={toggleMic}
              disabled={loading}
              title={sr.isRecording ? t('conversation.micTitleStop') : t('conversation.micTitleStart')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition active:scale-95 disabled:opacity-40 ${
                sr.isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-violet-500'
              }`}
            >
              {sr.isRecording ? <Square size={16} /> : <Mic size={18} />}
            </button>
          )}
          {sr.permissionError && !sr.isRecording && (
            <button
              onClick={() => { sr.reset(); sr.start() }}
              className="text-xs text-amber-600 font-semibold flex items-center gap-1"
              title={t('speaking.micRetry')}
            >
              <RotateCcw size={12} /> {t('speaking.micRetry')}
            </button>
          )}
          <button onClick={send} disabled={!input.trim() || loading} className="w-10 h-10 rounded-xl bg-violet-500 text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition shrink-0">
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
