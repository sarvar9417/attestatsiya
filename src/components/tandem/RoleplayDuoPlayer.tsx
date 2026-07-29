import { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { monitoring } from '../../lib/monitoring'
import { supabase } from '../../lib/supabase'
import { CONVERSATION_SCENARIOS, type ConversationScenario } from '../../data/conversationScenarios'
import { startScenarioConversation } from '../../lib/claude'
import { speak } from '../../lib/tts'
import { feelLevelUp, feelTap } from '../../lib/gameFeel'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useToastStore } from '../../utils/toastStore'
import {
  getRoleplaySession,
  saveUserAMessages,
  saveUserBMessages,
  updateSessionStatus,
  updateSessionScenario,
  evaluateDuoRoleplay,
  notifyUserBRoleplayPending,
} from '../../services/roleplayDuoService'
import type { RoleplaySession, RoleplayEvaluation } from '../../types/tandem'
import type { View, Msg } from './RoleplayHelpers'
import RoleplayScenarioSelect from './RoleplayScenarioSelect'
import { WaitingPartner, WaitingAfterTurn, LoadingReport, UserBStartScreen } from './RoleplayWaitingView'
import RoleplayResultsView from './RoleplayResultsView'
import RoleplayChatView from './RoleplayChatView'

interface Props {
  session: RoleplaySession
  currentUserId: string
  currentUserName: string
  isCreator: boolean
  onBack: () => void
  onComplete: () => void
}

