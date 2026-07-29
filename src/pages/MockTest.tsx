import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { getTodayTashkent } from '@/utils/tashkentDate'
import { supabase } from '@/lib/supabase'
import { monitoring } from '@/lib/monitoring'
import { db } from '@/db/database'
import { fetchMockTestData, saveMockTestResult, type MockTestData } from '@/services/mockTestService'
import { fetchReadingTexts } from '@/services/readingService'
import { fetchSpeakingPrompts } from '@/services/speakingService'
import MockTestSelectScreen from '../components/mockTest/MockTestSelectScreen'
import MockTestWeeklyTest from '../components/mockTest/MockTestWeeklyTest'
import MockTestIELTSReading from '../components/mockTest/MockTestIELTSReading'
import MockTestIELTSListening from '../components/mockTest/MockTestIELTSListening'
import MockTestIELTSWriting from '../components/mockTest/MockTestIELTSWriting'
import MockTestIELTSSpeaking from '../components/mockTest/MockTestIELTSSpeaking'
import MockTestResultScreen from '../components/mockTest/MockTestResultScreen'
import {
  type TestType, type View, type IELTSScores, type ResultData,
} from '../components/mockTest/mockTestHelpers'
import { roundBand, pctToBand, scoreToBand } from '@/data/mockTestData'

export default function MockTest() {
  const { addXP, currentDay } = useStore()
  const [view,      setView]      = useState<View>('select')
  const [testType,  setTestType]  = useState<TestType>('b1')
  const [result,    setResult]    = useState<ResultData | null>(null)
  const [mockData,  setMockData]  = useState<MockTestData | null>(null)
  const [readingTexts, setReadingTexts] = useState<import('@/data/reading').ReadingText[]>([])
  const [speakingPrompts, setSpeakingPrompts] = useState<import('@/services/speakingService').SpeakingPrompt[]>([])

  useEffect(() => {
    const err = (ctx: string) => (e: unknown) => monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: ctx })
    fetchMockTestData('B1').then(setMockData).catch(err('fetchMockTestData'))
    fetchReadingTexts().then(setReadingTexts).catch(err('fetchReadingTexts'))
    fetchSpeakingPrompts().then(setSpeakingPrompts).catch(err('fetchSpeakingPrompts'))
  }, [])

  const ieltsRef = useRef<Partial<IELTSScores>>({})

  async function saveResult(data: ResultData): Promise<number | undefined> {
    const prev = await db.mockTests.orderBy('createdAt').last()

    const isIELTS = data.type === 'ielts'
    const score = isIELTS ? Math.round(data.overallBand * 100 / 9) : Math.round(data.overallBand)
    const prevScore = prev ? prev.totalScore : undefined

    const level = isIELTS
      ? data.overallBand >= 7 ? 'B2' : data.overallBand >= 6 ? 'B1+' : 'B1'
      : data.overallBand >= 80 ? 'B2' : data.overallBand >= 65 ? 'B1+' : 'B1'

    const sections = {
      reading:  data.ielts?.reading ?? 0,
      listening:data.ielts?.listening ?? 0,
      grammar:  0,
      writing:  data.ielts ? Math.round(((data.ielts.writingT1 + data.ielts.writingT2) / 2) * 10) : 0,
      speaking: data.ielts ? Math.round(((data.ielts.speaking1 + data.ielts.speaking2) / 2) * 10) : 0,
    }
    const todayDate = getTodayTashkent()
    const week = Math.ceil(currentDay / 7)

    await db.mockTests.add({
      date: todayDate,
      day:  currentDay,
      week,
      type: isIELTS ? 'monthly' : 'weekly',
      sections,
      totalScore:      score,
      level,
      durationMinutes: isIELTS ? 105 : data.type === 'b2' ? 60 : 45,
      createdAt:       Date.now(),
    })

    addXP(Math.round(score / 2))

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) {
        saveMockTestResult({
          userId: session.user.id,
          date: todayDate,
          day: currentDay,
          week,
          type: isIELTS ? 'monthly' : 'weekly',
          sections,
          totalScore: score,
          level,
        })
      }
    })
    return prevScore
  }

  function startTest(type: TestType) {
    setTestType(type)
    ieltsRef.current = {}
    const level = type === 'a1' ? 'A1' : type === 'b2' ? 'B2' : 'B1'
    fetchMockTestData(level).then(setMockData)
    if (type === 'a1' || type === 'b1' || type === 'b2') setView('weekly')
    else setView('ielts-reading')
  }

  async function handleWeeklyDone(correct: number, total: number) {
    const pct = Math.round((correct / total) * 100)
    const data: ResultData = {
      type: testType,
      weeklyScore: correct,
      weeklyTotal: total,
      overallBand: pct,
    }
    try {
      const prevScore = await saveResult(data)
      setResult({ ...data, prevScore })
    } catch (e) {
      monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: 'handleWeeklyDone' })
      setResult(data)
    }
    setView('result')
  }

  function handleReadingDone(pct: number) {
    ieltsRef.current.reading = pct
    setView('ielts-listening')
  }

  function handleListeningDone(pct: number) {
    ieltsRef.current.listening = pct
    setView('ielts-writing')
  }

  function handleWritingDone(t1: number, t2: number) {
    ieltsRef.current.writingT1 = t1
    ieltsRef.current.writingT2 = t2
    setView('ielts-speaking')
  }

  async function handleSpeakingDone(s1: number, s2: number) {
    ieltsRef.current.speaking1 = s1
    ieltsRef.current.speaking2 = s2
    const sc = ieltsRef.current as IELTSScores
    const bands = [
      pctToBand(sc.reading),
      pctToBand(sc.listening),
      scoreToBand((sc.writingT1 + sc.writingT2) / 2),
      scoreToBand((sc.speaking1 + sc.speaking2) / 2),
    ]
    const overall = roundBand(bands.reduce((a, b) => a + b, 0) / bands.length)
    const data: ResultData = { type: 'ielts', ielts: sc, overallBand: overall }
    try {
      const prevScore = await saveResult(data)
      setResult({ ...data, prevScore })
    } catch (e) {
      monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: 'handleSpeakingDone' })
      setResult(data)
    }
    setView('result')
  }

  const selectedQuestions = mockData?.questions ?? []
  const mins = testType === 'a1' ? 25 : testType === 'b1' ? 45 : 60

  if (view === 'result' && result) {
    return <MockTestResultScreen data={result} onRetry={() => { setView('select'); setResult(null) }} />
  }
  if (view === 'weekly') {
    return <MockTestWeeklyTest questions={selectedQuestions} level={testType === 'a1' ? 'A1' : testType === 'b1' ? 'B1' : 'B2'} mins={mins} onDone={handleWeeklyDone} />
  }
  if (view === 'ielts-reading')   return <MockTestIELTSReading   texts={readingTexts} onDone={handleReadingDone}   />
  if (view === 'ielts-listening') return <MockTestIELTSListening  data={mockData} onDone={handleListeningDone} />
  if (view === 'ielts-writing')   return <MockTestIELTSWriting    data={mockData} onDone={handleWritingDone}   />
  if (view === 'ielts-speaking')  return <MockTestIELTSSpeaking   prompts={speakingPrompts} onDone={handleSpeakingDone}  />

  return <MockTestSelectScreen onStart={startTest} loading={!mockData} />
}
