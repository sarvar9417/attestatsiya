// Speaking Path — narvon (ladder) UI
// To'liq narvon: CEFR zonlari, kengaytirilgan kun kartalari, boy inline detal paneli,
// SpeakingDaySession ga uzviy bog'langan boshlash tugmasi.

import { CheckCircle2, ChevronDown, Mic, Clock, Star, Sparkles, Lock } from 'lucide-react'
import type { SpeakingDay, SpeakingDayProgress } from '../../data/speakingPath/types'
import { getCachedSrsMapSync } from '../../services/speakingPathService'
import { getLevelRange, CEFR_ORDER } from '../../data/speakingPath'

interface Props {
  days: SpeakingDay[]
  /** ochilgan eng katta kun (shu kun ham ochiq) */
  unlockedDay: number
  /** tugatilgan kunlar */
  completed: Set<number>
  /** kun bo'yicha to'liq progress ma'lumotlari (badge/ball uchun) */
  progress: SpeakingDayProgress[]
  /** inline ochilgan kun (detal ko'rsatish) */
  expandedDay: number | null
  onToggle: (day: number) => void
  /** kun mashg'ulotini boshlash */
  onStart?: (day: number) => void
  userId?: string
}

// ── CEFR zonalari (dinamik — ma'lumotlardan hisoblanadi) ────────────────────────

interface CefrZone {
  label: string
  cefr: string
  dayMin: number
  dayMax: number
  color: string
  bgClass: string
  textClass: string
  borderClass: string
  icon: string
}

/** CEFR darajalari uchun vizual xususiyatlar (o'zgarmas qism) */
const CEFR_VISUALS: Record<string, Omit<CefrZone, 'dayMin' | 'dayMax'>> = {
  A0: {
    label: "Boshlang'ich", cefr: 'A0',
    color: '#059669', bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    borderClass: 'border-emerald-200 dark:border-emerald-800/50',
    icon: '🌱',
  },
  A1: {
    label: 'Asosiy', cefr: 'A1',
    color: '#2563eb', bgClass: 'bg-blue-50 dark:bg-blue-900/20',
    textClass: 'text-blue-700 dark:text-blue-300',
    borderClass: 'border-blue-200 dark:border-blue-800/50',
    icon: '📘',
  },
  A2: {
    label: "O'rta", cefr: 'A2',
    color: '#6d28d9', bgClass: 'bg-violet-50 dark:bg-violet-900/20',
    textClass: 'text-violet-700 dark:text-violet-300',
    borderClass: 'border-violet-200 dark:border-violet-800/50',
    icon: '📗',
  },
  B1: {
    label: "Yuqori o'rta", cefr: 'B1',
    color: '#d97706', bgClass: 'bg-amber-50 dark:bg-amber-900/20',
    textClass: 'text-amber-700 dark:text-amber-300',
    borderClass: 'border-amber-200 dark:border-amber-800/50',
    icon: '📕',
  },
  B2: {
    label: 'Yuqori', cefr: 'B2',
    color: '#e11d48', bgClass: 'bg-rose-50 dark:bg-rose-900/20',
    textClass: 'text-rose-700 dark:text-rose-300',
    borderClass: 'border-rose-200 dark:border-rose-800/50',
    icon: '📙',
  },
}

/** CEFR zonalarini ma'lumotlardan hisoblash — kelajakda kun qo'shilsa avtomatik yangilanadi */
function computeCefrZones(): CefrZone[] {
  return CEFR_ORDER
    .map(cefr => {
      const range = getLevelRange(cefr)
      const visual = CEFR_VISUALS[cefr]
      if (!range || !visual) return null
      return { ...visual, dayMin: range.dayMin, dayMax: range.dayMax }
    })
    .filter((z): z is CefrZone => z !== null)
}

const CEFR_ZONES = computeCefrZones()

// ── Ranglar ────────────────────────────────────────────────────────────────────

