import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Search, Send, CheckCircle, Globe, Archive, Undo2 } from 'lucide-react'
import QuestionFormModal from '../../components/admin/QuestionFormModal'

type ContentStatus = 'draft' | 'review' | 'published' | 'archived'

interface QuestionRow {
  id: string
  stem_md: string
  format: string
  cognitive: string
  difficulty: number
  status: string
  group_code: string
  construct_id: string | null
  subject_id: string | null
  created_at: string
}

const STATUS_FLOW: Record<ContentStatus, { to: ContentStatus[]; label: string; icon: React.ElementType; color: string }> = {
  draft: {
    to: ['review'],
    label: 'Tekshiruvga yuborish',
    icon: Send,
    color: 'text-yellow-600 hover:bg-yellow-50',
  },
  review: {
    to: ['published', 'draft'],
    label: 'Tasdiqlash / Qaytarish',
    icon: CheckCircle,
    color: 'text-green-600 hover:bg-green-50',
  },
  published: {
    to: ['archived'],
    label: 'Arxivlash',
    icon: Archive,
    color: 'text-gray-600 hover:bg-gray-50',
  },
  archived: {
    to: ['draft'],
    label: 'Qayta ochish',
    icon: Undo2,
    color: 'text-purple-600 hover:bg-purple-50',
  },
}

const STATUS_META: Record<ContentStatus, { label: string; color: string }> = {
  draft: { label: 'Qoralama', color: 'bg-gray-100 text-gray-600' },
  review: { label: 'Tekshiruvda', color: 'bg-yellow-100 text-yellow-700' },
  published: { label: "E'lon qilingan", color: 'bg-green-100 text-green-700' },
  archived: { label: 'Arxivlangan', color: 'bg-red-100 text-red-600' },
}

const FORMAT_LABEL: Record<string, string> = {
  Y1: 'Y1 (Bilish)',
  Y2: "Y2 (Qo'llash)",
  Y3: 'Y3 (Mulohaza)',
}

const COGNITIVE_LABEL: Record<string, string> = {
  bilish: 'Bilish',
  qollash: "Qo'llash",
  mulohaza: 'Mulohaza',
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('questions')
      .select('id, stem_md, format, cognitive, difficulty, status, group_code, construct_id, subject_id, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
    if (filterStatus) query = query.eq('status', filterStatus as ContentStatus)
    const { data } = await query
    if (data) setQuestions(data)
    setLoading(false)
  }, [filterStatus])

  useEffect(() => {
    void load()
  }, [load])

  async function transitionStatus(q: QuestionRow, nextStatus: ContentStatus) {
    const { error } = await supabase.from('questions').update({
      status: nextStatus,
      updated_at: new Date().toISOString(),
    }).eq('id', q.id)

    if (error) {
      alert('Xatolik: ' + error.message)
      return
    }
    load()
  }

  const filtered = questions.filter(q =>
    !search || q.stem_md.toLowerCase().includes(search.toLowerCase())
  )

  const editingQuestion = editingId ? questions.find(q => q.id === editingId) : undefined

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savollar</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi savol
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Savol matnidan qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-44" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Barcha holatlar</option>
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500">Yuklanmoqda...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(q => {
            const status = q.status as ContentStatus
            const flow = STATUS_FLOW[status]
            const sm = STATUS_META[status] || { label: q.status, color: 'bg-gray-100 text-gray-600' }
            return (
              <div key={q.id} className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{q.stem_md}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`badge text-xs ${sm.color}`}>{sm.label}</span>
                      <span className="badge bg-purple-100 text-purple-700 text-xs">{FORMAT_LABEL[q.format] ?? q.format}</span>
                      <span className="badge bg-gray-100 text-gray-600 text-xs">{COGNITIVE_LABEL[q.cognitive] ?? q.cognitive}</span>
                      <span className="text-xs text-gray-400">Qiyinlik: {q.difficulty}/5</span>
                      {q.group_code && <span className="text-xs text-gray-400 font-mono">{q.group_code}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
                    {flow?.to.map(next => (
                      <button
                        key={next}
                        onClick={() => transitionStatus(q, next)}
                        className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${flow.color}`}
                        title={`${flow.label}: ${next}`}
                      >
                        {next === 'review' ? <Send size={14} /> :
                         next === 'published' ? <Globe size={14} /> :
                         next === 'archived' ? <Archive size={14} /> :
                         next === 'draft' ? <Undo2 size={14} /> :
                         <span>{next}</span>}
                      </button>
                    ))}
                    <button
                      onClick={() => setEditingId(q.id)}
                      className="p-1.5 rounded-lg text-xs text-primary-600 hover:bg-primary-50 font-medium"
                    >
                      Tahrirlash
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && <p className="text-gray-400 text-center py-8">Savol topilmadi</p>}
        </div>
      )}

      {showForm && (
        <QuestionFormModal
          onClose={() => { setShowForm(false); setEditingId(null) }}
          onSaved={() => { setShowForm(false); setEditingId(null); load() }}
        />
      )}

      {editingQuestion && (
        <QuestionFormModal
          question={{
            id: editingQuestion.id,
            stem_md: editingQuestion.stem_md,
            format: editingQuestion.format as 'Y1' | 'Y2' | 'Y3',
            cognitive: editingQuestion.cognitive as 'bilish' | 'qollash' | 'mulohaza',
            difficulty: editingQuestion.difficulty,
            status: editingQuestion.status as ContentStatus,
            construct_id: editingQuestion.construct_id,
            subject_id: editingQuestion.subject_id,
            group_code: editingQuestion.group_code,
          }}
          onClose={() => setEditingId(null)}
          onSaved={() => { setEditingId(null); load() }}
        />
      )}
    </div>
  )
}
