import { useState, useRef, useEffect, useMemo, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopicContent, type TestQuestion, type TheoryBlock } from '../../data/topicContent'
import { getLessonTestQuestions, checkQuestionAnswer } from '../../features/content/lessonContentGateway'
import { getTopicTestPreflight, type TopicTestPreflight } from '../../features/content/contentApi'
import { getLessonDetail } from '../../features/content/contentApi'
import { markdownToTheoryBlocks, overlayPublishedProfessionalLesson, resolveLearnerTheoryContent, verifiedM02Supplement } from '../../features/content/professionalLessonTheory'
import PedagogyTheoryBlock from './PedagogyTheoryBlock'
import { getPedagogyStudyNotes } from '../../data/pedagogyStudyNotes'
import type { TopicContent } from '../../data/topicContent'
import { 
  CheckCircle2, XCircle, Lightbulb, BookOpen, ArrowRight, ArrowLeft, 
  Sparkles, ChevronRight, ChevronUp, ChevronDown, BookText, GraduationCap, 
  Brain, FileQuestion, Target, RotateCcw, RefreshCw, ListChecks,
  Sigma, Table2, Quote, FileCode, BadgeInfo,
  BookMarked, Layers, Trophy, Eye,
  Fingerprint, Minus
} from 'lucide-react'
import { syncTopicProgress } from '../../lib/progressSync'

// Kitob ko'rinishi KaTeX va sxemalarni olib keladi — faqat shu mavzular
// ochilganda yuklanadi.
const BookReader = lazy(() => import('./theory/BookReader'))
import LessonStageBar from './LessonStageBar'
import InlineText from './theory/InlineText'

interface Props {
  moduleId: string
  subtopicId: string
  moduleTitle: string
  subtopicIndex?: number
  subtopicCount?: number
  onComplete: (correct: number, total: number) => void
  onBack: () => void
  /** Modul ro'yxatidagi keyingi mavzu — o'qish yakunida taklif qilinadi. */
  nextSubtopic?: { id: string; title: string } | null
  /** Boshqa mavzuga o'tish (modul sahifasi boshqaradi). */
  onOpenTopic?: (subtopicId: string) => void
}

type Phase = 'theory' | 'test' | 'result'

function isQuestionCorrect(q: TestQuestion, answer: unknown): boolean {
  if (q.type === 'Y1') return answer === q.correctIndex
  if (q.type === 'Y2' && q.pairs) {
    const ans = answer as Record<string, string> | undefined
    if (!ans) return false
    return q.pairs.every(p => ans[p.leftId] === p.rightContent)
  }
  if (q.type === 'Y3' && q.items && q.correctOrder) {
    const ans = answer as string[] | undefined
    if (!ans) return false
    return q.correctOrder.every((id, i) => id === ans[i])
  }
  return false
}

