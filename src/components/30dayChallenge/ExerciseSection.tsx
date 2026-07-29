import { useState, useCallback, useRef, useEffect } from 'react'
import { Volume2, Mic, ChevronLeft, ChevronRight, Sparkles, Bot, Loader2, Brain, Square } from 'lucide-react'
import type { ChallengeExercise, DialogueLine, RoleplayExercise } from '../../data/30dayChallenge'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { evaluateQuestionAnswer } from '../../lib/openaiChat'
import { speakText } from '../../lib/speak'

interface Props {
  exercises: ChallengeExercise[]
  onStartRoleplay?: (roleplay: RoleplayExercise) => void
  level?: string
}

const EXERCISE_EMOJIS: Record<string, string> = {
  'dialogue-complete': '💬',
  'roleplay': '🎭',
  'shadowing': '🔊',
  'questions': '❓',
}

const EXERCISE_LABELS: Record<string, string> = {
  'dialogue-complete': 'Dialog',
  'roleplay': 'Role-play',
  'shadowing': 'Shadowing',
  'questions': 'Savollar',
}

export default function ExerciseSection({ exercises, onStartRoleplay, level = 'A2' }: Props) {
  const [activeEx, setActiveEx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState<Record<string, boolean>>({})
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [animating, setAnimating] = useState(false)

  // Speech + AI state for questions
  const sr = useSpeechRecognition()
  const [recordingQIndex, setRecordingQIndex] = useState<number | null>(null)
  const [questionTranscripts, setQuestionTranscripts] = useState<Record<number, string>>({})
  const [questionFeedbacks, setQuestionFeedbacks] = useState<Record<number, string>>({})
  const [evaluatingIndex, setEvaluatingIndex] = useState<number | null>(null)
  const [textInputs, setTextInputs] = useState<Record<number, string>>({})
  const feedbackAccumRef = useRef<Record<number, string>>({})

  // When speech recognition stops, capture the transcript
  const wasRecording = useRef(false)
  useEffect(() => {
    if (wasRecording.current && !sr.isRecording && recordingQIndex !== null) {
      const t = sr.transcript.trim()
      if (t) {
        setQuestionTranscripts(prev => ({ ...prev, [recordingQIndex]: t }))
      }
      setRecordingQIndex(null)
    }
    wasRecording.current = sr.isRecording
  }, [sr.isRecording, sr.transcript, recordingQIndex])

  const handleInputChange = useCallback((idx: number, val: string) => {
    setAnswers(prev => ({ ...prev, [`${activeEx}-${idx}`]: val }))
  }, [activeEx])

  const checkAnswer = useCallback((idx: number) => {
    setShowResults(prev => ({ ...prev, [`${activeEx}-${idx}`]: true }))
  }, [activeEx])

  const speakSentence = useCallback((text: string) => {
    speakText(text)
  }, [])

  const switchExercise = useCallback((newIdx: number) => {
    if (newIdx === activeEx || newIdx < 0 || newIdx >= exercises.length) return
    // Clean up speech recognition
    if (sr.isRecording) sr.stop()
    sr.reset()
    setDirection(newIdx > activeEx ? 'right' : 'left')
    setAnimating(true)
    setTimeout(() => {
      setActiveEx(newIdx)
      setAnswers({})
      setShowResults({})
      setRecordingQIndex(null)
      setQuestionTranscripts({})
      setQuestionFeedbacks({})
      setEvaluatingIndex(null)
      setTextInputs({})
      feedbackAccumRef.current = {}
      setAnimating(false)
    }, 200)
  }, [activeEx, exercises.length, sr])

  const ex = exercises[activeEx]

  if (!ex) return null

  return (
    <div className="space-y-4">
      {/* Header */}
      <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        ✍️ Mashqlar
        <span className="text-sm font-normal text-gray-500">({activeEx + 1}/{exercises.length})</span>
      </h3>

      {/* Exercise stepper */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => switchExercise(activeEx - 1)}
          disabled={activeEx === 0}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex-1 flex gap-1 overflow-x-auto py-1">
          {exercises.map((e, i) => (
            <button
              key={e.id}
              onClick={() => switchExercise(i)}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0
                ${activeEx === i
                  ? 'bg-primary-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {EXERCISE_EMOJIS[e.type]} {EXERCISE_LABELS[e.type]}
            </button>
          ))}
        </div>

        <button
          onClick={() => switchExercise(activeEx + 1)}
          disabled={activeEx === exercises.length - 1}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Exercise content */}
      <div className={`
        rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 sm:p-5
        transition-all duration-300
        ${animating
          ? direction === 'right' ? 'opacity-0 -translate-x-4' : 'opacity-0 translate-x-4'
          : 'opacity-100 translate-x-0'
        }
      `}>
        {/* Instruction */}
        <div className="flex items-start gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <span className="text-lg shrink-0">{EXERCISE_EMOJIS[ex.type]}</span>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{ex.instruction}</p>
        </div>

        {/* Dialogue Complete */}
        {ex.type === 'dialogue-complete' && (
          <div className="space-y-3">
            {ex.lines.map((line: DialogueLine, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`font-bold text-sm min-w-[65px] py-2 ${
                  line.speaker === 'You' ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {line.speaker === 'You' ? '🧑 ' : '👤 '}{line.speaker}:
                </span>
                {line.blank ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={answers[`${activeEx}-${i}`] ?? ''}
                      onChange={e => handleInputChange(i, e.target.value)}
                      placeholder="Javobingizni yozing..."
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-gray-400"
                    />
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => checkAnswer(i)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-bold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                      >
                        ✅ Tekshirish
                      </button>
                      {showResults[`${activeEx}-${i}`] && (
                        <span className="text-xs text-gray-500 animate-fade-in">
                          To'g'ri javob: <span className="text-green-600 dark:text-green-400 font-bold">{line.answer}</span>
                          {answers[`${activeEx}-${i}`]?.toLowerCase().trim() === line.answer?.toLowerCase().trim() && (
                            <span className="text-green-600 ml-1 animate-pop-in">✓ To'g'ri!</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-800 dark:text-gray-200 py-2">{line.text}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Roleplay */}
        {ex.type === 'roleplay' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border border-primary-200 dark:border-primary-800">
              <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mb-2 uppercase">🎭 Vaziyat</p>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{ex.scenario}</p>
            </div>
            {ex.tips && ex.tips.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1">
                  <Sparkles size={12} /> Maslahatlar
                </p>
                {ex.tips.map((tip, i) => (
                  <p key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-primary-500 font-bold shrink-0">{i + 1}.</span>
                    <span>{tip}</span>
                  </p>
                ))}
              </div>
            )}

            {/* AI Role-play button */}
            {onStartRoleplay && (
              <button
                onClick={() => onStartRoleplay(ex)}
                className="group relative w-full overflow-hidden p-4 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white font-bold text-sm transition-all hover:shadow-xl hover:from-purple-700 hover:to-fuchsia-800 active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Bot size={18} />
                  AI bilan role-play qilish
                  <Sparkles size={16} className="text-yellow-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            )}

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Mic size={14} />
                Yoki o'zingiz mustaqil gapirib ko'ring — Speaking bo'limiga o'ting.
              </p>
            </div>
          </div>
        )}

        {/* Shadowing */}
        {ex.type === 'shadowing' && (
          <div className="space-y-2">
            {ex.sentences.map((s: string, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 transition-all group"
              >
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="text-gray-400 dark:text-gray-500 font-mono mr-2">{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </span>
                <button
                  onClick={() => speakSentence(s)}
                  className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all active:scale-90"
                  title="Eshitish"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            ))}
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 mt-4">
              <p className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                🔁 Har bir gapni eshitib, darhol ovoz chiqarib takrorlang. Kamida 3 marta takrorlang!
              </p>
            </div>
          </div>
        )}

        {/* Questions */}
        {ex.type === 'questions' && (
          <div className="space-y-4">
            {ex.questions.map((q: string, i: number) => {
              const isRecordingThis = recordingQIndex === i && sr.isRecording
              const transcript = questionTranscripts[i]
              const feedback = questionFeedbacks[i]
              const isEvaluating = evaluatingIndex === i

              const handleMicClick = () => {
                if (isRecordingThis) {
                  sr.stop()
                } else {
                  if (sr.isRecording) {
                    // Save current transcript before switching
                    const prevTranscript = sr.transcript.trim()
                    if (prevTranscript && recordingQIndex !== null && recordingQIndex !== i) {
                      setQuestionTranscripts(prev => ({ ...prev, [recordingQIndex]: prevTranscript }))
                    }
                    sr.stop()
                  }
                  sr.reset()
                  setRecordingQIndex(i)
                  sr.start()
                }
              }

              const handleAICheck = (answerText?: string) => {
                const text = answerText || transcript
                if (!text) return
                setEvaluatingIndex(i)
                feedbackAccumRef.current[i] = ''
                setQuestionFeedbacks(prev => ({ ...prev, [i]: '' }))

                evaluateQuestionAnswer(
                  q,
                  text,
                  level,
                  (token) => {
                    feedbackAccumRef.current[i] += token
                    setQuestionFeedbacks(prev => ({
                      ...prev,
                      [i]: feedbackAccumRef.current[i],
                    }))
                  },
                  (full) => {
                    setQuestionFeedbacks(prev => ({ ...prev, [i]: full }))
                    setEvaluatingIndex(null)
                  },
                  () => {
                    setEvaluatingIndex(null)
                  }
                )
              }

              return (
                <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 transition-all">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-bold mr-2">
                      {i + 1}
                    </span>
                    {q}
                  </p>

                  {/* Recording indicator */}
                  {isRecordingThis && (
                    <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">Yozilmoqda...</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {sr.transcript}
                        {sr.interim && <span className="text-gray-400">{sr.interim}</span>}
                      </p>
                    </div>
                  )}

                  {/* Transcript after recording */}
                  {!isRecordingThis && transcript && (
                    <div className="mb-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-fade-in">
                      <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-1 flex items-center gap-1">
                        <Mic size={12} /> Sizning javobingiz:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">"{transcript}"</p>
                    </div>
                  )}

                  {/* Actions row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => speakSentence(q)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all active:scale-95"
                    >
                      <Volume2 size={12} /> Savolni eshitish
                    </button>

                    {!isRecordingThis && !transcript && sr.isSupported && (
                      <button
                        onClick={handleMicClick}
                        disabled={recordingQIndex !== null && recordingQIndex !== i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-all active:scale-95 disabled:opacity-40"
                      >
                        <Mic size={12} /> Javob yozish
                      </button>
                    )}

                    {!isRecordingThis && !transcript && !sr.isSupported && (
                      <div className="w-full space-y-2">
                        <textarea
                          value={textInputs[i] ?? ''}
                          onChange={e => setTextInputs(prev => ({ ...prev, [i]: e.target.value }))}
                          placeholder="Javobingizni yozing..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-gray-400 resize-none"
                        />
                        <button
                          onClick={() => {
                            const val = textInputs[i]?.trim()
                            if (val) {
                              setQuestionTranscripts(prev => ({ ...prev, [i]: val }))
                              setTextInputs(prev => {
                                const next = { ...prev }
                                delete next[i]
                                return next
                              })
                              handleAICheck(val)
                            }
                          }}
                          disabled={!textInputs[i]?.trim()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold hover:from-violet-700 hover:to-purple-700 transition-all active:scale-95 disabled:opacity-40"
                        >
                          <Brain size={12} /> AI bilan tekshirish
                        </button>
                      </div>
                    )}

                    {isRecordingThis && (
                      <button
                        onClick={handleMicClick}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all active:scale-95 animate-pulse"
                      >
                        <Square size={12} /> To'xtatish
                      </button>
                    )}

                    {!isRecordingThis && transcript && !feedback && !isEvaluating && (
                      <button
                        onClick={() => handleAICheck()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold hover:from-violet-700 hover:to-purple-700 transition-all active:scale-95"
                      >
                        <Brain size={12} /> AI bilan tekshirish
                      </button>
                    )}
                  </div>

                  {/* AI Feedback streaming */}
                  {isEvaluating && feedback !== undefined && (
                    <div className="mt-3 p-3 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 animate-fade-in">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Brain size={14} className="text-violet-600" />
                        <span className="text-xs font-bold text-violet-700 dark:text-violet-300">
                          {feedback ? 'AI tahlili' : 'Tahlil qilinmoqda...'}
                        </span>
                        {!feedback && <Loader2 size={12} className="animate-spin text-violet-500" />}
                      </div>
                      {feedback && (
                        <pre className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                          {feedback}
                          {isEvaluating && <span className="inline-block w-1 h-4 bg-violet-500 ml-0.5 animate-pulse align-middle" />}
                        </pre>
                      )}
                    </div>
                  )}

                  {/* Completed feedback */}
                  {!isEvaluating && feedback && (
                    <div className="mt-3 p-3 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 animate-fade-in">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Brain size={14} className="text-violet-600" />
                        <span className="text-xs font-bold text-violet-700 dark:text-violet-300">AI tahlili</span>
                      </div>
                      <pre className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {feedback}
                      </pre>
                    </div>
                  )}
                </div>
              )
            })}
            {ex.hints && ex.hints.length > 0 && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase flex items-center gap-1">
                  <Sparkles size={12} /> Maslahatlar
                </p>
                {ex.hints.map((h, i) => (
                  <p key={i} className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{h}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
