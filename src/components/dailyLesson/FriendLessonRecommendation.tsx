// ═══════════════════════════════════════════════════════════════════════════
// FriendLessonRecommendation — "Do'stingiz o'tdi" dars tavsiyalari
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, ChevronRight, Sparkles, BookOpen } from 'lucide-react'
import { getFriendsLessonRecommendations, type FriendLessonProgress } from '../../services/tandemService'
import { useStore } from '../../store/useStore'

interface Props {
  /** Darslar ro'yxati (title larni topish uchun) */
  onStartLesson: (lessonId: string) => void
}

export default function FriendLessonRecommendation({ onStartLesson }: Props) {
  const navigate = useNavigate()
  const lessonScores = useStore((s) => s.lessonProgress)
  const lessons = useStore((s) => s.lessons)
  const [recommendations, setRecommendations] = useState<FriendLessonProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getFriendsLessonRecommendations(lessonScores).then((data) => {
      if (cancelled) return
      // Dars title larini to'ldirish
      for (const friend of data) {
        for (const lesson of friend.lessons) {
          const match = lessons.find((l) => l.id === lesson.lessonId)
          if (match) lesson.lessonTitle = match.title
        }
        // Title'i topilmagan darslarni chiqarib tashlaymiz
        friend.lessons = friend.lessons.filter((l) => l.lessonTitle)
      }
      // Faqat tavsiyalari bor do'stlarni qoldiramiz
      setRecommendations(data.filter((f) => f.lessons.length > 0))
      setLoading(false)
    }).catch(() => {
      if (!cancelled) setLoading(false)
    })

    return () => { cancelled = true }
  }, [lessonScores, lessons])

  // Hech qanday tavsiya bo'lmasa — ko'rsatmaymiz
  if (loading || recommendations.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-emerald-500" />
        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
          Do'stlaringiz o'tgan darslar
        </h3>
      </div>

      {recommendations.map((friend) => (
        <div key={friend.friendId} className="card p-4 border-emerald-100 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Users size={14} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {friend.friendName}
            </p>
          </div>

          <div className="space-y-1.5">
            {friend.lessons.slice(0, 3).map((lesson) => (
              <button
                key={lesson.lessonId}
                onClick={() => onStartLesson(lesson.lessonId)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-white dark:bg-gray-800/50 border border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300 hover:shadow-sm transition-all text-left group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <BookOpen size={13} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    {lesson.lessonTitle}
                  </p>
                  <p className="text-xs text-gray-400">
                    {friend.friendName} {lesson.score}% bilan o'tgan
                  </p>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
              </button>
            ))}
          </div>

          {friend.lessons.length > 3 && (
            <button
              onClick={() => navigate('/tandem')}
              className="w-full text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2 hover:underline"
            >
              Yana {friend.lessons.length - 3} ta darsni ko'rish →
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
