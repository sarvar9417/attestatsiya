import { useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ExamRunner from '../features/exam/ExamRunner'
import type { ExamGateway } from '../features/exam/examGateway'
import type { FinishExamResponse } from '../features/exam/contracts'
import { useProgressStore } from '../store/progressStore'
import { syncTopicProgress } from '../lib/progressSync'

interface ExamPageProps {
  gateway?: ExamGateway
}

export default function ExamPage({ gateway }: ExamPageProps) {
  const { kind, moduleId } = useParams()
  const [searchParams] = useSearchParams()
  const lessonId = searchParams.get('lessonId')
  const completeTopic = useProgressStore((s) => s.completeTopic)

  const examKind =
    kind === 'bolim' || kind === 'mavzu' || kind === 'mock' ? kind : 'mock'

  /**
   * Mavzu sinovi yakunida: progressStore'ga natijani yozadi va serverga
   * "o'qildi" holatini sinxronlaydi.
   */
  const handleFinished = useCallback(
    (result: FinishExamResponse) => {
      if (examKind !== 'mavzu' || !lessonId || !moduleId) return

      // Har bir savol 2 ball (blueprint points_per_item); breakdown bo'lmasa
      // ballardan savol soni chiqariladi.
      const total = result.breakdown
        ? result.breakdown.reduce((acc, b) => acc + b.jami, 0)
        : Math.round(result.max_score / 2)
      const correct = result.breakdown
        ? result.breakdown.reduce((acc, b) => acc + b.togri, 0)
        : Math.round(result.total_score / 2)

      completeTopic(moduleId, lessonId, correct, total)
      syncTopicProgress(lessonId).catch(() => {})
    },
    [completeTopic, examKind, lessonId, moduleId]
  )

  return (
    <ExamRunner
      gateway={gateway}
      examKind={examKind}
      moduleId={moduleId}
      lessonId={lessonId ?? undefined}
      backUrl={moduleId ? `/learn/${moduleId}` : undefined}
      onFinished={handleFinished}
    />
  )
}
