import { useState, useMemo, useRef, useCallback } from 'react'
import { Search, Clock, ChevronDown, ChevronUp, Volume2, Bookmark, Eye, EyeOff } from 'lucide-react'
import type { TranscriptSection } from '../../data/30dayChallenge'
import { speakText } from '../../lib/speak'

interface Props {
  transcript: string
  timestamps?: { time: string; text: string }[]
  structuredTranscript?: TranscriptSection[]
}

const SPEAKER_COLORS: Record<string, string> = {
  'Massu': 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  'Fizu': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Waiter': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Assistant': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
}

function getSpeakerColor(speaker: string) {
  return SPEAKER_COLORS[speaker] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}

export default function TranscriptView({ transcript, timestamps, structuredTranscript }: Props) {
  const [expanded, setExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [showKeyOnly, setShowKeyOnly] = useState(false)
  const [bookmarkedLines, setBookmarkedLines] = useState<Set<string>>(new Set())
  const lineRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const sections = structuredTranscript || []

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections
    const q = searchQuery.toLowerCase()
    return sections
      .map(section => ({
        ...section,
        lines: section.lines.filter(
          line =>
            line.text.toLowerCase().includes(q) ||
            (line.speaker && line.speaker.toLowerCase().includes(q)) ||
            (line.timestamp && line.timestamp.includes(q))
        ),
      }))
      .filter(section => section.lines.length > 0)
  }, [sections, searchQuery])

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }, [])

  const scrollToTimestamp = useCallback((time: string) => {
    setActiveTimestamp(time)
    const el = lineRefs.current.get(time)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2')
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2')
      }, 2000)
    }
  }, [])

  const toggleBookmark = useCallback((key: string) => {
    setBookmarkedLines(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const speakLine = useCallback((text: string) => {
    speakText(text)
  }, [])

  const totalLines = useMemo(() => sections.reduce((sum, s) => sum + s.lines.length, 0), [sections])
  const keyLines = useMemo(() => sections.reduce((sum, s) => sum + s.lines.filter(l => l.isKey).length, 0), [sections])

  if (!structuredTranscript || structuredTranscript.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        >
          <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            📖 Transkript
            {timestamps && (
              <span className="text-sm font-normal text-gray-500">({timestamps.length} ta vaqt belgisi)</span>
            )}
          </h3>
          {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>
        {expanded && (
          <div className="px-4 pb-4 space-y-4 animate-slide-down">
            {timestamps && timestamps.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {timestamps.map((ts, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full">
                    <Clock size={10} /> {ts.time}
                  </span>
                ))}
              </div>
            )}
            <div className="max-h-96 overflow-y-auto scrollbar-thin text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
              {transcript}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          📖 Transkript
          <span className="text-sm font-normal text-gray-500">
            ({sections.length} bo'lim, {totalLines} ta gap)
          </span>
        </h3>
        {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 animate-slide-down">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Transkriptda qidirish..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
            {/* Key lines filter */}
            <button
              onClick={() => setShowKeyOnly(!showKeyOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                showKeyOnly
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 border border-primary-200 dark:border-primary-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {showKeyOnly ? <EyeOff size={12} /> : <Eye size={12} />}
              {showKeyOnly ? 'Barchasi' : 'Asosiy gaplar'}
            </button>
          </div>

          {/* Timestamps bar */}
          {timestamps && timestamps.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {timestamps.map((ts, i) => (
                <button
                  key={i}
                  onClick={() => scrollToTimestamp(ts.time)}
                  className={`group relative inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    activeTimestamp === ts.time
                      ? 'bg-primary-500 text-white shadow-md scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-300'
                  }`}
                >
                  <Clock size={10} />
                  {ts.time}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none z-10 max-w-[200px] truncate">
                    {ts.text}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Structured transcript */}
          <div className="space-y-3">
            {filteredSections.map(section => {
              const isCollapsed = collapsedSections.has(section.id)
              const visibleLines = showKeyOnly ? section.lines.filter(l => l.isKey) : section.lines

              if (visibleLines.length === 0) return null

              return (
                <div key={section.id} className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                      {section.icon && <span className="text-lg">{section.icon}</span>}
                      {section.title}
                      <span className="text-xs font-normal text-gray-400">({visibleLines.length})</span>
                    </span>
                    {isCollapsed ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
                  </button>

                  {/* Section lines */}
                  {!isCollapsed && (
                    <div className="px-4 py-3 space-y-2">
                      {visibleLines.map((line, lineIdx) => {
                        const lineKey = `${section.id}-${lineIdx}`
                        const isBookmarked = bookmarkedLines.has(lineKey)
                        const isHighlighted = activeTimestamp === line.timestamp
                        const isStudent = line.speaker === 'Fizu' || line.speaker === 'You'

                        return (
                          <div
                            key={lineIdx}
                            ref={el => { if (line.timestamp && el) lineRefs.current.set(line.timestamp, el) }}
                            className={`flex ${isStudent ? 'justify-end' : 'justify-start'} transition-all ${
                              isHighlighted ? 'opacity-100' : ''
                            }`}
                          >
                            <div className={`max-w-[90%] group relative ${isHighlighted ? 'ring-2 ring-primary-500 rounded-xl' : ''}`}>
                              {/* Bubble */}
                              <div className={`rounded-xl px-3.5 py-2 ${
                                isStudent
                                  ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-tr-sm'
                                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-tl-sm'
                              }`}>
                                {/* Speaker + Timestamp row */}
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getSpeakerColor(line.speaker || '')}`}>
                                    {line.speaker}
                                  </span>
                                  {line.timestamp && (
                                    <button
                                      onClick={() => scrollToTimestamp(line.timestamp!)}
                                      className="flex items-center gap-0.5 text-[10px] font-mono text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                      <Clock size={9} />
                                      {line.timestamp}
                                    </button>
                                  )}
                                </div>
                                {/* Text */}
                                <p className={`text-sm leading-relaxed ${
                                  line.isKey
                                    ? 'text-gray-900 dark:text-gray-100 font-medium'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {line.text}
                                </p>
                              </div>
                              {/* Actions — show on hover */}
                              <div className="flex items-center justify-end gap-0.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => speakLine(line.text)}
                                  className="p-1 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
                                  title="Eshitish"
                                >
                                  <Volume2 size={11} />
                                </button>
                                <button
                                  onClick={() => toggleBookmark(lineKey)}
                                  className={`p-1 rounded-md transition-all ${
                                    isBookmarked
                                      ? 'text-amber-500'
                                      : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                                  }`}
                                  title="Saqlash"
                                >
                                  <Bookmark size={11} fill={isBookmarked ? 'currentColor' : 'none'} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
            <span>📊 {totalLines} ta gap</span>
            <span>⭐ {keyLines} ta asosiy</span>
            <span>⏱ ~{Math.ceil(transcript.split(' ').length / 150)} daqiqa</span>
            {bookmarkedLines.size > 0 && (
              <span>🔖 {bookmarkedLines.size} ta belgilangan</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
