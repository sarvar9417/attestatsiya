// Onboarding placement — adaptiv enginga ulangan (birlashtirilgan)
// Reja: docs/EnglishPath_Roadmap.md (1.1)
// Eski fiksli test (data/placementTest.ts) o'rniga yagona adaptiv tizim.
// Imzo saqlanadi: onComplete({ level, startDay }) — OnboardingFlow tegilmaydi.

import { useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import PlacementQuiz from '../placement/PlacementQuiz'
import { levelToStartDay } from '../../data/placement/adaptive'
import { savePlacementResult } from '../../services/placementService'
import type { PlacementResult } from '../../data/placement/types'

interface PlacementTestProps {
  onComplete: (result: { level: string; startDay: number }) => void
}

export function PlacementTest({ onComplete }: PlacementTestProps) {
  const { user } = useAuth()

  const handle = useCallback((r: PlacementResult) => {
    if (user?.id) savePlacementResult(user.id, r)
    onComplete({ level: r.level, startDay: levelToStartDay(r.level) })
  }, [user?.id, onComplete])

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center">Darajani aniqlash</h2>
      <PlacementQuiz onComplete={handle} />
    </div>
  )
}
