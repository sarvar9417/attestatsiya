import { useState, useMemo, useCallback } from 'react'
import { Volume2, Check, RotateCw, BookOpen, Shuffle, Brain, Trophy, Star, ChevronLeft, ChevronRight, Sparkles, Target, MessageCircle } from 'lucide-react'
import type { ChallengeVocab } from '../../data/30dayChallenge'
import VocabPracticeChat from './VocabPracticeChat'
import { speakNatural } from '../../lib/openaiTts'
import { speakText } from '../../lib/speak'

interface Props {
  vocabulary: ChallengeVocab[]
}

type StudyMode = 'cards' | 'list' | 'quiz' | 'ai-practice'

interface QuizQuestion {
  word: string
  correctMeaning: string
  options: string[]
  correctIndex: number
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuizQuestions(vocab: ChallengeVocab[]): QuizQuestion[] {
  return vocab.map(v => {
    const wrongMeanings = vocab
      .filter(x => x.word !== v.word)
      .map(x => x.meaning)
    const shuffledWrong = shuffleArray(wrongMeanings).slice(0, 3)
    const options = shuffleArray([v.meaning, ...shuffledWrong])
    return {
      word: v.word,
      correctMeaning: v.meaning,
      options,
      correctIndex: options.indexOf(v.meaning),
    }
  })
}



export default function VocabularySection({ vocabulary }: Props) {
  const [learned, setLearned] = useState<Set<string>>(new Set())
  const [flipped, setFlipped] = useState<string | null>(null)
  const [studyMode, setStudyMode] = useState<StudyMode>('cards')
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizChecked, setQuizChecked] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const quizQuestions = useMemo(() => generateQuizQuestions(vocabulary), [vocabulary])

  const toggleLearned = useCallback((word: string) => {
    setLearned(prev => {
      const next = new Set(prev)
      if (next.has(word)) next.delete(word)
      else next.add(word)
      return next
    })
  }, [])

  const speakWord = useCallback(async (text: string) => {
    try {
      await speakNatural(text, 0.8)
    } catch {
      speakText(text, 0.8)
    }
  }, [])

  const progressPct = Math.round((learned.size / vocabulary.length) * 100)
  const quizScore = useMemo(() => {
    if (!quizChecked) return 0
    return quizQuestions.reduce((score, q, i) => {
      return score + (quizAnswers[i] === q.correctIndex ? 1 : 0)
    }, 0)
  }, [quizChecked, quizAnswers, quizQuestions])

  const handleQuizAnswer = useCallback((qIndex: number, oIndex: number) => {
    if (quizChecked) return
    setQuizAnswers(prev => ({ ...prev, [qIndex]: oIndex }))
  }, [quizChecked])

  const checkQuiz = useCallback(() => {
    setQuizChecked(true)
  }, [])

  const resetQuiz = useCallback(() => {
    setQuizAnswers({})
    setQuizChecked(false)
  }, [])

