import { useState, useEffect } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { fetchQuickWeakSpots } from '../../services/analyticsService'
import type { QuickWeakSpot } from '../../services/analyticsService'

const BG_COLORS: Record<string, string> = {
  vocabulary: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
  phrases:    'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800',
  grammar:    'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800',
  writing:    'bg-b2-50 dark:bg-b2-900/20 border-b2-100 dark:border-b2-800',
  speaking:   'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800',
  listening:  'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-800',
  reading:    'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800',
}

function ScoreBar({ score }: { score: number }) {
  const barColor = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${
        score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-500'
      }`}>
        {score}%
      </span>
    </div>
  )
}

interface WeakSpotsWidgetProps {
  onSpotsLoaded?: (spots: QuickWeakSpot[]) => void
}

export default function WeakSpotsWidget({ onSpotsLoaded }: WeakSpotsWidgetProps) {
  const [spots, setSpots] = useState<QuickWeakSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    fetchQuickWeakSpots(userId)
      .then((data) => {
        setSpots(data)
        onSpotsLoaded?.(data)
        setLoading(false)
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Xato yuz berdi')
        setLoading(false)
      })
  // onSpotsLoaded callback-ni dependency-ga qo'shmaymiz — parent re-render bo'lsa ham fetch qaytarilmasin
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if (loading) {
    return (
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            <h3 className="font-bold text-gray-900 text-sm">Zaif tomonlar tahlili</h3>
          </div>
        </div>
        <div className="flex items-center justify-center py-6 text-gray-400 text-sm">
          <Loader2 size={16} className="animate-spin mr-2" />
          Tahlil qilinmoqda...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            <h3 className="font-bold text-gray-900 text-sm">Zaif tomonlar tahlili</h3>
          </div>
        </div>
        <p className="text-xs text-red-500 py-3 text-center">Ma'lumotlarni yuklashda xatolik</p>
      </section>
    )
  }

  if (spots.length === 0) {
    return null // No data yet, don't show widget
  }

  const weakest = spots[0]
  const isAllGood = spots.every(s => s.score >= 80)

  return (
    <section className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-orange-500" />
          <h3 className="font-bold text-gray-900 text-sm">Zaif tomonlar tahlili</h3>
        </div>
        {isAllGood ? (
          <span className="badge badge-b1 text-xs">Barchasi yaxshi ✅</span>
        ) : (
          <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-full">
            {spots.length} ta zaif joy
          </span>
        )}
      </div>

      {isAllGood ? (
        <div className="py-4 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-sm font-semibold text-gray-800">Barcha sohalar yaxshi holatda!</p>
          <p className="text-xs text-gray-400 mt-1">Barcha ko'rsatkichlar 80% dan yuqori</p>
        </div>
      ) : (
        <>
          {/* Weakest spot highlight */}
          <div className={`rounded-xl border p-3 mb-3 ${BG_COLORS[weakest.category] ?? 'bg-gray-50'} relative overflow-hidden`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">{weakest.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-800">{weakest.label}</p>
                <p className="text-xs text-gray-500">Eng zaif soha</p>
              </div>
              <span className="ml-auto text-2xl font-bold text-red-500">{weakest.score}%</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{weakest.detail}</p>
          </div>

          {/* All spots list */}
          <div className="space-y-2">
            {spots.map((spot) => (
              <div
                key={spot.category}
                className={`rounded-xl border px-3 py-2.5 ${BG_COLORS[spot.category] ?? 'bg-gray-50'}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{spot.icon}</span>
                  <span className="text-xs font-semibold text-gray-700 flex-1">{spot.label}</span>
                  <span className={`text-xs font-bold ${
                    spot.score >= 80 ? 'text-green-600' : spot.score >= 60 ? 'text-yellow-600' : 'text-red-500'
                  }`}>
                    {spot.score}%
                  </span>
                </div>
                <ScoreBar score={spot.score} />
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{spot.detail}</p>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="mt-3 p-3 bg-gradient-to-r from-primary-50 to-b1-50 rounded-xl border border-primary-100 flex items-start gap-2">
            <AlertTriangle size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary-700">Tavsiya</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Eng zaif soha — <strong>{weakest.label}</strong>. Shu sohaga ko'proq vaqt ajrating.
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
