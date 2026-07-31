import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, ChevronDown, ChevronRight, GripVertical } from 'lucide-react'

interface LessonRow {
  id: string
  module_id: string
  title_uz: string
  est_minutes: number
  order_idx: number
  slug: string
  status: string
}

interface ModuleRow {
  id: string
  code: string | null
  title_uz: string
  summary_uz: string | null
  order_idx: number
  slug: string
  status: string
  lessons: LessonRow[]
}

interface SubjectRow {
  id: string
  code: string
  name_uz: string
}

const STATUS_META: Record<string, { label: string; dot: string; badge: string }> = {
  published: { label: "E'lon qilingan", dot: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
  draft: { label: 'Qoralama', dot: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700' },
  review: { label: 'Tekshiruvda', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
  archived: { label: 'Arxivlangan', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600' },
}

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleRow[]>([])
  const [subjects, setSubjects] = useState<SubjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', title_uz: '', summary_uz: '', subject_id: '' })
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => { void load() }, [])

  async function load() {
    setLoading(true)
    setSaveError(null)
    const [{ data: modulesData }, { data: lessonsData }, { data: subjectsData }] = await Promise.all([
      supabase.from('modules').select('*').order('order_idx'),
      supabase.from('lessons').select('*').order('order_idx'),
      supabase.from('subjects').select('*').order('code'),
    ])

    if (modulesData) {
      const lessonsByModule = new Map<string, LessonRow[]>()
      for (const lesson of lessonsData || []) {
        const arr = lessonsByModule.get(lesson.module_id) || []
        arr.push(lesson)
        lessonsByModule.set(lesson.module_id, arr)
      }
      setModules(modulesData.map(mod => ({
        ...mod,
        lessons: lessonsByModule.get(mod.id) || [],
      })))
    }
    if (subjectsData) setSubjects(subjectsData)
    setLoading(false)
  }

  function slugify(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
  }

  async function createModule() {
    setSaveError(null)
    if (!form.title_uz.trim()) {
      setSaveError('Modul nomini kiriting')
      return
    }
    if (!form.subject_id) {
      setSaveError('Fanni tanlang')
      return
    }
    const slug = slugify(form.code || form.title_uz)
    const { error } = await supabase.from('modules').insert({
      code: form.code.trim() || null,
      title_uz: form.title_uz.trim(),
      summary_uz: form.summary_uz.trim() || null,
      slug,
      subject_id: form.subject_id,
      order_idx: modules.length + 1,
      status: 'draft',
    })
    if (error) {
      setSaveError(error.message)
      return
    }
    setShowForm(false)
    setForm({ code: '', title_uz: '', summary_uz: '', subject_id: '' })
    void load()
  }

  const toggleExpand = (id: string) => {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpanded(next)
  }

  if (loading) return <div className="text-gray-500">Yuklanmoqda...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modullar</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi modul
        </button>
      </div>

      {saveError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          {saveError}
        </div>
      )}

      {showForm && (
        <div className="card p-4 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="input" placeholder="Kod (M01, M02...)" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
            <select
              className="input"
              value={form.subject_id}
              onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))}
            >
              <option value="">Fan tanlang...</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.code} — {s.name_uz}</option>)}
            </select>
          </div>
          <input className="input" placeholder="Modul nomi" value={form.title_uz} onChange={e => setForm(f => ({ ...f, title_uz: e.target.value }))} />
          <textarea className="input" placeholder="Qisqacha tavsif" value={form.summary_uz} onChange={e => setForm(f => ({ ...f, summary_uz: e.target.value }))} rows={2} />
          <div className="flex gap-2">
            <button onClick={createModule} className="btn-primary">Saqlash</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Bekor qilish</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {modules.map(mod => {
          const meta = STATUS_META[mod.status] || { label: mod.status, dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600' }
          return (
            <div key={mod.id} className="card overflow-hidden">
              <button onClick={() => toggleExpand(mod.id)} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left">
                <GripVertical size={16} className="text-gray-300 shrink-0" />
                {expanded.has(mod.id) ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {mod.code && <span className="badge bg-primary-100 text-primary-700 text-xs font-mono">{mod.code}</span>}
                    <span className="font-semibold text-gray-900 dark:text-white">{mod.title_uz}</span>
                    <span className={`badge text-[10px] ${meta.badge}`}>{meta.label}</span>
                  </div>
                  {mod.summary_uz && <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{mod.summary_uz}</p>}
                </div>
                <span className="text-xs text-gray-400 shrink-0">{mod.lessons.length} ta dars</span>
              </button>

              {expanded.has(mod.id) && (
                <div className="px-4 pb-4 pl-14 space-y-0.5 border-l-2 border-gray-200 dark:border-gray-700 ml-4">
                  {mod.lessons.map(lesson => {
                    const lMeta = STATUS_META[lesson.status] || { label: lesson.status, dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600' }
                    return (
                      <div key={lesson.id} className="flex items-center gap-2 py-1.5 px-2 text-xs rounded hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <span className={`w-1.5 h-1.5 rounded-full ${lMeta.dot}`} />
                        <span className="text-gray-600 dark:text-gray-400 flex-1 truncate">{lesson.title_uz}</span>
                        {lesson.est_minutes > 0 && <span className="text-gray-400 shrink-0">{lesson.est_minutes} min</span>}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${lMeta.badge}`}>{lMeta.label}</span>
                      </div>
                    )
                  })}
                  {mod.lessons.length === 0 && <p className="text-xs text-gray-400 py-2">Hali dars yo'q</p>}
                </div>
              )}
            </div>
          )
        })}
        {modules.length === 0 && <p className="text-gray-400 text-center py-8">Hali modul yo'q</p>}
      </div>
    </div>
  )
}
