import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Tables } from '../types/supabase'

type DbDailyProgress = Tables<'daily_progress'>
type DbMockTest = Tables<'mock_tests'>
import { getTodayTashkent } from '../utils/tashkentDate'

function today(): string {
  return getTodayTashkent()
}

interface SkillResult {
  date:     string
  score:    number
  title?:   string
}

export function useProgress() {
  const [todayProgress, setTodayProgress] = useState<DbDailyProgress | null>(null)
  const [lastMockTest,  setLastMockTest]  = useState<DbMockTest       | null>(null)
  const [dbStreak,      setDbStreak]      = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [recentGrammar,   setRecentGrammar]   = useState<SkillResult[]>([])
  const [recentListening, setRecentListening]  = useState<SkillResult[]>([])
  const [recentReading,   setRecentReading]    = useState<SkillResult[]>([])
  const [recentSpeaking,  setRecentSpeaking]   = useState<SkillResult[]>([])
  const [recentWriting,   setRecentWriting]    = useState<SkillResult[]>([])
  const mutationCounterRef = useRef(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }

      const uid = session.user.id
      const dateStr = today()

      const [
        { data: progress },
        { data: mocks },
        { data: days },
        { data: grammarRows },
        { data: listeningRows },
        { data: readingRows },
        { data: speakingRows },
        { data: writingRows },
      ] = await Promise.all([
        supabase
          .from('daily_progress')
          .select('*')
          .eq('user_id', uid)
          .eq('date', dateStr)
          .maybeSingle(),

        supabase
          .from('mock_tests')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(1),

        supabase
          .from('daily_progress')
          .select('date')
          .eq('user_id', uid)
          .gte('total_minutes', 30)
          .order('date', { ascending: false })
          .limit(120),

        supabase
          .from('grammar_progress')
          .select('date, score, topic_title')
          .eq('user_id', uid)
          .order('completed_at', { ascending: false })
          .limit(30),

        supabase
          .from('listening_progress')
          .select('date, score, lesson_title')
          .eq('user_id', uid)
          .order('completed_at', { ascending: false })
          .limit(30),

        supabase
          .from('reading_progress')
          .select('date, score, text_title')
          .eq('user_id', uid)
          .order('completed_at', { ascending: false })
          .limit(30),

        supabase
          .from('speaking_progress')
          .select('date, avg_score, prompt_text')
          .eq('user_id', uid)
          .order('completed_at', { ascending: false })
          .limit(30),

        supabase
          .from('writings')
          .select('date, score, prompt')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(30),
      ])

      setTodayProgress(progress ?? null)
      setLastMockTest(mocks?.[0] ?? null)
      type Row = Record<string, unknown>
      setRecentGrammar((grammarRows ?? []).map((r: Row) => ({ date: r.date as string, score: r.score as number, title: r.topic_title as string })))
      setRecentListening((listeningRows ?? []).map((r: Row) => ({ date: r.date as string, score: r.score as number, title: r.lesson_title as string })))
      setRecentReading((readingRows ?? []).map((r: Row) => ({ date: r.date as string, score: r.score as number, title: r.text_title as string })))
      setRecentSpeaking((speakingRows ?? []).map((r: Row) => ({ date: r.date as string, score: (r.avg_score as number ?? 0) * 10, title: (r.prompt_text as string)?.slice(0, 60) })))
      setRecentWriting((writingRows ?? []).map((r: Row) => ({ date: r.date as string, score: ((r.score as number) ?? 0) * 10, title: (r.prompt as string)?.slice(0, 60) })))

      // Calculate streak from consecutive days
      function prevDate(s: string): string {
        const [y, m, d] = s.split('-').map(Number)
        return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().split('T')[0]
      }
      let streak = 0
      let expected = dateStr
      for (const row of (days ?? [])) {
        if (row.date === expected) {
          streak++
          expected = prevDate(expected)
        } else {
          break
        }
      }
      setDbStreak(streak)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xato yuz berdi')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function upsertTodayProgress(patch: Partial<Omit<DbDailyProgress, 'id' | 'user_id' | 'date' | 'created_at'>>) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const uid     = session.user.id
    const dateStr = today()
    const mutationId = ++mutationCounterRef.current

    // Optimistic: update local state immediately
    setTodayProgress((prev) => {
      if (!prev) return prev
      return { ...prev, ...patch }
    })

    // Background DB sync (fire-and-forget)
    supabase
      .from('daily_progress')
      .upsert(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { user_id: uid, date: dateStr, ...patch } as any,
        { onConflict: 'user_id,date' }
      )
      .select()
      .maybeSingle()
      .then(({ data }) => {
        // Only apply server data if this is still the latest mutation
        if (data && mutationCounterRef.current === mutationId) {
          setTodayProgress(data as DbDailyProgress)
        }
      })
  }

  return {
    todayProgress,
    lastMockTest,
    dbStreak,
    loading,
    error,
    recentGrammar,
    recentListening,
    recentReading,
    recentSpeaking,
    recentWriting,
    refresh: fetchData,
    upsertTodayProgress,
  }
}
