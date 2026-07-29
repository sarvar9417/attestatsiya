import { useState, useRef, useEffect } from 'react'
import { 
  Sparkles, ChevronDown, ChevronUp, CheckCircle, AlertCircle, 
  Lightbulb, PenLine, Layout, Quote, Loader2,
} from 'lucide-react'
import type { WritingSection as WritingSectionType } from '../../data/dailyLessons'
import { evaluateWriting, generateWritingTask } from '../../lib/claude'
import type { LessonContent } from '../../lib/aiPrompts'
import { useI18n } from '../../i18n'

interface Props {
  section?: WritingSectionType
  level?: string
  addXP?: (amount: number) => void
  lesson?: LessonContent
}

interface ParsedFeedback {
  taskAchievement: { score: number; comment: string }
  coherence: { score: number; comment: string }
  vocabulary: { score: number; comment: string }
  grammar: { score: number; comment: string }
  feedback: string
  improved: string
}

function parseFeedback(raw: string): ParsedFeedback | null {
  try {
    const get = (key: string) => {
      const re = new RegExp(`${key}:\\s*(\\d+)\\s*\\n([^\\n]+)`)
      const m = raw.match(re)
      return m ? { score: parseInt(m[1]), comment: m[2].trim() } : { score: 0, comment: '' }
    }
    const getFreeText = (key: string) => {
      const re = new RegExp(`${key}:\\s*\\n([\\s\\S]+?)(?=\\n[A-Z_]+:|$)`)
      const m = raw.match(re)
      return m ? m[1].trim() : ''
    }
    return {
      taskAchievement: get('TASK_ACHIEVEMENT'),
      coherence: get('COHERENCE'),
      vocabulary: get('VOCABULARY'),
      grammar: get('GRAMMAR'),
      feedback: getFreeText('FEEDBACK'),
      improved: getFreeText('IMPROVED'),
    }
  } catch {
    return null
  }
}

function ScorePill({ label, score }: { label: string; score: number }) {
  const color =
    score >= 8 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' :
    score >= 6 ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' :
    'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
  return (
    <div className={`flex items-center justify-between rounded-xl border px-3 py-2 ${color}`}>
      <span className="text-xs font-semibold">{label}</span>
      <span className="text-lg font-bold font-mono">{score}<span className="text-xs opacity-60">/10</span></span>
    </div>
  )
}

