import { useState, useEffect } from 'react'
import { ArrowRight, FlaskConical } from 'lucide-react'
import { useI18n } from '../../i18n'
import FlashCard from '../../components/vocabulary/FlashCard'
import GrammarAnalysisPanel from '../../components/vocabulary/GrammarAnalysisPanel'
import { RATING_CONFIG } from '../../components/vocabulary/ratingConfig'
import { monitoring } from '../../lib/monitoring'
import { generateUzbekSentence, analyzeGrammar } from '../../lib/claude'
import { type GameWord } from '../../store/vocabularyStore'
import { type Rating } from '../../services/vocabularyService'

export default function FlashCardRenderer({
  word,
  onRate,
  onAdvance,
}: {
  word: GameWord
  onRate: (wordId: number, rating: Rating) => void
  onAdvance: () => void
}) {
  const { t } = useI18n()
  const [flipped, setFlipped] = useState(false)
  const [rated, setRated] = useState(false)
  const [analysisText, setAnalysisText] = useState('')
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisShown, setAnalysisShown] = useState(false)

  useEffect(() => {
    setFlipped(false)
    setRated(false)
    setAnalysisText('')
    setAnalysisLoading(false)
    setAnalysisShown(false)
  }, [word.word_id])

  return (
    <div>
      <FlashCard word={word} flipped={flipped} onFlip={() => setFlipped(true)} />

      {!rated && (
        <div className="mt-4 flex gap-2">
          {RATING_CONFIG.map(({ key, label, emoji, bg, color }) => (
            <button
              key={key}
              onClick={() => {
                setRated(true)
                onRate(word.word_id, key)
              }}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all ${bg} ${color}`}
            >
              <span className="text-lg">{emoji}</span>
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </div>
      )}

      {rated && (
        <div className="mt-4 space-y-3">
          {/* Analysis toggle */}
          {!analysisShown ? (
            <button
              onClick={async () => {
                setAnalysisShown(true)
                setAnalysisText('')
                setAnalysisLoading(true)
                try {
                  const sentence = await generateUzbekSentence(word.english, word.uzbek, word.level)
                  analyzeGrammar(
                    sentence,
                    word.english,
                    word.level,
                    (token) => setAnalysisText((p) => p + token),
                    () => setAnalysisLoading(false),
                    (err) => { monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'FlashCardRenderer:analyzeGrammar' }); setAnalysisLoading(false) }
                  )
                } catch (e) {
                  monitoring.captureMessage('FlashCardRenderer: analysis failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
                  setAnalysisLoading(false)
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl border-2 border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 hover:border-indigo-400 transition-all text-sm flex items-center justify-center gap-2"
            >
              <FlaskConical size={15} />
              {t('vocabPage.grammarAnalysis')}
            </button>
          ) : (
            <GrammarAnalysisPanel text={analysisText} loading={analysisLoading} />
          )}

          {/* Next button */}
          <button
            onClick={onAdvance}
            className="w-full py-3 bg-b1-500 text-white font-bold rounded-xl hover:bg-b1-600 transition-all text-sm flex items-center justify-center gap-2"
          >
            {t('vocabPage.nextButton')} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