const CEFR_BADGE: Record<string, string> = {
  A0: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  A1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  A2: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  B1: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  B2: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

// ── SRS stability helper ────────────────────────────────────────────────────────

function getChunkStability(userId: string | undefined, chunkId: string): number | null {
  if (!userId) return null
  const map = getCachedSrsMapSync(userId)
  if (!map) return null
  return map[chunkId]?.stability ?? null
}

function stabilityColorClass(stability: number | null): string {
  if (stability == null) return 'bg-gray-200 dark:bg-gray-600'
  if (stability >= 90) return 'bg-purple-500'
  if (stability >= 30) return 'bg-emerald-500'
  if (stability >= 15) return 'bg-blue-500'
  if (stability >= 5) return 'bg-amber-500'
  return 'bg-rose-500'
}

// ── Asosiy komponent ───────────────────────────────────────────────────────────

export default function SpeakingLadder({ days, unlockedDay, completed, progress, expandedDay, onToggle, onStart, userId }: Props) {
  // progress map for quick lookup
  const progressMap = new Map(progress.map(p => [p.day, p]))

  // Guruhlash: har bir zona uchun kunlar ro'yxati
  const grouped = CEFR_ZONES.map(zone => ({
    zone,
    days: days.filter(d => d.day >= zone.dayMin && d.day <= zone.dayMax),
  })).filter(g => g.days.length > 0)

  return (
    <div className="space-y-6">
      {grouped.map(({ zone, days: zoneDays }) => {
        const doneInZone = zoneDays.filter(d => completed.has(d.day)).length
        const totalInZone = zoneDays.length
        const zonePct = Math.round((doneInZone / totalInZone) * 100)
        // Zona qulflangan: barcha kunlari unlockedDay dan keyin (hech biri ochilmagan/tugallanmagan)
        const zoneLocked = Math.min(...zoneDays.map(d => d.day)) > unlockedDay

        return (
          <div key={zone.cefr + '-' + zone.dayMin}>
            {/* Zona sarlavhasi */}
            <div className={`px-3 py-2.5 rounded-xl border ${zone.borderClass} ${zone.bgClass} flex items-center gap-2.5 mb-2`}>
              <span className="text-lg">{zone.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${CEFR_BADGE[zone.cefr]}`}>{zone.cefr}</span>
                  <span className={`text-sm font-bold ${zone.textClass}`}>{zone.label}</span>
                  {zoneLocked && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 flex items-center gap-0.5">
                      <Lock size={9} /> Yopiq
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-[120px]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${zonePct}%`, backgroundColor: zone.color }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {doneInZone}/{totalInZone} kun
                  </span>
                </div>
              </div>
            </div>

            {/* Kun tugunlari */}
            <div className="space-y-1.5">
              {zoneDays.map((d, i) => {
                const isCompleted = completed.has(d.day)
                const isCurrent = d.day === unlockedDay && !isCompleted
                const isLocked = d.day > unlockedDay && !isCompleted
                const isExpanded = expandedDay === d.day
                const dayProgress = progressMap.get(d.day)
                const score = dayProgress?.bestSpeakScore
                const spokenSecs = dayProgress?.spokenSeconds ?? 0
                const spokenLabel = spokenSecs < 60
                  ? `${spokenSecs}s`
                  : `${Math.round(spokenSecs / 60)}daq`

                return (
                  <div key={d.day} className="relative">
                    {/* Ulovchi chiziq */}
                    {i < zoneDays.length - 1 && (
                      <span className="absolute left-[26px] top-[54px] bottom-[-6px] w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden />
                    )}

                    {/* Asosiy karta */}
                    <button
                      data-day={d.day}
                      disabled={isLocked}
                      onClick={() => { if (!isLocked) onToggle(d.day) }}
                      className={`relative w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all border
                        ${isLocked ? 'opacity-50 cursor-not-allowed ' : ''}${isCurrent
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 shadow-sm hover:shadow-md active:scale-[0.99]'
                          : isCompleted
                            ? 'bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-800/50 hover:shadow-md active:scale-[0.99]'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md active:scale-[0.99]'
                        }`}
                    >
                      {/* Raqam / holat doirasi */}
                      <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 font-black text-lg relative
                        ${isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                            ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={24} />
                        ) : (
                          d.day
                        )}
                        {/* Pulsatsiya — joriy kunda */}
                        {isCurrent && (
                          <span className="absolute inset-0 rounded-2xl animate-ping bg-primary-400/30" />
                        )}
                      </div>

                      {/* Matn */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${CEFR_BADGE[d.cefr]}`}>{d.cefr}</span>
                          <span className={`font-bold text-sm truncate text-gray-900 dark:text-gray-100`}>
                            {d.day}-kun
                          </span>
                          {isCurrent && (
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                              HOZIR
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 truncate text-gray-600 dark:text-gray-400`}>
                          {d.title}
                        </p>
                      </div>

                      {/* Badge va metrikalar */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isCompleted && score != null && (
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                              <Star size={11} /> {score}%
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-0.5">
                              <Clock size={9} /> {spokenLabel}
                            </span>
                          </div>
                        )}
                        {!isCompleted && !isLocked && (
                          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                            ~{d.estMinutes} daq
                          </span>
                        )}
                        {isLocked && (
                          <Lock size={13} className="text-gray-400 dark:text-gray-500" />
                        )}
                          <ChevronDown size={16} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Inline detal paneli */}
                    {isExpanded && (
                      <div className="ml-[60px] mr-1 mt-1.5 mb-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 animate-slide-up space-y-2.5">
                        {/* Maqsad */}
                        <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 flex items-center gap-1.5">
                          <Sparkles size={13} /> {d.goalUz}
                        </p>

                        {/* Grammar badge — linkedLessonId / grammarPoint */}
                        {d.linkedLessonId && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-primary-50/60 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                              📚 Grammar:
                            </span>
                            <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                              {d.grammarPoint ?? d.linkedLessonId}
                            </span>
                            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 ml-auto">
                              {d.linkedLessonId}
                            </span>
                          </div>
                        )}

                        {/* SRS Stability — per-chunk mastery dots */}
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/40 dark:bg-gray-700/30">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0">SRS:</span>
                          {d.chunks.map(c => {
                            const stab = getChunkStability(userId, c.id)
                            return (
                              <div
                                key={c.id}
                                className={`flex-1 h-2 rounded-full ${stabilityColorClass(stab)}`}
                                title={`${c.en}: ${stab != null ? stab.toFixed(1) : '—'}`}
                                style={{
                                  opacity: stab != null && stab >= 30 ? 1 : stab != null && stab >= 15 ? 0.7 : stab != null ? 0.5 : 0.3,
                                }}
                              />
                            )
                          })}
                        </div>

                        {/* Bloklar ro'yxati — grammar tip bilan */}
                        <div className="space-y-1.5">
                          {d.chunks.map(c => (
                            <div key={c.id} className="flex items-start gap-2 text-xs p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/40 transition-colors">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-gray-800 dark:text-gray-100">{c.en}</span>
                                  {c.pattern && (
                                    <span className="text-xs text-primary-500 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/30 px-1 py-0.5 rounded truncate max-w-[120px]">
                                      {c.pattern}
                                    </span>
                                  )}
                                </div>
                                <span className="text-gray-400 dark:text-gray-500 block leading-tight">{c.uz}</span>
                                {c.grammarTip && (
                                  <span className="text-xs text-primary-600 dark:text-primary-400 italic block mt-0.5">📖 {c.grammarTip}</span>
                                )}
                              </div>
                              {c.ipa && (
                                <span className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-white/50 dark:bg-gray-700/50 px-1.5 py-0.5 rounded shrink-0">
                                  {c.ipa}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Stsenariy prevyusi */}
                        <div className="p-2 rounded-lg bg-violet-50/60 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30">
                          <div className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">
                            <Mic size={12} /> AI suhbat stsenariysi
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <span>🤖 {d.scenario.aiRole}</span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span>👤 {d.scenario.userRole}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic truncate">
                            "{d.scenario.opening}"
                          </p>
                        </div>

                        {/* Boshlash tugmasi */}
                        {!isCompleted && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onStart?.(d.day) }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm hover:from-primary-700 hover:to-primary-800 active:scale-[0.98] transition-all shadow-sm"
                          >
                            <Mic size={16} /> Mashg'ulotni boshlash
                          </button>
                        )}
                        {isCompleted && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onStart?.(d.day) }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-sm"
                          >
                            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                              <polyline points="1 4 1 10 7 10" />
                              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                            </svg>
                            Qayta mashq qilish
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
