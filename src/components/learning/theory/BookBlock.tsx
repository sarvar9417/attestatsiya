import { useState } from 'react'
import {
  AlertTriangle, BookMarked, Calculator, ChevronDown, Compass, Eye, FlaskConical,
  HelpCircle, Library, ListChecks, Microscope, PenTool, Sparkles, Table2, Tags, Target,
} from 'lucide-react'
import type { TheoryBlock } from '../../../data/topicContent'
import InlineText, { plainText } from './InlineText'
import { renderMath } from './renderMath'
import { BOOK_DIAGRAMS } from './BookDiagrams'

/** Qutili bloklarning standart sarlavha, ikonka va rang sinfi.
 *  Manbada quti o'z nomi bilan berilgan bo'lsa (`block.label`), o'sha ishlatiladi. */
const BOX_META: Record<string, { label: string; icon: typeof BookMarked; cls: string }> = {
  definition: { label: 'Ta’rif', icon: BookMarked, cls: 'book-box-definition' },
  exam: { label: 'ATTESTATSIYA uchun muhim', icon: Target, cls: 'book-box-exam' },
  trap: { label: 'Ko‘p uchraydigan xato', icon: AlertTriangle, cls: 'book-box-trap' },
  extra: { label: 'Darslikdan tashqari aniqlashtirish', icon: Sparkles, cls: 'book-box-extra' },
  solved: { label: 'Tushuntiruvchi misol', icon: Calculator, cls: 'book-box-solved' },
  task: { label: 'Ishlanadigan misollar: oddiydan murakkabga', icon: PenTool, cls: 'book-box-task' },
  keywords: { label: 'Tayanch atamalar', icon: Tags, cls: 'book-box-keywords' },
  case: { label: 'Tahlil', icon: Microscope, cls: 'book-box-case' },
  goal: { label: 'Bob maqsadi va o‘rganish natijalari', icon: Compass, cls: 'book-box-goal' },
  summary: { label: 'Bob yakuni', icon: ListChecks, cls: 'book-box-summary' },
  quickcheck: { label: 'Tezkor tekshiruv', icon: HelpCircle, cls: 'book-box-quickcheck' },
  example: { label: 'Misol', icon: Eye, cls: 'book-box-solved' },
  note: { label: 'Eslatma', icon: FlaskConical, cls: 'book-box-extra' },
}

export function headingId(index: number): string {
  return `book-section-${index}`
}

/** Quti tanasi: ichki bloklar yoki oddiy matn. */
function BoxBody({ block }: { block: TheoryBlock }) {
  if (block.children?.length) {
    return (
      <div className="book-box-body">
        {block.children.map((child, i) => <BookBlock key={i} block={child} index={i} nested />)}
      </div>
    )
  }
  return (
    <div className="book-box-body">
      <p className="book-paragraph"><InlineText text={block.content} /></p>
    </div>
  )
}

function Box({ block, kind }: { block: TheoryBlock; kind: string }) {
  const meta = BOX_META[kind] ?? BOX_META.definition
  const Icon = meta.icon
  return (
    <section className={`book-box ${meta.cls}`}>
      <header className="book-box-head">
        <span className="book-box-icon"><Icon size={14} /></span>
        <span className="book-box-label">{block.label || meta.label}</span>
      </header>
      <BoxBody block={block} />
    </section>
  )
}

/** "Javob va izoh" — javobni ko'rishdan oldin o'ylab ko'rish uchun yopiq turadi. */
function AnswersBox({ block }: { block: TheoryBlock }) {
  const [open, setOpen] = useState(false)
  return (
    <section className="book-box book-box-answers">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="book-box-head book-box-head-button"
      >
        <span className="book-box-icon"><Eye size={14} /></span>
        <span className="book-box-label">Javob va izoh</span>
        <span className="book-box-toggle">
          {open ? 'yashirish' : 'ko‘rish'}
          <ChevronDown size={13} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </span>
      </button>
      {open && <BoxBody block={block} />}
    </section>
  )
}

