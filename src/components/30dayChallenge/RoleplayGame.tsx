import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Volume2, ArrowLeftRight, Loader2, Send, Eye, Mic, Square } from 'lucide-react'
import type { ChallengeDay } from '../../data/30dayChallenge'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { evaluateDialogueLine, translateLines, startDayRoleplay } from '../../lib/openaiChat'
import { inferScenario } from '../../lib/roleplayUtils'
import type { RoleplayExercise } from '../../data/30dayChallenge'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  day: ChallengeDay
}

const STUDENT_SPEAKERS = ['Fizu', 'Student', 'You']

function speakerLabel(speaker: string, studentRole: string, userName: string): string {
  if (speaker === studentRole || STUDENT_SPEAKERS.includes(speaker)) return userName
  return speaker
}

interface DialogueScene {
  id: string
  title: string
  icon: string
  studentRole: string   // Fizu — student plays this
  aiRoles: string[]     // Everyone else — AI plays these
  lines: { speaker: string; text: string }[]
  isFreeForm?: boolean  // Roleplay exercise without specific dialogue lines
}

interface EvalResult {
  status: 'CORRECT' | 'CLOSE' | 'INCORRECT'
  tip: string
  hint: string
  aiResponse: string
}

function extractDialogues(day: ChallengeDay): DialogueScene[] {
  const scenes: DialogueScene[] = []

  function findStudentSpeaker(speakers: string[]): string | null {
    return speakers.find(s => STUDENT_SPEAKERS.includes(s)) ?? null
  }

  if (day.structuredTranscript) {
    for (const section of day.structuredTranscript) {
      if (!section.title.toLowerCase().includes('situation')) continue
      const allSpeakers = [...new Set(section.lines.map(l => l.speaker).filter(Boolean) as string[])]
      if (allSpeakers.length < 2) continue
      const studentRole = findStudentSpeaker(allSpeakers)
      if (!studentRole) continue
      const aiRoles = allSpeakers.filter(s => s !== studentRole)
      if (aiRoles.length === 0) continue
      scenes.push({
        id: section.id,
        title: section.title,
        icon: section.icon ?? '🎭',
        studentRole,
        aiRoles,
        lines: section.lines
          .filter(l => l.speaker && allSpeakers.includes(l.speaker))
          .map(l => ({ speaker: l.speaker!, text: l.text })),
      })
    }
  }

  // Also add type: 'roleplay' exercises
  if (day.exercises) {
    for (const ex of day.exercises) {
      if (ex.type !== 'roleplay') continue
      const rp = ex as RoleplayExercise
      const s = rp.scenario.toLowerCase()
      let studentRole = 'You'
      let aiRoles = ['Stranger']
      if (s.includes('restaurant') || s.includes('waiter') || s.includes('order')) {
        studentRole = 'Customer'; aiRoles = ['Waiter']
      } else if (s.includes('coffee') || s.includes('cafe') || s.includes('barista')) {
        studentRole = 'Customer'; aiRoles = ['Barista']
      } else if (s.includes('direction') || s.includes('lost') || s.includes('stranger') || s.includes('station')) {
        studentRole = 'Traveler'; aiRoles = ['Local person']
      } else if (s.includes('friend') || s.includes('meet') || s.includes('talking')) {
        studentRole = 'You'; aiRoles = ['Friend']
      } else if (s.includes('hotel') || s.includes('check')) {
        studentRole = 'Guest'; aiRoles = ['Receptionist']
      } else if (s.includes('shop') || s.includes('store') || s.includes('buy')) {
        studentRole = 'Customer'; aiRoles = ['Shop assistant']
      } else if (s.includes('doctor') || s.includes('hospital')) {
        studentRole = 'Patient'; aiRoles = ['Doctor']
      } else if (s.includes('interview') || s.includes('job')) {
        studentRole = 'Candidate'; aiRoles = ['Interviewer']
      }
      scenes.push({
        id: `rp-${rp.id}`,
        title: rp.instruction || rp.scenario.split('.')[0] || 'Role-Play',
        icon: '🎭',
        studentRole,
        aiRoles,
        lines: [{ speaker: studentRole, text: rp.scenario }],
        isFreeForm: true,
      })
    }
  }

  return scenes
}

