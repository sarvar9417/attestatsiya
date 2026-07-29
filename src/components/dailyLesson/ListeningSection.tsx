import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react'
import type { ListeningSection as ListeningSectionType } from '../../data/dailyLessons'
import { useI18n } from '../../i18n'
import ListeningPrePhase from './ListeningPrePhase'
import ListeningPlayer from './ListeningPlayer'
import ListeningQuestionCard from './ListeningQuestionCard'
import ListeningResults from './ListeningResults'
import { parseTranscript, getVoices, extractVocabulary, getQuestionKey, checkAnswer, SPEAKER_COLORS, SS } from './listeningUtils'
import type { SpeakerSegment } from './listeningUtils'

interface Props {
  section: ListeningSectionType
  addXP?: (amount: number) => void
}

type Phase = 'pre' | 'listen' | 'post' | 'result'
type ListenStep = 'first' | 'questions' | 'dictation'

export default function ListeningSection({ section, addXP }: Props) {
  const { t } = useI18n()
  const [phase, setPhase] = useState<Phase>('pre')
  const [listenStep, setListenStep] = useState<ListenStep>('first')
  const [showTranscript, setShowTranscript] = useState(false)
  const [answers, setAnswers] = useState<Record<string, number | number[] | string | boolean | string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [xpAwarded, setXpAwarded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null)
  const [activeSegIdx, setActiveSegIdx] = useState<number | null>(null)
  const [playCount, setPlayCount] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [dictationInputs, setDictationInputs] = useState<string[]>([])
  const [prediction, setPrediction] = useState('')

  const stoppedRef = useRef(false)
  const segmentsRef = useRef<SpeakerSegment[]>([])
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  const segments = useMemo(() => parseTranscript(section.transcript), [section.transcript])
  segmentsRef.current = segments

  const uniqueSpeakers = [...new Set(segments.map(s => s.speaker))]
  const speakerColorMap = Object.fromEntries(
    uniqueSpeakers.map((spk, i) => [spk, SPEAKER_COLORS[i % SPEAKER_COLORS.length]])
  )

  const shuffledMap = useMemo(() => {
    const map = new Map<number, { options: string[]; correctIndex: number }>()
    for (const q of section.questions) {
      if (q.options && q.correctIndex !== undefined) {
        const indices = q.options.map((_, i) => i)
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]]
        }
        map.set(q.id, {
          options: indices.map(i => q.options![i]),
          correctIndex: indices.indexOf(q.correctIndex),
        })
      }
    }
    return map
  }, [section.questions])

  useEffect(() => {
    if (!SS) return
    const cleanup = () => { SS?.cancel(); stoppedRef.current = true }
    cleanup()
    return cleanup
  }, [section.transcript])

  const stopSpeech = useCallback(() => {
    if (!SS) return
    stoppedRef.current = true
    SS.cancel()
    setPlaying(false)
    setPaused(false)
    setActiveSpeaker(null)
    setActiveSegIdx(null)
  }, [])

  const playNext = useCallback((idx: number) => {
    if (!SS || stoppedRef.current) return
    const segs = segmentsRef.current
    if (idx >= segs.length) {
      setPlaying(false)
      setActiveSpeaker(null)
      setActiveSegIdx(null)
      setPlayCount(p => p + 1)
      return
    }
    const seg = segs[idx]
    const voices = getVoices(segs)
    const prof = voices.get(seg.speaker)
    const u = new SpeechSynthesisUtterance(seg.text)
    u.lang = 'en-US'
    u.pitch = prof?.pitch ?? 1
    u.rate = (prof?.rate ?? 0.88) * speed
    u.volume = 1
    if (prof?.voice) u.voice = prof.voice
    u.onstart = () => {
      if (!stoppedRef.current) {
        setActiveSpeaker(seg.speaker)
        setActiveSegIdx(idx)
        if (transcriptEndRef.current && showTranscript) {
          const el = document.getElementById(`seg-${idx}`)
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
    u.onend = () => { if (!stoppedRef.current) playNext(idx + 1) }
    u.onerror = () => { if (!stoppedRef.current) playNext(idx + 1) }
    SS.speak(u)
  }, [speed, showTranscript])

  const playSpeech = useCallback(() => {
    if (!SS) return
    if (paused) { SS.resume(); setPaused(false); return }
    stopSpeech()
    stoppedRef.current = false
    setPlaying(true)
    setPaused(false)
    playNext(0)
  }, [paused, stopSpeech, playNext])

  const togglePause = useCallback(() => {
    if (!SS) return
    if (paused) { SS.resume(); setPaused(false) }
    else { SS.pause(); setPaused(true) }
  }, [paused])

  const playSegment = useCallback((idx: number) => {
    if (!SS) return
    stopSpeech()
    stoppedRef.current = false
    setPlaying(true)
    setPaused(false)
    playNext(idx)
  }, [stopSpeech, playNext])

  const handleChoice = (qId: number, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [`mc-${qId}`]: optionIdx }))
  }

  const handleMultiChoice = (qId: number, optionIdx: number) => {
    setAnswers(prev => {
      const key = `ma-${qId}`
      const current = (prev[key] as number[]) || []
      const updated = current.includes(optionIdx)
        ? current.filter(i => i !== optionIdx)
        : [...current, optionIdx]
      return { ...prev, [key]: updated }
    })
  }

  const handleFillBlank = (qId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [`fb-${qId}`]: value }))
  }

  const handleOrdering = (qId: number, items: number[]) => {
    setAnswers(prev => ({ ...prev, [`ord-${qId}`]: items }))
  }

  const handleTrueFalse = (qId: number, value: boolean) => {
    setAnswers(prev => ({ ...prev, [`tf-${qId}`]: value }))
  }

  const handleMatching = (qId: number, pairIdx: number, value: string) => {
    setAnswers(prev => {
      const key = `mat-${qId}`
      const current = (prev[key] as string[]) || []
      const updated = [...current]
      updated[pairIdx] = value
      return { ...prev, [key]: updated }
    })
  }

  const handleDictation = (idx: number, value: string) => {
    const updated = [...dictationInputs]
    updated[idx] = value
    setDictationInputs(updated)
  }

  const gradeQuestions = useCallback(() => {
    let correct = 0
    let totalQ = 0

    for (const q of section.questions) {
      totalQ++
      const key = getQuestionKey(q)
      const userAns = answers[key]
      if (checkAnswer(q, userAns)) correct++
    }

    if (section.dictation && dictationInputs.length > 0) {
      for (let i = 0; i < section.dictation.length; i++) {
        totalQ++
        const { startLine } = section.dictation[i]
        const seg = segments[startLine]
        if (seg && dictationInputs[i]?.toLowerCase().trim() === seg.text.toLowerCase().trim()) {
          correct++
        }
      }
    }

    setScore(correct)
    setTotal(totalQ)
    return { correct, total: totalQ }
  }, [section, answers, dictationInputs, segments])

  const handleSubmit = () => {
    const { correct, total: totalQ } = gradeQuestions()
    setSubmitted(true)
    setScore(correct)
    setTotal(totalQ)
    if (!xpAwarded && addXP) {
      addXP(correct * 10)
      setXpAwarded(true)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setDictationInputs([])
    setSubmitted(false)
    setXpAwarded(false)
  }

  const pct = total > 0 ? Math.round((score / total) * 100) : 0

  const allAnswered = useMemo(() => {
    for (const q of section.questions) {
      const key = getQuestionKey(q)
      if (answers[key] === undefined || (Array.isArray(answers[key]) && (answers[key] as Array<unknown>).length === 0)) return false
    }
    if (section.dictation && dictationInputs.some(d => !d.trim())) return false
    return true
  }, [section, answers, dictationInputs])

  const previewVocab = useMemo(() => {
    if (section.vocabulary) return section.vocabulary.map(v => ({ ...v, example: v.example || '' }))
    return extractVocabulary(segments).map(word => ({ word, definition: '...', example: '' }))
  }, [section.vocabulary, segments])

  const uniqueQuestionCount = useMemo(() => {
    let answeredCount = 0
    for (const q of section.questions) {
      const key = getQuestionKey(q)
      if (answers[key] !== undefined && !(Array.isArray(answers[key]) && (answers[key] as Array<unknown>).length === 0)) answeredCount++
    }
    return { answered: answeredCount, total: section.questions.length + (section.dictation?.length || 0) }
  }, [section, answers])

  return (
    <div className="space-y-5">
      {/* ═══ PHASE INDICATOR ═══ */}
      <div className="flex items-center gap-2">
        {(['pre', 'listen', 'post', 'result'] as const).map((p, i) => {
          const isActive = phase === p
          const isPast = ['pre', 'listen', 'post', 'result'].indexOf(phase) > i
          return (
            <div key={p} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-1.5 ${isActive ? 'text-primary-600 dark:text-primary-400' : isPast ? 'text-green-600 dark:text-green-400' : 'text-gray-300 dark:text-gray-600'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isActive ? 'bg-primary-600 text-white' : isPast ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                  {isPast ? '✓' : i + 1}
                </div>
                <span className="text-xs font-semibold hidden sm:inline">
                  {p === 'pre' ? t('dailyListening.preparing') : p === 'listen' ? t('dailyListening.listening') : p === 'post' ? t('dailyListening.exercises') : t('dailyListening.result')}
                </span>
              </div>
              {i < 3 && <div className={`flex-1 h-px ${isPast ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          )
        })}
      </div>

      {/* ═══ PRE-LISTENING ═══ */}
      {phase === 'pre' && (
        <ListeningPrePhase
          section={section}
          previewVocab={previewVocab}
          prediction={prediction}
          setPrediction={setPrediction}
          onStart={() => setPhase('listen')}
        />
      )}

      {/* ═══ LISTENING ═══ */}
      {phase === 'listen' && (
        <div className="space-y-4">
          <ListeningPlayer
            section={section}
            segments={segments}
            uniqueSpeakers={uniqueSpeakers}
            speakerColorMap={speakerColorMap}
            playing={playing}
            paused={paused}
            activeSpeaker={activeSpeaker}
            activeSegIdx={activeSegIdx}
            playCount={playCount}
            speed={speed}
            setSpeed={setSpeed}
            playSpeech={playSpeech}
            togglePause={togglePause}
            stopSpeech={stopSpeech}
            playSegment={playSegment}
            showTranscript={showTranscript}
            setShowTranscript={setShowTranscript}
          />

          {/* Step navigation */}
          <div className="flex justify-between items-center pt-2">
            <p className="text-xs text-gray-400">
              {listenStep === 'first' ? t('dailyListening.stepFirst') : t('dailyListening.stepQuestions')}
            </p>
            <div className="flex gap-2">
              {listenStep === 'first' ? (
                <button onClick={() => setPhase('post')} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                  {t('dailyListening.goToQuestions')} <ChevronRight size={14} />
                </button>
              ) : (
                <button onClick={() => setListenStep('first')} className="btn-ghost py-2 px-4 text-sm flex items-center gap-1.5">
                  <ChevronLeft size={14} /> {t('dailyListening.relisten')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ QUESTIONS (Post-Listening) ═══ */}
      {phase === 'post' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-primary-600">🎯</span>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t('dailyListening.comprehensionTitle')}</h3>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {t('dailyListening.answeredCount', { answered: String(uniqueQuestionCount.answered), total: String(uniqueQuestionCount.total) })}
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1">
            {section.questions.map(q => {
              const key = getQuestionKey(q)
              const isAnswered = answers[key] !== undefined && !(Array.isArray(answers[key]) && (answers[key] as Array<unknown>).length === 0)
              return <div key={q.id} className={`h-1.5 flex-1 rounded-full transition-all ${isAnswered ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            })}
            {section.dictation?.map((_, i) => (
              <div key={`dict-${i}`} className={`h-1.5 flex-1 rounded-full transition-all ${dictationInputs[i]?.trim() ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>

          {/* Audio replay button */}
          <button onClick={playSpeech} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-all">
            {t('dailyListening.replayAudio', { speed: String(speed) })}
          </button>

          {/* Questions */}
          {!submitted ? (
            <div className="space-y-4">
              {section.questions.map((q, i) => (
                <ListeningQuestionCard
                  key={q.id}
                  q={q}
                  index={i}
                  isSubmitted={false}
                  userAns={answers[getQuestionKey(q)]}
                  shuffledOptions={shuffledMap.get(q.id)?.options}
                  shuffledCorrectIndex={shuffledMap.get(q.id)?.correctIndex}
                  onChoice={handleChoice}
                  onMultiChoice={handleMultiChoice}
                  onFillBlank={handleFillBlank}
                  onOrdering={handleOrdering}
                  onTrueFalse={handleTrueFalse}
                  onMatching={handleMatching}
                />
              ))}

              {/* Dictation section */}
              {section.dictation && section.dictation.length > 0 && (
                <div className="card border-primary-200 dark:border-primary-800">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-primary-600">🎧</span>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t('dailyListening.dictation')}</h3>
                    <span className="text-xs text-gray-400">{t('dailyListening.dictationHint')}</span>
                  </div>
                  <div className="space-y-3">
                    {section.dictation.map((d, i) => {
                      const seg = segments[d.startLine]
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <button onClick={() => playSegment(d.startLine)}
                            className="mt-1.5 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-primary-600 shrink-0">
                            ▶
                          </button>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-1">{seg?.speaker || t('dailyListening.lineNumber', { n: String(d.startLine + 1) })}</p>
                            <input
                              type="text"
                              value={dictationInputs[i] || ''}
                              onChange={e => handleDictation(i, e.target.value)}
                              placeholder={t('dailyListening.dictationPlaceholder')}
                              className="input text-sm py-2"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Discussion questions */}
              {section.discussion && section.discussion.length > 0 && (
                <div className="card bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-amber-600">⚠️</span>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t('dailyListening.discussion')}</h3>
                  </div>
                  {section.discussion.map((d, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{d.question}</p>
                      {d.hints.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {d.hints.map((h, j) => (
                            <span key={j} className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">{h}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button onClick={handleSubmit}
                disabled={!allAnswered}
                className={`btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {t('dailyListening.checkAnswers')}
                {addXP && ` (+${((section.questions.length + (section.dictation?.length || 0)) * 10)} XP)`}
              </button>
            </div>
          ) : (
            /* ═══ RESULTS ═══ */
            <div className="space-y-4">
              <ListeningResults
                score={score}
                total={total}
                dictationCorrect={dictationInputs.filter((d, i) => {
                  const seg = segments[section.dictation?.[i]?.startLine ?? 0]
                  return seg && d.toLowerCase().trim() === seg.text.toLowerCase().trim()
                }).length}
                dictationTotal={section.dictation?.length ?? 0}
                timeTaken={playCount * 30}
                xpEarned={score * 10}
                onRetry={handleRetry}
              />

              {/* Answer review */}
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dailyListening.answerReview')}</p>
              {section.questions.map((q, i) => (
                <ListeningQuestionCard
                  key={q.id}
                  q={q}
                  index={i}
                  isSubmitted={true}
                  userAns={answers[getQuestionKey(q)]}
                  shuffledOptions={shuffledMap.get(q.id)?.options}
                  shuffledCorrectIndex={shuffledMap.get(q.id)?.correctIndex}
                  onChoice={handleChoice}
                  onMultiChoice={handleMultiChoice}
                  onFillBlank={handleFillBlank}
                  onOrdering={handleOrdering}
                  onTrueFalse={handleTrueFalse}
                  onMatching={handleMatching}
                />
              ))}

              {/* Dictation review */}
              {section.dictation && dictationInputs.some(d => d.trim()) && (
                <div className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-primary-600">🎧</span>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dailyListening.dictationResults')}</p>
                  </div>
                  <div className="space-y-2">
                    {section.dictation.map((d, i) => {
                      const seg = segments[d.startLine]
                      if (!dictationInputs[i]?.trim()) return null
                      const isCorrect = dictationInputs[i]?.toLowerCase().trim() === seg?.text.toLowerCase().trim()
                      return (
                        <div key={i} className={`flex items-start gap-2 p-2 rounded-xl ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                          {isCorrect ? <span className="text-green-500 text-xs mt-0.5 shrink-0">✅</span> : <span className="text-red-500 text-xs mt-0.5 shrink-0">❌</span>}
                          <div className="flex-1">
                            <div className={`text-sm ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300 line-through'}`}>{dictationInputs[i]}</div>
                            {!isCorrect && <div className="text-sm text-green-700 dark:text-green-400 font-semibold">{seg?.text}</div>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-2">
            <button onClick={() => setPhase('listen')} className="btn-ghost py-2 px-4 text-sm flex items-center gap-1.5">
              <ChevronLeft size={14} /> {t('dailyListening.backToListen')}
            </button>
            {submitted && pct >= 60 && (
              <button onClick={() => setPhase('result')} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                {t('dailyListening.nextPhase')} <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══ RESULT SUMMARY ═══ */}
      {phase === 'result' && (
        <div className="card text-center py-8">
          <div className="text-5xl mb-4">{pct === 100 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('dailyListening.resultComplete')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {pct >= 80 ? t('dailyListening.resultExcellent') : t('dailyListening.resultGood')}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`text-3xl font-bold font-mono ${pct === 100 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
              {score}/{total}
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-sm text-gray-400">
              <p>{t('dailyListening.percentCorrect', { pct: String(Math.round(pct)) })}</p>
              <p>{t('dailyListening.listenedCount', { count: String(playCount) })}</p>
            </div>
          </div>
          <button onClick={() => { handleRetry(); setPhase('pre'); setListenStep('first'); setPlayCount(0) }}
            className="btn-secondary text-sm py-2 px-5 inline-flex items-center gap-2">
            <RotateCcw size={14} /> {t('dailyListening.restartFromStart')}
          </button>
        </div>
      )}
    </div>
  )
}
