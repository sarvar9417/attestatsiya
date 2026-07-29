import { useState, useEffect } from 'react'
import { Brain, ChevronRight, Clock, Zap, AlertTriangle, RotateCcw, Loader2, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { generateAdaptivePlan, loadAdaptivePlan, saveAdaptivePlan } from '../../services/adaptiveService'
import type { AdaptivePlan as AdaptivePlanType } from '../../services/adaptiveService'
import { useStore } from '../../store/useStore'

const PRIORITY_STYLES: Record<string, string> = {
  high: 'border-l-red-400 bg-red-50 dark:bg-red-950/30 dark:border-l-red-700',
  medium: 'border-l-amber-400 bg-amber-50 dark:bg-amber-950/30 dark:border-l-amber-700',
  low: 'border-l-green-400 bg-green-50 dark:bg-green-950/30 dark:border-l-green-700',
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'review': <RotateCcw size={14} />,
  'drill': <BookOpen size={14} />,
  'new-topic': <Zap size={14} />,
  'vocab-review': <Brain size={14} />,
}

export default function AdaptivePlan() {
  const navigate = useNavigate()
  const userName = useStore((s) => s.userName) || 'Foydalanuvchi'
  const [plan, setPlan] = useState<AdaptivePlanType | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (!userId) return
    const today = new Date().toISOString().split('T')[0]

    loadAdaptivePlan(userId, today).then((cached) => {
      if (cached) {
        setPlan(cached)
        setLoading(false)
      } else {
        generateAdaptivePlan(userId).then((newPlan) => {
          setPlan(newPlan)
          saveAdaptivePlan(userId, newPlan).catch((e) => monitoring.captureMessage('saveAdaptivePlan failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
          setLoading(false)
        })
      }
    })
  }, [userId])

  if (loading) {
    return (
      <section className="card">
        <div className="flex items-center gap-2 mb-3">
          <Brain size={16} className="text-b2-600" />
          <h3 className="font-bold text-gray-900 text-sm">Adaptiv Plan</h3>
        </div>
        <div className="flex items-center justify-center py-4 text-gray-400 text-sm">
          <Loader2 size={14} className="animate-spin mr-2" />
          Siz uchun moslashtirilmoqda...
        </div>
      </section>
    )
  }

  if (!plan) return null

  const highPriority = plan.tasks.filter(t => t.priority === 'high')

  return (
    <section className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-b2-500 to-primary-600 flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{userName} uchun bugun</h3>
            <p className="text-xs text-gray-400">Adaptiv plan — zaif tomonlarga asoslangan</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-b2-600 font-semibold">
            <Clock size={12} /> {plan.totalEstimatedMinutes} daqiqa
          </div>
          <div className="flex items-center gap-1.5 text-xs text-yellow-600 font-semibold mt-0.5">
            <Zap size={12} /> +{plan.totalXP} XP
          </div>
        </div>
      </div>

      {/* Focus area alert */}
      {highPriority.length > 0 && (
        <div className="mb-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 flex items-start gap-2">
          <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-red-700 dark:text-red-400">{plan.focusArea}</p>
            <p className="text-xs text-red-500 dark:text-red-400/80 mt-0.5">{plan.focusReason}</p>
          </div>
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-1.5">
        {plan.tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border-l-4 transition-colors ${PRIORITY_STYLES[task.priority]}`}
          >
            <div className="mt-0.5 text-gray-500">
              {TYPE_ICONS[task.type] ?? <BookOpen size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{task.label}</span>
                <span className={`text-xs font-medium px-1 py-0.5 rounded ${
                  task.priority === 'high' ? 'bg-red-100 text-red-600' :
                  task.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {task.priority === 'high' ? 'Muhim' : task.priority === 'medium' ? 'O\'rta' : 'Oddiy'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.detail}</p>
              <p className="text-xs text-gray-400 italic mt-0.5">💡 {task.reason}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400 whitespace-nowrap">{task.estimatedMinutes} min</span>
              <span className="text-xs font-bold text-yellow-600">+{task.xp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/lesson')}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 transition-all border border-gray-100 dark:border-gray-700"
      >
        Darslarga o'tish <ChevronRight size={13} />
      </button>
    </section>
  )
}
