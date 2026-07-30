import { useParams, useSearchParams } from 'react-router-dom'
import ExamRunner from '../features/exam/ExamRunner'
import type { ExamGateway } from '../features/exam/examGateway'

interface ExamPageProps {
  gateway?: ExamGateway
}

export default function ExamPage({ gateway }: ExamPageProps) {
  const { kind, moduleId } = useParams()
  const [searchParams] = useSearchParams()
  const lessonId = searchParams.get('lessonId')

  const examKind =
    kind === 'bolim' || kind === 'mavzu' || kind === 'mock' ? kind : 'mock'

  return (
    <ExamRunner
      gateway={gateway}
      examKind={examKind}
      moduleId={moduleId}
      lessonId={lessonId ?? undefined}
    />
  )
}
