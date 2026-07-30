import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { BookOpen, FileQuestion, Layers, Users } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ modules: 0, questions: 0, specs: 0, users: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('modules').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
      supabase.from('specification_versions').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
    ]).then(([m, q, s, u]) => {
      setStats({
        modules: m.count ?? 0,
        questions: q.count ?? 0,
        specs: s.count ?? 0,
        users: u.count ?? 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Spetsifikatsiyalar', value: stats.specs, icon: Layers, color: 'bg-blue-500' },
    { label: 'Modullar', value: stats.modules, icon: BookOpen, color: 'bg-green-500' },
    { label: 'Savollar', value: stats.questions, icon: FileQuestion, color: 'bg-purple-500' },
    { label: 'Foydalanuvchilar', value: stats.users, icon: Users, color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => {
          const Icon = c.icon
          return (
            <div key={c.label} className="card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center`}>
                <Icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p>
                <p className="text-sm text-gray-500">{c.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
