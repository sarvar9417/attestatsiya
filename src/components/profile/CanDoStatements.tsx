import { useI18n } from '../../i18n'
import { canDoStatements, type CanDoStatement } from '../../data/canDoStatements'
import { MessageCircle, Headphones, BookOpen, PenTool } from 'lucide-react'

const CATEGORY_ICONS: Record<string, typeof MessageCircle> = {
  Speaking: MessageCircle,
  Listening: Headphones,
  Reading: BookOpen,
  Writing: PenTool,
}

const CATEGORY_COLORS: Record<string, string> = {
  Speaking: 'bg-blue-50 text-blue-600 border-blue-200',
  Listening: 'bg-purple-50 text-purple-600 border-purple-200',
  Reading: 'bg-green-50 text-green-600 border-green-200',
  Writing: 'bg-orange-50 text-orange-600 border-orange-200',
}

interface Props {
  level: string
}

export default function CanDoStatements({ level }: Props) {
  const { t, locale } = useI18n()
  const statements = canDoStatements[level]

  if (!statements || statements.length === 0) return null

  function getCategoryName(cat: CanDoStatement) {
    switch (locale) {
      case 'uz': return cat.categoryUz
      case 'ru': return cat.categoryRu
      default: return cat.category
    }
  }

  function getStatementText(statement: { en: string; uz: string; ru: string }) {
    switch (locale) {
      case 'uz': return statement.uz
      case 'ru': return statement.ru
      default: return statement.en
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-bold text-sm text-gray-900">
          {t('profile.canDoTitle')}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {t('profile.canDoSubtitle')}
        </p>
      </div>

      <div className="space-y-3">
        {statements.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.category] ?? MessageCircle
          const colorClass = CATEGORY_COLORS[cat.category] ?? 'bg-gray-50 text-gray-600 border-gray-200'

          return (
            <div
              key={cat.category}
              className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div className={`flex items-center gap-2 px-3 py-2 ${colorClass} border-b`}>
                <Icon size={14} />
                <span className="text-xs font-bold">{getCategoryName(cat)}</span>
              </div>
              <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                {cat.statements.map((s, i) => (
                  <li
                    key={i}
                    className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2"
                  >
                    <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                    <span>{getStatementText(s)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
