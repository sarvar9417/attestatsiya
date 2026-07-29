// Placement Test — daraja aniqlash sahifasi (standalone / qayta test)
// Reja: docs/EnglishPath_Roadmap.md (1.1)

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, GraduationCap, Sparkles, RotateCcw } from 'lucide-react'
import { useI18n } from '../i18n'
import { useAuth } from '../hooks/useAuth'
import { useStore } from '../store/useStore'
import { PLACEMENT_TEST_LENGTH } from '../data/placement/adaptive'
import { BAND_ORDER } from '../data/placement'
import type { PlacementResult } from '../data/placement/types'
import { savePlacementResult } from '../services/placementService'
import PlacementQuiz from '../components/placement/PlacementQuiz'
import type { Level } from '../store/types'

type Phase = 'intro' | 'testing' | 'result'



const LEVEL_DESC: Record<Level, string> = {
  'A2+': 'Siz oddiy mavzularda muloqot qila olasiz',
  'B1': 'Kundalik hayotda erkin gaplasha olasiz',
  'B1+': 'Murakkab mavzularda fikr yurita olasiz',
  'B2': 'Deyarli har qanday mavzuda ravon gaplasha olasiz',
}

export default function PlacementTest() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { user } = useAuth()
  const setLevel = useStore(s => s.setLevel)
  const clearLevelUp = useStore(s => s.clearLevelUp)

  const [phase, setPhase] = useState<Phase>('intro')
  const [result, setResult] = useState<PlacementResult | null>(null)

  const handleComplete = useCallback((r: PlacementResult) => {
    setResult(r)
    setPhase('result')
    if (user?.id) savePlacementResult(user.id, r)
  }, [user?.id])

  const applyAndContinue = useCallback(() => {
    if (!result) return
    setLevel(result.level)   // currentLevel + Supabase users.level
    clearLevelUp()           // placement uchun "level-up" animatsiyasini bostiramiz
    navigate('/')
  }, [result, setLevel, clearLevelUp, navigate])

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto p-4 space-y-4 mobile-safe-bottom">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg sm:text-xl font-black text-gray-900 dark:text-gray-100">{t('placementTest.title')}</h1>
        </div>
        <div className="rounded-2xl p-6 bg-gradient-to-br from-primary-600 to-b2-600 text-white text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 flex items-center justify-center">
            <GraduationCap size={28} />
          </div>
          <p className="mt-3 font-black text-lg">{t('placementTest.introTitle')}</p>
          <p className="text-white/80 text-sm mt-1">{t('placementTest.introDesc', { count: String(PLACEMENT_TEST_LENGTH) })}</p>
        </div>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li>{t('placementTest.introPoint1')}</li>
          <li>{t('placementTest.introPoint2')}</li>
          <li>{t('placementTest.introPoint3')}</li>
        </ul>
        <button
          onClick={() => setPhase('testing')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 active:scale-[0.98] transition-all"
        >
          {t('placementTest.startButton')} <ArrowRight size={18} />
        </button>
      </div>
    )
  }

  // ── TESTING ──
  if (phase === 'testing') {
    return (
      <div className="max-w-xl mx-auto p-4 mobile-safe-bottom">
        <PlacementQuiz onComplete={handleComplete} />
      </div>
    )
  }

  // ── RESULT ──
  if (phase === 'result' && result) {
    return (
      <div className="max-w-xl mx-auto p-4 space-y-4 mobile-safe-bottom">
        <div className="rounded-2xl p-6 bg-gradient-to-br from-primary-600 to-b2-600 text-white text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 flex items-center justify-center">
            <Sparkles size={28} />
          </div>
          <p className="mt-3 text-white/80 text-sm font-semibold">{t('placementTest.resultLevelLabel')}</p>
          <p className="text-4xl font-black mt-1">{result.level}</p>
          <p className="text-white/85 text-sm mt-2">{LEVEL_DESC[result.level]}</p>
          <p className="text-white/70 text-xs mt-2">{t('placementTest.resultScore', { correct: String(result.correctCount), total: String(result.totalAsked) })}</p>
        </div>

        {/* Band taqsimoti */}
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('placementTest.resultBandTitle')}</p>
          <div className="space-y-1.5">
            {BAND_ORDER.map(band => {
              const { correct, total } = result.bandScores[band]
              if (total === 0) return null
              const p = Math.round((correct / total) * 100)
              return (
                <div key={band} className="flex items-center gap-2 text-xs">
                  <span className="w-8 font-bold text-gray-700 dark:text-gray-200">{band}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div className={`h-full ${p >= 50 ? 'bg-emerald-500' : 'bg-rose-400'}`} style={{ width: `${p}%` }} />
                  </div>
                  <span className="text-gray-400 w-10 text-right">{correct}/{total}</span>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={applyAndContinue}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 active:scale-[0.98] transition-all"
        >
          {t('placementTest.saveAndContinue')} <ArrowRight size={16} />
        </button>
        <button
          onClick={() => { setResult(null); setPhase('testing') }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold text-sm"
        >
          <RotateCcw size={15} /> {t('placementTest.retryTest')}
        </button>
      </div>
    )
  }

  return null
}
