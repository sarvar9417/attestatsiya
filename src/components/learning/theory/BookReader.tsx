import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight, Check, ChevronLeft, ChevronRight, GraduationCap, List, Target, X,
} from 'lucide-react'
import type { TheoryBlock, TopicContent } from '../../../data/topicContent'
import BookBlock from './BookBlock'
import { plainText } from './InlineText'

/** Bir bo'lim — kitobdagi bitta \section va unga tegishli bloklar. */
export interface Section {
  title: string
  blocks: TheoryBlock[]
  continued?: boolean
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

/**
 * Eski (M02–M16) darslarni M01 dagi book-reader shakliga moslaydi.
 * Hech bir nazariya bloki qo‘shilmaydi, o‘chirilmaydi yoki tartibi o‘zgarmaydi.
 * Sarlavhadan boshlangan bo‘limlar alohida qoladi, uzun bo‘limlar mobil
 * o‘qish uchun ixcham bo‘laklarga ajratiladi.
 */
export function splitAdaptiveSections(theory: TheoryBlock[], pageSize = 3): Section[] {
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new Error('Invalid section size')
  if (theory.length === 0) return splitSections(theory)
  const sections: Section[] = []
  for (const group of splitSections(theory)) {
    for (let start = 0; start < group.blocks.length;) {
      let end = Math.min(start + pageSize, group.blocks.length)
      // Kirishdan keyingi sarlavha sahifa oxirida yakka qolmasin.
      if (end < group.blocks.length && group.blocks[end - 1].type === 'heading') end++
      const part = group.blocks.slice(start, end)
      const number = sections.length + 1
      const title = group.title
        ? (start === 0 ? group.title : `${group.title} — davomi`)
        : `${number}-bo‘lim`
      sections.push({ title, blocks: part })
      start = end
    }
  }
  return sections
}

/**
 * Butun mavzuni mazmunli sahifalarga jamlaydi: kichik sarlavhali bo‘limlarni
 * birlashtiradi, bitta tushuntirish va uning kodi/misolini ajratmaydi.
 * Bloklarning manbaviy tartibi va mazmuni o‘zgarmaydi; backend reviziyasiga
 * tegilmaydi. maxBlocks — qisqa matn uchun qattiq chegara emas.
 */
export function splitBalancedSections(
  theory: TheoryBlock[],
  maxBlocks = 16,
  maxCharacters = 6500,
): Section[] {
  if (!Number.isInteger(maxBlocks) || maxBlocks < 1) throw new Error('Invalid block limit')
  if (!Number.isInteger(maxCharacters) || maxCharacters < 1) throw new Error('Invalid character limit')
  if (theory.length === 0) return splitSections(theory)

  const minCharacters = Math.min(1200, Math.max(1, Math.floor(maxCharacters / 3)))
  const charactersOf = (blocks: TheoryBlock[]) => blocks.reduce((sum, block) => (
    sum + block.content.length
    + (block.items?.join('').length ?? 0)
    + (block.rows?.flat().join('').length ?? 0)
  ), 0)
  const parts: Section[] = []

  for (const group of splitSections(theory)) {
    const groupTitle = group.title || `${parts.length + 1}-bo‘lim`
    for (let start = 0; start < group.blocks.length;) {
      let end = start
      let characters = 0

      while (end < group.blocks.length) {
        const next = group.blocks[end]
        const nextCharacters = charactersOf([next])
        const previous = group.blocks[end - 1]
        // Misolning kodi va sarlavhaning birinchi izohi bitta sahifada qolsin.
        const companion = (previous?.type === 'example' || previous?.type === 'solved'
          || previous?.type === 'task') && next.type === 'code'
        const headingNeedsExplanation = end === start + 1 && group.blocks[start]?.type === 'heading'
        const canBreak = end > start && !companion && !headingNeedsExplanation
        if (canBreak && (
          (characters >= minCharacters
            && (characters + nextCharacters > maxCharacters || end - start >= maxBlocks))
          || end - start >= maxBlocks * 2
        )) break

        characters += nextCharacters
        end++
      }

      const continued = start > 0
      parts.push({
        title: continued ? `${groupTitle} — davomi` : groupTitle,
        blocks: group.blocks.slice(start, end),
        continued,
      })
      start = end
    }
  }

  // Ketma-ket joylashgan juda qisqa kichik bo‘limlar bitta sahifa bo‘lsin.
  // Sarlavhalar blocks ichida qoladi — mundarijadan kontent yo‘qolmaydi.
  const pages: Section[] = []
  for (const part of parts) {
    const previous = pages[pages.length - 1]
    if (previous && !part.continued
      && charactersOf(previous.blocks) < minCharacters
      && charactersOf([...previous.blocks, ...part.blocks]) <= maxCharacters
      && previous.blocks.length + part.blocks.length <= maxBlocks * 2
    ) {
      previous.blocks.push(...part.blocks)
    } else {
      pages.push({ ...part, blocks: [...part.blocks] })
    }
  }

  // Oxirgi 1–2 blokdan iborat «davomi» sahifasini yolg‘iz qoldirmang.
  if (pages.length > 1) {
    const last = pages[pages.length - 1]
    const before = pages[pages.length - 2]
    const sameHeading = last.continued && before.blocks.some(block =>
      block.type === 'heading' && plainText(block.content) === last.title.replace(/ — davomi$/, ''))
    if (charactersOf(last.blocks) < minCharacters
      && (sameHeading || charactersOf(before.blocks) < minCharacters)
      && charactersOf([...before.blocks, ...last.blocks]) <= maxCharacters * 1.25
      && before.blocks.length + last.blocks.length <= maxBlocks * 2
    ) {
      before.blocks.push(...last.blocks)
      pages.pop()
    }
  }

  return pages
}

interface Props {
  content: TopicContent
  /** Mavzudagi test savollari soni. */
  questionCount: number
  /** Ilova (formulalar varag'i, lug'at, manbalar) — test ko'zda tutilmagan. */
  isAppendix?: boolean
  /** Published lesson tests are compulsory; never offer a false completion action while preflight loads. */
  requireTest?: boolean
  /** Oxirgi bo'lim o'qilgach: testni boshlash yoki mavzuni yakunlash. */
  onFinishReading: () => void
  /** O'qilgan bo'limlar ulushi (0–100). */
  onProgress?: (percent: number) => void
  previousTopic?: { id: string; title: string } | null
  onOpenPreviousTopic?: () => void
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
  content, questionCount, isAppendix, requireTest = false, onFinishReading, onProgress,
  previousTopic, onOpenPreviousTopic, nextTopic, onOpenNextTopic,
}: Props) {
  const sections = useMemo(() => splitBalancedSections(content.theory), [content.theory])
  const [pageIndex, setIndex] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]))
  const [outlineOpen, setOutlineOpen] = useState(false)
  const [readingContent, setReadingContent] = useState(content)
  // Reset before rendering: an effect runs too late when a shorter lesson
  // replaces a longer one and sections[index] no longer exists.
  const contentChanged = readingContent.subtopicId !== content.subtopicId
    || readingContent.theory !== content.theory || readingContent.source !== content.source
  const index = contentChanged ? 0 : pageIndex
  if (contentChanged) {
    setReadingContent(content)
    setIndex(0)
    setVisited(new Set([0]))
    setOutlineOpen(false)
  }
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

  const section = sections[Math.min(index, total - 1)]
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
        {section.continued && section.blocks[0]?.type !== 'heading' && (
          <h2 className="book-heading book-continuation-heading">{section.title}</h2>
        )}
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
            {visited.size < total ? 'Bobning oxirgi bo‘limi' : paginated ? 'Bob o‘qib bo‘lindi' : 'Mavzu o‘qib bo‘lindi'}
          </p>
          <p className="book-finish-sub">
            {hasTest
              ? `Endi ${questionCount} ta savol bilan o‘zingizni tekshiring`
              : requireTest
                ? 'Testning tayyorligi tekshirilmoqda. Bir oz kuting yoki sahifani yangilang.'
                : isAppendix
                  ? 'Bu ilova takrorlash uchun — test ko‘zda tutilmagan'
                  : 'Bu bob uchun test hali qo‘shilmagan'}
          </p>

          <button type="button" disabled={requireTest && !hasTest} onClick={onFinishReading} className="book-finish-cta">
            {hasTest ? <Target size={16} /> : <Check size={16} />}
            {hasTest ? 'Testni boshlash' : requireTest ? 'Test tayyorligi kutilmoqda' : 'Mavzuni yakunlash'}
            {hasTest && <span className="book-finish-cta-meta">{questionCount} ta savol</span>}
            <ArrowRight size={16} />
          </button>

          <div className="book-finish-links">
            {previousTopic && onOpenPreviousTopic && (
              <button type="button" onClick={onOpenPreviousTopic} className="book-finish-link">
                <ChevronLeft size={13} />
                <span className="truncate">Oldingi mavzu: {previousTopic.title}</span>
              </button>
            )}
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
