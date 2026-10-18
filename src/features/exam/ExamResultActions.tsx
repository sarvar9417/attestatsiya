import { ArrowLeft, BookOpen, ClipboardList, Home, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ExamResultActionsProps {
  examKind: string
  backUrl?: string
  moduleId?: string
  onRestart: () => void
}

/**
 * Results remain inside the immersive exam route, which intentionally hides
 * the standard sidebar. Keep accessible navigation visible while scrolling.
 */
export default function ExamResultActions({
  examKind,
  backUrl,
  moduleId,
  onRestart,
}: ExamResultActionsProps) {
  const isProfessionalPractice = examKind === 'pedagogik_15'
  const returnUrl = backUrl ?? '/learn'
  const theoryUrl = isProfessionalPractice
    ? '/learn/M15'
    : moduleId
      ? `/learn/${moduleId}`
      : '/learn'

  const secondaryLink =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-indigo-700'

  return (
    <nav
      aria-label="Natijadan keyingi navigatsiya"
      className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center gap-2 border-y border-gray-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 sm:mx-0 sm:rounded-xl sm:border"
    >
      <Link to="/" className={secondaryLink}>
        <Home size={16} aria-hidden="true" />
        Bosh sahifa
      </Link>
      <Link to={returnUrl} className={secondaryLink}>
        <ArrowLeft size={16} aria-hidden="true" />
        {examKind === 'custom' ? 'Test konstruktori' : isProfessionalPractice ? 'Testlarga qaytish' : 'Bo‘limga qaytish'}
      </Link>
      <Link to={theoryUrl} className={secondaryLink}>
        <BookOpen size={16} aria-hidden="true" />
        Nazariyani o‘rganish
      </Link>
      <Link to="/history" className={secondaryLink}>
        <ClipboardList size={16} aria-hidden="true" />
        Natijalar tarixi
      </Link>
      <button
        type="button"
        onClick={onRestart}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        <RefreshCw size={16} aria-hidden="true" />
        Yangi sinov
      </button>
    </nav>
  )
}
