import { useState, useMemo, useRef } from 'react'
import type { AddWordDTO, VocabCategory, PartOfSpeech, PersonalWord } from '../../types/personalVocabulary'
import { Sparkles, Loader2, Eye, EyeOff, CheckCircle2, BookMarked } from 'lucide-react'
import { monitoring } from '../../lib/monitoring'

interface AddWordFormProps {
  onAdd: (wordData: AddWordDTO) => Promise<void>
  onCancel: () => void
  onAITranslate: (word: string, context?: string) => Promise<{ uzbek: string; phonetic?: string; example?: string; example_uzbek?: string; level?: 'A1' | 'A2' | 'B1' | 'B2'; category?: string; part_of_speech?: string }>
  editWord?: Pick<PersonalWord, 'english' | 'uzbek' | 'phonetic' | 'example' | 'example_uzbek' | 'category' | 'level' | 'part_of_speech'> | null
}

const CATEGORIES: { value: VocabCategory; label: string; icon: string }[] = [
  { value: 'custom', label: 'Shaxsiy', icon: '📝' },
  { value: 'grammar', label: 'Grammar', icon: '📚' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'formal', label: 'Formal', icon: '👔' },
  { value: 'ielts', label: 'IELTS', icon: '🎯' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'health', label: 'Health', icon: '💪' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'social', label: 'Social', icon: '🤝' },
  { value: 'work', label: 'Work', icon: '🏢' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'relationships', label: 'Relationships', icon: '💕' },
  { value: 'environment', label: 'Environment', icon: '🌿' },
  { value: 'economy', label: 'Economy', icon: '📊' },
  { value: 'culture', label: 'Culture', icon: '🎭' },
  { value: 'feelings', label: 'Feelings', icon: '😊' },
  { value: 'discussion', label: 'Discussion', icon: '💬' },
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'communication', label: 'Communication', icon: '📡' },
]

const VALID_CATEGORIES = new Set(CATEGORIES.map(c => c.value))

const LEVELS = [
  { value: 'A1', label: 'A1 - Boshlang\'ich', description: '200+ basic words' },
  { value: 'A2', label: 'A2 - Elementar', description: '400+ everyday words' },
  { value: 'B1', label: 'B1 - O\'rta', description: '800+ intermediate' },
  { value: 'B2', label: 'B2 - Yuqori o\'rta', description: '1200+ advanced' },
]

const VALID_LEVELS = new Set(['A1', 'A2', 'B1', 'B2'])

