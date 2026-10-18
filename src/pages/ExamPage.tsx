import { useCallback } from 'react'
import { Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { customExamConfigSchema } from '../features/custom-test/customTestApi'
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
  const location = useLocation()
  const customParsed = customExamConfigSchema.safeParse((location.state as { customConfig?: unknown } | null)?.customConfig)
  const customConfig = customParsed.success ? customParsed.data : undefined
  const [searchParams] = useSearchParams()
  const lessonId = searchParams.get('lessonId')
  const completeTopic = useProgressStore((s) => s.completeTopic)

  const examKind =
    kind === 'bolim' ||
    kind === 'mavzu' ||
    kind === 'mashq' ||
    kind === 'mock' ||
    kind === 'diagnostika' ||
    kind === 'takrorlash' ||
    kind === 'pedagogik_15' ||
    kind === 'custom' ||
    kind === 'zaif'
      ? kind
      : 'mock'

  const backUrl =
    examKind === 'custom' ? '/custom-test' :
    examKind === 'takrorlash' || examKind === 'zaif'
      ? '/review'
      : examKind === 'diagnostika'
        ? '/'
        : examKind === 'pedagogik_15'
          ? '/professional-practice'
          : moduleId
          ? `/learn/${moduleId}`
          : undefined

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

  if (examKind === 'custom' && !customConfig) return <Navigate to="/custom-test" replace />

  return (
    <ExamRunner
      gateway={gateway}
      examKind={examKind}
      customConfig={customConfig}
      moduleId={moduleId}
      lessonId={lessonId ?? undefined}
      backUrl={backUrl}
      onFinished={handleFinished}
    />
  )
}
