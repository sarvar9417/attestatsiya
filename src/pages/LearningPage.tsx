import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCatalog } from '../hooks/useCatalog'
import type { CatalogModule } from '../features/content/catalog'
import { useProgressStore } from '../store/progressStore'
import { 
  BookOpen, Search, GraduationCap, 
  Target, CheckCircle2, Trophy, BookText,
  Layers, Code2, Shield, Users,
  Sparkles, Clock, ArrowRight, Brain,
  FileQuestion, BarChart3, X
} from 'lucide-react'

// ─── Section config ─────────────────────────────────────────────
const SECTION_CONFIG: Record<string, { label: string; icon: typeof BookOpen; description: string }> = {
  specialty: { 
    label: 'Informatika mutaxassisligi', 
    icon: Code2, 
    description: 'M01–M13: Informatika fanining asosiy yo\'nalishlari' 
  },
  professional_standard: { 
    label: 'Kasb standarti', 
    icon: Shield, 
    description: 'M14: O\'qituvchining kasbiy kompetensiyalari' 
  },
  pedagogy: { 
    label: 'Umumiy pedagogika', 
    icon: Users, 
    description: 'M15: Pedagogik nazariya va amaliyot' 
  },
  methodology: { 
    label: 'Informatika o\'qitish metodikasi', 
    icon: GraduationCap, 
    description: 'M16: Fanni o\'qitish usullari va yondashuvlari' 
  },
}

const SECTION_ORDER = ['specialty', 'professional_standard', 'pedagogy', 'methodology']

