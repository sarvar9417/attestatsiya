import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { scheduleReview } from '../lib/grammarSrs'
import {
  ArrowLeft, BookOpen, CheckCircle, XCircle,
  RotateCcw, ChevronRight, Lightbulb,
  Trophy, Zap,
} from 'lucide-react'
import { useNavigationGuard } from '../hooks/useNavigationGuard'
import { useI18n } from '../i18n'
import Breadcrumb from '../components/ui/Breadcrumb'
import { type GrammarTopic } from '../data/grammar'
import { GRAMMAR_COLORS, type GrammarCategory } from '../lib/grammarColors'
import { fetchGrammarTopics, saveGrammarResult } from '../services/grammarService'
import { type GrammarResult } from '../lib/claude'
import { useStore } from '../store/useStore'
import { monitoring } from '../lib/monitoring'
import { sanitizeHtml } from '../lib/sanitizeHtml'
import { supabase } from '../lib/supabase'
import { GrammarDNAMap } from '../components/grammar/GrammarDNAMap'
import GrammarGlossary from '../components/grammar/GrammarGlossary'
import { termUzBilingual } from '../data/grammarGlossary'
import {
  checkAnswer, getUserAnswerText,
  ExerciseItem, AIFeedbackPanel,
} from '../components/grammar/GrammarQuestions'

// ─── Phase 1: Topic Selector ──────────────────────────────────────────────────

const LEVEL_COLORS: Record<string, string> = {
  A2:  'bg-gray-100 text-gray-600 border-gray-200',
  B1:  'bg-primary-100 text-primary-700 border-primary-200',
  'B1+': 'bg-b1-100 text-b1-700 border-b1-200',
  B2:  'bg-b2-100 text-b2-700 border-b2-200',
}

const TAG_TO_CATEGORY: Record<string, GrammarCategory> = {
  Conditionals: 'conditionals',
  Tenses:       'tenses',
  Passive:      'passives',
  Modals:       'modals',
  Comparatives: 'other',
  Prepositions: 'prepositions',
  Articles:     'articles',
  Reported:     'reported',
  Phrasal:      'phrasal',
}

function TopicCard({
  topic, onSelect,
}: { topic: GrammarTopic; onSelect: () => void }) {
  const { t } = useI18n()
  return (
    <button
      onClick={onSelect}
      className="card-hover text-left flex flex-col gap-3 p-3 sm:p-5 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`badge border text-xs font-semibold ${LEVEL_COLORS[topic.level] ?? ''}`}>
          {topic.level}
        </div>
        <div className={`badge text-xs ${GRAMMAR_COLORS[TAG_TO_CATEGORY[topic.tag] ?? 'other'].badge} ${GRAMMAR_COLORS[TAG_TO_CATEGORY[topic.tag] ?? 'other'].dark}`}>
          {topic.tag}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 text-base leading-tight">{topic.title}</h3>
        {(() => {
          const uzName = termUzBilingual(topic.title)
          if (uzName === topic.title) return null
          return <p className="text-xs text-primary-600 font-medium mt-0.5">{uzName}</p>
        })()}
        <p className="text-xs text-gray-500 mt-0.5">{topic.subtitle}</p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>📅 {t('grammar.weekLabel', { week: String(topic.week) })}</span>
        <span>📝 {t('grammar.exerciseCount', { count: String(topic.exercises.length) })}</span>
        <span>{t('grammar.xpLabel', { xp: String(topic.exercises.length * 10) })}</span>
      </div>

      <div className="flex items-center gap-1.5 text-primary-600 font-semibold text-sm
        group-hover:gap-3 transition-all">
        {t('grammar.startButton')} <ChevronRight size={15} />
      </div>
    </button>
  )
}

