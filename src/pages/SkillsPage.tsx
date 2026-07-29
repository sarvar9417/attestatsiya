import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import type { TranslationStrings } from '../i18n/types'
import {
  Mic, BookOpen, PenLine, Headphones, Languages, BookMarked,
  ChevronRight, Sparkles, BarChart3, Filter,
  ClipboardList, MessageSquare, MessageCircle, AudioLines, Sword,
  MessagesSquare,
} from 'lucide-react'
import { SEED_WORDS } from '../data/vocabularyWords'
import { GRAMMAR_TOPICS } from '../data/grammar'
import { READING_TEXTS } from '../data/reading/textsData'
import { LISTENING_LESSONS } from '../data/listeningLessons'
import { SPEAKING_PROMPTS } from '../data/speakingPrompts'
import { WRITING_PROMPTS } from '../data/writingPrompts'
import { useStore } from '../store/useStore'

// ── Types ─────────────────────────────────────────────────────────────────────

type SkillKey = 'speaking' | 'reading' | 'writing' | 'listening' | 'grammar' | 'vocabulary'
type Level = 'A1' | 'A2' | 'B1' | 'B1+' | 'B2'
const ALL_LEVELS: Level[] = ['A1', 'A2', 'B1', 'B1+', 'B2']

interface SkillCardData {
  key: SkillKey
  icon: React.ElementType
  label: string
  description: string
  gradient: string
  iconBg: string
  iconColor: string
  accentColor: string
  route: string
  getCounts: (level: Level) => number
  getTotal: () => number
}

// ── Level config with unique colors ──────────────────────────────────────────

