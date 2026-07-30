import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, ExternalLink } from 'lucide-react'

interface Source {
  id: number
  title: string
  author: string | null
  isbn: string | null
  pdf_url: string | null
}

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', author: '', isbn: '', pdf_url: '' })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('sources').select('*').order('title')
    if (data) setSources(data)
    setLoading(false)
  }

  async function create() {
    await supabase.from('sources').insert({
      title: form.title,
      author: form.author || null,
      isbn: form.isbn || null,
      pdf_url: form.pdf_url || null,
    })
    setShowForm(false)
    setForm({ title: '', author: '', isbn: '', pdf_url: '' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manbalar</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi manba
        </button>
      </div>

      {showForm && (
        <div className="card p-4 mb-6 space-y-3">
          <input className="input" placeholder="Manba nomi" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <input className="input" placeholder="Muallif" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
          <input className="input" placeholder="ISBN" value={form.isbn} onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} />
          <input className="input" placeholder="PDF URL" value={form.pdf_url} onChange={e => setForm(f => ({ ...f, pdf_url: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={create} className="btn-primary">Saqlash</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Bekor qilish</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Yuklanmoqda...</div>
      ) : (
        <div className="space-y-2">
          {sources.map(s => (
            <div key={s.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{s.title}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  {s.author && <span>{s.author}</span>}
                  {s.isbn && <span>ISBN: {s.isbn}</span>}
                </div>
              </div>
              {s.pdf_url && (
                <a href={s.pdf_url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-primary-600">
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          ))}
          {sources.length === 0 && <p className="text-gray-400 text-center py-8">Hali manba yo'q</p>}
        </div>
      )}
    </div>
  )
}
