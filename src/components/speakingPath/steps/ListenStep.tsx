// Speaking Path — Qadam 1: Eshit (Listen)
// Reja: docs/speaking-path-roadmap.md (6-bo'lim)
// Kunning barcha bloklarini en+uz ko'rsatadi, har biriga TTS 🔊, tezlik selektori.

import { Volume2, Gauge, ArrowRight, BookOpen, VolumeX, RotateCcw } from 'lucide-react'
import { useSpeechSynthesis, SPEED_OPTIONS } from '../../../hooks/useSpeechSynthesis'
import { getChunkById } from '../../../data/speakingPath'
import { getCachedSrsMapSync } from '../../../services/speakingPathService'
import type { SpeakingDay, SpeakingChunk } from '../../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  userId?: string
  onNext: () => void
}

function getRecycledStability(userId: string | undefined, chunkId: string): number | null {
  if (!userId) return null
  const map = getCachedSrsMapSync(userId)
  if (!map) return null
  return map[chunkId]?.stability ?? null
}

function stabilityLabel(s: number | null): string {
  if (s == null) return '—'
  if (s >= 90) return 'Yodda'
  if (s >= 30) return 'Mustahkam'
  if (s >= 15) return 'Ishonchli'
  if (s >= 5) return 'O\'rganilmoqda'
  return 'Yangi'
}

export default function ListenStep({ day, userId, onNext }: Props) {
  const { speak, playing, speed, setSpeed, supported } = useSpeechSynthesis()

  // Spiral curriculum: recycled chunklarni yuklash va SRS stability ni olish
  const recycledChunks: SpeakingChunk[] = (day.recycledChunkIds ?? [])
    .map(id => getChunkById(id))
    .filter((c): c is SpeakingChunk => c !== undefined)

  // Stability hisoblash
  const chunkStabilities = recycledChunks.map(c => ({
    chunk: c,
    stability: getRecycledStability(userId, c.id),
  }))
  const stableCount = chunkStabilities.filter(s => s.stability != null && s.stability >= 30).length
  const totalRecycled = chunkStabilities.length

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">🔊 Tinglang va tushuning</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Har bir iborani bosib tinglang</p>
      </div>

      {/* Quick Review — Spiral Curriculum (recycled chunks) + SRS Stability */}
      {recycledChunks.length > 0 && (
        <div className="rounded-xl p-3 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50">
          <div className="flex items-center gap-1.5 mb-2">
            <RotateCcw size={14} className="text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-bold text-violet-700 dark:text-violet-300 uppercase">Takrorlash — Spiral Curriculum</span>
            <span className="text-xs text-violet-500 dark:text-violet-400 ml-auto">
              {stableCount}/{totalRecycled} mustahkam
            </span>
          </div>

          {/* Stability summary bar */}
          {totalRecycled > 0 && (
            <div className="flex items-center gap-1 mb-2.5">
              {['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500'].map((color, i) => {
                const count = chunkStabilities.filter(s => {
                  const stab = s.stability
                  if (i === 0) return stab != null && stab < 5
                  if (i === 1) return stab != null && stab >= 5 && stab < 15
                  if (i === 2) return stab != null && stab >= 15 && stab < 30
                  if (i === 3) return stab != null && stab >= 30 && stab < 90
                  if (i === 4) return stab != null && stab >= 90
                  return false
                }).length
                if (count === 0) return null
                return (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full ${color} first:rounded-l-full last:rounded-r-full`}
                    style={{ width: `${(count / totalRecycled) * 100}%`, opacity: 0.8 }}
                  />
                )
              })}
            </div>
          )}

          <div className="space-y-1.5">
            {chunkStabilities.map(({ chunk: c, stability }) => (
              <div key={c.id} className="flex items-center gap-2">
                <button
                  onClick={() => supported && speak(c.en)}
                  disabled={!supported}
                  className="flex-1 flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white dark:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 border border-violet-100 dark:border-violet-800/40 hover:bg-violet-100 dark:hover:bg-violet-800/40 transition-colors disabled:opacity-60"
                >
                  <Volume2 size={11} className="text-violet-500 shrink-0" />
                  <span className="truncate">{c.en}</span>
                </button>
                {/* SRS stability progress bar */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    {stability != null && (
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (stability / 90) * 100)}%`,
                          backgroundColor: stability >= 90 ? '#8B5CF6' : stability >= 30 ? '#10B981' : stability >= 15 ? '#3B82F6' : stability >= 5 ? '#F59E0B' : '#EF4444',
                        }}
                      />
                    )}
                  </div>
                  <span className={`text-[9px] font-bold min-w-[40px] text-right ${
                    stability == null ? 'text-gray-400' :
                    stability >= 30 ? 'text-emerald-600 dark:text-emerald-400' :
                    stability >= 15 ? 'text-blue-600 dark:text-blue-400' :
                    stability >= 5 ? 'text-amber-600 dark:text-amber-400' :
                    'text-rose-600 dark:text-rose-400'
                  }`}>
                    {stabilityLabel(stability)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pronunciation Focus — Phase 1 */}
      {day.pronunciationFocus && (
        <div className="rounded-xl p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
          <div className="flex items-center gap-2">
            <VolumeX size={16} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">Bugungi tovush</span>
          </div>
          <div className="mt-1.5 flex items-start gap-3">
            <span className="text-2xl font-black font-mono text-amber-700 dark:text-amber-300 leading-none">{day.pronunciationFocus.sound}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-amber-600 dark:text-amber-400">{day.pronunciationFocus.ipaExample}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{day.pronunciationFocus.tipUz}</p>
              {day.pronunciationFocus.commonError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">⚠️ {day.pronunciationFocus.commonError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tezlik selektori */}
      {supported && (
        <div className="flex items-center gap-2 justify-center flex-wrap">
          <Gauge size={14} className="text-gray-400" />
          {SPEED_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSpeed(opt.value)}
              className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors
                ${speed === opt.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Bloklar — grammar tip bilan */}
      <div className="space-y-2">
        {day.chunks.map(c => (
          <button
            key={c.id}
            onClick={() => supported && speak(c.en)}
            disabled={!supported}
            className="w-full flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-left hover:shadow-md active:scale-[0.99] transition-all disabled:opacity-60"
          >
            <div className="w-10 h-10 mt-0.5 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
              <Volume2 size={18} className="text-primary-600 dark:text-primary-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{c.en}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{c.uz}</p>
              {c.ipa && <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">{c.ipa}</p>}
              {c.grammarTip && (
                <div className="mt-1 flex items-start gap-1">
                  <BookOpen size={11} className="text-primary-500 mt-0.5 shrink-0" />
                  <span className="text-xs leading-tight text-primary-600 dark:text-primary-400">{c.grammarTip}</span>
                </div>
              )}
              {c.stressWord && (
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">🎯 Urg'u: <span className="underline decoration-amber-400">{c.stressWord}</span></span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Ovoz qo'llab-quvvatlanmasa — tushuntirish */}
      {!supported && (
        <div className="rounded-xl p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-700 dark:text-amber-300">
          <p className="font-semibold">⚠️ Brauzeringiz ovoz sintezini qo'llab-quvvatlamaydi.</p>
          <p className="mt-0.5 text-amber-600/80 dark:text-amber-400/80">Iboralarni o'qish uchun matnni ko'rib chiqing va davom eting.</p>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={playing}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm hover:from-primary-700 hover:to-primary-800 active:scale-[0.98] transition-all disabled:opacity-60"
      >
        Tushundim, davom etish <ArrowRight size={16} />
      </button>
    </div>
  )
}
