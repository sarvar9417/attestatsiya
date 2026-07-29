import { BookOpen, Target, BarChart3, Headphones } from 'lucide-react'
import type { ListeningSection as ListeningSectionType } from '../../data/dailyLessons'

interface Props {
  section: ListeningSectionType
  previewVocab: { word: string; definition: string; example: string }[]
  prediction: string
  setPrediction: (v: string) => void
  onStart: () => void
}

export default function ListeningPrePhase({ section, previewVocab, prediction, setPrediction, onStart }: Props) {
  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20 border-sky-100 dark:border-sky-800">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-sky-600" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Tinglashga Tayyorgarlik</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Tinglashdan oldin quyidagi so'zlar bilan tanishib oling. Ular matnda uchraydi.
        </p>
        <div className="flex flex-wrap gap-2">
          {previewVocab.map((v, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-sky-100 dark:border-sky-800">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{v.word}</span>
              {v.definition !== '...' && v.definition && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">— {v.definition}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {section.topic && (
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-primary-600" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Mavzu</h3>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{section.topic}</p>
          {section.source && (
            <p className="text-xs text-gray-400 mt-1">Manba: {section.source} {section.duration ? `· ${section.duration}` : ''}</p>
          )}
        </div>
      )}

      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={16} className="text-amber-600" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Bashorat Qiling</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Sizningcha, bu dialog nima haqida? Yuqoridagi so'z va mavzuga qarab fikr bildiring.
        </p>
        <textarea
          value={prediction}
          onChange={e => setPrediction(e.target.value)}
          placeholder="Menimcha, bu dialog ... haqida, chunki ..."
          className="input text-sm min-h-[60px] resize-none"
          rows={2}
        />
      </div>

      <button onClick={onStart} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
        <Headphones size={16} /> Tinglashni Boshlash
      </button>
    </div>
  )
}
