import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileQuestion,
  Info,
  Save,
  X,
} from 'lucide-react'
import { typedSupabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import type { Json } from '../../lib/database.types'

type Format = 'Y1' | 'Y2' | 'Y3'
type Cognitive = 'bilish' | 'qollash' | 'mulohaza'
type ContentStatus = 'draft' | 'review' | 'published' | 'archived'

interface ConstructRow {
  id: string
  code: string
  title_uz: string
  subject_id: string
  group_code: string
}

interface SubjectRow {
  id: string
  code: string
  name_uz: string
}

interface Props {
  question?: {
    id?: string
    stem_md: string
    format: Format
    cognitive: Cognitive
    difficulty: number
    status: ContentStatus
    construct_id: string | null
    subject_id: string | null
    group_code: string
  }
  onClose: () => void
  onSaved: () => void
}

export default function QuestionFormModal({
  question,
  onClose,
  onSaved,
}: Props) {
  const isEdit = !!question?.id
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [constructs, setConstructs] = useState<ConstructRow[]>([])
  const [subjects, setSubjects] = useState<SubjectRow[]>([])

  const [form, setForm] = useState({
    stem_md: question?.stem_md || '',
    format: question?.format || 'Y1',
    cognitive: question?.cognitive || 'bilish',
    difficulty: question?.difficulty || 1,
    construct_id: question?.construct_id || '',
    explanation_md: '',
  })

  const [options, setOptions] = useState<
    { content_md: string; isCorrect: boolean }[]
  >(
    Array.from({ length: 4 }, (_, index) => ({
      content_md: '',
      isCorrect: index === 0,
    })),
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoadError(null)

      try {
        const [constructResult, subjectResult] = await Promise.all([
          supabase
            .from('constructs')
            .select('id, code, title_uz, subject_id, group_code')
            .order('code'),
          typedSupabase.from('subjects').select('id, code, name_uz').order('code'),
        ])

        const baseError = constructResult.error ?? subjectResult.error
        if (baseError) throw baseError
        if (cancelled) return

        setConstructs(constructResult.data || [])
        setSubjects(subjectResult.data || [])

        if (question?.id) {
          const [optionResult, keyResult] = await Promise.all([
            supabase
              .from('question_options')
              .select('id, content_md, order_idx')
              .eq('question_id', question.id)
              .order('order_idx'),
            supabase
              .from('question_keys')
              .select('payload, explanation_md')
              .eq('question_id', question.id)
              .maybeSingle(),
          ])

          const editError = optionResult.error ?? keyResult.error
          if (editError) throw editError
          if (cancelled) return

          const optionsData = optionResult.data
          const keyData = keyResult.data

          if (optionsData && optionsData.length > 0) {
            const payload = (keyData?.payload ?? null) as {
              correct_option_id?: string
            } | null

            setOptions(
              optionsData.map(option => ({
                content_md: option.content_md,
                isCorrect: payload?.correct_option_id === option.id,
              })),
            )
          }

          if (keyData) {
            setForm(current => ({
              ...current,
              explanation_md: keyData.explanation_md || '',
            }))
          }
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : 'Yuklashda xatolik',
          )
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [question?.id])

  const selectedConstruct = constructs.find(
    construct => construct.id === form.construct_id,
  )
  const selectedSubject = selectedConstruct
    ? subjects.find(subject => subject.id === selectedConstruct.subject_id)
    : undefined

  async function handleSave() {
    setSaveError(null)

    if (!form.stem_md.trim()) {
      setSaveError('Savol matnini kiriting')
      return
    }

    const construct = constructs.find(item => item.id === form.construct_id)
    if (!construct) {
      setSaveError('Konstruktni tanlang')
      return
    }

    setSaving(true)

    try {
      if (isEdit && question?.id) {
        const { error: updateError } = await supabase
          .from('questions')
          .update({
            stem_md: form.stem_md.trim(),
            format: form.format,
            cognitive: form.cognitive,
            difficulty: form.difficulty,
            status: question.status,
            construct_id: construct.id,
            subject_id: construct.subject_id,
            group_code: construct.group_code,
            updated_at: new Date().toISOString(),
          })
          .eq('id', question.id)

        if (updateError) throw updateError

        const { error: optionDeleteError } = await supabase
          .from('question_options')
          .delete()
          .eq('question_id', question.id)

        if (optionDeleteError) throw optionDeleteError

        if (form.format === 'Y1') {
          const { error: keyDeleteError } = await supabase
            .from('question_keys')
            .delete()
            .eq('question_id', question.id)

          if (keyDeleteError) throw keyDeleteError
        }

        await saveOptionsAndKey(question.id)
      } else {
        const { data: newQuestion, error: insertError } = await supabase
          .from('questions')
          .insert({
            stem_md: form.stem_md.trim(),
            format: form.format,
            cognitive: form.cognitive,
            difficulty: form.difficulty,
            status: 'draft',
            construct_id: construct.id,
            subject_id: construct.subject_id,
            group_code: construct.group_code,
          })
          .select('id')
          .single()

        if (insertError) throw insertError
        if (newQuestion) await saveOptionsAndKey(newQuestion.id)
      }

      onSaved()
    } catch (err) {
      monitoring.captureException(
        err instanceof Error ? err : new Error(String(err)),
        { area: 'admin.question-form' },
      )
      setSaveError(
        err instanceof Error ? err.message : 'Savolni saqlashda xatolik yuz berdi',
      )
    } finally {
      setSaving(false)
    }
  }

  async function saveOptionsAndKey(questionId: string) {
    if (form.format !== 'Y1') return

    const rows = options.map((option, index) => ({
      question_id: questionId,
      content_md: option.content_md.trim(),
      order_idx: index,
      side: String.fromCharCode(97 + index),
    }))

    const { data: inserted, error: optionError } = await supabase
      .from('question_options')
      .insert(rows)
      .select('id, order_idx')

    if (optionError) throw optionError

    const correctIndex = options.findIndex(option => option.isCorrect)
    const correctOption = (inserted || []).find(
      option => option.order_idx === correctIndex,
    )

    if (!correctOption) throw new Error('To‘g‘ri variant topilmadi')

    const payload: Json = { correct_option_id: correctOption.id }
    const { error: keyError } = await typedSupabase.from('question_keys').insert({
      question_id: questionId,
      payload,
      explanation_md: form.explanation_md.trim(),
    })

    if (keyError) throw keyError
  }

  function toggleCorrect(index: number) {
    setOptions(previous =>
      previous.map((option, optionIndex) => ({
        ...option,
        isCorrect: optionIndex === index,
      })),
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-950/55 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="my-4 w-full max-w-3xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 sm:my-8"
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-form-title"
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              <FileQuestion size={19} aria-hidden="true" />
            </span>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                Savollar banki
              </span>
              <h2
                id="question-form-title"
                className="mt-1 text-lg font-bold text-gray-950 dark:text-white"
              >
                {isEdit ? 'Savolni tahrirlash' : 'Yangi savol'}
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Savol metadata va javob konfiguratsiyasini kiriting.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Formani yopish"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          {loadError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{loadError}</span>
            </div>
          )}

          {saveError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{saveError}</span>
            </div>
          )}

          <section>
            <label
              htmlFor="question-stem"
              className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Savol matni
            </label>
            <textarea
              id="question-stem"
              className="input min-h-[110px] resize-y"
              rows={4}
              value={form.stem_md}
              onChange={event =>
                setForm(current => ({
                  ...current,
                  stem_md: event.target.value,
                }))
              }
              placeholder="Savolni kiriting..."
            />
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <FormField label="Konstrukt">
              <select
                className="input"
                value={form.construct_id}
                onChange={event =>
                  setForm(current => ({
                    ...current,
                    construct_id: event.target.value,
                  }))
                }
                aria-label="Konstrukt"
              >
                <option value="">Tanlang...</option>
                {constructs.map(construct => (
                  <option key={construct.id} value={construct.id}>
                    {construct.code} — {construct.title_uz}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Test turi">
              <select
                className="input"
                value={form.format}
                onChange={event =>
                  setForm(current => ({
                    ...current,
                    format: event.target.value as Format,
                  }))
                }
                aria-label="Test turi"
              >
                <option value="Y1">Y1 · Bilish</option>
                <option value="Y2">Y2 · Qo‘llash</option>
                <option value="Y3">Y3 · Mulohaza</option>
              </select>
            </FormField>

            <FormField label="Qiyinlik">
              <select
                className="input"
                value={form.difficulty}
                onChange={event =>
                  setForm(current => ({
                    ...current,
                    difficulty: Number(event.target.value),
                  }))
                }
                aria-label="Qiyinlik"
              >
                {[1, 2, 3, 4, 5].map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Kognitiv daraja">
              <select
                className="input"
                value={form.cognitive}
                onChange={event =>
                  setForm(current => ({
                    ...current,
                    cognitive: event.target.value as Cognitive,
                  }))
                }
                aria-label="Kognitiv daraja"
              >
                <option value="bilish">Bilish</option>
                <option value="qollash">Qo‘llash</option>
                <option value="mulohaza">Mulohaza</option>
              </select>
            </FormField>
          </section>

          {selectedConstruct && (
            <div className="grid gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20 sm:grid-cols-3">
              <MetaItem label="Konstrukt" value={selectedConstruct.code} />
              <MetaItem
                label="Fan"
                value={selectedSubject?.name_uz ?? selectedConstruct.subject_id}
              />
              <MetaItem label="Guruh" value={selectedConstruct.group_code} />
            </div>
          )}

          {form.format === 'Y1' ? (
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Javob variantlari
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Bitta variant to‘g‘ri javob sifatida belgilanadi.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <CheckCircle2 size={12} aria-hidden="true" />
                  Single answer
                </span>
              </div>

              <div className="space-y-2.5">
                {options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index)

                  return (
                    <div
                      key={index}
                      className={
                        'flex flex-col gap-2 rounded-xl border p-3 transition sm:flex-row sm:items-center ' +
                        (option.isCorrect
                          ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20'
                          : 'border-gray-200 dark:border-gray-800')
                      }
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gray-100 font-mono text-xs font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                        {letter}
                      </span>

                      <input
                        className="input min-w-0 flex-1"
                        placeholder={'Variant ' + letter}
                        value={option.content_md}
                        onChange={event => {
                          const next = [...options]
                          next[index] = {
                            ...next[index],
                            content_md: event.target.value,
                          }
                          setOptions(next)
                        }}
                        aria-label={'Variant ' + letter}
                      />

                      <button
                        type="button"
                        onClick={() => toggleCorrect(index)}
                        className={
                          'inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition ' +
                          (option.isCorrect
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700')
                        }
                        aria-pressed={option.isCorrect}
                      >
                        <CheckCircle2 size={14} aria-hidden="true" />
                        {option.isCorrect ? 'To‘g‘ri' : 'To‘g‘ri deb belgilash'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-300">
              <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">Y2/Y3 javob shabloni bu formadan kiritilmaydi.</p>
                <p className="mt-1 text-xs leading-5 opacity-90">
                  Matching yoki ordering kaliti kontent konveyeri orqali yoziladi.
                  Bu forma savol metadata va matnini saqlaydi.
                </p>
              </div>
            </div>
          )}

          <section>
            <label
              htmlFor="question-explanation"
              className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Tushuntirish
            </label>
            <textarea
              id="question-explanation"
              className="input min-h-[90px] resize-y"
              rows={3}
              value={form.explanation_md}
              onChange={event =>
                setForm(current => ({
                  ...current,
                  explanation_md: event.target.value,
                }))
              }
              placeholder="To‘g‘ri javob haqida izoh..."
            />
          </section>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/30 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary min-h-11"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || !!loadError}
            className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} aria-hidden="true" />
            {saving ? 'Saqlanmoqda...' : isEdit ? 'Yangilash' : 'Yaratish'}
          </button>
        </footer>
      </div>
    </div>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </span>
      {children}
    </label>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </div>
  )
}