export default function RoleplayDuoPlayer({ session, currentUserId, currentUserName, isCreator, onBack, onComplete }: Props) {
  const currentLevel = useStore(s => s.currentLevel)
  const level = (currentLevel || 'B1').replace('+', '')

  const [view, setView] = useState<View>('scenario-select')
  const [scenario, setScenario] = useState<ConversationScenario | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [streaming, setStreaming] = useState('')
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [voiceOn, setVoiceOn] = useState(true)
  const [showHints, setShowHints] = useState(false)
  const [partnerName, setPartnerName] = useState('')
  const [myEval, setMyEval] = useState<RoleplayEvaluation | null>(null)
  const [partnerEval, setPartnerEval] = useState<RoleplayEvaluation | null>(null)
  const [xpEarned, setXpEarned] = useState(0)

  const sr = useSpeechRecognition()
  const scrollRef = useRef<HTMLDivElement>(null)
  const turnCount = messages.filter(m => m.role === 'user').length

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, streaming])

  // ── Voice input ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (sr.isRecording) setInput((sr.transcript + ' ' + sr.interim).trim())
  }, [sr.transcript, sr.interim, sr.isRecording])

  // ── Init: Check session status ───────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      // Get partner name — tandem pairdagi boshqa foydalanuvchi
      const { data: pair } = await supabase
        .from('tandem_pairs')
        .select('user_a, user_b')
        .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`)
        .maybeSingle()

      if (pair) {
        const partnerId = pair.user_a === currentUserId ? pair.user_b : pair.user_a
        const { data: partnerData } = await supabase
          .from('users')
          .select('name')
          .eq('id', partnerId)
          .single()
        if (partnerData?.name) setPartnerName(partnerData.name)
      }

      // Agar session boshlangan bo'lsa, xabarlarni yuklash
      const fresh = await getRoleplaySession(session.id)
      if (!fresh) return

      // Scenario'ni topish
      const found = CONVERSATION_SCENARIOS.find(s => s.id === fresh.scenario_id)
      if (found) {
        setScenario(found)
      }

      if (isCreator) {
        // User A — davom etish yoki yangi boshlash
        if (fresh.user_a_messages.length > 0) {
          setMessages(fresh.user_a_messages)
          setView('playing')
        } else {
          // Scenario select ko'rsatamiz
        }
      } else {
        // User B — davom etish yoki boshlash
        if (fresh.user_b_messages.length > 0) {
          setMessages(fresh.user_b_messages)
          setView('playing')
        } else if (fresh.user_a_messages.length > 0) {
          // User A o'ynagan — User B boshlashi mumkin
          setView('playing')
        } else if (!found) {
          // Scenario hali tanlanmagan (scenario_id = 'pending') — User B kutaveradi
          setView('waiting_partner')
        }
      }

      // Agar tugagan bo'lsa, natijalarni ko'rsatish
      if (fresh.status === 'completed' && fresh.user_a_evaluation && fresh.user_b_evaluation) {
        if (isCreator) {
          setMyEval(fresh.user_a_evaluation)
          setPartnerEval(fresh.user_b_evaluation)
        } else {
          setMyEval(fresh.user_b_evaluation)
          setPartnerEval(fresh.user_a_evaluation)
        }
        setView('results')
      }
    }
    init()
  }, [session.id, currentUserId, isCreator])

  const toggleMic = () => {
    if (sr.isRecording) {
      sr.stop()
    } else {
      if ('speechSynthesis' in window) speechSynthesis.cancel()
      setInput('')
      sr.reset()
      sr.start()
    }
  }

  function sceneCtx(s: ConversationScenario) {
    return { aiRole: s.aiRole, userRole: s.userRole, opening: s.opening, title: s.title }
  }

  // ── Start scenario (User A selects) ────────────────────────────────────
  async function handleStartScenario(s: ConversationScenario) {
    feelTap()
    setScenario(s)
    setMessages([{ role: 'assistant' as const, content: s.opening }])
    setView('playing')
    setShowHints(false)

    // Session scenario_id va statusini yangilash
    await Promise.all([
      updateSessionScenario(session.id, s.id),
      updateSessionStatus(session.id, 'user_a_playing'),
    ])
    // Save opening message
    await saveUserAMessages(session.id, [{ role: 'assistant' as const, content: s.opening }])

    if (voiceOn) {
      speak(s.opening, { rate: 0.95 }).catch((e: unknown) => {
        monitoring.captureMessage('TTS speak (roleplay opening) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      })
    }
  }

  // ── User B starts playing ──────────────────────────────────────────────
  async function handleUserBStart() {
    if (!scenario) return
    await updateSessionStatus(session.id, 'user_b_playing')
    setMessages([{ role: 'assistant', content: scenario.opening }])
    setView('playing')
    setShowHints(false)
    await saveUserBMessages(session.id, [{ role: 'assistant', content: scenario.opening }])

    if (voiceOn) {
      speak(scenario.opening, { rate: 0.95 }).catch((e: unknown) => {
        monitoring.captureMessage('TTS speak (roleplay B opening) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      })
    }
  }

  // ── Send message ──────────────────────────────────────────────────────
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

    const chatHistory: { role: 'user' | 'assistant'; content: string }[] = history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    startScenarioConversation(
      sceneCtx(scenario), level,
      chatHistory,
      (token) => setStreaming(prev => prev + token),
      async (full) => {
        const newMsgs: Msg[] = [...history, { role: 'assistant', content: full }]
        setMessages(newMsgs)
        setStreaming('')
        setLoading(false)

        // Save to DB
        if (isCreator) {
          await saveUserAMessages(session.id, newMsgs)
        } else {
          await saveUserBMessages(session.id, newMsgs)
        }

        if (voiceOn) {
          speak(full, { rate: 0.95 }).catch((e: unknown) => {
            monitoring.captureMessage('TTS speak (roleplay AI response) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
          })
        }
      },
      () => { setLoading(false); setStreaming('') },
    )
  }

  // ── Finish turn ────────────────────────────────────────────────────────
  async function finishTurn() {
    if (!scenario) return
    if (sr.isRecording) sr.stop()
    if ('speechSynthesis' in window) speechSynthesis.cancel()

    if (isCreator) {
      // User A tugatdi
      await updateSessionStatus(session.id, 'user_a_done')
      await notifyUserBRoleplayPending(session.id)
      setView('waiting')
      useToastStore.getState().toast(
        "✅ Sizning rolingiz tugadi! Do'stingizning navbati — u boshlaganida sizga bildirishnoma keladi.",
        'success', 6000,
      )
    } else {
      // User B tugatdi — baholashni boshlaymiz
      setView('loading-report')
      const result = await evaluateDuoRoleplay(session.id)
      if (result.success) {
        // Yangilangan sessionni olish
        const fresh = await getRoleplaySession(session.id)
        if (fresh && fresh.user_a_evaluation && fresh.user_b_evaluation) {
          if (isCreator) {
            setMyEval(fresh.user_a_evaluation)
            setPartnerEval(fresh.user_b_evaluation)
          } else {
            setMyEval(fresh.user_b_evaluation)
            setPartnerEval(fresh.user_a_evaluation)
          }

          const myAvg = isCreator
            ? Math.round((fresh.user_a_evaluation.fluency + fresh.user_a_evaluation.taskSuccess) / 2)
            : Math.round((fresh.user_b_evaluation.fluency + fresh.user_b_evaluation.taskSuccess) / 2)
          const xp = 10 + myAvg * 2
          setXpEarned(xp)
          useStore.getState().addXP(xp)
          feelLevelUp()
        }
        setView('results')
      } else {
        useToastStore.getState().toast('Baholashda xatolik', 'error')
        setView('playing')
      }
    }
  }

  // ── Render: Scenario Select ───────────────────────────────────────────
  if (view === 'scenario-select' && isCreator) {
    return (
      <RoleplayScenarioSelect
        onBack={onBack}
        onStartScenario={handleStartScenario}
      />
    )
  }

  // ── Render: Waiting for partner ──────────────────────────────────────
  if (view === 'waiting_partner') {
    return <WaitingPartner partnerName={partnerName} onBack={onBack} />
  }

  // ── Render: Waiting (after finishing turn) ────────────────────────────
  if (view === 'waiting') {
    return <WaitingAfterTurn partnerName={partnerName} onBack={onBack} />
  }

  // ── Render: Loading Report ────────────────────────────────────────────
  if (view === 'loading-report') {
    return <LoadingReport />
  }

  // ── Render: Results ──────────────────────────────────────────────────
  if (view === 'results' && myEval && partnerEval) {
    return (
      <RoleplayResultsView
        myEval={myEval}
        partnerEval={partnerEval}
        currentUserName={currentUserName}
        partnerName={partnerName}
        xpEarned={xpEarned}
        onBack={onBack}
        onComplete={onComplete}
      />
    )
  }

  // ── Render: User B hasn't started yet ────────────────────────────────
  if (!isCreator && view === 'playing' && messages.length === 0 && scenario) {
    return (
      <UserBStartScreen
        scenario={scenario}
        partnerName={partnerName}
        onBack={onBack}
        onStart={handleUserBStart}
      />
    )
  }

  // ── Render: Playing (chat) ────────────────────────────────────────────
  return (
    <RoleplayChatView
      scenario={scenario}
      messages={messages}
      streaming={streaming}
      loading={loading}
      input={input}
      voiceOn={voiceOn}
      showHints={showHints}
      isCreator={isCreator}
      turnCount={turnCount}
      hints={scenario?.hints ?? []}
      isRecording={sr.isRecording}
      isMicSupported={sr.isSupported}
      onBack={async () => {
        if ('speechSynthesis' in window) speechSynthesis.cancel()
        if (sr.isRecording) sr.stop()
        sr.reset()
        if (messages.length > 0 && scenario) {
          if (isCreator) await saveUserAMessages(session.id, messages)
          else await saveUserBMessages(session.id, messages)
        }
        onBack()
      }}
      onToggleVoice={() => setVoiceOn(v => !v)}
      onToggleHints={() => setShowHints(v => !v)}
      onInputChange={setInput}
      onSend={send}
      onToggleMic={toggleMic}
      onFinishTurn={finishTurn}
      onHintClick={(h) => { setInput(h); setShowHints(false) }}
    />
  )
}
