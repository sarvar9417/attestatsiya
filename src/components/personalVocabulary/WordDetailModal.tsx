import { useState, useEffect, useRef, useCallback } from 'react'
import type { PersonalWord, PartOfSpeech, VocabCategory, VocabRating } from '../../types/personalVocabulary'
import {
  X, Volume2, Check, Pencil, Star, Clock,
  Brain, Target, TrendingUp, Layers,
  Trash2, Save, AlertTriangle
} from 'lucide-react'
import { speakNatural } from '../../lib/openaiTts'
import { supabase } from '../../lib/supabase'
import type { PersonalVocabSession } from '../../types/personalVocabulary'

interface WordDetailModalProps {
  word: PersonalWord
  onClose: () => void
  onRate: (id: number, rating: VocabRating) => void
  onEdit: (id: number, updates: Partial<PersonalWord>) => void
  onDelete: (id: number) => void
}

const RATING_ACTIONS: { value: VocabRating; label: string; color: string }[] = [
  { value: 'bilmadim', label: 'Unutdim', color: 'bg-red-500 hover:bg-red-600 text-white' },
  { value: 'qiynaldim', label: 'Qiynaldim', color: 'bg-amber-500 hover:bg-amber-600 text-white' },
  { value: 'bildim', label: 'Bildim', color: 'bg-blue-500 hover:bg-blue-600 text-white' },
  { value: 'yodladim', label: 'Yodladim', color: 'bg-green-500 hover:bg-green-600 text-white' },
]

