// ═══════════════════════════════════════════════════════════════════════════
// HotSeatDuel — Sinxron 5s tezkor duel
// "Same Device" (bir telefon) yoki "Online" (Supabase Realtime)
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Sparkles, Trophy,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

import { useStore } from '../../store/useStore'
import { fetchBattleQuestionsByMode } from '../../services/battleService'
import { saveHotSeatResult } from '../../services/tandemService'
import { useToastStore } from '../../utils/toastStore'
import { feelAnswer } from '../../lib/gameFeel'
import { emitXpBurst } from '../ui/XpBurst'
import type { RealtimeChannel } from '@supabase/supabase-js'
import HotSeatSetupView from './HotSeatSetupView'
import HotSeatQuestionCard from './HotSeatQuestionCard'
import HotSeatOnlineLobby from './HotSeatOnlineLobby'
import HotSeatOnlineWaiting from './HotSeatOnlineWaiting'
import {
  QUESTIONS_PER_PLAYER, QUESTION_TIME, TRANSITION_DELAY,
  generateRoomId, getXP,
  type GameMode, type OnlinePhase, type LevelId,
  type HotSeatQuestion, type PlayerScore, type OnlineMessage,
} from './hotSeatHelpers'

// ═══════════════════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HotSeatDuel({ onBack }: { onBack: () => void }) {
  const userName = useStore((s) => s.userName) || 'Foydalanuvchi'

  // ── Mode selector state ──────────────────────────────────────────────
  const [gameMode, setGameMode] = useState<GameMode>('setup')

  // ── Same-device state ────────────────────────────────────────────────
  const player1Name = userName
  const player2Name = ''
  const [sdPhase, setSdPhase] = useState<'p1' | 'transition' | 'p2' | 'results'>('p1')
  const [sdCurrentQ, setSdCurrentQ] = useState(0)
  const [sdSelected, setSdSelected] = useState<number | null>(null)
  const [sdLocked, setSdLocked] = useState(false)
  const [sdTimeLeft, setSdTimeLeft] = useState(QUESTION_TIME)
  const [sdPlayer1, setSdPlayer1] = useState<PlayerScore>({ name: '', score: 0, answers: [], timeouts: 0 })
  const [sdPlayer2, setSdPlayer2] = useState<PlayerScore>({ name: '', score: 0, answers: [], timeouts: 0 })
  const [sdCountdown, setSdCountdown] = useState(3)

  // ── Online state ─────────────────────────────────────────────────────
  const [onlinePhase, setOnlinePhase] = useState<OnlinePhase>('lobby')
  const [roomId, setRoomId] = useState('')
  const [playerRole, setPlayerRole] = useState<'host' | 'guest' | null>(null)
  const [opponentName, setOpponentName] = useState('')
  const [olQuestions, setOlQuestions] = useState<HotSeatQuestion[]>([])
  const [olCurrentQ, setOlCurrentQ] = useState(0)
  const [olSelected, setOlSelected] = useState<number | null>(null)
  const [olLocked, setOlLocked] = useState(false)
  const [olTimeLeft, setOlTimeLeft] = useState(QUESTION_TIME)
  const [olMyScore, setOlMyScore] = useState(0)
  const [olMyAnswers, setOlMyAnswers] = useState<{ questionIndex: number; answerIndex: number }[]>([])
  const [olOpponentScore, setOlOpponentScore] = useState(0)
  const [olCountdown, setOlCountdown] = useState(3)
  const [olMyFinalScore, setOlMyFinalScore] = useState(0)
  const [olOpponentFinalScore, setOlOpponentFinalScore] = useState<number | null>(null)
  const [olWaiting, setOlWaiting] = useState(false)
  const [olFinalScores, setOlFinalScores] = useState<{ host: PlayerScore; guest: PlayerScore } | null>(null)
  const [olMessage, setOlMessage] = useState('')

  // ── Shared state ─────────────────────────────────────────────────────
  const [selectedLevel, setSelectedLevel] = useState<LevelId>('B1')
  const [selectedMode, setSelectedMode] = useState<'vocab' | 'grammar'>('vocab')

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const questionsRef = useRef<HotSeatQuestion[]>([])
  const olCurrentQRef = useRef(0)
  olCurrentQRef.current = olCurrentQ
  const olMyAnswersRef = useRef<{ questionIndex: number; answerIndex: number }[]>([])
  olMyAnswersRef.current = olMyAnswers
  const olMyScoreRef = useRef(0)
  olMyScoreRef.current = olMyScore

  // ── Cleanup ─────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [])

  // ── Shared timer ────────────────────────────────────────────────────

  const startTimer = useCallback((setTimeLeft: React.Dispatch<React.SetStateAction<number>>) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(QUESTION_TIME)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const startCountdown = useCallback((onDone: () => void) => {
    setSdCountdown(3)
    if (countdownRef.current) clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setSdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!)
          countdownRef.current = null
          onDone()
          return 0
        }
        return prev - 1
      })
    }, 800)
  }, [])

  // ═══════════════════════════════════════════════════════════════════════
  //  SAME-DEVICE MODE
  // ═══════════════════════════════════════════════════════════════════════

  const sdStartGame = useCallback(async () => {
    const qs = await fetchBattleQuestionsByMode(selectedLevel, QUESTIONS_PER_PLAYER, selectedMode)
    if (qs.questions.length === 0) {
      useToastStore.getState().toast('Savollar topilmadi', 'error')
      return
    }
    const passage = qs.passage
    const formatted: HotSeatQuestion[] = qs.questions.map(q => ({
      id: q.id, english: q.english, options: q.options, correct: q.correct,
      ...(passage ? { passage } : {}),
    }))
    questionsRef.current = formatted
    setSdPlayer1({ name: player1Name || "O'yinchi 1", score: 0, answers: [], timeouts: 0 })
    setSdPlayer2({ name: player2Name || "O'yinchi 2", score: 0, answers: [], timeouts: 0 })
    setSdCurrentQ(0); setSdSelected(null); setSdLocked(false)
    startCountdown(() => {
      setSdPhase('p1')
      startTimer(setSdTimeLeft)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLevel, selectedMode, player1Name, player2Name])

  useEffect(() => {
    if (sdTimeLeft === 0 && sdPhase !== 'results' && !sdLocked) {
      sdHandleAnswer(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdTimeLeft])

  const sdHandleAnswer = useCallback((answerIndex: number) => {
    if (sdLocked) return
    setSdLocked(true)
    if (timerRef.current) clearInterval(timerRef.current)
    setSdSelected(answerIndex)
    const isPlayer1 = sdPhase === 'p1'
    const q = questionsRef.current[sdCurrentQ]
    const isCorrect = answerIndex === q?.correct

    if (answerIndex === -1) {
      if (isPlayer1) setSdPlayer1(p => ({ ...p, timeouts: p.timeouts + 1 }))
      else setSdPlayer2(p => ({ ...p, timeouts: p.timeouts + 1 }))
    }
    if (isCorrect) {
      if (isPlayer1) setSdPlayer1(p => ({ ...p, score: p.score + 1 }))
      else setSdPlayer2(p => ({ ...p, score: p.score + 1 }))
      emitXpBurst(5)
    }
    feelAnswer({ correct: isCorrect })
    if (isPlayer1) setSdPlayer1(p => ({ ...p, answers: [...p.answers, { questionIndex: sdCurrentQ, answerIndex, correct: isCorrect }] }))
    else setSdPlayer2(p => ({ ...p, answers: [...p.answers, { questionIndex: sdCurrentQ, answerIndex, correct: isCorrect }] }))
    setTimeout(() => sdAdvanceQuestion(), 1200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdLocked, sdCurrentQ, sdPhase])

  const sdAdvanceQuestion = useCallback(() => {
    const next = sdCurrentQ + 1
    if (next >= QUESTIONS_PER_PLAYER) {
      if (sdPhase === 'p1') {
        setSdPhase('transition')
        setTimeout(() => {
          startCountdown(() => {
            setSdPhase('p2'); setSdCurrentQ(0); setSdSelected(null); setSdLocked(false)
            startTimer(setSdTimeLeft)
          })
        }, TRANSITION_DELAY)
      } else {
        setSdPhase('results')
      }
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    setSdCurrentQ(next); setSdSelected(null); setSdLocked(false)
    startTimer(setSdTimeLeft)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdCurrentQ, sdPhase])

  const sdReset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    setSdPhase('p1'); setSdCurrentQ(0); setSdSelected(null); setSdLocked(false)
    setSdTimeLeft(QUESTION_TIME)
    setSdPlayer1({ name: '', score: 0, answers: [], timeouts: 0 })
    setSdPlayer2({ name: '', score: 0, answers: [], timeouts: 0 })
    setSdCountdown(3)
    setGameMode('setup')
  }

  const awardXP = (score: number) => { const xp = getXP(score); if (xp > 0) useStore.getState().addXP(xp) }

  // ═══════════════════════════════════════════════════════════════════════
  //  ONLINE MULTIPLAYER MODE
  // ═══════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (olMyFinalScore > 0 && olOpponentFinalScore !== null) {
      const myName = userName
      const oppName = opponentName || 'Raqib'
      if (playerRole === 'host') {
        setOlFinalScores({
          host: { name: myName, score: olMyFinalScore, answers: [], timeouts: 0 },
          guest: { name: oppName, score: olOpponentFinalScore, answers: [], timeouts: 0 },
        })
      } else {
        setOlFinalScores({
          host: { name: oppName, score: olOpponentFinalScore, answers: [], timeouts: 0 },
          guest: { name: myName, score: olMyFinalScore, answers: [], timeouts: 0 },
        })
      }
      setOnlinePhase('results')
    }
  }, [olMyFinalScore, olOpponentFinalScore, playerRole, userName, opponentName])

  const olCreateRoom = useCallback(async () => {
    const id = generateRoomId()
    setRoomId(id)
    setPlayerRole('host')
    setOnlinePhase('waiting')

    if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null }

    const channel = supabase.channel(`hotseat-${id}`, {
      config: { broadcast: { self: true } },
    })

    channel.on('broadcast', { event: 'message' }, (payload) => {
      const msg = payload.payload as OnlineMessage

      if (msg.type === 'join') {
        setOpponentName(msg.playerName || 'Raqib')
        fetchBattleQuestionsByMode(selectedLevel, QUESTIONS_PER_PLAYER, selectedMode).then(qs => {
          const passage = qs.passage
          const formatted: HotSeatQuestion[] = qs.questions.map(q => ({
            id: q.id, english: q.english, options: q.options, correct: q.correct,
            ...(passage ? { passage } : {}),
          }))
          questionsRef.current = formatted
          setOlQuestions(formatted)
          setOnlinePhase('playing')
          channel.send({
            type: 'broadcast', event: 'message',
            payload: { type: 'start', questions: formatted, playerId: 'host', playerName: userName } as OnlineMessage,
          })
        })
      }

      if (msg.type === 'answer' && msg.playerId === 'guest' && msg.answer) {
        const q = questionsRef.current[msg.answer.questionIndex]
        if (q && msg.answer.answerIndex === q.correct) {
          setOlOpponentScore(s => s + 1)
        }
      }

      if (msg.type === 'done') {
        setOlOpponentFinalScore(msg.myScore ?? 0)
      }
    })

    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') setOlMessage('Xonaga ulanishda xatolik')
    })

    channelRef.current = channel
  }, [selectedLevel, selectedMode, userName])

  const olJoinRoom = useCallback(async (joinId: string) => {
    if (!joinId.trim()) return
    const id = joinId.trim().toUpperCase()
    setRoomId(id)
    setPlayerRole('guest')
    setOnlinePhase('waiting')

    if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null }

    const channel = supabase.channel(`hotseat-${id}`, {
      config: { broadcast: { self: true } },
    })

    let joined = false

    channel.on('broadcast', { event: 'message' }, (payload) => {
      const msg = payload.payload as OnlineMessage

      if (msg.type === 'start' && msg.questions) {
        questionsRef.current = msg.questions
        setOlQuestions(msg.questions)
        setOpponentName(msg.playerName || 'Raqib')
        setOnlinePhase('playing')
      }

      if (msg.type === 'answer' && msg.playerId === 'host' && msg.answer) {
        const q = questionsRef.current[msg.answer.questionIndex]
        if (q && msg.answer.answerIndex === q.correct) {
          setOlOpponentScore(s => s + 1)
        }
      }

      if (msg.type === 'done') {
        setOlOpponentFinalScore(msg.myScore ?? 0)
      }
    })

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED' && !joined) {
        joined = true
        channel.send({
          type: 'broadcast', event: 'message',
          payload: { type: 'join', playerId: 'guest', playerName: userName } as OnlineMessage,
        })
      } else if (status !== 'SUBSCRIBED') {
        setOlMessage('Xonaga ulanishda xatolik')
        setOnlinePhase('error')
      }
    })

    channelRef.current = channel
  }, [userName])

  // ── Online timer ────────────────────────────────────────────────────

  useEffect(() => {
    if (olTimeLeft === 0 && onlinePhase === 'playing' && !olLocked) {
      olHandleAnswer(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [olTimeLeft])

  // ── Online countdown before playing starts ──────────────────────────

  useEffect(() => {
    if (onlinePhase === 'playing' && olQuestions.length > 0 && olCurrentQ === 0 && olSelected === null && !olLocked) {
      setOlCountdown(3)
      if (countdownRef.current) clearInterval(countdownRef.current)
      countdownRef.current = setInterval(() => {
        setOlCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!)
            countdownRef.current = null
            startTimer(setOlTimeLeft)
            return 0
          }
          return prev - 1
        })
      }, 800)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlinePhase, olQuestions.length])

  // ── Online handle answer ────────────────────────────────────────────

  const olHandleAnswer = useCallback((answerIndex: number) => {
    if (olLocked) return
    setOlLocked(true)
    if (timerRef.current) clearInterval(timerRef.current)
    setOlSelected(answerIndex)

    const q = questionsRef.current[olCurrentQ]
    const isCorrect = answerIndex === q?.correct
    const rec = { questionIndex: olCurrentQ, answerIndex }

    if (isCorrect) setOlMyScore(s => s + 1)
    setOlMyAnswers(prev => [...prev, rec])
    if (isCorrect) emitXpBurst(5)
    feelAnswer({ correct: isCorrect })

    channelRef.current?.send({
      type: 'broadcast', event: 'message',
      payload: { type: 'answer', playerId: playerRole, answer: rec } as OnlineMessage,
    })

    setTimeout(() => olAdvanceQuestion(), 1200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [olLocked, olCurrentQ, playerRole])

  // ── Online advance ──────────────────────────────────────────────────

  const olAdvanceQuestion = useCallback(() => {
    const next = olCurrentQ + 1
    if (next >= QUESTIONS_PER_PLAYER) {
      setOlMyFinalScore(olMyScoreRef.current)
      setOlWaiting(true)
      channelRef.current?.send({
        type: 'broadcast', event: 'message',
        payload: { type: 'done', playerId: playerRole, myScore: olMyScoreRef.current } as OnlineMessage,
      })
      return
    }
    setOlCurrentQ(next); setOlSelected(null); setOlLocked(false)
    startTimer(setOlTimeLeft)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [olCurrentQ, playerRole])

  // ── Online reset ────────────────────────────────────────────────────

  const olReset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null }
    setOnlinePhase('lobby'); setRoomId(''); setPlayerRole(null)
    setOpponentName(''); setOlQuestions([]); setOlCurrentQ(0); setOlSelected(null)
    setOlLocked(false); setOlTimeLeft(QUESTION_TIME); setOlMyScore(0); setOlMyAnswers([])
    setOlOpponentScore(0); setOlCountdown(3)
    setOlMyFinalScore(0); setOlOpponentFinalScore(null); setOlWaiting(false)
    setOlFinalScores(null); setOlMessage('')
    setGameMode('setup')
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  RENDER — MODE SELECTOR (setup)
  // ═══════════════════════════════════════════════════════════════════════

  if (gameMode === 'setup') {
    return (
      <HotSeatSetupView
        selectedLevel={selectedLevel}
        selectedMode={selectedMode}
        onLevelChange={setSelectedLevel}
        onModeChange={setSelectedMode}
        onStartSameDevice={() => { sdStartGame(); setGameMode('same_device') }}
        onStartOnline={() => setGameMode('online')}
        onBack={onBack}
      />
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  ONLINE LOBBY
  // ═══════════════════════════════════════════════════════════════════════

  if (gameMode === 'online' && onlinePhase === 'lobby') {
    return (
      <HotSeatOnlineLobby
        onCreateRoom={olCreateRoom}
        onJoinRoom={olJoinRoom}
        onBack={() => { setGameMode('setup'); if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null } }}
      />
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  ONLINE WAITING
  // ═══════════════════════════════════════════════════════════════════════

  if (gameMode === 'online' && onlinePhase === 'waiting') {
    return (
      <HotSeatOnlineWaiting
        roomId={roomId}
        playerRole={playerRole!}
        phase={onlinePhase}
        onReset={olReset}
      />
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  ONLINE — COUNTDOWN
  // ═══════════════════════════════════════════════════════════════════════

  if (gameMode === 'online' && onlinePhase === 'playing' && olCountdown >= 1 && olCurrentQ === 0 && olSelected === null) {
    return (
      <div className="max-w-lg mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 animate-pop-in">
          <div className="text-6xl font-black text-primary-600 animate-bounce">{olCountdown}</div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">O'yin boshlanmoqda!</p>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  ONLINE — PLAYING
  // ═══════════════════════════════════════════════════════════════════════

  if (gameMode === 'online' && onlinePhase === 'playing' && olQuestions.length > 0) {
    if (olWaiting && olOpponentFinalScore === null) {
      return (
        <div className="max-w-lg mx-auto flex items-center justify-center min-h-[60vh] p-4">
          <div className="text-center space-y-4">
            <div className="text-5xl">⏳</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Siz tugatdingiz!</h2>
            <p className="text-gray-500 text-sm">{olMyFinalScore}/{QUESTIONS_PER_PLAYER} to'g'ri</p>
            <div className="pt-2">
              <div className="w-12 h-12 mx-auto rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
              <p className="text-sm text-gray-500 mt-3">Raqibning tugashini kuting...</p>
            </div>
          </div>
        </div>
      )
    }

    const q = olQuestions[olCurrentQ]
    if (!q) return null
    const progress = ((olCurrentQ + 1) / QUESTIONS_PER_PLAYER) * 100
    const timerPct = (olTimeLeft / QUESTION_TIME) * 100

    return (
      <div className="max-w-lg mx-auto space-y-3 animate-fade-in p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-bold text-sm text-gray-800">{userName}</span>
            <span className="font-bold text-primary-600">{olMyScore}</span>
          </div>
          <div className="text-xs font-bold text-gray-400">{olCurrentQ + 1}/{QUESTIONS_PER_PLAYER}</div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-600">{olOpponentScore}</span>
            <span className="font-semibold text-sm text-gray-700">{opponentName || 'Raqib'}</span>
          </div>
        </div>

        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }} />
        </div>

        <div className="relative h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${
            olTimeLeft > 3 ? 'bg-green-500' : olTimeLeft > 1 ? 'bg-yellow-500' : 'bg-red-500'
          }`} style={{ width: `${timerPct}%` }} />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">{olTimeLeft}s</span>
        </div>

        <HotSeatQuestionCard
          question={q}
          mode={selectedMode}
          selectedAnswer={olSelected}
          timeLeft={olTimeLeft}
          onSelect={olHandleAnswer}
        />

        <div className="text-center text-xs text-gray-400">
          {opponentName || 'Raqib'}: {olOpponentScore} ball
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  ONLINE RESULTS
  // ═══════════════════════════════════════════════════════════════════════

  if (gameMode === 'online' && (onlinePhase === 'results' || onlinePhase === 'error')) {
    if (onlinePhase === 'error') {
      return (
        <div className="max-w-lg mx-auto text-center space-y-4 p-4">
          <div className="card p-8">
            <p className="text-red-500 font-semibold mb-2">{olMessage || 'Xatolik yuz berdi'}</p>
            <button onClick={olReset} className="btn-primary">Qaytadan urinish</button>
          </div>
        </div>
      )
    }

    const host = olFinalScores?.host ?? { name: userName, score: 0, answers: [], timeouts: 0 }
    const guest = olFinalScores?.guest ?? { name: opponentName, score: 0, answers: [], timeouts: 0 }
    const p1 = playerRole === 'host' ? host : guest
    const p2 = playerRole === 'guest' ? host : guest
    const isP1Winner = p1.score > p2.score
    const isTie = p1.score === p2.score

    return (
      <div className="max-w-lg mx-auto space-y-6 animate-page-enter p-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
              isTie ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gradient-to-br from-yellow-100 to-orange-100'
            }`}>
              {isTie ? '🤝' : '🏆'}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isTie ? "Durang!" : `${isP1Winner ? p1.name : p2.name} g'alaba qozondi!`}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`card p-5 text-center space-y-2 ${isP1Winner ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
            <span className="text-2xl">🎮</span>
            <p className="font-bold text-gray-900">{p1.name}</p>
            <p className="text-5xl font-black text-primary-600">{p1.score}</p>
            <p className="text-xs text-gray-400">to'g'ri</p>
            <p className="text-xs font-bold text-green-500">+{getXP(p1.score)} XP</p>
          </div>
          <div className={`card p-5 text-center space-y-2 ${!isP1Winner && !isTie ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
            <span className="text-2xl">🎮</span>
            <p className="font-bold text-gray-900">{p2.name}</p>
            <p className="text-5xl font-black text-purple-600">{p2.score}</p>
            <p className="text-xs text-gray-400">to'g'ri</p>
            <p className="text-xs font-bold text-green-500">+{getXP(p2.score)} XP</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { awardXP(p1.score); saveHotSeatResult(p1.score, QUESTIONS_PER_PLAYER); olReset() }}
            className="btn-primary flex-1 py-3 text-base flex items-center justify-center gap-2"
          ><Sparkles size={18} /> Qayta o'ynash</button>
          <button onClick={() => { awardXP(p1.score); saveHotSeatResult(p1.score, QUESTIONS_PER_PLAYER); onBack() }}
            className="btn-secondary py-3 px-4 text-sm">Ortga</button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  SAME-DEVICE — COUNTDOWN / TRANSITION
  // ═══════════════════════════════════════════════════════════════════════

  if (gameMode === 'same_device' && sdPhase === 'transition') {
    return (
      <div className="max-w-lg mx-auto flex items-center justify-center min-h-[60vh] animate-page-enter p-4">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-2">🎯</div>
          <h2 className="text-xl font-bold text-gray-900">{sdPlayer1.name} tugatdi!</h2>
          <p className="text-gray-500 text-sm">{sdPlayer1.score}/{QUESTIONS_PER_PLAYER} to'g'ri</p>
          <div className="pt-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">Telefonni {sdPlayer2.name} ga bering</p>
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (gameMode === 'same_device' && sdCountdown >= 1 && sdPhase !== 'results' && sdCurrentQ === 0 && sdSelected === null) {
    const isP1 = sdPhase === 'p1'
    return (
      <div className="max-w-lg mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 animate-pop-in">
          <div className="text-6xl font-black text-primary-600 animate-bounce">{sdCountdown}</div>
          <p className="text-sm font-semibold text-gray-600">{isP1 ? sdPlayer1.name : sdPlayer2.name} — navbatingiz!</p>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  SAME-DEVICE — PLAYING
  // ═══════════════════════════════════════════════════════════════════════

  if (gameMode === 'same_device' && sdPhase !== 'results' && questionsRef.current.length > 0) {
    const isP1 = sdPhase === 'p1'
    const currentPlayer = isP1 ? sdPlayer1 : sdPlayer2
    const q = questionsRef.current[sdCurrentQ]
    const progress = ((sdCurrentQ + 1) / QUESTIONS_PER_PLAYER) * 100
    const timerPct = (sdTimeLeft / QUESTION_TIME) * 100

    if (!q) return null

    return (
      <div className="max-w-lg mx-auto space-y-3 animate-fade-in p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isP1 ? 'bg-blue-500' : 'bg-green-500'} animate-pulse`} />
            <span className="font-bold text-sm text-gray-800">{currentPlayer.name}</span>
            <span className="font-bold text-primary-600">{currentPlayer.score}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-xs font-bold text-gray-400">{sdCurrentQ + 1}/{QUESTIONS_PER_PLAYER}</span>
            <span className={`font-bold ${isP1 ? 'text-blue-500' : 'text-green-500'} text-xs`}>{isP1 ? '🎮 1' : '🎮 2'}</span>
          </div>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${isP1 ? 'bg-blue-500' : 'bg-green-500'}`}
            style={{ width: `${progress}%` }} />
        </div>
        <div className="relative h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${
            sdTimeLeft > 3 ? 'bg-green-500' : sdTimeLeft > 1 ? 'bg-yellow-500' : 'bg-red-500'
          }`} style={{ width: `${timerPct}%` }} />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">{sdTimeLeft}s</span>
        </div>
        <HotSeatQuestionCard
          question={q}
          mode={selectedMode}
          selectedAnswer={sdSelected}
          timeLeft={sdTimeLeft}
          onSelect={sdHandleAnswer}
        />
        <div className="text-center text-xs text-gray-400">
          {isP1 ? <span>{sdPlayer1.name}: {sdPlayer1.score} to'g'ri</span> : (
            <span><span className="text-blue-500 font-semibold">{sdPlayer1.name}: {sdPlayer1.score}</span> · <span className="text-green-500 font-semibold">{sdPlayer2.name}: {sdPlayer2.score}</span></span>
          )}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  SAME-DEVICE — RESULTS
  // ═══════════════════════════════════════════════════════════════════════

  if (gameMode === 'same_device' && sdPhase === 'results') {
    const p1 = sdPlayer1; const p2 = sdPlayer2
    const isP1Winner = p1.score > p2.score
    const isTie = p1.score === p2.score

    return (
      <div className="max-w-lg mx-auto space-y-6 animate-page-enter p-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
              isTie ? 'bg-yellow-100' : 'bg-gradient-to-br from-yellow-100 to-orange-100'
            }`}>{isTie ? '🤝' : '🏆'}</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isTie ? "Durang!" : `${isP1Winner ? p1.name : p2.name} g'alaba qozondi!`}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className={`card p-5 text-center space-y-2 ${isP1Winner ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
            <span className="text-2xl">🎮</span>
            <p className="font-bold text-gray-900">{p1.name}</p>
            <p className="text-5xl font-black text-blue-500">{p1.score}</p>
            <p className="text-xs text-gray-400">to'g'ri</p>
            <p className="text-xs font-bold text-green-500">+{getXP(p1.score)} XP</p>
          </div>
          <div className={`card p-5 text-center space-y-2 ${!isP1Winner && !isTie ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
            <span className="text-2xl">🎮</span>
            <p className="font-bold text-gray-900">{p2.name}</p>
            <p className="text-5xl font-black text-green-500">{p2.score}</p>
            <p className="text-xs text-gray-400">to'g'ri</p>
            <p className="text-xs font-bold text-green-500">+{getXP(p2.score)} XP</p>
          </div>
        </div>
        <div className="card p-5 space-y-3">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <Trophy size={14} className="text-yellow-500" />
            {QUESTIONS_PER_PLAYER} ta savoldan natijalar
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-500">{p1.name}</span>
              <span className="text-gray-400">{Math.round((p1.score / QUESTIONS_PER_PLAYER) * 100)}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                style={{ width: `${(p1.score / QUESTIONS_PER_PLAYER) * 100}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-green-500">{p2.name}</span>
              <span className="text-gray-400">{Math.round((p2.score / QUESTIONS_PER_PLAYER) * 100)}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                style={{ width: `${(p2.score / QUESTIONS_PER_PLAYER) * 100}%` }} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { awardXP(p1.score); awardXP(p2.score); saveHotSeatResult(p1.score, QUESTIONS_PER_PLAYER); sdReset() }}
            className="btn-primary flex-1 py-3 text-base flex items-center justify-center gap-2"
          ><Sparkles size={18} /> Qayta o'ynash</button>
          <button onClick={() => { awardXP(p1.score); awardXP(p2.score); saveHotSeatResult(p1.score, QUESTIONS_PER_PLAYER); onBack() }}
            className="btn-secondary py-3 px-4 text-sm">Ortga</button>
        </div>
      </div>
    )
  }

  return null
}
