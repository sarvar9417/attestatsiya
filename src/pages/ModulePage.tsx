import { useEffect, useRef } from 'react'
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, FileQuestion, Play, RefreshCw, Target } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import TopicView from '../components/learning/TopicView'
import AxborotPracticePage from './AxborotPracticePage'
import { useCatalog } from '../hooks/useCatalog'
import { useProgressStore } from '../store/progressStore'
import { PHOTOSHOP_STUDY_STAGES } from '../data/topics/m10PhotoshopLearningPath'
import { MODULES } from '../data/contentTree'

export default function ModulePage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const extraAxborotOpen = moduleId === 'M01' && searchParams.get('extra') === 'axb'
  const extraAxborotRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (extraAxborotOpen) {
      extraAxborotRef.current?.scrollIntoView?.({ block: 'start', behavior: 'smooth' })
    }
  }, [extraAxborotOpen])

  const toggleExtraAxborot = () => {
    const next = new URLSearchParams(searchParams)
    if (extraAxborotOpen) next.delete('extra')
    else next.set('extra', 'axb')
    setSearchParams(next, { replace: true })
  }

  const { modules, loading, retry } = useCatalog()
  const { getModuleProgress, completeTopic } = useProgressStore()
  // All M01–M16 lesson selections are deep-linkable and survive a full reload.
  // Opening a lesson adds a history entry; finishing/backing out clears the URL.
  const activeSubtopicId = searchParams.get('topic')
  const openSubtopic = (topicId: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (topicId) next.set('topic', topicId)
    else next.delete('topic')
    setSearchParams(next, { replace: !topicId })
  }

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

  // Avoid temporarily exposing legacy M13 buttons that will disappear as
  // soon as the seven published chapters are hydrated from the backend.
  if (moduleId === 'M13' && loading) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center" role="status" aria-live="polite">
        <BookOpen size={40} className="mx-auto mb-4 text-indigo-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">M13 darslari yuklanmoqda…</h2>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Mavzular ro‘yxati tekshirilmoqda. Tanlangan darsingiz saqlanadi.</p>
      </div>
    )
  }

  // M07's static six summaries are NOT complete lessons. Never let a learner
  // enter their "Mavzuni yakunlash" screen while the 12 published chapters load,
  // or if the backend fails. A retry restores the full paginated reader.
  if (moduleId === 'M07' && (loading ||
    mod.subtopics.length !== 12 ||
    !mod.subtopics.every(topic => /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(topic.id)))) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center" role="status" aria-live="polite">
        <BookOpen size={40} className="mx-auto mb-4 text-indigo-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {loading ? 'Scratch va LOGO darslari yuklanmoqda…' : 'To‘liq nazariyani yuklab bo‘lmadi'}
        </h2>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {loading
            ? '12 ta to‘liq dars va sahifalar tayyorlanmoqda.'
            : 'Qisqartirilgan eski nazariya ko‘rsatilmaydi. Internet yoki server aloqasini tekshirib qayta urinib ko‘ring.'}
        </p>
        {!loading && (
          <button type="button" onClick={retry}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700">
            <RefreshCw size={16} /> Qayta yuklash
          </button>
        )}
        <Link to="/learn" className="mt-5 block text-sm text-indigo-600">Bo‘limlar ro‘yxatiga qaytish</Link>
      </div>
    )
  }

  const progress = getModuleProgress(moduleId)
  // Supplemental legacy M13 content is not part of the seven canonical
  // published chapters and must not inflate their completion percentage.
  const completedCount = moduleId === 'M13'
    ? mod.subtopics.filter(topic => progress.completedTopics.includes(topic.id)).length
    : Math.min(progress.completedTopics.length, mod.subtopics.length)
  const totalTopics = mod.subtopics.length
  const progressPercent =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  // Do not remap legacy M13.06 to published chapter 6 by index:
  // the published chapter has an unrelated title and body.
  const legacyM13Topics = moduleId === 'M13'
    ? MODULES.find(module => module.id === 'M13')?.subtopics
    : undefined
  const selectedTopics = mod.subtopics.some(topic => topic.id === activeSubtopicId)
    ? mod.subtopics
    : legacyM13Topics?.some(topic => topic.id === activeSubtopicId)
      ? legacyM13Topics
      : mod.subtopics
  const currentIndex = selectedTopics.findIndex(
    subtopic => subtopic.id === activeSubtopicId,
  )
  const currentSubtopic = currentIndex >= 0 ? selectedTopics[currentIndex] : null
  const previousSubtopic = currentIndex > 0 ? selectedTopics[currentIndex - 1] : null
  const nextSubtopic =
    currentIndex >= 0 && currentIndex < selectedTopics.length - 1
      ? selectedTopics[currentIndex + 1]
      : null

  const handleTopicComplete = (
    subtopicId: string,
    correct: number,
    total: number,
  ) => {
    completeTopic(moduleId, subtopicId, correct, total)
    openSubtopic(null)
  }

  if (activeSubtopicId && currentSubtopic) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:py-7">
        <TopicView
          moduleId={moduleId}
          subtopicId={activeSubtopicId}
          moduleTitle={mod.title}
          subtopicIndex={currentIndex}
          subtopicCount={selectedTopics.length}
          previousSubtopic={previousSubtopic}
          nextSubtopic={nextSubtopic}
          onOpenTopic={openSubtopic}
          onComplete={(correct, total) =>
            handleTopicComplete(activeSubtopicId, correct, total)
          }
          onBack={() => openSubtopic(null)}
        />
      </div>
    )
  }

  const isPublishedM13Catalog = moduleId === 'M13' &&
    mod.subtopics.length === 7 &&
    mod.subtopics.every(topic => /^m13-axr-0[1-7]$/.test(topic.code))
  const supplementalCommerceTopic = legacyM13Topics?.find(topic => topic.id === 'M13.06')

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

      {moduleId === 'M10' && (
        <section
          aria-label="Adobe Photoshop bo‘yicha o‘quv yo‘li"
          className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900 dark:bg-indigo-950/20 sm:p-6"
        >
          <div className="mb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-950 dark:text-white">
              <BookOpen size={19} className="text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
              Adobe Photoshop — darslik va attestatsiya bo‘yicha o‘quv yo‘li
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              Photoshop darslari yashirin emas: 7-sinf informatika darsligining 13–18-darslari
              va 2026-yil spetsifikatsiyasidagi rasmlarni yaratish va tahrirlash talabi
              quyidagi uchta ketma-ket bobda o‘rganiladi. Har bir bobda nazariya,
              amaliy bajarish ketma-ketligi, mustaqil mashq va tekshirish izohi mavjud.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {PHOTOSHOP_STUDY_STAGES.map(stage => (
              <button
                key={stage.id}
                type="button"
                disabled={!mod.subtopics.some(topic => topic.id === stage.id)}
                onClick={() => openSubtopic(stage.id)}
                className="group flex min-h-40 flex-col justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900"
              >
                <span className="text-sm font-semibold text-gray-950 dark:text-white">{stage.title}</span>
                <span className="text-xs leading-5 text-gray-600 dark:text-gray-300">{stage.topics}</span>
                <span className="flex w-full items-center justify-between gap-3 text-xs text-indigo-700 dark:text-indigo-300">
                  <span>{stage.textbook}</span>
                  <ChevronRight size={17} aria-hidden="true" className="shrink-0 group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-gray-600 dark:text-gray-400">
            Bu — o‘quv yo‘li. Attestatsiyaning 27–31-savollari grafika va
            veb-texnologiyalar uchun umumiy 5 ta savoldan iborat; M10 modul sinovi
            esa alohida 50 savollik mashqdir. O‘quv materialining mavjudligi
            serverda shu mavzu bo‘yicha test savoli tasdiqlanganini bildirmaydi.
          </p>
        </section>
      )}

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
                onClick={() => openSubtopic(subtopic.id)}
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
                        : 'Nazariya mavjud; test tayyorligi mavzuda tekshiriladi')}
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

      {isPublishedM13Catalog && supplementalCommerceTopic && (
        <section
          aria-label="M13 qo‘shimcha mavzusi"
          className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900 dark:bg-indigo-950/20 sm:p-6"
        >
          <h2 className="text-base font-semibold text-gray-950 dark:text-white">Qo‘shimcha mavzu</h2>
          <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Oldingi o‘quv rejasidagi ushbu darsni ham o‘qishingiz mumkin.
            U yetti nashr qilingan bobdan alohida va asosiy progressga qo‘shilmaydi.
          </p>
          <button
            type="button"
            onClick={() => openSubtopic(supplementalCommerceTopic.id)}
            className="mt-3 flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-left text-sm font-semibold text-indigo-700 transition hover:border-indigo-400 hover:shadow-sm dark:border-indigo-800 dark:bg-gray-900 dark:text-indigo-300"
          >
            <span>{supplementalCommerceTopic.title}</span>
            <ChevronRight size={17} aria-hidden="true" />
          </button>
        </section>
      )}

      {moduleId === 'M01' && (
        <section
          id="axborot-qoshimcha-mashqlar"
          ref={extraAxborotRef}
          className="scroll-mt-6 rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm dark:border-indigo-900 dark:bg-gray-900 sm:p-5"
          aria-label="Axborot bo‘yicha qo‘shimcha mashqlar"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-950 dark:text-white">
                <FileQuestion size={18} aria-hidden="true" className="text-indigo-600" />
                Qo‘shimcha mashqlar — Axborot testlari
              </h2>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500 dark:text-gray-400">
                19 boblik manba savollari bilan mustaqil tayyorlanish.
                Nazariya va mavzu testlaridan alohida mashq; natijalari umumiy tarixda saqlanadi.
              </p>
            </div>
            <button
              type="button"
              aria-controls="axborot-extra-panel"
              aria-expanded={extraAxborotOpen}
              onClick={toggleExtraAxborot}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950"
            >
              {extraAxborotOpen ? 'Qo‘shimcha mashqlarni yopish' : '19 boblik mashqlarni ochish'}
              <ChevronRight size={16} aria-hidden="true" className={extraAxborotOpen ? 'rotate-90' : ''} />
            </button>
          </div>
          {extraAxborotOpen && (
            <div id="axborot-extra-panel" className="mt-3 border-t border-gray-100 pt-1 dark:border-gray-800">
              <AxborotPracticePage embedded />
            </div>
          )}
        </section>
      )}

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