const CATEGORIES_FOR_SELECT: { value: string; label: string }[] = [
  { value: 'custom', label: "Shaxsiy" }, { value: 'grammar', label: 'Grammar' },
  { value: 'travel', label: 'Travel' }, { value: 'formal', label: 'Formal' },
  { value: 'ielts', label: 'IELTS' }, { value: 'business', label: 'Business' },
  { value: 'food', label: 'Food' }, { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' }, { value: 'social', label: 'Social' },
  { value: 'work', label: 'Work' }, { value: 'shopping', label: 'Shopping' },
  { value: 'relationships', label: 'Relationships' }, { value: 'environment', label: 'Environment' },
  { value: 'economy', label: 'Economy' }, { value: 'culture', label: 'Culture' },
  { value: 'feelings', label: 'Feelings' }, { value: 'discussion', label: 'Discussion' },
  { value: 'technology', label: 'Technology' }, { value: 'communication', label: 'Communication' },
]

const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const
const POS_OPTIONS: { value: PartOfSpeech; label: string }[] = [
  { value: 'noun', label: 'Ot' }, { value: 'verb', label: "Fe'l" },
  { value: 'adjective', label: 'Sifat' }, { value: 'adverb', label: 'Ravish' },
  { value: 'preposition', label: 'Predlog' }, { value: 'conjunction', label: "Bog'lovchi" },
  { value: 'pronoun', label: "O'zlik" }, { value: 'interjection', label: 'Undov' },
  { value: 'other', label: 'Boshqa' },
]

function getMasteryColor(box: number, learned: boolean): string {
  if (learned && box >= 6) return 'text-green-600 dark:text-green-400'
  if (box >= 4) return 'text-emerald-600 dark:text-emerald-400'
  if (box >= 2) return 'text-amber-600 dark:text-amber-400'
  return 'text-gray-500 dark:text-gray-400'
}

function getMasteryLabel(box: number, learned: boolean): string {
  if (learned && box >= 6) return "O'zlashtirilgan"
  if (box >= 4) return 'Mustahkam'
  if (box >= 2) return "O'rganilmoqda"
  return 'Yangi'
}

export default function WordDetailModal({ word, onClose, onRate, onEdit, onDelete }: WordDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editEnglish, setEditEnglish] = useState(word.english)
  const [editUzbek, setEditUzbek] = useState(word.uzbek)
  const [editExample, setEditExample] = useState(word.example || '')
  const [editExampleUzbek, setEditExampleUzbek] = useState(word.example_uzbek || '')
  const [editPhonetic, setEditPhonetic] = useState(word.phonetic || '')
  const [editCategory, setEditCategory] = useState(word.category)
  const [editLevel, setEditLevel] = useState(word.level)
  const [editPos, setEditPos] = useState(word.part_of_speech || '')
  const [saving, setSaving] = useState(false)
  const [sessions, setSessions] = useState<PersonalVocabSession[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const totalAttempts = word.correct_count + word.wrong_count
  const accuracy = totalAttempts > 0 ? Math.round((word.correct_count / totalAttempts) * 100) : 0

  // Load session history
  useEffect(() => {
    let cancelled = false
    supabase
      .from('personal_vocabulary_sessions')
      .select('*')
      .eq('vocab_id', word.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (!cancelled) {
          setSessions((data ?? []) as PersonalVocabSession[])
          setLoadingSessions(false)
        }
        if (!cancelled && !data) setLoadingSessions(false)
      })
    return () => { cancelled = true }
  }, [word.id])

  // Close on Escape
  useEffect(() => {
    modalRef.current?.focus()
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Close on backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  const handleSave = async () => {
    setSaving(true)
    await onEdit(word.id, {
      english: editEnglish.trim(),
      uzbek: editUzbek.trim(),
      phonetic: editPhonetic.trim() || null,
      example: editExample.trim() || null,
      example_uzbek: editExampleUzbek.trim() || null,
      category: editCategory as VocabCategory,
      level: editLevel as 'A1' | 'A2' | 'B1' | 'B2',
      part_of_speech: (editPos || null) as PartOfSpeech | null,
    })
    setSaving(false)
    setIsEditing(false)
  }

  const handleSpeak = useCallback((text: string) => {
    speakNatural(text, 0.9).catch(() => {})
  }, [])

  const srsHealth = word.fsrs_stability 
    ? word.fsrs_stability >= 30 ? 'bg-green-500' 
      : word.fsrs_stability >= 10 ? 'bg-amber-500' 
      : 'bg-red-500'
    : 'bg-gray-400'

  const statCard = (label: string, value: string, icon: React.ReactNode, color: string) => (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5 text-center">
      <div className="flex items-center justify-center gap-1 mb-0.5">
        <span className={color}>{icon}</span>
        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{value}</span>
      </div>
      <div className="text-[10px] text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  )

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-6 overflow-y-auto bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="personal-word-dialog-title"
        tabIndex={-1}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-scale-in overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-500/10 via-primary-400/5 to-transparent dark:from-primary-900/20 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isEditing ? (
                  <input
                    value={editEnglish}
                    onChange={e => setEditEnglish(e.target.value)}
                    className="text-xl font-bold bg-transparent border-b-2 border-primary-500 focus:outline-none text-gray-900 dark:text-gray-100 w-full"
                    autoFocus
                  />
                ) : (
                  <h2 id="personal-word-dialog-title" className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{word.english}</h2>
                )}
                <button 
                  onClick={() => handleSpeak(word.english)}
                  aria-label={`${word.english} talaffuzini eshitish`}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500 transition-all shrink-0"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    value={editUzbek}
                    onChange={e => setEditUzbek(e.target.value)}
                    className="text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-500 text-gray-600 dark:text-gray-400"
                  />
                ) : (
                  <span className="text-sm text-gray-600 dark:text-gray-400">{word.uzbek}</span>
                )}
                {word.phonetic && !isEditing && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 italic">{word.phonetic}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 transition-all"
                  title="Tahrirlash"
                >
                  <Pencil size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              {word.level}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${
              getMasteryColor(word.box, word.is_learned)
            } bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
              <Layers size={10} />
              Box {word.box} · {getMasteryLabel(word.box, word.is_learned)}
            </span>
            {word.part_of_speech && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                {POS_OPTIONS.find(p => p.value === word.part_of_speech)?.label || word.part_of_speech}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Example Sentence */}
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Misol gap</label>
              <textarea
                value={editExample}
                onChange={e => setEditExample(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={2}
                placeholder="Inglizcha misol gap"
              />
              <textarea
                value={editExampleUzbek}
                onChange={e => setEditExampleUzbek(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={2}
                placeholder="O'zbekcha tarjimasi"
              />
            </div>
          ) : (word.example || word.example_uzbek) ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1 border border-gray-100 dark:border-gray-700/50">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Misol gap</p>
              {word.example && (
                <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  &ldquo;{word.example}&rdquo;
                  <button onClick={() => handleSpeak(word.example!)} className="ml-1 p-0.5 text-gray-400 hover:text-primary-500 transition-colors align-middle inline-flex">
                    <Volume2 size={13} />
                  </button>
                </p>
              )}
              {word.example_uzbek && (
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  📖 {word.example_uzbek}
                </p>
              )}
            </div>
          ) : null}

          {/* SRS Stats Grid */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Brain size={13} className="text-violet-500" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">SRS Statistikasi</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {statCard("Barqarorlik", word.fsrs_stability ? `${word.fsrs_stability.toFixed(1)}d` : '—', <Brain size={13} />, 'text-violet-600 dark:text-violet-400')}
              {statCard("Qiyinchilik", word.fsrs_difficulty ? word.fsrs_difficulty.toFixed(1) : '—', <Target size={13} />, 'text-amber-600 dark:text-amber-400')}
              {statCard("Takrorlar", String(word.fsrs_reps ?? 0), <TrendingUp size={13} />, 'text-blue-600 dark:text-blue-400')}
              {statCard("Unutishlar", String(word.fsrs_lapses ?? 0), <AlertTriangle size={13} />, 'text-red-600 dark:text-red-400')}
            </div>
            {/* SRS Health Bar */}
            {word.fsrs_stability && word.fsrs_stability > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <span className="text-gray-500 dark:text-gray-400">Xotira barqarorligi</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{word.fsrs_stability.toFixed(1)} kun</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${srsHealth}`} style={{ width: `${Math.min((word.fsrs_stability / 90) * 100, 100)}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Performance Stats */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Target size={13} className="text-green-500" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Natijalar</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {statCard("To'g'ri", String(word.correct_count), <Star size={13} />, 'text-green-600 dark:text-green-400')}
              {statCard("Xato", String(word.wrong_count), <X size={13} />, 'text-red-600 dark:text-red-400')}
              {statCard("Aniqlik", `${accuracy}%`, <Check size={13} />, 'text-primary-600 dark:text-primary-400')}
            </div>
          </div>

          {/* Recent Session History */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Clock size={13} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">So'nggi takrorlashlar</span>
            </div>
            {loadingSessions ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sessions.length > 0 ? (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {sessions.slice(0, 10).map(s => (
                  <div key={s.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${s.result === 'correct' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={s.result === 'correct' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                        {s.result === 'correct' ? "To'g'ri" : 'Xato'}
                      </span>
                      {s.rating && (
                        <span className="text-gray-400 dark:text-gray-500">· {s.rating}</span>
                      )}
                    </div>
                    <span className="text-gray-400 dark:text-gray-500">
                      {new Date(s.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-3">
                Hali takrorlashlar yo'q
              </p>
            )}
          </div>

          {/* Editing fields for category/level/POS */}
          {isEditing && (
            <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Kategoriya</label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as VocabCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                  >
                    {CATEGORIES_FOR_SELECT.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Daraja</label>
                  <select
                    value={editLevel}
                    onChange={e => setEditLevel(e.target.value as 'A1' | 'A2' | 'B1' | 'B2')}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                  >
                    {LEVELS.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">So'z turi</label>
                  <select
                    value={editPos}
                    onChange={e => setEditPos(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">—</option>
                    {POS_OPTIONS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Fonetik</label>
                  <input
                    value={editPhonetic}
                    onChange={e => setEditPhonetic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                    placeholder="/wɜːrd/"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}  
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !editEnglish.trim() || !editUzbek.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : <Save size={16} />}
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Bekor qilish
              </button>
              <div className="ml-auto">
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { onDelete(word.id); onClose() }}
                      className="px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-all"
                    >
                      Ha, o'chir
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Bekor
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
                    title="O'chirish"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Tez baho:</span>
              {RATING_ACTIONS.map(action => (
                <button
                  key={action.value}
                  onClick={() => onRate(word.id, action.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
