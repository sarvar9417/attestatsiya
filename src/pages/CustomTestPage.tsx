import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight, ClipboardCheck, LoaderCircle, ShieldCheck } from 'lucide-react'
import {
  getCustomTestCatalog,
  previewCustomTest,
  type CatalogModule,
  type CustomExamConfig,
  type CustomExamPreview,
} from '../features/custom-test/customTestApi'

type Level = 1 | 2 | 3 | 4 | 5
type QuantityMap = Partial<Record<Level, number>>
type Selection = Record<string, QuantityMap>
const LEVELS: Level[] = [1, 2, 3, 4, 5]
const LEVEL_LABELS: Record<Level, string> = {
  1: 'A · Ta’rif', 2: 'B · Farqlash', 3: 'C · Qo‘llash',
  4: 'D · Tahlil', 5: 'E · Murakkab',
}

export default function CustomTestPage() {
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState<CatalogModule[]>([])
  const [loading, setLoading] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [openModules, setOpenModules] = useState<string[]>([])
  const [selected, setSelected] = useState<Selection>({})
  const [formats, setFormats] = useState<Array<'Y1' | 'Y2' | 'Y3'>>(['Y1','Y2','Y3'])
  const [exposure, setExposure] = useState<CustomExamConfig['exposure']>('all')
  const [mode, setMode] = useState<CustomExamConfig['mode']>('exam')
  const [duration, setDuration] = useState<number | null>(1800)
  const [preview, setPreview] = useState<CustomExamPreview | null>(null)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCatalog = useCallback(async () => {
    setLoading(true)
    setCatalogError(null)
    try {
      const items = await getCustomTestCatalog()
      setCatalog(items)
    } catch (failure) {
      setCatalogError(failure instanceof Error ? failure.message : 'Mavzularni yuklab bo‘lmadi')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadCatalog() }, [loadCatalog])

  const update = (next: Selection) => {
    setSelected(next)
    setPreview(null)
    setError(null)
  }

  const toggleLesson = (id: string) => {
    const next = { ...selected }
    if (next[id]) delete next[id]
    else next[id] = { 3: 5 }
    update(next)
  }

  const updateLevel = (id: string, level: Level, amount: number) => {
    const old = selected[id]
    if (!old) return
    const next = { ...old }
    if (amount <= 0) delete next[level]
    else next[level] = amount
    update({ ...selected, [id]: next })
  }

  const config = useMemo<CustomExamConfig>(() => {
    const topics = Object.entries(selected)
      .map(([lesson_id, counts]) => {
        const difficulty_counts = LEVELS
          .map(difficulty => ({ difficulty, count: counts[difficulty] ?? 0 }))
          .filter(item => item.count > 0)
        return {
          lesson_id,
          count: difficulty_counts.reduce((sum, item) => sum + item.count, 0),
          difficulty_counts,
        }
      })
      .filter(item => item.count > 0)
    return {
      total_count: topics.reduce((sum, topic) => sum + topic.count, 0),
      topics,
      formats,
      exposure,
      mode,
      duration_sec: duration,
    }
  }, [selected, formats, exposure, mode, duration])

  const count = config.total_count
  const invalid =
    config.topics.length === 0 || config.topics.length > 30 ||
    count < 1 || count > 100 || formats.length === 0 ||
    Object.values(selected).some(counts => !LEVELS.some(level => (counts[level] ?? 0) > 0))
  const lessonNames = useMemo(
    () => new Map(catalog.flatMap(module => module.lessons.map(lesson => [lesson.id, lesson.title_uz]))),
    [catalog]
  )
  const changeSetting = () => { setPreview(null); setError(null) }

  const checkPool = async () => {
    if (invalid) return
    setChecking(true)
    setPreview(null)
    setError(null)
    try {
      setPreview(await previewCustomTest(config))
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Savollarni tekshirib bo‘lmadi')
    } finally {
      setChecking(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="rounded-3xl bg-indigo-700 p-6 text-white sm:p-8">
        <Link to="/exam" className="inline-flex items-center gap-2 text-sm text-indigo-100 hover:text-white">
          <ArrowLeft size={16}/> Testlar bo‘limiga qaytish
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Shaxsiy test konstruktori</h1>
        <p className="mt-2 max-w-3xl text-indigo-100">
          Informatika, kasb standartlari va pedagogik mahorat mavzularini birlashtiring.
          Savollar soni va A–E darajalarni o‘zingiz belgilang. Rasmiy mock imtihon rejimi o‘zgarmaydi.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-4" aria-label="Mavzular">
          <div className="flex items-center gap-3">
            <BookOpen size={20} className="text-indigo-600"/>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Mavzular va qiyinchilik kvotalari</h2>
          </div>

          {loading && <p role="status" className="rounded-xl bg-gray-100 p-4 text-sm dark:bg-gray-800">Mavzular yuklanmoqda...</p>}
          {catalogError && (
            <div role="alert" className="rounded-xl border border-red-300 p-4 text-sm text-red-700 dark:text-red-300">
              {catalogError}
              <button type="button" onClick={() => void loadCatalog()} className="ml-3 underline">Qayta yuklash</button>
            </div>
          )}
          {!loading && !catalogError && catalog.length === 0 && (
            <p className="rounded-xl bg-gray-100 p-4 text-sm dark:bg-gray-800">Nashr etilgan mavzular topilmadi.</p>
          )}

          {catalog.map(module => {
            const expanded = openModules.includes(module.id)
            const moduleSelected = module.lessons.filter(lesson => selected[lesson.id]).length
            return (
              <article key={module.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpenModules(current => expanded
                    ? current.filter(id => id !== module.id) : [...current, module.id])}
                  className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">{module.code} · {module.title_uz}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-gray-500">
                    {moduleSelected > 0 ? moduleSelected + ' tanlangan' : module.lessons.length + ' mavzu'}
                    {expanded ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
                  </span>
                </button>
                {expanded && (
                  <div className="space-y-3 border-t border-gray-200 p-4 dark:border-gray-800">
                    {module.lessons.map(lesson => {
                      const enabled = Boolean(selected[lesson.id])
                      const amounts = selected[lesson.id] ?? {}
                      const total = LEVELS.reduce((sum, level) => sum + (amounts[level] ?? 0), 0)
                      return (
                        <div key={lesson.id} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                          <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                            <input type="checkbox" checked={enabled} onChange={() => toggleLesson(lesson.id)}
                              className="h-4 w-4 accent-indigo-600"/>
                            <span className="flex-1">{lesson.title_uz}</span>
                            {enabled && <span className="text-xs text-indigo-600 dark:text-indigo-300">{total} ta</span>}
                          </label>
                          {enabled && (
                            <div className="mt-3 grid grid-cols-2 gap-2 pl-7 sm:grid-cols-5">
                              {LEVELS.map(level => (
                                <label key={level} className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                                  <span className="block">{LEVEL_LABELS[level]}</span>
                                  <input aria-label={lesson.title_uz + ' ' + LEVEL_LABELS[level]}
                                    type="number" min={0} max={100} step={1}
                                    value={amounts[level] ?? 0}
                                    onChange={event => updateLevel(lesson.id,level,
                                      Math.max(0,Math.min(100,Math.floor(Number(event.target.value) || 0))))}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"/>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </article>
            )
          })}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">2. Test sozlamalari</h2>
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-gray-700 dark:text-gray-200">Savol formatlari</legend>
              <div className="flex gap-4">
                {(['Y1','Y2','Y3'] as const).map(format => (
                  <label key={format} className="flex items-center gap-1.5 text-sm dark:text-gray-200">
                    <input type="checkbox" checked={formats.includes(format)} onChange={() => {
                      setFormats(old => old.includes(format) ? old.filter(f => f !== format) : [...old,format])
                      changeSetting()
                    }}/> {format}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block space-y-1 text-sm text-gray-700 dark:text-gray-200">
              <span className="font-semibold">Savollar holati</span>
              <select value={exposure} onChange={event => {
                setExposure(event.target.value as CustomExamConfig['exposure']);changeSetting()
              }} className="w-full rounded-lg border border-gray-300 bg-white p-2.5 dark:border-gray-700 dark:bg-gray-800">
                <option value="all">Barcha savollar</option>
                <option value="unseen">Avval ko‘rilmagan</option>
                <option value="incorrect">Oldin xato ishlangan</option>
              </select>
            </label>
            <label className="block space-y-1 text-sm text-gray-700 dark:text-gray-200">
              <span className="font-semibold">Test rejimi</span>
              <select value={mode} onChange={event => {
                setMode(event.target.value as CustomExamConfig['mode']);changeSetting()
              }} className="w-full rounded-lg border border-gray-300 bg-white p-2.5 dark:border-gray-700 dark:bg-gray-800">
                <option value="exam">Imtihon</option>
                <option value="learning">O‘rganish (yakunda tahlil)</option>
                <option value="diagnostic">Diagnostika</option>
                <option value="mistakes">Xatolar ustida ishlash</option>
              </select>
            </label>
            <label className="block space-y-1 text-sm text-gray-700 dark:text-gray-200">
              <span className="font-semibold">Vaqt chegarasi</span>
              <select value={duration === null ? 'none' : String(duration)}
                onChange={event => {setDuration(event.target.value === 'none' ? null : Number(event.target.value));changeSetting()}}
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 dark:border-gray-700 dark:bg-gray-800">
                <option value="none">Cheklanmagan</option>
                <option value="900">15 daqiqa</option>
                <option value="1800">30 daqiqa</option>
                <option value="3600">60 daqiqa</option>
                <option value="7200">120 daqiqa</option>
              </select>
            </label>
          </section>
          <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="flex items-center gap-2 font-bold dark:text-white"><ClipboardCheck size={20}/> 3. Testni tayyorlash</h2>
            <div className="flex justify-between text-sm dark:text-gray-200">
              <span>Mavzular</span><strong>{config.topics.length} ta</strong>
            </div>
            <div className="flex justify-between text-sm dark:text-gray-200">
              <span>Savollar</span><strong>{count} ta</strong>
            </div>
            {invalid && <p role="alert" className="text-xs text-amber-700 dark:text-amber-300">
              1–30 mavzu, 1–100 savol va kamida bitta format tanlang. Har mavzuda kamida 1 ta savol bo‘lsin.
            </p>}
            <button type="button" disabled={invalid || checking}
              onClick={() => void checkPool()}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
              {checking && <LoaderCircle size={17} className="animate-spin"/>}
              Savollar yetarliligini tekshirish
            </button>
            {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {preview && (
              <div role="status" className="space-y-2 border-t border-gray-200 pt-3 text-sm dark:border-gray-700">
                <p className={preview.ready ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}>
                  {preview.ready ? 'Tanlangan barcha kvotalar bajariladi.' :
                    'Ayrim mavzu yoki qiyinchilik darajasida savollar yetarli emas.'}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Mos savollar: {preview.available}/{preview.requested}
                </p>
                {preview.gaps.map(gap => (
                  <p key={gap.lesson_id + gap.difficulty} className="text-xs text-amber-800 dark:text-amber-200">
                    {lessonNames.get(gap.lesson_id) ?? 'Mavzu'} · {LEVEL_LABELS[gap.difficulty as Level]}:
                    {gap.available}/{gap.requested}
                  </p>
                ))}
              </div>
            )}
            <button type="button" disabled={!preview?.ready || checking || invalid}
              onClick={() => navigate('/exam/custom', { state: { customConfig: config } })}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">
              Testni boshlash <ChevronRight size={17}/>
            </button>
            <p className="flex gap-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
              <ShieldCheck size={16} className="shrink-0"/>
              Savollar soni o‘zgartirilmaydi. Test ishlash oynasida yakuniy boshlash tasdiqlanadi.
              Natija rasmiy attestatsiya balidan alohida saqlanadi.
            </p>
          </section>
        </aside>
      </div>
    </main>
  )
}