function parseEvalResponse(raw: string): EvalResult {
  const statusMatch = raw.match(/STATUS:\s*(CORRECT|CLOSE|INCORRECT)/)
  const tipMatch = raw.match(/💡 TIP:\s*([^\n]+)/)
  const hintMatch = raw.match(/HINT:\s*([^\n]+)/)
  const aiIdx = raw.indexOf('AI_RESPONSE:')
  const aiResponse = aiIdx >= 0 ? raw.slice(aiIdx + 12).trim() : ''
  return {
    status: (statusMatch?.[1] as EvalResult['status']) || 'INCORRECT',
    tip: tipMatch?.[1]?.trim() || '',
    hint: hintMatch?.[1]?.trim() || '',
    aiResponse,
  }
}

export default function RoleplayGame({ day }: Props) {
  const tts = useSpeechSynthesis()
  const sr = useSpeechRecognition()
  const { user } = useAuth()
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'You'
  const [selectedScene, setSelectedScene] = useState<DialogueScene | null>(null)
  const [phase, setPhase] = useState<1 | 2>(1)
  const [lineIdx, setLineIdx] = useState(0)
  const [input, setInput] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [started, setStarted] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [uzbekText, setUzbekText] = useState<string | null>(null)
  const [loadingUzbek, setLoadingUzbek] = useState(false)
  const [freeMessages, setFreeMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [freeLoading, setFreeLoading] = useState(false)
  const evalBuf = useRef('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const allScenes = useMemo(() => extractDialogues(day), [day])

  const currentDialog = useMemo(() => {
    if (!selectedScene) return null
    return {
      scene: selectedScene,
      aiRoles: phase === 1 ? selectedScene.aiRoles : [selectedScene.studentRole],
      myRole: phase === 1 ? selectedScene.studentRole : selectedScene.aiRoles[0],
    }
  }, [selectedScene, phase])

  const currentLine = currentDialog ? currentDialog.scene.lines[lineIdx] : null
  const isAiLine = currentDialog ? currentDialog.aiRoles.includes(currentLine?.speaker ?? '') : false
  const [aiFollowUp, setAiFollowUp] = useState<string | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lineIdx, phase, input, evalResult])

  const startScene = useCallback((scene: DialogueScene) => {
    tts.stop()
    setSelectedScene(scene)
    setPhase(1)
    setLineIdx(0)
    setCompleted(false)
    setInput('')
    setEvalResult(null)
    evalBuf.current = ''
    setShowAnswer(false)
    setRetryCount(0)
    setStarted(false)
    setUzbekText(null)
    setLoadingUzbek(false)
    setAiFollowUp(null)
    setFreeMessages([])
    setFreeLoading(false)
    setShowIntro(true)
  }, [tts])

  const beginPractice = useCallback(() => {
    setShowIntro(false)
    setStarted(true)
  }, [])

  // Voice input → text
  useEffect(() => {
    if (sr.isRecording && sr.transcript && currentLine && currentDialog && currentLine.speaker === currentDialog.myRole) {
      setInput(prev => {
        const combined = (sr.transcript + ' ' + sr.interim).trim()
        return combined || prev
      })
    }
  }, [sr.transcript, sr.interim, sr.isRecording, currentLine, currentDialog])

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

  // Auto-speak AI lines
  useEffect(() => {
    if (!started || !currentLine || !currentDialog) return
    if (currentDialog.aiRoles.includes(currentLine.speaker)) {
      tts.speak(currentLine.text).catch(() => {})
    }
  }, [currentLine, currentDialog, started]) // eslint-disable-line react-hooks/exhaustive-deps

  // Skip AI line
  const skipAiLine = useCallback(() => {
    tts.stop()
    setUzbekText(null)
    setLoadingUzbek(false)
    setAiFollowUp(null)
    if (lineIdx < currentDialog!.scene.lines.length - 1) {
      setLineIdx(i => i + 1)
      setEvalResult(null)
      evalBuf.current = ''
      setShowAnswer(false)
      setRetryCount(0)
    } else {
      finishDialog()
    }
  }, [lineIdx, currentDialog, tts])

  const finishDialog = useCallback(() => {
    if (phase === 1) {
      setPhase(2)
      setLineIdx(0)
      setEvalResult(null)
      evalBuf.current = ''
      setShowAnswer(false)
      setRetryCount(0)
      setAiFollowUp(null)
    setUzbekText(null)
      setLoadingUzbek(false)
    } else {
      setCompleted(true)
      setStarted(false)
    }
  }, [phase, selectedScene])

  const submitAnswer = useCallback(() => {
    const text = input.trim()
    if (!text || isEvaluating || !currentLine || !currentDialog) return
    if (sr.isRecording) sr.stop()
    setIsEvaluating(true)
    setEvalResult(null)
    evalBuf.current = ''
    setShowAnswer(false)
    setUzbekText(null)
    setLoadingUzbek(false)

    // Build context from previous lines
    const prevLines = currentDialog.scene.lines.slice(0, lineIdx)
    const contextStr = prevLines.map(l => `${l.speaker}: "${l.text}"`).join('\n')

    evaluateDialogueLine(
      contextStr,
      currentLine.text,
      text,
      day.level,
      (token) => { evalBuf.current += token },
      (full) => {
        const parsed = parseEvalResponse(full)
        setEvalResult(parsed)
        setIsEvaluating(false)
        if (parsed.status === 'CORRECT' && parsed.aiResponse) {
          // Show AI's natural response then auto-advance
          setAiFollowUp(parsed.aiResponse)
          tts.speak(parsed.aiResponse).catch(() => {})
          setTimeout(() => {
            setAiFollowUp(null)
            if (lineIdx < currentDialog.scene.lines.length - 1) {
              setLineIdx(i => i + 1)
              setInput('')
              setEvalResult(null)
              evalBuf.current = ''
              setShowAnswer(false)
              setRetryCount(0)
              setUzbekText(null)
              setLoadingUzbek(false)
            } else {
              finishDialog()
            }
          }, 2000)
        } else if (parsed.status === 'CORRECT') {
          setTimeout(() => {
            if (lineIdx < currentDialog.scene.lines.length - 1) {
              setLineIdx(i => i + 1)
              setInput('')
              setEvalResult(null)
              evalBuf.current = ''
              setShowAnswer(false)
              setRetryCount(0)
              setUzbekText(null)
              setLoadingUzbek(false)
            } else {
              finishDialog()
            }
          }, 1200)
        } else {
          setRetryCount(c => c + 1)
        }
      },
      () => { setIsEvaluating(false) }
    )
  }, [input, isEvaluating, currentLine, currentDialog, lineIdx, day.level, finishDialog])

  const revealAnswer = useCallback(() => {
    if (!currentLine || uzbekText) return
    setShowAnswer(true)
    setLoadingUzbek(true)
    translateLines([currentLine.text]).then(results => {
      setUzbekText(results[0] || currentLine!.text)
      setLoadingUzbek(false)
    }).catch(() => {
      setUzbekText(currentLine!.text)
      setLoadingUzbek(false)
    })
  }, [currentLine, uzbekText])

  const sendFreeMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || freeLoading || !selectedScene) return
    setInput('')
    if (sr.isRecording) sr.stop()
    const userMsg = { role: 'user' as const, content: text }
    const updated = [...freeMessages, userMsg]
    setFreeMessages(updated)
    setFreeLoading(true)

    const rp: RoleplayExercise = {
      id: 0,
      type: 'roleplay',
      instruction: selectedScene.title,
      scenario: selectedScene.lines[0]?.text || selectedScene.title,
    }
    const scenario = inferScenario(rp)
    const history = updated.map(m => ({ role: m.role, content: m.content }))

    await startDayRoleplay(
      scenario,
      day.level,
      day.title,
      day.vocabulary,
      history,
      () => {},
      (full: string) => {
        setFreeMessages(prev => [...prev, { role: 'assistant', content: full }])
        setFreeLoading(false)
        tts.speak(full).catch(() => {})
      },
      (err: Error) => {
        setFreeMessages(prev => [...prev, { role: 'assistant', content: `❌ Xatolik: ${err.message}` }])
        setFreeLoading(false)
      }
    )
  }, [input, freeLoading, freeMessages, selectedScene, day, sr, tts])

  if (allScenes.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Bu kunda role-play uchun dialoglar mavjud emas.</p>
      </div>
    )
  }

  // ── Scene intro screen ───────────────────────────────────────
  if (showIntro && selectedScene) {
    const scenarioText = selectedScene.lines[0]?.text || ''
    return (
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-6 text-center space-y-4">
          <div className="text-5xl">{selectedScene.icon}</div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">{selectedScene.title}</h3>
            {!selectedScene.isFreeForm && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedScene.aiRoles.join(' & ')} bilan suhbat
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <span className="text-lg">🤖</span>
              <span className="font-bold text-purple-700 dark:text-purple-300 text-xs">AI</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{selectedScene.aiRoles.join(', ')}</span>
            </div>
            <ArrowLeftRight size={20} className="text-gray-300" />
            <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <span className="text-lg">🧑</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">Siz</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{userName}</span>
            </div>
          </div>
          {scenarioText && !selectedScene.isFreeForm && (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic max-w-md mx-auto">
              “{scenarioText}”
            </p>
          )}
          {selectedScene.isFreeForm && (
            <div className="max-w-md mx-auto text-left space-y-2">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Ssenariy:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{scenarioText}</p>
            </div>
          )}
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => { setSelectedScene(null); setShowIntro(false) }}
              className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Ortga
            </button>
            <button
              onClick={beginPractice}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-sm hover:from-purple-700 hover:to-fuchsia-700 transition-all active:scale-95 shadow-lg"
            >
              Boshlaymiz! 🚀
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedScene) {
    return (
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          🎭 Role-play o'yini
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Video dialoglarni AI bilan real suhbat shaklida takrorlang. AI rol o'ynaydi, siz javob berasiz, AI tekshiradi va to'g'irlaydi.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allScenes.map(scene => (
            <button
              key={scene.id}
              onClick={() => startScene(scene)}
              className="text-left p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-md active:scale-[0.98]"
            >
              <p className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">
                <span>{scene.icon}</span>
                <span>{scene.title}</span>
              </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🤖 {scene.aiRoles.join(' & ')} ↔️ 🧑 {speakerLabel(scene.studentRole, scene.studentRole, userName)} · {scene.lines.length} ta qator
          </p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Free-form roleplay (no specific dialogue lines) ──────────────
  if (selectedScene.isFreeForm) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20">
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              🎭 {selectedScene.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              🤖 {selectedScene.aiRoles.join(' & ')} ↔️ 🧑 {speakerLabel(selectedScene.studentRole, selectedScene.studentRole, userName)}
            </p>
          </div>
          <button onClick={() => { setSelectedScene(null); setStarted(false); setShowIntro(false) }} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <span className="text-sm">✕</span>
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
          {freeMessages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl px-3.5 py-2 ${
                m.role === 'user'
                  ? 'bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800'
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}>
                <p className="text-[10px] font-bold text-gray-400 mb-0.5">
                  {m.role === 'user' ? '🧑 You' : `🤖 ${selectedScene.aiRoles[0]}`}
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200">{m.content}</p>
              </div>
            </div>
          ))}
          {freeLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <Loader2 size={14} className="animate-spin text-purple-500" />
                <span className="text-xs text-gray-500">AI yozmoqda...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendFreeMessage() } }}
              placeholder="Ingliz tilida yozing..."
              disabled={freeLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-400 disabled:opacity-50"
            />
            <button
              onClick={sendFreeMessage}
              disabled={!input.trim() || freeLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700 transition-all active:scale-95 disabled:opacity-40"
            >
              {freeLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const progress = ((lineIdx) / currentDialog!.scene.lines.length) * 100

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${
        phase === 1
          ? 'bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20'
          : 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
      }`}>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
            {phase === 1 ? `🤖 ${currentDialog!.aiRoles.join(' & ')} so'raydi` : `🧑 Siz (${currentDialog!.myRole}) so'raysiz`}
            <span className="text-xs font-normal text-gray-400">— Bosqich {phase}/2</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{selectedScene.title}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => { setSelectedScene(null); setStarted(false); setShowIntro(false) }}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            title="Orqaga"
          >
            <span className="text-sm">✕</span>
          </button>
        </div>
      </div>

      {/* Phase indicator */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className={`px-2 py-0.5 rounded-full font-bold ${phase === 1 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'}`}>
          1. AI ({selectedScene.aiRoles.join(' & ')}) so'raydi
        </span>
        <ArrowLeftRight size={12} />
        <span className={`px-2 py-0.5 rounded-full font-bold ${phase === 2 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'}`}>
          2. Siz ({selectedScene.aiRoles[0]}) bo'lib so'raysiz
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 dark:bg-gray-700">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Dialogue area */}
      <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
        {/* Previous lines (greyed out) */}
        {currentDialog!.scene.lines.slice(0, lineIdx).map((line, i) => {
          const wasMyLine = phase === 1
            ? line.speaker === selectedScene.studentRole
            : line.speaker === selectedScene.aiRoles[0]
          return (
            <div key={i} className={`flex ${wasMyLine ? 'justify-end' : 'justify-start'} opacity-50`}>
              <div className={`max-w-[85%] rounded-xl px-3.5 py-2 ${
                wasMyLine
                  ? phase === 1 ? 'bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800' : 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}>
                <p className="text-[10px] font-bold text-gray-400 mb-0.5">
                  {wasMyLine ? '🧑 ' : '🤖 '}{speakerLabel(line.speaker, selectedScene.studentRole, userName)}
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200">{line.text}</p>
              </div>
            </div>
          )
        })}

        {/* Current AI line */}
        {currentLine && isAiLine && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 ring-2 ring-purple-400 dark:ring-purple-600">
              <p className="text-[10px] font-bold text-gray-400 mb-0.5">🤖 {speakerLabel(currentLine.speaker, selectedScene.studentRole, userName)}</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{currentLine.text}</p>
            </div>
          </div>
        )}

        {/* Current user line — not shown, just prompt */}
        {currentLine && !isAiLine && (
          <div className="animate-fade-in">
            <div className="rounded-xl p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 border border-purple-200 dark:border-purple-800 text-center">
              <p className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-1">
                🧑 Sizning navbatingiz ({speakerLabel(currentLine.speaker, selectedScene.studentRole, userName)})
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Yuqoridagi suhbatdan kelib chiqib, {speakerLabel(currentLine.speaker, selectedScene.studentRole, userName)} nimasini aytish kerak?
              </p>
            </div>
          </div>
        )}

        {/* Show answer button — shows Uzbek translation */}
        {currentLine && !isAiLine && showAnswer && (
          <div className="flex justify-end animate-fade-in">
            <div className="max-w-[85%] rounded-xl px-3.5 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">🇺🇿 O'zbekchasi</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {loadingUzbek ? 'Tarjima yuklanmoqda...' : (uzbekText || currentLine.text)}
              </p>
            </div>
          </div>
        )}

        {/* AI follow-up response */}
        {aiFollowUp && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-0.5">🤖 {currentDialog!.aiRoles[0]}</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{aiFollowUp}</p>
            </div>
          </div>
        )}

        {/* Evaluation result */}
        {currentLine && !isAiLine && evalResult && (
          <div className={`animate-fade-in rounded-xl p-3 border ${
            evalResult.status === 'CORRECT'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
          }`}>
            <p className="text-sm font-bold mb-1">
              {evalResult.status === 'CORRECT' ? '✅ To\'g\'ri!' : evalResult.status === 'CLOSE' ? '🔄 Zo\'r, deyarli!' : '❌ Qayta urinib ko\'ring'}
            </p>
            {evalResult.tip && <p className="text-sm text-gray-700 dark:text-gray-300">{evalResult.tip}</p>}
            {evalResult.status !== 'CORRECT' && evalResult.hint && (
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                💡 {evalResult.hint}
              </p>
            )}
          </div>
        )}

        {/* Recording indicator */}
        {sr.isRecording && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-600 dark:text-red-400">Gapiryapsiz...</span>
            </div>
          </div>
        )}

        {/* Permission error */}
        {sr.permissionError && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <span className="text-xs text-amber-600 dark:text-amber-400">Mikrofon ruxsati yo'q</span>
              <button onClick={() => { sr.reset(); sr.start() }} className="text-xs underline text-amber-600">Qayta urinish</button>
            </div>
          </div>
        )}

        {/* TTS indicator */}
        {tts.playing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <Volume2 size={12} className="animate-pulse text-purple-500" />
              <span className="text-xs text-purple-600 dark:text-purple-400">AI gapiryapti...</span>
            </div>
          </div>
        )}

        {/* Completed state */}
        {completed && (
          <div className="flex flex-col items-center gap-3 py-6 animate-fade-in">
            <div className="text-4xl">🎉</div>
            <p className="font-bold text-gray-900 dark:text-gray-100">Ajoyib! Ikkala bosqich ham tugadi!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedScene.title} ni to'liq bajardingiz.</p>
            <button
              onClick={() => { setSelectedScene(null); setStarted(false); setShowIntro(false) }}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Boshqa dialog
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Controls / Input */}
      {!completed && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          {isAiLine ? (
            <button
              onClick={skipAiLine}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-[0.98]"
            >
              {tts.playing ? (
                <><Loader2 size={14} className="animate-spin" /> Tinglashni o'tkazib yuborish</>
              ) : (
                <><Volume2 size={16} className="mr-1" /> Tushundim, davom etamiz</>
              )}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={toggleMic}
                  disabled={!sr.isSupported || isEvaluating || evalResult?.status === 'CORRECT'}
                  className={`p-2.5 rounded-xl transition-all ${
                    sr.isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  } disabled:opacity-40`}
                  title={sr.isRecording ? 'To\'xtatish' : 'Mikrofon'}
                >
                  {sr.isRecording ? <Square size={16} /> : <Mic size={16} />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer() } }}
                  placeholder={sr.isRecording ? 'Gapiryapsiz...' : 'Ingliz tilida javob yozing...'}
                  disabled={isEvaluating || evalResult?.status === 'CORRECT'}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-400 disabled:opacity-50"
                />
                <button
                  onClick={submitAnswer}
                  disabled={!input.trim() || isEvaluating || evalResult?.status === 'CORRECT'}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700 transition-all active:scale-95 disabled:opacity-40"
                >
                  {isEvaluating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={revealAnswer}
                  disabled={showAnswer || evalResult?.status === 'CORRECT'}
                  className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all disabled:opacity-40"
                >
                  <Eye size={12} /> Ko'rsatish
                </button>
                {retryCount > 0 && (
                  <span className="text-xs text-gray-400">{retryCount} marta urindingiz</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}