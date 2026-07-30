import { useNavigate } from 'react-router-dom'
import { MODULES } from '../data/contentTree'
import { BookOpen, FileQuestion, BarChart3, ArrowRight, Target } from 'lucide-react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const totalSubtopics = MODULES.reduce((acc, m) => acc + m.subtopics.length, 0)
  const totalQuestions = MODULES.reduce((acc, m) => acc + m.examQuestionCount, 0)

  const stats = [
    { label: 'Modullar', value: MODULES.length, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Mavzular', value: totalSubtopics, icon: Target, color: 'bg-green-500' },
    { label: 'Savollar', value: `${totalQuestions}+`, icon: FileQuestion, color: 'bg-purple-500' },
    { label: 'Tayyorgarlik', value: '0%', icon: BarChart3, color: 'bg-orange-500' },
  ]

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Informatika attestatsiyasi</h1>
        <p className="text-gray-500 text-sm mt-1">2026-yil spetsifikatsiyasi asosida tayyorgarlik platformasi</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card p-5 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <h2 className="font-bold text-lg mb-2">Tayyorgarlikni boshlang</h2>
        <p className="text-sm text-primary-100 mb-4">16 modul, {totalSubtopics} ta mikro-mavzu. Nazariya, test va amaliy mashqlar.</p>
        <button
          onClick={() => navigate('/learn')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 rounded-xl font-medium text-sm hover:bg-primary-50 transition-colors"
        >
          O'rganishni boshlash <ArrowRight size={16} />
        </button>
      </div>

      <div>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Modullar ro'yxati</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MODULES.map(mod => (
            <button
              key={mod.id}
              onClick={() => navigate('/learn')}
              className="card p-3 flex items-center gap-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <span className="badge bg-primary-100 text-primary-700 text-xs font-mono shrink-0">{mod.code}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{mod.title}</p>
                <p className="text-xs text-gray-400">{mod.subtopics.length} ta mavzu</p>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-primary-500 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
