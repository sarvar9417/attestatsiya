import { ChevronRight, Mic } from 'lucide-react'
import type { NavigateFunction } from 'react-router-dom'
import { getDaysForLesson } from '../../data/speakingPath'

interface Props {
  lessonId: string
  navigate: NavigateFunction
}

export default function SpeakingPathLink({ lessonId, navigate }: Props) {
  const speakingDays = getDaysForLesson(lessonId)
  if (speakingDays.length === 0) return null
  const dayNum = speakingDays[0].day

  return (
    <div
      onClick={() => navigate(`/speaking-path?day=${dayNum}`)}
      role="button"
      tabIndex={0}
      className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-b2-600 text-white hover:from-primary-600 hover:to-b2-700 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
    >
      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
        <Mic size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold flex items-center gap-1.5">
          🎤 Shu grammatikani gapirib mashq qilish ({dayNum}-kun)
        </p>
        <p className="text-xs text-white/80">
          Speaking Path da real suhbat stsenariylari bilan gapirishni mashq qiling
        </p>
      </div>
      <ChevronRight size={18} className="shrink-0 text-white/70" />
    </div>
  )
}
