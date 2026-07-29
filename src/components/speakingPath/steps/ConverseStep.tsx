// Speaking Path — Qadam 4: AI suhbat (rol o'yini)
// Reja: docs/speaking-path-roadmap.md (6-bo'lim)
// Kunning stsenariysi bilan Claude bilan jonli suhbat → yakunda fikr.

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Loader2, Sparkles, ArrowRight, Bot, Volume2, BookOpen, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import { startSpeakingChat, getSpeakingChatFeedback } from '../../../lib/claude'
import { monitoring } from '../../../lib/monitoring'
import MicButton from '../MicButton'
import type { SpeakingDay } from '../../../data/speakingPath/types'
import { useI18n } from '../../../i18n'

interface Props {
  day: SpeakingDay
  level: string
  onNext: () => void
}

type Msg = { role: 'user' | 'assistant'; content: string }

const MIN_USER_TURNS = 3

export default function ConverseStep({ day, level, onNext }: Props) {
  const { t } = useI18n()
  const topic = `${day.scenario.topic}. You play ${day.scenario.aiRole}; I play ${day.scenario.userRole}.`
  const pronunciationFocus = day.pronunciationFocus
  const grammarTips = day.chunks.filter(c => c.grammarTip).map(c => `"${c.en}" — ${c.grammarTip}`)

  const [history, setHistory] = useState<Msg[]>([])
  const [streaming, setStreaming] = useState('')
  const [busy, setBusy] = useState(false)
  const [userTurns, setUserTurns] = useState(0)
  const [typed, setTyped] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [finishing, setFinishing] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showVocab, setShowVocab] = useState(false)
  const startedRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const runAi = useCallback((hist: Msg[]) => {
    setBusy(true)
    setStreaming('')
    let acc = ''
    startSpeakingChat(
      topic, level, hist,
      (token) => { acc += token; setStreaming(acc) },
      (full) => {
        setHistory(prev => [...prev, { role: 'assistant', content: full || acc }])
        setStreaming('')
        setBusy(false)
      },
      (err) => {
        monitoring.captureException(err, { context: 'ConverseStep.startSpeakingChat' })
        setStreaming('')
        setBusy(false)
        setHistory(prev => [...prev, { role: 'assistant', content: "(Aloqa uzildi — yana urinib ko'ring)" }])
      },
      pronunciationFocus ?? undefined,
      grammarTips,
    )
  }, [topic, level, pronunciationFocus, grammarTips])

  // ochilishda AI suhbatni boshlaydi
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    runAi([])
  }, [runAi])

  // pastga skroll — debounced (streaming har bir tokenda scrollni chaqirmasligi uchun)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 100)
    return () => { if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current) }
  }, [history, streaming])

  const sendUser = useCallback((text: string) => {
    if (busy || !text.trim()) return
    const next = [...history, { role: 'user' as const, content: text.trim() }]
    setHistory(next)
    setUserTurns(t => t + 1)
    setTyped('')
    runAi(next)
  }, [busy, history, runAi])

  const finish = useCallback(async () => {
    setFinishing(true)
    try {
      const fb = await getSpeakingChatFeedback(level, history, pronunciationFocus ?? undefined, grammarTips)
      setFeedback(fb || "Ajoyib mashq! Har bir suhbat sizni kuchaytiradi.")
    } catch (err) {
      monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'ConverseStep.feedback' })
      setFeedback("Ajoyib mashq! Har bir suhbat sizni kuchaytiradi.")
    }
  }, [level, history, pronunciationFocus, grammarTips])

  // ── Yakuniy fikr ekrani ──
  if (feedback) {
    return (
      <div className="rounded-2xl p-6 bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 border border-primary-200 dark:border-primary-800/50 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500 flex items-center justify-center">
          <Sparkles size={28} className="text-white" />
        </div>
        <p className="mt-3 font-black text-gray-900 dark:text-gray-100">Suhbat tugadi! 🎉</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line text-left">{feedback}</p>
        <button onClick={onNext} className="mt-4 w-full py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all">
          Kunni yakunlash
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">🤖 AI bilan suhbat</p>
        <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">🎯 {day.scenario.goalUz}</p>
      </div>

      {/* Talaffuz fokusi banneri */}
      {pronunciationFocus && (
        <div className="rounded-xl p-3 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-200 dark:border-violet-800/30">
          <div className="flex items-start gap-2">
            <Volume2 size={16} className="text-violet-600 dark:text-violet-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-violet-700 dark:text-violet-300">
                Bugungi talaffuz fokusi: /{pronunciationFocus.sound}/ — {pronunciationFocus.ipaExample}
              </p>
              <p className="text-xs text-violet-600/80 dark:text-violet-400/80 mt-0.5">
                💡 {pronunciationFocus.tipUz}
              </p>
              {pronunciationFocus.commonError && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  ⚠️ {pronunciationFocus.commonError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Just-in-time Vocabulary (yig'iladigan) */}
      {day.vocab && day.vocab.length > 0 && (
        <div>
          <button
            onClick={() => setShowVocab(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
          >
            <Lightbulb size={14} />
            Foydali so'zlar ({day.vocab.length} ta)
            {showVocab ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showVocab && (
            <div className="mt-2 grid grid-cols-2 gap-1.5 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
              {day.vocab.map((v, i) => (
                <div key={i} className="text-xs">
                  <span className="font-bold text-gray-900 dark:text-gray-100">{v.en}</span>
                  <span className="text-gray-500 dark:text-gray-400 mx-1">—</span>
                  <span className="text-gray-600 dark:text-gray-300">{v.uz}</span>
                  {v.example && (
                    <p className="text-gray-400 dark:text-gray-500 italic mt-0.5">"{v.example}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grammatika maslahatlari (yig'iladigan) */}
      {grammarTips.length > 0 && (
        <div>
          <button
            onClick={() => setShowTips(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <BookOpen size={14} />
            Grammatik maslahatlar ({grammarTips.length} ta)
            {showTips ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showTips && (
            <div className="mt-2 space-y-1.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
              {grammarTips.map((tip, i) => (
                <p key={i} className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-bold text-primary-600 dark:text-primary-400">{i + 1}.</span> {tip}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suhbat */}
      <div ref={scrollRef} className="min-h-[50vh] lg:h-72 overflow-y-auto space-y-2 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
        {history.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.role === 'user'
              ? 'bg-primary-600 text-white rounded-br-sm'
              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-bl-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">{streaming}</div>
          </div>
        )}
        {busy && !streaming && (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs"><Bot size={14} /> <Loader2 size={12} className="animate-spin" /> yozmoqda…</div>
        )}
      </div>

      {/* Kirish */}
      <div className="space-y-2">
        <MicButton onResult={sendUser} disabled={busy} label="Javob bering" />
        <div className="flex items-center gap-2">
          <input
            value={typed}
            onChange={e => setTyped(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendUser(typed) }}
            disabled={busy}
            placeholder="…yoki javobni yozing"
            className="flex-1 px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50"
          />
          <button onClick={() => sendUser(typed)} disabled={busy || !typed.trim()} className="p-2.5 rounded-xl bg-primary-600 text-white disabled:opacity-40"           aria-label={t('aria.send')}>
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Yakunlash (yetarli suhbatdan keyin) */}
      {userTurns >= MIN_USER_TURNS && !busy && (
        <button onClick={finish} disabled={finishing} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] transition-all disabled:opacity-60">
          {finishing ? <><Loader2 size={16} className="animate-spin" /> Fikr tayyorlanmoqda…</> : <>Suhbatni yakunlash <ArrowRight size={16} /></>}
        </button>
      )}
    </div>
  )
}
