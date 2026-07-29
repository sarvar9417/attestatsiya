import { useState, useEffect, useMemo, useRef } from 'react'
import { RotateCcw, Brain, CheckCircle, Database } from 'lucide-react'
import { saveExerciseAnswersToDB, saveLessonVocabProgressToDB, loadLessonVocabProgressFromDB } from '../../services/lessonService'
import { speakWord } from '../../lib/tts'
import { pushWordsToSRS_FSRS as pushWordsToSRS, getReviewWordsForLesson } from '../../services/vocabularyService'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { AudioButton } from '../ui/AudioButton'
import { useI18n } from '../../i18n'
import type { TranslationStrings } from '../../i18n/types'
import type { Rating } from '../../services/vocabularyService'

const RULE_COLORS: Record<string, string> = {
  qisqa:   'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  uzun:    'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  'y bilan': 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
  'e bilan': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  cvc:     'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  notogri: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
}

const RULE_I18N: Record<string, string> = {
  qisqa: 'vocabLearner.ruleShort',
  uzun: 'vocabLearner.ruleLong',
  cvc: 'vocabLearner.ruleCVC',
  notogri: 'vocabLearner.ruleIncorrect',
}

const RULE_ORDER = ['qisqa', 'cvc', 'y bilan', 'e bilan', 'uzun', 'notogri']

const RULE_EMOJI: Record<string, string> = {
  qisqa: '🔤', cvc: '🔁', 'y bilan': '💛', 'e bilan': '➖', uzun: '📏', notogri: '⚡',
}

interface VocabWord {
  en: string
  uz: string
  example: string
  rule: string
}

