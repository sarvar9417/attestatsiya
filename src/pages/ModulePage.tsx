import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCatalog } from '../hooks/useCatalog'
import { getSubtopicMeta } from '../data/topicContent'
import { useProgressStore } from '../store/progressStore'
import TopicView from '../components/learning/TopicView'
import { ArrowLeft, CheckCircle2, Play, FileQuestion, BookOpen, ChevronRight, Target, Trophy, Sparkles, BookText, Lightbulb, Table2, Sigma, ListTodo, Layers } from 'lucide-react'

export default function ModulePage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { modules } = useCatalog()
  const mod = modules.find(m => m.id === moduleId)
  const { getModuleProgress, completeTopic } = useProgressStore()

  const [activeSubtopicId, setActiveSubtopicId] = useState<string | null>(null)

  // Compute aggregated content stats for this module
  const contentStats = useMemo(() => {
    let totalTheory = 0
    let totalQuestions = 0
    let totalBlocks = 0
    const theoryTypeCount: Record<string, number> = {}
    const questionTypeCount: Record<string, number> = {}

    for (const st of mod?.subtopics ?? []) {
      const meta = getSubtopicMeta(st.id)
      if (!meta) continue
      totalTheory += meta.theoryCount
      totalQuestions += meta.questionCount
      totalBlocks += meta.totalBlocks
      for (const tt of meta.theoryTypes) {
        theoryTypeCount[tt.type] = (theoryTypeCount[tt.type] || 0) + tt.count
      }
      for (const qt of meta.questionTypes) {
        questionTypeCount[qt.type] = (questionTypeCount[qt.type] || 0) + qt.count
      }
    }
    return { totalTheory, totalQuestions, totalBlocks, theoryTypeCount, questionTypeCount }
  }, [mod?.subtopics])

  if (!mod) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen size={48} className="mx-auto text-gray-300" />
          <p className="text-gray-400 text-lg">Bo'lim topilmadi</p>
          <Link to="/learn" className="text-primary-600 hover:underline text-sm inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Bo'limlarga qaytish
          </Link>
        </div>
      </div>
    )
  }

  const progress = getModuleProgress(moduleId!)
  const completedCount = progress.completedTopics.length
  const totalTopics = mod.subtopics.length
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  const handleTopicComplete = (subtopicId: string, correct: number, total: number) => {
    completeTopic(moduleId!, subtopicId, correct, total)
    setActiveSubtopicId(null)
  }

  const currentIndex = mod.subtopics.findIndex(s => s.id === activeSubtopicId)
  const currentSubtopic = activeSubtopicId ? mod.subtopics.find(s => s.id === activeSubtopicId) : null
  const nextSubtopic = currentIndex >= 0 && currentIndex < totalTopics - 1 ? mod.subtopics[currentIndex + 1] : null

  // When viewing a topic
  if (activeSubtopicId && currentSubtopic) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        {/* Keyingi mavzuga o'tish TopicView ichida — o'qish yakunida bir marta
            taklif qilinadi, shuning uchun bu yerda takroriy karta yo'q. */}
        <TopicView
          moduleId={moduleId!}
          subtopicId={activeSubtopicId}
          moduleTitle={mod.title}
          subtopicIndex={currentIndex}
          subtopicCount={totalTopics}
          nextSubtopic={nextSubtopic}
          onOpenTopic={setActiveSubtopicId}
          onComplete={(correct, total) => handleTopicComplete(activeSubtopicId, correct, total)}
          onBack={() => setActiveSubtopicId(null)}
        />
      </div>
    )
  }

  // Module overview page
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Back link */}
      <Link to="/learn" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-600 transition-colors mb-5 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
        <ArrowLeft size={12} /> Bo'limlarga qaytish
      </Link>

      {/* Module Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white p-6 sm:p-8 mb-6">
        <div className="absolute top-0 right-0 w-72 h-72 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute top-24 right-24 w-20 h-20 rounded-full bg-white" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-[11px] font-mono font-semibold tracking-wider">
              {mod.code}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/70">
              <BookOpen size={12} /> {totalTopics} ta mavzu
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">{mod.title}</h1>
          <p className="text-sm text-white/80 leading-relaxed max-w-xl">{mod.description}</p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-6 shadow-sm">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 bg-pattern-dots opacity-50" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                completedCount === totalTopics ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-primary-100 dark:bg-primary-900/30'
              }`}>
                {completedCount === totalTopics 
                  ? <Trophy size={18} className="text-emerald-600" />
                  : <Target size={18} className="text-primary-600" />
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {completedCount === totalTopics ? "Modul to'liq o'zlashtirildi" : "O'zlashtirish darajasi"}
                </p>
                <p className="text-xs text-gray-400">{completedCount}/{totalTopics} mavzu bajarildi</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                <span className="text-gradient">{progressPercent}%</span>
              </div>
            </div>
          </div>
          
          <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-b2-500 transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
          {/* Mini milestone dots */}
          <div className="flex justify-between px-0.5 mt-1">
            {[0, 25, 50, 75, 100].map(p => (
              <div key={p} className={`milestone-dot ${
                progressPercent >= p ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'
              }`} />
            ))}
          </div>
        </div>

        {/* ═══ CONTENT STATS OVERVIEW ═══ */}
        {contentStats.totalBlocks > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Layers size={13} className="text-gray-400" />
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kontent qamrovi
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Theory blocks */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                <BookText size={12} className="text-primary-500" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{contentStats.totalTheory}</span>
                <span className="text-[10px] text-gray-400">nazariy bo'lim</span>
              </div>
              {/* Test questions */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <FileQuestion size={12} className="text-primary-600" />
                <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">{contentStats.totalQuestions}</span>
                <span className="text-[10px] text-primary-400">test savoli</span>
              </div>
              {/* Y1/Y2/Y3 breakdown */}
              {Object.entries(contentStats.questionTypeCount).map(([type, count]) => (
                <span key={type} className="text-[10px] px-1.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {count} × {{
                    Y1: 'Y1 (bilish)',
                    Y2: 'Y2 (qo\'llash)',
                    Y3: 'Y3 (mulohaza)',
                  }[type] || type}
                </span>
              ))}
              {/* Theory type distribution */}
              {Object.entries(contentStats.theoryTypeCount).slice(0, 5).map(([type, count]) => (
                <span key={type} className="text-[10px] px-1.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-400">
                  {count} × {type}
                </span>
              ))}
              {Object.keys(contentStats.theoryTypeCount).length > 5 && (
                <span className="text-[10px] text-gray-400">+{Object.keys(contentStats.theoryTypeCount).length - 5}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subtopic List */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mavzular</h2>
        </div>

        {mod.subtopics.map((st, idx) => {
          const done = progress.completedTopics.includes(st.id)
          const tp = progress.topicProgress[st.id]
          const isCurrent = idx === 0 && completedCount === 0
          const meta = getSubtopicMeta(st.id)

          // Icon mapping for theory types
          const theoryIcon = (type: string) => {
            switch(type) {
              case 'definition': return <BookText size={10} className="text-primary-500" />
              case 'text': return <BookOpen size={10} className="text-blue-500" />
              case 'table': return <Table2 size={10} className="text-purple-500" />
              case 'formula': return <Sigma size={10} className="text-amber-600" />
              case 'example': return <Lightbulb size={10} className="text-amber-500" />
              case 'note': return <ListTodo size={10} className="text-b1-500" />
              default: return null
            }
          }

          return (
            <button
              key={st.id}
              onClick={() => setActiveSubtopicId(st.id)}
              className={`w-full text-left group transition-all duration-300 ${
                done 
                  ? 'bg-white dark:bg-gray-800/80 border-emerald-200 dark:border-emerald-800/50' 
                  : 'bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-xl hover:-translate-y-0.5'
              } rounded-2xl border p-4 sm:p-5 shadow-sm`}
            >
              <div className="flex items-start gap-4">
                {/* Status indicator */}
                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                  done 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                    : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20'
                }`}>
                  {done ? (
                    <div className="relative">
                      <CheckCircle2 size={24} className="text-emerald-600" />
                      <Sparkles size={10} className="absolute -top-1 -right-1 text-emerald-400" />
                    </div>
                  ) : isCurrent ? (
                    <Play size={22} className="text-primary-500 ml-0.5" />
                  ) : (
                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500 font-mono">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  )}
                  {done && (
                    <div className="absolute inset-0 rounded-xl ring-2 ring-emerald-300 dark:ring-emerald-700 ring-offset-2 ring-offset-white dark:ring-offset-gray-900" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-sm transition-colors ${
                      done 
                        ? 'text-gray-400 dark:text-gray-500 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {st.title}
                    </span>
                  </div>
                  
                  {/* ═══ CONTENT RICHNESS BADGES ═══ */}
                  {meta && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {/* Theory block badges */}
                      {meta.theoryTypes.map(tt => (
                        <span key={tt.type} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/50 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                          {theoryIcon(tt.type)}
                          <span>{tt.count}</span>
                          <span className="text-[9px] text-gray-400">{{
                            definition: 't\'rif',
                            text: 'matn',
                            table: 'jadval',
                            formula: 'formula',
                            example: 'misol',
                            note: 'eslatma',
                          }[tt.type] || tt.type}</span>
                        </span>
                      ))}
                      {/* Question type badges */}
                      {meta.questionTypes.map(qt => (
                        <span key={qt.type} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/20 text-[10px] text-primary-600 dark:text-primary-400 font-medium">
                          <FileQuestion size={10} />
                          <span>{qt.count}</span>
                          <span className="text-[9px] text-primary-400">{{
                            Y1: 'bilish',
                            Y2: 'qo\'llash',
                            Y3: 'mulohaza',
                          }[qt.type] || qt.type}</span>
                        </span>
                      ))}
                      {/* Total blocks */}
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] text-gray-400">
                        <Layers size={10} />
                        <span>{meta.totalBlocks} blok</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-xs">
                    {done ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 size={12} /> Bajarildi
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        {isCurrent ? 'Darsni boshlash' : "O'zlashtirilmagan"}
                      </span>
                    )}
                    {tp && (
                      <span className="text-gray-400">
                        | Oxirgi natija: {tp.lastScore}% ({tp.correctCount}/{tp.totalCount})
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 shrink-0 self-start mt-0.5">
                  {tp && (
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      tp.lastScore >= 80 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {tp.lastScore}%
                    </div>
                  )}
                  {!done && (
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200 mt-1" />
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Mock Exam CTA */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/10 dark:to-blue-900/10 rounded-2xl border border-primary-100 dark:border-primary-800/30 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
            <FileQuestion size={24} className="text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white">Attestatsiya sinov imtihoni</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              50 ta savol · 120 daqiqa · 35 informatika + 5 kasb standarti + 7 pedagogika + 3 metodika
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-[11px] px-2 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">8 bilish</span>
              <span className="text-[11px] px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">35 qo'llash</span>
              <span className="text-[11px] px-2 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">7 mulohaza</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => navigate('/exam')}
              className="px-3 py-2.5 bg-white dark:bg-gray-800/80 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-primary-200 dark:border-primary-800/30 shadow-sm"
              title="To'liq attestatsiya sinovi"
            >
              To'liq sinov
            </button>
            <button
              onClick={() => navigate(`/exam/bolim/${moduleId}`)}
              className="px-3 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
            >
              Modul sinovi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
