import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Sparkles, TrendingUp, Target, Lightbulb, RefreshCw, Wand2 } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { monitoring } from '../../lib/monitoring'
import { type LearningInsights, type LearningSignals } from '../../lib/claude'
import { getCachedInsights, isInsightsStale, fetchAndCacheInsights, getWeakGrammarLabels } from '../../services/aiInsightsService'

export default function AiInsightsWidget() {
  const navigate = useNavigate()
  const currentLevel    = useStore(s => s.currentLevel)
  const streak          = useStore(s => s.streak)
  const todayGrammarPct   = useStore(s => s.todayGrammarPct)
  const todayVocabPct     = useStore(s => s.todayVocabPct)
  const todayListeningPct = useStore(s => s.todayListeningPct)
  const todayReadingPct   = useStore(s => s.todayReadingPct)
  const todaySpeakingPct  = useStore(s => s.todaySpeakingPct)
  const todayWritingPct   = useStore(s => s.todayWritingPct)

  const [insights, setInsights] = useState<LearningInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [stale, setStale] = useState(false)

  useEffect(() => {
    const cached = getCachedInsights()
    if (cached) { setInsights(cached.data); setStale(isInsightsStale(cached)) }
    else setStale(true)
  }, [])

  function buildSignals(): LearningSignals {
    return {
      level: currentLevel || 'B1',
      streak: streak || 0,
      skills: [
        { name: 'Grammatika', pct: todayGrammarPct || 0 },
        { name: 'Lug\'at',    pct: todayVocabPct || 0 },
        { name: 'Tinglash',   pct: todayListeningPct || 0 },
        { name: 'O\'qish',    pct: todayReadingPct || 0 },
        { name: 'Gapirish',   pct: todaySpeakingPct || 0 },
        { name: 'Yozish',     pct: todayWritingPct || 0 },
      ],
      weakGrammar: getWeakGrammarLabels(5),
    }
  }

  async function refresh() {
    setLoading(true)
    try {
      const data = await fetchAndCacheInsights(buildSignals())
      setInsights(data)
      setStale(false)
    } catch (e) { monitoring.captureMessage('AiInsightsWidget refresh failed (non-critical): ' + (e instanceof Error ? e.message : String(e)), 'warn') }
    finally { setLoading(false) }
  }

  // Hali tahlil yo'q — boshlang'ich CTA
  if (!insights) {
    return (
      <div className="card bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border-indigo-100 dark:border-indigo-900/40">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={18} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-white">AI Shaxsiy Tahlil</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">Claude sizning ko'rsatkichlaringizni tahlil qilib, zaif tomonlaringiz va aniq tavsiyalar beradi.</p>
        <button onClick={refresh} disabled={loading} className="w-full btn-primary py-2.5 font-bold flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <><RefreshCw size={15} className="animate-spin" /> Tahlil qilinmoqda…</> : <><Sparkles size={15} /> AI tahlilini olish</>}
        </button>
        <button onClick={() => navigate('/ai-practice')} className="w-full mt-2 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300 flex items-center justify-center gap-1.5">
          <Wand2 size={13} /> Yoki to'g'ridan-to'g'ri AI mashq qilish →
        </button>
      </div>
    )
  }

  return (
    <div className="card bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border-indigo-100 dark:border-indigo-900/40">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-white">AI Shaxsiy Tahlil</h3>
        </div>
        <button onClick={refresh} disabled={loading} title="Yangilash" className="p-1 rounded-lg hover:bg-white/60 dark:hover:bg-gray-800 text-gray-400">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-2.5 text-xs">
        {insights.strengths.length > 0 && (
          <div className="flex gap-2">
            <TrendingUp size={15} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Kuchli tomonlaringiz: </span>
              <span className="text-gray-600 dark:text-gray-400">{insights.strengths.join(', ')}</span>
            </div>
          </div>
        )}
        {insights.focusArea && (
          <div className="flex gap-2">
            <Target size={15} className="text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Asosiy diqqat: </span>
              <span className="text-gray-600 dark:text-gray-400">{insights.focusArea}</span>
            </div>
          </div>
        )}
        {insights.recommendation && (
          <div className="flex gap-2">
            <Lightbulb size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Tavsiya: </span>
              <span className="text-gray-600 dark:text-gray-400">{insights.recommendation}</span>
            </div>
          </div>
        )}
        {insights.motivation && (
          <p className="text-indigo-600 dark:text-indigo-300 font-medium pt-1 border-t border-indigo-100 dark:border-indigo-900/40">{insights.motivation}</p>
        )}
      </div>

      <button onClick={() => navigate('/ai-practice')} className="w-full btn-primary mt-3 py-2.5 font-bold flex items-center justify-center gap-2">
        <Wand2 size={15} /> AI mashq qilish
      </button>

      {stale && (
        <p className="text-xs text-gray-400 mt-2">Tahlil eskirgan — yangilash uchun 🔄 bosing</p>
      )}
    </div>
  )
}
