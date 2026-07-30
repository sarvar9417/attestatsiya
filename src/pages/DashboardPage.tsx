import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MODULES } from '../data/contentTree'
import { useProgressStore } from '../store/progressStore'
import { 
  BookOpen, FileQuestion, BarChart3, ArrowRight, Target, 
  CheckCircle2, Clock, Trophy, Sparkles, Brain, Layers,
  TrendingUp, BookText,
  PlayCircle, ChevronRight
} from 'lucide-react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { getModuleProgress } = useProgressStore()

  const totalSubtopics = MODULES.reduce((acc, m) => acc + m.subtopics.length, 0)

  // ─── Compute real progress ────────────────────────────────────
  const {
    overallPercent,
    completedSubtopics,
    startedModules,
    completedModules,
    recentModules,
    avgScore,
    bestModule,
  } = useMemo(() => {
    let completed = 0
    let startedMods = 0
    let completedMods = 0
    let totalScore = 0
    let scoreCount = 0
    let best = { code: '', score: 0 }

    const withProgress: { mod: typeof MODULES[0]; progress: ReturnType<typeof getModuleProgress> }[] = []

    for (const mod of MODULES) {
      const prog = getModuleProgress(mod.id)
      const total = mod.subtopics.length
      completed += prog.completedTopics.length
      if (prog.completedTopics.length > 0) {
        startedMods++
        withProgress.push({ mod, progress: prog })
      }
      if (prog.completedTopics.length >= total) completedMods++

      // Calculate average score from topic progress
      const scores = Object.values(prog.topicProgress)
      for (const tp of scores) {
        totalScore += tp.lastScore
        scoreCount++
        if (tp.lastScore > best.score) {
          best = { code: mod.code, score: tp.lastScore }
        }

      }
    }

    const percent = totalSubtopics > 0 ? Math.round((completed / totalSubtopics) * 100) : 0
    const avg = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0

    // Recent modules (last 4 with any progress)
    const recent = withProgress.slice(-4).reverse()

    return {
      overallPercent: percent,
      completedSubtopics: completed,
      startedModules: startedMods,
      completedModules: completedMods,
      recentModules: recent,
      avgScore: avg,
      bestModule: best,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getModuleProgress, totalSubtopics])

  // ─── Stats cards ──────────────────────────────────────────────
  const statsCards = [
    { 
      label: 'Umumiy progress', 
      value: `${overallPercent}%`, 
      sub: `${completedSubtopics}/${totalSubtopics} mavzu`,
      icon: Target,
      gradient: 'from-primary-500 to-primary-600',
      shadow: 'shadow-primary-200',
    },
    { 
      label: 'O\'rtacha ball', 
      value: avgScore > 0 ? `${avgScore}%` : '—', 
      sub: avgScore >= 80 ? 'Yuqori natija' : avgScore >= 60 ? 'O\'rta natija' : 'Hali test ishlanmagan',
      icon: Brain,
      gradient: avgScore >= 80 ? 'from-emerald-500 to-emerald-600' : avgScore >= 60 ? 'from-amber-500 to-amber-600' : 'from-gray-400 to-gray-500',
      shadow: 'shadow-emerald-200',
    },
    { 
      label: 'Modullar', 
      value: `${startedModules}/${MODULES.length}`, 
      sub: `${completedModules} ta to'liq`,
      icon: BookOpen,
      gradient: 'from-violet-500 to-violet-600',
      shadow: 'shadow-violet-200',
    },
    { 
      label: 'Eng yaxshi modul', 
      value: bestModule.code || '—', 
      sub: bestModule.score > 0 ? `${bestModule.score}% ball` : 'Hali ma\'lumot yo\'q',
      icon: Trophy,
      gradient: 'from-amber-500 to-amber-600',
      shadow: 'shadow-amber-200',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 animate-fade-in space-y-6">
      {/* ═══ HERO HEADER ═══ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white p-6 sm:p-8 shadow-xl">
        {/* Animated background orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
          <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-white animate-pulse-slow" />
          <div className="absolute top-28 right-28 w-24 h-24 rounded-full bg-primary-400 animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-b2-400 animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-[11px] font-mono font-semibold tracking-wider text-primary-300">
              ATTESTATSIYA 2026
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock size={12} /> So'nggi tashrif: bugun
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
            Xush kelibsiz!
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
            Informatika attestatsiyasiga tayyorgarlik platformasi. 
            {overallPercent === 0 
              ? ' 16 modul, 76 mavzu — boshlashga tayyormisiz?' 
              : ` ${completedSubtopics} ta mavzu o'zlashtirilgan, davom eting!`}
          </p>

          {overallPercent === 0 && (
            <button
              onClick={() => navigate('/learn')}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Tayyorgarlikni boshlash <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ═══ STATS CARDS ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsCards.map(s => {
          const Icon = s.icon
          return (
            <div 
              key={s.label} 
              className={`bg-white dark:bg-gray-800/80 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm`}>
                  <Icon size={18} className="text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
              <div className="text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* ═══ MAIN PROGRESS + QUICK ACTIONS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overall progress bar */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <BarChart3 size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Umumiy o'zlashtirish</p>
                <p className="text-xs text-gray-400">{completedSubtopics}/{totalSubtopics} mavzu bajarildi</p>
              </div>
            </div>
            <div className="text-xl font-bold text-primary-600">{overallPercent}%</div>
          </div>
          
          <div className="h-3.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-1000 ease-out"
              style={{ width: `${overallPercent}%` }} 
            />
          </div>
          
          <div className="flex justify-between text-[10px] text-gray-300 dark:text-gray-600 mt-1 px-0.5">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>

          {/* Mini section breakdown */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {(['specialty', 'professional_standard', 'pedagogy', 'methodology'] as const).map(key => {
              const sectionMods = MODULES.filter(m => m.section === key)
              const sectionTotal = sectionMods.reduce((acc, m) => acc + m.subtopics.length, 0)
              const sectionDone = sectionMods.reduce((acc, m) => {
                const p = getModuleProgress(m.id)
                return acc + p.completedTopics.length
              }, 0)
              const pct = sectionTotal > 0 ? Math.round((sectionDone / sectionTotal) * 100) : 0
              const labels: Record<string, string> = { specialty: 'Mutaxassislik', professional_standard: 'Kasb st.', pedagogy: 'Pedagogika', methodology: 'Metodika' }
              return (
                <div key={key} className="text-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{labels[key]}</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: pct >= 80 ? '#059669' : pct > 0 ? '#7c3aed' : '#9ca3af' }}>{pct}%</div>
                  <div className="text-[10px] text-gray-400">{sectionDone}/{sectionTotal}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/learn')}
            className="w-full bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                <PlayCircle size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">O'qishni davom ettirish</p>
                <p className="text-xs text-gray-400 mt-0.5">{overallPercent === 0 ? 'Birinchi mavzudan boshlang' : `${MODULES.length - completedModules} ta modul qoldi`}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          <button
            onClick={() => navigate('/exam')}
            className="w-full bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
                <FileQuestion size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Sinov imtihoni</p>
                <p className="text-xs text-gray-400 mt-0.5">50 savol · 120 daqiqa</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>
      </div>

      {/* ═══ MODULE PROGRESS GRID ═══ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <Layers size={14} className="text-primary-600" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Modullar bo'yicha progress</h2>
          <div className="flex-1" />
          <button
            onClick={() => navigate('/learn')}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            Barchasi <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MODULES.map(mod => {
            const prog = getModuleProgress(mod.id)
            const total = mod.subtopics.length
            const done = prog.completedTopics.length
            const pct = total > 0 ? Math.round((done / total) * 100) : 0
            const isComplete = done >= total
            const hasProgress = done > 0

            return (
              <button
                key={mod.id}
                onClick={() => navigate(`/learn/${mod.id}`)}
                className={`bg-white dark:bg-gray-800/80 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 text-left overflow-hidden group ${
                  isComplete 
                    ? 'border-emerald-200 dark:border-emerald-800/40' 
                    : hasProgress 
                      ? 'border-primary-100 dark:border-primary-800/30' 
                      : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'
                }`}
              >
                {/* Accent bar */}
                <div className={`h-1 w-full ${
                  isComplete ? 'bg-emerald-500' : 
                  hasProgress ? 'bg-gradient-to-r from-primary-400 to-primary-500' : 
                  'bg-gray-100 dark:bg-gray-700'
                }`} />

                <div className="p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isComplete 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                        : hasProgress 
                          ? 'bg-primary-100 dark:bg-primary-900/30' 
                          : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {isComplete ? (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      ) : (
                        <span className={`text-[11px] font-bold font-mono ${hasProgress ? 'text-primary-600' : 'text-gray-400'}`}>
                          {mod.code.replace('M', '')}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isComplete ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                        {mod.title}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-1.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete ? 'bg-emerald-400' : 
                        hasProgress ? 'bg-gradient-to-r from-primary-400 to-primary-500' : 
                        'bg-gray-200 dark:bg-gray-600'
                      }`}
                      style={{ width: `${pct}%` }} 
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className={isComplete ? 'text-emerald-600 font-medium' : hasProgress ? 'text-primary-600' : 'text-gray-400'}>
                      {done}/{total} mavzu
                    </span>
                    <span className="text-gray-400">{pct}%</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══ RECENT ACTIVITY ═══ */}
      {recentModules.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <TrendingUp size={14} className="text-amber-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">So'nggi faoliyat</h2>
          </div>

          <div className="space-y-2">
            {recentModules.map(({ mod, progress }) => {
              const total = mod.subtopics.length
              const done = progress.completedTopics.length
              const scores = Object.values(progress.topicProgress)
              const lastScore = scores.length > 0 ? scores[scores.length - 1].lastScore : 0
              const lastTopic = scores.length > 0 ? Object.keys(progress.topicProgress).pop() : ''
              const lastTopicTitle = lastTopic ? mod.subtopics.find(s => s.id === lastTopic)?.title : ''

              return (
                <button
                  key={mod.id}
                  onClick={() => navigate(`/learn/${mod.id}`)}
                  className="w-full bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      lastScore >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                    }`}>
                      <BookText size={20} className={lastScore >= 80 ? 'text-emerald-600' : 'text-amber-600'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="badge bg-gray-100 text-gray-600 text-[10px] font-mono">{mod.code}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{mod.title}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>{done}/{total} mavzu</span>
                        <span>·</span>
                        <span>Oxirgi: {lastScore}%</span>
                        {lastTopicTitle && (
                          <>
                            <span>·</span>
                            <span className="truncate max-w-[120px]">{lastTopicTitle}</span>
                          </>
                        )}
                      </div>
                      {/* Mini progress */}
                      <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-1.5 max-w-[200px]">
                        <div 
                          className={`h-full rounded-full ${lastScore >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                          style={{ width: `${Math.round((done/total)*100)}%` }} 
                        />
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-500 transition-all shrink-0" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ═══ EMPTY STATE (no progress) ═══ */}
      {overallPercent === 0 && (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/30 flex items-center justify-center mx-auto mb-5">
              <Sparkles size={36} className="text-primary-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hali progress yo'q</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Attestatsiyaga tayyorgarlikni boshlang. 16 modul, 76 ta mavzu, 
              50 ta imtihon savoli — barchasi rasmiy blueprint asosida tuzilgan.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate('/learn')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-200 dark:shadow-primary-900/30"
              >
                <PlayCircle size={18} /> O'rganishni boshlash
              </button>
              <button
                onClick={() => navigate('/exam')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all border border-amber-200 dark:border-amber-800/30"
              >
                <FileQuestion size={18} /> Sinov imtihoni
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
