import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight, Check, ChevronLeft, ChevronRight, GraduationCap, List, Target, X,
} from 'lucide-react'
import type { TheoryBlock, TopicContent } from '../../../data/topicContent'
import BookBlock from './BookBlock'
import { plainText } from './InlineText'

/** Bir bo'lim — kitobdagi bitta \section va unga tegishli bloklar. */
interface Section {
  title: string
  blocks: TheoryBlock[]
}

/**
 * Bobni kitobdagi bo'limlar bo'yicha sahifalarga ajratadi.
 * Birinchi \section dan oldingi bloklar (kirish qutisi) birinchi sahifaga qo'shiladi.
 */
export function splitSections(theory: TheoryBlock[]): Section[] {
  const sections: Section[] = []
  let lead: TheoryBlock[] = []

  for (const block of theory) {
    if (block.type === 'heading') {
      sections.push({ title: plainText(block.content), blocks: [block] })
      continue
    }
    if (sections.length === 0) lead.push(block)
    else sections[sections.length - 1].blocks.push(block)
  }

  if (sections.length === 0) return [{ title: '', blocks: lead }]
  if (lead.length > 0) {
    sections[0] = { ...sections[0], blocks: [...lead, ...sections[0].blocks] }
    lead = []
  }
  return sections
}

interface Props {
  content: TopicContent
  /** Mavzudagi test savollari soni. */
  questionCount: number
  /** Ilova (formulalar varag'i, lug'at, manbalar) — test ko'zda tutilmagan. */
  isAppendix?: boolean
  /** Oxirgi bo'lim o'qilgach: testni boshlash yoki mavzuni yakunlash. */
  onFinishReading: () => void
  /** O'qilgan bo'limlar ulushi (0–100). */
  onProgress?: (percent: number) => void
  nextTopic?: { id: string; title: string } | null
  onOpenNextTopic?: () => void
}

/**
 * Bobni bo'lim-bo'lim o'qish rejimi.
 *
 * Uzun boblar (30–60 blok) bitta scrollda emas, kitobdagi \section chegarasi
 * bo'yicha sahifalanadi: yuqorida joriy holat va mundarija, pastda faqat
 * "Oldingi / Keyingi", oxirgi bo'limda esa bitta aniq davom etish yo'li.
 */