const PARTS_OF_SPEECH: { value: PartOfSpeech; label: string; color: string }[] = [
  { value: 'noun', label: 'Ot (Noun)', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { value: 'verb', label: "Fe'l (Verb)", color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { value: 'adjective', label: 'Sifat (Adjective)', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  { value: 'adverb', label: 'Ravish (Adverb)', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  { value: 'preposition', label: 'Predlog (Preposition)', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' },
  { value: 'conjunction', label: "Bog'lovchi (Conjunction)", color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' },
  { value: 'pronoun', label: "O'zlik (Pronoun)", color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' },
  { value: 'interjection', label: 'Undov (Interjection)', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
  { value: 'other', label: 'Boshqa (Other)', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' },
]

const VALID_POS = new Set(PARTS_OF_SPEECH.map(p => p.value))

export default function AddWordForm({ onAdd, onCancel, onAITranslate, editWord }: AddWordFormProps) {
  const [english, setEnglish] = useState(editWord?.english || '')
  const [uzbek, setUzbek] = useState(editWord?.uzbek || '')
  const [phonetic, setPhonetic] = useState(editWord?.phonetic || '')
  const [example, setExample] = useState(editWord?.example || '')
  const [exampleUzbek, setExampleUzbek] = useState(editWord?.example_uzbek || '')
  const [category, setCategory] = useState<VocabCategory>(editWord?.category || 'custom')
  const [level, setLevel] = useState<'A1' | 'A2' | 'B1' | 'B2'>(editWord?.level || 'A2')
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech>(editWord?.part_of_speech || 'other')
  const categoryUserSet = useRef(!!editWord)
  const [aiLoading, setAiLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const isEditing = !!editWord

  const handleAITranslate = async () => {
    if (!english.trim()) return
    setAiLoading(true)
    try {
      const categoryLabel = CATEGORIES.find(c => c.value === category)?.label || category
      const result = await onAITranslate(english, categoryLabel)
      if (result.uzbek && !uzbek) setUzbek(result.uzbek)
      if (result.phonetic && !phonetic) setPhonetic(result.phonetic)
      if (result.example && !example) setExample(result.example)
      if (result.example_uzbek && !exampleUzbek) setExampleUzbek(result.example_uzbek)
      if (result.level && VALID_LEVELS.has(result.level)) setLevel(result.level)
      if (result.part_of_speech && VALID_POS.has(result.part_of_speech as PartOfSpeech)) setPartOfSpeech(result.part_of_speech as PartOfSpeech)
      if (!categoryUserSet.current && result.category && VALID_CATEGORIES.has(result.category as VocabCategory)) setCategory(result.category as VocabCategory)
    } catch (e) {
      monitoring.captureMessage('AI translation failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!english.trim() || !uzbek.trim()) return
    setSubmitting(true)
    try {
      await onAdd({
        english: english.trim(),
        uzbek: uzbek.trim(),
        phonetic: phonetic.trim() || (isEditing ? null : undefined),
        example: example.trim() || (isEditing ? null : undefined),
        example_uzbek: exampleUzbek.trim() || (isEditing ? null : undefined),
        category,
        level,
        part_of_speech: partOfSpeech,
        source: 'manual',
      })
    } catch (e) {
      monitoring.captureMessage('Add word failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = english.trim() && uzbek.trim()
  const wordCount = english.trim() ? english.trim().split(/\s+/).length : 0

  // Live preview state
  const previewWord = useMemo(() => ({
    english: english || 'example',
    uzbek: uzbek || 'tarjima',
    phonetic: phonetic || undefined,
    example: example || undefined,
    example_uzbek: exampleUzbek || undefined,
    level,
    category,
    part_of_speech: partOfSpeech,
  }), [english, uzbek, phonetic, example, exampleUzbek, level, category, partOfSpeech])

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <BookMarked size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {isEditing ? "So'zni tahrirlash" : "Yangi so'z qo'shish"}
            </h3>
            <p className="text-sm text-white/70">
              {isEditing ? "So'z ma'lumotlarini yangilang" : "Lug'atingizga yangi so'z qo'shing"}
            </p>
          </div>
        </div>
        {/* Quick stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <CheckCircle2 size={12} />
            {wordCount > 0 ? `${wordCount} so'z` : 'Hali so\'z kiritilmagan'}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <Sparkles size={12} />
            AI yordam
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800/90 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 space-y-5">
        {/* English Word + AI */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Inglizcha so'z <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                placeholder="Masalan: serendipity"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-shadow"
                required
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={handleAITranslate}
              disabled={aiLoading || !english.trim()}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm"
            >
              {aiLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Tarjima qilinmoqda...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span className="text-sm">AI</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            AI tugmasi so'zni avtomatik tarjima qiladi va ma'lumotlarni to'ldiradi
          </p>
        </div>

        {/* Uzbek Translation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            O'zbekcha tarjima <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={uzbek}
            onChange={(e) => setUzbek(e.target.value)}
            placeholder="Masalan: kutilmagan baxt"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-shadow"
            required
          />
        </div>

        {/* Phonetic */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Fonetik <span className="text-gray-400 dark:text-gray-500 font-normal">(ixtiyoriy)</span>
          </label>
          <input
            type="text"
            value={phonetic}
            onChange={(e) => setPhonetic(e.target.value)}
            placeholder="Masalan: /ˌserənˈdɪpəti/"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-shadow font-mono text-sm"
          />
        </div>

        {/* Example */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Misol gap (inglizcha) <span className="text-gray-400 dark:text-gray-500 font-normal">(ixtiyoriy)</span>
            </label>
            <input
              type="text"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="Masalan: Finding that rare book was a moment of serendipity."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Misol gap (o'zbekcha) <span className="text-gray-400 dark:text-gray-500 font-normal">(ixtiyoriy)</span>
            </label>
            <input
              type="text"
              value={exampleUzbek}
              onChange={(e) => setExampleUzbek(e.target.value)}
              placeholder="Masalan: Nodir kitobni topish bir lahzalik omad edi."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-shadow"
            />
          </div>
        </div>

        {/* Category, Level & Part of Speech */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Kategoriya
            </label>
            <select
              value={category}
              onChange={(e) => { categoryUserSet.current = true; setCategory(e.target.value as VocabCategory) }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-shadow appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Daraja
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as 'A1' | 'A2' | 'B1' | 'B2')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-shadow appearance-none"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              So'z turi
            </label>
            <select
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value as PartOfSpeech)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-shadow appearance-none"
            >
              {PARTS_OF_SPEECH.map((pos) => (
                <option key={pos.value} value={pos.value}>{pos.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preview Toggle */}
      {(english || uzbek) && (
        <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Eye size={16} />
              {showPreview ? 'Ko\'rinishni yashirish' : 'Ko\'rinishni oldindan ko\'rish'}
            </div>
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {showPreview && (
            <div className="px-5 pb-5 animate-fadeIn">
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{previewWord.english}</span>
                  {previewWord.phonetic && (
                    <span className="text-xs text-gray-400 italic">{previewWord.phonetic}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{previewWord.uzbek}</p>
                {previewWord.example && (
                  <div className="space-y-1 mb-2">
                    <p className="text-xs text-gray-400 italic">&ldquo;{previewWord.example}&rdquo;</p>
                    {previewWord.example_uzbek && (
                      <p className="text-xs text-gray-500 not-italic">📖 {previewWord.example_uzbek}</p>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">{previewWord.level}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{CATEGORIES.find(c => c.value === previewWord.category)?.icon} {CATEGORIES.find(c => c.value === previewWord.category)?.label || previewWord.category}</span>
                  {previewWord.part_of_speech && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${PARTS_OF_SPEECH.find(p => p.value === previewWord.part_of_speech)?.color || ''}`}>
                      {PARTS_OF_SPEECH.find(p => p.value === previewWord.part_of_speech)?.label.split(' (')[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-primary-500/20"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Saqlanmoqda...
            </span>
          ) : (
            isEditing ? "Saqlash" : "So'zni qo'shish"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
        >
          Bekor qilish
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </form>
  )
}
