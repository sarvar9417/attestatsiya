import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, LoaderCircle, Save, X } from 'lucide-react'
import {
  getPedguliEditorialReview,
  getAdminQuestionEditor,
  savePedguliEditorialReview,
  type PedguliEditorialCheckInput,
} from '../../features/admin/adminContentApi'

interface Props {
  question: { id: string; stem_md: string; source_reference: string | null; format?: string }
  onClose: () => void
  onSaved: () => void
}
const EMPTY: PedguliEditorialCheckInput = {
  answer_verified: false,
  reference_verified: false,
  wording_verified: false,
  original_authorship_verified: false,
  reviewer_notes: '',
}
const STEPS: { key: keyof Omit<PedguliEditorialCheckInput, 'reviewer_notes'>; label: string; help: string }[] = [
  { key: 'answer_verified', label: 'To‘g‘ri javob tasdiqlandi',
    help: 'Variantlar va javob izohini darslik yoki rasmiy pedagogik manba bilan tekshiring.' },
  { key: 'reference_verified', label: 'Mavzu va manba to‘g‘ri',
    help: 'Savolning M14–M16 konstruktiga mosligi va darsda manba borligini tekshiring.' },
  { key: 'wording_verified', label: 'Matn va variantlar tekshirildi',
    help: 'Noaniq ifodalar, ikki to‘g‘ri javob, noto‘g‘ri variantlar va takrorlarni tekshiring.' },
  { key: 'original_authorship_verified', label: 'Asl kanaldan nusxalanmagan',
    help: 'Mustaqil yozilganini va Telegram savolining ruxsatsiz nusxasi emasligini tekshiring.' },
]

