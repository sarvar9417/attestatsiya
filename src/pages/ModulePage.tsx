import { useState } from 'react'
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, FileQuestion, Play, Target } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TopicView from '../components/learning/TopicView'
import { useCatalog } from '../hooks/useCatalog'
import { useProgressStore } from '../store/progressStore'

export default function ModulePage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { modules } = useCatalog()
  const { getModuleProgress, completeTopic } = useProgressStore()
  const [activeSubtopicId, setActiveSubtopicId] = useState<string | null>(null)

  const mod = modules.find(module => module.id === moduleId)

  if (!mod || !moduleId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
            <BookOpen size={26} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Bo‘lim topilmadi
          </h1>
          <Link
            to="/learn"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            O‘rganishga qaytish
          </Link>
        </div>
      </div>
    )
  }

  const progress = getModuleProgress(moduleId)
  const completedCount = Math.min(
    progress.completedTopics.length,
    mod.subtopics.length,
  )
  const totalTopics = mod.subtopics.length
  const progressPercent =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  const currentIndex = mod.subtopics.findIndex(
    subtopic => subtopic.id === activeSubtopicId,
  )
  const currentSubtopic =
    activeSubtopicId === null
      ? null
      : mod.subtopics.find(subtopic => subtopic.id === activeSubtopicId) ?? null
  const nextSubtopic =
    currentIndex >= 0 && currentIndex < totalTopics - 1
      ? mod.subtopics[currentIndex + 1]
      : null

  const handleTopicComplete = (
    subtopicId: string,
    correct: number,
    total: number,
  ) => {
    completeTopic(moduleId, subtopicId, correct, total)
    setActiveSubtopicId(null)
  }

  if (activeSubtopicId && currentSubtopic) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:py-7">
        <TopicView
          moduleId={moduleId}
          subtopicId={activeSubtopicId}
          moduleTitle={mod.title}
          subtopicIndex={currentIndex}
          subtopicCount={totalTopics}
          nextSubtopic={nextSubtopic}
          onOpenTopic={setActiveSubtopicId}
          onComplete={(correct, total) =>
            handleTopicComplete(activeSubtopicId, correct, total)
          }
          onBack={() => setActiveSubtopicId(null)}
        />
      </div>
    )
  }

  const firstIncompleteIndex = mod.subtopics.findIndex(
    subtopic => !progress.completedTopics.includes(subtopic.id),
  )

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <Link
        to="/learn"
        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-gray-400 transition hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-800 dark:hover:text-indigo-300"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        O‘rganishga qaytish
      </Link>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-mono text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                {mod.code}
              </span>
              <span className="text-xs text-gray-400">
                {totalTopics} mavzu · {mod.examQuestionCount} attestatsiya savoli
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
              {mod.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {mod.description}
            </p>

            <div className="mt-5 h-2 max-w-3xl overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-[width] duration-500"
                style={{ width: `${progressPercent}%` }}
                aria-label={`Modul progressi: ${progressPercent}%`}
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 lg:flex-col lg:items-end">
            <div className="text-right">
              <p className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-300">
                {progressPercent}%
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {completedCount} / {totalTopics} mavzu
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/exam/bolim/${moduleId}`)}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-indigo-200 px-3.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
            >
              <FileQuestion size={15} aria-hidden="true" />
              Modul sinovi
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
              Mavzular
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Nazariya → bilimni tekshirish → amaliy qo‘llash
            </p>
          </div>
          <div className="hidden items-center gap-2 text-xs text-gray-400 sm:flex">
            <Target size={14} aria-hidden="true" />
            {completedCount} ta tugallangan
          </div>
        </div>

        <div className="space-y-2.5">
          {mod.subtopics.map((subtopic, index) => {
            const done = progress.completedTopics.includes(subtopic.id)
            const topicProgress = progress.topicProgress[subtopic.id]
            const current = !done && index === firstIncompleteIndex

            return (
              <button
                key={subtopic.id}
                type="button"
                onClick={() => setActiveSubtopicId(subtopic.id)}
                className={`group flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900 sm:gap-4 sm:px-5 ${
                  current
                    ? 'border-indigo-200 ring-1 ring-indigo-100 dark:border-indigo-800 dark:ring-indigo-950'
                    : done
                      ? 'border-emerald-200 dark:border-emerald-900'
                      : 'border-gray-200 hover:border-indigo-200 dark:border-gray-800 dark:hover:border-indigo-800'
                }`}
              >
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                    done
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : current
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                  }`}
                >
                  {done ? (
                    <CheckCircle2 size={19} aria-hidden="true" />
                  ) : current ? (
                    <Play size={17} fill="currentColor" aria-hidden="true" />
                  ) : (
                    <span className="font-mono text-xs font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {subtopic.title}
                    </h3>
                    {done && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Tugallangan
                      </span>
                    )}
                    {current && (
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                        Davom ettirish
                      </span>
                    )}
                  </div>

                  <p className="mt-1 line-clamp-1 text-xs text-gray-400">
                    {subtopic.description ??
                      (done
                        ? 'Mavzu yakunlangan'
                        : 'Nazariya va mavzu testi mavjud')}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {topicProgress && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        topicProgress.lastScore >= 80
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {topicProgress.lastScore}%
                    </span>
                  )}
                  <ChevronRight
                    size={17}
                    className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-gray-600"
                    aria-hidden="true"
                  />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-900 dark:bg-indigo-950/20 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Modul bo‘yicha bilimni tekshiring
          </h2>
          <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Savollar server tomonidan tanlanadi va natija xavfsiz tarzda hisoblanadi.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/exam/bolim/${moduleId}`)}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Modul sinovini boshlash
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </section>
    </div>
  )
}
