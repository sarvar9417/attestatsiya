import { useState, useCallback } from 'react'
import type { PersonalWord, VocabRating, PartOfSpeech } from '../../types/personalVocabulary'
import { getTodayTashkent } from '../../utils/tashkentDate'
import { Trash2, Clock, CheckCircle2, XCircle, Pencil, Volume2, ChevronDown, ChevronUp, Target, BookOpen } from 'lucide-react'
import { speakNatural } from '../../lib/openaiTts'

interface WordListProps {
  words: PersonalWord[]
  onDelete: (id: number) => void
  onRate: (id: number, rating: VocabRating) => void
  onEdit?: (word: PersonalWord) => void
  onWordClick?: (word: PersonalWord) => void
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  custom: { label: 'Shaxsiy', color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800' },
  grammar: { label: 'Grammar', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  travel: { label: 'Travel', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  formal: { label: 'Formal', color: 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800' },
  ielts: { label: 'IELTS', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
  business: { label: 'Business', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  food: { label: 'Food', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
  health: { label: 'Health', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
  education: { label: 'Education', color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
  social: { label: 'Social', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800' },
  work: { label: 'Work', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
  shopping: { label: 'Shopping', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
  relationships: { label: 'Relationships', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' },
  environment: { label: 'Environment', color: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-800' },
  economy: { label: 'Economy', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' },
  culture: { label: 'Culture', color: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800' },
  feelings: { label: 'Feelings', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
  discussion: { label: 'Discussion', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
  technology: { label: 'Technology', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600' },
  communication: { label: 'Communication', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
}

const POS_LABELS: Record<PartOfSpeech, string> = {
  noun: 'Ot', verb: "Fe'l", adjective: 'Sifat', adverb: 'Ravish',
  preposition: 'Predlog', conjunction: 'Bog\'lovchi', pronoun: 'O\'zlik',
  interjection: 'Undov', other: 'Boshqa',
}

const POS_COLORS: Record<PartOfSpeech, string> = {
  noun: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  verb: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  adjective: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  adverb: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  preposition: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  conjunction: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  pronoun: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  interjection: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  other: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
}

function getDaysUntilReview(nextReview: string): number {
  const today = new Date(getTodayTashkent())
  const reviewDate = new Date(nextReview)
  const diffTime = reviewDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function getDueStatus(nextReview: string, isLearned: boolean): { label: string; color: string; bgBadge: string } {
  if (isLearned) return { label: 'O\'rganilgan', color: 'text-green-600 dark:text-green-400', bgBadge: 'bg-green-50 dark:bg-green-900/20' }
  const days = getDaysUntilReview(nextReview)
  if (days <= 0) return { label: 'Muddati o\'tgan', color: 'text-red-600 dark:text-red-400', bgBadge: 'bg-red-50 dark:bg-red-900/20' }
  if (days <= 2) return { label: `${days} kun`, color: 'text-orange-600 dark:text-orange-400', bgBadge: 'bg-orange-50 dark:bg-orange-900/20' }
  return { label: `${days} kun`, color: 'text-gray-500 dark:text-gray-400', bgBadge: 'bg-gray-50 dark:bg-gray-800/50' }
}

function getMasteryLevel(box: number, correctCount: number, totalCount: number): { pct: number; label: string; color: string } {
  const basePct = Math.min(box * 16, 80)
  const accuracyPct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
  const pct = Math.min(basePct + Math.round(accuracyPct * 0.2), 100)
  if (pct >= 90) return { pct, label: 'Mukammal', color: 'bg-green-500' }
  if (pct >= 70) return { pct, label: 'Yaxshi', color: 'bg-emerald-500' }
  if (pct >= 40) return { pct, label: 'O\'rta', color: 'bg-amber-500' }
  return { pct, label: 'Boshlang\'ich', color: 'bg-gray-400 dark:bg-gray-500' }
}

export default function WordList({ words, onDelete, onRate, onEdit, onWordClick }: WordListProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [speakingWordId, setSpeakingWordId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const speakWord = useCallback((word: PersonalWord) => {
    setSpeakingWordId(word.id)
    speakNatural(word.english, 0.9).catch(() => {}).finally(() => {
      setSpeakingWordId(null)
    })
  }, [])

  const speakExample = useCallback((word: PersonalWord) => {
    if (!word.example) return
    setSpeakingWordId(word.id)
    speakNatural(word.example, 0.9).catch(() => {}).finally(() => {
      setSpeakingWordId(null)
    })
  }, [])

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <BookOpen size={36} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-lg font-medium">Hech narsa topilmadi</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Boshqa qidiruv so'zini sinab ko'ring</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {words.map((word, index) => {
        const dueStatus = getDueStatus(word.next_review, word.is_learned)
        const mastery = getMasteryLevel(word.box, word.correct_count, word.correct_count + word.wrong_count)
        const categoryInfo = CATEGORY_LABELS[word.category] || { label: word.category, color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600' }
        const isExpanded = expandedId === word.id
        const totalAttempts = word.correct_count + word.wrong_count

        return (
          <div
            key={word.id}
            onClick={() => onWordClick?.(word)}
            onKeyDown={(event) => {
              if (onWordClick && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault()
                onWordClick(word)
              }
            }}
            role={onWordClick ? 'group' : undefined}
            tabIndex={onWordClick ? 0 : undefined}
            aria-label={onWordClick ? `${word.english} so'zi tafsilotlarini ochish` : undefined}
            className="group bg-white dark:bg-gray-800/90 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {/* Main Content */}
            <div className="p-4">
              {/* Status Bar */}
              <div className="flex items-center gap-2 mb-3">
                {/* Mastery Bar */}
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${mastery.color}`}
                    style={{ width: `${mastery.pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {mastery.label} · Box {word.box}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Word Header */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleExpand(word.id) }}
                      className="flex items-center gap-1.5 group/word cursor-pointer"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover/word:text-primary-600 dark:group-hover/word:text-primary-400 transition-colors truncate">
                        {word.english}
                      </h3>
                      {word.phonetic && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic font-normal hidden sm:inline">
                          {word.phonetic}
                        </span>
                      )}
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); speakWord(word) }}
                        className={`p-1.5 rounded-lg transition-all duration-200 ${
                          speakingWordId === word.id
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-500 scale-110'
                            : 'text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500 hover:scale-105'
                        }`}
                        title="Talaffuzni eshitish"
                      >
                        <Volume2 size={15} />
                      </button>
                      {word.is_learned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-medium border border-green-200 dark:border-green-800">
                          <CheckCircle2 size={10} />
                          O'rganilgan
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Uzbek Translation */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                    {word.uzbek}
                  </p>

                  {/* Example Sentence */}
                  {word.example && (
                    <div className="space-y-1 mb-2.5">
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic leading-relaxed">
                        &ldquo;{word.example.length > 80 ? `${word.example.slice(0, 80)}...` : word.example}&rdquo;
                        <button
                          onClick={(e) => { e.stopPropagation(); speakExample(word) }}
                          className={`inline-flex items-center ml-1 p-0.5 rounded transition-all align-middle ${
                            speakingWordId === word.id
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-500 scale-110'
                              : 'text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500'
                          }`}
                          title="Misol gapni eshitish"
                        >
                          <Volume2 size={13} />
                        </button>
                      </p>
                      {word.example_uzbek && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 not-italic leading-relaxed">
                          📖 {word.example_uzbek}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tags Row */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Level Badge */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 uppercase tracking-wider">
                      {word.level}
                    </span>

                    {/* Category Badge */}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${categoryInfo.color}`}>
                      {categoryInfo.label}
                    </span>

                    {/* Part of Speech Badge */}
                    {word.part_of_speech && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${POS_COLORS[word.part_of_speech]}`}>
                        {POS_LABELS[word.part_of_speech]}
                      </span>
                    )}

                    {/* Due Status Badge */}
                    {!word.is_learned && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                        dueStatus.color.includes('red') 
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : dueStatus.color.includes('orange')
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      } ${dueStatus.color}`}>
                        <Clock size={10} />
                        {dueStatus.label}
                      </span>
                    )}

                    {/* Attempts Badge */}
                    {totalAttempts > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        <Target size={10} />
                        {word.correct_count}/{totalAttempts}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons Column */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  {/* Rating buttons */}
                  {!word.is_learned && (
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); onRate(word.id, 'bildim') }}
                        className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 hover:scale-105 transition-all active:scale-95"
                        title="Bildim"
                      >
                        <CheckCircle2 size={15} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRate(word.id, 'bilmadim') }}
                        className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:scale-105 transition-all active:scale-95"
                        title="Bilmadim"
                      >
                        <XCircle size={15} />
                      </button>
                    </div>
                  )}

                  {/* Edit / Delete buttons */}
                  <div className="flex gap-1">
                    {onEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(word) }}
                        className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 transition-all active:scale-95"
                        title="Tahrirlash"
                      >
                        <Pencil size={15} />
                      </button>
                    )}
                    {deleteConfirmId === word.id ? (
                      <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 rounded-lg p-0.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(word.id); setDeleteConfirmId(null) }}
                          className="p-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-all text-[10px] font-medium px-2"
                        >
                          Ha
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null) }}
                          className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all text-[10px] font-medium px-2"
                        >
                          Yo'q
                        </button>
                      </div>
                    ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(word.id) }}
                      className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:scale-105 transition-all active:scale-95"
                      title="O'chirish"
                    >
                      <Trash2 size={15} />
                    </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expand Toggle */}
              {totalAttempts > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggleExpand(word.id) }}
                  className="mt-2 flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {isExpanded ? 'Yashirish' : 'Statistika'}
                </button>
              )}
            </div>

            {/* Expanded Stats Section */}
            {isExpanded && totalAttempts > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-700/50 px-4 py-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-b-xl">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{word.correct_count}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">To'g'ri</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">{word.wrong_count}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Xato</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {totalAttempts > 0 ? Math.round((word.correct_count / totalAttempts) * 100) : 0}%
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aniqlik</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Entrance animation */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .group {
          animation: slideUp 0.3s ease-out both;
        }
      `}</style>
    </div>
  )
}