export default function PedguliEditorialModal({ question, onClose, onSaved }: Props) {
  const [input, setInput] = useState<PedguliEditorialCheckInput>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [reviewOptions, setReviewOptions] = useState<Array<{ content_md: string; is_correct: boolean }>>([])
  const [optionLoadError, setOptionLoadError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void getAdminQuestionEditor(question.id).then(data => {
      if (!active) return
      setReviewOptions(data.options.map((option, index) => ({
        content_md: option.content_md,
        is_correct: data.correct_index === index,
      })))
    }).catch(() => {
      if (active) setOptionLoadError('Variantlarni tekshirish uchun ochib bo‘lmadi')
    })
    getPedguliEditorialReview(question.id).then(data => {
      if (active && data.checks) {
        setInput({
          answer_verified: data.checks.answer_verified,
          reference_verified: data.checks.reference_verified,
          wording_verified: data.checks.wording_verified,
          original_authorship_verified: data.checks.original_authorship_verified,
          reviewer_notes: data.checks.reviewer_notes,
        })
      }
    }).catch(err => {
      if (active) setError(err instanceof Error ? err.message : 'Tekshiruv ochilmadi')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [question.id])

  const approved = STEPS.every(step => input[step.key])
  const notesValid = input.reviewer_notes.trim().length >= 20
  const words = reviewOptions.map(option => option.content_md.trim().split(/\s+/u).filter(Boolean).length)
  const maxWords = Math.max(0, ...words)
  const minWords = Math.min(Infinity, ...words)
  const correctWords = reviewOptions.find(option => option.is_correct)?.content_md.trim().split(/\s+/u).filter(Boolean).length
  const wrongLongest = Math.max(0, ...reviewOptions.filter(option => !option.is_correct)
    .map(option => option.content_md.trim().split(/\s+/u).filter(Boolean).length))
  const balanced = question.format !== 'Y1' ||
    (reviewOptions.length === 4 && correctWords !== undefined && minWords > 0 &&
      maxWords <= minWords * 1.8 && correctWords <= wrongLongest * 1.25)

  async function save() {
    setError(null)
    setSaved(false)
    if (!notesValid) {
      setError('Tekshiruv izohi kamida 20 ta belgidan iborat bo‘lishi kerak.')
      return
    }
    setSaving(true)
    try {
      await savePedguliEditorialReview(question.id, input)
      setSaved(true)
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tekshiruv saqlanmadi')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div role="presentation" className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/70 p-3">
      <section role="dialog" aria-modal="true" aria-labelledby="editorial-title"
        className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:bg-gray-900 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="editorial-title" className="text-xl font-bold text-gray-950 dark:text-white">Savolni tahririy tekshirish</h2>
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              {question.source_reference?.startsWith('authored:pedagogy-pdf-corpus:')
                ? 'PDF to‘plamidagi mavzuga asoslangan qayta yozilgan mashq. To‘plam rasmiy imtihon o‘tkazilganining mustaqil dalili emas.'
                : 'Bu original mashq savoli. Telegramdan olingan haqiqiy imtihon savoli deb tasdiqlanmagan.'}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Yopish"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={20}/>
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-gray-800 dark:border-indigo-950 dark:bg-indigo-950/30 dark:text-gray-200">
          <p className="font-medium">{question.stem_md}</p>
          <p className="mt-2 break-all text-xs text-gray-500 dark:text-gray-400">{question.source_reference}</p>
        </div>

        {loading ? (
          <p role="status" className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <LoaderCircle className="animate-spin" size={17}/> Tekshiruv ma’lumotlari yuklanmoqda…
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              <AlertTriangle className="mt-0.5 shrink-0" size={16}/>
              Belgilarni faqat javob va pedagogik manbalarni haqiqatan tekshirganingizdan keyin qo‘ying.
              Savol yoki javob o‘zgartirilsa, avvalgi tasdiq bilan nashr qilib bo‘lmaydi.
            </p>
            {optionLoadError && <p role="alert" className="text-sm text-red-600">{optionLoadError}</p>}
            {reviewOptions.length > 0 && <section aria-label="Javob variantlari auditi" className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
              <h3 className="mb-2 text-sm font-semibold">Javob variantlari va uzunlik balansi</h3>
              <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-200">
                {reviewOptions.map((option, index) => <li key={index} className="flex gap-2">
                  <span className="shrink-0 font-mono">{String.fromCharCode(65+index)}.</span>
                  <span className="flex-1">{option.content_md}</span>
                  <span className="shrink-0 text-gray-500">{words[index]} so‘z</span>
                  {option.is_correct && <span className="shrink-0 font-semibold text-emerald-600">Kalit</span>}
                </li>)}
              </ul>
              {question.format === 'Y1' && <p className={`mt-3 text-xs font-semibold ${balanced ? 'text-emerald-600' : 'text-red-600'}`}>
                {balanced ? 'Variantlar uzunligi nazoratdan o‘tdi' : 'To‘g‘ri javob uzunligi yoki variantlar nisbati talabga mos emas. Oldin savolni tahrirlang.'}
              </p>}
            </section>}
            {STEPS.map(step => (
              <label key={step.key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                <input type="checkbox" checked={input[step.key]} onChange={event => {
                  setSaved(false)
                  setInput(current => ({ ...current, [step.key]: event.target.checked }))
                }} className="mt-1 h-4 w-4 accent-indigo-600" />
                <span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{step.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">{step.help}</span>
                </span>
              </label>
            ))}
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200" htmlFor="editorial-notes">
              Tekshiruv dalillari va izoh (kamida 20 belgi)
            </label>
            <textarea id="editorial-notes" rows={4} maxLength={4000}
              className="input w-full resize-y" value={input.reviewer_notes}
              placeholder="Manba nomi, bo‘lim yoki sahifa; javobni tekshirish asoslari; noaniqliklar…"
              onChange={event => {
                setSaved(false)
                setInput(current => ({ ...current, reviewer_notes: event.target.value }))
              }} />
            {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {saved && <p role="status" className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 size={16}/> Tekshiruv saqlandi. {approved ? 'Savolni endi administrator nashrga tasdiqlashi mumkin.' : 'Barcha tekshiruvlar hali tugallanmagan.'}
            </p>}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-xs text-gray-500">{approved ? '4/4 tekshiruv belgilandi' : 'Tekshiruv to‘liq yakunlanmagan'}</p>
              <button type="button" onClick={() => void save()}
                disabled={saving || !notesValid || (approved && (!balanced || !!optionLoadError))} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                <Save size={16}/>{saving ? 'Saqlanmoqda…' : 'Tekshiruvni saqlash'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
