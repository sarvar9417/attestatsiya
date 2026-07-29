import { Play, Pause, Square, Volume2, Headphones } from 'lucide-react'
import { AudioButton } from '../ui/AudioButton'
import { SPEED_OPTIONS, DIFFICULTY_LABEL, SPEAKER_COLORS, type SpeakerSegment } from './listeningUtils'
import type { ListeningSection as ListeningSectionType } from '../../data/dailyLessons'
import { useI18n } from '../../i18n'

interface Props {
  section: ListeningSectionType
  segments: SpeakerSegment[]
  uniqueSpeakers: string[]
  speakerColorMap: Record<string, typeof SPEAKER_COLORS[0]>
  playing: boolean
  paused: boolean
  activeSpeaker: string | null
  activeSegIdx: number | null
  playCount: number
  speed: number
  setSpeed: (s: number) => void
  playSpeech: () => void
  togglePause: () => void
  stopSpeech: () => void
  playSegment: (idx: number) => void
  showTranscript: boolean
  setShowTranscript: (v: boolean | ((p: boolean) => boolean)) => void
}

export default function ListeningPlayer({
  section, segments, uniqueSpeakers, speakerColorMap,
  playing, paused, activeSpeaker, activeSegIdx, playCount,
  speed, setSpeed, playSpeech, togglePause, stopSpeech, playSegment,
  showTranscript, setShowTranscript,
}: Props) {
  const { t } = useI18n()
  return (
    <div className="space-y-4">
      {/* YouTube video embed */}
      {section.youtubeId && (
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${section.youtubeId}?rel=0&modestbranding=1`}
              title="YouTube video"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {section.backupUrl && (
        <a href={section.backupUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400 hover:underline">
          <Headphones size={14} /> {t('dailyListening.backupLink')}
        </a>
      )}

      {/* Audio player */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-violet-600 p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 flex items-center gap-1.5">
            <Headphones size={12} /> {t('dailyListening.exerciseLabel')}
          </p>
          {section.difficulty && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_LABEL[section.difficulty]?.color} text-white/90`}>
              {DIFFICULTY_LABEL[section.difficulty]?.label}
            </span>
          )}
        </div>

        {/* Speaker badges + Speed */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-1.5">
            {uniqueSpeakers.map((spk, i) => (
              <span key={spk}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 ${activeSpeaker === spk ? 'ring-2 ring-white' : ''}`}>
                <span className={`w-2 h-2 rounded-full ${SPEAKER_COLORS[i % SPEAKER_COLORS.length].dot}`} />
                {spk}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {SPEED_OPTIONS.map(s => (
              <button key={s} onClick={() => setSpeed(s)}
                className={`text-xs font-bold px-2 py-1 rounded-md transition-all ${speed === s ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                {s}×
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {!playing ? (
            <button onClick={playSpeech}
              className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 backdrop-blur-sm">
              <Play size={26} className="ml-1" />
            </button>
          ) : (
            <>
              <button onClick={togglePause}
                className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95">
                {paused ? <Play size={22} className="ml-1" /> : <Pause size={22} />}
              </button>
              <button onClick={stopSpeech}
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all">
                <Square size={16} />
              </button>
            </>
          )}

          {/* Waveform */}
          {playing && !paused && (
            <div className="flex items-end gap-0.5 h-8">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-1 rounded-full bg-white/80 animate-pulse"
                  style={{ height: `${14 + Math.abs(Math.sin(i * 0.9)) * 14 + 6}px`, animationDelay: `${i * 0.1}s`, animationDuration: `${0.6 + i * 0.08}s` }} />
              ))}
            </div>
          )}

          <div className="ml-auto text-right text-xs opacity-80">
            {playCount > 0 && <p>{t('dailyListening.listenedCount', { count: String(playCount) })}</p>}
            <p>{t('dailyListening.linesCount', { count: String(segments.length) })}</p>
          </div>
        </div>

        {playing && activeSpeaker && (
          <p className="mt-3 text-xs font-semibold opacity-80 flex items-center gap-1.5">
            <Volume2 size={12} /> {t('dailyListening.speakerSpeaking', { speaker: activeSpeaker })}
          </p>
        )}
      </div>

      {/* Transcript toggle */}
      <button onClick={() => setShowTranscript(p => !p)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${showTranscript ? 'border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-200 dark:hover:border-primary-800'}`}>
        <span className="flex items-center gap-2">
          {showTranscript ? '👁️' : '👁️‍🗨️'}
          {showTranscript ? t('dailyListening.hideTranscript') : t('dailyListening.showTranscript')}
        </span>
        <span className="text-xs font-normal text-gray-400">{t('dailyListening.afterListenOnly')}</span>
      </button>

      {showTranscript && (
        <div className="card max-h-[400px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3 sticky top-0 bg-white dark:bg-gray-900 py-2 z-10">
            <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-primary-500" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dailyListening.transcript')}</p>
            </div>
            <AudioButton text={segments.map(s => `${s.speaker}: ${s.text}`).join('. ')} size="sm" rate={0.85} label={t('dailyListening.listenAllText')} />
          </div>
          <div className="space-y-1">
            {segments.map((seg, i) => {
              const colors = speakerColorMap[seg.speaker] ?? SPEAKER_COLORS[0]
              const isActive = activeSegIdx === i
              return (
                <div key={i} id={`seg-${i}`}
                  className={`flex gap-2.5 rounded-xl p-2.5 transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${isActive ? `${colors.bg} ring-1 ${colors.border}` : ''}`}
                  onClick={() => playSegment(i)}>
                  <span className={`text-xs font-bold shrink-0 w-20 pt-0.5 ${colors.text}`}>{seg.speaker}:</span>
                  <p className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${isActive ? 'font-semibold' : ''}`}>{seg.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
