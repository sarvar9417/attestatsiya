import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { startDayConversation, startDayRoleplay, generateConversationFeedback } from '../../lib/openaiChat'
import type { ChallengeDay, RoleplayExercise } from '../../data/30dayChallenge'
import { inferScenario } from '../../lib/roleplayUtils'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import { useLifeMemory } from '../../hooks/useLifeMemory'
import type { ChatMsg, ConversationMode } from './aiChatTypes'
import AiConversationHeader from './AiConversationHeader'
import RoleplayPicker from './RoleplayPicker'
import LifeMemoryOverlay from './LifeMemoryOverlay'
import AiFeedbackOverlay from './AiFeedbackOverlay'
import AiChatMessages from './AiChatMessages'
import AiChatInput from './AiChatInput'

interface Props {
  day: ChallengeDay
}

export default function AiConversationSection({ day }: Props) {
  const [mode, setMode] = useState<ConversationMode>('free')
  const [activeRoleplay, setActiveRoleplay] = useState<RoleplayExercise | null>(null)
  const [showRoleplayPicker, setShowRoleplayPicker] = useState(true)

  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: `👋 Let's practice speaking about **${day.title}**!\\n\\nYou can **type** or use the **microphone** 🎤 to reply. I'll respond like a real conversation partner.\\n\\nWant a role-play? Click the 🎭 **Role-play** button above!` },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackResult, setFeedbackResult] = useState('')
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false)
  const [showLifeMemory, setShowLifeMemory] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const lifeMemory = useLifeMemory()
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const sr = useSpeechRecognition()
  const tts = useSpeechSynthesis()

  // ── Extract roleplay exercises from the day ─────────────────────────────
  const roleplayExercises = useMemo(() => {
    const fromExercises: RoleplayExercise[] = day.exercises.filter(
      (ex): ex is RoleplayExercise => ex.type === 'roleplay'
    )

    const fromTranscript: RoleplayExercise[] = []
    if (day.structuredTranscript) {
      for (const section of day.structuredTranscript) {
        if (!section.title.toLowerCase().includes('situation')) continue
        const speakers = [...new Set(section.lines.map(l => l.speaker).filter(Boolean) as string[])]
        const studentSpeakers = ['Fizu', 'Student', 'You']
        const studentSpeaker = speakers.find(s => studentSpeakers.includes(s))
        if (!studentSpeaker) continue
        const aiSpeakers = speakers.filter(s => s !== studentSpeaker)
        if (aiSpeakers.length === 0) continue

        const scenarioText = `${section.title}. ${aiSpeakers.join(' & ')} speaks with ${studentSpeaker}.`
        fromTranscript.push({
          id: 100000 + fromTranscript.length,
          type: 'roleplay',
          instruction: `Video dialog: ${section.title}`,
          scenario: scenarioText,
          tips: [`You are ${studentSpeaker}. Respond naturally as ${studentSpeaker} in this ${section.title} scene.`],
        })
      }
    }

    return [...fromExercises, ...fromTranscript]
  }, [day])

  // ── Derived ─────────────────────────────────────────────────────────────
  const userMsgCount = messages.filter(m => m.role === 'user').length

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, streamingText])

  // Voice input → text
  useEffect(() => {
    if (sr.isRecording && sr.transcript) {
      setInput(prev => {
        const combined = (sr.transcript + ' ' + sr.interim).trim()
        return combined || prev
      })
    }
  }, [sr.transcript, sr.interim, sr.isRecording])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      tts.stop()
    }
  }, [tts])

  // ── Request AI conversation feedback ────────────────────────────────────
  const requestFeedback = useCallback(() => {
    if (isFeedbackLoading) return
    tts.stop()
    if (sr.isRecording) sr.stop()
    setShowFeedback(true)
    setFeedbackResult('')
    setIsFeedbackLoading(true)

    const userMsgs = messages
      .filter(m => m.role === 'user' && !m.content.startsWith('(Begin)'))
      .map(m => m.content)

    generateConversationFeedback(
      userMsgs,
      day.level,
      day.title,
      day.vocabulary,
      day.learningObjectives,
      (token: string) => {
        setFeedbackResult(prev => prev + token)
      },
      (full: string) => {
        setFeedbackResult(full)
        setIsFeedbackLoading(false)
        const extracted = lifeMemory.extractFactsFromMessages(userMsgs, day.title)
        for (const f of extracted) {
          lifeMemory.addFact(f.key, f.value, day.title)
        }
      },
      (err: Error) => {
        setFeedbackResult(`❌ Feedback olishda xatolik: ${err.message}`)
        setIsFeedbackLoading(false)
      },
    )
  }, [messages, day, sr, tts, isFeedbackLoading, lifeMemory])

  // ── Send message ────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')
    if (sr.isRecording) sr.stop()

    const userMsg: ChatMsg = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setStreamingText('')
    setIsLoading(true)

    const controller = new AbortController()
    abortRef.current = controller

    const history = updatedMessages.map(m => ({ role: m.role, content: m.content }))

    if (mode === 'roleplay' && activeRoleplay) {
      const scenario = inferScenario(activeRoleplay)
      await startDayRoleplay(
        scenario,
        day.level,
        day.title,
        day.vocabulary,
        history,
        (token: string) => { setStreamingText(prev => prev + token) },
        (full: string) => {
          setMessages(prev => [...prev, { role: 'assistant', content: full }])
          setStreamingText('')
          setIsLoading(false)
          if (voiceEnabled) tts.speak(full).catch(() => {})
        },
        (err: Error) => {
          setStreamingText('')
          setIsLoading(false)
          setMessages(prev => [...prev, { role: 'assistant', content: `❌ Xatolik: ${err.message}` }])
        },
      )
    } else {
      const factsText = lifeMemory.buildFactsText()
      await startDayConversation(
        {
          day: day.day,
          title: day.title,
          level: day.level,
          vocabulary: day.vocabulary,
          sentenceBank: day.sentenceBank,
          learningObjectives: day.learningObjectives,
          speaking: day.speaking,
          highlights: day.highlights,
        },
        history,
        (token: string) => { setStreamingText(prev => prev + token) },
        (full: string) => {
          setMessages(prev => [...prev, { role: 'assistant', content: full }])
          setStreamingText('')
          setIsLoading(false)
          if (voiceEnabled) tts.speak(full).catch(() => {})
        },
        (err: Error) => {
          setStreamingText('')
          setIsLoading(false)
          setMessages(prev => [...prev, { role: 'assistant', content: `❌ Xatolik yuz berdi: ${err.message}`, isStreaming: false }])
        },
        factsText || undefined,
      )
    }
  }, [input, isLoading, messages, day, voiceEnabled, sr, tts, mode, activeRoleplay, lifeMemory])

  // ── Handlers ────────────────────────────────────────────────────────────
  const toggleMic = useCallback(() => {
    if (sr.isRecording) {
      sr.stop()
    } else {
      tts.stop()
      setInput('')
      sr.reset()
      sr.start()
    }
  }, [sr, tts])

  const stopSpeaking = useCallback(() => { tts.stop() }, [tts])

  const clearChat = useCallback(() => {
    tts.stop()
    if (sr.isRecording) sr.stop()
    if (abortRef.current) abortRef.current.abort()
    const msg = mode === 'roleplay' && activeRoleplay
      ? `🔄 Role-play tozalandi. Keling, "${inferScenario(activeRoleplay).title}" ni qaytadan boshlaymiz!`
      : `🔄 Suhbat tozalandi. Keling, ${day.title} mavzusida davom etamiz!`
    setMessages([{ role: 'assistant', content: msg }])
    setInput('')
    setStreamingText('')
    setIsLoading(false)
  }, [day.title, sr, tts, mode, activeRoleplay])

  const startRoleplay = useCallback((ex: RoleplayExercise) => {
    tts.stop()
    if (sr.isRecording) sr.stop()
    if (abortRef.current) abortRef.current.abort()
    const scenario = inferScenario(ex)
    setActiveRoleplay(ex)
    setMode('roleplay')
    setShowRoleplayPicker(false)
    setMessages([
      { role: 'assistant', content: `🎭 **${scenario.title}**\\n\\nI'll be **${scenario.aiRole}** and you'll be **${scenario.userRole}**.\\n\\n${ex.tips?.map(t => `💡 ${t}`).join('\\n') || ''}\\n\\nLet's begin! Reply to start the conversation. 🎬` },
    ])
    setInput('')
    setStreamingText('')
    setIsLoading(false)
  }, [sr, tts])

  const switchToFree = useCallback(() => {
    tts.stop()
    if (sr.isRecording) sr.stop()
    if (abortRef.current) abortRef.current.abort()
    setMode('free')
    setActiveRoleplay(null)
    setShowRoleplayPicker(false)
    setMessages([
      { role: 'assistant', content: `🔄 Back to free conversation. Let's keep talking about **${day.title}**!` },
    ])
    setInput('')
    setStreamingText('')
    setIsLoading(false)
  }, [day.title, sr, tts])

  const handleToggleMode = useCallback(() => {
    if (mode === 'roleplay') {
      switchToFree()
    } else {
      setShowRoleplayPicker(prev => !prev)
    }
  }, [mode, switchToFree])

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="relative flex flex-col rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ height: '540px' }}>
      <AiConversationHeader
        mode={mode}
        activeRoleplay={activeRoleplay}
        hasRoleplayExercises={roleplayExercises.length > 0}
        lifeMemoryFactCount={lifeMemory.factCount}
        voiceEnabled={voiceEnabled}
        showLifeMemory={showLifeMemory}
        dayLevel={day.level}
        dayTitle={day.title}
        onToggleMode={handleToggleMode}
        onToggleVoice={() => setVoiceEnabled(v => !v)}
        onClearChat={clearChat}
        onToggleLifeMemory={() => setShowLifeMemory(s => !s)}
      />

      {/* Role-play picker */}
      {(showRoleplayPicker || (mode === 'free' && roleplayExercises.length > 0 && messages.length <= 1)) && mode === 'free' && (
        <RoleplayPicker
          roleplayExercises={roleplayExercises}
          onStartRoleplay={startRoleplay}
          onClose={() => setShowRoleplayPicker(false)}
        />
      )}

      {/* Life Memory overlay */}
      {showLifeMemory && (
        <LifeMemoryOverlay
          facts={lifeMemory.facts}
          factCount={lifeMemory.factCount}
          onDelete={lifeMemory.deleteFact}
          onClear={lifeMemory.clearFacts}
          onClose={() => setShowLifeMemory(false)}
        />
      )}

      {/* Feedback overlay */}
      {showFeedback && (
        <AiFeedbackOverlay
          feedbackResult={feedbackResult}
          isFeedbackLoading={isFeedbackLoading}
          onClose={() => setShowFeedback(false)}
        />
      )}

      {/* Messages */}
      <AiChatMessages
        messages={messages}
        streamingText={streamingText}
        isLoading={isLoading}
        mode={mode}
        activeRoleplay={activeRoleplay}
        roleplayExercises={roleplayExercises}
        showRoleplayPicker={showRoleplayPicker}
        userMsgCount={userMsgCount}
        showFeedback={showFeedback}
        isFeedbackLoading={isFeedbackLoading}
        sr={sr}
        scrollRef={scrollRef}
        onRequestFeedback={requestFeedback}
        onShowRoleplayPicker={() => setShowRoleplayPicker(true)}
        onSwitchToFree={switchToFree}
      />

      {/* Input */}
      <AiChatInput
        input={input}
        isLoading={isLoading}
        mode={mode}
        sr={sr}
        tts={tts}
        inputRef={inputRef}
        onInputChange={setInput}
        onSend={sendMessage}
        onToggleMic={toggleMic}
        onStopSpeaking={stopSpeaking}
      />
    </div>
  )
}
