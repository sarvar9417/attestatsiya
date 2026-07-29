import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BookOpen, ChevronLeft, ChevronRight, Clock,
  CheckCircle2, XCircle, Sparkles, Loader2,
} from 'lucide-react'
import { type ReadingText, type VocabWord, type CompQuestion } from '@/data/reading'
import { fetchReadingTexts, saveReadingResult } from '@/services/readingService'
import { generateReadingQuestions } from '@/lib/claude'
import { useI18n } from '../i18n'
import { useStore } from '@/store/useStore'
import { supabase } from '@/lib/supabase'
import { monitoring } from '@/lib/monitoring'
import ExamTimer from '@/components/exam/ExamTimer'

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'select' | 'read' | 'quiz' | 'result'

// ── Highlighted text ──────────────────────────────────────────────────────────

function HighlightedText({
  text,
  vocabWords,
  onWordClick,
}: {
  text:         string
  vocabWords:   VocabWord[]
  onWordClick:  (v: VocabWord) => void
}) {
  interface Segment { text: string; vocab: VocabWord | null }
  const segments: Segment[] = []
  let remaining = text

  while (remaining.length > 0) {
    let earliest = -1
    let matched: VocabWord | null = null

    for (const v of vocabWords) {
      const escaped = v.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re  = new RegExp(`\\b${escaped}\\b`, 'i')
      const m   = re.exec(remaining)
      if (m && (earliest === -1 || m.index < earliest)) {
        earliest = m.index
        matched  = v
      }
    }

    if (matched === null) {
      segments.push({ text: remaining, vocab: null })
      break
    }
    if (earliest > 0) segments.push({ text: remaining.slice(0, earliest), vocab: null })
    segments.push({ text: remaining.slice(earliest, earliest + matched.word.length), vocab: matched })
    remaining = remaining.slice(earliest + matched.word.length)
  }

  return (
    <>
      {segments.map((seg, i) =>
        seg.vocab ? (
          <mark
            key={i}
            onClick={() => onWordClick(seg.vocab!)}
            className="bg-yellow-200 dark:bg-yellow-800/50 hover:bg-yellow-300 dark:hover:bg-yellow-700/60 cursor-pointer rounded px-0.5 transition-colors"
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  )
}

// ── Vocab popup ───────────────────────────────────────────────────────────────

function VocabPopup({ word, onClose }: { word: VocabWord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{word.word}</span>
            <span className="ml-2 text-xs text-gray-400 italic">{word.partOfSpeech}</span>
          </div>
          <button onClick={onClose} className="btn-ghost p-1 rounded-lg text-gray-400">✕</button>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 mb-3">
          <p className="text-sm text-gray-800 font-medium">{word.definition}</p>
        </div>
        <p className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-3">
          "{word.example}"
        </p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Reading() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const fromSkills = location.state?.from === '/skills'
  const { addXP, updateSkillProgress } = useStore()

  const [phase,        setPhase]        = useState<Phase>('select')
  const [text,         setText]         = useState<ReadingText | null>(null)
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null)
  const [answers,      setAnswers]      = useState<(number | null)[]>([])
  const [submitted,    setSubmitted]    = useState(false)
  const [aiQuestions,  setAiQuestions]  = useState('')
  const [aiLoading,    setAiLoading]    = useState(false)
  const [showAI,       setShowAI]       = useState(false)
  const [texts,        setTexts]        = useState<ReadingText[]>([])
  const [textsLoading, setTextsLoading] = useState(true)

  useEffect(() => {
    fetchReadingTexts().then((data) => {
      setTexts(data)
      setTextsLoading(false)
    }).catch((e) => {
      monitoring.captureMessage('fetchReadingTexts failed: ' + (e instanceof Error ? e.message : String(e)), 'error')
      setTextsLoading(false)
    })
  }, [])

  function openText(t: ReadingText) {
    setText(t)
    setAnswers(Array(t.questions.length).fill(null))
    setSubmitted(false)
    setAiQuestions('')
    setShowAI(false)
    setPhase('read')
  }

  function goToQuiz() {
    setPhase('quiz')
  }

  function submitQuiz() {
    if (!text) return
    const correct = text.questions.filter((q, i) => answers[i] === q.correctIndex).length
    const xp      = correct * 12
    addXP(xp)
    updateSkillProgress('todayReadingPct', Math.round((correct / text.questions.length) * 100))
    // Save to Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) {
        saveReadingResult({
          userId:         session.user.id,
          textId:         text.id,
          textTitle:      text.title,
          correctCount:   correct,
          totalQuestions: text.questions.length,
          xpEarned:       xp,
        })
      }
    }).catch((e) => monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: 'getSession' }))
    setSubmitted(true)
    setPhase('result')
  }

  function handleGenerateQuestions() {
    if (!text || aiLoading) return
    setAiLoading(true)
    setAiQuestions('')
    setShowAI(true)
    const fullText = text.paragraphs.join(' ')
    generateReadingQuestions(
      fullText,
      text.level,
      (token) => setAiQuestions((p) => p + token),
      ()      => setAiLoading(false),
      ()      => setAiLoading(false),
    )
  }

  // ── SELECT ───────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          {fromSkills && (
            <button onClick={() => navigate('/skills')} className="btn-ghost p-2 rounded-xl -ml-2" aria-label={t('common.backToSkills')}>
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">{t('reading.title')}</h1>
            <p className="text-xs text-gray-500">{t('reading.subtitle')}</p>
          </div>
        </div>

        {textsLoading ? (
          <div className="flex items-center justify-center min-h-[200px] text-gray-400 animate-pulse">{t('reading.loading')}</div>
        ) : (
          <div className="space-y-3">
            {texts.map((item) => (
              <button
              key={item.id}
              onClick={() => openText(item)}
                className="w-full card text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge text-xs ${item.level === 'B2' ? 'badge-b2' : item.level === 'B1+' ? 'badge-b1' : 'badge-primary'}`}>
                        {item.level}
                      </span>
                      <span className="text-xs text-gray-400">{item.topic}</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} /> {t('reading.readingTime', { minutes: String(item.readingTime) })}</span>
                      <span>{t('reading.wordCount', { count: String(item.wordCount) })}</span>
                      <span>{t('reading.vocabCount', { count: '10' })}</span>
                      <span>{t('reading.questionsCount', { count: '5' })}</span>
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

  // ── RESULT ───────────────────────────────────────────────────────────────

  if (phase === 'result' && text) {
    const correct = text.questions.filter((q, i) => answers[i] === q.correctIndex).length
    const pct     = Math.round((correct / text.questions.length) * 100)

    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('reading.resultTitle')}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{text.title}</p>
        </div>

        <div className="flex gap-3 justify-center mb-6">
          <div className="card text-center px-8 py-4">
            <p className="text-3xl font-bold text-green-600">{correct}/{text.questions.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('reading.resultCorrect')}</p>
          </div>
          <div className="card text-center px-8 py-4">
            <p className="text-3xl font-bold text-primary-600">{correct * 12}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('reading.resultXPLabel')}</p>
          </div>
        </div>

        {/* Per-question breakdown */}
        <div className="space-y-3 mb-5">
          {text.questions.map((q, i) => {
            const isCorrect = answers[i] === q.correctIndex
            return (
              <div key={q.id} className={`card border-l-4 ${isCorrect ? 'border-green-400' : 'border-red-400'}`}>
                <div className="flex items-start gap-2 mb-1">
                  {isCorrect
                    ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    : <XCircle     size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  }
                  <p className="text-sm font-medium text-gray-800">{q.question}</p>
                </div>
                {!isCorrect && (
                  <div className="ml-6 space-y-1">
                    <p className="text-xs text-red-600">{t('reading.yourAnswer')}: {answers[i] !== null ? q.options[answers[i]!] : '—'}</p>
                    <p className="text-xs text-green-700 font-medium">{t('reading.correctAnswer')}: {q.options[q.correctIndex]}</p>
                    <p className="text-xs text-gray-500 italic">{q.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex gap-2">
          <button onClick={() => setPhase('select')} className="btn-secondary flex-1 text-sm">{t('reading.selectText')}</button>
          <button onClick={() => { setPhase('read') }} className="btn-primary flex-1 text-sm">{t('reading.rereadButton')}</button>
        </div>
      </div>
    )
  }

  // ── QUIZ ─────────────────────────────────────────────────────────────────

  if (phase === 'quiz' && text) {
    const allAnswered = answers.every((a) => a !== null)

    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          <button onClick={() => setPhase('read')} className="btn-ghost p-2 rounded-xl">
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">{text.title}</p>
            <p className="text-sm font-semibold text-gray-900">{t('reading.quizTitle')}</p>
          </div>
        </div>

        <div className="space-y-4">
          {text.questions.map((q: CompQuestion, qi: number) => (
            <div key={q.id} className="card">
              <div className="flex items-start gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {qi + 1}
                </span>
                <p className="text-sm font-medium text-gray-800">{q.question}</p>
              </div>
              <div className="space-y-1.5 ml-8">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => {
                      const next = [...answers]
                      next[qi] = oi
                      setAnswers(next)
                    }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-all
                      ${answers[qi] === oi
                        ? 'bg-green-100 border-green-300 text-green-800 font-medium'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + oi)})</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={submitQuiz}
          disabled={!allAnswered || submitted}
          className="w-full btn-primary text-sm mt-5"
        >
          {t('reading.submitButton')}
        </button>
      </div>
    )
  }

  // ── READ ─────────────────────────────────────────────────────────────────

  if (!text) return null

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      {/* IELTS exam timer (60 min) */}
      <ExamTimer
        duration={3600}
        storageKey="reading-ielts"
        onTimeUp={() => { setPhase('quiz'); }}
        autoStart
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 mt-4">
        <div className="flex items-center gap-2">
          <button onClick={() => { setPhase('select') }} className="btn-ghost p-2 rounded-xl">
            <ChevronLeft size={18} />
          </button>
          <div>
            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{text.title}</p>
            <p className="text-xs text-gray-400">{text.topic}</p>
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="card mb-4 prose prose-sm max-w-none">
        <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
          {text.paragraphs.map((para, i) => (
            <p key={i}>
              <HighlightedText
                text={para}
                vocabWords={text.vocabWords}
                onWordClick={setSelectedWord}
              />
            </p>
          ))}
        </div>
      </div>

      {/* Vocab legend */}
      <div className="card bg-yellow-50 border-yellow-100 mb-4">
        <p className="text-xs text-yellow-800 font-medium mb-2">
          {t('reading.vocabLegend')}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {text.vocabWords.map((v) => (
            <button
              key={v.word}
              onClick={() => setSelectedWord(v)}
              className="text-xs bg-yellow-200 dark:bg-yellow-800/50 hover:bg-yellow-300 dark:hover:bg-yellow-700/60 text-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded-full transition-colors"
            >
              {v.word}
            </button>
          ))}
        </div>
      </div>

      {/* AI questions */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary-500" />
            {t('reading.aiQuestionsTitle')}
          </p>
          {!aiQuestions && (
            <button
              onClick={handleGenerateQuestions}
              disabled={aiLoading}
              className="btn-secondary text-xs py-1 px-3 flex items-center gap-1"
            >
              {aiLoading ? <Loader2 size={12} className="animate-spin" /> : null}
              {aiLoading ? t('reading.aiGenerating') : t('reading.aiGenerate')}
            </button>
          )}
        </div>
        {showAI && (
          <div className="bg-primary-50 rounded-xl p-3">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {aiQuestions}
              {aiLoading && <span className="inline-block w-1 h-3 bg-primary-400 ml-0.5 animate-pulse align-middle" />}
            </pre>
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={goToQuiz}
        className="w-full btn-primary text-sm flex items-center justify-center gap-2"
      >
        {t('reading.goToQuiz')} <ChevronRight size={15} />
      </button>

      {/* Vocab popup */}
      {selectedWord && (
        <VocabPopup word={selectedWord} onClose={() => setSelectedWord(null)} />
      )}
    </div>
  )
}