function TopicSelector({ topics, onSelect }: { topics: GrammarTopic[]; onSelect: (topic: GrammarTopic) => void }) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const fromSkills = location.state?.from === '/skills'
  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      <Breadcrumb items={[
        { label: t('breadcrumb.home'), path: '/' },
        { label: t('breadcrumb.grammar') },
      ]} />
      <div className="flex items-center gap-3 mb-6">
        {fromSkills && (
          <button onClick={() => navigate('/skills')} className="btn-ghost p-2 rounded-xl -ml-2" aria-label={t('common.backToSkills')}>
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <BookOpen size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">{t('grammar.selectTitle')}</h1>
          <p className="text-xs text-gray-500">{t('grammar.selectSubtitle')}</p>
        </div>
      </div>

      {/* Grammar DNA Map */}
      <div className="mb-6">
        <GrammarDNAMap onTopicSelect={onSelect} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} onSelect={() => onSelect(topic)} />
        ))}
      </div>

      <div className="mt-6">
        <GrammarGlossary />
      </div>

      <div className="mt-6 card bg-primary-50 border-primary-100">
        <p className="text-sm text-primary-800 font-medium flex items-center gap-2">
          <Lightbulb size={16} />
          <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('grammar.tipText')) }} />
        </p>
      </div>
    </div>
  )
}

// ─── Phase 2: Explanation Card ────────────────────────────────────────────────

const FORMULA_TO_CATEGORY: Record<string, GrammarCategory> = {
  blue:   'tenses',
  purple: 'modals',
  green:  'articles',
  orange: 'prepositions',
}

