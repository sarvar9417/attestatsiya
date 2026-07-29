import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface Props {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-3">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} />}
          {item.path ? (
            <Link to={item.path} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
