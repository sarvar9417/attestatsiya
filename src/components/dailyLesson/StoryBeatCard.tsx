import { getStoryForLesson } from '../../data/narrative/storyLessonMapping'
import { resolveActDisplay } from '../../data/narrative/storyline'
import type { StoryBeat } from '../../data/narrative/storyline'

interface Props {
  storyBeat: StoryBeat
  /** Lesson day number (1–126), used for progress bar */
  day?: number
  /** Lesson ID, used to look up scene descriptions */
  lessonId: string
}

export default function StoryBeatCard({ storyBeat, day, lessonId }: Props) {
  const act = resolveActDisplay(storyBeat.act)
  const progress = Math.min(100, Math.round(((day ?? 1) / 126) * 100))
  const link = getStoryForLesson(lessonId)

  return (
    <div className={`rounded-xl border ${act.borderClass} overflow-hidden`}>
      {/* Colored top strip */}
      <div className={`h-1.5 w-full ${act.bgClass}`} />

      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex items-start gap-4">
          {/* Act emoji circle */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${act.lightBgClass}`}
            style={{ border: `2px solid ${act.color}` }}
          >
            {storyBeat.emoji}
          </div>

          <div className="min-w-0 flex-1">
            {/* Badge row */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${act.bgClass}`}>
                {act.emoji} {act.label}
              </span>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                {storyBeat.location}
              </span>
              <span className="text-xs font-medium text-gray-300 dark:text-gray-600">·</span>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                Kun {day ?? 1}/126
              </span>
            </div>

            {/* Lesson hint */}
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {storyBeat.lessonHint}
            </p>

            {/* Scene description */}
            {link && (
              <p className={`text-xs mt-2 italic leading-relaxed ${act.textClass}`}>
                🎬 {link.scene}
              </p>
            )}

            {/* Mini progress bar */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500`}
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${act.color}, ${act.color}dd)`,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {progress}% yo'l
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