// ─── Main Component ─────────────────────────────────────────────
export default function LearningPage() {
  const [search, setSearch] = useState('')
  const [hoverCard, setHoverCard] = useState<string | null>(null)
  const navigate = useNavigate()
  const { getModuleProgress } = useProgressStore()
  const { modules } = useCatalog()

  // ─── Search ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search) return modules
    const q = search.toLowerCase()
    return modules.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      m.subtopics.some(s => s.title.toLowerCase().includes(q)) ||
      m.section.toLowerCase().includes(q)
    )
  }, [search, modules])

  // ─── Stats ─────────────────────────────────────────────────────
  const stats = useMemo(() => {
    let completed = 0
    let totalSubtopics = 0
    let modulesWithProgress = 0
    for (const mod of modules) {
      const prog = getModuleProgress(mod.id)
      totalSubtopics += mod.subtopics.length
      completed += prog.completedTopics.length
      if (prog.completedTopics.length > 0) modulesWithProgress++
    }
    return { 
      completed, 
      totalSubtopics, 
      modulesWithProgress,
      percent: totalSubtopics > 0 ? Math.round((completed / totalSubtopics) * 100) : 0 
    }
  }, [getModuleProgress, modules])

  // ─── Group modules by section ──────────────────────────────────
  const groupedModules = useMemo(() => {
    const groups = new Map<string, CatalogModule[]>()
    for (const sec of SECTION_ORDER) {
      const mods = filtered.filter(m => m.section === sec)
      if (mods.length > 0) groups.set(sec, mods)
    }
    return groups
  }, [filtered])

  const filteredSections = Array.from(groupedModules.keys())

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 animate-fade-in">
      {/* ═══ HEADER ═══ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white p-6 sm:p-8 mb-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
          <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-white" />
          <div className="absolute top-28 right-28 w-24 h-24 rounded-full bg-white" />
          <div className="absolute top-16 right-16 w-12 h-12 rounded-full bg-primary-400" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-[11px] font-mono font-semibold tracking-wider text-primary-300">
              ATTESTATSIYA 2026
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock size={12} /> {modules.length} modul · {stats.totalSubtopics} mavzu
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
            O'quv modullari
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
            Informatika attestatsiyasiga to'liq tayyorgarlik. 
            Rasmiy blueprint asosida tuzilgan 16 ta modul.
          </p>
        </div>
      </div>

      {/* ═══ STATS BAR ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { 
            label: "Umumiy progress", 
            value: `${stats.percent}%`, 
            sub: `${stats.completed}/${stats.totalSubtopics} mavzu`,
            icon: Target,
            color: 'text-primary-600', 
            bg: 'bg-primary-50 dark:bg-primary-900/20',
            barColor: 'bg-primary-500'
          },
          { 
            label: "Boshlangan modullar", 
            value: `${stats.modulesWithProgress}/${modules.length}`, 
            sub: 'ta modul',
            icon: BookOpen,
            color: 'text-blue-600', 
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            barColor: 'bg-blue-500'
          },
          { 
            label: "Imtihon savollari", 
            value: '50', 
            sub: '120 daqiqa',
            icon: FileQuestion,
            color: 'text-purple-600', 
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            barColor: 'bg-purple-500'
          },
          { 
            label: "O'tish bali", 
            value: '60%', 
            sub: '≥ 60 ball',
            icon: Trophy,
            color: 'text-amber-600', 
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            barColor: 'bg-amber-500'
          },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon size={16} className={s.color} />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{s.label}</span>
              </div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          )
        })}
      </div>

      {/* ═══ OVERALL PROGRESS BAR ═══ */}
      {stats.totalSubtopics > 0 && (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <BarChart3 size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Umumiy o'zlashtirish</p>
                <p className="text-xs text-gray-400">{stats.completed}/{stats.totalSubtopics} mavzu bajarildi</p>
              </div>
            </div>
            <div className="text-lg font-bold text-primary-600">{stats.percent}%</div>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-1000 ease-out"
              style={{ width: `${stats.percent}%` }} 
            />
          </div>
          {/* Mini markers */}
          <div className="flex justify-between text-[10px] text-gray-300 dark:text-gray-600 mt-1 px-0.5">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* ═══ SEARCH ═══ */}
      <div className="relative mb-6 group">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
        <input
          className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all dark:text-white shadow-sm"
          placeholder="Modul, mavzu yoki kod bo'yicha qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ═══ SEARCH RESULTS COUNT ═══ */}
      {search && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <Brain size={14} />
          <span>{filtered.length} ta natija topildi</span>
          {filtered.length > 0 && (
            <span className="text-xs text-gray-400">
              ({filtered.reduce((acc, m) => acc + m.subtopics.length, 0)} ta mavzu)
            </span>
          )}
        </div>
      )}

      {/* ═══ MODULES BY SECTION ═══ */}
      {filteredSections.map(sectionKey => {
        const cfg = SECTION_CONFIG[sectionKey]
        const SectionIcon = cfg?.icon || BookOpen
        const modules = groupedModules.get(sectionKey)!

        return (
          <div key={sectionKey} className="mb-8">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <SectionIcon size={16} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {cfg?.label || sectionKey}
                </h2>
                {cfg?.description && (
                  <p className="text-xs text-gray-400 mt-0.5">{cfg.description}</p>
                )}
              </div>
              <div className="flex-1" />
              <span className="text-xs text-gray-400">{modules.length} ta modul</span>
            </div>

            {/* Module cards */}
            <div className="space-y-3">
              {modules.map(mod => {
                const prog = getModuleProgress(mod.id)
                const completedCount = prog.completedTopics.length
                const totalCount = mod.subtopics.length
                const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
                const isFullyComplete = completedCount === totalCount
                const isHovered = hoverCard === mod.id

                return (
                  <button
                    key={mod.id}
                    onClick={() => navigate(`/learn/${mod.id}`)}
                    onMouseEnter={() => setHoverCard(mod.id)}
                    onMouseLeave={() => setHoverCard(null)}
                    className={`w-full text-left group transition-all duration-300 ${
                      isFullyComplete 
                        ? 'bg-white dark:bg-gray-800/80 border-emerald-200 dark:border-emerald-800/40' 
                        : 'bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700'
                    } rounded-2xl border shadow-sm overflow-hidden`}
                  >
                    {/* Top gradient accent */}
                    <div className={`h-1 w-full transition-all duration-300 ${
                      isFullyComplete 
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                        : completedCount > 0 
                          ? 'bg-gradient-to-r from-primary-400 to-primary-500' 
                          : 'bg-gradient-to-r from-gray-200 to-gray-200 dark:from-gray-700 dark:to-gray-700'
                    }`} />

                    <div className="p-4 sm:p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isFullyComplete 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 shadow-sm' 
                            : completedCount > 0
                              ? 'bg-primary-100 dark:bg-primary-900/30 shadow-sm'
                              : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20'
                        }`}>
                          {isFullyComplete ? (
                            <div className="relative">
                              <CheckCircle2 size={24} className="text-emerald-600" />
                              <Sparkles size={10} className="absolute -top-1 -right-1 text-emerald-400" />
                            </div>
                          ) : (
                            <div className="relative">
                              <BookText size={22} className={
                                completedCount > 0 ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                              } />
                              {completedCount > 0 && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center text-[8px] font-bold">
                                  {completedCount}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono tracking-wider ${
                              isFullyComplete 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                            }`}>
                              {mod.code}
                            </span>
                            <span className={`font-semibold text-sm transition-colors ${
                              isFullyComplete 
                                ? 'text-gray-500 dark:text-gray-400 line-through' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {mod.title}
                            </span>
                            {isFullyComplete && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold">
                                To'liq
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 leading-relaxed">
                            {mod.description}
                          </p>

                          {/* Stats row */}
                          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                            {/* Progress bar */}
                            <div className="flex items-center gap-2 flex-1 min-w-[100px]">
                              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isFullyComplete 
                                      ? 'bg-emerald-400' 
                                      : 'bg-gradient-to-r from-primary-400 to-primary-500'
                                  }`}
                                  style={{ width: `${progressPct}%` }} 
                                />
                              </div>
                              <span className={`text-[11px] font-semibold shrink-0 ${
                                isFullyComplete ? 'text-emerald-600' : 'text-primary-600'
                              }`}>
                                {progressPct}%
                              </span>
                            </div>

                            {/* Subtopic count */}
                            <span className="flex items-center gap-1 text-[11px] text-gray-400">
                              <Layers size={11} />
                              {completedCount}/{totalCount} mavzu
                            </span>

                            {/* Exam questions */}
                            <span className="flex items-center gap-1 text-[11px] text-gray-400">
                              <FileQuestion size={11} />
                              {mod.examQuestionCount} savol
                            </span>

                            {/* Section badge */}
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-400">
                              {mod.section === 'specialty' ? 'Mutaxassislik' : 
                               mod.section === 'professional_standard' ? 'Kasb standarti' :
                               mod.section === 'pedagogy' ? 'Pedagogika' : 'Metodika'}
                            </span>
                          </div>
                        </div>

                        {/* Right arrow */}
                        <div className="shrink-0 self-center">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isHovered 
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 translate-x-1' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                          }`}>
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* ═══ EMPTY STATE ═══ */}
      {filteredSections.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Natija topilmadi</p>
          <p className="text-sm text-gray-400 mt-1">"{search}" bo'yicha hech narsa topilmadi</p>
          <button 
            onClick={() => setSearch('')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Qidiruvni tozalash
          </button>
        </div>
      )}
    </div>
  )
}
