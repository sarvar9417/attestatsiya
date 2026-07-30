import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, ChevronDown, ChevronRight, GripVertical } from 'lucide-react'

interface Module {
  id: number
  code: string
  title: string
  description: string | null
  sort_order: number
  subtopics: Subtopic[]
}

interface Subtopic {
  id: number
  title: string
  description: string | null
  sort_order: number
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', title: '', description: '' })
  const [subForm, setSubForm] = useState<{ moduleId: number; title: string } | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: specs } = await supabase.from('specification_versions').select('id').eq('is_active', true).maybeSingle()
    if (!specs) { setLoading(false); return }

    const { data: m } = await supabase.from('modules').select('*').eq('spec_id', specs.id).order('sort_order')
    const { data: s } = await supabase.from('subtopics').select('*').order('sort_order')

    if (m) {
      const subtopicMap = new Map<number, Subtopic[]>()
      if (s) {
        s.forEach(st => {
          const arr = subtopicMap.get(st.module_id) || []
          arr.push(st)
          subtopicMap.set(st.module_id, arr)
        })
      }
      setModules(m.map(mod => ({ ...mod, subtopics: subtopicMap.get(mod.id) || [] })))
    }
    setLoading(false)
  }

  async function createModule() {
    const { data: spec } = await supabase.from('specification_versions').select('id').eq('is_active', true).single()
    if (!spec) return alert('Avval faol spetsifikatsiya yarating')
    await supabase.from('modules').insert({
      spec_id: spec.id,
      code: form.code,
      title: form.title,
      description: form.description || null,
      sort_order: modules.length + 1,
    })
    setShowForm(false)
    setForm({ code: '', title: '', description: '' })
    load()
  }

  async function createSubtopic(moduleId: number) {
    if (!subForm) return
    await supabase.from('subtopics').insert({
      module_id: moduleId,
      title: subForm.title,
      sort_order: modules.find(m => m.id === moduleId)?.subtopics.length ?? 0 + 1,
    })
    setSubForm(null)
    load()
  }

  const toggleExpand = (id: number) => {
    const next = new Set(expanded)
    next.has(id) ? next.delete(id) : next.add(id)
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

      {showForm && (
        <div className="card p-4 mb-6 space-y-3">
          <input className="input" placeholder="Kod (M01, M02...)" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
          <input className="input" placeholder="Modul nomi" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <textarea className="input" placeholder="Tavsif" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          <div className="flex gap-2">
            <button onClick={createModule} className="btn-primary">Saqlash</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Bekor qilish</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {modules.map(mod => (
          <div key={mod.id} className="card overflow-hidden">
            <button onClick={() => toggleExpand(mod.id)} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left">
              <GripVertical size={16} className="text-gray-300 shrink-0" />
              {expanded.has(mod.id) ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="badge bg-primary-100 text-primary-700 text-xs font-mono">{mod.code}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{mod.title}</span>
                </div>
                {mod.description && <p className="text-sm text-gray-500 mt-0.5">{mod.description}</p>}
              </div>
              <span className="text-xs text-gray-400">{mod.subtopics.length} ta mavzu</span>
            </button>

            {expanded.has(mod.id) && (
              <div className="px-4 pb-4 pl-14 space-y-1">
                {mod.subtopics.map(st => (
                  <div key={st.id} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{st.title}</span>
                  </div>
                ))}
                <button
                  onClick={() => setSubForm({ moduleId: mod.id, title: '' })}
                  className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 py-1.5"
                >
                  <Plus size={14} /> Mikro-mavzu qo'shish
                </button>
                {subForm?.moduleId === mod.id && (
                  <div className="flex gap-2 mt-1">
                    <input className="input flex-1" placeholder="Mavzu nomi" value={subForm.title} onChange={e => setSubForm(sf => ({ ...sf!, title: e.target.value }))} autoFocus />
                    <button onClick={() => createSubtopic(mod.id)} className="btn-primary text-sm">Qo'shish</button>
                    <button onClick={() => setSubForm(null)} className="btn-secondary text-sm">Bekor</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {modules.length === 0 && <p className="text-gray-400 text-center py-8">Hali modul yo'q. Avval spetsifikatsiya yarating.</p>}
      </div>
    </div>
  )
}
