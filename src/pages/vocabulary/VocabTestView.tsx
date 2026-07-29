import { useI18n } from '../../i18n'
import WordTest from '../../components/vocabulary/WordTest'
import GrammarAnalysisPanel from '../../components/vocabulary/GrammarAnalysisPanel'
import { FlaskConical, ArrowRight } from 'lucide-react'
import type { GameWord } from '../../store/vocabularyStore'
import type { DailyWordRow } from '../../services/vocabularyService'

interface VocabTestViewProps {
  currentWord: GameWord
  allWords: DailyWordRow[]
  currentIdx: number
  totalWords: number
  testAnswered: boolean
  testAnalysisText: string
  testAnalysisLoading: boolean
  testAnalysisShown: boolean
  onAnswer: (correct: boolean) => void
  onAdvance: () => void
  onAnalyze: () => void
  onExit: () => void
}

export default function VocabTestView({
  currentWord, allWords, currentIdx, totalWords,
  testAnswered, testAnalysisText, testAnalysisLoading, testAnalysisShown,
  onAnswer, onAdvance, onAnalyze, onExit,
}: VocabTestViewProps) {
  const { t } = useI18n()

  return (
    <div className="p-3 sm:p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onExit} aria-label={t('accessibility.vocab.exitTest')} className="btn-ghost text-sm px-2 py-1">
          {t('vocabPage.exitButton')}
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">{currentIdx + 1} / {totalWords}</span>
          <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-b1-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalWords) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {!testAnswered ? (
        <WordTest
          word={currentWord}
          allWords={allWords}
          onAnswer={onAnswer}
        />
      ) : (
        <div className="space-y-3">
          {/* Analysis toggle */}
          {!testAnalysisShown ? (
            <button
              onClick={onAnalyze}
              aria-label={t('accessibility.vocab.grammarAnalysis')}
              className="w-full py-2.5 px-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 transition-all text-sm flex items-center justify-center gap-2"
            >
              <FlaskConical size={15} />
              {t('vocabPage.grammarAnalysis')}
            </button>
          ) : (
            <GrammarAnalysisPanel text={testAnalysisText} loading={testAnalysisLoading} />
          )}

          {/* Next button */}
          <button
            onClick={onAdvance}
            aria-label={t('accessibility.vocab.nextWord')}
            className="w-full py-3 bg-b1-500 text-white font-bold rounded-xl hover:bg-b1-600 transition-all text-sm flex items-center justify-center gap-2"
          >
            {t('vocabPage.nextButton')} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
