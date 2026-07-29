import type { DailyLesson } from '../../data/dailyLessons'

export type Tab = 'theory' | 'drill' | 'reading' | 'speaking' | 'writing' | 'listening' | 'mixed'

interface LessonNavigationProps {
  lesson: DailyLesson
  tab: Tab
  onTabChange: (tab: Tab) => void
}

export default function LessonNavigation({ lesson, tab, onTabChange }: LessonNavigationProps) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'theory',    label: 'Nazariya',  icon: '📖' },
    { id: 'drill',     label: 'Mashqlar',  icon: '⚡' },
    ...(lesson.reading ? [{ id: 'reading' as Tab, label: "O'qish", icon: '📰' }] : []),
    { id: 'speaking' as Tab, label: 'Gapirish', icon: '🎤' },
    { id: 'writing' as Tab, label: 'Yozish', icon: '✍️' },
    ...(lesson.listening ? [{ id: 'listening' as Tab, label: 'Tinglash', icon: '🎧' }] : []),
    { id: 'mixed' as Tab, label: 'Aralash', icon: '🔀' },
  ]

  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onTabChange(t.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            tab === t.id
              ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}>
          <span>{t.icon}</span>
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  )
}
