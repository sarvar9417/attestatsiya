import { lazy, Suspense } from 'react'
import type { BuddyContext } from '../../services/aiBuddyService'

const AIBuddyChat = lazy(() => import('./AIBuddyChat'))

interface Props {
  context: BuddyContext
  onClose: () => void
}

function ChatSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="h-14 bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
          <div className="w-24 h-4 rounded bg-white/20 animate-pulse" />
        </div>
        <div className="w-8 h-8 rounded-lg bg-white/20 animate-pulse" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`h-10 rounded-xl animate-pulse ${i % 2 === 0 ? 'w-3/4 bg-gray-200 dark:bg-gray-700' : 'w-1/2 bg-primary-100 dark:bg-primary-900/30'}`} />
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <div className="h-10 rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  )
}

export default function AIBuddyChatModal({ context, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overscroll-contain safe-area-bottom" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg">
        <Suspense fallback={<ChatSkeleton />}>
          <AIBuddyChat context={context} onClose={onClose} />
        </Suspense>
      </div>
    </div>
  )
}
