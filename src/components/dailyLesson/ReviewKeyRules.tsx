import { BookOpen, ChevronDown } from 'lucide-react'

interface KeyRule {
  topic: string
  icon: string
  color: string
  rules: string[]
}

interface Props {
  keyRules: KeyRule[]
  expandedRules: Record<string, boolean>
  understoodRules: Record<string, boolean>
  onToggleExpand: (topic: string) => void
  onToggleUnderstood: (topic: string) => void
}

export default function ReviewKeyRules({
  keyRules, expandedRules, understoodRules,
  onToggleExpand, onToggleUnderstood,
}: Props) {
  const understoodCount = keyRules.filter(kr => understoodRules[kr.topic]).length
  const totalRules = keyRules.length

  const colorMap: Record<string, string> = {
    blue: 'border-blue-200 dark:border-blue-800',
    green: 'border-green-200 dark:border-green-800',
    orange: 'border-orange-200 dark:border-orange-800',
    purple: 'border-purple-200 dark:border-purple-800',
    red: 'border-red-200 dark:border-red-800',
    teal: 'border-teal-200 dark:border-teal-800',
  }

  const bgMap: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    teal: 'bg-teal-50 dark:bg-teal-900/20',
  }

  const titleColorMap: Record<string, string> = {
    blue: 'text-blue-700 dark:text-blue-300',
    green: 'text-green-700 dark:text-green-300',
    orange: 'text-orange-700 dark:text-orange-300',
    purple: 'text-purple-700 dark:text-purple-300',
    red: 'text-red-700 dark:text-red-300',
    teal: 'text-teal-700 dark:text-teal-300',
  }

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <BookOpen size={16} className="text-indigo-500 flex-shrink-0" />
        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 whitespace-nowrap">Qoidalar eslatmasi</span>
        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${totalRules > 0 ? (understoodCount / totalRules) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 whitespace-nowrap">
          {understoodCount}/{totalRules}
        </span>
      </div>

      {/* Individual accordion cards */}
      <div className="animate-stagger space-y-2">
        {keyRules.map(kr => {
          const isExpanded = expandedRules[kr.topic] ?? false
          const isUnderstood = understoodRules[kr.topic] ?? false
          return (
            <div
              key={kr.topic}
              className={`rounded-xl border overflow-hidden transition-all duration-200 ${isUnderstood ? 'opacity-75' : ''} ${colorMap[kr.color] ?? colorMap.blue}`}
            >
              {/* Header — click to expand */}
              <button
                onClick={() => onToggleExpand(kr.topic)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${bgMap[kr.color] ?? bgMap.blue} hover:opacity-80`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-sm font-bold ${titleColorMap[kr.color] ?? titleColorMap.blue} truncate`}>
                    {kr.icon} {kr.topic}
                  </span>
                  {isUnderstood && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex-shrink-0">✓ Tushundim</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Tushundim toggle */}
                  <button
                    onClick={e => { e.stopPropagation(); onToggleUnderstood(kr.topic) }}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isUnderstood
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                    }`}
                    title={isUnderstood ? "Tushunmadim deb belgilash" : "Tushundim deb belgilash"}
                  >
                    {isUnderstood && <span className="text-xs">✓</span>}
                  </button>
                  <ChevronDown size={15} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-3 bg-white dark:bg-gray-900 animate-slide-up">
                  <ul className="space-y-1 pt-1">
                    {kr.rules.map((rule, i) => (
                      <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex gap-1.5 leading-relaxed">
                        <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