// ─── Type badge config ──────────────────────────────────────────
const TYPE_BADGE: Record<string, { label: string; icon: typeof BookOpen; cls: string }> = {
  Y1: { label: 'Bilish', icon: Eye, cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  Y2: { label: "Qo'llash", icon: Fingerprint, cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  Y3: { label: 'Mulohaza', icon: Brain, cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
}

// ─── Theory block config ────────────────────────────────────────
const THEORY_BLOCK_CONFIG = {
  definition: {
    icon: BookMarked,
    label: 'Ta\'rif',
    gradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30',
    border: 'border-l-blue-500 dark:border-l-blue-400',
    accent: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  formula: {
    icon: Sigma,
    label: 'Formula',
    gradient: 'from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/30',
    border: 'border-l-violet-500 dark:border-l-violet-400',
    accent: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  },
  table: {
    icon: Table2,
    label: 'Jadval',
    gradient: 'from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/30',
    border: 'border-l-teal-500 dark:border-l-teal-400',
    accent: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  },
  example: {
    icon: Lightbulb,
    label: 'Misol',
    gradient: 'from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30',
    border: 'border-l-amber-500 dark:border-l-amber-400',
    accent: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  note: {
    icon: BadgeInfo,
    label: 'Eslatma',
    gradient: 'from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/30',
    border: 'border-l-rose-500 dark:border-l-rose-400',
    accent: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  },
  code: {
    icon: FileCode,
    label: 'Kod',
    gradient: 'from-gray-900 to-gray-950 dark:from-gray-950 dark:to-black',
    border: 'border-l-gray-700 dark:border-l-gray-600',
    accent: 'text-emerald-400',
    badge: 'bg-gray-700 text-gray-200',
  },
  text: {
    icon: BookText,
    label: 'Matn',
    gradient: 'from-white to-gray-50 dark:from-gray-900 dark:to-gray-950',
    border: 'border-l-gray-300 dark:border-l-gray-600',
    accent: 'text-gray-600 dark:text-gray-400',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function TopicView({
  moduleId, subtopicId, moduleTitle, subtopicIndex, subtopicCount,
  onComplete, onBack, nextSubtopic, onOpenTopic,
}: Props) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('theory')
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [readProgress, setReadProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [animComplete, setAnimComplete] = useState(false)
  const [liveQuestions, setLiveQuestions] = useState<TestQuestion[] | null>(null)
  const [checking, setChecking] = useState<Record<string, boolean>>({})
  const contentRef = useRef<HTMLDivElement>(null)

  const [publishedTheory, setPublishedTheory] = useState<{ subtopicId: string; content: TopicContent } | null>(null)
  const [theoryResolved, setTheoryResolved] = useState<string | null>(null)
  const [supplementRequest, setSupplementRequest] = useState<{ id: string; attempt: number } | null>(null)
  const [supplementStatus, setSupplementStatus] = useState<{ id: string; state: 'loading' | 'ready' | 'error' } | null>(null)
  const [topicReadiness, setTopicReadiness] = useState<{ subtopicId: string; data: TopicTestPreflight } | null>(null)
  const [readinessRetry, setReadinessRetry] = useState(0)
  const [checkErrors, setCheckErrors] = useState<Record<string, string>>({})
  const isProfessionalLesson = /^(?:M04|M1[456])\.\d{2}$/.test(subtopicId)
  const isAlgoritmlashV2 = moduleId === 'M06' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subtopicId)
  const isPublishedScratchLogoLesson = moduleId === 'M07' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subtopicId)
  const isAxrM13 = moduleId === 'M13' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subtopicId)
  const isCanonicalPublishedTheory = /^(?:M04|M14|M16)\.\d{2}$/.test(subtopicId) ||
    isAlgoritmlashV2 || isAxrM13 || isPublishedScratchLogoLesson
  // Keep the same canonical core object during unrelated progress/test updates.
  const staticContent = useMemo(() => getTopicContent(subtopicId), [subtopicId])
  const isPedagogyTopic = moduleId === 'M15' && /^M15\.\d{2}$/.test(subtopicId)
  const loadedContent = publishedTheory?.subtopicId === subtopicId
    ? publishedTheory.content
    : null
  // M15 always keeps the original curated, colorful theory as primary content.
  // Canonical source lessons are optional reading and NEVER replace the screen
  // when the asynchronous request finishes.
  const content = staticContent
    ? resolveLearnerTheoryContent(subtopicId, staticContent, loadedContent)
    : loadedContent
  /** Kontent qo'llanmadan generatsiya qilinganmi (M01) — bo'limli o'qish rejimi. */
  const isBook = Boolean(content?.source)
  const isSemanticProfessional = !isPedagogyTopic && /^M1[46]$/.test(moduleId) && Boolean(loadedContent)
  const pedagogyStudyNotes = isPedagogyTopic ? getPedagogyStudyNotes(subtopicId) : []
  const isOptionalSupplement = /^M02\.\d{2}$/.test(subtopicId) || isPedagogyTopic
  const isSupplementLoading = supplementStatus?.id === subtopicId && supplementStatus.state === 'loading'
  const supplementError = supplementStatus?.id === subtopicId && supplementStatus.state === 'error'
  const supplementalTheory = isPedagogyTopic
    ? (loadedContent?.supplementalTheory ?? [])
    : /^M02\.\d{2}$/.test(subtopicId)
      ? verifiedM02Supplement(loadedContent)
      : []

  // mavzu almashganda o'qish holatini tozalaymiz
  useEffect(() => {
    setPhase('theory')
    setAnswers({})
    setSubmitted({})
    setReadProgress(0)
    setCurrentSection(0)
    setLiveQuestions(null)
    setChecking({})
    setCheckErrors({})
    setSupplementRequest(null)
    setSupplementStatus(null)
  }, [subtopicId])

  // Opening an optional supplement is an explicit student action. Never fetch
  // it in the background and append content while the main theory is being read.
  useEffect(() => {
    if (!supplementRequest || supplementRequest.id !== subtopicId || !isOptionalSupplement) return
    let cancelled = false
    const fallback = getTopicContent(subtopicId)
    if (!fallback) return
    setSupplementStatus({ id: subtopicId, state: 'loading' })
    getLessonDetail(subtopicId)
      .then(lesson => {
        if (cancelled) return
        setPublishedTheory({
          subtopicId,
          content: overlayPublishedProfessionalLesson(fallback, lesson),
        })
        setSupplementStatus({ id: subtopicId, state: 'ready' })
      })
      .catch(() => {
        if (!cancelled) setSupplementStatus({ id: subtopicId, state: 'error' })
      })
    return () => { cancelled = true }
  }, [supplementRequest, subtopicId, isOptionalSupplement])

  // Canonical remote lessons are resolved BEFORE displaying theory, otherwise
  // students see one static lesson replaced by a different one mid-reading.
  // M02/M15 stay stable static cores, with supplements loaded only on demand.
  useEffect(() => {
    if (!/^(?:M04|M14|M16)\.\d{2}$/.test(subtopicId)) return
    let cancelled = false
    const fallback = getTopicContent(subtopicId)
    if (!fallback) return
    getLessonDetail(subtopicId)
      .then(lesson => {
        if (!cancelled) {
          setPublishedTheory({
            subtopicId,
            content: overlayPublishedProfessionalLesson(fallback, lesson),
          })
          setTheoryResolved(subtopicId)
        }
      })
      .catch(() => {
        // Keep static material as a single offline fallback, not a flash.
        if (!cancelled) setTheoryResolved(subtopicId)
      })
    return () => { cancelled = true }
  }, [subtopicId])

  // M06 V2 and M13 AXR learner theory come strictly from published DB records.
  // Catalog links edition UUIDs only when all relevant chapters are published.
  useEffect(() => {
    if (!isAlgoritmlashV2 && !isAxrM13) return
    let cancelled = false
    getLessonDetail(subtopicId)
      .then(lesson => {
        if (cancelled || lesson.status !== 'published' || !lesson.body_mdx?.trim() ||
            !(isAlgoritmlashV2
              ? lesson.slug.startsWith('algoritmlash-v2-')
              : /^m13-axr-0[1-7]$/.test(lesson.slug))) return
        setPublishedTheory({
          subtopicId,
          content: {
            subtopicId,
            title: lesson.title_uz,
            source: isAlgoritmlashV2 ? 'Algoritmlash V2' : 'Axborot xavfsizligi — 2026',
            kind: lesson.blocks_kind === 'appendix' ? 'appendix' : 'chapter',
            theory: markdownToTheoryBlocks(lesson.body_mdx),
            questions: [],
          },
        })
      })
      .catch(() => { /* Fail closed on unpublished or unavailable theory. */ })
      .finally(() => { if (!cancelled) setTheoryResolved(subtopicId) })
    return () => { cancelled = true }
  }, [isAlgoritmlashV2, isAxrM13, subtopicId])

  // M07 previously rendered only six short static topics. The twelve source-
  // backed published lessons now load their complete body_mdx into BookReader.
  useEffect(() => {
    if (!isPublishedScratchLogoLesson) return
    let cancelled = false
    getLessonDetail(subtopicId)
      .then(lesson => {
        if (cancelled || lesson.status !== 'published' || !lesson.body_mdx?.trim()
          || !/^(?:scratch|logo)/i.test(lesson.slug)) return
        const theory = markdownToTheoryBlocks(lesson.body_mdx)
        if (theory.length === 0) return
        setPublishedTheory({
          subtopicId,
          content: {
            subtopicId,
            title: lesson.title_uz,
            source: 'Scratch/LOGO — 2026',
            kind: 'chapter',
            theory,
            questions: [],
          },
        })
      })
      .catch(() => { /* Fail closed: do not display incomplete draft theory. */ })
      .finally(() => { if (!cancelled) setTheoryResolved(subtopicId) })
    return () => { cancelled = true }
  }, [isPublishedScratchLogoLesson, subtopicId])

  // Published/keyed lesson coverage must be checked by the authoritative
  // backend generator preflight, not by the number of visible learning questions.
  useEffect(() => {
    let active = true
    getTopicTestPreflight(subtopicId)
      .then(data => { if (active) setTopicReadiness({ subtopicId, data }) })
      .catch(() => { if (active) setTopicReadiness(null) })
    return () => { active = false }
  }, [subtopicId, isProfessionalLesson, isAlgoritmlashV2, isAxrM13, readinessRetry])

  // Savollar backend-first: gateway backend xatosida statik kontentga tushadi
  useEffect(() => {
    let cancelled = false
    getLessonTestQuestions(subtopicId).then((qs) => {
      if (!cancelled) setLiveQuestions(qs)
    })
    return () => {
      cancelled = true
    }
  }, [subtopicId])

  useEffect(() => {
    if (isBook || phase !== 'theory' || !content) return
    // Use IntersectionObserver for reliable scroll tracking
    const blocks = document.querySelectorAll<HTMLElement>('[data-section-index]')
    if (blocks.length === 0) return

    // Count fully visible blocks
    // Track which blocks have been seen (in viewport at least once)
    const seenBlocks = new Set<number>()
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          const idx = parseInt(e.target.getAttribute('data-section-index') || '0')
          if (e.isIntersecting) {
            seenBlocks.add(idx)
          }
        })
        // Progress = (scroll-based + block-based) / 2 for smooth tracking
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight
        const winHeight = window.innerHeight
        const maxScroll = docHeight - winHeight
        const scrollPct = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 100
        const blockPct = (seenBlocks.size / Math.max(blocks.length, 1)) * 100
        // Use the higher of the two for a more accurate reading
        setReadProgress(Math.max(scrollPct, blockPct))
      },
      { threshold: [0.1, 0.5, 0.9] }
    )
    blocks.forEach(b => observer.observe(b))

    // Also listen to scroll for more granular progress
    const scrollHandler = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const maxScroll = docHeight - winHeight
      const scrollPct = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 100
      const blockPct = (seenBlocks.size / Math.max(blocks.length, 1)) * 100
      setReadProgress(Math.max(scrollPct, blockPct))
    }
    window.addEventListener('scroll', scrollHandler, { passive: true })
    scrollHandler()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [isBook, phase, content])

  useEffect(() => {
    if (isBook || phase !== 'theory' || !content) return
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const sections = document.querySelectorAll<HTMLElement>('[data-section-index]')
          if (sections.length === 0) { ticking = false; return }
          let closestIdx = 0
          let closestDist = Infinity
          sections.forEach((s, i) => {
            const rect = s.getBoundingClientRect()
            const dist = Math.abs(rect.top - 100) // offset for header
            if (dist < closestDist) { closestDist = dist; closestIdx = i }
          })
          setCurrentSection(closestIdx)
          ticking = false
        })
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isBook, phase, content])

  useEffect(() => {
    if (phase === 'result') {
      const t = setTimeout(() => setAnimComplete(true), 600)
      return () => clearTimeout(t)
    }
  }, [phase])

  const questions = liveQuestions ?? (content?.questions || [])
  const correctCount = questions.filter(q => submitted[q.id] && isQuestionCorrect(q, answers[q.id])).length
  const allAnswered = questions.every(q => submitted[q.id])
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0
  const passed = score >= 80

  /** Qo'llanma ilovasi (formulalar varag'i, lug'at, manbalar) — testi yo'q. */
  const isAppendix = content?.kind === 'appendix'
  /** Testga o'tish imkoni bormi. */
  const currentReadiness = topicReadiness?.subtopicId === subtopicId ? topicReadiness.data : null
  const hasTest = currentReadiness?.ready === true
  const displayedTestCount = currentReadiness?.required ?? 0
  const handleTopicTestAction = () => {
    if (hasTest) navigate(`/exam/mavzu/${moduleId}?lessonId=${subtopicId}`)
    else if (!isProfessionalLesson && !isPublishedScratchLogoLesson && (!isAlgoritmlashV2 || isAppendix)) handleComplete(0, 0)
  }

  // Theory type distribution
  const theoryTypeCount = useMemo(() => {
    if (!content) return {}
    const counts: Record<string, number> = {}
    for (const block of content.theory) {
      counts[block.type] = (counts[block.type] || 0) + 1
    }
    return counts
  }, [content])

  /** Kitobdagi bo'limlar (\section) soni — sarlavhadagi mo'ljal uchun. */
  const sectionCount = useMemo(() => {
    if (!content) return 0
    return Math.max(content.theory.filter(b => b.type === 'heading').length, 1)
  }, [content])

  const handleAnswer = (qId: string, answer: unknown) => {
    if (submitted[qId]) return
    setCheckErrors(p => ({ ...p, [qId]: '' }))
    setAnswers(p => ({ ...p, [qId]: answer }))
  }

  const handleSubmit = async (qId: string) => {
    if (answers[qId] === undefined) return
    if (submitted[qId] || checking[qId]) return
    const q = questions.find(x => x.id === qId)
    if (q?.source === 'backend' && q.type === 'Y1') {
      // Server-authoritative check: natija kelgach correctIndex o'rnatiladi
      setChecking(p => ({ ...p, [qId]: true }))
      try {
        const result = await checkQuestionAnswer(q, answers[qId] as number)
        if (result.correctIndex < 0) {
          setCheckErrors(p => ({
            ...p,
            [qId]: 'Javobni tekshirib bo‘lmadi. Internetni tekshirib qayta urining.',
          }))
          return // Never misgrade a failed server check.
        }
        if (result.correctIndex >= 0) {
          setLiveQuestions(qs =>
            (qs ?? []).map(x =>
              x.id === qId ? { ...x, correctIndex: result.correctIndex, explanation: result.explanation } : x
            )
          )
        }
      } finally {
        setChecking(p => ({ ...p, [qId]: false }))
      }
    }
    setSubmitted(p => ({ ...p, [qId]: true }))
  }

  const handleComplete = (correct: number, total: number) => {
    syncTopicProgress(subtopicId).catch(() => {})
    onComplete(correct, total)
  }

  if (isCanonicalPublishedTheory && theoryResolved !== subtopicId) {
    return (
      <div role="status" aria-live="polite" className="flex min-h-[60vh] items-center justify-center gap-3 text-gray-600 dark:text-gray-300">
        <RefreshCw className="animate-spin" size={22} aria-hidden="true" />
        <span>Asosiy nazariya tayyorlanmoqda…</span>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookText size={48} className="mx-auto text-gray-300" />
          <p className="text-gray-400 text-lg">Bu mavzu uchun kontent tayyor emas</p>
          <button onClick={onBack} className="btn-ghost text-sm">
            <ArrowLeft size={14} className="inline mr-1" /> Orqaga qaytish
          </button>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // RESULT PHASE
  // ══════════════════════════════════════════════════════════════
  if (phase === 'result') {
    const wrongTopics = questions.filter(q => !isQuestionCorrect(q, answers[q.id]))
    const scoreColor = passed ? 'from-emerald-400 to-emerald-600' : 'from-red-400 to-red-600'

    return (
      <div className="space-y-5 animate-fade-in">
        <LessonStageBar
          phase="result"
          moduleTitle={moduleTitle}
          topicTitle={content.title}
          moduleCode={moduleId}
          topicIndex={subtopicIndex}
          topicCount={subtopicCount}
          onBack={onBack}
        />

        {/* ═══ Score Hero ═══ */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${scoreColor} p-7 text-white shadow-lg ${passed ? 'shadow-emerald-200 dark:shadow-emerald-900/30' : 'shadow-red-200 dark:shadow-red-900/30'}`}>
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white" />
          </div>
          <div className="relative text-center">
            {/* Score circle */}
            <div className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center bg-white/20 backdrop-blur-sm border-2 border-white/30 ${animComplete ? 'animate-pop-in' : 'opacity-0'}`}>
              {passed ? <Trophy size={36} className="text-white" /> : <Target size={36} className="text-white" />}
            </div>
            <h2 className="text-xl font-bold mb-1">
              {passed ? 'Ajoyib natija! 🎉' : 'Yaxshi urinish! 💪'}
            </h2>
            <div className={`text-6xl font-black tracking-tight mb-1 ${animComplete ? 'animate-count-up' : 'opacity-0'}`}>
              {score}%
            </div>
            <p className="text-white/80 text-sm mb-3">{correctCount}/{questions.length} ta to'g'ri javob</p>
            {passed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                <Sparkles size={14} /> Mavzu o'zlashtirildi
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                <Target size={14} /> 80% talab qilinadi
              </span>
            )}
          </div>
        </div>

        {/* ═══ Score Breakdown Grid ═══ */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "To'g'ri", value: correctCount, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' },
            { label: "Noto'g'ri", value: questions.length - correctCount, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' },
            { label: "O'tkazib yuborilgan", value: questions.length - Object.keys(submitted).length, icon: Minus, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className={`rounded-2xl border ${s.bg} p-4 text-center`}>
                <Icon size={20} className={`mx-auto mb-1.5 ${s.color}`} />
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            )
          })}
        </div>

        {/* ═══ Error Analysis ═══ */}
        {!passed && wrongTopics.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-red-50 dark:border-red-900/20">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                <XCircle size={18} className="text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">Xatolar tahlili</p>
                <p className="text-xs text-gray-400">{wrongTopics.length} ta savol — qayta ko'rib chiqing</p>
              </div>
            </div>
            <div className="p-5 space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
              {wrongTopics.map((q, i) => (
                <div key={q.id} className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/20">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-xs font-bold text-red-600 dark:text-red-400 shrink-0 mt-0.5">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200 mb-2 text-sm"><InlineText text={q.text} /></p>
                      <div className="space-y-1.5 text-xs">
                        {renderAnswerDetail(q, answers)}
                      </div>
                      <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Tushuntirish: </span>
                          <InlineText text={q.explanation} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Actions ═══ */}
        <div className="flex gap-3">
          {!passed && (
            <button 
              onClick={() => navigate(`/exam/mavzu/${moduleId}?lessonId=${subtopicId}`)} 
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-amber-200 dark:shadow-amber-900/30"
            >
              <RotateCcw size={16} /> Qayta urinish
            </button>
          )}
          <button
            onClick={() => {
              handleComplete(correctCount, questions.length)
              if (passed && nextSubtopic && onOpenTopic) onOpenTopic(nextSubtopic.id)
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
              passed 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {passed
              ? <><Trophy size={16} /> {nextSubtopic && onOpenTopic ? 'Keyingi mavzu' : 'Mavzuni yakunlash'} <ArrowRight size={16} /></>
              : 'Keyinroq urinaman'}
          </button>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // THEORY & TEST PHASES
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="animate-fade-in">
      {/* ═══ Reading Progress Bar ═══ */}
      {phase === 'theory' && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100 dark:bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 transition-all duration-200 ease-out"
            style={{ width: `${readProgress}%` }} 
          />
        </div>
      )}

      <LessonStageBar
        phase={phase}
        moduleTitle={moduleTitle}
        topicTitle={content.title}
        moduleCode={moduleId}
        topicIndex={subtopicIndex}
        topicCount={subtopicCount}
        onBack={onBack}
      />

      {/* ════════════════════════════════════════════════════════
          THEORY PHASE
          ════════════════════════════════════════════════════════ */}
      {phase === 'theory' && (
        <div ref={contentRef}>
          {/* ── Header ── */}
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] font-semibold font-mono shadow-sm">
                {moduleId}
              </span>
              {subtopicCount !== undefined && subtopicCount > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                  <Layers size={12} /> {subtopicIndex! + 1}/{subtopicCount} mavzu
                </span>
              )}
              {isBook ? (
                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                  <BookText size={12} /> {sectionCount} ta bo'lim
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                  <BookText size={12} /> {isSemanticProfessional ? 'Tartibli nazariya va misollar' : content.theory.length + ' ta blok'}
                </span>
              )}
              {/* Theory type badges — scroll rejimidagi eski mavzular uchun */}
              {isBook || isSemanticProfessional
                ? null
                : Object.entries(theoryTypeCount).map(([type, count]) => {
                    const cfg = THEORY_BLOCK_CONFIG[type as keyof typeof THEORY_BLOCK_CONFIG]
                    if (!cfg) return null
                    return (
                      <span key={type} className={`text-[10px] px-2 py-0.5 rounded-md ${cfg.badge}`}>
                        {count} × {cfg.label}
                      </span>
                    )
                  })}
              {/* Question count */}
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <FileQuestion size={10} /> {hasTest
                  ? `${displayedTestCount} ta savol`
                  : isAppendix ? "ma'lumotnoma" : "test tayyorlanmoqda"}
              </span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">
                  Asosiy tushuncha
                </p>
                <h2 className="mt-1 text-xl font-bold leading-tight text-gray-900 dark:text-white sm:text-2xl">
                  {content.title}
                </h2>
              </div>
              {phase === 'theory' && !isBook && (
                <div className="min-w-[140px]">
                  <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-gray-400">
                    <span>O‘qish progressi</span>
                    <span>{Math.round(readProgress)}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-[width] duration-300"
                      style={{ width: `${Math.round(readProgress)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isAppendix && !hasTest && (
            <div role="status" aria-live="polite"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-100">
              <div>
                <strong>Mavzu testi hali tayyor emas.</strong>{' '}
                {currentReadiness
                  ? `Hozir ${currentReadiness.available}/${currentReadiness.required} ta mos savol mavjud. Nazariyani o‘rganishda davom etishingiz mumkin.`
                  : 'Test holatini serverdan olib bo‘lmadi. Nazariyani o‘rganishda davom etishingiz mumkin.'}
              </div>
              <button type="button"
                onClick={() => setReadinessRetry(n => n + 1)}
                className="min-h-10 shrink-0 rounded-lg border border-amber-400 px-3 font-semibold hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-amber-700 dark:hover:bg-amber-900/30">
                Holatni qayta tekshirish
              </button>
            </div>
          )}

          {/* ── Theory Content Blocks ── */}
          {isBook ? (
            <div className="mb-6">
              <Suspense fallback={
                <div className="flex items-center gap-2 py-10 justify-center text-sm text-gray-400">
                  <BookText size={16} className="animate-pulse" /> Nazariya yuklanmoqda…
                </div>
              }>
                <BookReader
                  content={content}
                  questionCount={hasTest ? displayedTestCount : 0}
                  isAppendix={isAppendix}
                  requireTest={isPublishedScratchLogoLesson}
                  onProgress={setReadProgress}
                  onFinishReading={handleTopicTestAction}
                  nextTopic={nextSubtopic ?? null}
                  onOpenNextTopic={nextSubtopic && onOpenTopic
                    ? () => onOpenTopic(nextSubtopic.id)
                    : undefined}
                />
              </Suspense>
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {content.theory.map((block, i) => (
                <div key={i} data-section-index={i} className="animate-block-entrance" style={{ animationDelay: `${i * 60}ms` }}>
                  {/* Section divider (except first) */}
                  {i > 0 && (
                    <div className="content-divider">
                      <div className="content-divider-icon">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                      </div>
                    </div>
                  )}
                  {isSemanticProfessional ? <PedagogyTheoryBlock block={block} /> : <TheoryBlock block={block} />}
                </div>
              ))}
            </div>
          )}

          {isPedagogyTopic && pedagogyStudyNotes.length > 0 && (
            <details className="group mb-7 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 shadow-sm open:bg-white dark:border-indigo-900 dark:bg-indigo-950/30 dark:open:bg-gray-900 sm:p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-2 text-sm font-bold text-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-200">
                <span className="flex items-center gap-2"><Lightbulb size={19} aria-hidden="true" /> Oddiy misollar va attestatsiyada farqlash</span>
                <ChevronDown size={19} aria-hidden="true" className="shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="px-2 pb-3 pt-1 text-xs leading-6 text-gray-600 dark:text-gray-400">
                Asosiy nazariyani o‘qib bo‘lgach, misollar yordamida tushunchalarni mustahkamlang.
              </p>
              <div className="space-y-3">
                {pedagogyStudyNotes.map((block, i) => <PedagogyTheoryBlock key={i} block={block} />)}
              </div>

            </details>
          )}

          {isOptionalSupplement && (
            <details
              key={subtopicId}
              onToggle={event => {
                if (!event.currentTarget.open) return
                if (supplementStatus?.id === subtopicId && supplementStatus.state === 'ready') return
                if (supplementStatus?.id === subtopicId && supplementStatus.state === 'loading') return
                setSupplementRequest(previous => ({ id: subtopicId, attempt: (previous?.attempt ?? 0) + 1 }))
              }}
              className="group mb-8 rounded-2xl border border-teal-200 bg-white p-4 shadow-sm dark:border-teal-900 dark:bg-gray-900 sm:p-5"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 rounded-xl p-2 text-sm font-bold text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-teal-200">
                <span className="flex items-center gap-2"><BookText size={19} aria-hidden="true" /> Tekshirilgan qo‘shimcha material (ixtiyoriy)</span>
                <ChevronDown size={19} aria-hidden="true" className="shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="px-2 pb-3 text-xs leading-6 text-gray-600 dark:text-gray-400">
                Asosiy nazariya o‘zgarmaydi. Qo‘shimcha material faqat bu bo‘lim ochilganda yuklanadi.
              </p>
              {isSupplementLoading && <p role="status" className="p-3 text-sm">Qo‘shimcha material yuklanmoqda…</p>}
              {supplementError && <p role="alert" className="p-3 text-sm text-amber-700 dark:text-amber-300">Materialni olib bo‘lmadi. Qayta urinish uchun bo‘limni yopib oching.</p>}
              {!isSupplementLoading && !supplementError && supplementStatus?.id === subtopicId && supplementStatus.state === 'ready' && (
                supplementalTheory.length > 0
                  ? <div className="space-y-3">{supplementalTheory.map((block, i) => <PedagogyTheoryBlock key={i} block={block} />)}</div>
                  : <p className="p-3 text-sm text-gray-500">Bu darsga alohida tekshirilgan qo‘shimcha kiritilmagan.</p>
              )}
            </details>
          )}

          {/* ── Eski (LaTeX'siz) mavzular uchun scroll rejimi ── */}
          {!isBook && (<>
          {/* ── Section Progress ── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Show responsive: full dots on desktop, summary on mobile */}
              <div className={isSemanticProfessional ? 'hidden' : 'hidden sm:flex gap-1.5'}>
                {content.theory.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentSection 
                        ? 'bg-primary-500 scale-125 w-3' 
                        : i < currentSection 
                          ? 'bg-primary-300' 
                          : 'bg-gray-200 dark:bg-gray-700'
                    }`} 
                  />
                ))}
              </div>
              {/* Mobile: condensed progress bar */}
              <div className="sm:hidden w-24 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300" 
                  style={{ width: `${(currentSection + 1) / content.theory.length * 100}%` }} 
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium tabular-nums">
                <span className="text-primary-600 dark:text-primary-400 font-semibold">{currentSection + 1}</span>
                <span className="text-gray-300 dark:text-gray-600">/{content.theory.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Reading progress with visual bar */}
              <div className="hidden sm:block w-16 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300" style={{ width: `${Math.round(readProgress)}%` }} />
              </div>
              <span className={`text-xs font-medium tabular-nums ${
                readProgress > 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {Math.round(readProgress)}%
              </span>
            </div>
          </div>

          {/* ── Reading Complete CTA ── */}
          <div className="relative text-center py-16">
            {readProgress > 70 && (
              <>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/50 to-transparent dark:via-primary-950/20 rounded-3xl" />
                <div className="relative animate-pop-in">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200 dark:shadow-primary-900/30 animate-pulse-glow">
                    <Brain size={32} className="text-white" />
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">Nazariy qism yakunlandi</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                    {hasTest
                      ? `Endi bilimingizni sinab ko'ring — ${displayedTestCount} ta savol`
                      : isProfessionalLesson
                        ? currentReadiness
                          ? `Mavzu testi tayyorlanmoqda: ${currentReadiness.available}/${currentReadiness.required} mos savol.`
                          : 'Testning tayyorligini tekshirib bo‘lmadi.'
                        : isAppendix
                        ? "Bu ilova takrorlash uchun — test ko'zda tutilmagan"
                        : "Bu mavzu uchun test hali qo'shilmagan"}
                  </p>
                  <button
                    onClick={handleTopicTestAction}
                disabled={(isProfessionalLesson || (isAlgoritmlashV2 && !isAppendix)) && !hasTest}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-xl shadow-primary-200 dark:shadow-primary-900/40 hover:shadow-2xl hover:-translate-y-0.5 animate-pop-in"
                  >
                    {hasTest
                      ? <><Target size={16} /> Bilimni tekshirish <ArrowRight size={16} /></>
                      : (isProfessionalLesson || isAlgoritmlashV2) ? <><RefreshCw size={16} /> Test hali tayyor emas</>
                      : <><CheckCircle2 size={16} /> Mavzuni yakunlash <ArrowRight size={16} /></>}
                  </button>
                </div>
              </>
            )}
            {readProgress <= 70 && (
              <div className="relative">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                  </div>
                  <span>Sahifani pastga surib o'qishni davom ettiring</span>
                  <ChevronDown size={16} className="animate-scroll-indicator" />
                </div>
                <div className="flex justify-center mt-4">
                  <div className="flex gap-1.5">
                    {content.theory.slice(-3).map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentSection >= content.theory.length - 3 + i 
                          ? 'bg-primary-500' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Start Test Button ── */}
          <div className={`sticky bottom-20 sm:bottom-6 flex justify-center transition-all duration-700 z-30 ${
            readProgress > 10 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}>
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-3 sm:p-4">
              {readProgress < 100 && (
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300" style={{ width: `${Math.round(readProgress)}%` }} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400">{Math.round(readProgress)}%</span>
                </div>
              )}
              <button
                onClick={handleTopicTestAction}
                disabled={(isProfessionalLesson || (isAlgoritmlashV2 && !isAppendix)) && !hasTest}
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  {hasTest
                    ? <Target size={16} className="text-white" />
                    : <CheckCircle2 size={16} className="text-white" />}
                </span>
                <span>{hasTest ? 'Bilimni tekshirish' : (isProfessionalLesson || isAlgoritmlashV2) ? 'Mavzu testi tayyorlanmoqda' : 'Mavzuni yakunlash'}</span>
                {hasTest && (
                  <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-lg whitespace-nowrap">{displayedTestCount} ta savol</span>
                )}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          </>)}

        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TEST PHASE
          ════════════════════════════════════════════════════════ */}
      {phase === 'test' && (
        <div className="space-y-6">
          {/* ── Test Progress Header ── */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">Bilimni tekshirish</p>
                  <p className="text-xs text-gray-400">{Object.keys(submitted).length}/{questions.length} bajarildi</p>
                </div>
              </div>
              {Object.keys(submitted).length > 0 && (
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-400">Natija:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</span>
                    <span className="text-gray-400">/ {Object.keys(submitted).length}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
                style={{ width: `${(Object.keys(submitted).length / questions.length) * 100}%` }} 
              />
            </div>
          </div>

          {/* ── Questions ── */}
          <div className="space-y-5">
            {questions.map((q, idx) => (
              <div key={q.id}>
              <QuestionCard
                question={q}
                index={idx}
                total={questions.length}
                selected={answers[q.id]}
                isSubmitted={submitted[q.id]}
                onSelect={(a) => handleAnswer(q.id, a)}
                onSubmit={() => handleSubmit(q.id)}
              />
              {checkErrors[q.id] && (
                <p role="alert" className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                  {checkErrors[q.id]}
                </p>
              )}
              </div>
            ))}
          </div>

          {/* ── Finish Button ── */}
          {allAnswered && (
            <div className="sticky bottom-4">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      Barcha savollar bajarildi
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{correctCount}/{questions.length}</span>
                </div>
                <button 
                  onClick={() => setPhase('result')} 
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-200 dark:shadow-primary-900/30 flex items-center justify-center gap-2"
                >
                  Natijani ko'rish <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// ANSWER DETAIL (Result phase)
// ═══════════════════════════════════════════════════════════════════
function renderAnswerDetail(q: TestQuestion, answers: Record<string, unknown>) {
  if (q.type === 'Y1') {
    return (
      <>
        <div className="flex items-center gap-2">
          <XCircle size={12} className="text-red-500 shrink-0" />
          <span className="text-red-600 dark:text-red-400"><span className="font-medium text-gray-500">Siz:</span> <InlineText text={q.options[answers[q.id] as number] ?? ''} /></span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
          <span className="text-emerald-600 dark:text-emerald-400"><span className="font-medium text-gray-500">To'g'ri:</span> <InlineText text={q.options[q.correctIndex] ?? ''} /></span>
        </div>
      </>
    )
  }
  if (q.type === 'Y2' && q.pairs) {
    const ans = answers[q.id] as Record<string, string> | undefined
    return (
      <div className="space-y-1.5">
        {q.pairs.map(p => (
          <div key={p.leftId} className="flex items-center gap-2">
            {ans && ans[p.leftId] === p.rightContent 
              ? <CheckCircle2 size={12} className="text-emerald-500 shrink-0" /> 
              : <XCircle size={12} className="text-red-500 shrink-0" />
            }
            <span className="text-gray-600 dark:text-gray-400">{p.leftContent} → <span className="font-medium">{ans?.[p.leftId] || '(tanlanmagan)'}</span></span>
            {ans && ans[p.leftId] !== p.rightContent && (
              <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">(to'g'ri: {p.rightContent})</span>
            )}
          </div>
        ))}
      </div>
    )
  }
  if (q.type === 'Y3' && q.items && q.correctOrder) {
    const ans = answers[q.id] as string[] | undefined
    return (
      <div className="space-y-1.5">
        {q.correctOrder.map((id, i) => {
          const item = q.items!.find(it => it.id === id)
          const userPos = ans ? ans.indexOf(id) : -1
          const isCorrect = ans && ans[i] === id
          return (
            <div key={id} className="flex items-center gap-2 text-xs">
              {isCorrect 
                ? <CheckCircle2 size={12} className="text-emerald-500 shrink-0" /> 
                : <XCircle size={12} className="text-red-500 shrink-0" />
              }
              <span className="text-gray-600 dark:text-gray-400">
                <span className="font-mono text-gray-400">{i + 1}.</span> {item?.content}
              </span>
              {!isCorrect && userPos >= 0 && (
                <span className="text-red-400">(siz {userPos + 1}-o'ringa qo'ygansiz)</span>
              )}
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

// ═══════════════════════════════════════════════════════════════════
// TEXT PARSING
// ═══════════════════════════════════════════════════════════════════
interface TextSegment {
  type: 'paragraph' | 'bullet-list' | 'subheading' | 'definition'
  items: string[]
}

function parseTextContent(content: string): TextSegment[] {
  const lines = content.split('\n')
  const segments: TextSegment[] = []
  let current: TextSegment | null = null

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { if (current) { segments.push(current); current = null } continue }

    if (line.startsWith('•') || line.startsWith('- ') || /^\d+[.)] /.test(line)) {
      if (current?.type !== 'bullet-list') { if (current) segments.push(current); current = { type: 'bullet-list', items: [] } }
      current.items.push(line.replace(/^[•-]\s*/, '').replace(/^\d+[.)]\s*/, ''))
    } else if (line.endsWith(':') && line.length < 60) {
      if (current) segments.push(current)
      current = { type: 'subheading', items: [line.slice(0, -1)] }
    } else if (line.includes(' — ')) {
      if (current?.type === 'definition') { current.items.push(line) }
      else { if (current) segments.push(current); current = { type: 'definition', items: [line] } }
    } else {
      if (current?.type !== 'paragraph') { if (current) segments.push(current); current = { type: 'paragraph', items: [] } }
      current.items.push(line)
    }
  }
  if (current) segments.push(current)
  return segments
}

// ─── Highlight «...» terms ──────────────────────────────────────
function highlightTerms(text: string): (string | JSX.Element)[] {
  const parts = text.split(/(«[^»]+»)/g)
  return parts.map((part, i) => {
    if (part.startsWith('«') && part.endsWith('»')) {
      return (
        <span key={i} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold text-[13px]">
          <Quote size={10} className="shrink-0" />
          {part.replace(/[«»]/g, '')}
        </span>
      )
    }
    return part
  })
}

// ═══════════════════════════════════════════════════════════════════
// THEORY BLOCK — Rich visual component per type
// ═══════════════════════════════════════════════════════════════════
function TheoryBlock({ block }: { block: TheoryBlock }) {
  const cfg = THEORY_BLOCK_CONFIG[block.type as keyof typeof THEORY_BLOCK_CONFIG] || THEORY_BLOCK_CONFIG.text
  const Icon = cfg.icon

  switch (block.type) {
    case 'definition':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.gradient} border-l-4 ${cfg.border} border border-gray-100 dark:border-gray-800 shadow-sm group hover:shadow-md transition-all duration-300`}>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-current" />
          </div>
          <div className="relative p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-8 h-8 rounded-xl ${cfg.badge} flex items-center justify-center`}>
                <Icon size={16} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${cfg.accent}`}>Ta'rif</span>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {highlightTerms(block.content)}
            </p>
          </div>
        </div>
      )

    case 'formula':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.gradient} border-l-4 ${cfg.border} border border-gray-100 dark:border-gray-800 shadow-sm group hover:shadow-md transition-all duration-300`}>
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-5 right-5 text-6xl font-mono font-black text-current">∑</div>
          </div>
          <div className="relative p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-8 h-8 rounded-xl ${cfg.badge} flex items-center justify-center`}>
                <Icon size={16} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${cfg.accent}`}>Formula</span>
            </div>
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <code className="block text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-center font-semibold">
                {block.content}
              </code>
            </div>
          </div>
        </div>
      )

    case 'code':
      return (
        <div className="rounded-2xl overflow-hidden border border-gray-700 dark:border-gray-600 shadow-lg group hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between px-5 py-3 bg-gray-800 dark:bg-gray-950 border-b border-gray-700 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-gray-400 font-mono">{block.language || 'code'}</span>
            </div>
            <button 
              onClick={() => { try { navigator.clipboard.writeText(block.content) } catch {} }} 
              className="text-xs text-gray-400 hover:text-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Nusxa olish
            </button>
          </div>
          <pre className="p-5 text-sm font-mono text-gray-100 bg-gray-900 dark:bg-black overflow-x-auto leading-relaxed">
            <code>{block.content}</code>
          </pre>
        </div>
      )

    case 'example':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.gradient} border-l-4 ${cfg.border} border border-gray-100 dark:border-gray-800 shadow-sm group hover:shadow-md transition-all duration-300`}>
          <div className="relative p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-8 h-8 rounded-xl ${cfg.badge} flex items-center justify-center`}>
                <Icon size={16} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${cfg.accent}`}>Misol</span>
            </div>
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <code className="block text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                {block.content}
              </code>
            </div>
          </div>
        </div>
      )

    case 'note':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.gradient} border-l-4 ${cfg.border} border border-gray-100 dark:border-gray-800 shadow-sm group hover:shadow-md transition-all duration-300`}>
          <div className="relative p-5">
            <div className="flex items-start gap-4">
              <div className={`w-9 h-9 rounded-xl ${cfg.badge} flex items-center justify-center shrink-0`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${cfg.accent}`}>Eslatma</span>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{block.content}</p>
              </div>
            </div>
          </div>
        </div>
      )

    case 'table':
      return (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm group hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3 bg-gray-50 dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800">
            <div className={`w-7 h-7 rounded-lg ${cfg.badge} flex items-center justify-center`}>
              <Icon size={14} />
            </div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.accent}`}>Jadval</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {(() => {
                const rows = block.content.split('\n').filter(r => r.trim())
                if (rows.length < 2) return null
                // Row 0: header row, Row 1: separator (---|---), Row 2+: data
                const headerCells = rows[0].split('|').filter(c => c.trim())
                const dataRows = rows.slice(2)
                return (
                  <>
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        {headerCells.map((cell, ci) => (
                          <th key={ci} className="px-5 py-3.5 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                            {cell.trim()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataRows.map((row, ri) => {
                        const cells = row.split('|').filter(c => c.trim())
                        return (
                          <tr key={ri} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            {cells.map((cell, ci) => (
                              <td key={ci} className={`px-5 py-3 text-sm ${
                                ci === 0 
                                  ? 'font-medium text-gray-800 dark:text-gray-200' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {cell.trim()}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </>
                )
              })()}
            </table>
          </div>
        </div>
      )

    case 'text':
    default:
      return <RichTextBlock block={block} cfg={cfg} />
  }
}

// ═══════════════════════════════════════════════════════════════════
// RICH TEXT BLOCK — Parses and renders text with structure
// ═══════════════════════════════════════════════════════════════════
function RichTextBlock({ block, cfg }: { block: TheoryBlock; cfg: typeof THEORY_BLOCK_CONFIG.definition }) {
  const segments = useMemo(() => parseTextContent(block.content), [block.content])
  const Icon = cfg.icon

  return (
    <div className={`rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5 group hover:shadow-md transition-all duration-300`}>
      {segments.length > 1 && (
        <div className="flex items-center gap-2.5 mb-3">
          <div className={`w-7 h-7 rounded-lg ${cfg.badge} flex items-center justify-center`}>
            <Icon size={14} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.accent}`}>Matn</span>
        </div>
      )}
      <div className="space-y-3">
        {segments.map((seg, si) => {
          switch (seg.type) {
            case 'subheading':
              return (
                <h3 key={si} className="font-bold text-primary-700 dark:text-primary-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-5 rounded-full bg-primary-400" />
                  {seg.items[0]}
                </h3>
              )
            case 'bullet-list':
              return (
                <ul key={si} className="space-y-2">
                  {seg.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      </span>
                      <span>{highlightTerms(item)}</span>
                    </li>
                  ))}
                </ul>
              )
            case 'definition':
              return (
                <div key={si} className="space-y-2">
                  {seg.items.map((item, ii) => {
                    const sepIdx = item.indexOf(' — ')
                    if (sepIdx > 0) {
                      const term = item.slice(0, sepIdx)
                      const def = item.slice(sepIdx + 3)
                      return (
                        <p key={ii} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold">
                            {term}
                          </span>
                          <span className="text-gray-400 mx-1.5">—</span>
                          <span>{highlightTerms(def)}</span>
                        </p>
                      )
                    }
                    return <p key={ii} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{highlightTerms(item)}</p>
                  })}
                </div>
              )
            case 'paragraph':
            default:
              return <p key={si} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{highlightTerms(seg.items.join(' '))}</p>
          }
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// QUESTION CARD
// ═══════════════════════════════════════════════════════════════════
function QuestionCard({ question: q, index, total, selected, isSubmitted, onSelect, onSubmit }: {
  question: TestQuestion; index: number; total: number
  selected?: unknown; isSubmitted: boolean
  onSelect: (val: unknown) => void; onSubmit: () => void
}) {
  const tb = TYPE_BADGE[q.type] || TYPE_BADGE.Y1
  const Icon = tb.icon
  const isCorrect = isSubmitted && isQuestionCorrect(q, selected)
  const isWrong = isSubmitted && !isQuestionCorrect(q, selected)

  return (
    <div className={`rounded-2xl border bg-white dark:bg-gray-900 shadow-sm p-5 transition-all duration-300 ${
      isCorrect 
        ? 'border-emerald-200 dark:border-emerald-800 ring-2 ring-emerald-100 dark:ring-emerald-900/30 animate-correct-flash' 
        : isWrong 
          ? 'border-red-200 dark:border-red-800 ring-2 ring-red-100 dark:ring-red-900/30 animate-wrong-shake' 
          : 'border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700'
    }`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
          isCorrect 
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
            : isWrong 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
        }`}>
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg ${tb.cls}`}>
              <Icon size={11} /> {tb.label}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">{index + 1}/{total}</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
            <InlineText text={q.text} />
          </p>
        </div>
        {/* Status icon */}
        {isCorrect && <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-1" />}
        {isWrong && <XCircle size={20} className="text-red-500 shrink-0 mt-1" />}
      </div>

      {/* ═══ Y1: MCQ ═══ */}
      {q.type === 'Y1' && (
        <div className="space-y-2 mb-4">
          {q.options.map((opt, oi) => {
            const sel = selected as number | undefined
            let stateClass = 'border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-950/20'
            let icon = null
            if (isSubmitted) {
              if (oi === q.correctIndex) { 
                stateClass = 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 ring-2 ring-emerald-100 dark:ring-emerald-900/30'; 
                icon = <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> 
              }
              else if (oi === sel) { 
                stateClass = 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 ring-2 ring-red-100 dark:ring-red-900/30'; 
                icon = <XCircle size={18} className="text-red-500 shrink-0" /> 
              }
              else { stateClass = 'border-gray-100 dark:border-gray-800 opacity-50' }
            } else if (sel === oi) { 
              stateClass = 'border-primary-400 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-100 dark:ring-primary-900/30' 
            }
            return (
              <button 
                key={oi} 
                onClick={() => onSelect(oi)} 
                disabled={isSubmitted}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-sm text-left transition-all duration-200 ${stateClass} ${isSubmitted ? 'cursor-default' : 'cursor-pointer group'}`}
              >
                <span className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all
                  ${isSubmitted && oi === q.correctIndex ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' :
                    isSubmitted && oi === sel && oi !== q.correctIndex ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-600' :
                    sel === oi ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-600' : 
                    'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500'}`}>
                  {icon ? null : String.fromCharCode(65 + oi)}
                </span>
                <span className="text-gray-700 dark:text-gray-300 flex-1"><InlineText text={opt} /></span>
                {icon && <span>{icon}</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* ═══ Y2: Pairing ═══ */}
      {q.type === 'Y2' && q.pairs && (
        <div className="space-y-2.5 mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <Fingerprint size={12} /> Har bir chap elementga mos o'ng variantni tanlang:
          </p>
          {q.pairs.map(pair => {
            const ans = selected as Record<string, string> | undefined
            const selectedRight = ans?.[pair.leftId] || ''
            const isPairCorrect = isSubmitted && ans?.[pair.leftId] === pair.rightContent
            const isPairWrong = isSubmitted && ans?.[pair.leftId] && ans[pair.leftId] !== pair.rightContent
            const options = q.pairs!.map(p => p.rightContent)
            return (
              <div key={pair.leftId} className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm transition-all ${
                isPairWrong 
                  ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30' 
                  : isPairCorrect 
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30' 
                    : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-200 dark:hover:border-gray-600'
              }`}>
                <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[130px] text-xs">{pair.leftContent}</span>
                <span className="text-gray-400">→</span>
                <select 
                  value={selectedRight} 
                  onChange={(e) => { 
                    const c = { ...(selected as Record<string, string> || {}) }; 
                    c[pair.leftId] = e.target.value; 
                    onSelect(c) 
                  }} 
                  disabled={isSubmitted} 
                  className="input flex-1 text-xs py-2 disabled:opacity-70"
                >
                  <option value="">Tanlang...</option>
                  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                {isPairCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
                {isPairWrong && <XCircle size={16} className="text-red-500 shrink-0" />}
              </div>
            )
          })}
        </div>
      )}

      {/* ═══ Y3: Ordering ═══ */}
      {q.type === 'Y3' && q.items && (
        <div className="space-y-2 mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <ListChecks size={12} /> Elementlarni to'g'ri tartibga keltiring:
          </p>
          {(() => {
            const order = selected as string[] | undefined
            const currentOrder = order || q.items!.map(i => i.id)
            const orderedItems = currentOrder.map(id => q.items!.find(i => i.id === id)!).filter(Boolean)
            const moveUp = (idx: number) => { if (idx === 0) return; const n = [...currentOrder]; [n[idx-1], n[idx]] = [n[idx], n[idx-1]]; onSelect(n) }
            const moveDown = (idx: number) => { if (idx === currentOrder.length - 1) return; const n = [...currentOrder]; [n[idx], n[idx+1]] = [n[idx+1], n[idx]]; onSelect(n) }
            return orderedItems.map((item, idx) => {
              const isItemCorrect = isSubmitted && q.correctOrder && currentOrder[idx] === q.correctOrder[idx]
              const isItemWrong = isSubmitted && q.correctOrder && currentOrder[idx] !== q.correctOrder[idx]
              return (
                <div key={item.id} className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm transition-all ${
                  isItemWrong 
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30' 
                    : isItemCorrect 
                      ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30' 
                      : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-200 dark:hover:border-gray-600'
                }`}>
                  <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-mono text-gray-500 dark:text-gray-400 shrink-0 font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 flex-1 text-[13px]">{item.content}</span>
                  {!isSubmitted && (
                    <div className="flex flex-col gap-0.5">
                      <button 
                        onClick={() => moveUp(idx)} 
                        disabled={idx === 0} 
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button 
                        onClick={() => moveDown(idx)} 
                        disabled={idx === currentOrder.length - 1} 
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  )}
                  {isItemCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
                  {isItemWrong && <XCircle size={16} className="text-red-500 shrink-0" />}
                </div>
              )
            })
          })()}
        </div>
      )}

      {/* Submit / Result */}
      <div>
        {!isSubmitted ? (
          <button 
            onClick={onSubmit} 
            disabled={selected === undefined || (q.type === 'Y2' && q.pairs && Object.keys(selected as Record<string, string>).length < q.pairs.length) || (q.type === 'Y3' && q.items && (selected as string[] | undefined)?.length !== q.items.length)} 
            className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-xs font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {q.type === 'Y1' && <CheckCircle2 size={14} />}
            {q.type === 'Y2' && <Fingerprint size={14} />}
            {q.type === 'Y3' && <ListChecks size={14} />}
            {q.type === 'Y1' && 'Javobni tekshirish'}
            {q.type === 'Y2' && 'Juftliklarni tekshirish'}
            {q.type === 'Y3' && 'Tartibni tekshirish'}
          </button>
        ) : (
          <div className={`p-4 rounded-xl text-sm border ${
            isCorrect 
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' 
              : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              {isCorrect 
                ? <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" /> 
                : <XCircle size={16} className="text-red-600 dark:text-red-400" />
              }
              <span className={`font-semibold text-sm ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                {isCorrect ? "To'g'ri! 🎉" : "Noto'g'ri"}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <span className="font-medium">Izoh: </span>
              <InlineText text={q.explanation} />
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
