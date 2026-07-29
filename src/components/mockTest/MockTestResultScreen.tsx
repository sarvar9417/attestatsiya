import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useI18n } from '../../i18n'
import { SectionBar, type ResultData } from './mockTestHelpers'
import { pctToBand, scoreToBand, roundBand } from '@/data/mockTestData'

interface MockTestResultScreenProps {
  data: ResultData
  onRetry: () => void
}

export default function MockTestResultScreen({ data, onRetry }: MockTestResultScreenProps) {
  const { t } = useI18n()
  const navigate  = useNavigate()
  const isIELTS   = data.type === 'ielts'
  const band      = data.overallBand

  const weakSection = (() => {
    if (!isIELTS || !data.ielts) return null
    const s = data.ielts
    const sections = [
      { label: 'Reading',   band: pctToBand(s.reading),   path: '/reading'    },
      { label: 'Listening', band: pctToBand(s.listening),  path: '/listening'  },
      { label: 'Writing',   band: scoreToBand((s.writingT1 + s.writingT2) / 2), path: '/writing' },
      { label: 'Speaking',  band: scoreToBand((s.speaking1 + s.speaking2) / 2), path: '/speaking' },
    ]
    return sections.reduce((a, b) => (a.band < b.band ? a : b))
  })()

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="card bg-gradient-to-br from-primary-50 to-b2-50 border-primary-100 text-center mb-5">
        <CheckCircle size={36} className="text-primary-600 mx-auto mb-2" />
        <p className="text-xs text-gray-500 mb-1">
          {isIELTS ? 'IELTS Band Score' : t('mockTest.resultTitle')}
        </p>
        <p className="text-5xl font-bold text-primary-700">
          {isIELTS ? band.toFixed(1) : `${Math.round(band)}%`}
        </p>
        {!isIELTS && (
          <p className="text-sm text-gray-500 mt-1">
            {t('mockTest.progressLabel', { correct: String(data.weeklyScore), total: String(data.weeklyTotal) })} ·{' '}
            {band >= 80 ? t('mockTest.resultB2') : band >= 65 ? t('mockTest.resultB1Plus') : t('mockTest.resultB1')}
          </p>
        )}
        {data.prevScore !== undefined && (
          <p className={`text-xs mt-2 font-semibold ${band > data.prevScore ? 'text-green-600' : 'text-orange-500'}`}>
            {band > data.prevScore ? t('mockTest.resultUp', { diff: (band - data.prevScore).toFixed(1) }) : t('mockTest.resultDown', { diff: (data.prevScore - band).toFixed(1) })} {t('mockTest.resultPrev')}
          </p>
        )}
      </div>

      {isIELTS && data.ielts && (
        <div className="card mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">{t('mockTest.sectionBreakdown')}</p>
          {[
            { label: '📖 Reading',   pct: data.ielts.reading,  band: roundBand(pctToBand(data.ielts.reading))  },
            { label: '🎧 Listening', pct: data.ielts.listening, band: roundBand(pctToBand(data.ielts.listening)) },
            { label: '✍️ Writing',   pct: Math.round(((data.ielts.writingT1 + data.ielts.writingT2) / 2) * 10),
              band: roundBand(scoreToBand((data.ielts.writingT1 + data.ielts.writingT2) / 2)) },
            { label: '🎤 Speaking',  pct: Math.round(((data.ielts.speaking1 + data.ielts.speaking2) / 2) * 10),
              band: roundBand(scoreToBand((data.ielts.speaking1 + data.ielts.speaking2) / 2)) },
          ].map((s) => <SectionBar key={s.label} {...s} />)}
        </div>
      )}

      {weakSection && (
        <div className="card bg-orange-50 border-orange-100 mb-4">
          <p className="text-sm font-semibold text-orange-700 mb-1">
            {t('mockTest.weaknessTitle', { label: weakSection.label })}
          </p>
          <p className="text-xs text-orange-600 mb-2">
            {t('mockTest.weaknessDesc')}
          </p>
          <button onClick={() => navigate(weakSection.path)} className="text-xs font-semibold text-orange-700 underline">
            {t('mockTest.weaknessLink', { label: weakSection.label })}
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onRetry} className="btn-secondary flex-1 text-sm">
          {t('mockTest.retryButton')}
        </button>
        <button onClick={() => navigate('/')} className="btn-primary flex-1 text-sm">
          {t('mockTest.homeButton')}
        </button>
      </div>
    </div>
  )
}
