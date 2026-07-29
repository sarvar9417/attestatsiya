// ═══════════════════════════════════════════════════════════════════════════
// WeeklyLessonView — kunlik darsning bloklarini o'qish rejimida ko'rsatish
// ═══════════════════════════════════════════════════════════════════════════
import { ExternalLink, Mic, CheckCircle2, Lightbulb } from 'lucide-react'
import type { LessonBlock } from '../../types/weeklyLesson'

export default function WeeklyLessonView({ blocks }: { blocks: LessonBlock[] }) {
  if (blocks.length === 0) {
    return <p className="text-sm text-gray-400 py-3">Bu darsda hali kontent yo'q.</p>
  }
  return (
    <div className="space-y-3 pt-2">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  )
}

function BlockView({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div>
          {block.title && <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{block.title}</p>}
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{block.body}</p>
        </div>
      )

    case 'rule':
      return (
        <div className="rounded-xl border border-primary-100 dark:border-primary-900/40 bg-primary-50/50 dark:bg-primary-900/10 p-3">
          <p className="font-semibold text-primary-700 dark:text-primary-300 mb-1">{block.title}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-2">{block.rule}</p>
          {block.examples.length > 0 && (
            <ul className="space-y-1">
              {block.examples.map((ex, j) => (
                <li key={j} className="text-sm">
                  <span className="text-gray-800 dark:text-gray-200">{ex.en}</span>
                  {ex.uz && <span className="text-gray-500 dark:text-gray-400"> — {ex.uz}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )

    case 'vocab':
      return (
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-3">
          {block.title && <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1.5">{block.title}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {block.items.map((it, j) => (
              <div key={j} className="text-sm flex gap-1.5">
                <span className="font-medium text-gray-800 dark:text-gray-200">{it.en}</span>
                <span className="text-gray-400">—</span>
                <span className="text-gray-500 dark:text-gray-400">{it.uz}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'task':
      return (
        <div className="rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-900/10 p-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{block.prompt}</p>
              {block.hint && (
                <p className="mt-1.5 text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Lightbulb size={13} /> {block.hint}
                </p>
              )}
              {block.answer && (
                <details className="mt-1.5">
                  <summary className="cursor-pointer text-primary-600 dark:text-primary-400 text-xs font-semibold">
                    Javobni ko'rsatish
                  </summary>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{block.answer}</p>
                </details>
              )}
            </div>
          </div>
        </div>
      )

    case 'speaking':
      return (
        <div className="rounded-xl border border-violet-100 dark:border-violet-900/40 bg-violet-50/50 dark:bg-violet-900/10 p-3">
          <div className="flex items-start gap-2">
            <Mic size={16} className="text-violet-600 dark:text-violet-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{block.prompt}</p>
              <p className="mt-1 text-xs text-violet-600 dark:text-violet-400 font-semibold">{block.seconds} soniya</p>
            </div>
          </div>
        </div>
      )

    case 'link':
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          <ExternalLink size={15} /> {block.label || block.url}
          {block.source && <span className="text-xs text-gray-400">({block.source})</span>}
        </a>
      )
  }
}