const LEVEL_CONFIG: Record<Level, { color: string; bg: string; bar: string; ring: string }> = {
  'A1':  { color: 'text-gray-500 dark:text-gray-400',  bg: 'bg-gray-100 dark:bg-gray-700',       bar: 'bg-gray-400',          ring: 'ring-gray-300' },
  'A2':  { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800',      bar: 'bg-slate-500',          ring: 'ring-slate-300' },
  'B1':  { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40', bar: 'bg-emerald-500',   ring: 'ring-emerald-300' },
  'B1+': { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40',  bar: 'bg-amber-500',         ring: 'ring-amber-300' },
  'B2':  { color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/40', bar: 'bg-purple-500',     ring: 'ring-purple-300' },
}

// ── Skill definitions (factory — needs t() from component) ───────────────────

function buildSkillCards(t: (k: keyof TranslationStrings, params?: Record<string, string>) => string): SkillCardData[] {
  return [
    {
      key: 'speaking',
      icon: Mic,
      label: t('skills.skillSpeaking'),
      description: t('skills.skillSpeakingDesc'),
      gradient: 'from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20',
      iconBg: 'bg-rose-100 dark:bg-rose-900/30',
      iconColor: 'text-rose-600',
      accentColor: 'bg-rose-400',
      route: '/speaking',
      getCounts: (level) => SPEAKING_PROMPTS.filter((p) => p.level === level).length,
      getTotal: () => SPEAKING_PROMPTS.length,
    },
    {
      key: 'reading',
      icon: BookOpen,
      label: t('skills.skillReading'),
      description: t('skills.skillReadingDesc'),
      gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600',
      accentColor: 'bg-emerald-400',
      route: '/reading',
      getCounts: (level) => READING_TEXTS.filter((t) => t.level === level).length,
      getTotal: () => READING_TEXTS.length,
    },
    {
      key: 'writing',
      icon: PenLine,
      label: t('skills.skillWriting'),
      description: t('skills.skillWritingDesc'),
      gradient: 'from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20',
      iconBg: 'bg-violet-100 dark:bg-violet-900/30',
      iconColor: 'text-violet-600',
      accentColor: 'bg-violet-400',
      route: '/writing',
      getCounts: (level) => WRITING_PROMPTS.filter((p) => p.level === level).length,
      getTotal: () => WRITING_PROMPTS.length,
    },
    {
      key: 'listening',
      icon: Headphones,
      label: t('skills.skillListening'),
      description: t('skills.skillListeningDesc'),
      gradient: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600',
      accentColor: 'bg-orange-400',
      route: '/listening',
      getCounts: (level) => LISTENING_LESSONS.filter((l) => l.level === level).length,
      getTotal: () => LISTENING_LESSONS.length,
    },
    {
      key: 'grammar',
      icon: Languages,
      label: t('skills.skillGrammar'),
      description: t('skills.skillGrammarDesc'),
      gradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600',
      accentColor: 'bg-blue-400',
      route: '/lesson',
      getCounts: (level) => GRAMMAR_TOPICS.filter((t) => t.level === level).length,
      getTotal: () => GRAMMAR_TOPICS.length,
    },
    {
      key: 'vocabulary',
      icon: BookMarked,
      label: t('skills.skillVocabulary'),
      description: t('skills.skillVocabularyDesc'),
      gradient: 'from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/30',
      iconColor: 'text-cyan-600',
      accentColor: 'bg-cyan-400',
      route: '/vocabulary',
      getCounts: (level) => SEED_WORDS.filter((w) => w.level === level).length,
      getTotal: () => SEED_WORDS.length,
    },
  ]
}

// ── Accent color for bar by skill key ─────────────────────────────────────────

function barColor(key: SkillKey): string {
  const map: Record<SkillKey, string> = {
    speaking:   'bg-rose-400',
    reading:    'bg-emerald-400',
    writing:    'bg-violet-400',
    listening:  'bg-orange-400',
    grammar:    'bg-blue-400',
    vocabulary: 'bg-cyan-400',
  }
  return map[key]
}

// ── SkillCard component ───────────────────────────────────────────────────────

function SkillCard({
  data,
  selectedLevel,
  userPct,
  onNavigate,
  style,
}: {
  data: SkillCardData
  selectedLevel: Level | null
  userPct: number | null
  onNavigate: () => void
  style?: React.CSSProperties
}) {
  const Icon = data.icon
  const total = data.getTotal()
  const maxCount = Math.max(1, ...ALL_LEVELS.map((l) => data.getCounts(l)))
  const { key, label } = data

  return (
    <div
      style={style}
      className="group rounded-2xl border border-gray-200/70 dark:border-gray-700/50 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Top accent bar with progress indicator */}
      <div className={`h-1 w-full ${data.iconBg} relative overflow-hidden`}>
        {userPct !== null && (
          <div
            className={`absolute inset-y-0 left-0 ${barColor(key)} transition-all duration-700`}
            style={{ width: `${userPct}%` }}
          />
        )}
      </div>

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${data.iconBg} flex items-center justify-center`}>
              <Icon size={20} className={data.iconColor} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{label}</h3>
              {userPct !== null && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex-1 h-1.5 w-16 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor(key)}`}
                      style={{ width: `${userPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-400">{Math.round(userPct)}%</span>
                </div>
              )}
            </div>
          </div>
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-white/70 dark:bg-gray-800/70 px-2.5 py-1 rounded-full">
            {total} ta
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">{data.description}</p>

        {/* Level bars */}
        <div className="space-y-1.5 mb-4">
          {ALL_LEVELS.map((level) => {
            const count = data.getCounts(level)
            const barWidth = count > 0 ? Math.max(8, (count / maxCount) * 100) : 0
            const isActive = selectedLevel === null || selectedLevel === level
            const lc = LEVEL_CONFIG[level]

            return (
              <div key={`${key}-${level}`} className="flex items-center gap-2">
                <span className={`text-xs font-semibold w-7 flex-shrink-0 transition-colors ${
                  isActive ? lc.color : 'text-gray-300 dark:text-gray-600'
                }`}>
                  {level}
                </span>
                <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isActive ? lc.bar : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold w-5 text-right flex-shrink-0 transition-colors ${
                  isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600'
                }`}>
                  {count}
                </span>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <button
          onClick={onNavigate}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${data.iconBg} ${data.iconColor} hover:brightness-95 active:scale-[0.98] group/btn`}
        >
          {selectedLevel ? `${label} — ${selectedLevel}` : label}
          <ChevronRight size={15} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

// ── Main SkillsPage ───────────────────────────────────────────────────────────

export default function SkillsPage() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [animateIn, setAnimateIn] = useState(false)
  const prevLevelRef = useRef<Level | null>(null)

  // Build skill cards with localized labels inside the component
  const SKILL_CARDS = useMemo(() => buildSkillCards(t), [t])

  // Level labels (localized)
  const LEVEL_LABEL: Record<Level, string> = useMemo(() => ({
    'A1': t('skills.levelA1'),
    'A2': t('skills.levelA2'),
    'B1': t('skills.levelB1'),
    'B1+': t('skills.levelB1Plus'),
    'B2': t('skills.levelB2'),
  }), [t])

  // User progress from store
  const speakingPct  = useStore((s) => s.todaySpeakingPct)
  const readingPct   = useStore((s) => s.todayReadingPct)
  const writingPct   = useStore((s) => s.todayWritingPct)
  const listeningPct = useStore((s) => s.todayListeningPct)
  const grammarPct   = useStore((s) => s.todayGrammarPct)
  const vocabularyPct = useStore((s) => s.todayVocabPct)
  const progressMap = useMemo(() => ({
    speaking: speakingPct, reading: readingPct, writing: writingPct,
    listening: listeningPct, grammar: grammarPct, vocabulary: vocabularyPct,
  }), [speakingPct, readingPct, writingPct, listeningPct, grammarPct, vocabularyPct])

  // Trigger animation on level change
  useEffect(() => {
    if (prevLevelRef.current !== selectedLevel) {
      setAnimateIn(false)
      const timer = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true))
      })
      prevLevelRef.current = selectedLevel
      return () => cancelAnimationFrame(timer)
    }
  }, [selectedLevel])

  // Initial animation
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true))
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  const filteredCards = useMemo(() => {
    return SKILL_CARDS.filter((card) => {
      if (!selectedLevel) return true
      return card.getCounts(selectedLevel) > 0
    })
  }, [selectedLevel, SKILL_CARDS])

  // Aggregate stats
  const totalItems = useMemo(() => {
    return SKILL_CARDS.reduce((acc, card) => acc + card.getTotal(), 0)
  }, [SKILL_CARDS])

  const statsByLevel = useMemo(() => {
    return ALL_LEVELS.map((level) => ({
      level,
      count: SKILL_CARDS.reduce((acc, card) => acc + card.getCounts(level), 0),
    }))
  }, [SKILL_CARDS])

  // Total user progress
  const totalProgressPct = useMemo(() => {
    const vals = Object.values(progressMap)
    if (vals.every((v) => v === 0)) return null
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }, [progressMap])

  // Level distribution bar data
  const levelDistribution = useMemo(() => {
    return statsByLevel.map(({ level, count }) => ({
      level,
      count,
      pct: (count / totalItems) * 100,
    }))
  }, [statsByLevel, totalItems])

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-b2-600 rounded-xl flex items-center justify-center shadow-sm">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t('skills.title')}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('skills.subtitle', { count: String(totalItems) })}
          </p>
        </div>
      </div>

      {/* Stats overview — level distribution bars */}
      <div className="card p-4 mb-5 mt-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {t('skills.statsLevelDist')}
          </p>
          {totalProgressPct !== null && (
            <span className="text-xs font-bold text-primary-600">
              {t('skills.totalProgress', { pct: String(totalProgressPct) })}
            </span>
          )}
        </div>
        <div className="space-y-2">
          {levelDistribution.map(({ level, count, pct }) => {
            const lc = LEVEL_CONFIG[level]
            const isSelected = selectedLevel === level
            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(isSelected ? null : level)}
                className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `${lc.bg} ${lc.ring} ring-2`
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="w-16 flex-shrink-0 text-right">
                  <span className={`text-xs font-bold ${lc.color}`}>{level}</span>
                </div>
                <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${lc.bar}`}
                    style={{ width: `${count > 0 ? Math.max(4, pct) : 0}%` }}
                  />
                </div>
                <div className="w-10 flex-shrink-0 text-left">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{count}</span>
                </div>
                <div className="w-16 flex-shrink-0 text-right">
                  <span className="text-xs text-gray-400">{Math.round(pct)}%</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Level filter chips */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto scrollbar-hide">
        <Filter size={14} className="text-gray-400 flex-shrink-0" />
        <button
          onClick={() => setSelectedLevel(null)}
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap ${
            selectedLevel === null
              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
              : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'
          }`}
        >
          {t('skills.filterAll')}
        </button>
        {ALL_LEVELS.map((level) => {
          const lc = LEVEL_CONFIG[level]
          const isSelected = selectedLevel === level
          return (
            <button
              key={level}
              onClick={() => setSelectedLevel(isSelected ? null : level)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                isSelected
                  ? `${lc.bg} ${lc.color} border-transparent shadow-sm`
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'
              }`}
            >
              {level}
            </button>
          )
        })}
      </div>

      {/* Motivational banner */}
      <div className="card bg-gradient-to-r from-primary-500 to-b2-600 text-white mb-5 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-bold">
              {selectedLevel
                ? t('skills.bannerSelected', { label: LEVEL_LABEL[selectedLevel], count: String(statsByLevel.find((s) => s.level === selectedLevel)?.count ?? 0) })
                : t('skills.bannerContent', { count: String(totalItems) })}
            </p>
            <p className="text-xs text-white/80 mt-0.5">
              {selectedLevel
                ? t('skills.bannerSelectDesc')
                : t('skills.bannerDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Skill cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredCards.map((card, idx) => (
          <div
            key={card.key}
            className={`transition-all duration-400 ${
              animateIn
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${idx * 60}ms` }}
          >
            <SkillCard
              data={card}
              selectedLevel={selectedLevel}
              userPct={progressMap[card.key] ?? null}
              onNavigate={() => navigate(card.route, { state: { from: '/skills' } })}
            />
          </div>
        ))}
      </div>

      {/* Quick links to related pages */}
      <div className="mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
          {t('skills.quickLinksTitle')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: t('skills.linkMockTest'),  route: '/mock-test',     icon: ClipboardList },
            { label: t('skills.linkAiChat'),    route: '/chat',           icon: MessageSquare },
            { label: t('skills.linkConversation'),     route: '/conversation',   icon: MessageCircle },
            { label: t('skills.linkPronunciation'),   route: '/pronunciation',  icon: AudioLines },
            { label: t('skills.linkVocabBattle'), route: '/vocab-battle', icon: Sword },
            { label: t('skills.linkPhrases'),    route: '/phrases',        icon: MessagesSquare },
          ].map((link) => {
            const LinkIcon = link.icon
            return (
              <button
                key={link.route}
                onClick={() => navigate(link.route)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all"
              >
                <LinkIcon size={14} className="text-gray-400 flex-shrink-0" />
                {link.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
