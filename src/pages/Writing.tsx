import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PenLine, Clock, ChevronDown, ChevronUp, ChevronLeft, Loader2, Target, BookOpen, Lightbulb, GitBranch } from 'lucide-react'
import { useNavigationGuard } from '../hooks/useNavigationGuard'
import WritingHistory from '../components/writing/WritingHistory'
import { TYPE_LABEL, TYPE_COLOR } from '@/data/writingPrompts'
import { fetchWritingPrompts, getDailyWritingPrompt, saveWritingResult } from '@/services/writingService'
import type { WritingPrompt } from '@/services/writingService'
import { evaluateWriting, analyzeWritingIELTS, analyzeWritingErrors, type WritingError } from '@/lib/claude'
import { useI18n } from '../i18n'
import Breadcrumb from '../components/ui/Breadcrumb'
import { useStore } from '@/store/useStore'
import { supabase } from '@/lib/supabase'
import { monitoring } from '@/lib/monitoring'
import { WritingSkeleton } from '../components/ui/PageSkeleton'

// ── Types ─────────────────────────────────────────────────────────────────────

type View = 'write' | 'result'

interface WritingScores {
  taskAchievement: number
  coherence:       number
  vocabulary:      number
  grammar:         number
}

function parseScores(text: string): WritingScores {
  const get = (key: string) =>
    Math.min(10, Math.max(0, parseInt(text.match(new RegExp(`${key}:\\s*(\\d+)`))?.[1] ?? '0')))
  return {
    taskAchievement: get('TASK_ACHIEVEMENT'),
    coherence:       get('COHERENCE'),
    vocabulary:      get('VOCABULARY'),
    grammar:         get('GRAMMAR'),
  }
}

function parseFeedback(text: string): string {
  return (text.split(/FEEDBACK:/)[1] ?? '').split(/IMPROVED:/)[0].trim()
}

