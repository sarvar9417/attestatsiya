import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import { fetchSpeakingPrompts, getDailyPrompts, saveSpeakingResult, saveChatResult } from '@/services/speakingService'
import type { SpeakingPrompt } from '@/services/speakingService'
import { evaluateSpeech, startSpeakingChat, getSpeakingChatFeedback } from '@/lib/claude'
import { useStore } from '@/store/useStore'
import { supabase } from '@/lib/supabase'
import { useSpeechRecognition, isMobileDevice } from '@/hooks/useSpeechRecognition'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { monitoring } from '../lib/monitoring'
import { analyzeAudio } from '@/hooks/useAudioAnalyser'
import SpeakingSelectView from '../components/speaking/SpeakingSelectView'
import SpeakingRecordView from '../components/speaking/SpeakingRecordView'
import SpeakingResultView from '../components/speaking/SpeakingResultView'
import SpeakingChatConversation from '../components/speaking/SpeakingChatConversation'
import SpeakingChatFeedback from '../components/speaking/SpeakingChatFeedback'
import {
  speakText, parseScores, parseFeedback,
  type View, type RecordState, type Scores, type ChatMessage, type ChatTopic,
} from '../components/speaking/speakingHelpers'

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Speaking() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const fromSkills = location.state?.from === '/skills'
  const { addXP, updateSkillProgress, currentDay, currentLevel, toggleChecklistItem, todayChecklist } = useStore()
  const sr = useSpeechRecognition()
  const ar = useAudioRecorder()

  const [view,        setView]        = useState<View>('select')
  const [prompt,      setPrompt]      = useState<SpeakingPrompt | null>(null)
  const [recordState, setRecordState] = useState<RecordState>('idle')
  const [evaluation,  setEvaluation]  = useState('')
  const [scores,      setScores]      = useState<Scores>({ fluency: 0, grammar: 0, vocabulary: 0 })
  const [feedback,    setFeedback]    = useState('')
  const [timer,       setTimer]       = useState(0)
  const [prompts,     setPrompts]     = useState<SpeakingPrompt[]>([])
  const [promptsLoading, setPromptsLoading] = useState(true)

  // Chat mode state
  const [mode,           setMode]           = useState<'prompt' | 'chat'>('prompt')
  const [chatMessages,   setChatMessages]   = useState<ChatMessage[]>([])
  const [chatFeedback,   setChatFeedback]   = useState('')
  const [chatLoading,    setChatLoading]    = useState(false)
  const [chatTopic,      setChatTopic]      = useState<ChatTopic | null>(null)
  const [streamingText,  setStreamingText]  = useState('')
  const [srReady,        setSrReady]        = useState(false)
  const [turnCount,      setTurnCount]      = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fetch prompts from Supabase
  useEffect(() => {
    fetchSpeakingPrompts().then((data) => {
      setPrompts(data)
      setPromptsLoading(false)
    })
  }, [])

  const dailyPrompts = prompts.length > 0 ? getDailyPrompts(currentDay, prompts) : []

  // ── Recording ──────────────────────────────────────────────────────────────

  function startRecording() {
    sr.start()
    if (!isMobileDevice()) ar.start()
    setRecordState('recording')
    setTimer(0)
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
  }

  function stopRecording() {
    sr.stop()
    ar.stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setRecordState('done')
  }

  function resetRecording() {
    sr.reset()
    ar.reset()
    if (timerRef.current) clearInterval(timerRef.current)
    setTimer(0)
    setRecordState('idle')
  }

  async function evaluate() {
    if (!prompt || !sr.transcript.trim()) return
    setRecordState('evaluating')
    setEvaluation('')
    let full = ''

    let acoustic
    if (ar.audioUrl) {
      try { acoustic = await analyzeAudio(ar.audioUrl, sr.transcript) } catch (e) { monitoring.captureMessage('analyzeAudio failed (non-critical): ' + (e instanceof Error ? e.message : String(e)), 'warn') }
    }

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
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user.id && prompt) {
            saveSpeakingResult({
              userId:          session.user.id,
              promptId:        prompt.id,
              promptText:      prompt.prompt,
              fluencyScore:    s.fluency,
              grammarScore:    s.grammar,
              vocabularyScore: s.vocabulary,
              avgScore:        avg,
              xpEarned:        avg * 3,
              feedback:        f,
            })
          }
        })
        setRecordState('done')
        setView('result')
      },
      () => setRecordState('done'),
      acoustic ? {
        speechRate: acoustic.fluency.speechRate,
        pauseCount: acoustic.fluency.pauseCount,
        avgPauseDuration: acoustic.fluency.avgPauseDuration,
        totalPauseRatio: acoustic.fluency.totalPauseRatio,
        pitchMean: acoustic.pitchMean,
        pitchStddev: acoustic.pitchStddev,
      } : undefined,
    )
  }

  // ── Chat handlers ────────────────────────────────────────────────────────────

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
    const estimatedScore = Math.max(5, Math.min(10, Math.round(userTurns * 0.7 + 3)))
    const progressPct = Math.min(100, Math.max(30, userTurns * 10))

    const feedback = await getSpeakingChatFeedback(
      currentLevel || 'B1',
      [...chatMessages, ...(streamingText ? [{ role: 'assistant' as const, content: streamingText }] : [])],
    )
    setChatFeedback(feedback)

    addXP(xpEarned)
    updateSkillProgress('todaySpeakingPct', progressPct)
    if (!todayChecklist.speaking) {
      toggleChecklistItem('speaking')
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id && chatTopic && chatTopic.id) {
        saveChatResult({
          userId:     session.user.id,
          promptId:   `chat_${chatTopic.id}`,
          promptText: chatTopic.prompt,
          turnCount:  userTurns,
          xpEarned,
          feedback,
          userScore:  estimatedScore,
        })
      }
    })

    setChatLoading(false)
    setView('chat-feedback')
  }

  // ── SELECT view ───────────────────────────────────────────────────────────

  if (view === 'select') {
    return (
      <SpeakingSelectView
        fromSkills={fromSkills}
        mode={mode}
        prompts={prompts}
        promptsLoading={promptsLoading}
        dailyPrompts={dailyPrompts}
        currentDay={currentDay}
        sr={sr}
        t={t as (key: string, params?: Record<string, string>) => string}
        onModeChange={setMode}
        onSelectPrompt={(p) => { setPrompt(p); resetRecording(); setView('record') }}
        onStartChat={startChat}
        onNavigateConversation={() => navigate('/conversation')}
        onNavigatePronunciation={() => navigate('/pronunciation')}
        onNavigateSkills={() => navigate('/skills')}
      />
    )
  }

  // ── RESULT view ───────────────────────────────────────────────────────────

  if (view === 'result') {
    return (
      <SpeakingResultView
        scores={scores}
        feedback={feedback}
        timer={timer}
        transcript={sr.transcript}
        audioUrl={ar.audioUrl}
        t={t as (key: string, params?: Record<string, string>) => string}
        onBack={() => setView('select')}
        onRetry={() => { resetRecording(); setEvaluation(''); setView('record') }}
        onNext={() => setView('select')}
      />
    )
  }

  // ── CHAT CONVERSATION view ─────────────────────────────────────────────────

  if (view === 'chat-conversation') {
    const canSend = sr.transcript.trim().length > 0 && !chatLoading && srReady

    return (
      <SpeakingChatConversation
        chatMessages={chatMessages}
        chatLoading={chatLoading}
        streamingText={streamingText}
        sr={sr}
        chatTopic={chatTopic}
        turnCount={turnCount}
        canSend={canSend}
        srReady={srReady}
        t={t as (key: string, params?: Record<string, string>) => string}
        onSendMessage={sendChatMessage}
        onEndChat={endChat}
        onBack={() => { setView('select'); if ('speechSynthesis' in window) speechSynthesis.cancel(); sr.reset() }}
      />
    )
  }

  // ── CHAT FEEDBACK view ─────────────────────────────────────────────────────

  if (view === 'chat-feedback') {
    const xpEarned = Math.max(5, Math.min(30, turnCount * 3))
    const progressPct = Math.min(100, Math.max(30, turnCount * 10))

    return (
      <SpeakingChatFeedback
        chatFeedback={chatFeedback}
        turnCount={turnCount}
        chatMessages={chatMessages}
        chatTopic={chatTopic}
        todayChecklist={todayChecklist}
        xpEarned={xpEarned}
        progressPct={progressPct}
        t={t as (key: string, params?: Record<string, string>) => string}
        onBack={() => setView('select')}
      />
    )
  }

  // ── RECORD view ───────────────────────────────────────────────────────────

  if (!prompt) return null

  const isRecording  = recordState === 'recording'
  const isDone       = recordState === 'done'
  const isEvaluating = recordState === 'evaluating'

  return (
    <SpeakingRecordView
      prompt={prompt}
      sr={sr}
      ar={ar}
      timer={timer}
      evaluation={evaluation}
      isRecording={isRecording}
      isDone={isDone}
      isEvaluating={isEvaluating}
      t={t as (key: string, params?: Record<string, string>) => string}
      onStartRecording={startRecording}
      onStopRecording={stopRecording}
      onReset={resetRecording}
      onEvaluate={evaluate}
      onBack={() => { resetRecording(); setView('select') }}
    />
  )
}