export default function WritingSection({ section, level = 'A2', addXP, lesson }: Props) {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [showTips, setShowTips] = useState(false)
  const [showKeyPhrases, setShowKeyPhrases] = useState(false)
  const [showStructure, setShowStructure] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [parsed, setParsed] = useState<ParsedFeedback | null>(null)
  const [showImproved, setShowImproved] = useState(false)
  const [error, setError] = useState('')
  const [aiTask, setAiTask] = useState<{ prompt: string; wordLimit: number; tips: string[]; keyPhrases: { phrase: string; translation: string }[]; structure: string[] } | null>(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const hasEvaluated = useRef(false)

  const activeSection = section ?? aiTask
  const wordLimit = activeSection?.wordLimit ?? 100
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const pct = Math.min(100, Math.round((wordCount / wordLimit) * 100))
  const isUnder = wordCount < Math.round(wordLimit * 0.6)
  const isOver = wordCount > wordLimit
  const canSubmit = wordCount >= Math.round(wordLimit * 0.6) && !isEvaluating

  useEffect(() => {
    if (section) return
    if (!lesson) return
    let active = true
    setLoadingAi(true)
    generateWritingTask(lesson.title, lesson.level, lesson.formulas, lesson.rules, lesson.vocabulary)
      .then(t => { if (active) setAiTask(t) })
      .finally(() => { if (active) setLoadingAi(false) })
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, lesson?.title, lesson?.level])

  const handleEvaluate = async () => {
    if (!canSubmit || !activeSection) return
    setIsEvaluating(true)
    setStreamText('')
    setParsed(null)
    setError('')
    hasEvaluated.current = true

    let full = ''
    await evaluateWriting(
      activeSection.prompt,
      text,
      level,
      (token) => {
        full += token
        setStreamText(full)
      },
      (fullText) => {
        const result = parseFeedback(fullText)
        setParsed(result)
        if (result && addXP) {
          const avg = Math.round((result.taskAchievement.score + result.coherence.score + result.vocabulary.score + result.grammar.score) / 4)
          addXP(avg * 5)
        }
        setIsEvaluating(false)
      },
      (err) => {
        setError(err?.message || 'Evaluation failed. Please try again.')
        setIsEvaluating(false)
      }
    )
  }

  const overallScore = parsed
    ? Math.round((parsed.taskAchievement.score + parsed.coherence.score + parsed.vocabulary.score + parsed.grammar.score) / 4)
    : 0

  if (loadingAi) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Loader2 size={28} className="animate-spin mb-2" />
        <p className="text-sm">{t('dailyWriting.aiGeneratingTask')}</p>
      </div>
    )
  }

  if (!activeSection) return null

  return (
    <div className="space-y-5">
      {/* Task card */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2 flex items-center gap-1.5">
          <PenLine size={12} /> {t('dailyWriting.taskTitle')}
        </p>
        <p className="text-sm leading-relaxed font-medium">{activeSection.prompt}</p>
        <div className="flex items-center gap-3 mt-3 text-xs opacity-80">
          <span>{t('dailyWriting.targetWords', { count: String(wordLimit) })}</span>
          <span className="w-px h-3 bg-white/40" />
          <span>{t('dailyWriting.estimatedTime', { time: String(Math.round(wordLimit / 80 * 10)) })}</span>
        </div>
      </div>

      {/* Tips toggle */}
      <div className="card">
        <button
          onClick={() => setShowTips(p => !p)}
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          <span className="flex items-center gap-2"><Lightbulb size={16} className="text-amber-500" /> {t('dailyWriting.tipsTitle')}</span>
          {showTips ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {showTips && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-3">
            <ul className="space-y-2">
              {activeSection.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-amber-500 font-bold mt-0.5 shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>

            {/* Key Phrases */}
            {activeSection.keyPhrases && activeSection.keyPhrases.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                <button
                  onClick={() => setShowKeyPhrases(p => !p)}
                  className="w-full flex items-center justify-between text-sm font-semibold text-emerald-700 dark:text-emerald-400"
                >
                  <span className="flex items-center gap-2">
                    <Quote size={15} className="text-emerald-500" />
                    {t('dailyWriting.keyPhrases')}
                  </span>
                  {showKeyPhrases ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {showKeyPhrases && (
                  <div className="mt-2 space-y-2">
                    {activeSection.keyPhrases.map((kp, i) => (
                      <div key={i} className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-3 py-2">
                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{kp.phrase}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 shrink-0">{kp.translation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Structure */}
            {activeSection.structure && activeSection.structure.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                <button
                  onClick={() => setShowStructure(p => !p)}
                  className="w-full flex items-center justify-between text-sm font-semibold text-violet-700 dark:text-violet-400"
                >
                  <span className="flex items-center gap-2">
                    <Layout size={15} className="text-violet-500" />
                    {t('dailyWriting.suggestedStructure')}
                  </span>
                  {showStructure ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {showStructure && (
                  <ol className="mt-2 space-y-1.5">
                    {activeSection.structure.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Text area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dailyWriting.yourResponse')}</p>
          <span className={`text-xs font-semibold tabular-nums ${isOver ? 'text-red-500' : isUnder ? 'text-gray-400' : 'text-green-600 dark:text-green-400'}`}>
            {t('dailyWriting.wordCount', { count: String(wordCount), limit: String(wordLimit) })}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${isOver ? 'bg-red-500' : pct >= 100 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-gray-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={t('dailyWriting.placeholder')}
          rows={8}
          className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-2xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 leading-relaxed"
        />

        {!isUnder && !isOver && !hasEvaluated.current && (
          <p className="mt-1.5 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckCircle size={12} /> {t('dailyWriting.goodLength')}
          </p>
        )}
        {isOver && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle size={12} /> {t('dailyWriting.overLimit', { count: String(wordCount - wordLimit) })}
          </p>
        )}
      </div>

      {/* Submit button */}
      {!parsed && (
        <button
          onClick={handleEvaluate}
          disabled={!canSubmit}
          className={`btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isEvaluating
            ? <><Sparkles size={17} className="animate-pulse" /> {t('dailyWriting.evaluating')}</>
            : <><Sparkles size={17} /> {t('dailyWriting.submitButton')}</>
          }
        </button>
      )}

      {/* Streaming raw text (before parsed) */}
      {isEvaluating && streamText && !parsed && (
        <div className="card bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1.5"><Sparkles size={12} className="animate-pulse" /> {t('dailyWriting.analysing')}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap opacity-60">{streamText}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2"><AlertCircle size={15} /> {error === 'Evaluation failed. Please try again.' ? t('dailyWriting.aiError') : error}</p>
        </div>
      )}

      {/* Parsed feedback */}
      {parsed && (
        <div className="space-y-4">
          {/* Overall score */}
          <div className={`rounded-2xl border p-5 text-center ${overallScore >= 8 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : overallScore >= 6 ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'}`}>
            <p className={`text-4xl font-bold font-mono mb-1 ${overallScore >= 8 ? 'text-green-600 dark:text-green-400' : overallScore >= 6 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'}`}>
              {overallScore}<span className="text-xl text-gray-400">/10</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('dailyWriting.overallScore')}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {overallScore >= 9 ? t('dailyWriting.resultExcellent') :
               overallScore >= 7 ? t('dailyWriting.resultGood') :
               overallScore >= 5 ? t('dailyWriting.resultAverage') :
               t('dailyWriting.resultPoor')}
            </p>
          </div>

          {/* Scores grid */}
          <div className="grid grid-cols-2 gap-2">
            <ScorePill label={t('dailyWriting.scoreTaskAchievement')} score={parsed.taskAchievement.score} />
            <ScorePill label={t('dailyWriting.scoreCoherence')} score={parsed.coherence.score} />
            <ScorePill label={t('dailyWriting.scoreVocabulary')} score={parsed.vocabulary.score} />
            <ScorePill label={t('dailyWriting.scoreGrammar')} score={parsed.grammar.score} />
          </div>

          {/* Score comments */}
          <div className="card space-y-2">
            {[
            { label: t('dailyWriting.scoreTaskAchievement'), ...parsed.taskAchievement },
            { label: t('dailyWriting.scoreCoherence'), ...parsed.coherence },
            { label: t('dailyWriting.scoreVocabulary'), ...parsed.vocabulary },
            { label: t('dailyWriting.scoreGrammar'), ...parsed.grammar },
            ].map(({ label, score, comment }) => (
              <div key={label} className="flex items-start gap-2 text-sm">
                <span className={`font-bold tabular-nums text-xs pt-0.5 w-7 shrink-0 ${score >= 8 ? 'text-green-600' : score >= 6 ? 'text-yellow-600' : 'text-red-500'}`}>{score}/10</span>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{label}: </span>
                  <span className="text-gray-600 dark:text-gray-400 text-xs">{comment}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback */}
          {parsed.feedback && (
            <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb size={13} /> {t('dailyWriting.feedback')}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{parsed.feedback}</p>
            </div>
          )}

          {/* Improved version toggle */}
          {parsed.improved && (
            <div className="card border-emerald-200 dark:border-emerald-800">
              <button
                onClick={() => setShowImproved(p => !p)}
                className="w-full flex items-center justify-between text-sm font-semibold text-emerald-700 dark:text-emerald-400"
              >
                <span className="flex items-center gap-2">{t('dailyWriting.improvedVersion')}</span>
                {showImproved ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showImproved && (
                <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{parsed.improved}</p>
                </div>
              )}
            </div>
          )}

          {/* Try again */}
          <button
            onClick={() => { setParsed(null); setStreamText(''); hasEvaluated.current = false }}
            className="btn-secondary w-full text-sm py-2.5 flex items-center justify-center gap-2"
          >
            <PenLine size={15} /> {t('dailyWriting.editResubmit')}
          </button>
        </div>
      )}
    </div>
  )
}