export default function VocabLearner({ vocab, addXP, lessonId, lessonLevel, onVocabDone }: {
  vocab: VocabWord[]; addXP: (n: number) => void; lessonId: string; lessonLevel?: string; onVocabDone?: (pushedCount: number) => void
}) {
  const { t } = useI18n()
  const [mode, setMode] = useState<'browse' | 'flashcard' | 'vocabTest'>('browse')
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [knownIds, setKnownIds] = useState<Set<number>>(new Set())

  const [testSectionIdx, setTestSectionIdx] = useState(0)
  const [testIdx, setTestIdx] = useState(0)
  const [testScore, setTestScore] = useState(0)
  const [testResults, setTestResults] = useState<Record<number, boolean>>({})
  const [testSubmitted, setTestSubmitted] = useState<Record<number, boolean>>({})
  const [testDone, setTestDone] = useState(false)
  const [testShuffleKey, setTestShuffleKey] = useState(0)

  const [miniQuizMode, setMiniQuizMode] = useState(false)
  const [reviewWords, setReviewWords] = useState<{ en: string; uz: string; example?: string }[]>([])
  const [reviewQuizActive, setReviewQuizActive] = useState(false)
  const [reviewQuizWords, setReviewQuizWords] = useState<{ en: string; uz: string; example?: string }[]>([])
  const [srsPushing, setSrsPushing] = useState(false)
  const [srsPushed, setSrsPushed] = useState(false)
  const autoPushedRef = useRef(false)

  const vocabQuizRef = useRef<{ wordIndex?: number; word?: string; correct: number; wrong: number }[]>([])
  const storageKey = `vocab-progress-${lessonId}`

  useEffect(() => {
    let localKnownIds = new Set<number>()
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.knownIds) { localKnownIds = new Set(data.knownIds); setKnownIds(localKnownIds) }
        if (data.testScore != null) setTestScore(data.testScore)
        if (data.testSectionIdx != null) setTestSectionIdx(data.testSectionIdx)
        if (data.testIdx != null) setTestIdx(data.testIdx)
        if (data.testResults) setTestResults(data.testResults)
        if (data.testSubmitted) setTestSubmitted(data.testSubmitted)
        if (data.testDone != null) setTestDone(data.testDone)
        if (data.testShuffleKey != null) setTestShuffleKey(data.testShuffleKey)
      }
    } catch (e) {
      monitoring.captureMessage('Failed to load vocab progress from localStorage: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    }

    loadLessonVocabProgressFromDB(lessonId).then(items => {
      if (items.length === 0) return
      const remoteKnown = new Set(items.filter(i => i.known).map(i => i.wordIndex))
      const merged = new Set([...localKnownIds, ...remoteKnown])
      if (merged.size > localKnownIds.size) setKnownIds(merged)
    })
   
  }, [storageKey, lessonId])

  const prevStateRef = useRef({ knownIds, testScore, testSectionIdx, testIdx, testResults, testSubmitted, testDone, testShuffleKey })
  useEffect(() => {
    const cur = { knownIds, testScore, testSectionIdx, testIdx, testResults, testSubmitted, testDone, testShuffleKey }
    if (JSON.stringify(cur) === JSON.stringify(prevStateRef.current)) return
    prevStateRef.current = cur
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        knownIds: [...knownIds], testScore, testSectionIdx, testIdx, testResults, testSubmitted, testDone, testShuffleKey,
      }))
    } catch (e) {
      monitoring.captureMessage('Failed to save vocab progress to localStorage: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    }
   
  }, [knownIds, testScore, testSectionIdx, testIdx, testResults, testSubmitted, testDone, testShuffleKey, storageKey])

  useEffect(() => {
    if (knownIds.size === 0) return
    const items = [...knownIds].map(wordIndex => {
      const quiz = vocabQuizRef.current.find(e => e.wordIndex === wordIndex)
      return { wordIndex, known: true, quizCorrect: quiz?.correct ?? 0, quizWrong: quiz?.wrong ?? 0 }
    })
    saveLessonVocabProgressToDB(lessonId, items)
   
  }, [knownIds, lessonId])

  useEffect(() => {
    if (!testDone || vocabQuizRef.current.length === 0) return
    const items = vocabQuizRef.current.filter(e => e.wordIndex !== undefined).map(e => ({
      wordIndex: e.wordIndex!, known: knownIds.has(e.wordIndex!), quizCorrect: e.correct, quizWrong: e.wrong,
    }))
    if (items.length > 0) saveLessonVocabProgressToDB(lessonId, items)
   
  }, [testDone, knownIds, lessonId])

  // ── Auto-push to SRS when test completes or all flashcards known ──
  useEffect(() => {
    const shouldAutoPush = (mode === 'vocabTest' && testDone) || (mode === 'flashcard' && knownIds.size === vocab.length && vocab.length > 0)
    if (shouldAutoPush && !srsPushed && !autoPushedRef.current && !srsPushing) {
      autoPushedRef.current = true
      pushToSRS()
      onVocabDone?.(vocabQuizRef.current.length)
    }
    // pushToSRS — guard (autoPushedRef/srsPushed/srsPushing) bilan himoyalangan, qayta-trigger shart emas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testDone, knownIds.size, mode, vocab.length, srsPushed, srsPushing, onVocabDone])

  // ── Auto-play pronunciation when flashcard changes ──────────────────
  const prevCardRef = useRef<number>(-1)
  useEffect(() => {
    if (mode !== 'flashcard') return
    const word = vocab[cardIdx]
    if (word && cardIdx !== prevCardRef.current) {
      speakWord(word.en).catch((e) => monitoring.captureMessage('VocabLearner speakWord failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
    }
    prevCardRef.current = cardIdx
  }, [cardIdx, mode, vocab])

  // ── Flashcard auto-advance (2s after flip) ────────────────────────
  const flipAutoTimerRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    if (mode !== 'flashcard' || !flipped || cardIdx >= vocab.length - 1) {
      if (flipAutoTimerRef.current) { clearTimeout(flipAutoTimerRef.current); flipAutoTimerRef.current = undefined }
      return
    }
    flipAutoTimerRef.current = setTimeout(() => {
      setFlipped(false); setCardIdx(i => i + 1)
    }, 2000)
    return () => { if (flipAutoTimerRef.current) { clearTimeout(flipAutoTimerRef.current); flipAutoTimerRef.current = undefined } }
  }, [flipped, cardIdx, mode, vocab.length])

  // ── Load SRS review words for browse mode ───────────────────────────
  useEffect(() => {
    if (mode !== 'browse' || vocab.length === 0) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user?.id) return
      getReviewWordsForLesson(session.user.id, lessonLevel ?? 'A1', 5).then(words => {
        setReviewWords(words.map(w => ({ en: w.english, uz: w.uzbek, example: w.example })))
      })
    })
  }, [mode, lessonLevel, vocab.length])

  const testSections = useMemo(() => [
    { title: '🇬🇧→🇺🇿', desc: t('vocabLearner.testEnToUz'), ids: [] as number[], icon: '🌱' },
    { title: '🇺🇿→🇬🇧', desc: t('vocabLearner.testUzToEn'), ids: [] as number[], icon: '📘' },
    { title: '📝 Misol', desc: t('vocabLearner.testUsage'), ids: [] as number[], icon: '💪' },
    { title: '🏆 Aralash', desc: t('vocabLearner.testMixed'), ids: [] as number[], icon: '🏆' },
  ], [t])

  function dedupeOptions(options: string[]): string[] {
    return [...new Set(options)]
  }

  function buildQuestions(sourceVocab: typeof vocab): { section: number; stem: string; options: string[]; correct: string; word: typeof vocab[0] }[] {
    const qs: { section: number; stem: string; options: string[]; correct: string; word: typeof vocab[0] }[] = []
    const shuffled = [...sourceVocab].sort(() => Math.random() - 0.5)
    shuffled.forEach((v) => {
      const others = sourceVocab.filter(o => o.uz !== v.uz).sort(() => Math.random() - 0.5)
      const distractUz = dedupeOptions(others.slice(0, 3).map(o => o.uz))
      const distractEn = dedupeOptions(others.slice(0, 3).map(o => o.en))
      while (distractUz.length < 3) distractUz.push(sourceVocab[Math.floor(Math.random() * sourceVocab.length)].uz)
      while (distractEn.length < 3) distractEn.push(sourceVocab[Math.floor(Math.random() * sourceVocab.length)].en)
      qs.push({ section: 0, stem: v.en, options: dedupeOptions([v.uz, ...distractUz]).sort(() => Math.random() - 0.5), correct: v.uz, word: v })
      qs.push({ section: 1, stem: v.uz, options: dedupeOptions([v.en, ...distractEn]).sort(() => Math.random() - 0.5), correct: v.en, word: v })
      const blanked = v.example.replace(v.en, '______')
      if (blanked !== v.example) {
        const disturbEx = dedupeOptions(others.slice(0, 3).map(o => o.en))
        while (disturbEx.length < 3) disturbEx.push(sourceVocab[Math.floor(Math.random() * sourceVocab.length)].en)
        qs.push({ section: 2, stem: blanked, options: dedupeOptions([v.en, ...disturbEx]).sort(() => Math.random() - 0.5), correct: v.en, word: v })
      }
    })
    return qs.sort(() => Math.random() - 0.5)
  }

  const allQuestions = useMemo(() => {
    if (reviewQuizActive && reviewQuizWords.length > 0) {
      const mapped = reviewQuizWords.map(rw => ({
        en: rw.en, uz: rw.uz, example: rw.example ?? '', rule: '',
      })) as typeof vocab
      return buildQuestions(mapped)
    }
    const qs = buildQuestions(vocab)
    const sectionSize = Math.ceil(qs.length / 4)
    testSections.forEach((_, si) => {
      const start = si * sectionSize
      const end = start + sectionSize
      testSections[si].ids = qs.slice(start, end).map((_, qi) => start + qi)
    })
    return qs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocab, reviewQuizWords, reviewQuizActive, testShuffleKey])

  const currentSectionQuestions = useMemo(() => {
    if (reviewQuizActive) {
      return allQuestions.slice(0, Math.min(15, allQuestions.length))
    }
    const ids = testSections[testSectionIdx]?.ids ?? []
    const all = ids.map(i => allQuestions[i]).filter(Boolean)
    return miniQuizMode ? all.slice(0, 5) : all
  }, [testSectionIdx, allQuestions, testSections, miniQuizMode, reviewQuizActive])

  const currentQ = currentSectionQuestions[testIdx]

  const handleTestAnswer = (opt: string) => {
    if (!currentQ || testSubmitted[testIdx]) return
    const ok = opt === currentQ.correct
    setTestResults(prev => ({ ...prev, [testIdx]: ok }))
    setTestSubmitted(prev => ({ ...prev, [testIdx]: true }))
    if (ok) { setTestScore(s => s + 1); addXP(5) }
    const exerciseId = 100000 + testSectionIdx * 1000 + testIdx
    saveExerciseAnswersToDB(lessonId, testSectionIdx, 'test', [
      { exerciseId, exerciseType: 'vocab-test', answer: [opt], isCorrect: ok },
    ])
    if (reviewQuizActive) {
      const entry = vocabQuizRef.current.find(e => e.word === currentQ.word.en)
      if (entry) { if (ok) entry.correct++; else entry.wrong++ }
      else { vocabQuizRef.current.push({ word: currentQ.word.en, correct: ok ? 1 : 0, wrong: ok ? 0 : 1 }) }
    } else {
      const wordIdx = vocab.indexOf(currentQ.word)
      if (wordIdx !== -1) {
        const entry = vocabQuizRef.current.find(e => e.wordIndex === wordIdx)
        if (entry) { if (ok) entry.correct++; else entry.wrong++ }
        else { vocabQuizRef.current.push({ wordIndex: wordIdx, correct: ok ? 1 : 0, wrong: ok ? 0 : 1 }) }
      }
    }
  }

  const nextTest = () => {
    if (testIdx < currentSectionQuestions.length - 1) { setTestIdx(i => i + 1) }
    else if (miniQuizMode || testSectionIdx >= testSections.length - 1) { setTestDone(true) }
    else { setTestSectionIdx(si => si + 1); setTestIdx(0); setTestResults({}); setTestSubmitted({}) }
  }

  const retakeTest = () => {
    setTestShuffleKey(k => k + 1); setTestSectionIdx(0); setTestIdx(0); setTestScore(0)
    setTestResults({}); setTestSubmitted({}); setTestDone(false)
  }

  const startTest = () => {
    setMode('vocabTest'); setCardIdx(0); setFlipped(false); setTestShuffleKey(k => k + 1)
    setTestSectionIdx(0); setTestIdx(0); setTestScore(0); setTestResults({}); setTestSubmitted({}); setTestDone(false)
    setMiniQuizMode(false); setSrsPushed(false)
    vocabQuizRef.current = []
  }

  const startReviewQuiz = () => {
    if (reviewWords.length === 0) return
    setReviewQuizWords(reviewWords)
    setReviewQuizActive(true)
    setMode('vocabTest'); setCardIdx(0); setFlipped(false); setTestShuffleKey(k => k + 1)
    setTestSectionIdx(0); setTestIdx(0); setTestScore(0); setTestResults({}); setTestSubmitted({}); setTestDone(false)
    setMiniQuizMode(true); setSrsPushed(false)
    vocabQuizRef.current = []
  }

  const startMiniQuiz = () => {
    setReviewQuizActive(false)
    setReviewQuizWords([])
    setMode('vocabTest'); setCardIdx(0); setFlipped(false); setTestShuffleKey(k => k + 1)
    setTestSectionIdx(0); setTestIdx(0); setTestScore(0); setTestResults({}); setTestSubmitted({}); setTestDone(false)
    setMiniQuizMode(true); setSrsPushed(false)
    vocabQuizRef.current = []
  }

  async function pushToSRS() {
    setSrsPushing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) return
      const words = vocabQuizRef.current.map(e => {
        let wordEn = ''
        let wordUz = ''
        let wordExample = ''
        if (e.wordIndex !== undefined) {
          const w = vocab[e.wordIndex]
          if (!w) return null
          wordEn = w.en; wordUz = w.uz; wordExample = w.example
        } else if (e.word) {
          const w = vocab.find(v => v.en === e.word)
          if (w) { wordEn = w.en; wordUz = w.uz; wordExample = w.example }
          else { const rw = reviewQuizWords.find(r => r.en === e.word); if (!rw) return null; wordEn = rw.en; wordUz = rw.uz; wordExample = rw.example ?? '' }
        } else return null
        const total = e.correct + e.wrong
        const ratio = total > 0 ? e.correct / total : 1
        const rating: Rating = ratio >= 0.8 ? 'bildim' : ratio >= 0.5 ? 'qiynaldim' : 'bilmadim'
        return { english: wordEn, rating, uzbek: wordUz, example: wordExample, level: lessonLevel }
      }).filter(Boolean) as { english: string; rating: Rating; uzbek?: string; example?: string; level?: string }[]
      if (words.length === 0) return
      await pushWordsToSRS(session.user.id, words)
      setSrsPushed(true)
      addXP(words.length * 5)
      monitoring.captureMessage(`Pushed ${words.length} words to SRS for lesson ${lessonId}`, 'info')
    } catch (e) {
      monitoring.captureMessage('SRS push error: ' + (e instanceof Error ? e.message : String(e)), 'error')
    } finally {
      setSrsPushing(false)
    }
  }

  const mods = [
    { key: 'browse', label: t('vocabLearner.tabBrowse') },
    { key: 'flashcard', label: t('vocabLearner.tabFlashcard') },
    { key: 'vocabTest', label: t('vocabLearner.tabTest') },
  ] as const

  const tabBar = (
    <div className="flex items-center gap-2 mb-1">
      {mods.map(m => (
        <button key={m.key} onClick={m.key === 'vocabTest' ? startTest : () => { setMode(m.key); setCardIdx(0); setFlipped(false) }}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
            mode === m.key ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}>
          {m.label}
        </button>
      ))}
    </div>
  )

  const mappedRules = new Set(RULE_ORDER)
  const allRules = [...new Set(vocab.map((v) => v.rule))]
  const grouped = [
    ...RULE_ORDER.filter((r) => vocab.some((v) => v.rule === r)).map((r) => ({ rule: r, words: vocab.filter((v) => v.rule === r) })),
    ...allRules.filter((r) => !mappedRules.has(r)).map((r) => ({ rule: r, words: vocab.filter((v) => v.rule === r) })),
  ]

  if (mode === 'browse') {
    return (
      <div className="space-y-4">
        {tabBar}

        {/* SRS review words section */}
        {reviewWords.length > 0 && (
          <div className="rounded-xl border border-violet-100 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 p-3 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-violet-500" />
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">{t('vocabLearner.reviewFor')}</span>
              <span className="text-xs text-violet-400 dark:text-violet-500">{t('vocabLearner.nWords', { count: reviewWords.length })}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {reviewWords.map((w, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-lg px-2.5 py-1.5 border border-violet-100 dark:border-violet-700">
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{w.en}</span>
                  <AudioButton text={w.en} size="sm" />
                  <span className="text-xs text-gray-400 dark:text-gray-500">— {w.uz}</span>
                </div>
              ))}
            </div>
            <button onClick={startReviewQuiz} className="mt-2 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors">
              🧠 {t('vocabLearner.miniQuizReview')}
            </button>
          </div>
        )}

        {grouped.map((g) => {
          const rc = { label: RULE_I18N[g.rule] ? t(RULE_I18N[g.rule] as keyof TranslationStrings) : g.rule, color: RULE_COLORS[g.rule] ?? 'bg-gray-100 text-gray-600' }
          return (
            <div key={g.rule}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`badge text-xs font-bold ${rc.color}`}>{RULE_EMOJI[g.rule]} {rc.label}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{t('vocabLearner.nWords', { count: g.words.length })}</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="py-2 px-3 font-semibold">{t('vocabLearner.headerEnglish')}</th>
                      <th className="py-2 px-3 font-semibold">{t('vocabLearner.headerUzbek')}</th>
                      <th className="py-2 px-3 font-semibold hidden md:table-cell">{t('vocabLearner.headerExample')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.words.map((v, i) => (                        <tr key={i} className="border-t border-gray-50 dark:border-gray-800">
                        <td className="py-1.5 px-3 font-semibold text-gray-900 dark:text-gray-100 text-xs flex items-center gap-1">
                          {v.en}
                          <AudioButton text={v.en} size="sm" />
                        </td>
                        <td className="py-1.5 px-3 text-gray-600 dark:text-gray-400 text-xs">{v.uz}</td>
                        <td className="py-1.5 px-3 text-gray-400 dark:text-gray-500 italic text-xs hidden md:table-cell">{v.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (mode === 'flashcard') {
    const word = vocab[cardIdx]
    if (!word) return null
    const isKnown = knownIds.has(cardIdx)
    const remaining = vocab.length - knownIds.size

    return (
      <div className="space-y-4">
        {tabBar}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">{cardIdx + 1} / {vocab.length}</p>
          {remaining > 0 && <p className="text-xs text-green-600 font-medium">{t('vocabLearner.flashKnown', { count: knownIds.size })}</p>}
          {remaining === 0 && <p className="text-xs text-green-600 font-bold">{t('vocabLearner.flashAllKnown')}</p>}
        </div>
        <div className="progress-bar">
          <div className="progress-fill bg-primary-500" style={{ width: `${(knownIds.size / vocab.length) * 100}%` }} />
        </div>
        <div onClick={() => setFlipped(!flipped)} className="cursor-pointer select-none">
          <div className={`relative w-full min-h-[200px] rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-3 sm:p-6 ${
            flipped ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:shadow-md'
          }`}>
            <div className="text-center">
              {!flipped ? (
                <>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{t('vocabLearner.flashEnglish')}</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{word.en}</p>
                    <AudioButton text={word.en} size="md" />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">{t('vocabLearner.flashTapReveal')}</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-primary-500 mb-2">{t('vocabLearner.flashUzbek')}</p>
                  <p className="text-2xl font-bold text-primary-700 mb-2">{word.uz}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-2">"{word.example}"</p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <AudioButton text={word.en} size="sm" label={t('vocabLearner.flashListenAgain')} />
                    <span className={`badge text-xs ${RULE_COLORS[word.rule] ?? 'bg-gray-100 text-gray-600'}`}>
                      {RULE_EMOJI[word.rule]} {RULE_I18N[word.rule] ? t(RULE_I18N[word.rule] as keyof TranslationStrings) : word.rule}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">{t('vocabLearner.flashTapHide')}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => { if (cardIdx > 0) { setCardIdx(i => i - 1); setFlipped(false) } }}
            disabled={cardIdx === 0} className="btn-secondary px-4 py-2 text-sm">{t('vocabLearner.flashPrev')}</button>
          <button onClick={() => { setKnownIds(prev => new Set(prev).add(cardIdx)); if (cardIdx < vocab.length - 1) { setCardIdx(i => i + 1); setFlipped(false) } }}
            disabled={isKnown} className="btn-primary px-4 py-2 text-sm">
            {isKnown ? t('vocabLearner.flashKnowKnown') : t('vocabLearner.flashKnowUnknown')}
          </button>
          <button onClick={() => { if (cardIdx < vocab.length - 1) { setCardIdx(i => i + 1); setFlipped(false) } }}
            disabled={cardIdx === vocab.length - 1} className="btn-secondary px-4 py-2 text-sm">{t('vocabLearner.flashNext')}</button>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {vocab.map((_, i) => (
            <button key={i} onClick={() => { setCardIdx(i); setFlipped(false) }}
              className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                knownIds.has(i) ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' :
                i === cardIdx ? 'bg-primary-600 text-white' :
                'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>{i + 1}</button>
          ))}
        </div>
        {knownIds.size === vocab.length && (
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800 text-center py-4 animate-slide-up">
            <p className="font-bold text-green-700 dark:text-green-400 text-lg">{t('vocabLearner.flashCongrats')}</p>
            <p className="text-sm text-green-600 dark:text-green-400">{t('vocabLearner.flashLearnedAll', { count: vocab.length })}</p>
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <button onClick={startMiniQuiz} className="btn-primary text-sm">{t('vocabLearner.flashMiniQuiz')}</button>
              <button onClick={startTest} className="btn-secondary text-sm">{t('vocabLearner.flashFullTest')}</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (mode === 'vocabTest') {
    if (vocab.length === 0) return <div className="card text-center py-6 text-gray-500 dark:text-gray-400">{t('vocabLearner.testNoWords')}</div>

    if (testDone) {
      const total = miniQuizMode ? Math.min(5, allQuestions.length) : allQuestions.length
      const pct = total > 0 ? Math.round((testScore / total) * 100) : 0
      return (
        <div className="space-y-4">
          {tabBar}
          <div className="card text-center py-6 bg-gradient-to-b from-green-50 dark:from-green-900/30 to-white dark:to-gray-800 border-green-200 dark:border-green-800">
            <p className="text-5xl mb-2">🏆</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{testScore}/{total}</p>
            <p className="text-lg font-bold text-primary-600 mb-2">{pct}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pct === 100 ? t('vocabLearner.testPerfect') :
               pct >= 80 ? t('vocabLearner.testGreat') :
               pct >= 60 ? t('vocabLearner.testGood') :
               t('vocabLearner.testTryAgain')}
            </p>

            {/* SRS push button */}
            {!srsPushed ? (
              <button onClick={pushToSRS} disabled={srsPushing}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:from-violet-600 hover:to-indigo-600 disabled:opacity-50 transition-all">
                <Database size={14} className="inline mr-1.5" />
                {srsPushing ? t('vocabLearner.testSaving') : t('vocabLearner.testSaveSRS')}
              </button>
            ) : (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400 font-semibold animate-slide-up">
                <CheckCircle size={16} /> {t('vocabLearner.testSaved')}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={retakeTest} className="btn-secondary text-sm"><RotateCcw size={14} /> {t('vocabLearner.testRestart')}</button>
              <button onClick={() => setMode('flashcard')} className="btn-primary text-sm">{t('vocabLearner.tabFlashcard')}</button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {tabBar}
        {/* Section tabs — hidden during mini-quiz */}
        {!miniQuizMode && (
          <div className="flex gap-1 overflow-x-auto pb-1">
            {testSections.map((s, si) => (
              <button key={si} onClick={() => { setTestSectionIdx(si); setTestIdx(0); setTestResults({}); setTestSubmitted({}) }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  si === testSectionIdx ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                {s.icon} {s.title}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          {miniQuizMode ? (
            <p className="text-xs font-semibold text-violet-500 dark:text-violet-400">{t('vocabLearner.testMiniQuiz')}</p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('vocabLearner.testSectionOf', { current: testSectionIdx + 1, total: testSections.length })}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">🏆 {testScore} / {miniQuizMode ? Math.min(5, allQuestions.length) : allQuestions.length}</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill bg-primary-500" style={{ width: `${(testIdx / Math.max(currentSectionQuestions.length, 1)) * 100}%` }} />
        </div>

        {currentSectionQuestions.length === 0 ? (
          <div className="card text-center py-6 text-gray-500 dark:text-gray-400">
            {t('vocabLearner.testNoQuestions')}
            <button onClick={nextTest} className="btn-primary mt-3 text-sm block mx-auto">{t('vocabLearner.testNextSection')}</button>
          </div>
        ) : currentQ ? (
          <>
            <div className="rounded-2xl border-2 border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/30 p-3 sm:p-6 text-center">
              {miniQuizMode ? (
                <p className="text-xs text-violet-400 dark:text-violet-300 mb-2 font-semibold">{t('vocabLearner.testQuizTitle')}</p>
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{testSections[testSectionIdx]?.title}</p>
              )}
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{currentQ.stem}</p>
              {!miniQuizMode && testSectionIdx === 2 && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{t('vocabLearner.testFillBlank')}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentQ.options.map((opt, oi) => {
                let cls = 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                if (testSubmitted[testIdx]) {
                  if (opt === currentQ.correct) cls = 'border-green-400 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 font-bold'
                  else cls = 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                }
                return (
                  <button key={oi} disabled={!!testSubmitted[testIdx]} onClick={() => handleTestAnswer(opt)}
                    className={`rounded-xl px-3 py-3 text-sm font-medium transition-all ${cls}`}>{opt}</button>
                )
              })}
            </div>
            {testSubmitted[testIdx] && (
              <div className={`card text-center py-3 ${testResults[testIdx] ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'}`}>
                <p className={`font-bold ${testResults[testIdx] ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {testResults[testIdx] ? t('vocabLearner.testCorrect', { xp: 5 }) : t('vocabLearner.testWrong')}
                </p>
                {!testResults[testIdx] && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t('vocabLearner.testCorrectAnswer')} <strong>{currentQ.correct}</strong></p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">"{currentQ.word.example}"</p>
                <button onClick={nextTest} className="btn-primary mt-3 text-sm">
                  {testIdx < currentSectionQuestions.length - 1 ? t('vocabLearner.testNextQuestion') :
                   testSectionIdx < testSections.length - 1 ? t('vocabLearner.testNextSection') : t('vocabLearner.testFinish')}
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    )
  }

  return null
}
