import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { X } from 'lucide-react'
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

export default function QuestionFormModal({ question, onClose, onSaved }: Props) {
  const isEdit = !!question?.id
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

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

  // Y1 options
  const [options, setOptions] = useState<{ content_md: string; isCorrect: boolean }[]>(
    Array.from({ length: 4 }, (_, i) => ({ content_md: '', isCorrect: i === 0 }))
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [{ data: constructsData }, { data: subjectsData }] = await Promise.all([
          supabase.from('constructs').select('id, code, title_uz, subject_id, group_code').order('code'),
          supabase.from('subjects').select('id, code, name_uz').order('code'),
        ])
        if (cancelled) return
        setConstructs(constructsData || [])
        setSubjects(subjectsData || [])

        if (question?.id) {
          const [{ data: optionsData }, { data: keyData }] = await Promise.all([
            supabase.from('question_options').select('id, content_md, order_idx').eq('question_id', question.id).order('order_idx'),
            supabase.from('question_keys').select('payload, explanation_md').eq('question_id', question.id).maybeSingle(),
          ])
          if (cancelled) return
          if (optionsData && optionsData.length > 0) {
            const payload = (keyData?.payload ?? null) as { correct_option_id?: string } | null
            setOptions(optionsData.map(o => ({
              content_md: o.content_md,
              isCorrect: payload?.correct_option_id === o.id,
            })))
          }
          if (keyData) setForm(f => ({ ...f, explanation_md: keyData.explanation_md || '' }))
        }
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Yuklashda xatolik')
      }
    }

    void load()
    return () => { cancelled = true }
  }, [question?.id])

  const selectedConstruct = constructs.find(c => c.id === form.construct_id)

  async function handleSave() {
    if (!form.stem_md.trim()) return
    const construct = constructs.find(c => c.id === form.construct_id)
    if (!construct) return alert('Konstrukt tanlang')
    setSaving(true)

    try {
      if (isEdit && question?.id) {
        const { error: updateError } = await supabase.from('questions').update({
          stem_md: form.stem_md.trim(),
          format: form.format,
          cognitive: form.cognitive,
          difficulty: form.difficulty,
          status: question.status,
          construct_id: construct.id,
          subject_id: construct.subject_id,
          group_code: construct.group_code,
          updated_at: new Date().toISOString(),
        }).eq('id', question.id)
        if (updateError) throw updateError

        await supabase.from('question_options').delete().eq('question_id', question.id)
        // Key faqat Y1 da qayta yoziladi; Y2/Y3 da mavjud key'ni o'chirmaymiz.
        if (form.format === 'Y1') {
          await supabase.from('question_keys').delete().eq('question_id', question.id)
        }
        await saveOptionsAndKey(question.id)
      } else {
        const { data: newQ, error: insertError } = await supabase.from('questions').insert({
          stem_md: form.stem_md.trim(),
          format: form.format,
          cognitive: form.cognitive,
          difficulty: form.difficulty,
          status: 'draft',
          construct_id: construct.id,
          subject_id: construct.subject_id,
          group_code: construct.group_code,
        }).select('id').single()
        if (insertError) throw insertError
        if (newQ) await saveOptionsAndKey(newQ.id)
      }
      onSaved()
    } catch (err) {
      monitoring.captureException(
        err instanceof Error ? err : new Error(String(err)),
        { area: 'admin.question-form' }
      )
      alert('Xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  async function saveOptionsAndKey(questionId: string) {
    if (form.format === 'Y1') {
      const rows = options.map((o, i) => ({
        question_id: questionId,
        content_md: o.content_md.trim(),
        order_idx: i,
        side: String.fromCharCode(97 + i),
      }))
      const { data: inserted, error: optError } = await supabase
        .from('question_options')
        .insert(rows)
        .select('id, order_idx')
      if (optError) throw optError

      const correctIndex = options.findIndex(o => o.isCorrect)
      const correctOption = (inserted || []).find(o => o.order_idx === correctIndex)
      if (!correctOption) throw new Error('To‘g‘ri variant topilmadi')

      const payload: Json = { correct_option_id: correctOption.id }
      const { error: keyError } = await supabase.from('question_keys').insert({
        question_id: questionId,
        payload,
        explanation_md: form.explanation_md.trim(),
      })
      if (keyError) throw keyError
    }
    // Y2/Y3: javob shabloni ushbu forma orqali kiritilmaydi.
    // Kalitni kontent konveyeri (seed/script) yozadi; aks holda javobni
    // tekshirib bo'lmaydi. Shu sababli bu yerda key yozilmaydi.
  }

  function toggleCorrect(idx: number) {
    setOptions(prev => prev.map((o, i) => ({ ...o, isCorrect: i === idx })))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 relative mt-8 mb-8" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
          <X size={18} />
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          {isEdit ? 'Savolni tahrirlash' : 'Yangi savol'}
        </h2>

        {loadError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 text-sm text-red-700 dark:text-red-300">
            {loadError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Savol matni</label>
            <textarea className="input" rows={3} value={form.stem_md} onChange={e => setForm(f => ({ ...f, stem_md: e.target.value }))} placeholder="Savolni kiriting..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konstrukt</label>
              <select className="input" value={form.construct_id} onChange={e => setForm(f => ({ ...f, construct_id: e.target.value }))}>
                <option value="">Tanlang...</option>
                {constructs.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title_uz}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Test turi</label>
              <select className="input" value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value as Format }))}>
                <option value="Y1">Y1 (Bilish)</option>
                <option value="Y2">Y2 (Qo'llash)</option>
                <option value="Y3">Y3 (Mulohaza)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qiyinlik</label>
              <select className="input" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: +e.target.value }))}>
                {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kognitiv daraja</label>
              <select className="input" value={form.cognitive} onChange={e => setForm(f => ({ ...f, cognitive: e.target.value as Cognitive }))}>
                <option value="bilish">Bilish</option>
                <option value="qollash">Qo'llash</option>
                <option value="mulohaza">Mulohaza</option>
              </select>
            </div>
          </div>

          {selectedConstruct && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Fan: {subjects.find(s => s.id === selectedConstruct.subject_id)?.name_uz ?? selectedConstruct.subject_id} · Guruh: {selectedConstruct.group_code}
            </p>
          )}

          {form.format === 'Y1' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Variantlar</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-400 w-5">{String.fromCharCode(97 + i)})</span>
                    <input className="input flex-1" placeholder={`Variant ${String.fromCharCode(97 + i)}`} value={opt.content_md} onChange={e => {
                      const next = [...options]
                      next[i] = { ...next[i], content_md: e.target.value }
                      setOptions(next)
                    }} />
                    <button onClick={() => toggleCorrect(i)} className={`p-2 rounded-lg text-sm ${opt.isCorrect ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {opt.isCorrect ? "To'g'ri" : "Noto'g'ri"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tushuntirish</label>
            <textarea className="input" rows={2} value={form.explanation_md} onChange={e => setForm(f => ({ ...f, explanation_md: e.target.value }))} placeholder="To'g'ri javob haqida izoh..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saqlanmoqda...' : isEdit ? 'Yangilash' : 'Yaratish'}
            </button>
            <button onClick={onClose} className="btn-secondary">Bekor qilish</button>
          </div>
        </div>
      </div>
    </div>
  )
}
