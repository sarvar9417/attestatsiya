import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { X } from 'lucide-react'

interface Props {
  question?: {
    id?: number
    question_text: string
    test_type: string
    difficulty: number
    cognitive_level: string
    module_id: number | null
    subtopic_id: number | null
    explanation: string | null
    stimulus_id: number | null
  }
  onClose: () => void
  onSaved: () => void
}

export default function QuestionFormModal({ question, onClose, onSaved }: Props) {
  const isEdit = !!question?.id
  const [saving, setSaving] = useState(false)
  const [modules, setModules] = useState<{ id: number; code: string; title: string }[]>([])
  const [subtopics, setSubtopics] = useState<{ id: number; module_id: number; title: string }[]>([])
  const [specId, setSpecId] = useState<number | null>(null)

  const [form, setForm] = useState({
    question_text: question?.question_text || '',
    test_type: question?.test_type || 'Y1',
    difficulty: question?.difficulty || 1,
    cognitive_level: question?.cognitive_level || 'bilish',
    module_id: question?.module_id || null,
    subtopic_id: question?.subtopic_id || null,
    explanation: question?.explanation || '',
    stimulus_id: question?.stimulus_id || null,
  })

  // Y1 options
  const [options, setOptions] = useState<{ text: string; isCorrect: boolean }[]>(
    Array.from({ length: 4 }, (_, i) => ({ text: '', isCorrect: i === 0 }))
  )

  useEffect(() => {
    supabase.from('modules').select('id, code, title').order('sort_order').then(({ data }) => {
      if (data) setModules(data)
    })
    supabase.from('subtopics').select('id, module_id, title').order('sort_order').then(({ data }) => {
      if (data) setSubtopics(data)
    })
    supabase.from('specification_versions').select('id').eq('is_active', true).maybeSingle().then(({ data }) => {
      if (data) setSpecId(data.id)
    })
  }, [])

  const filteredSubtopics = subtopics.filter(st => st.module_id === form.module_id)

  async function handleSave() {
    if (!form.question_text.trim()) return
    if (!specId) return alert('Faol spetsifikatsiya yo\'q')
    setSaving(true)

    try {
      if (isEdit && question?.id) {
        await supabase.from('questions').update({
          question_text: form.question_text,
          test_type: form.test_type,
          difficulty: form.difficulty,
          cognitive_level: form.cognitive_level,
          module_id: form.module_id,
          subtopic_id: form.subtopic_id,
          explanation: form.explanation || null,
          stimulus_id: form.stimulus_id,
          updated_at: new Date().toISOString(),
        }).eq('id', question.id)

        // Delete old options and re-insert
        await supabase.from('options').delete().eq('question_id', question.id)
        if (form.test_type === 'Y1') {
          await supabase.from('options').insert(
            options.map((o, i) => ({
              question_id: question.id,
              option_text: o.text,
              is_correct: o.isCorrect,
              sort_order: i,
            }))
          )
        }
      } else {
        const { data: newQ } = await supabase.from('questions').insert({
          spec_id: specId,
          module_id: form.module_id,
          subtopic_id: form.subtopic_id,
          test_type: form.test_type,
          difficulty: form.difficulty,
          cognitive_level: form.cognitive_level,
          question_text: form.question_text,
          explanation: form.explanation || null,
          stimulus_id: form.stimulus_id,
          status: 'draft',
        }).select('id').single()

        if (newQ && form.test_type === 'Y1') {
          await supabase.from('options').insert(
            options.map((o, i) => ({
              question_id: newQ.id,
              option_text: o.text,
              is_correct: o.isCorrect,
              sort_order: i,
            }))
          )
        }
      }
      onSaved()
    } catch (err) {
      console.error(err)
      alert('Xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Savol matni</label>
            <textarea className="input" rows={3} value={form.question_text} onChange={e => setForm(f => ({ ...f, question_text: e.target.value }))} placeholder="Savolni kiriting..." />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Test turi</label>
              <select className="input" value={form.test_type} onChange={e => setForm(f => ({ ...f, test_type: e.target.value }))}>
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
              <select className="input" value={form.cognitive_level} onChange={e => setForm(f => ({ ...f, cognitive_level: e.target.value }))}>
                <option value="bilish">Bilish</option>
                <option value="qollash">Qo'llash</option>
                <option value="mulohaza">Mulohaza</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modul</label>
              <select className="input" value={form.module_id ?? ''} onChange={e => setForm(f => ({ ...f, module_id: e.target.value ? +e.target.value : null, subtopic_id: null }))}>
                <option value="">Tanlang...</option>
                {modules.map(m => <option key={m.id} value={m.id}>{m.code} — {m.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mikro-mavzu</label>
              <select className="input" value={form.subtopic_id ?? ''} onChange={e => setForm(f => ({ ...f, subtopic_id: e.target.value ? +e.target.value : null }))}>
                <option value="">Tanlang...</option>
                {filteredSubtopics.map(st => <option key={st.id} value={st.id}>{st.title}</option>)}
              </select>
            </div>
          </div>

          {form.test_type === 'Y1' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Variantlar</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-400 w-5">{String.fromCharCode(97 + i)})</span>
                    <input className="input flex-1" placeholder={`Variant ${String.fromCharCode(97 + i)}`} value={opt.text} onChange={e => {
                      const next = [...options]
                      next[i] = { ...next[i], text: e.target.value }
                      setOptions(next)
                    }} />
                    <button onClick={() => toggleCorrect(i)} className={`p-2 rounded-lg text-sm ${opt.isCorrect ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {opt.isCorrect ? 'To\'g\'ri' : 'Noto\'g\'ri'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tushuntirish</label>
            <textarea className="input" rows={2} value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} placeholder="To'g'ri javob haqida izoh..." />
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
