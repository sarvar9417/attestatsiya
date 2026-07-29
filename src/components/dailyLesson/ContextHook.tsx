import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Headphones, Eye, EyeOff, Play, Check } from 'lucide-react'
import { speak, stopSpeaking, isSpeaking as isTTSpeaking } from '../../lib/tts'
import { monitoring } from '../../lib/monitoring'

// ─── Transcript split helpers ───────────────────────────────────────────

function splitTranscript(text: string, isExamples: boolean): string[] {
  if (isExamples) {
    return text.split('\n').filter(Boolean)
  }
  // Split by sentence boundaries or double newlines
  const byParagraph = text.split(/\n\s*\n/).filter(Boolean)
  if (byParagraph.length > 1) return byParagraph

  // Single paragraph — split by sentences (max 2-3 per section)
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text]
  const chunks: string[] = []
  for (let i = 0; i < sentences.length; i += 3) {
    chunks.push(sentences.slice(i, i + 3).join(' ').trim())
  }
  return chunks.filter(Boolean)
}

// ─── Loading spinner ────────────────────────────────────────────────────

function ListeningSpinner() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

// ─── Props ──────────────────────────────────────────────────────────────

interface ContextHookProps {
  transcript: string
  isExamples?: boolean
}

// ─── Main Component ─────────────────────────────────────────────────────

