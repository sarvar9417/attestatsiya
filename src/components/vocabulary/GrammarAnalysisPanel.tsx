import { useEffect, useRef } from 'react'
import { Loader2, BookOpen } from 'lucide-react'
import { useI18n } from '../../i18n'

interface Props {
  text: string        // streaming yoki to'liq matn
  loading: boolean
}

interface Section {
  icon: string
  title: string
  color: string
  headerBg: string
  border: string
  content: string
}

const SECTION_DEFS = [
  { key: 'ZAMON',                     icon: '⏱',  i18nKey: 'sectionTense',        color: 'text-blue-800 dark:text-blue-300',  headerBg: 'bg-blue-100 dark:bg-blue-900/30',   border: 'border-blue-200 dark:border-blue-700'   },
  { key: 'ARTIKL',                    icon: '📖', i18nKey: 'sectionArticle',      color: 'text-green-800 dark:text-green-300', headerBg: 'bg-green-100 dark:bg-green-900/30',  border: 'border-green-200 dark:border-green-700'  },
  { key: "BOG'LOVCHILAR",             icon: '🔗', i18nKey: 'sectionConjunctions', color: 'text-orange-800 dark:text-orange-300',headerBg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-700' },
  { key: "SO'Z TARTIBI VA TUZILISH",  icon: '🧩', i18nKey: 'sectionWordOrder',   color: 'text-purple-800 dark:text-purple-300', headerBg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-700' },
  { key: 'XATOLAR VA TAVSIYALAR',     icon: '✏️', i18nKey: 'sectionErrors',      color: 'text-red-800 dark:text-red-300',   headerBg: 'bg-red-100 dark:bg-red-900/30',    border: 'border-red-200 dark:border-red-700'    },
  { key: 'UMUMIY BAHO',               icon: '🎯', i18nKey: 'sectionOverall',     color: 'text-teal-800 dark:text-teal-300',  headerBg: 'bg-teal-100 dark:bg-teal-900/30',   border: 'border-teal-200 dark:border-teal-700'   },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseSections(raw: string, t: (key: any, params?: Record<string, string | number>) => string): Section[] {
  const sections: Section[] = []

  for (const def of SECTION_DEFS) {
    // "📌 ZAMON\n..." pattern — match content until next "📌" header or end
    const pattern = new RegExp(
      `📌\\s*${def.key}\\s*\\n([\\s\\S]*?)(?=📌|$)`,
      'i'
    )
    const match = raw.match(pattern)
    if (match) {
      sections.push({
        icon:      def.icon,
        title:     t(`grammarAnalysis.${def.i18nKey}`),
        color:     def.color,
        headerBg:  def.headerBg,
        border:    def.border,
        content:   match[1].trim(),
      })
    }
  }

  // If no sections parsed yet (still streaming first lines), show raw text
  if (sections.length === 0 && raw.trim()) {
    return [{
      icon: '📝',
      title: t('grammarAnalysis.sectionFallback'),
      color: 'text-gray-800',
      headerBg: 'bg-gray-100',
      border: 'border-gray-200',
      content: raw.trim(),
    }]
  }

  return sections
}

function renderLine(line: string, idx: number) {
  // "→ ..." lines
  if (line.startsWith('→')) {
    const rest = line.slice(1).trim()

    // ❌ Xato: ...
    if (rest.startsWith('❌')) {
      return (
        <div key={idx} className="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg px-3 py-2 text-sm">
          <span className="text-red-600 dark:text-red-400 font-semibold">{rest}</span>
        </div>
      )
    }
    // ✅ To'g'ri ...
    if (rest.startsWith('✅')) {
      return (
        <div key={idx} className="mt-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg px-3 py-2 text-sm">
          <span className="text-green-700 dark:text-green-400 font-semibold">{rest}</span>
        </div>
      )
    }
    // 📖 Sababi: ...
    if (rest.startsWith('📖')) {
      return (
        <div key={idx} className="mt-1 ml-3 text-xs text-gray-500 dark:text-gray-400 italic">
          {rest}
        </div>
      )
    }

    // Bold the part before ":" or "—"
    const colonIdx = rest.search(/[:—]/)
    if (colonIdx > 0) {
      const label = rest.slice(0, colonIdx + 1)
      const value = rest.slice(colonIdx + 1)
      return (
        <div key={idx} className="flex gap-1.5 mt-1.5 text-sm leading-relaxed">
          <span className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0">→</span>
          <span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{label}</span>
            <span className="text-gray-700 dark:text-gray-300">{value}</span>
          </span>
        </div>
      )
    }

    return (
      <div key={idx} className="flex gap-1.5 mt-1.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <span className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0">→</span>
        <span>{rest}</span>
      </div>
    )
  }

  // Empty line
  if (!line.trim()) return <div key={idx} className="h-1" />

  // Regular line
  return (
    <p key={idx} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-1">
      {line}
    </p>
  )
}

export default function GrammarAnalysisPanel({ text, loading }: Props) {
  const { t } = useI18n()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [text, loading])

  const sections = parseSections(text, t)

  return (
    <div className="mt-3 rounded-2xl border-2 border-indigo-100 dark:border-indigo-800 bg-gradient-to-b from-indigo-50/60 to-white dark:from-indigo-950/30 dark:to-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-800">
        <BookOpen size={16} className="text-indigo-500 dark:text-indigo-400" />
        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{t('grammarAnalysis.title')}</span>
        {loading && (
          <div className="ml-auto flex items-center gap-1.5 text-indigo-400 dark:text-indigo-500 text-xs">
            <Loader2 size={12} className="animate-spin" />
            <span>{t('grammarAnalysis.loading')}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {sections.map((sec, si) => (
          <div
            key={si}
            className={`rounded-xl border ${sec.border} overflow-hidden`}
          >
            {/* Section header */}
            <div className={`${sec.headerBg} px-3 py-2 flex items-center gap-2`}>
              <span className="text-base leading-none">{sec.icon}</span>
              <span className={`text-xs font-bold uppercase tracking-wide ${sec.color}`}>
                {sec.title}
              </span>
            </div>
            {/* Section body */}
            <div className="px-3 py-2.5 bg-white dark:bg-gray-800">
              {sec.content.split('\n').map((line, li) => renderLine(line, li))}
            </div>
          </div>
        ))}

        {/* Loading cursor */}
        {loading && (
          <div className="flex items-center gap-1.5 px-2 py-1">
            <div className="w-1.5 h-4 bg-indigo-400 rounded-sm animate-pulse" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
