import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { monitoring } from '../lib/monitoring'
import { useStore } from '../store/useStore'
import { usePhrasesStore, getBatchPhrases, type GamePhrase } from '../store/phrasesStore'
import {
  savePhraseSession,
  fetchMonthPhraseSessions,
  type PhraseRating,
  type DailyPhraseRow,
  type DaySession,
} from '../services/phrasesService'
import { getCachedLevelTotals } from '../services/vocabularyService'
import { getTodayTashkent } from '../utils/tashkentDate'
import { PHRASE_BATCH_SIZE, PHRASES_PER_DAY } from '../utils/phraseConfig'

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2']

export function usePhraseData() {
  const { addXP, addLearnedWords, updateSkillProgress, toggleChecklistItem } = useStore()
  const {
    dailyPhrases, reviewPhrases, currentBatch, batchPhrases, currentIdx, viewMode,
    loading, correctCount,
    setDailyPhrases, setReviewPhrases, setLoading,
    selectBatch, selectReview, nextPhrase, ratePhrase, finishBatch, reset,
  } = usePhrasesStore()

  const learnedTransitioned = useRef<Set<number>>(new Set())
  const pendingSavesRef = useRef<Set<Promise<void>>>(new Set())
  const [sessionStart, setSessionStart] = useState<number>(0)
  const todayStr = getTodayTashkent()
  const [studyDate, setStudyDate] = useState(todayStr)

  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [userId, setUserId] = useState<string | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showTypingGame, setShowTypingGame] = useState(false)
  const [showScrambleGame, setShowScrambleGame] = useState(false)
  const [monthSessions, setMonthSessions] = useState<Map<string, DaySession>>(new Map())
  const [showExportModal, setShowExportModal] = useState(false)

  const [filterText, setFilterText] = useState('')
  const [filterLevel, setFilterLevel] = useState<Set<string>>(new Set())
  const [filterMastery, setFilterMastery] = useState<'all' | 'new' | 'learning' | 'learned'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const [levelCounts, setLevelCounts] = useState<Map<string, number>>(new Map())
  const [learnedCounts, setLearnedCounts] = useState<Map<string, number>>(new Map())

  const filteredBatchPhrases = useFilteredBatchPhrases(batchPhrases, filterText, filterLevel, filterMastery)

  function reloadMonthSessions(uid: string, year: number, month: number) {
    fetchMonthPhraseSessions(uid, year, month).then(setMonthSessions)
  }

  async function loadDailyData(targetDate?: string) {
    setLoading(true)
    if (pendingSavesRef.current.size > 0) {
      await Promise.allSettled([...pendingSavesRef.current])
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      if (!uid) { setLoading(false); return }
      setUserId(uid)
      const target = targetDate ?? getTodayTashkent()
      const tk = target.split('-').map(Number)
      reloadMonthSessions(uid, tk[0], tk[1] - 1)

      const [totals, reviewProgressRes, studiedRowsRes] = await Promise.all([
        getCachedLevelTotals('phrases', LEVEL_ORDER),
        supabase.from('phrase_progress')
          .select('phrase_id, box, next_review, correct_count, wrong_count, is_learned, last_rating')
          .eq('user_id', uid).lte('next_review', target).eq('is_learned', false),
        supabase.from('phrase_progress').select('phrase_id, phrases(level)').eq('user_id', uid),
      ])

      const totalsMap = new Map<string, number>(LEVEL_ORDER.map(l => [l, totals[l] ?? 0]))

      // phrases jadvalidan level ASC, id ASC bo'ylab yurib, phrase_progress da
      // umuman yo'q (hech qachon teginilmagan) birinchi 45 ta iborani olish.
      // Har bir batch bilan birga progress tekshiriladi.
      interface PhraseRow { id: number; english: string; uzbek: string; level: string; category: string | null }

// Supabase query natijalari uchun tiplar
interface PhraseProgressRow {
  phrase_id: number
  box: number
  next_review: string
  correct_count: number
  wrong_count: number
  is_learned: boolean
  last_rating: string | null
}

      const dailyPhraseRows: PhraseRow[] = []
      const FETCH_BATCH = PHRASES_PER_DAY * 2 // 90 tadan
      let dbOffset = 0
      while (dailyPhraseRows.length < PHRASES_PER_DAY) {
        const { data: rows, error: pe } = await supabase
          .from('phrases')
          .select('id, english, uzbek, level, category')
          .order('level', { ascending: true })
          .order('id', { ascending: true })
          .range(dbOffset, dbOffset + FETCH_BATCH - 1)
        if (pe) { monitoring.captureMessage(`phrases query error: ${pe.message}`, 'error'); break }
        if (!rows || rows.length === 0) break

        // Aynan shu batch'dagi iboralarning progressini tekshirish
        const phraseIds = rows.map(p => p.id)
        const { data: batchProg, error: bpErr } = await supabase
          .from('phrase_progress')
          .select('phrase_id')
          .eq('user_id', uid)
          .in('phrase_id', phraseIds)
        if (bpErr) { monitoring.captureMessage(`phrase progress query error: ${bpErr.message}`, 'error'); break }

        const batchSeen = new Set((batchProg ?? []).map((p: { phrase_id: number }) => p.phrase_id))

        for (const p of rows as PhraseRow[]) {
          if (!batchSeen.has(p.id)) {
            dailyPhraseRows.push(p)
            if (dailyPhraseRows.length >= PHRASES_PER_DAY) break
          }
        }
        dbOffset += rows.length
      }

      const reviewProgress = reviewProgressRes.data as PhraseProgressRow[] | null
      const dailyIds = dailyPhraseRows.map(p => p.id)
      const reviewCandidates = (reviewProgress ?? []).filter((r: PhraseProgressRow) => !dailyIds.includes(r.phrase_id))
      const reviewIds = reviewCandidates.map((r: PhraseProgressRow) => r.phrase_id)

      const [dailyProgressRes, reviewPhraseRes] = await Promise.all([
        dailyIds.length > 0
          ? supabase.from('phrase_progress')
              .select('phrase_id, box, next_review, correct_count, wrong_count, is_learned, last_rating')
              .eq('user_id', uid).in('phrase_id', dailyIds)
          : Promise.resolve({ data: [] as typeof reviewProgress }),
        reviewIds.length > 0
          ? supabase.from('phrases').select('id, english, uzbek, level, category').in('id', reviewIds)
          : Promise.resolve({ data: [] as { id: number; english: string; uzbek: string; level: string; category: string | null }[] }),
      ])
      const progressByPhrase = new Map((dailyProgressRes.data ?? []).map((p: PhraseProgressRow) => [p.phrase_id, p]))
      const reviewPhrasesMap = new Map((reviewPhraseRes.data ?? []).map((p: PhraseRow) => [p.id, p]))

      const todayPhrases: DailyPhraseRow[] = dailyPhraseRows.map(p => {
        const prog = progressByPhrase.get(p.id) as PhraseProgressRow | undefined
        return {
          phrase_id: p.id, english: p.english, uzbek: p.uzbek,
          level: p.level as DailyPhraseRow['level'], category: p.category as DailyPhraseRow['category'],
          box: prog?.box ?? 1, next_review: prog?.next_review ?? target,
          correct_count: prog?.correct_count ?? 0, wrong_count: prog?.wrong_count ?? 0,
          is_new: !prog, is_learned: prog?.is_learned ?? false,
          last_rating: prog?.last_rating ?? undefined,
        }
      })

      const reviewDuePhrases: DailyPhraseRow[] = reviewCandidates
        .map((reviewProg: PhraseProgressRow) => {
          const p = reviewPhrasesMap.get(reviewProg.phrase_id) as PhraseRow | undefined
          if (!p) return null
          return {
            phrase_id: p.id, english: p.english, uzbek: p.uzbek,
            level: p.level, category: p.category,
            box: reviewProg.box, next_review: reviewProg.next_review,
            correct_count: reviewProg.correct_count, wrong_count: reviewProg.wrong_count,
            is_new: false, is_learned: reviewProg.is_learned,
            last_rating: reviewProg.last_rating,
          } as DailyPhraseRow
        })
        .filter((r): r is DailyPhraseRow => r !== null)
        .sort((a, b) => a.next_review.localeCompare(b.next_review) || a.box - b.box)

      const studiedRows = studiedRowsRes.data
      const learnedCountsMap = new Map<string, number>()
      const studied = db.cast<{ phrase_id: string; phrases: { level: string } | null }[]>(studiedRows ?? [])
      for (const row of studied) {
        const lvl = row.phrases?.level
        if (typeof lvl === 'string') {
          learnedCountsMap.set(lvl, (learnedCountsMap.get(lvl) ?? 0) + 1)
        }
      }

      learnedTransitioned.current.clear()
      setDailyPhrases(todayPhrases)
      setReviewPhrases(reviewDuePhrases)
      setLevelCounts(totalsMap)
      setLearnedCounts(learnedCountsMap)
      setSessionStart(Date.now())
    } catch (e) {
      monitoring.captureMessage('loadPhraseData error: ' + (e instanceof Error ? e.message : String(e)), 'error')
    } finally {
      setLoading(false)
    }
  }

  async function savePhraseProgressToDB(
    phraseId: number,
    rating: PhraseRating,
    srsResult: { box: number; next_review: string; is_learned: boolean }
  ) {
    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id
    if (!uid) { monitoring.captureMessage('savePhraseProgressToDB: no uid', 'warn'); return }

    const store = usePhrasesStore.getState()
    const sp = [...store.dailyPhrases, ...store.reviewPhrases].find((d) => d.phrase_id === phraseId)
    const newCorrect = sp?.correct_count ?? 0
    const newWrong = sp?.wrong_count ?? 0

    const renderPhrases = [...dailyPhrases, ...reviewPhrases]
    const p = renderPhrases.find((d) => d.phrase_id === phraseId)

    const { error } = await supabase.from('phrase_progress').upsert({
      user_id: uid,
      phrase_id: phraseId,
      box: srsResult.box,
      next_review: srsResult.next_review,
      correct_count: newCorrect,
      wrong_count: newWrong,
      is_learned: srsResult.is_learned,
      last_rating: rating,
      last_reviewed: new Date().toISOString(),
    }, { onConflict: 'user_id,phrase_id' })

    if (error) {
      monitoring.captureMessage('savePhraseProgressToDB upsert error: ' + error.message, 'error')
      return
    }

    if (p) {
      if (srsResult.is_learned && !p.is_learned) {
        if (!learnedTransitioned.current.has(phraseId)) {
          learnedTransitioned.current.add(phraseId)
          addLearnedWords(1)
          addXP(5)
          setLearnedCounts((prev) => {
            const next = new Map(prev)
            next.set(p.level, (next.get(p.level) ?? 0) + 1)
            return next
          })
        }
      } else if (!srsResult.is_learned && p.is_learned) {
        learnedTransitioned.current.delete(phraseId)
        setLearnedCounts((prev) => {
          const next = new Map(prev)
          next.set(p.level, Math.max(0, (next.get(p.level) ?? 0) - 1))
          return next
        })
      }
    }
  }

  async function saveBatchSession(uid: string) {
    const batch = currentBatch
    if (batch <= 0 || batch > 3) return
    const allPhrases = dailyPhrases.slice((batch - 1) * PHRASE_BATCH_SIZE, batch * PHRASE_BATCH_SIZE)
    const phrasesJson: Record<string, PhraseRating> = {}
    allPhrases.forEach((p) => {
      const result = usePhrasesStore.getState().batchResults[p.phrase_id]
      if (result) phrasesJson[p.phrase_id.toString()] = result
    })
    const score = usePhrasesStore.getState().correctCount
    const time = Math.round((Date.now() - sessionStart) / 1000)
    await savePhraseSession(uid, batch, phrasesJson, score, time, selectedDate)
  }

  function handleRating(phraseId: number, rating: PhraseRating) {
    const srsRate = ratePhrase(phraseId, rating)
    const p = savePhraseProgressToDB(phraseId, rating, { box: srsRate.newBox, next_review: srsRate.nextReview, is_learned: srsRate.isLearned })
    pendingSavesRef.current.add(p); p.finally(() => pendingSavesRef.current.delete(p))
  }

  async function handleTestAnswer(correct: boolean) {
    if (correct) addXP(2)
    const phrase = batchPhrases[currentIdx]
    if (phrase) {
      const rating: PhraseRating = !correct ? 'bilmadim' : (phrase.last_rating === 'yodladim' ? 'yodladim' : 'bildim')
      const srs = ratePhrase(phrase.phrase_id, rating)
      await savePhraseProgressToDB(phrase.phrase_id, rating, { box: srs.newBox, next_review: srs.nextReview, is_learned: srs.isLearned })
    }
    const answeredSoFar = usePhrasesStore.getState().totalAnswered + 1
    updateSkillProgress('todayPhrasesPct', Math.round((answeredSoFar / Math.max(batchPhrases.length, 1)) * 100))
  }

  async function handleTestAdvance() {
    const totalInBatch = batchPhrases.length
    if (usePhrasesStore.getState().currentIdx + 1 >= totalInBatch) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        const uid = session.user.id
        await saveBatchSession(uid)
        reloadMonthSessions(uid, new Date().getFullYear(), new Date().getMonth())
      }
      finishBatch()
    } else {
      nextPhrase()
    }
  }

  async function handleGameComplete(score: number, total: number) {
    addXP(score * 3)
    updateSkillProgress('todayPhrasesPct', Math.round((score / total) * 100))
    usePhrasesStore.setState({ correctCount: score, totalAnswered: total })
    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id
    if (uid) {
      for (const p of batchPhrases.slice(0, total)) {
        const rating: PhraseRating = p.last_rating === 'yodladim' ? 'yodladim' : 'bildim'
        const srs = ratePhrase(p.phrase_id, rating)
        await savePhraseProgressToDB(p.phrase_id, rating, { box: srs.newBox, next_review: srs.nextReview, is_learned: srs.isLearned })
      }
      await saveBatchSession(uid)
      reloadMonthSessions(uid, new Date().getFullYear(), new Date().getMonth())
    }
    finishBatch()
  }

  function handleBatchComplete() {
    toggleChecklistItem('phrases')
    const today = getTodayTashkent()
    setStudyDate(today)
    setSelectedDate(today)
    loadDailyData(today)
  }

  function goToCatalog() {
    const s = usePhrasesStore.getState()
    usePhrasesStore.setState({
      viewMode: 'catalog',
      batchPhrases: getBatchPhrases(s.dailyPhrases, s.currentBatch),
      currentIdx: 0,
      correctCount: 0,
      totalAnswered: 0,
      batchResults: {},
    })
  }

  function enterStudyMode(mode: 'flashcard' | 'test' | 'game') {
    const s = usePhrasesStore.getState()
    const base = s.currentBatch === 0
      ? s.batchPhrases
      : s.batchPhrases.filter(p => !p.is_learned)
    if (base.length === 0) return
    const studyPhrases = [...base].sort(() => Math.random() - 0.5)
    usePhrasesStore.setState({
      viewMode: mode,
      batchPhrases: studyPhrases,
      currentIdx: 0,
      correctCount: 0,
      totalAnswered: 0,
      batchResults: {},
    })
  }

  useEffect(() => {
    const today = getTodayTashkent()
    setStudyDate(today)
    setSelectedDate(today)
    loadDailyData(today)
    return () => { reset() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const today = getTodayTashkent()
        if (studyDate !== today) {
          setStudyDate(today)
          setSelectedDate(today)
          loadDailyData(today)
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyDate])

  const levelStats = LEVEL_ORDER.map((lvl) => ({
    level: lvl,
    total: levelCounts.get(lvl) ?? 0,
    learned: learnedCounts.get(lvl) ?? 0,
    color: lvl === 'A1' ? 'bg-gray-400' : lvl === 'A2' ? 'bg-primary-500' : lvl === 'B1' ? 'bg-b1-500' : 'bg-b2-500',
  }))

  const totalLearned = Array.from(learnedCounts.values()).reduce((a, b) => a + b, 0)
  const dueTodayCount = dailyPhrases.filter((p) => !p.is_new && !p.is_learned && p.next_review <= todayStr).length
  const dueCount = dueTodayCount + reviewPhrases.length
  const currentPhrase = batchPhrases[currentIdx]

  return {
    dailyPhrases, reviewPhrases, currentBatch, batchPhrases, currentIdx, viewMode,
    loading, correctCount,
    selectedDate, setSelectedDate,
    userId,
    showCalendar, setShowCalendar,
    showAnalytics, setShowAnalytics,
    showTypingGame, setShowTypingGame,
    showScrambleGame, setShowScrambleGame,
    showExportModal, setShowExportModal,
    monthSessions,
    filterText, setFilterText,
    filterLevel, setFilterLevel,
    filterMastery, setFilterMastery,
    showFilters, setShowFilters,
    filteredBatchPhrases,
    levelStats,
    levelCounts,
    totalLearned,
    dueCount,
    currentPhrase,
    todayStr,
    loadDailyData,
    handleRating,
    handleTestAnswer,
    handleTestAdvance,
    handleGameComplete,
    handleBatchComplete,
    goToCatalog,
    enterStudyMode,
    selectBatch,
    selectReview,
    nextPhrase,
    ratePhrase,
    finishBatch,
    addXP,
    updateSkillProgress,
    toggleChecklistItem,
  }
}

function useFilteredBatchPhrases(
  batchPhrases: GamePhrase[],
  filterText: string,
  filterLevel: Set<string>,
  filterMastery: 'all' | 'new' | 'learning' | 'learned'
) {
  return batchPhrases.filter(p => {
    if (filterText.trim()) {
      const q = filterText.trim().toLowerCase()
      if (!p.english.toLowerCase().includes(q) && !p.uzbek.toLowerCase().includes(q)) return false
    }
    if (filterLevel.size > 0 && !filterLevel.has(p.level)) return false
    if (filterMastery === 'new' && !p.is_new) return false
    if (filterMastery === 'learning' && (p.is_new || p.is_learned)) return false
    if (filterMastery === 'learned' && !p.is_learned) return false
    return true
  })
}
