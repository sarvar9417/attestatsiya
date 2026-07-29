import { useI18n } from '../../i18n'
import { useStore } from '../../store/useStore'
import { getStoryBeat, STORY_BEATS, resolveActDisplay } from '../../data/narrative/storyline'

export default function StoryBeatCard() {
  const { t } = useI18n()
  const { currentDay } = useStore()
  const beat = getStoryBeat(currentDay)
  const act = resolveActDisplay(beat.act)
  const progress = Math.min(100, Math.round((currentDay / 126) * 100))

  const currentActIndex = STORY_BEATS.findIndex(b => b.act === beat.act)
  const actZoneStart = currentActIndex >= 0
    ? Math.round((STORY_BEATS[currentActIndex].dayRange[0] / 126) * 100)
    : 0
  const actZoneEnd = currentActIndex >= 0
    ? Math.round((STORY_BEATS[currentActIndex].dayRange[1] / 126) * 100)
    : 100

  const STOPS = [
    { day: 1,  label: 'Toshkent',  emoji: '🏠', x: 4 },
    { day: 27, label: 'A2 ✓',     emoji: '📚', x: 27 },
    { day: 55, label: 'B1 ✓',     emoji: '💼', x: 55 },
    { day: 78, label: 'B1+ ✓',    emoji: '✈️',  x: 78 },
    { day: 126, label: 'London',   emoji: '🏙️', x: 94 },
  ]

  return (
    <section className={`card border-l-4 overflow-hidden`}
      style={{ borderLeftColor: act.color }}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${act.bgClass}`}>
          {act.emoji} {act.label}
        </span>
        <span className="text-xs font-medium text-gray-400">
          {beat.title}
        </span>
        <span className="text-xs text-gray-300">·</span>
        <span className="text-xs text-gray-400">
          {beat.location}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        {beat.context}
      </p>

      <div className="relative pt-2 pb-7">
        <div
          className="absolute h-full rounded-full opacity-10 pointer-events-none"
          style={{
            left: `${actZoneStart}%`,
            width: `${actZoneEnd - actZoneStart}%`,
            backgroundColor: act.color,
            top: 0,
            bottom: 0,
          }}
        />

        <div className="relative h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full mx-2">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${act.color}, ${act.color}cc)`,
            }}
          />

          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 transition-all duration-700"
            style={{ left: `${progress}%` }}
          >
            <div
              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 shadow-lg flex items-center justify-center"
              style={{ backgroundColor: act.color }}
            >
              <span className="text-xs">👤</span>
            </div>
          </div>
        </div>

        {STOPS.map(stop => {
          const reached = currentDay >= stop.day
          return (
            <div
              key={stop.day}
              className="absolute bottom-0 flex flex-col items-center gap-0.5 transition-all duration-300"
              style={{ left: `calc(${stop.x}% + 8px)`, transform: 'translateX(-50%)' }}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300
                  ${reached ? 'shadow-sm' : 'opacity-60'}`}
                style={{ backgroundColor: reached ? act.color : '#e5e7eb' }}
              >
                <span className="text-xs leading-none">{stop.emoji}</span>
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap
                ${reached ? `${act.textClass}` : 'text-gray-400 dark:text-gray-500'}`}>
                {stop.label}
              </span>
              <span className={`text-[8px] whitespace-nowrap
                ${reached ? 'text-gray-400' : 'text-gray-300 dark:text-gray-600'}`}>
                {t('dashboard.storyBeatDay', { day: stop.day })}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mt-1 pt-2 border-t border-gray-50 dark:border-gray-700">
        <span>{t('dashboard.storyBeatProgress', { pct: progress })}</span>
        <span className="font-medium text-gray-500 dark:text-gray-400">
          {t('dashboard.storyBeatDay', { day: currentDay })}
        </span>
      </div>
    </section>
  )
}
