// Speaking Path — Erkin Amaliyot (eski /speaking sahifasidan ko'chirilgan)
// Qo'shilgan route: /speaking → /speaking-path birlashtirilgandan keyin bu komponent
// Erkin amaliyot: Prompt mode + Chat mode + havolalar

import { useState, useEffect, useRef } from 'react'
import { Mic, ChevronLeft, Loader2, Volume2, MessageCircle, Sparkles, RotateCcw, MicOff, Send, Square, Brain } from 'lucide-react'
import { SkeletonText } from '../ui/Skeleton'
import SpeakingHistory from '../speaking/SpeakingHistory'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '../../data/speakingPrompts'
import { fetchSpeakingPrompts, getDailyPrompts, saveSpeakingResult, saveChatResult } from '../../services/speakingService'
import { evaluateSpeech, startSpeakingChat, getSpeakingChatFeedback } from '../../lib/claude'
import { useStore } from '../../store/useStore'
import { useAuth } from '../../hooks/useAuth'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import HoldMicButton from './HoldMicButton'
import { useNavigate } from 'react-router-dom'
import { speak as ttsSpeak } from '../../lib/tts'
import type { SpeakingPrompt } from '../../services/speakingService'

// ── Types ─────────────────────────────────────────────────────────────────────

type View = 'select' | 'record' | 'result' | 'chat-conversation' | 'chat-feedback'
type RecordState = 'idle' | 'recording' | 'evaluating' | 'done'

