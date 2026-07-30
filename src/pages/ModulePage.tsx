import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MODULES } from '../data/contentTree'
import { useProgressStore } from '../store/progressStore'
import TopicView from '../components/learning/TopicView'
import { ArrowLeft, CheckCircle2, Circle, Play, FileQuestion } from 'lucide-react'

export default function ModulePage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const [activeSubtopicId, setActiveSubtopicId] = useState<string | null>(null)

  const mod = MODULES.find(m => m.id === moduleId)
  const { getModuleProgress, completeTopic } = useProgressStore()

  if (!mod) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-gray-500">Bo'lim topilmadi</p>
        <Link to="/learn" className="text-primary-600 hover:underline mt-2 inline-block">Bo'limlarga qaytish</Link>
      </div>
    )
  }

  const progress = getModuleProgress(moduleId!)
  const completedCount = progress.completedTopics.length
  const totalTopics = mod.subtopics.length

  const handleTopicComplete = (subtopicId: string, correct: number, total: number) => {
    completeTopic(moduleId!, subtopicId, correct, total)
    setActiveSubtopicId(null)
  }

  const currentIndex = mod.subtopics.findIndex(s => s.id === activeSubtopicId)
  const currentSubtopic = activeSubtopicId ? mod.subtopics.find(s => s.id === activeSubtopicId) : null
  const nextSubtopic = currentIndex >= 0 && currentIndex < totalTopics - 1 ? mod.subtopics[currentIndex + 1] : null

  if (activeSubtopicId && currentSubtopic) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <TopicView
          moduleId={moduleId!}
          subtopicId={activeSubtopicId}
          moduleTitle={mod.title}
          onComplete={(correct, total) => handleTopicComplete(activeSubtopicId, correct, total)}
          onBack={() => setActiveSubtopicId(null)}
        />
        {nextSubtopic && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl border border-primary-100 dark:border-primary-800/30 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Keyingi mavzu</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{nextSubtopic.title}</p>
            </div>
            <button
              onClick={() => setActiveSubtopicId(nextSubtopic.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Davom etish <ArrowLeft size={14} className="rotate-180" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <Link to="/learn" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-4">
        <ArrowLeft size={14} /> Bo'limlarga qaytish
      </Link>

      <div className="mb-8">
        <span className="badge bg-primary-100 text-primary-700 text-xs font-mono mb-2 inline-block">{mod.code}</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{mod.title}</h1>
        <p className="text-sm text-gray-500 mb-4">{mod.description}</p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <CheckCircle2 size={14} className={completedCount === totalTopics ? 'text-green-500' : 'text-gray-300'} />
            <span>{completedCount}/{totalTopics} mavzu</span>
          </div>
          <div className="flex-1">
            <div className="progress-bar">
              <div className="progress-fill bg-primary-500" style={{ width: `${(completedCount / totalTopics) * 100}%` }} />
            </div>
          </div>
          <span className="text-sm font-medium text-primary-600">{Math.round((completedCount / totalTopics) * 100)}%</span>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        {mod.subtopics.map((st, idx) => {
          const done = progress.completedTopics.includes(st.id)
          const tp = progress.topicProgress[st.id]
          return (
            <button
              key={st.id}
              onClick={() => setActiveSubtopicId(st.id)}
              className={`w-full card p-4 flex items-center gap-4 text-left transition-all hover:shadow-md group ${
                done ? 'border-green-200 dark:border-green-800/50' : 'border-gray-100 dark:border-gray-800'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                done ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {done ? (
                  <CheckCircle2 size={22} className="text-green-600" />
                ) : (
                  <Circle size={22} className="text-gray-300 group-hover:text-primary-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                  <span className={`font-medium text-sm ${done ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                    {st.title}
                  </span>
                </div>
                {tp && <p className="text-xs text-gray-400 mt-0.5">Natija: {tp.lastScore}% ({tp.correctCount}/{tp.totalCount})</p>}
              </div>
              {done ? (
                <span className="text-xs text-green-600 font-medium shrink-0">Bajarildi</span>
              ) : (
                <Play size={16} className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      <div className="card p-6 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
            <FileQuestion size={24} className="text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base text-gray-900 dark:text-white">Attestatsiya sinov imtihoni</h3>
            <p className="text-sm text-gray-500 mt-1">
              50 ta savol, 120 daqiqa. Rasmiy blueprint bo'yicha: 35 informatika + 5 kasb standarti + 7 pedagogika + 3 metodika.
            </p>
          </div>
          <button onClick={() => navigate('/exam')} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shrink-0">
            Boshlash
          </button>
        </div>
      </div>
    </div>
  )
}
