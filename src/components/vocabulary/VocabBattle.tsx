import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { useStore } from '../../store/useStore'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { feelAnswer } from '../../lib/gameFeel'
import { emitXpBurst } from '../ui/XpBurst'
import type { LevelId } from '../../services/battleService'
import { fetchBattleQuestions } from '../../services/battleService'
import type { GameState, PlayerId, AIDifficulty, GameMode, BattleQuestion, BattleMessage } from './VocabBattleHelpers'
import { AI_OPPONENTS, QUESTIONS_PER_GAME, QUESTION_TIME, generateRoomId, aiAnswer } from './VocabBattleHelpers'
import VocabBattleLobby from './VocabBattleLobby'
import VocabBattleWaiting from './VocabBattleWaiting'
import VocabBattlePlaying from './VocabBattlePlaying'
import { VocabBattleResults, VocabBattleError } from './VocabBattleResult'

// ─── Component ──────────────────────────────────────────────────────────────

export default function VocabBattle() {
  const userName = useStore((s) => s.userName) || 'Foydalanuvchi'
  const [gameState, setGameState] = useState<GameState>('lobby')
  const [gameMode, setGameMode] = useState<GameMode | null>(null)
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium')
  const [selectedLevel, setSelectedLevel] = useState<LevelId>('B1')
  const [roomId, setRoomId] = useState('')
  const [joinRoomId, setJoinRoomId] = useState('')
  const [playerRole, setPlayerRole] = useState<PlayerId | null>(null)
  const [opponentName, setOpponentName] = useState('')
  const [opponentEmoji, setOpponentEmoji] = useState('👤')
  const [opponentDifficulty, setOpponentDifficulty] = useState<AIDifficulty | null>(null)
  const [questions, setQuestions] = useState<BattleQuestion[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [hostScore, setHostScore] = useState(0)
  const [guestScore, setGuestScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [message, setMessage] = useState('')
  const [roomCopied, setRoomCopied] = useState(false)
  const [locked, setLocked] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const [aiAnswered, setAiAnswered] = useState(false)

  const channelRef = useRef<RealtimeChannel | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const questionsRef = useRef(questions)
  questionsRef.current = questions
  const hostScoreRef = useRef(hostScore)
  hostScoreRef.current = hostScore
  const guestScoreRef = useRef(guestScore)
  guestScoreRef.current = guestScore

  // ── Pick random questions ──────────────────────────────────────────────

  const pickQuestions = useCallback(async () => {
    return fetchBattleQuestions(selectedLevel, QUESTIONS_PER_GAME)
  }, [selectedLevel])

  // ── Cleanup ────────────────────────────────────────────────────────────

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current)
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  // ── Timer ──────────────────────────────────────────────────────────────

  const startTimer = useCallback(() => {
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

  // ── Handle answer timeout ──────────────────────────────────────────────

  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing' && !locked) {
      handleAnswer(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  // ── AI answer schedule ────────────────────────────────────────────────

  const scheduleAIAnswer = useCallback((q: BattleQuestion, difficulty: AIDifficulty) => {
    const ai = AI_OPPONENTS[difficulty]
    const delay = (ai.delayMin + Math.random() * (ai.delayMax - ai.delayMin)) * 1000

    setAiThinking(true)
    setAiAnswered(false)

    aiTimerRef.current = setTimeout(() => {
      const answer = aiAnswer(q, ai.accuracy)
      setAiThinking(false)
      setAiAnswered(true)
      if (answer === q.correct) {
        setGuestScore((s) => s + 1)
      }
    }, delay)
  }, [])

  // ── Create room ────────────────────────────────────────────────────────

  const createRoom = useCallback(async () => {
    const id = generateRoomId()
    setRoomId(id)
    setPlayerRole('host')
    setGameMode('multiplayer')
    setGameState('waiting')

    const channel = supabase.channel(`vocab-battle-${id}`, {
      config: { broadcast: { self: true } },
    })

    channel.on('broadcast', { event: 'message' }, (payload) => {
      const msg = payload.payload as BattleMessage

      if (msg.type === 'join' && msg.player === 'guest') {
        setOpponentName(msg.playerName || 'Raqib')
        setOpponentEmoji('👤')
        pickQuestions().then(qs => {
          setQuestions(qs)
          setGameState('playing')
        })

        channel.send({
          type: 'broadcast',
          event: 'message',
          payload: { type: 'start', player: 'host' } as BattleMessage,
        })
      }

      if (msg.type === 'answer' && msg.player === 'guest') {
        const q = questionsRef.current[msg.questionIndex!]
        if (msg.answer === q?.correct) {
          setGuestScore((s) => s + 1)
        }
      }
    })

    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        setMessage('Xonaga ulanishda xatolik')
      }
    })

    channelRef.current = channel
  }, [pickQuestions])

  // ── Start AI game ──────────────────────────────────────────────────────

  const startAIGame = useCallback((difficulty: AIDifficulty) => {
    const ai = AI_OPPONENTS[difficulty]
    setOpponentName(ai.name)
    setOpponentEmoji(ai.emoji)
    setOpponentDifficulty(difficulty)
    setAiDifficulty(difficulty)
    setGameMode('ai')
    setPlayerRole('host')
    pickQuestions().then(qs => {
      setQuestions(qs)
      setGameState('playing')
    })
  }, [pickQuestions])

  // ── Join room ─────────────────────────────────────────────────────────

  const joinRoom = useCallback(async () => {
    if (!joinRoomId.trim()) return
    const id = joinRoomId.trim().toUpperCase()
    setRoomId(id)
    setPlayerRole('guest')
    setGameMode('multiplayer')
    setGameState('waiting')

    const channel = supabase.channel(`vocab-battle-${id}`, {
      config: { broadcast: { self: true } },
    })

    let joined = false

    channel.on('broadcast', { event: 'message' }, (payload) => {
      const msg = payload.payload as BattleMessage

      if (msg.type === 'start') {
        pickQuestions().then(qs => {
          setQuestions(qs)
          setGameState('playing')
        })
      }

      if (msg.type === 'answer' && msg.player === 'host') {
        const q = questionsRef.current[msg.questionIndex!]
        if (msg.answer === q?.correct) {
          setHostScore((s) => s + 1)
        }
      }
    })

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED' && !joined) {
        joined = true
        channel.send({
          type: 'broadcast',
          event: 'message',
          payload: { type: 'join', player: 'guest', playerName: userName } as BattleMessage,
        })
        setOpponentName(userName)
      } else if (status !== 'SUBSCRIBED') {
        setMessage('Xonaga ulanishda xatolik. Xona ID ni tekshiring.')
        setGameState('error')
      }
    })

    channelRef.current = channel
  }, [joinRoomId, userName, pickQuestions])

  // ── Handle answer ─────────────────────────────────────────────────────

  const handleAnswer = useCallback((answerIndex: number) => {
    if (locked) return
    setLocked(true)
    if (timerRef.current) clearInterval(timerRef.current)
    setSelected(answerIndex)

    const isCorrect = answerIndex === questions[currentQ]?.correct

    if (gameMode === 'multiplayer') {
      const msg: BattleMessage = {
        type: 'answer',
        player: playerRole!,
        answer: answerIndex,
        questionIndex: currentQ,
        playerName: userName,
      }
      channelRef.current?.send({
        type: 'broadcast',
        event: 'message',
        payload: msg,
      })
    }

    if (isCorrect) {
      if (playerRole === 'host' || gameMode === 'ai') setHostScore((s) => s + 1)
      else setGuestScore((s) => s + 1)
      emitXpBurst(5)
    }

    feelAnswer({ correct: isCorrect })

    setTimeout(() => {
      advanceQuestion()
    }, 1500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, questions, currentQ, playerRole, userName, gameMode])

  // ── Advance question ─────────────────────────────────────────────────

  const advanceQuestion = useCallback(() => {
    const next = currentQ + 1
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current)
    setAiThinking(false)

    if (next >= QUESTIONS_PER_GAME) {
      setGameState('results')
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    setCurrentQ(next)
    setSelected(null)
    setLocked(false)
    setAiAnswered(false)
    startTimer()

    // Schedule AI answer for next question
    if (gameMode === 'ai' && opponentDifficulty) {
      scheduleAIAnswer(questions[next], opponentDifficulty)
    }
  }, [currentQ, startTimer, gameMode, opponentDifficulty, questions, scheduleAIAnswer])

  // ── Start playing ─────────────────────────────────────────────────────

  useEffect(() => {
    if (gameState === 'playing' && questions.length > 0) {
      setCurrentQ(0)
      setSelected(null)
      setLocked(false)
      setAiAnswered(false)
      startTimer()

      // Schedule first AI answer
      if (gameMode === 'ai' && opponentDifficulty) {
        scheduleAIAnswer(questions[0], opponentDifficulty)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, questions.length, gameMode, opponentDifficulty])

  // ── Copy room ID ─────────────────────────────────────────────────────

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setRoomCopied(true)
      setTimeout(() => setRoomCopied(false), 2000)
    })
  }

  // ── Share room ───────────────────────────────────────────────────────

  const shareRoom = async () => {
    const shareData = {
      title: 'EnglishPath Vocabulary Battle',
      text: `Men bilan EnglishPath Vocabulary Battle o'ynang! Xona ID: ${roomId}`,
    }
    try {
      await navigator.share(shareData)
    } catch (e) {
      monitoring.captureMessage('VocabBattle share failed (fallback to copy): ' + (e instanceof Error ? e.message : String(e)), 'warn')
      copyRoomId()
    }
  }

  // ── Reset ────────────────────────────────────────────────────────────

  const reset = () => {
    cleanup()
    setGameState('lobby')
    setGameMode(null)
    setRoomId('')
    setJoinRoomId('')
    setPlayerRole(null)
    setOpponentName('')
    setOpponentEmoji('👤')
    setOpponentDifficulty(null)
    setQuestions([])
    setCurrentQ(0)
    setSelected(null)
    setHostScore(0)
    setGuestScore(0)
    setTimeLeft(QUESTION_TIME)
    setMessage('')
    setLocked(false)
    setAiThinking(false)
    setAiAnswered(false)
  }

  // ── Render lobby ─────────────────────────────────────────────────────

  if (gameState === 'lobby') {
    return (
      <VocabBattleLobby
        selectedLevel={selectedLevel}
        aiDifficulty={aiDifficulty}
        joinRoomId={joinRoomId}
        onLevelChange={(l) => setSelectedLevel(l)}
        onAIDifficultyChange={(d) => setAiDifficulty(d)}
        onJoinRoomIdChange={(id) => setJoinRoomId(id)}
        onCreateRoom={createRoom}
        onStartAI={() => startAIGame(aiDifficulty)}
        onJoinRoom={joinRoom}
      />
    )
  }

  // ── Render waiting ────────────────────────────────────────────────────

  if (gameState === 'waiting') {
    return (
      <VocabBattleWaiting
        playerRole={playerRole}
        roomId={roomId}
        roomCopied={roomCopied}
        onCopyRoomId={copyRoomId}
        onShareRoom={shareRoom}
        onReset={reset}
      />
    )
  }

  // ── Render playing ────────────────────────────────────────────────────

  if (gameState === 'playing' && questions.length > 0) {
    return (
      <VocabBattlePlaying
        questions={questions}
        currentQ={currentQ}
        selected={selected}
        timeLeft={timeLeft}
        hostScore={hostScore}
        guestScore={guestScore}
        userName={userName}
        opponentName={opponentName}
        opponentEmoji={opponentEmoji}
        aiThinking={aiThinking}
        aiAnswered={aiAnswered}
        onAnswer={handleAnswer}
      />
    )
  }

  // ── Render results ────────────────────────────────────────────────────

  if (gameState === 'results') {
    return (
      <VocabBattleResults
        hostScore={hostScoreRef.current}
        guestScore={guestScoreRef.current}
        userName={userName}
        opponentName={opponentName}
        opponentEmoji={opponentEmoji}
        gameMode={gameMode}
        opponentDifficulty={opponentDifficulty}
        onReset={reset}
      />
    )
  }

  // ── Render error ──────────────────────────────────────────────────────

  if (gameState === 'error') {
    return (
      <VocabBattleError message={message} onReset={reset} />
    )
  }

  return null
}
