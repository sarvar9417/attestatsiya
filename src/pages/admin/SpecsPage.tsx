import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Check, X } from 'lucide-react'

interface Spec {
  id: number
  version: string
  year: number
  is_active: boolean
  description: string | null
}

export default function SpecsPage() {
  const [specs, setSpecs] = useState<Spec[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ version: '', year: new Date().getFullYear(), description: '' })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('specification_versions').select('*').order('year', { ascending: false })
    if (data) setSpecs(data)
    setLoading(false)
  }

  async function create() {
    await supabase.from('specification_versions').insert({
      version: form.version,
      year: form.year,
      description: form.description || null,
    })
    setShowForm(false)
    setForm({ version: '', year: new Date().getFullYear(), description: '' })
    load()
  }

  async function toggleActive(id: number, active: boolean) {
    await supabase.from('specification_versions').update({ is_active: active }).eq('id', id)
    if (active) {
      await supabase.from('specification_versions').update({ is_active: false }).neq('id', id)
    }
    load()
  }

  if (loading) return <div className="text-gray-500">Yuklanmoqda...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Spetsifikatsiyalar</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi
        </button>
      </div>

      {showForm && (
        <div className="card p-4 mb-6 space-y-3">
          <input className="input" placeholder="Versiya (masalan 2026)" value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} />
          <input className="input" type="number" placeholder="Yil" value={form.year} onChange={e => setForm(f => ({ ...f, year: +e.target.value }))} />
          <textarea className="input" placeholder="Tavsif" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          <div className="flex gap-2">
            <button onClick={create} className="btn-primary">Saqlash</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Bekor qilish</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {specs.map(s => (
          <div key={s.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">{s.version}</span>
                <span className="text-sm text-gray-500">({s.year})</span>
                {s.is_active && <span className="badge bg-green-100 text-green-700">Faol</span>}
              </div>
              {s.description && <p className="text-sm text-gray-500 mt-1">{s.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              {!s.is_active ? (
                <button onClick={() => toggleActive(s.id, true)} className="p-2 text-gray-400 hover:text-green-600" title="Faollashtirish">
                  <Check size={16} />
                </button>
              ) : (
                <button onClick={() => toggleActive(s.id, false)} className="p-2 text-gray-400 hover:text-red-600" title="Faolsizlantirish">
                  <X size={16} />
                </button>
              )}
              <button className="p-2 text-gray-400 hover:text-primary-600" title="Tahrirlash">
                <Pencil size={16} />
              </button>
            </div>
          </div>
        ))}
        {specs.length === 0 && <p className="text-gray-400 text-center py-8">Hali spetsifikatsiya yo'q</p>}
      </div>
    </div>
  )
}