  return (
    <div className="space-y-4">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <BookOpen size={18} className="text-primary-600" />
          Lug'at
          <span className="text-sm font-normal text-gray-500">({vocabulary.length} ta so'z)</span>
        </h3>
      </div>

      {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 border border-primary-200/50 dark:border-primary-800/30">
          <Target size={14} className="text-primary-600 dark:text-primary-400" />
          <div>
            <p className="text-[10px] font-bold text-primary-600/70 dark:text-primary-400/70 uppercase">Jami</p>
            <p className="text-sm font-black text-primary-700 dark:text-primary-300">{vocabulary.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-800/10 border border-green-200/50 dark:border-green-800/30">
          <Check size={14} className="text-green-600 dark:text-green-400" />
          <div>
            <p className="text-[10px] font-bold text-green-600/70 dark:text-green-400/70 uppercase">O'rganilgan</p>
            <p className="text-sm font-black text-green-700 dark:text-green-300">{learned.size}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-100/50 dark:from-amber-900/20 dark:to-yellow-800/10 border border-amber-200/50 dark:border-amber-800/30">
          <Star size={14} className="text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-[10px] font-bold text-amber-600/70 dark:text-amber-400/70 uppercase">Qoldi</p>
            <p className="text-sm font-black text-amber-700 dark:text-amber-300">{vocabulary.length - learned.size}</p>
          </div>
        </div>
      </div>

      {/* ── Progress Bar ───────────────────────────────────────────────── */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
          <span>Taraqqiyot</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 via-emerald-500 to-green-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Mode Switcher ──────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/80">
        {([
          { key: 'cards' as StudyMode, icon: <BookOpen size={14} />, label: 'Kartalar' },
          { key: 'list' as StudyMode, icon: <RotateCw size={14} />, label: 'Ro\'yxat' },
          { key: 'quiz' as StudyMode, icon: <Brain size={14} />, label: 'Test' },
          { key: 'ai-practice' as StudyMode, icon: <MessageCircle size={14} />, label: 'AI Amaliyot' },
        ]).map(m => (
          <button
            key={m.key}
            onClick={() => { setStudyMode(m.key); if (m.key === 'quiz') { setQuizAnswers({}); setQuizChecked(false) } }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              studyMode === m.key
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* ── CARDS MODE ─────────────────────────────────────────────────── */}
      {studyMode === 'cards' && (
        <div className="space-y-3">
          {/* Card navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentCardIndex(i => Math.max(0, i - 1))}
              disabled={currentCardIndex === 0}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-gray-500">{currentCardIndex + 1} / {vocabulary.length}</span>
            <button
              onClick={() => setCurrentCardIndex(i => Math.min(vocabulary.length - 1, i + 1))}
              disabled={currentCardIndex === vocabulary.length - 1}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Active card */}
          {vocabulary[currentCardIndex] && (() => {
            const v = vocabulary[currentCardIndex]
            const isFlipped = flipped === v.word
            const isLearned = learned.has(v.word)

            return (
              <div
                className="cursor-pointer perspective-1000"
                onClick={() => setFlipped(isFlipped ? null : v.word)}
              >
                <div className={`relative transition-transform duration-500 transform-style-3d ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                  {/* Front */}
                  <div className={`backface-hidden rounded-2xl p-6 sm:p-8 text-center min-h-[220px] flex flex-col items-center justify-center border-2 transition-all ${
                    isLearned
                      ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/15 dark:to-teal-900/10 border-green-300 dark:border-green-700 shadow-green-100 dark:shadow-green-900/20'
                      : 'bg-gradient-to-br from-white via-gray-50 to-primary-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-primary-900/10 border-gray-200 dark:border-gray-700 shadow-gray-100 dark:shadow-gray-900/20'
                  } shadow-lg`}>
                    {isLearned && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[10px] font-bold">
                          <Check size={10} /> O'rganilgan
                        </span>
                      </div>
                    )}
                    <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-gray-100 mb-2 tracking-tight">{v.word}</p>
                    <p className="text-base text-gray-500 dark:text-gray-400 font-medium">{v.meaning}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] text-gray-400">
                      <Sparkles size={10} />
                      Bosib misolni ko'ring
                    </div>
                  </div>

                  {/* Back */}
                  <div className="backface-hidden [transform:rotateY(180deg)] absolute inset-0 rounded-2xl p-6 sm:p-8 flex flex-col justify-center min-h-[220px] bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 dark:from-primary-900/20 dark:via-indigo-900/15 dark:to-purple-900/10 border-2 border-primary-300 dark:border-primary-700 shadow-lg">
                    <p className="text-sm font-bold text-primary-600 dark:text-primary-400 mb-3 uppercase tracking-wide">Misol</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 italic leading-relaxed">"{v.example}"</p>
                    {v.translation && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-primary-200/50 dark:border-primary-800/30">→ {v.translation}</p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-center gap-3 mt-3">
                  <button
                    onClick={e => { e.stopPropagation(); speakWord(v.word) }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all text-xs font-bold active:scale-95"
                  >
                    <Volume2 size={14} /> Eshitish
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); toggleLearned(v.word) }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      isLearned
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600'
                    }`}
                  >
                    <Check size={14} /> {isLearned ? 'O\'rganilgan' : 'O\'rgandim'}
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setCurrentCardIndex(Math.floor(Math.random() * vocabulary.length)) }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-600 transition-all text-xs font-bold active:scale-95"
                  >
                    <Shuffle size={14} /> Tasodifiy
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* ── LIST MODE ──────────────────────────────────────────────────── */}
      {studyMode === 'list' && (
        <div className="space-y-2">
          {vocabulary.map((v, idx) => {
            const isLearned = learned.has(v.word)
            return (
              <div
                key={v.word}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all group ${
                  isLearned
                    ? 'bg-green-50/80 dark:bg-green-900/15 border-green-200/70 dark:border-green-800/50'
                    : 'bg-white dark:bg-gray-800 border-gray-200/70 dark:border-gray-700/50 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm'
                }`}
              >
                {/* Number */}
                <span className="shrink-0 w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black text-gray-400 dark:text-gray-500">
                  {idx + 1}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{v.word}</p>
                    {isLearned && <Check size={12} className="text-green-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{v.meaning}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 italic">"{v.example}"</p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => speakWord(v.word)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    <Volume2 size={13} />
                  </button>
                  <button
                    onClick={() => toggleLearned(v.word)}
                    className={`p-1.5 rounded-lg transition-colors ${isLearned ? 'text-green-600 bg-green-100 dark:bg-green-900/40' : 'text-gray-400 hover:text-green-600'}`}
                  >
                    <Check size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── QUIZ MODE ──────────────────────────────────────────────────── */}
      {studyMode === 'quiz' && (
        <div className="space-y-3">
          {/* Quiz score header */}
          {quizChecked && (
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${
              quizScore === vocabulary.length
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/15 border-green-200 dark:border-green-800'
                : quizScore >= vocabulary.length * 0.7
                  ? 'bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/15 border-primary-200 dark:border-primary-800'
                  : 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/15 border-amber-200 dark:border-amber-800'
            }`}>
              <Trophy size={24} className={quizScore === vocabulary.length ? 'text-green-600' : quizScore >= vocabulary.length * 0.7 ? 'text-primary-600' : 'text-amber-600'} />
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">
                  {quizScore}/{vocabulary.length} to'g'ri
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {quizScore === vocabulary.length ? 'Ajoyib! Barchasini to\'g\'ri aytdingiz!' : quizScore >= vocabulary.length * 0.7 ? 'Yaxshi natija! Davom eting!' : 'Ko\'proq mashq qiling!'}
                </p>
              </div>
            </div>
          )}

          {/* Quiz questions */}
          {quizQuestions.map((q, qi) => {
            const selected = quizAnswers[qi]
            const isCorrect = quizChecked && selected === q.correctIndex
            const isWrong = quizChecked && selected !== undefined && selected !== q.correctIndex

            return (
              <div key={qi} className={`rounded-xl border p-4 transition-all ${
                isCorrect ? 'bg-green-50 dark:bg-green-900/15 border-green-200 dark:border-green-800' :
                isWrong ? 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800' :
                'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-black mr-2">
                    {qi + 1}
                  </span>
                  <span className="text-primary-600 dark:text-primary-400 font-black">{q.word}</span> — nimani anglatadi?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = selected === oi
                    const isThisCorrect = quizChecked && oi === q.correctIndex

                    return (
                      <button
                        key={oi}
                        onClick={() => handleQuizAnswer(qi, oi)}
                        disabled={quizChecked}
                        className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                          isThisCorrect
                            ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                            : isSelected && isWrong
                              ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'
                              : isSelected
                                ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-800 dark:text-primary-200'
                                : 'bg-gray-50 dark:bg-gray-750 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Quiz actions */}
          <div className="flex gap-2">
            {!quizChecked ? (
              <button
                onClick={checkQuiz}
                disabled={Object.keys(quizAnswers).length < vocabulary.length}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm disabled:opacity-40 hover:from-primary-700 hover:to-primary-800 transition-all active:scale-[0.98]"
              >
                <Sparkles size={16} /> Tekshirish
              </button>
            ) : (
              <button
                onClick={resetQuiz}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
              >
                <RotateCw size={16} /> Qayta sinash
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── AI PRACTICE MODE ─────────────────────────────────────────────── */}
      {studyMode === 'ai-practice' && (
        <VocabPracticeChat vocabulary={vocabulary} />
      )}
    </div>
  )
}
