import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: {
    wrapper: 'py-8',
    iconWrapper: 'w-10 h-10',
    iconSize: 18,
    title: 'text-sm',
    desc: 'text-xs',
  },
  md: {
    wrapper: 'py-12',
    iconWrapper: 'w-14 h-14',
    iconSize: 24,
    title: 'text-base',
    desc: 'text-sm',
  },
  lg: {
    wrapper: 'py-16',
    iconWrapper: 'w-16 h-16',
    iconSize: 28,
    title: 'text-lg',
    desc: 'text-sm',
  },
}

export default function EmptyState({ icon: Icon, title, description, action, size = 'md' }: EmptyStateProps) {
  const s = SIZE_CLASSES[size]

  return (
    <div className={`flex flex-col items-center justify-center ${s.wrapper} text-center px-4`}>
      <div className={`${s.iconWrapper} rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4`}>
        <Icon size={s.iconSize} className="text-gray-300 dark:text-gray-600" />
      </div>
      <h3 className={`${s.title} font-bold text-gray-900 dark:text-gray-100`}>
        {title}
      </h3>
      {description && (
        <p className={`${s.desc} text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs`}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800
            text-white text-sm font-semibold rounded-xl transition-all
            flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          {action.icon && <action.icon size={15} />}
          {action.label}
        </button>
      )}
    </div>
  )
}