export default function BookReader({
  content, questionCount, isAppendix, onFinishReading, onProgress, nextTopic, onOpenNextTopic,
}: Props) {
  const sections = useMemo(() => splitSections(content.theory), [content.theory])
  const [index, setIndex] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]))
  const [outlineOpen, setOutlineOpen] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  const total = sections.length
  const isLast = index === total - 1
  const hasTest = questionCount > 0

  // mavzu almashsa — boshidan
  useEffect(() => {
    setIndex(0)
    setVisited(new Set([0]))
    setOutlineOpen(false)
    firstRender.current = true
  }, [content.subtopicId])

  useEffect(() => {
    onProgress?.(Math.round((visited.size / total) * 100))
  }, [visited, total, onProgress])

  const go = useCallback((next: number) => {
    const target = Math.min(Math.max(next, 0), total - 1)
    setIndex(current => {
      if (current === target) return current
      firstRender.current = false
      return target
    })
    setVisited(prev => (prev.has(target) ? prev : new Set(prev).add(target)))
    setOutlineOpen(false)
  }, [total])

  // sahifa almashganda o'qish boshiga qaytamiz (scroll konteyneri — <main>)
  useEffect(() => {
    if (firstRender.current) return
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    headingRef.current?.focus({ preventScroll: true })
  }, [index])

  // klaviatura bilan boshqarish
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (event.key === 'Escape') { setOutlineOpen(false); return }
      if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index])

  const section = sections[index]
  const paginated = total > 1

  return (
    <div ref={topRef} className="scroll-mt-20">
      {paginated && (
        <div className="book-navbar">
          <div className="book-navbar-dots" role="tablist" aria-label="Bob bo‘limlari">
            {sections.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${i + 1}-bo‘lim: ${s.title}`}
                title={s.title}
                onClick={() => go(i)}
                className={`book-navbar-dot${i === index ? ' is-current' : visited.has(i) ? ' is-visited' : ''}`}
              />
            ))}
          </div>
          <span className="book-navbar-count">
            <strong>{index + 1}</strong>/{total} bo‘lim
          </span>
          <span className="book-navbar-title">{section.title}</span>
          <button
            type="button"
            onClick={() => setOutlineOpen(open => !open)}
            aria-expanded={outlineOpen}
            className="book-navbar-button"
          >
            {outlineOpen ? <X size={13} /> : <List size={13} />}
            <span className="hidden sm:inline">Mundarija</span>
          </button>
        </div>
      )}

      {outlineOpen && (
        <nav className="book-outline" aria-label="Bob mundarijasi">
          <ol className="book-outline-list">
            {sections.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === index ? 'true' : undefined}
                  className={`book-outline-link${i === index ? ' is-current' : ''}`}
                >
                  <span className="book-outline-num">
                    {visited.has(i) && i !== index ? <Check size={12} /> : i + 1}
                  </span>
                  <span className="book-outline-text">{s.title || content.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div ref={headingRef} tabIndex={-1} className="book-chapter focus:outline-none">
        {section.blocks.map((block, i) => (
          <div key={`${index}-${i}`} data-block={block.type}>
            <BookBlock block={block} index={i} />
          </div>
        ))}
      </div>

      {isLast ? (
        <section className="book-finish">
          <div className="book-finish-badge">
            <Check size={18} />
          </div>
          <p className="book-finish-title">
            {paginated ? 'Bob o‘qib bo‘lindi' : 'Mavzu o‘qib bo‘lindi'}
          </p>
          <p className="book-finish-sub">
            {hasTest
              ? `Endi ${questionCount} ta savol bilan o‘zingizni tekshiring`
              : isAppendix
                ? 'Bu ilova takrorlash uchun — test ko‘zda tutilmagan'
                : 'Bu bob uchun test hali qo‘shilmagan'}
          </p>

          <button type="button" onClick={onFinishReading} className="book-finish-cta">
            {hasTest ? <Target size={16} /> : <Check size={16} />}
            {hasTest ? 'Testni boshlash' : 'Mavzuni yakunlash'}
            {hasTest && <span className="book-finish-cta-meta">{questionCount} ta savol</span>}
            <ArrowRight size={16} />
          </button>

          <div className="book-finish-links">
            {paginated && (
              <button type="button" onClick={() => go(index - 1)} className="book-finish-link">
                <ChevronLeft size={13} /> Oldingi bo‘lim
              </button>
            )}
            {nextTopic && onOpenNextTopic && (
              <button type="button" onClick={onOpenNextTopic} className="book-finish-link">
                <GraduationCap size={13} />
                <span className="truncate">Keyingi mavzu: {nextTopic.title}</span>
                <ChevronRight size={13} />
              </button>
            )}
          </div>
        </section>
      ) : (
        <nav
          className={`book-pager${index === 0 ? ' is-single' : ''}`}
          aria-label="Bo‘limlar orasida harakat"
        >
          {index > 0 && (
            <button type="button" onClick={() => go(index - 1)} className="book-pager-button">
              <ChevronLeft size={15} />
              <span className="book-pager-body">
                <span className="book-pager-label">Oldingi</span>
                <span className="book-pager-title">{sections[index - 1].title}</span>
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="book-pager-button is-next"
          >
            <span className="book-pager-body">
              <span className="book-pager-label">Keyingi</span>
              <span className="book-pager-title">{sections[index + 1].title}</span>
            </span>
            <ChevronRight size={15} />
          </button>
        </nav>
      )}
    </div>
  )
}
