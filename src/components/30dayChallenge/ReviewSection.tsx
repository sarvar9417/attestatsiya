import { Check, Star, Sparkles, Trophy, BookOpen, Quote } from 'lucide-react'
import type { ChallengeReview } from '../../data/30dayChallenge'

interface Props {
  review: ChallengeReview
}

export default function ReviewSection({ review }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Sparkles size={18} className="text-amber-500" />
        Kun yakuni — takrorlash
      </h3>

      {/* Vocabulary recap */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:shadow-md transition-shadow">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-primary-600" />
          Kalit so'zlar ({review.vocabulary.length} ta)
        </h4>
        <div className="flex flex-wrap gap-2">
          {review.vocabulary.map((w, i) => (
            <span
              key={w}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/30 dark:to-indigo-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium border border-primary-200 dark:border-primary-800 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Key phrases */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:shadow-md transition-shadow">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Quote size={16} className="text-violet-600" />
          Muhim iboralar
        </h4>
        <div className="space-y-1.5">
          {review.keyPhrases.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                <Check size={13} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main points */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-5 text-white shadow-xl">
        <div className="absolute -top-3 -right-3 w-20 h-20 bg-white/5 rounded-full blur-lg" />
        <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-teal-400/10 rounded-full blur-xl" />
        
        <h4 className="text-sm font-bold text-white/70 mb-4 flex items-center gap-2 relative z-10">
          <Star size={16} className="text-yellow-300" />
          Asosiy nuqtalar
        </h4>
        <ul className="space-y-3 relative z-10">
          {review.mainPoints.map((p, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5 backdrop-blur-sm">
                <Trophy size={12} className="text-yellow-300" />
              </div>
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
        
        {/* Progress indicator */}
        <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{review.mainPoints.length} ta asosiy nuqta</span>
            <span className="flex items-center gap-1">
              <Sparkles size={12} /> Eslab qoling!
            </span>
          </div>
        </div>
      </div>

      {/* Motivation footer */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700 p-6 text-white text-center shadow-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="text-4xl mb-3">🌟</div>
          <p className="text-xl font-black mb-1">Kun yakunlandi!</p>
          <p className="text-sm text-white/80 max-w-md mx-auto leading-relaxed">
            Har bir kun sizni fluency'ga bir qadam yaqinlashtiradi. 
            Ertaga yangi kun — yangi imkoniyatlar! 🚀
          </p>
          <div className="mt-4 flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={16} className="text-yellow-300 fill-yellow-300 animate-pop-in" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