export function ContextHook({ transcript, isExamples = false }: ContextHookProps) {
  const [revealed, setRevealed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeSectionIdx, setActiveSectionIdx] = useState<number | null>(null)
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set())
  const sections = useMemo(() => splitTranscript(transcript, isExamples), [transcript, isExamples])
  const sectionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // ── Play a specific section ──────────────────────────────────────────

  const playSection = useCallback(async (idx: number) => {
    if (isTTSpeaking()) {
      stopSpeaking()
    }

    const sectionText = sections[idx]
    if (!sectionText) return

    setIsPlaying(true)
    setActiveSectionIdx(idx)

    try {
      await speak(sectionText, { rate: isExamples ? 0.85 : 0.9 })
      setCompletedSections(prev => {
        const next = new Set(prev)
        next.add(idx)
        return next
      })
      // Auto-play next section
      if (idx < sections.length - 1) {
        const nextIdx = idx + 1
        setActiveSectionIdx(nextIdx)
        await speak(sections[nextIdx], { rate: isExamples ? 0.85 : 0.9 })
        setCompletedSections(prev => {
          const nextSet = new Set(prev)
          nextSet.add(nextIdx)
          return nextSet
        })
      } else {
        setActiveSectionIdx(null)
      }
    } catch {
      monitoring.captureMessage('TTS playback failed or was interrupted', 'warn')
    } finally {
      setIsPlaying(false)
      setActiveSectionIdx(null)
    }
  }, [sections, isExamples])

  // ── Play all from start ─────────────────────────────────────────────

  const playAll = useCallback(async () => {
    if (isTTSpeaking()) {
      stopSpeaking()
    }
    setCompletedSections(new Set())

    setIsPlaying(true)
    for (let i = 0; i < sections.length; i++) {
      setActiveSectionIdx(i)
      try {
        await speak(sections[i], { rate: isExamples ? 0.85 : 0.9 })
        setCompletedSections(prev => {
          const next = new Set(prev)
          next.add(i)
          return next
        })
      } catch {
        break
      }
    }
    setIsPlaying(false)
    setActiveSectionIdx(null)
  }, [sections, isExamples])

  // ── Cleanup on unmount ──────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (isTTSpeaking()) stopSpeaking()
    }
  }, [])

  // ── Derived values ──────────────────────────────────────────────────

  const completedCount = completedSections.size
  const audioLabel = isExamples
    ? 'Misol gaplarni tinglang'
    : 'Avval audio yozuvni tinglang'

  // ── Toggle reveal ───────────────────────────────────────────────────

  function toggleReveal() {
    setRevealed(prev => !prev)
  }

  // ── Render ──────────────────────────────────────────────────────────

  // Bo'sh transcript — hech narsa ko'rsatmaymiz (hooks chaqirilgandan keyin)
  if (!transcript?.trim()) return null

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 animate-slide-up ${
      isPlaying
        ? 'border-indigo-400 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30'
        : completedCount === sections.length && sections.length > 0
        ? 'border-emerald-300 dark:border-emerald-700'
        : 'border-dashed border-indigo-300 dark:border-indigo-700'
    } bg-gradient-to-br from-indigo-50/80 to-white dark:from-indigo-900/20 dark:to-gray-800/50`}>
      {/* ── HEADER ── */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isPlaying
              ? 'bg-indigo-100 dark:bg-indigo-800/50'
              : completedCount === sections.length && sections.length > 0
              ? 'bg-emerald-100 dark:bg-emerald-900/30'
              : 'bg-indigo-100 dark:bg-indigo-800/30'
          }`}>
            <Headphones size={20} className={
              isPlaying
                ? 'text-indigo-600 animate-pulse'
                : completedCount === sections.length && sections.length > 0
                ? 'text-emerald-600'
                : 'text-indigo-500'
            } />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
              {isExamples ? '🎯 Avval misol gaplarni tinglang' : '🎯 Avval tinglang — keyin o\'rganing'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isExamples
                ? 'Grammatika qoidasini o\'qishdan oldin misol gaplarni tinglang. Miyangiz naqshni o\'zi topadi.'
                : 'Audio yozuvni tinglang va matnni faqat kerak bo\'lganda oching. Bu usul eshitish orqali tushunishni rivojlantiradi.'
              }
            </p>
          </div>
        </div>

        {/* ── PROGRESS INDICATOR ── */}
        {sections.length > 1 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / sections.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 shrink-0">
              {completedCount}/{sections.length}
            </span>
          </div>
        )}

        {/* ── BIG PLAY BUTTON ── */}
        {!isPlaying ? (
          <button
            onClick={playAll}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white
              shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30
              hover:shadow-xl hover:shadow-indigo-300/50 dark:hover:shadow-indigo-800/40
              hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={20} className="text-white ml-0.5" fill="white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">{audioLabel}</p>
                <p className="text-xs text-white/70">
                  {sections.length > 1 ? `${sections.length} ta qism` : '1 ta qism'}
                  {completedCount > 0 && completedCount < sections.length && ` · ${completedCount}/${sections.length} tugallandi`}
                  {completedCount === sections.length && sections.length > 0 && ' ✅ Barchasi tinglandi'}
                </p>
              </div>
            </div>
          </button>
        ) : (
          <button
            onClick={() => { stopSpeaking(); setIsPlaying(false); setActiveSectionIdx(null) }}
            className="w-full rounded-xl bg-indigo-100 dark:bg-indigo-800/40 border-2 border-indigo-300 dark:border-indigo-700 p-4 text-center
              hover:bg-indigo-200 dark:hover:bg-indigo-800/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-200 dark:bg-indigo-700/50 flex items-center justify-center">
                <ListeningSpinner />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                  Tinglanmoqda...
                </p>
                <p className="text-xs text-indigo-500 dark:text-indigo-400">
                  {activeSectionIdx !== null ? `Qism ${activeSectionIdx + 1}/${sections.length}` : ''} · Bosing → to'xtatish
                </p>
              </div>
            </div>
          </button>
        )}

        {/* ── TRANSCRIPT ACCORDION (visible when revealed) ── */}
        {!revealed ? (
          <button
            onClick={toggleReveal}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
              text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800
              border border-indigo-200 dark:border-indigo-700
              hover:bg-indigo-50 dark:hover:bg-indigo-900/30
              transition-all hover:shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Eye size={14} />
            Matnni ko'rsatish
          </button>
        ) : (
          <button
            onClick={toggleReveal}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
              text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-all hover:shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <EyeOff size={14} />
            Matnni yashirish
          </button>
        )}
      </div>

      {/* ── ACCORDION SECTIONS ── */}
      {revealed && (
        <div className="border-t border-indigo-100 dark:border-indigo-800/50 divide-y divide-indigo-50 dark:divide-indigo-900/30">
          {sections.map((section, idx) => {
            const isActive = activeSectionIdx === idx
            const isCompleted = completedSections.has(idx)
            return (
              <button
                key={idx}
                ref={el => { sectionRefs.current[idx] = el }}
                onClick={() => {
                  if (isActive) {
                    stopSpeaking()
                    setActiveSectionIdx(null)
                    setIsPlaying(false)
                  } else {
                    playSection(idx)
                  }
                }}
                disabled={isPlaying && !isActive}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all cursor-pointer
                  ${isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/30'
                    : isCompleted
                    ? 'bg-emerald-50/50 dark:bg-emerald-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }
                  ${isPlaying && !isActive ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {/* Section number badge */}
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${isActive
                    ? 'bg-indigo-500 text-white'
                    : isCompleted
                    ? 'bg-emerald-400 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check size={12} /> : isActive ? <ListeningSpinner /> : idx + 1}
                </span>

                {/* Section text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed transition-colors ${
                    isActive
                      ? 'text-indigo-700 dark:text-indigo-300 font-medium'
                      : isCompleted
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {section}
                  </p>
                </div>

                {/* Play icon */}
                <span className={`shrink-0 w-5 h-5 flex items-center justify-center transition-all ${
                  isActive
                    ? 'text-indigo-500 rotate-0'
                    : 'text-gray-300 dark:text-gray-600 group-hover:text-indigo-400'
                }`}>
                  {isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  ) : (
                    <Play size={12} className="ml-0.5" fill="currentColor" />
                  )}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