function parseImproved(text: string): string {
  return (text.split(/IMPROVED:/)[1] ?? '').trim()
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// ── Score card ────────────────────────────────────────────────────────────────

function ScoreCard({ label: lbl, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="card text-center py-4">
      <p className={`text-2xl font-bold ${color}`}>
        {score}<span className="text-sm font-normal text-gray-400">/10</span>
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{lbl}</p>
      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Writing() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const fromSkills = location.state?.from === '/skills'
  const { addXP, updateSkillProgress, currentDay, currentLevel } = useStore()

  const [prompts,       setPrompts]       = useState<WritingPrompt[]>([])
  const [promptsLoaded, setPromptsLoaded] = useState(false)

  useEffect(() => {
    fetchWritingPrompts().then((data) => {
      setPrompts(data)
      setPromptsLoaded(true)
    })
  }, [])

  const prompt = promptsLoaded ? getDailyWritingPrompt(currentDay, prompts) : null

  const [view,         setView]         = useState<View>('write')
  // Auto-save: promptga xos key bilan draft localStorage dan tiklanadi
  const draftKey = `writing-draft-day-${currentDay}`
  const [essay,        setEssay]        = useState(() => {
    try { return localStorage.getItem(draftKey) ?? '' }
    catch (e) { monitoring.captureMessage('Writing draft load failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'); return '' }
  })
  const [timer,        setTimer]        = useState(0)
  const [timerActive,  setTimerActive]  = useState(false)
  const [evaluating,   setEvaluating]   = useState(false)
  const [streamText,   setStreamText]   = useState('')
  const [scores,       setScores]       = useState<WritingScores | null>(null)
  const [feedback,     setFeedback]     = useState('')
  const [improved,     setImproved]     = useState('')
  const [showImproved, setShowImproved] = useState(false)
  const [ieltsMode,    setIeltsMode]    = useState(false)
  const [errors,       setErrors]       = useState<WritingError[]>([])
  const [errorsLoading, setErrorsLoading] = useState(false)
  const [showRubric,    setShowRubric]    = useState(false)

  useNavigationGuard(view === 'write' && essay.length > 0)

  const wc      = wordCount(essay)
  const minWords = 150
  const canSubmit = wc >= minWords && !evaluating

  // Auto-save: har 5 soniyada draft saqlanadi
  useEffect(() => {
    if (view !== 'write') return
    const id = setInterval(() => {
      try {
        if (essay.trim()) {
          localStorage.setItem(draftKey, essay)
        } else {
          localStorage.removeItem(draftKey)
        }
      } catch { /* quota exceeded — o'tkazib yuboramiz */ }
    }, 5000)
    return () => clearInterval(id)
  }, [essay, view, draftKey])

  // Timer counts up while writing
  useEffect(() => {
    if (!timerActive) return
    const id = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [timerActive])

  // Auto-start timer on first keystroke
  useEffect(() => {
    if (essay.length > 0 && !timerActive && view === 'write') {
      setTimerActive(true)
    }
  }, [essay, timerActive, view])

  function formatTimer(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  async function handleSubmit() {
    if (!canSubmit || !prompt) return
    // Submit bo'lganda draft o'chiriladi
    try { localStorage.removeItem(draftKey) } catch { /* ignore */ }
    setEvaluating(true)
    setTimerActive(false)
    setStreamText('')
    let full = ''

    // Aniq xatolar tahlilini parallel ishga tushiramiz (alohida JSON chaqiruv)
    setErrors([])
    setErrorsLoading(true)
    analyzeWritingErrors(prompt.prompt, essay, currentLevel || 'B1')
      .then((errs) => setErrors(errs))
      .catch((e) => monitoring.captureMessage('analyzeWritingErrors failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
      .finally(() => setErrorsLoading(false))

    const onDelta = (token: string) => { full += token; setStreamText(full) }
    const onDone = (text: string) => {
      if (ieltsMode) {
        // Parse IELTS band scores (1-9 scale)
        const s = parseScores(text) // still parses TASK_ACHIEVEMENT etc
        const f = parseFeedback(text)
        const imp = parseImproved(text)
        setScores(s)
        setFeedback(f)
        setImproved(imp)
        const avg = Math.round((s.taskAchievement + s.coherence + s.vocabulary + s.grammar) / 4)
        addXP(avg * 4)
        updateSkillProgress('todayWritingPct', avg * 10)
        // Save to Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user.id) {
            saveWritingResult({
              userId:    session.user.id,
              day:       currentDay,
              prompt:    prompt.prompt,
              essay,
              wordCount: wc,
              feedback:  f,
              avgScore:  avg,
              xpEarned:  avg * 4,
            }).catch(() => {
              monitoring.captureMessage('saveWritingResult failed (non-critical)', 'warn')
            })
          }
        }).catch(() => {
          monitoring.captureMessage('getSession failed (non-critical)', 'warn')
        })
        setEvaluating(false)
        setView('result')
      } else {
        const s = parseScores(text)
        const f = parseFeedback(text)
        const imp = parseImproved(text)
        setScores(s)
        setFeedback(f)
        setImproved(imp)
        const avg = Math.round((s.taskAchievement + s.coherence + s.vocabulary + s.grammar) / 4)
        addXP(avg * 4)
        updateSkillProgress('todayWritingPct', avg * 10)
        // Save to Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user.id) {
            saveWritingResult({
              userId:    session.user.id,
              day:       currentDay,
              prompt:    prompt.prompt,
              essay,
              wordCount: wc,
              feedback:  f,
              avgScore:  avg,
              xpEarned:  avg * 4,
            }).catch(() => {
              monitoring.captureMessage('saveWritingResult failed (non-critical)', 'warn')
            })
          }
        }).catch(() => {
          monitoring.captureMessage('getSession failed (non-critical)', 'warn')
        })
        setEvaluating(false)
        setView('result')
      }
    }
    const onError = () => setEvaluating(false)

    if (ieltsMode) {
      analyzeWritingIELTS(prompt.prompt, essay, onDelta, onDone, onError)
    } else {
      evaluateWriting(prompt.prompt, essay, currentLevel || 'B1', onDelta, onDone, onError)
    }
  }

  // ── RESULT view ─────────────────────────────────────────────────────────

  if (view === 'result' && scores) {
    const avg = Math.round((scores.taskAchievement + scores.coherence + scores.vocabulary + scores.grammar) / 4)

    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <Breadcrumb items={[
          { label: t('breadcrumb.home'), path: '/' },
          { label: t('breadcrumb.writing') },
        ]} />
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div className="w-10 h-10 bg-b2-100 rounded-xl flex items-center justify-center">
            <PenLine size={20} className="text-b2-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('writing.resultTitle')}</h1>
            <p className="text-xs text-gray-500">{t('writing.wordCount', { count: String(wc), limit: '' })} · {formatTimer(timer)}</p>
          </div>
        </div>

        {/* Overall */}
        <div className="card bg-gradient-to-r from-b2-50 to-primary-50 border-b2-100 text-center mb-4">              <p className="text-xs text-gray-500 mb-1">{t('writing.overallScore')}</p>
          <p className="text-4xl font-bold text-b2-600">
            {avg}<span className="text-xl font-normal text-gray-400">/10</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{t('writing.xpEarned', { xp: String(avg * 4) })}</p>
          {/* IELTS band mapping */}
          <p className="text-xs text-b2-400 mt-1">
            {ieltsMode
              ? `${t('writing.ieltsBandLabel', { band: avg >= 9 ? '9.0' : avg >= 8 ? '8.0' : avg >= 7 ? '7.0' : avg >= 6 ? '6.0' : avg >= 5 ? '5.0' : avg >= 4 ? '4.0' : t('writing.belowIELTS') })}`
              : avg >= 10 ? t('writing.ieltsBand9') : avg >= 9 ? t('writing.ieltsBand85') : avg >= 8 ? t('writing.ieltsBand75') : avg >= 7 ? t('writing.ieltsBand65') : avg >= 6 ? t('writing.ieltsBand55') : avg >= 5 ? t('writing.ieltsBand45') : t('writing.belowIELTS')
            }
          </p>
        </div>

        {/* Score grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          <ScoreCard label={t('writing.scoreTaskAchievement')} score={scores.taskAchievement} color="text-primary-600" />
          <ScoreCard label={t('writing.scoreCoherence')}         score={scores.coherence}       color="text-b1-600"     />
          <ScoreCard label={t('writing.scoreVocabulary')}        score={scores.vocabulary}      color="text-orange-600" />
          <ScoreCard label={t('writing.scoreGrammar')}           score={scores.grammar}         color="text-b2-600"     />
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="card bg-primary-50 border-primary-100 mb-4">
            <p className="text-xs font-semibold text-primary-700 mb-1">{t('writing.feedback')}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
          </div>
        )}

        {/* Aniq xatolar — Grammarly uslubi */}
        {(errorsLoading || errors.length > 0) && (
          <div className="card mb-4 border-rose-100">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-sm font-semibold text-rose-600">{t('writing.errorAnalysisTitle')}</span>
              {errors.length > 0 && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">{errors.length}</span>
              )}
            </div>
            {errorsLoading && errors.length === 0 ? (
              <p className="text-xs text-gray-400">{t('writing.errorAnalysisLoading')}</p>
            ) : (
              <div className="space-y-2.5">
                {errors.map((e, i) => (
                  <div key={`err-${e.category}-${i}`} className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs space-y-1">
                    <span className="inline-block text-xs font-bold px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{e.category}</span>
                    <p className="text-rose-500 line-through">{e.wrong}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ {e.correct}</p>
                    <p className="text-gray-500 dark:text-gray-400">💡 {e.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Original essay */}
        <div className="card mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">{t('writing.yourEssay')}</p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{essay}</p>
        </div>

        {/* Improved version */}
        {improved && (
          <div className="card mb-4 border-green-100">
            <button
              onClick={() => setShowImproved((v) => !v)}
              className="w-full flex items-center justify-between"
            >
              <p className="text-sm font-semibold text-green-700">{t('writing.improvedVersion')}</p>
              {showImproved ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {showImproved && (
              <div className="mt-3 pt-3 border-t border-green-100">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{improved}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              setEssay(''); setTimer(0); setTimerActive(false); setStreamText(''); setErrors([]); setView('write')
              try { localStorage.removeItem(draftKey) } catch { /* ignore */ }
            }}
            className="btn-secondary flex-1 text-sm"
          >
            {t('writing.rewriteButton')}
          </button>
          <button
            onClick={() => { window.history.back() }}
            className="btn-primary flex-1 text-sm"
          >
            {t('writing.finishButton')}
          </button>
        </div>

        {/* Writing History */}
        <div className="mt-6">
          <WritingHistory />
        </div>
      </div>
    )
  }

  // ── WRITE view ───────────────────────────────────────────────────────────

  if (!promptsLoaded || !prompt) {
    return <WritingSkeleton />
  }    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <Breadcrumb items={[
          { label: t('breadcrumb.home'), path: '/' },
          { label: t('breadcrumb.writing') },
        ]} />
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {fromSkills && (
              <button onClick={() => navigate('/skills')} className="btn-ghost p-2 rounded-xl -ml-2" aria-label={t('common.backToSkills')}>
                <ChevronLeft size={18} />
              </button>
            )}
            <div className="w-10 h-10 bg-b2-100 rounded-xl flex items-center justify-center">
              <PenLine size={20} className="text-b2-600" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('writing.title')}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('writing.dailyTask', { day: String(currentDay) })}</p>
            </div>
          </div>
        {timerActive && (
          <span className="flex items-center gap-1 text-sm font-mono font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            <Clock size={13} /> {formatTimer(timer)}
          </span>
        )}
        {/* IELTS toggle */}
        <button
          onClick={() => setIeltsMode((v) => !v)}
          disabled={evaluating}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
            ieltsMode
              ? 'bg-b2-100 border-b2-200 text-b2-700'
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600'
          }`}
        >
          {ieltsMode ? 'IELTS ✅' : 'IELTS'}
        </button>
      </div>

      {/* Rubric */}
      <div className="card mb-4 border-primary-100">
        <button
          onClick={() => setShowRubric((v) => !v)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary-700">{t('writing.rubricTitle')}</span>
            <span className="text-xs text-primary-400">/100</span>
          </div>
          {showRubric ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {showRubric && (
          <div className="mt-3 pt-3 border-t border-primary-100 space-y-2.5">
            {[
              { icon: Target,       label: 'Content / Mazmun',        score: '0–25', desc: t('writing.rubricContent'),      color: 'text-primary-600 bg-primary-50' },
              { icon: BookOpen,     label: 'Grammar / Grammatika',    score: '0–25', desc: t('writing.rubricGrammar'),      color: 'text-b2-600 bg-b2-50' },
              { icon: Lightbulb,    label: 'Vocabulary / Lug\'at',     score: '0–25', desc: t('writing.rubricVocabulary'),   color: 'text-orange-600 bg-orange-50' },
              { icon: GitBranch,    label: 'Coherence / Bog\'liqlik',  score: '0–25', desc: t('writing.rubricCoherence'),    color: 'text-emerald-600 bg-emerald-50' },
            ].map(({ icon: Icon, label, score, desc, color }) => (
              <div key={label} className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{label}</span>
                    <span className="text-xs font-bold text-gray-400">{score}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prompt */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge text-xs ${TYPE_COLOR[prompt.type]}`}>
            {TYPE_LABEL[prompt.type]}
          </span>
          <span className="text-xs text-gray-400">{t('writing.wordCount', { count: String(prompt.wordLimit), limit: '' })} · {t('writing.promptTimeLimit', { minutes: String(prompt.timeMinutes) })}</span>
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">{prompt.prompt}</p>
      </div>

      {/* Tips */}
      <div className="card bg-b2-50 border-b2-100 mb-4">
        <p className="text-xs font-semibold text-b2-700 mb-1.5">{t('writing.tipsTitle')}</p>
        <ul className="space-y-1">
          {prompt.tips.map((tip, i) => (
            <li key={i} className="text-xs text-b2-800 flex items-start gap-1.5">
              <span className="text-b2-400 flex-shrink-0">{i + 1}.</span>{tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <div className="card mb-3">
        {/* Draft indikator */}
        {essay.trim().length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {t('writing.draftSaved')}
          </div>
        )}
        <textarea
          aria-label={t('writing.essayLabel')}
          className="w-full min-h-[240px] text-sm text-gray-800 dark:text-gray-100 dark:bg-transparent leading-relaxed resize-none outline-none placeholder-gray-300 dark:placeholder-gray-600"
          placeholder={t('writing.editorPlaceholder')}
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          disabled={evaluating}
        />
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
          <span className={`text-xs font-semibold ${wc >= prompt.wordLimit ? 'text-green-600' : wc >= minWords ? 'text-orange-500' : 'text-gray-400'}`}>
            {wc} / {prompt.wordLimit} {t('common.words')}
          </span>
          <div className="w-32 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${wc >= prompt.wordLimit ? 'bg-green-500' : 'bg-b2-400'}`}
              style={{ width: `${Math.min(100, (wc / prompt.wordLimit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Minimum words hint */}
      {wc < minWords && essay.length > 0 && (
        <p className="text-xs text-orange-500 mb-3 text-center">
          {t('writing.minWordsHint', { min: String(minWords), remaining: String(minWords - wc) })}
        </p>
      )}

      {/* Evaluating stream */}
      {evaluating && streamText && (
        <div className="card bg-primary-50 border-primary-100 mb-3">
          <p className="text-xs font-semibold text-primary-700 mb-1 flex items-center gap-1">
            <Loader2 size={12} className="animate-spin" /> {ieltsMode ? `${t('writing.evaluating')}` : t('writing.evaluating')}
          </p>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {streamText}
            <span className="inline-block w-1 h-3 bg-primary-400 ml-0.5 animate-pulse align-middle" />
          </pre>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full btn-primary text-sm flex items-center justify-center gap-2"
      >
        {evaluating
          ? <><Loader2 size={14} className="animate-spin" /> {t('writing.evaluating')}</>
          : t('writing.submitButton')
        }
      </button>
    </div>
  )
}