function DataTable({ block }: { block: TheoryBlock }) {
  const headers = block.headers ?? []
  const rows = block.rows ?? []
  return (
    <figure className="book-table-wrap">
      <div className="book-table-head">
        <Table2 size={13} className="shrink-0" />
        <span>Jadval</span>
        <span className="book-table-hint">↔ surib ko‘ring</span>
        <span className="book-table-count">{rows.length} qator</span>
      </div>
      <div className="book-table-scroll">
        <table className="book-table">
          {headers.some(h => h) && (
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} scope="col"><InlineText text={h} /></th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className={ci === 0 ? 'book-table-first' : undefined}>
                    <InlineText text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

function BookList({ block }: { block: TheoryBlock }) {
  const items = block.items ?? []
  if (block.ordered) {
    return (
      <ol className="book-list book-list-ordered">
        {items.map((item, i) => (
          <li key={i}>
            <span className="book-list-num">{i + 1}</span>
            <span className="book-list-text"><InlineText text={item} /></span>
          </li>
        ))}
      </ol>
    )
  }
  return (
    <ul className="book-list">
      {items.map((item, i) => (
        <li key={i}>
          <span className="book-list-dot" aria-hidden="true" />
          <span className="book-list-text"><InlineText text={item} /></span>
        </li>
      ))}
    </ul>
  )
}

function DefList({ block }: { block: TheoryBlock }) {
  return (
    <dl className="book-deflist">
      {(block.terms ?? []).map((t, i) => (
        <div key={i} className="book-deflist-item">
          <dt className="book-deflist-term">{plainText(t.term)}</dt>
          <dd className="book-deflist-body"><InlineText text={t.body} /></dd>
        </div>
      ))}
    </dl>
  )
}

function Formula({ block, accent }: { block: TheoryBlock; accent?: boolean }) {
  return (
    <div className={accent ? 'book-formula book-formula-accent' : 'book-formula'}>
      <div
        className="book-formula-body"
        dangerouslySetInnerHTML={{ __html: renderMath(block.content, true) }}
      />
    </div>
  )
}

function Diagram({ block }: { block: TheoryBlock }) {
  const Component = block.diagram ? BOOK_DIAGRAMS[block.diagram] : undefined
  if (!Component) return null
  return (
    <figure className="book-diagram">
      <Component />
      <figcaption className="book-diagram-figcaption">{block.content}</figcaption>
    </figure>
  )
}

interface Props {
  block: TheoryBlock
  index: number
  nested?: boolean
}

/**
 * "Axborot va axborot jarayonlari" qo'llanmasi tuzilmasidagi bitta blok.
 * Har bir tur kitobdagi mos rangli quti yoki tipografiyada chiziladi.
 */
export default function BookBlock({ block, index, nested }: Props) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 id={nested ? undefined : headingId(index)} className="book-heading">
          <span className="book-heading-rule" aria-hidden="true" />
          <InlineText text={block.content} />
        </h2>
      )

    case 'subheading':
      return (
        <h3 className="book-subheading">
          <InlineText text={block.content} />
        </h3>
      )

    case 'intro':
      return (
        <section className="book-intro">
          <Compass size={16} className="book-intro-icon" />
          <p><InlineText text={block.content} /></p>
        </section>
      )

    case 'source':
      return (
        <section className="book-source">
          <Library size={13} className="shrink-0 mt-0.5" />
          <p><InlineText text={block.content} /></p>
        </section>
      )

    case 'answers':
      return <AnswersBox block={block} />

    case 'definition':
    case 'exam':
    case 'trap':
    case 'extra':
    case 'solved':
    case 'task':
    case 'keywords':
    case 'case':
    case 'goal':
    case 'summary':
    case 'quickcheck':
    case 'note':
    case 'example':
      return <Box block={block} kind={block.type} />

    case 'table':
      return block.rows?.length ? <DataTable block={block} /> : null

    case 'list':
      return <BookList block={block} />

    case 'deflist':
      return <DefList block={block} />

    case 'formula':
      return <Formula block={block} />

    case 'keyformula':
      return <Formula block={block} accent />

    case 'diagram':
      return <Diagram block={block} />

    case 'code':
      return (
        <pre className="book-pre"><code>{block.content}</code></pre>
      )

    case 'text':
    default:
      // faqat manba izidan iborat qism (formuladan keyin qolgan \src)
      if (/^@@[^@]+@@$/.test(block.content.trim())) {
        return (
          <p className="book-src-line">
            <InlineText text={block.content} />
          </p>
        )
      }
      return (
        <p className="book-paragraph">
          <InlineText text={block.content} />
        </p>
      )
  }
}
