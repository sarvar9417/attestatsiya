import { ClipboardList, ChevronRight } from 'lucide-react'
import { useI18n } from '../../i18n'
import { MockTestSkeleton } from '../ui/PageSkeleton'
import type { TestType } from './mockTestHelpers'

interface MockTestSelectScreenProps {
  onStart: (t: TestType) => void
  loading?: boolean
}

export default function MockTestSelectScreen({ onStart, loading }: MockTestSelectScreenProps) {
  const { t } = useI18n()
  if (loading) {
    return <MockTestSkeleton />
  }
  const tests = [
    { type:'a1' as TestType, title: t('mockTest.a1Title'), emoji:'🌱',
      sub: t('mockTest.a1Sub'), qs:20, mins:25,
      color:'bg-emerald-50 border-emerald-100', tc:'text-emerald-700' },
    { type:'b1' as TestType, title: t('mockTest.weeklyB1Title'), emoji:'📝',
      sub: t('mockTest.weeklyB1Sub'), qs:30, mins:45,
      color:'bg-primary-50 border-primary-100', tc:'text-primary-700' },
    { type:'b2' as TestType, title: t('mockTest.weeklyB2Title'), emoji:'📋',
      sub: t('mockTest.weeklyB2Sub'), qs:30, mins:60,
      color:'bg-b2-50 border-b2-100', tc:'text-b2-700' },
    { type:'ielts' as TestType, title: t('mockTest.ieltsTitle'), emoji:'🎓',
      sub: t('mockTest.ieltsSub'), qs:4, mins:120,
      color:'bg-purple-50 border-purple-100', tc:'text-purple-700' },
  ]
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <ClipboardList size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('mockTest.title')}</h1>
          <p className="text-xs text-gray-500">{t('mockTest.subtitle')}</p>
        </div>
      </div>
      <div className="space-y-3">
        {tests.map((test) => (
          <button key={test.type} onClick={() => onStart(test.type)}
            className={`w-full card text-left border hover:shadow-md hover:-translate-y-0.5 transition-all ${test.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{test.emoji}</span>
                <div>
                  <p className={`font-bold ${test.tc}`}>{test.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{test.sub}</p>
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-xs text-gray-400">{t('mockTest.minutes', { mins: String(test.mins) })}</span>
                    <span className="text-xs text-gray-400">{t('mockTest.questions', { count: String(test.type === 'ielts' ? 4 : test.qs) })}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          </button>
        ))}
      </div>

      {/* IELTS format info */}
      <div className="card bg-purple-50 border-purple-100 mt-4">
        <p className="text-xs font-semibold text-purple-700 mb-2">{t('mockTest.ieltsSectionsTitle')}</p>
        {[
          { name: t('mockTest.ieltsSectionReading'),   time: t('mockTest.minutes', { mins: '30' }),   desc: '10 savol — 2 matn' },
          { name: t('mockTest.ieltsSectionListening'), time: t('mockTest.minutes', { mins: '20' }),   desc: 'Audio — eshitib javob bering' },
          { name: t('mockTest.ieltsSectionWriting'),   time: t('mockTest.minutes', { mins: '40' }),   desc: 'Task 1 + Task 2 (Claude baholaydi)' },
          { name: t('mockTest.ieltsSectionSpeaking'),  time: t('mockTest.minutes', { mins: '15' }),   desc: '2 ta prompt — Web Speech + Claude' },
        ].map((s) => (
          <div key={s.name} className="flex items-center justify-between py-1.5 border-b border-purple-100 last:border-0">
            <span className="text-xs font-medium text-purple-800">{s.name}</span>
            <span className="text-xs text-purple-500">{s.time} · {s.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