function ExplanationCard({
  topic, onStart, onBack,
}: { topic: GrammarTopic; onStart: () => void; onBack: () => void }) {
  const { t } = useI18n()
  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-4 sm:space-y-5">
      {/* Nav */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={onBack} className="btn-ghost flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> {t('common.back')}
        </button>
        <div className="h-5 w-px bg-gray-200" />
        <span className={`badge border ${LEVEL_COLORS[topic.level] ?? ''}`}>{topic.level}</span>
        <span className={`badge ${GRAMMAR_COLORS[TAG_TO_CATEGORY[topic.tag] ?? 'other'].badge} ${GRAMMAR_COLORS[TAG_TO_CATEGORY[topic.tag] ?? 'other'].dark}`}>{topic.tag}</span>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{topic.title}</h2>
        {(() => {
          const uzName = termUzBilingual(topic.title)
          if (uzName === topic.title) return null
          return <p className="text-xs text-primary-600 font-medium mt-0.5">{uzName}</p>
        })()}
        <p className="text-gray-500 text-sm mt-1">{topic.subtitle}</p>
      </div>

      {/* Formula box */}
      <div className="bg-gradient-to-br from-primary-600 to-b2-600 rounded-2xl p-3 sm:p-5 text-white">
        <p className="text-xs font-semibold opacity-70 mb-2 uppercase tracking-wider">{t('grammar.formulaLabel')}</p>
        <p className="text-2xl font-mono font-bold tracking-wide">{topic.formula}</p>
        <div className="grid grid-cols-1 gap-2 mt-4">
          {topic.formulaRows.map((row) => {
            const cat = FORMULA_TO_CATEGORY[row.color] ?? 'tenses'
            const s = GRAMMAR_COLORS[cat]
            return (
              <div
                key={row.label}
                className={`flex items-center gap-3 ${s.bg} ${s.border} border rounded-xl px-3 py-2 ${s.dark}`}
              >
                <span className={`text-xs font-semibold ${s.text} w-32 flex-shrink-0`}>
                  {row.label}
                </span>
                <span className={`font-mono text-sm font-bold ${s.text}`}>{row.structure}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* When to use */}
      <div className="card">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          {t('grammar.whenToUse')}
        </p>
        <ul className="space-y-2">
          {topic.usedFor.map((u, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-primary-500 mt-0.5 flex-shrink-0">✦</span>
              {u}
            </li>
          ))}
        </ul>
      </div>

      {/* Examples */}
      <div className="card">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          {t('grammar.examplesLabel')}
        </p>
        <div className="space-y-3">
          {topic.examples.map((ex, i) => (
            <div key={i} className="border-l-4 border-primary-300 pl-4">
              <p className="font-semibold text-gray-900 text-sm leading-relaxed">{ex.en}</p>
              <p className="text-xs text-gray-500 mt-0.5 italic">{ex.uz}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button onClick={onStart} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
        <Zap size={18} />
        {t('grammar.startExercise', { count: String(topic.exercises.length), xp: String(topic.exercises.length * 10) })}
      </button>
    </div>
  )
}

// ─── Main Grammar Page ────────────────────────────────────────────────────────

type Phase = 'select' | 'explain' | 'exercise' | 'result'
type Answers = Record<number, string[]>

export default function Grammar() {
  const { t } = useI18n()
  const { addXP, updateSkillProgress } = useStore()

  const [phase, setPhase]       = useState<Phase>('select')
  const [topic, setTopic]       = useState<GrammarTopic | null>(null)
  const [answers, setAnswers]   = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore]       = useState(0)
  const [results, setResults]   = useState<GrammarResult[]>([])
  const [topics, setTopics]     = useState<GrammarTopic[]>([])
  const [loading, setLoading]   = useState(true)
  const location = useLocation()

  useNavigationGuard(!submitted && Object.keys(answers).length > 0)

  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchGrammarTopics().then((data) => {
      setTopics(data)
      setLoading(false)
      // Auto-select grammar topic from review state (e.g. GrammarReview da bosilganda)
      const rti = (location.state as { reviewTopicId?: string } | null)?.reviewTopicId
      if (rti) {
        const found = data.find((topic) => topic.id === rti)
        if (found) handleSelectTopic(found)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollTop = () => topRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

  const handleSelectTopic = (selectedTopic: GrammarTopic) => {
    setTopic(selectedTopic)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    setResults([])
    setPhase('explain')
    scrollTop()
  }

  const handleStartExercise = () => { setPhase('exercise'); scrollTop() }

  const handleChangeAnswer = (exId: number, blankIdx: number, val: string) => {
    setAnswers((prev) => {
      const cur = [...(prev[exId] ?? [])]
      cur[blankIdx] = val
      return { ...prev, [exId]: cur }
    })
  }

  const handleSubmit = () => {
    if (!topic) return
    let correct = 0
    const res: GrammarResult[] = topic.exercises.map((ex, i) => {
      const userAns = answers[ex.id] ?? []
      const ok = checkAnswer(ex, userAns)
      if (ok) correct++
      return {
        qNum:       i + 1,
        type:       ex.type,
        question:   ex.question,
        userAnswer: getUserAnswerText(ex, userAns, t('grammar.noAnswer')),
        correct:    ex.type === 'fill-blank' ? ex.blanks.join(' / ') : ex.correct,
        isCorrect:  ok,
      }
    })
    setScore(correct)
    setResults(res)
    setSubmitted(true)
    setPhase('result')
    addXP(correct * 10)
    updateSkillProgress('todayGrammarPct', Math.round((correct / topic.exercises.length) * 100))
    // Schedule FSRS-5 grammar review (localStorage orqali)
    const scorePct = Math.round((correct / topic.exercises.length) * 100)
    scheduleReview(topic.id, scorePct)
    // Save to Supabase (fire-and-forget, errors logged in saveGrammarResult)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) {
        saveGrammarResult({
          userId:       session.user.id,
          topicId:      topic.id,
          topicTitle:   topic.title,
          correctCount: correct,
          total:        topic.exercises.length,
          xpEarned:     correct * 10,
        }).catch((e) => monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: 'saveGrammarResult' }))
      }
    }).catch((e) => monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: 'getSession' }))
    scrollTop()
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    setResults([])
    setPhase('exercise')
    scrollTop()
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const scoreColor =
    score >= 9 ? 'text-b1-600' :
    score >= 7 ? 'text-primary-600' :
    score >= 5 ? 'text-yellow-600' : 'text-red-500'

  const scoreBg =
    score >= 9 ? 'bg-b1-50 border-b1-200' :
    score >= 7 ? 'bg-primary-50 border-primary-200' :
    score >= 5 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'

  return (
    <div ref={topRef} className="h-full overflow-y-auto scrollbar-hide mobile-safe-bottom">
      {/* ── Topic select ── */}
      {phase === 'select' && (
        loading ? (
          <div className="p-3 sm:p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[300px]">
            <div className="text-gray-400 animate-pulse">{t('grammar.loading')}</div>
          </div>
        ) : (
          <TopicSelector topics={topics} onSelect={handleSelectTopic} />
        )
      )}

      {/* ── Explanation ── */}
      {phase === 'explain' && topic && (
        <ExplanationCard
          topic={topic}
          onStart={handleStartExercise}
          onBack={() => setPhase('select')}
        />
      )}

      {/* ── Exercise ── */}
      {(phase === 'exercise' || (phase === 'result' && submitted)) && topic && (
        <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPhase('explain')}
                className="btn-ghost flex items-center gap-1 text-sm"
              >
                <ArrowLeft size={15} /> {t('grammar.viewExplanation')}
              </button>
              <div className="h-5 w-px bg-gray-200" />
              <span className="font-bold text-gray-900 text-sm">{topic.title}</span>
            </div>
            {!submitted && (
              <span className="text-xs text-gray-500 font-medium">
                {t('grammar.exerciseProgress', { count: String(topic.exercises.length), xp: String(topic.exercises.length * 10) })}
              </span>
            )}
            {submitted && (
              <span className={`text-sm font-bold ${scoreColor}`}>
                {t('grammar.scoreLabel', { correct: String(score), total: String(topic.exercises.length) })}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full">
            <div
              className={`h-full rounded-full transition-all ${
                submitted ? (score >= 7 ? 'bg-b1-500' : 'bg-orange-400') : 'bg-primary-500'
              }`}
              style={{ width: submitted ? `${(score / topic.exercises.length) * 100}%` : '100%' }}
            />
          </div>

          {/* Result score (shown only in result phase at top) */}
          {phase === 'result' && (
            <div className={`card border text-center py-5 ${scoreBg}`}>
              <p className={`text-5xl font-bold font-mono ${scoreColor} mb-1`}>
                {score}<span className="text-2xl text-gray-400">/{topic.exercises.length}</span>
              </p>
              <p className="text-sm text-gray-600 mb-3">
                {score === 10 ? t('grammar.resultPerfect') :
                 score >= 8  ? t('grammar.resultGreat') :
                 score >= 6  ? t('grammar.resultGood') :
                 score >= 4  ? t('grammar.resultMorePractice') :
                               t('grammar.resultReread')}
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 text-yellow-600">
                  <Trophy size={18} />
                  <span className="font-bold text-lg">{t('grammar.resultXP', { xp: String(score * 10) })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle size={18} />
                  <span className="font-medium text-sm">{t('grammar.resultCorrect', { count: String(score) })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-500">
                  <XCircle size={18} />
                  <span className="font-medium text-sm">
                    {t('grammar.resultWrong', { count: String(topic.exercises.length - score) })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Exercises list */}
          <div className="space-y-6 pt-2">
            {topic.exercises.map((ex, i) => (
              <ExerciseItem
                key={ex.id}
                ex={ex}
                num={i + 1}
                answers={answers[ex.id] ?? []}
                onChange={(blankIdx, val) => handleChangeAnswer(ex.id, blankIdx, val)}
                submitted={submitted}
              />
            ))}
          </div>

          {/* Submit / action buttons */}
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4"
            >
              <CheckCircle size={18} />
              {t('grammar.submitCheck', { xp: String(topic.exercises.length * 10) })}
            </button>
          ) : (
            <div className="space-y-3 mt-4">
              {/* AI Feedback */}
              <AIFeedbackPanel topic={topic} results={results} />

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={handleRetry}
                  className="btn-secondary flex items-center justify-center gap-1.5 text-sm"
                >
                  <RotateCcw size={15} /> {t('grammar.retryButton')}
                </button>
                <button
                  onClick={() => { setPhase('explain'); scrollTop() }}
                  className="btn-secondary flex items-center justify-center gap-1.5 text-sm"
                >
                  <BookOpen size={15} /> {t('grammar.viewExplanation')}
                </button>
                <button
                  onClick={() => { setPhase('select'); scrollTop() }}
                  className="btn-primary flex items-center justify-center gap-1.5 text-sm"
                >
                  {t('grammar.otherTopic')} <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