interface Scores { fluency: number; grammar: number; vocabulary: number }

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatTopic {
  id: string
  title: string
  category: SpeakingPrompt['category']
  prompt: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function speakText(text: string) {
  ttsSpeak(text, { rate: 0.85 }).catch(() => {
    // TTS ishlamasa — indamay o'tib ketamiz
  })
}

function parseScores(text: string): Scores {
  const get = (key: string) =>
    Math.min(10, Math.max(0, parseInt(text.match(new RegExp(`${key}:\\s*(\\d+)`))?.[1] ?? '0')))
  return { fluency: get('FLUENCY'), grammar: get('GRAMMAR'), vocabulary: get('VOCABULARY') }
}

function parseFeedback(text: string): string {
  return text.split('FEEDBACK:')[1]?.trim() ?? ''
}

function ScoreCard({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="card text-center">
      <div className={`text-2xl font-bold ${color}`}>{score}<span className="text-base font-normal text-gray-400">/10</span></div>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function FreePractice() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const userId = user?.id
  const { addXP, updateSkillProgress, currentDay, currentLevel, toggleChecklistItem, todayChecklist } = useStore()
  const sr = useSpeechRecognition()

  const [view, setView] = useState<View>('select')
  const [prompt, setPrompt] = useState<SpeakingPrompt | null>(null)
  const [recordState, setRecordState] = useState<RecordState>('idle')
  const [evaluation, setEvaluation] = useState('')
  const [scores, setScores] = useState<Scores>({ fluency: 0, grammar: 0, vocabulary: 0 })
  const [feedback, setFeedback] = useState('')
  const [timer, setTimer] = useState(0)
  const [prompts, setPrompts] = useState<SpeakingPrompt[]>([])
  const [promptsLoading, setPromptsLoading] = useState(true)

  // Chat mode state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatFeedback, setChatFeedback] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatTopic, setChatTopic] = useState<ChatTopic | null>(null)
  const [streamingText, setStreamingText] = useState('')
  const [srReady, setSrReady] = useState(false)
  const [turnCount, setTurnCount] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetchSpeakingPrompts().then((data) => {
      setPrompts(data)
      setPromptsLoading(false)
    })
  }, [])

  const dailyPrompts = prompts.length > 0 ? getDailyPrompts(currentDay, prompts) : []

  // ── Permission error → recording state ni to'xtat ──────────────────────
  useEffect(() => {
    if (sr.permissionError && recordState === 'recording') {
      if (timerRef.current) clearInterval(timerRef.current)
      setTimer(0)
      setRecordState('idle')
    }
  }, [sr.permissionError, recordState])

  // ── Recording ──────────────────────────────────────────────────────────────

  function startRecording() {
    sr.start()
    setRecordState('recording')
    setTimer(0)
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
  }

  function stopRecording() {
    sr.stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setRecordState('done')
  }

  function resetRecording() {
    sr.reset()
    if (timerRef.current) clearInterval(timerRef.current)
    setTimer(0)
    setRecordState('idle')
  }

  async function evaluate() {
    if (!prompt || !sr.transcript.trim()) return
    setRecordState('evaluating')
    setEvaluation('')
    let full = ''

    evaluateSpeech(
      prompt.prompt,
      sr.transcript,
      currentLevel || 'B1',
      (token) => { full += token; setEvaluation(full) },
      (text) => {
        const s = parseScores(text)
        const f = parseFeedback(text)
        setScores(s)
        setFeedback(f)
        const avg = Math.round((s.fluency + s.grammar + s.vocabulary) / 3)
        addXP(avg * 3)
        updateSkillProgress('todaySpeakingPct', avg * 10)
        if (userId && prompt) {
          saveSpeakingResult({
            userId,
            promptId: prompt.id,
            promptText: prompt.prompt,
            fluencyScore: s.fluency,
            grammarScore: s.grammar,
            vocabularyScore: s.vocabulary,
            avgScore: avg,
            xpEarned: avg * 3,
            feedback: f,
          })
        }
        setRecordState('done')
        setView('result')
      },
      () => setRecordState('done'),
    )
  }

  // ── Chat handlers ───────────────────────────────────────────────────────────

  function startChat(topic: ChatTopic) {
    setChatTopic(topic)
    setChatMessages([])
    setChatFeedback('')
    setStreamingText('')
    setTurnCount(0)
    setView('chat-conversation')
    setChatLoading(true)
    if ('speechSynthesis' in window) speechSynthesis.cancel()

    startSpeakingChat(
      topic.prompt,
      currentLevel || 'B1',
      [],
      (token) => setStreamingText((prev) => prev + token),
      (full) => {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: full, timestamp: Date.now() }])
        setStreamingText('')
        setChatLoading(false)
        setSrReady(true)
        speakText(full)
      },
      () => { setChatLoading(false); setSrReady(true) }
    )
  }

  function sendChatMessage() {
    const text = sr.transcript.trim()
    if (!text || chatLoading) return

    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now() }
    const updatedHistory = [...chatMessages, userMsg]
    setChatMessages(updatedHistory)
    setTurnCount((t) => t + 1)
    setSrReady(false)
    setStreamingText('')
    sr.reset()
    if ('speechSynthesis' in window) speechSynthesis.cancel()

    setChatLoading(true)
    startSpeakingChat(
      chatTopic?.prompt || '',
      currentLevel || 'B1',
      updatedHistory.map((m) => ({ role: m.role, content: m.content })),
      (token) => setStreamingText((prev) => prev + token),
      (full) => {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: full, timestamp: Date.now() }])
        setStreamingText('')
        setChatLoading(false)
        setSrReady(true)
        speakText(full)
      },
      () => { setChatLoading(false); setSrReady(true) }
    )
  }

  async function endChat() {
    setChatLoading(true)
    setSrReady(false)
    if ('speechSynthesis' in window) speechSynthesis.cancel()
    sr.reset()

    if (turnCount < 1 && chatMessages.length === 0) {
      setChatLoading(false)
      setView('select')
      return
    }

    const userTurns = turnCount
    const xpEarned = Math.max(5, Math.min(30, userTurns * 3))
    const progressPct = Math.min(100, Math.max(30, userTurns * 10))

    const feedbackText = await getSpeakingChatFeedback(
      currentLevel || 'B1',
      [...chatMessages, ...(streamingText ? [{ role: 'assistant' as const, content: streamingText }] : [])],
    )
    setChatFeedback(feedbackText)

    addXP(xpEarned)
    updateSkillProgress('todaySpeakingPct', progressPct)
    if (!todayChecklist.speaking) {
      toggleChecklistItem('speaking')
    }

    if (userId && chatTopic?.id) {
      saveChatResult({
        userId,
        promptId: `chat_${chatTopic.id}`,
        promptText: chatTopic.prompt,
        turnCount: userTurns,
        xpEarned,
        feedback: feedbackText,
        userScore: Math.max(5, Math.min(10, Math.round(userTurns * 0.7 + 3))),
      })
    }

    setChatLoading(false)
    setView('chat-feedback')
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, streamingText])

  // ── SELECT view ───────────────────────────────────────────────────────────

  if (view === 'select') {
    return (
      <div className="space-y-4">
        {/* Banner havolalar */}
        <button
          onClick={() => navigate('/conversation')}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-left flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm flex items-center gap-1.5">AI Suhbat Hamrohi <span className="text-xs bg-white/25 px-1.5 py-0.5 rounded-full font-bold">YANGI</span></p>
            <p className="text-xs text-white/85">Real vaziyatlarda rol o'ynang — restoran, ish suhbati, aeroport…</p>
          </div>
          <ChevronLeft size={18} className="rotate-180 shrink-0 text-white/70" />
        </button>

        <button
          onClick={() => navigate('/pronunciation')}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-left flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Mic size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm flex items-center gap-1.5">AI Talaffuz Murabbiysi <span className="text-xs bg-white/25 px-1.5 py-0.5 rounded-full font-bold">YANGI</span></p>
            <p className="text-xs text-white/85">Tovushlarni mashq qiling — th, w/v, unlilar, urg'u…</p>
          </div>
          <ChevronLeft size={18} className="rotate-180 shrink-0 text-white/70" />
        </button>

        {sr.permissionError && (
          <div className="card bg-amber-50 border-amber-100">
            <p className="text-sm text-amber-700 font-medium flex items-center gap-2">
              <MicOff size={16} className="text-amber-500 shrink-0" />
              Mikrofonga ruxsat berilmadi. Brauzer sozlamalarida mikrofon ruxsatini yoqing.
            </p>
            <button
              onClick={() => { sr.reset(); sr.start() }}
              className="mt-2 text-xs font-semibold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw size={12} className="inline mr-1" />
              Qayta urinish
            </button>
          </div>
        )}
        {!sr.isSupported && (
          <div className="card bg-red-50 border-red-100">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ Brauzeringiz ovozni tanimaydi. Android'da Chrome, iOS'da esa matn bilan yozishni ishlating.
            </p>
          </div>
        )}

        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Bugungi savollar ({currentDay}-kun)
        </p>
        <div className="space-y-2">
          {dailyPrompts.map((p) => (
            <button
              key={p.id}
              onClick={() => { setPrompt(p); resetRecording(); setView('record') }}
              className="w-full card text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`badge text-xs ${CATEGORY_COLOR[p.category]}`}>{CATEGORY_LABEL[p.category]}</span>
                    <span className="text-xs text-gray-400">{Math.floor(p.timeSeconds / 60)}:{String(p.timeSeconds % 60).padStart(2, '0')}</span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">{p.prompt}</p>
                  <div className="flex gap-1 mt-1.5">
                    {p.tips.slice(0, 2).map((tip, i) => (
                      <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">{tip}</span>
                    ))}
                  </div>
                </div>
                <Mic size={16} className="text-primary-400 flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>

        {/* Chat mode */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4">
          AI bilan suhbat
        </p>
        <div className="grid grid-cols-2 gap-2">
          {prompts.slice(0, 6).map((p) => {
            const topic: ChatTopic = {
              id: p.id,
              title: p.prompt.slice(0, 60) + (p.prompt.length > 60 ? '...' : ''),
              category: p.category,
              prompt: p.prompt,
            }
            return (
              <button
                key={p.id}
                onClick={() => startChat(topic)}
                className="card text-left p-3 hover:shadow-md active:scale-[0.98] transition-all"
              >
                <span className={`badge text-xs ${CATEGORY_COLOR[p.category]}`}>{CATEGORY_LABEL[p.category]}</span>
                <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{p.prompt}</p>
              </button>
            )
          })}
        </div>

        <details className="card">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 select-none">
            Barcha savollar ({prompts.length} ta)
          </summary>
          {promptsLoading ? (
            <div className="text-gray-400 animate-pulse text-center py-4 text-sm">Savollar yuklanmoqda...</div>
          ) : (
            <div className="space-y-0.5 mt-2 max-h-60 overflow-y-auto">
              {prompts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setPrompt(p); resetRecording(); setView('record') }}
                  className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0 flex items-center gap-2"
                >
                  <span className={`badge text-xs flex-shrink-0 ${CATEGORY_COLOR[p.category]}`}>{CATEGORY_LABEL[p.category]}</span>
                  <span className="line-clamp-1">{p.prompt}</span>
                </button>
              ))}
            </div>
          )}
        </details>
      </div>
    )
  }

  // ── RECORD view ──────────────────────────────────────────────────────────

  if (view === 'record' && prompt) {
    const isRecording = recordState === 'recording'
    const isDone = recordState === 'done'
    const isEvaluating = recordState === 'evaluating'
    const mins = Math.floor(timer / 60)
    const secs = timer % 60
    return (
      <div className="space-y-4">
        <button onClick={() => { resetRecording(); setView('select') }} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
          <ChevronLeft size={14} /> Savolga qaytish
        </button>

        <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800/50">
          <div className="flex items-start gap-2">
            <button onClick={() => speakText(prompt.prompt)} className="flex-shrink-0 mt-0.5 p-1 rounded-lg hover:bg-primary-100 transition-colors" title="Ovozli o'qish">
              <Volume2 size={16} className="text-primary-500" />
            </button>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">{prompt.prompt}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Maslahatlar:</p>
          <ul className="space-y-1">
            {prompt.tips.map((tip, i) => (
              <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5"><span className="text-primary-400 flex-shrink-0">•</span>{tip}</li>
            ))}
          </ul>
        </div>

        {sr.permissionError && !sr.transcript.trim() && (
          <div className="card bg-amber-50 border-amber-100">
            <p className="text-sm text-amber-700 font-medium flex items-center gap-2">
              <MicOff size={16} className="text-amber-500 shrink-0" />
              Mikrofonga ruxsat berilmadi. Brauzer sozlamalarida mikrofon ruxsatini yoqing.
            </p>
            <button
              onClick={() => { sr.reset(); sr.start() }}
              className="mt-2 text-xs font-semibold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw size={12} className="inline mr-1" />
              Qayta urinish
            </button>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <HoldMicButton
            isRecording={isRecording}
            onStart={startRecording}
            onStop={stopRecording}
            disabled={!sr.isSupported || isEvaluating || sr.permissionError}
            interim={sr.interim}
          />
          <div className="text-center min-h-[20px]">
            {isRecording && <p className="text-sm font-mono text-red-500 font-semibold">● {mins}:{String(secs).padStart(2, '0')}</p>}
            {isDone && <p className="text-sm text-green-600 font-medium">✓ Yozib olindi — {mins}:{String(secs).padStart(2, '0')}</p>}
          </div>
        </div>

        {(sr.transcript || sr.interim) && (
          <div className="card bg-gray-50 dark:bg-gray-800/60 border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{sr.transcript}{sr.interim && <span className="text-gray-400"> {sr.interim}</span>}</p>
          </div>
        )}

        <div className="flex gap-2">
          {(isDone || isRecording) && (
            <button onClick={resetRecording} className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1"><RotateCcw size={14} /> Qayta</button>
          )}
          {isDone && sr.transcript.trim() && (
            <button onClick={evaluate} disabled={isEvaluating} className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5">
              {isEvaluating ? <><Loader2 size={14} className="animate-spin" /> Baholanmoqda...</> : '✨ Claude baholaydi'}
            </button>
          )}
        </div>

        {isEvaluating && evaluation && (
          <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800/50">
            <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-1">Baholanmoqda...</p>
            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{evaluation}<span className="inline-block w-1 h-3 bg-primary-400 ml-0.5 animate-pulse align-middle" /></pre>
          </div>
        )}
      </div>
    )
  }

  // ── RESULT view ──────────────────────────────────────────────────────────

  if (view === 'result') {
    const avg = Math.round((scores.fluency + scores.grammar + scores.vocabulary) / 3)

    return (
      <div className="space-y-4">
        <div className="card bg-gradient-to-r from-primary-50 to-b2-50 dark:from-primary-900/20 dark:to-b2-900/20 border-primary-100 dark:border-primary-800/50 text-center">
          <p className="text-xs text-gray-500 mb-1">Umumiy ball</p>
          <p className="text-4xl font-bold text-primary-600">{avg}<span className="text-xl font-normal text-gray-400">/10</span></p>
          <p className="text-xs text-gray-500 mt-1">+{avg * 3} XP qozonildi</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <ScoreCard label="Fluency" score={scores.fluency} color="text-orange-600" />
          <ScoreCard label="Grammar" score={scores.grammar} color="text-green-600" />
          <ScoreCard label="Vocabulary" score={scores.vocabulary} color="text-primary-600" />
        </div>

        {timer > 0 && (
          <div className="card bg-gray-50 dark:bg-gray-800/60">
            <p className="text-xs font-semibold text-gray-500 mb-1">⚡ Nutq tezligi</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{Math.round(sr.transcript.trim().split(/\s+/).filter(Boolean).length / (timer / 60))} so'z/daqiqa</p>
            <p className="text-xs text-gray-400 mt-0.5">{Math.round(timer / 60)}:{String(timer % 60).padStart(2, '0')} · {sr.transcript.trim().split(/\s+/).filter(Boolean).length} so'z</p>
          </div>
        )}

        {feedback && (
          <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800/50">
            <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-1">💡 Feedback</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{feedback}</p>
          </div>
        )}

        <div className="card">
          <p className="text-xs font-semibold text-gray-500 mb-1">Sizning javobingiz</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">"{sr.transcript}"</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { resetRecording(); setEvaluation(''); setView('record') }} className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1">
            <RotateCcw size={14} /> Qayta yozish
          </button>
          <button onClick={() => setView('select')} className="btn-primary flex-1 text-sm">Boshqa savol</button>
        </div>

        <SpeakingHistory />
      </div>
    )
  }

  // ── CHAT CONVERSATION view ─────────────────────────────────────────────────

  if (view === 'chat-conversation') {
    const canSend = sr.transcript.trim().length > 0 && !chatLoading && srReady

    return (
      <div className="flex flex-col space-y-3" style={{ minHeight: '60vh' }}>
        <div className="flex items-center justify-between">
          <button onClick={() => { setView('select'); if ('speechSynthesis' in window) speechSynthesis.cancel(); sr.reset() }} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
            <ChevronLeft size={14} /> Suhbatga qaytish
          </button>
          <button onClick={endChat} disabled={chatLoading} className="text-xs text-red-500 font-semibold hover:text-red-700 disabled:opacity-40">
            <Square size={12} className="inline mr-1" /> Suhbatni tugat
          </button>
        </div>

        {chatTopic && (
          <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800/50">
            <div className="flex items-start gap-2">
              <Brain size={16} className="text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{chatTopic.prompt}</p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} className="flex-1 overflow-y-auto space-y-3 px-0.5" style={{ maxHeight: '50vh' }}>
          {chatMessages.length === 0 && !chatLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/40 rounded-2xl flex items-center justify-center mb-3 animate-pulse">
                <MessageCircle size={28} className="text-primary-500" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Claude suhbatni boshlayapti...</p>
            </div>
          )}

          {chatMessages.map((msg) => (
            <div key={msg.timestamp} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'}`}>
                {msg.role === 'assistant' && <div className="flex items-center gap-1.5 mb-1"><Brain size={12} className="text-primary-500" /><span className="text-xs font-semibold text-primary-600">Claude AI</span></div>}
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {chatLoading && streamingText && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md">
                <p className="text-sm leading-relaxed">{streamingText}<span className="inline-block w-1.5 h-4 bg-primary-400 ml-0.5 animate-pulse align-middle" /></p>
              </div>
            </div>
          )}

          {chatLoading && !streamingText && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {sr.isRecording && (
            <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800/50">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 animate-pulse flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{sr.transcript}{sr.interim && <span className="text-gray-400"> {sr.interim}</span>}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {sr.permissionError && !sr.isRecording && (
              <div className="text-center w-full">
                <p className="text-xs text-amber-600 font-medium">
                  Mikrofonga ruxsat berilmadi. Brauzer sozlamalarida mikrofon ruxsatini yoqing.
                </p>
                <button
                  onClick={() => { sr.reset(); sr.start() }}
                  className="mt-1.5 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <RotateCcw size={11} className="inline mr-1" />
                  Qayta urinish
                </button>
              </div>
            )}
            {!sr.isRecording ? (
              <button onClick={() => sr.start()} disabled={!sr.isSupported || chatLoading} className="btn-primary flex-1 text-sm flex items-center justify-center gap-2 py-3 disabled:opacity-40">
                <Mic size={18} /> Gapiring
              </button>
            ) : (
              <button onClick={() => sr.stop()} className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2 py-3">
                <MicOff size={18} className="text-red-500" /> To'xtatish
              </button>
            )}

            {!sr.isRecording && sr.transcript.trim() && (
              <button onClick={sendChatMessage} disabled={!canSend} className="btn-primary text-sm flex items-center justify-center gap-1.5 py-3 px-5 disabled:opacity-40">
                <Send size={16} /> Yuborish
              </button>
            )}

            {!sr.isRecording && !sr.transcript.trim() && !chatLoading && (
              <button onClick={() => sr.reset()} className="btn-ghost p-3 rounded-xl text-gray-400 hover:text-gray-600"><RotateCcw size={16} /></button>
            )}
          </div>

          {srReady && !chatLoading && <p className="text-xs text-gray-400 text-center">Mikrofon tugmasini bosing, gapiring va "Yuborish" ni bosing.</p>}
          {chatLoading && <p className="text-xs text-primary-500 animate-pulse text-center">Claude javob yozmoqda...</p>}
        </div>
      </div>
    )
  }

  // ── CHAT FEEDBACK view ───────────────────────────────────────────────────

  if (view === 'chat-feedback') {
    const xpEarned = Math.max(5, Math.min(30, turnCount * 3))
    const progressPct = Math.min(100, Math.max(30, turnCount * 10))

    return (
      <div className="space-y-4">
        <div className="card bg-gradient-to-r from-primary-50 to-b2-50 dark:from-primary-900/20 dark:to-b2-900/20 border-primary-100 dark:border-primary-800/50 text-center">
          <div className="w-12 h-12 bg-primary-200 dark:bg-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-2"><Sparkles size={24} className="text-primary-700 dark:text-primary-300" /></div>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">Ajoyib suhbat! 🎉</p>
          <p className="text-xs text-gray-500 mt-1">{turnCount} ta almashinuv</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="card text-center py-4"><p className="text-2xl font-bold text-primary-600">+{xpEarned}</p><p className="text-xs text-gray-500 mt-0.5">XP qozonildi</p></div>
          <div className="card text-center py-4"><p className="text-2xl font-bold text-green-600">{progressPct}%</p><p className="text-xs text-gray-500 mt-0.5">Speaking progress</p></div>
        </div>

        {chatFeedback ? (
          <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800/50">
            <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">💡 Claude dan feedback</p>
            <pre className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">{chatFeedback}</pre>
          </div>
        ) : (
          <div className="card bg-gray-50 dark:bg-gray-800/60 text-center py-6"><p className="text-sm text-gray-500 mb-3">Feedback tayyorlanmoqda...</p><SkeletonText lines={3} /></div>
        )}

        <button onClick={() => setView('select')} className="btn-primary w-full text-sm">Yana mashq qilish</button>
      </div>
    )
  }

  return null
}
