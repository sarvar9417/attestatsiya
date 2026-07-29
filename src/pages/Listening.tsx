import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Headphones, ChevronLeft, ChevronRight, Eye, EyeOff,
  CheckCircle2, Clock, BookOpen, Mic,
} from 'lucide-react'
import { useI18n } from '../i18n'
import { type ListeningLesson } from '@/data/listeningLessons'
import { fetchListeningLessons, saveListeningResult } from '@/services/listeningService'
import { useStore } from '@/store/useStore'
import { monitoring } from '@/lib/monitoring'
import { supabase } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase        = 'select' | 'lesson' | 'exercises' | 'result'
type Tab          = 'watch' | 'transcript' | 'shadowing'
type ExerciseStep = 0 | 1 | 2   // 0 = fill-blank, 1 = T/F, 2 = summary

const LEVEL_CLR: Record<string, string> = {
  'B1':  'badge-b1',
  'B1+': 'badge-b1',
  'B2':  'badge-b2',
}

// ── Score helpers ─────────────────────────────────────────────────────────────

function normalize(s: string) { return s.toLowerCase().trim().replace(/[.,!?]/g, '') }

// ── Sub-components ────────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: string }) {
  return <span className={`badge ${LEVEL_CLR[level] ?? 'badge-primary'}`}>{level}</span>
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Listening() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const fromSkills = location.state?.from === '/skills'
  const { addXP, updateSkillProgress } = useStore()

  const [phase,   setPhase]   = useState<Phase>('select')
  const [lesson,  setLesson]  = useState<ListeningLesson | null>(null)
  const [tab,     setTab]     = useState<Tab>('watch')

  // Shadowing
  const [segIdx,      setSegIdx]      = useState(0)
  const [segRevealed, setSegRevealed] = useState(false)

  // YouTube
  const [ytError, setYtError] = useState(false)
  const [audioOnly, setAudioOnly] = useState(false)

  // Exercises
  const [exStep,       setExStep]       = useState<ExerciseStep>(0)
  const [fillAnswers,  setFillAnswers]  = useState<string[]>([])
  const [tfAnswers,    setTfAnswers]    = useState<(boolean | null)[]>([])
  const [summaryText,  setSummaryText]  = useState('')
  const [, setSubmitted] = useState(false)

  // Audio tracking
  const [playCount, setPlayCount] = useState(0)

  // Result
  const [fillCorrect, setFillCorrect] = useState(0)
  const [tfCorrect,   setTfCorrect]   = useState(0)
  const [lessons,     setLessons]     = useState<ListeningLesson[]>([])
  const [lessonsLoading, setLessonsLoading] = useState(true)

  useEffect(() => {
    fetchListeningLessons().then((data) => {
      setLessons(data)
      setLessonsLoading(false)
    }).catch((e) => {
      monitoring.captureMessage('fetchListeningLessons failed: ' + (e instanceof Error ? e.message : String(e)), 'error')
      setLessonsLoading(false)
    })
  }, [])

  // ── Helpers ────────────────────────────────────────────────────────────────

  function openLesson(l: ListeningLesson) {
    setLesson(l)
    setTab('watch')
    setSegIdx(0)
    setSegRevealed(false)
    setPlayCount(0)
    setExStep(0)
    setFillAnswers(Array(l.fillBlanks.length).fill(''))
    setTfAnswers(Array(l.trueFalse.length).fill(null))
    setSummaryText('')
    setSubmitted(false)
    setPhase('lesson')
  }

  function goToExercises() {
    setExStep(0)
    setPhase('exercises')
  }

  function submitExercises() {
    if (!lesson) return
    const fc = lesson.fillBlanks.filter((q, i) =>
      normalize(fillAnswers[i] ?? '') === normalize(q.answer)
    ).length
    const tc = lesson.trueFalse.filter((q, i) => tfAnswers[i] === q.answer).length
    const summaryBonus = summaryText.trim().split(/\s+/).length >= 30 ? 1 : 0

    setFillCorrect(fc)
    setTfCorrect(tc)
    setSubmitted(true)

    const xp = fc * 10 + tc * 6 + summaryBonus * 20
    addXP(xp)
    updateSkillProgress('todayListeningPct',
      Math.round(((fc + tc + summaryBonus) / (lesson.fillBlanks.length + lesson.trueFalse.length + 1)) * 100)
    )
    // Save to Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) {
        saveListeningResult({
          userId:      session.user.id,
          lessonId:    lesson.id,
          lessonTitle: lesson.title,
          fillCorrect: fc,
          fillTotal:   lesson.fillBlanks.length,
          tfCorrect:   tc,
          tfTotal:     lesson.trueFalse.length,
          summaryDone: summaryBonus === 1,
          xpEarned:    xp,
          playCount,
        })
      }
    })
    setPhase('result')
  }

  // ── SELECT phase ───────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          {fromSkills && (
            <button onClick={() => navigate('/skills')} className="btn-ghost p-2 rounded-xl -ml-2" aria-label={t('common.backToSkills')}>
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Headphones size={20} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('listening.title')}</h1>
            <p className="text-xs text-gray-500">{t('listening.subtitle')}</p>
          </div>
        </div>

        {lessonsLoading ? (
          <div className="flex items-center justify-center min-h-[200px] text-gray-400 animate-pulse">{t('listening.loading')}</div>
        ) : (
          <div className="space-y-3">
            {lessons.map((l) => (
              <button
                key={l.id}
                onClick={() => openLesson(l)}
                className="w-full card text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <LevelBadge level={l.level} />
                      <span className="text-xs text-gray-400">{l.source}</span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{l.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{l.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} /> {l.duration}</span>
                      <span className="flex items-center gap-1"><BookOpen size={11} /> {t('listening.exercisesCount', { count: String(l.fillBlanks.length + l.trueFalse.length + 1) })}</span>
                      <span className="flex items-center gap-1"><Mic size={11} /> {t('listening.hasShadowing')}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── RESULT phase ──────────────────────────────────────────────────────────

  if (phase === 'result' && lesson) {
    const total   = lesson.fillBlanks.length + lesson.trueFalse.length + 1
    const correct = fillCorrect + tfCorrect + (summaryText.trim().split(/\s+/).length >= 30 ? 1 : 0)
    const pct     = Math.round((correct / total) * 100)
    const xp      = fillCorrect * 10 + tfCorrect * 6 + (summaryText.trim().split(/\s+/).length >= 30 ? 20 : 0)

    return (
      <div className="p-3 sm:p-6 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('listening.resultTitle')}</h2>
        <p className="text-sm text-gray-500 mb-6 line-clamp-1">{lesson.title}</p>

        <div className="flex gap-3 mb-8">
          <div className="card text-center px-6 py-4">
            <p className="text-3xl font-bold text-orange-500">{pct}%</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('listening.resultCorrect')}</p>
          </div>
          <div className="card text-center px-6 py-4">
            <p className="text-3xl font-bold text-primary-600">{xp}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('listening.resultXPLabel')}</p>
          </div>
        </div>

        <div className="w-full space-y-2 mb-6 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">{t('listening.resultFillBlank')}</span>
            <span className="font-semibold">{fillCorrect}/{lesson.fillBlanks.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('listening.resultTrueFalse')}</span>
            <span className="font-semibold">{tfCorrect}/{lesson.trueFalse.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('listening.resultSummary')}</span>
            <span className="font-semibold">{summaryText.trim().split(/\s+/).length >= 30 ? '✓' : '—'}</span>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <button onClick={() => setPhase('select')} className="btn-secondary flex-1 text-sm">
            {t('listening.selectLesson')}
          </button>
          <button onClick={() => { setPhase('lesson'); setTab('watch') }} className="btn-primary flex-1 text-sm">
            {t('listening.reviewButton')}
          </button>
        </div>
      </div>
    )
  }

  // ── EXERCISES phase ───────────────────────────────────────────────────────

  if (phase === 'exercises' && lesson) {
    const stepLabels = [t('listening.fillBlanks'), t('listening.trueFalse'), t('listening.summary')]

    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          <button onClick={() => setPhase('lesson')} className="btn-ghost p-2 rounded-xl">
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">{lesson.title}</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('listening.exerciseTitle')}</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-1 mb-6">
          {stepLabels.map((_lbl, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full">
              <div className={`h-full rounded-full ${i <= exStep ? 'bg-orange-400' : 'bg-gray-100 dark:bg-gray-700'}`} />
            </div>
          ))}
          <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
            {exStep + 1}/3: {stepLabels[exStep]}
          </span>
        </div>

        {/* Step 0: Fill-blank */}
        {exStep === 0 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {t('listening.fillBlanks')}
            </p>
            {lesson.fillBlanks.map((q, i) => {
              const parts = q.sentence.split(/_{3,}/)
              return (
                <div key={q.id} className="card">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed flex flex-wrap items-center gap-1">
                      <span>{parts[0]}</span>
                      <input
                        className="input py-0.5 px-2 text-sm w-32 inline-block"
                        placeholder="..."
                        value={fillAnswers[i] ?? ''}
                        onChange={(e) => {
                          const next = [...fillAnswers]
                          next[i] = e.target.value
                          setFillAnswers(next)
                        }}
                      />
                      {parts[1] && <span>{parts[1]}</span>}
                    </p>
                  </div>
                </div>
              )
            })}
            <button
              onClick={() => setExStep(1)}
              className="w-full btn-primary text-sm mt-2"
            >
              {t('listening.nextButton')}
            </button>
          </div>
        )}

        {/* Step 1: True/False */}
        {exStep === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {t('listening.trueFalse')}
            </p>
            {lesson.trueFalse.map((q, i) => (
              <div key={q.id} className="card">
                <div className="flex items-start gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{q.statement}</p>
                </div>
                <div className="flex gap-2 ml-8">
                  {([true, false] as const).map((val) => (
                    <button
                      key={String(val)}
                      onClick={() => {
                        const next = [...tfAnswers]
                        next[i] = val
                        setTfAnswers(next)
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border transition-all
                        ${tfAnswers[i] === val
                          ? val ? 'bg-green-100 border-green-300 text-green-700'
                                : 'bg-red-100 border-red-300 text-red-700'
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                      {val ? 'T — ' + t('listening.trueLabel') : 'F — ' + t('listening.falseLabel')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <button onClick={() => setExStep(0)} className="btn-secondary text-sm flex-1">{t('listening.backButton')}</button>
              <button
                onClick={() => setExStep(2)}
                disabled={tfAnswers.includes(null)}
                className="btn-primary text-sm flex-1"
              >
                {t('listening.nextButton')}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Summary */}
        {exStep === 2 && (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">{t('listening.summary')}</p>
              <p className="text-xs text-gray-400">{t('listening.summaryHint')}</p>
            </div>
            <textarea
              className="input min-h-[140px] resize-none text-sm leading-relaxed"
              placeholder={`"${lesson.title}" mavzusida o'rganganlaringizni qisqacha yozing...`}
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
            />
            <div className="flex items-center justify-between text-xs">
              <span className={`font-medium ${summaryText.trim().split(/\s+/).filter(Boolean).length >= 30 ? 'text-green-600' : 'text-gray-400'}`}>
                {summaryText.trim().split(/\s+/).filter(Boolean).length} / 30 {t('common.words')}
              </span>
              {summaryText.trim().split(/\s+/).filter(Boolean).length >= 30 && (
                <span className="text-green-600 font-medium">{t('listening.summaryGood')}</span>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setExStep(1)} className="btn-secondary text-sm flex-1">{t('listening.backButton')}</button>
              <button
                onClick={submitExercises}
                disabled={summaryText.trim().length < 10}
                className="btn-primary text-sm flex-1"
              >
                {t('listening.submitButton')}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── LESSON phase ──────────────────────────────────────────────────────────

  if (!lesson) return null

  const segment    = lesson.transcript[segIdx]
  const iframeSrc  = `https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1&enablejsapi=1`
  const shadowSrc  = segment
    ? `https://www.youtube.com/embed/${lesson.youtubeId}?start=${segment.startSec}&rel=0&modestbranding=1&autoplay=1`
    : ''

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <button onClick={() => setPhase('select')} className="btn-ghost p-2 rounded-xl">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <LevelBadge level={lesson.level} />
            <span className="text-xs text-gray-400">{lesson.source}</span>
          </div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{lesson.title}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4 gap-1">
        {([
          { id: 'watch',      label: t('listening.tabWatch') },
          { id: 'transcript', label: t('listening.tabTranscript') },
          { id: 'shadowing',  label: t('listening.tabShadowing') },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
              tab === t.id ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
        {!lesson.audioUrl && (
          <button
            onClick={() => setAudioOnly(!audioOnly)}
            className={`text-xs font-semibold py-1.5 px-2 rounded-lg transition-all ${
              audioOnly ? 'bg-b1-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
            title={audioOnly ? t('listening.videoMode') : t('listening.audioOnlyMode')}
          >
            {audioOnly ? '🔊' : '🎬'}
          </button>
        )}
      </div>

      {/* ── Watch tab ── */}
      {tab === 'watch' && (
        <div className="space-y-3">
          {/* Audio player for A1-A2 lessons with professional audio, YouTube for others */}
          {lesson.audioUrl ? (
            <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">🎧</span>
                <div>
                  <p className="text-sm font-semibold">{lesson.title}</p>
                  <p className="text-xs text-white/70">{t('listening.professionalAudio')}</p>
                </div>
                <span className="ml-auto bg-white/20 text-xs font-semibold px-2 py-1 rounded-full">{lesson.duration}</span>
              </div>
              <audio
                controls
                className="w-full [&::-webkit-media-controls-panel]:bg-emerald-600 [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-time-remaining-display]:text-white"
                style={{ height: '48px', borderRadius: '8px' }}
                onPlay={() => setPlayCount((c) => c + 1)}
              >
                <source src={lesson.audioUrl} type="audio/mpeg" />
                {t('listening.audioNotSupported')}
              </audio>
              <div className="flex items-center justify-between mt-3 text-xs text-white/60">
                <span>{playCount > 0 ? `${t('listening.listenedTimes', { count: String(playCount) })}` : t('listening.listenAndFollow')}</span>
                <a
                  href={`https://www.youtube.com/watch?v=${lesson.youtubeId}`}
                  target="_blank" rel="noopener noreferrer"
                  className="underline hover:text-white transition-colors"
                >
                  {t('listening.openYouTube')}
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden aspect-video bg-black relative">
              {ytError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white bg-gray-900 p-4 text-center">
                  <span className="text-3xl">⚠️</span>
                  <p className="text-sm font-medium">{t('listening.videoError')}</p>
                  <p className="text-xs text-gray-400">
                    <a href={`https://www.youtube.com/watch?v=${lesson.youtubeId}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                      {t('listening.openYouTube')}
                    </a>
                  </p>
                  <button onClick={() => setYtError(false)} className="text-xs text-b1-300 underline mt-1">
                    {t('listening.retryVideo')}
                  </button>
                </div>
              ) : audioOnly ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-b1-900 to-gray-900 p-6">
                  <span className="text-5xl">🎧</span>
                  <p className="text-white text-sm font-medium">{lesson.title}</p>
                  <a
                    href={`https://www.youtube.com/watch?v=${lesson.youtubeId}`}
                    target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs rounded-xl transition-colors"
                  >
                    {t('listening.openYouTube')}
                  </a>
                </div>
              ) : (
                <iframe
                  src={iframeSrc}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={lesson.title}
                />
              )}
            </div>
          )}

          {/* Key vocabulary */}
          <div className="card">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('listening.keyVocabulary')}</p>
            <div className="space-y-1.5">
              {lesson.vocabulary.map((v) => (
                <div key={v.word} className="flex gap-2 text-sm">
                  <span className="font-semibold text-orange-700 flex-shrink-0">{v.word}</span>
                  <span className="text-gray-500">— {v.definition}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={goToExercises}
            className="w-full btn-primary text-sm flex items-center justify-center gap-2"
          >
            {t('listening.goToExercises')} <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ── Transcript tab ── */}
      {tab === 'transcript' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 mb-1">
            {t('listening.transcriptHint')}
          </p>
          {lesson.transcript.map((line, i) => (
            <TranscriptCard key={i} line={line} />
          ))}
          <button
            onClick={goToExercises}
            className="w-full btn-primary text-sm mt-3 flex items-center justify-center gap-2"
          >                {t('listening.goToExercises')} <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ── Shadowing tab ── */}
      {tab === 'shadowing' && (
        <div className="space-y-3">
          {/* Progress */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              {t('listening.shadowingSegment', { current: String(segIdx + 1), total: String(lesson.transcript.length) })}
            </span>
            <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full transition-all"
                style={{ width: `${((segIdx + 1) / lesson.transcript.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Iframe for this segment */}
          <div className="rounded-xl overflow-hidden aspect-video bg-black">
            <iframe
              key={`shadow-${segIdx}`}
              src={shadowSrc}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Segment ${segIdx + 1}`}
            />
          </div>

          {/* Segment text */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              {segment.speaker && (
                <span className="text-xs font-semibold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                  {segment.speaker}
                </span>
              )}
              <button
                onClick={() => setSegRevealed((v) => !v)}
                className="btn-ghost py-1 px-2 text-xs flex items-center gap-1 ml-auto"
              >
                {segRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                {segRevealed ? t('listening.shadowingHide') : t('listening.shadowingReveal')}
              </button>
            </div>
            {segRevealed ? (
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{segment.text}</p>
            ) : (
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-400">{t('listening.shadowingHint')}</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => { setSegIdx((i) => Math.max(0, i - 1)); setSegRevealed(false) }}
              disabled={segIdx === 0}
              className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1"
            >
              <ChevronLeft size={15} /> {t('listening.shadowingPrev')}
            </button>
            {segIdx < lesson.transcript.length - 1 ? (
              <button
                onClick={() => { setSegIdx((i) => i + 1); setSegRevealed(false) }}
                className="btn-primary flex-1 text-sm flex items-center justify-center gap-1"
              >
                {t('listening.shadowingNext')} <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={goToExercises}
                className="btn-primary flex-1 text-sm"
              >
                {t('listening.goToExercises')} ✓
              </button>
            )}
          </div>

          {/* Shadowing tip */}
          <div className="card bg-orange-50 border-orange-100">
            <p className="text-xs text-orange-700 font-medium">
              {t('listening.shadowingTip')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Transcript card (collapsible) ─────────────────────────────────────────────

function TranscriptCard({ line }: { line: { startSec: number; text: string; speaker?: string } }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const mins = Math.floor(line.startSec / 60)
  const secs = line.startSec % 60

  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="w-full card text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors py-3"
    >
      <div className="flex items-start gap-3">
        <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5 font-mono">
          {mins}:{String(secs).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          {line.speaker && (
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
              {line.speaker}:{' '}
            </span>
          )}
          <span className={`text-sm ${open ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 line-clamp-1'}`}>
            {line.text}
          </span>
        </div>
        <div className={`flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}>
          <ChevronRight size={14} className="text-gray-300" />
        </div>
      </div>

      {open && (
        <div className="mt-2 ml-10 flex items-start gap-1">
          {/* Inline True/False result icon reuse */}
          <CheckCircle2 size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 italic">
            {t('listening.transcriptTime', { min: String(Math.floor(line.startSec / 60)), sec: String(line.startSec % 60).padStart(2, '0') })}
          </p>
        </div>
      )}
    </button>
  )
}
