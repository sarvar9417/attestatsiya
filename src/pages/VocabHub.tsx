import { useState, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, BookMarked, MessageCircle, BookText, Sword } from 'lucide-react'
import { useI18n } from '../i18n'
import type { TranslationStrings } from '../i18n/types'
import { VocabularySkeleton, DictionarySkeleton } from '../components/ui/PageSkeleton'

const Vocabulary = lazy(() => import('./Vocabulary'))
const Dictionary = lazy(() => import('./Dictionary'))
const Phrases = lazy(() => import('./Phrases'))
const PhraseDictionary = lazy(() => import('./PhraseDictionary'))

type VocabTab = 'learn' | 'dictionary' | 'phrases' | 'phrases-dict'

const VOCAB_TABS: { id: VocabTab; label: string; Icon: typeof BookOpen }[] = [
  { id: 'learn',        label: '', Icon: BookOpen },
  { id: 'dictionary',   label: '',   Icon: BookMarked },
  { id: 'phrases',      label: '',       Icon: MessageCircle },
  { id: 'phrases-dict', label: '', Icon: BookText },
]

export default function VocabHub() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<VocabTab>('learn')
  const navigate = useNavigate()

  return (
    <div className="h-full flex flex-col">
      {/* Tab bar */}
      <nav className="sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        {VOCAB_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-1 py-3
              text-xs sm:text-sm font-medium border-b-2 transition-all duration-200
              ${activeTab === tab.id
                ? 'text-b1-600 dark:text-b1-400 border-b1-500'
                : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <tab.Icon size={15} />
            <span className="hidden sm:inline">{tab.label || t(('vocabHub.tab' + tab.id.charAt(0).toUpperCase() + tab.id.slice(1)) as keyof TranslationStrings)}</span>
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={
          activeTab === 'dictionary' || activeTab === 'phrases-dict'
            ? <DictionarySkeleton />
            : <VocabularySkeleton />
        }>
          {activeTab === 'learn' && (
            <>
              <div className="mx-3 sm:mx-6 mt-3 mb-0">
                <button
                  onClick={() => navigate('/vocab-battle')}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl
                    bg-gradient-to-r from-red-50 to-orange-50
                    dark:from-red-900/20 dark:to-orange-900/20
                    border border-red-100 dark:border-red-800
                    hover:from-red-100 hover:to-orange-100
                    dark:hover:from-red-900/30 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/40
                    flex items-center justify-center shrink-0">
                    <Sword size={18} className="text-red-500" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">
                      {t('vocabHub.battleTitle')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('vocabHub.battleDesc')}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-red-500 group-hover:translate-x-0.5 transition-transform">
                    {t('vocabHub.battlePlay')}
                  </span>
                </button>
              </div>
              <Vocabulary />
            </>
          )}
          {activeTab === 'dictionary' && <Dictionary />}
          {activeTab === 'phrases' && <Phrases />}
          {activeTab === 'phrases-dict' && <PhraseDictionary />}
        </Suspense>
      </div>
    </div>
  )
}
