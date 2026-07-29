import { ChevronLeft, RotateCcw } from 'lucide-react'
import type { Scores } from './speakingHelpers'
import AudioPlayback from './AudioPlayback'
import SpeakingHistory from './SpeakingHistory'

interface ScoreCardProps {
  label: string
  score: number
  color: string
}

function ScoreCard({ label, score, color }: ScoreCardProps) {
  return (
    <div className="card text-center">
      <div className={`text-2xl font-bold ${color}`}>{score}<span className="text-base font-normal text-gray-400">/10</span></div>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  )
}

interface SpeakingResultViewProps {
  scores: Scores
  feedback: string
  timer: number
  transcript: string
  audioUrl: string | null
  t: (key: string, params?: Record<string, string>) => string
  onRetry: () => void
  onNext: () => void
  onBack: () => void
}

export default function SpeakingResultView({
  scores, feedback, timer, transcript, audioUrl,
  t, onRetry, onNext, onBack,
}: SpeakingResultViewProps) {
  const avg = Math.round((scores.fluency + scores.grammar + scores.vocabulary) / 3)

  return (
    <div className="p-3 sm:p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="btn-ghost p-2 rounded-xl">
          <ChevronLeft size={18} />
        </button>
        <h2 className="font-bold text-gray-900 dark:text-white">{t('speaking.resultTitle')}</h2>
      </div>

      {/* Overall */}
      <div className="card bg-gradient-to-r from-b2-50 to-primary-50 border-b2-100 text-center mb-4">
        <p className="text-xs text-gray-500 mb-1">{t('speaking.overallScore')}</p>
        <p className="text-4xl font-bold text-b2-600">{avg}<span className="text-xl font-normal text-gray-400">/10</span></p>
        <p className="text-xs text-gray-500 mt-1">{t('speaking.xpEarned', { xp: String(avg * 3) })}</p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <ScoreCard label={t('speaking.scoreFluency')}    score={scores.fluency}    color="text-orange-600" />
        <ScoreCard label={t('speaking.scoreGrammar')}    score={scores.grammar}    color="text-green-600"  />
        <ScoreCard label={t('speaking.scoreVocabulary')} score={scores.vocabulary} color="text-b2-600"     />
      </div>

      {/* WPM metric */}
      {timer > 0 && (
        <div className="card bg-gray-50 dark:bg-gray-800/50 mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-1">{t('speaking.speechRate')}</p>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {Math.round(transcript.trim().split(/\s+/).filter(Boolean).length / (timer / 60))} {t('speaking.wpmLabel')}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {Math.round(timer / 60)}:{String(timer % 60).padStart(2, '0')} {t('common.minutes')} · {transcript.trim().split(/\s+/).filter(Boolean).length} {t('common.words')}
          </p>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className="card bg-primary-50 border-primary-100 mb-4">
          <p className="text-xs font-semibold text-primary-700 mb-1">{t('speaking.feedback')}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
        </div>
      )}

      {/* Audio playback */}
      {audioUrl && (
        <div className="mb-4">
          <AudioPlayback audioUrl={audioUrl} label={t('speaking.yourAnswer')} color="text-b2-600" />
        </div>
      )}

      {/* Transcript */}
      <div className="card mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-1">{t('speaking.yourAnswer')}</p>
        <p className="text-sm text-gray-700 italic leading-relaxed">"{transcript}"</p>
      </div>

      <div className="flex gap-2">
        <button onClick={onRetry} className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1">
          <RotateCcw size={14} /> {t('speaking.retryButton')}
        </button>
        <button onClick={onNext} className="btn-primary flex-1 text-sm">
          {t('speaking.nextPromptButton')}
        </button>
      </div>

      {/* Speaking History */}
      <div className="mt-6">
        <SpeakingHistory />
      </div>
    </div>
  )
}
