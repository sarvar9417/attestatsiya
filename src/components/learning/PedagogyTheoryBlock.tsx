import type { ReactNode } from 'react'
import { AlertTriangle, BookOpen, BookOpenCheck, FileText, GraduationCap, Lightbulb, ListChecks, Target } from 'lucide-react'
import type { TheoryBlock as TheoryBlockData } from '../../data/topicContent'

/** Render source Markdown emphasis as React nodes, never as injected HTML. */
export function PedagogyInline({ text }: { text: string }): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('__') && part.endsWith('__')) {
      return <em key={index}>{part.slice(2, -2)}</em>
    }
    return part
  })
}

const panel = 'rounded-2xl border p-5 shadow-sm sm:p-6'
const mutedText = 'text-[15px] leading-7 text-gray-700 dark:text-gray-200'

export default function PedagogyTheoryBlock({ block }: { block: TheoryBlockData }) {
  if (block.type === 'heading') {
    return (
      <h3 className="flex items-center gap-3 border-b border-gray-200 pb-3 pt-5 text-lg font-bold leading-7 text-gray-950 dark:border-gray-800 dark:text-white sm:text-xl">
        <span className="h-6 w-1 shrink-0 rounded-full bg-indigo-500" aria-hidden="true" />
        <PedagogyInline text={block.content} />
      </h3>
    )
  }

  if (block.type === 'subheading') {
    return <h4 className="pt-3 text-base font-bold leading-7 text-indigo-800 dark:text-indigo-200"><PedagogyInline text={block.content} /></h4>
  }

  if (block.type === 'source') {
    return (
      <aside className="flex gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-6 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400" aria-label="Foydalanilgan manba">
        <FileText className="mt-1 shrink-0" size={15} aria-hidden="true" />
        <span><PedagogyInline text={block.content.replace(/^\*\*Manba(?: izi|lar)?\s*:\*\*/i, 'Manba:')} /></span>
      </aside>
    )
  }

  if (block.type === 'table') {
    const headers = block.headers?.length ? block.headers : block.content.split('\n')[0].split('|').filter(Boolean).map(x => x.trim())
    const rows = block.rows?.length ? block.rows : block.content.split('\n').slice(2).map(line => line.split('|').filter(Boolean).map(x => x.trim()))
    return (
      <section className="overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-sm dark:border-teal-900 dark:bg-gray-900" aria-label="Tushunchalarni taqqoslash jadvali">
        <div className="flex items-center gap-2 border-b border-teal-100 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
          <ListChecks size={17} aria-hidden="true" /> Taqqoslash jadvali
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/70">
              <tr>{headers.map((cell, i) => <th key={i} scope="col" className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200"><PedagogyInline text={cell} /></th>)}</tr>
            </thead>
            <tbody>
              {rows.map((cells, i) => <tr key={i} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                {cells.map((cell, j) => <td key={j} className={('px-4 py-3 align-top leading-6 ') + (j === 0 ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300')}><PedagogyInline text={cell} /></td>)}
              </tr>)}
            </tbody>
          </table>
        </div>
      </section>
    )
  }

  if (block.type === 'list') {
    const Tag = block.ordered ? 'ol' : 'ul'
    return (
      <div className={panel + ' border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'}>
        <Tag className={'space-y-3 ' + (block.ordered ? 'list-decimal pl-6 marker:font-bold marker:text-indigo-600' : 'list-disc pl-5 marker:text-indigo-500')}>
          {(block.items || block.content.split('\n')).map((item, i) => <li key={i} className={mutedText}><PedagogyInline text={item} /></li>)}
        </Tag>
      </div>
    )
  }

  const isGoal = block.type === 'goal'
  const isExample = block.type === 'example'
  const isTrap = block.type === 'trap' || block.type === 'exam'
  const isDefinition = block.type === 'definition'
  const isNote = block.type === 'note'
  const style = isGoal
    ? 'border-sky-200 bg-sky-50/70 dark:border-sky-900 dark:bg-sky-950/20'
    : isExample
      ? 'border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20'
      : isTrap
        ? 'border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/20'
        : isDefinition
          ? 'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/20'
          : isNote
            ? 'border-teal-200 bg-teal-50/50 dark:border-teal-900 dark:bg-teal-950/20'
            : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
  const Icon = isGoal ? Target : isExample ? Lightbulb : isTrap ? AlertTriangle : isDefinition ? BookOpenCheck : isNote ? GraduationCap : BookOpen
  const label = isGoal ? 'Nimani o‘rganasiz?' : isExample ? 'Tushunarli misol' : isTrap ? 'Attestatsiyada ehtiyot bo‘ling' : isDefinition ? 'Asosiy ta’rif' : isNote ? 'Muhim eslatma' : null
  return (
    <section className={panel + ' ' + style}>
      {label && <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-200"><Icon size={17} aria-hidden="true" /> {label}</div>}
      <p className={mutedText}><PedagogyInline text={block.content} /></p>
    </section>
  )
}
