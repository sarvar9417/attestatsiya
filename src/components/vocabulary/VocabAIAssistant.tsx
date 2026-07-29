import { useState, useCallback } from 'react'
import { Bot, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { monitoring } from '../../lib/monitoring'
import { explainWord, generateExamples } from '../../lib/claude'

interface Props {
  english: string
  level: string
}

export default function VocabAIAssistant({ english, level }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [examples, setExamples] = useState('')
  const [tab, setTab] = useState<'explain' | 'examples'>('explain')

  const handleOpen = useCallback(async () => {
    if (open) { setOpen(false); return }
    setOpen(true)
    if (!explanation) {
      setLoading(true)
      setTab('explain')
      try {
        const exp = await explainWord(english)
        setExplanation(exp)
        // Fetch examples separately
        generateExamples(
          english,
          level,
          () => {},
          (text) => { setExamples(text) },
          () => { setExamples('') },
        )
      } catch (e) {
        monitoring.captureMessage('AI assistant explanation failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
        setExplanation('AI dan javob olishda xatolik yuz berdi.')
      } finally {
        setLoading(false)
      }
    }
  }, [open, english, level, explanation])

  return (
    <div className="mt-1">
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-xs font-medium
          text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50
          dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-950/30
          px-2 py-1 rounded-lg transition-all"
      >
        {open ? <X size={12} /> : <Bot size={12} />}
        {open ? 'Yopish' : 'AI yordamchi'}
        {open ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      </button>

      {open && (
        <div className="mt-2 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800
          bg-indigo-50 dark:bg-indigo-950/30 text-xs leading-relaxed text-gray-700 dark:text-gray-300"
        >
          {/* Tab switcher */}
          <div className="flex gap-2 mb-2 pb-2 border-b border-indigo-200 dark:border-indigo-800">
            <button
              onClick={() => setTab('explain')}
              className={`text-xs font-semibold px-2 py-0.5 rounded-md transition-all ${
                tab === 'explain'
                  ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300'
                  : 'text-indigo-400 hover:text-indigo-600'
              }`}
            >
              📖 Tushuntirish
            </button>
            <button
              onClick={() => setTab('examples')}
              className={`text-xs font-semibold px-2 py-0.5 rounded-md transition-all ${
                tab === 'examples'
                  ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300'
                  : 'text-indigo-400 hover:text-indigo-600'
              }`}
            >
              📝 Misollar
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-indigo-400 py-2">
              <Loader2 size={12} className="animate-spin" />
              AI tahlil qilmoqda...
            </div>
          ) : tab === 'explain' ? (
            <div className="whitespace-pre-wrap">{explanation || 'Tushuntirish yuklanmadi.'}</div>
          ) : (
            <div className="whitespace-pre-wrap">{examples || 'Misollar yuklanmadi.'}</div>
          )}
        </div>
      )}
    </div>
  )
}
