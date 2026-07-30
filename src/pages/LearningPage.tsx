import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MODULES, type Module } from '../data/contentTree'
import { BookOpen, ChevronRight, Search } from 'lucide-react'

export default function LearningPage() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    if (!search) return MODULES
    const q = search.toLowerCase()
    return MODULES.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.subtopics.some(s => s.title.toLowerCase().includes(q))
    )
  }, [search])

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">O'quv modullari</h1>
        <p className="text-gray-500 text-sm">Informatika attestatsiyasiga tayyorgarlik — 16 modul</p>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input pl-10"
          placeholder="Mavzu qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filtered.map(mod => (
          <ModuleCard key={mod.id} module={mod} onSelect={() => navigate(`/learn/${mod.id}`)} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-8">"{search}" bo'yicha hech narsa topilmadi</p>
        )}
      </div>
    </div>
  )
}

function ModuleCard({ module: mod, onSelect }: { module: Module; onSelect: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
          <BookOpen size={20} className="text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="badge bg-primary-100 text-primary-700 text-xs font-mono">{mod.code}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{mod.title}</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{mod.description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-gray-400">{mod.subtopics.length} ta mavzu</div>
          <div className="text-xs text-gray-400">Imtihonda {mod.examQuestionCount} ta savol</div>
        </div>
        <ChevronRight size={18} className={`text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pl-16 space-y-1">
          {mod.subtopics.map((st, i) => (
            <button
              key={st.id}
              onClick={onSelect}
              className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left group"
            >
              <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-mono text-gray-500 shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-700">{st.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
