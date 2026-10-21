import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowDown, ArrowUp, BookOpen, CheckCircle2, ClipboardList, Copy, Link2, LoaderCircle, MessageCircle, PauseCircle, Play, RefreshCw, Trash2, Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getCustomTestCatalog, type CatalogModule } from '../features/custom-test/customTestApi'
import type { AnswerValue } from '../features/exam/contracts'
import { isAnswerComplete, stableShuffle } from '../features/exam/contracts'
import Y1Choice from '../features/exam/questions/Y1Choice'
import Y2Match from '../features/exam/questions/Y2Match'
import Y3Order from '../features/exam/questions/Y3Order'
import ExamRichText from '../features/exam/questions/ExamRichText'
import { learnerExplanation } from '../features/exam/learnerExplanation'
import ExamQuestionAssets from '../features/exam/questions/ExamQuestionAssets'
import {
  answerGroupMock, cancelGroupMockLobby, correctGroupAnswerLabel, createGroupMock, deleteGroupMockRoom, finishGroupMock,
  getGroupMockState, getGroupMockReport, joinGroupMock, leaveGroupMockLobby, listGroupBank,
  listMyGroupMockRooms, messageGroupMock, pauseGroupMock, resumeGroupMock,
  startGroupMock, stepGroupMock, visibleGroupFeedback,
  type BankQuestion, type GroupMockMode, type GroupMockReport, type GroupMockRoomSummary, type GroupMockState,
  type GroupMockTopic,
} from '../features/group-mock/groupMockApi'
import { reorderManualQuestions } from '../features/group-mock/manualSelection'

type TopicSelection = Record<string, { count: number; difficulty: number }>
const panel = 'rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900'
const action = 'min-h-11 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
const field = 'w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
const label = 'block text-sm font-semibold text-gray-700 dark:text-gray-200'

function AnswerText({ answer, question }: {
  answer: unknown
  question: NonNullable<GroupMockState['question']>
}) {
  if (!answer || typeof answer !== 'object' || Array.isArray(answer)) return <span>Javob bermagan</span>
  const data = answer as Record<string, unknown>
  if (question.format === 'Y1') {
    const option = question.options.find(item => item.id === data.option_id)
    return <span>{option?.content_md ?? 'Javob bermagan'}</span>
  }
  if (question.format === 'Y3' && Array.isArray(data.order)) {
    return <span>{data.order.map(id => {
      const option = question.options.find(item => item.id === id)
      return option?.content_md ?? '?'
    }).join(' → ')}</span>
  }
  if (question.format === 'Y2' && data.pairs && typeof data.pairs === 'object' && !Array.isArray(data.pairs)) {
    return <span>{Object.entries(data.pairs as Record<string, unknown>).map(([a, b]) => {
      const left = question.options.find(item => item.id === a)?.content_md ?? '?'
      const right = question.options.find(item => item.id === b)?.content_md ?? '?'
      return left + ' → ' + right
    }).join('; ')}</span>
  }
  return <span>Javob mavjud</span>
}

function GroupQuestionCard({
  room, onAnswer, busy,
}: { room: GroupMockState; onAnswer: (answer: Record<string, unknown>) => void; busy: boolean }) {
  const question = room.question
  const [choice, setChoice] = useState<AnswerValue | undefined>()
  const questionId = question?.question_id
  const currentIndex = room.current_idx
  const questionFormat = question?.format
  const questionOptionIds = question?.options.map(option => option.id).join(',') ?? ''

  useEffect(() => {
    if (questionFormat === 'Y3' && questionId) {
      setChoice(stableShuffle(questionOptionIds.split(','),
        room.room_id + ':' + questionId))
    } else {
      setChoice(undefined)
    }
  }, [questionId, questionFormat, questionOptionIds, currentIndex, room.room_id])

  if (!question) return null
  const locked = room.status !== 'question' || room.my_answer !== null || busy
  const feedback = visibleGroupFeedback(room)
  const complete = isAnswerComplete(question, choice)

  const submit = () => {
    if (!complete || locked || choice === undefined) return
    if (question.format === 'Y1' && typeof choice === 'string') onAnswer({ option_id: choice })
    if (question.format === 'Y2' && choice && typeof choice === 'object' && !Array.isArray(choice)) onAnswer({ pairs: choice })
    if (question.format === 'Y3' && Array.isArray(choice)) onAnswer({ order: choice })
  }

  return (
    <section className={panel} aria-label="Jonli savol">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {room.current_idx} / {room.total_count}-savol
        </h2>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {room.status === 'question' ? 'Javoblar kutilmoqda' : room.status === 'finished' ? 'Test yakunlandi' : 'Muhokama vaqti'}
        </span>
      </div>
      <div className="mb-5">
        <ExamQuestionAssets assets={question.assets} questionId={question.question_id} />
      </div>
      {question.format === 'Y1' ? (
        <Y1Choice prompt={question.stem_md} options={question.options}
          value={typeof choice === 'string' ? choice : undefined} disabled={locked}
          onChange={setChoice} />
      ) : question.format === 'Y2' ? (
        <Y2Match prompt={question.stem_md}
          left={question.options.filter(option => option.side === 'a')}
          right={question.options.filter(option => option.side === 'b')}
          value={choice && typeof choice === 'object' && !Array.isArray(choice) ? choice : {}}
          disabled={locked} onChange={setChoice} />
      ) : (
        <Y3Order prompt={question.stem_md} items={question.options}
          value={Array.isArray(choice) ? choice : []} disabled={locked} onChange={setChoice} />
      )}

      {room.status === 'question' && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Javob berganlar: {room.answered_count} / {room.members.length}
          </p>
          {room.my_answer !== null ? (
            <span role="status" className="inline-flex items-center gap-2 font-semibold text-green-600">
              <CheckCircle2 size={18} /> Javob saqlandi
            </span>
          ) : (
            <button className={action} type="button" disabled={!complete || busy} onClick={submit}>
              Javobni yuborish
            </button>
          )}
        </div>
      )}

      {feedback && (
        <div className="mt-6 space-y-4 border-t pt-5 dark:border-gray-700" role="region" aria-label="Savol natijasi">
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
            <h3 className="mb-2 font-bold text-green-800 dark:text-green-300">To‘g‘ri javob</h3>
            <p className="break-words text-sm text-green-900 dark:text-green-200">
              {feedback.correct_answer ? correctGroupAnswerLabel(question, feedback.correct_answer) : 'Kalit topilmadi'}
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-gray-900 dark:text-white">Batafsil izoh</h3>
            <ExamRichText text={learnerExplanation(feedback.explanation_md) || 'Ushbu savol uchun izoh mavjud emas.'} />
          </div>
          <div>
            <h3 className="mb-2 font-bold text-gray-900 dark:text-white">Guruhning javoblari</h3>
            <div className="space-y-2">
              {feedback.answers.map(item => (
                <div key={item.user_id} className="flex flex-wrap items-start justify-between gap-2 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
                  <div className="min-w-0 flex-1">
                    <strong>{item.name}</strong>
                    <p className="mt-1 break-words text-gray-600 dark:text-gray-300">
                      <AnswerText answer={item.answer} question={question} />
                    </p>
                  </div>
                  <span className={item.is_correct === true ? 'text-green-600' : 'text-red-600'}>
                    {item.is_correct === null ? 'Javobsiz' : item.is_correct ? 'To‘g‘ri (+2)' : 'Noto‘g‘ri'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}


function reportAnswerLabel(
  format: 'Y1' | 'Y2' | 'Y3',
  data: unknown,
  options: Array<{ id: string; content_md: string }>,
): string {
  if (data === null || !data || typeof data !== 'object' || Array.isArray(data)) return 'Javob berilmagan'
  const answer = data as Record<string, unknown>
  const text = (id: unknown) => options.find(item => item.id === String(id))?.content_md ?? String(id)
  if (format === 'Y1') return text(answer.option_id ?? answer.correct_option_id)
  if (format === 'Y2' && answer.pairs && typeof answer.pairs === 'object' && !Array.isArray(answer.pairs)) {
    return Object.entries(answer.pairs).map(([left, right]) => text(left) + ' → ' + text(right)).join('; ')
  }
  if (format === 'Y3' && Array.isArray(answer.order)) return answer.order.map(text).join(' → ')
  return 'Javob mavjud'
}

function GroupFinalReport({ report }: { report: GroupMockReport }) {
  const maxPoints = report.total_count * 2
  return (
    <section className={panel} aria-label="Guruhli test to‘liq hisoboti">
      <h2 className="mb-2 text-xl font-bold dark:text-white">Yakuniy to‘liq hisobot</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {report.participant_count} ishtirokchi · {report.total_count} savol · Maksimal {maxPoints} ball.
        Har bir ishtirokchining natijasi va barcha savollarning tahlili quyida.
      </p>
      <div className="mb-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm dark:text-gray-200">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="p-2">Ishtirokchi</th><th className="p-2">Ball</th>
              <th className="p-2">To‘g‘ri</th><th className="p-2">Noto‘g‘ri</th>
              <th className="p-2">Javobsiz</th><th className="p-2">Natija</th>
            </tr>
          </thead>
          <tbody>
            {report.participants.map((person,index) => (
              <tr className="border-b dark:border-gray-800" key={person.user_id}>
                <td className="p-2">{index+1}. {person.name}</td>
                <td className="p-2 font-semibold">{person.score}/{maxPoints}</td>
                <td className="p-2 text-green-600">{person.correct}</td>
                <td className="p-2 text-red-600">{person.incorrect}</td>
                <td className="p-2">{person.unanswered}</td>
                <td className="p-2 font-medium">{person.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="mb-3 font-bold dark:text-white">Savollar va ishtirokchilar javoblari</h3>
      <div className="space-y-3">
        {report.questions.map(question => (
          <details key={question.idx} className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
            <summary className="cursor-pointer font-semibold dark:text-white">
              {question.idx}-savol · {question.correct} to‘g‘ri · {question.incorrect} noto‘g‘ri · {question.unanswered} javobsiz
            </summary>
            <div className="mt-4 space-y-3 text-sm dark:text-gray-200">
              <ExamRichText text={question.stem_md} />
              <div className="rounded-lg bg-green-50 p-3 text-green-900 dark:bg-green-950/40 dark:text-green-200">
                <strong>To‘g‘ri javob:</strong> {reportAnswerLabel(question.format, question.correct_answer, question.options)}
              </div>
              <div>
                <strong>Ekspert izohi</strong>
                <ExamRichText text={learnerExplanation(question.explanation_md) || 'Izoh mavjud emas.'} />
              </div>
              <ul className="space-y-2">
                {report.participants.map(person => {
                  const result = person.answers.find(answer => answer.idx === question.idx)
                  return (
                    <li key={person.user_id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <div className="flex flex-wrap justify-between gap-2">
                        <strong>{person.name}</strong>
                        <span className={result?.is_correct === true ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                          {result?.is_correct === null || result?.is_correct === undefined
                            ? 'Javobsiz' : result.is_correct ? 'To‘g‘ri (+2)' : 'Noto‘g‘ri'}
                        </span>
                      </div>
                      <p className="mt-1 break-words">
                        {reportAnswerLabel(question.format, result?.answer, question.options)}
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export default function GroupMockPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const roomId = searchParams.get('room')
  const [joinCode, setJoinCode] = useState(searchParams.get('code') ?? '')
  const [mode, setMode] = useState<GroupMockMode>('spec')
  const [catalog, setCatalog] = useState<CatalogModule[]>([])
  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [selected, setSelected] = useState<TopicSelection>({})
  const [bankLesson, setBankLesson] = useState('')
  const [bankSearch, setBankSearch] = useState('')
  const [bank, setBank] = useState<BankQuestion[]>([])
  const [manualCatalog, setManualCatalog] = useState<Record<string, BankQuestion>>({})
  const [manual, setManual] = useState<string[]>([])
  const [myRooms, setMyRooms] = useState<GroupMockRoomSummary[]>([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [roomsError, setRoomsError] = useState<string | null>(null)
  const [connectionWarning, setConnectionWarning] = useState<string | null>(null)
  const requestSequence = useRef(0)
  const [state, setState] = useState<GroupMockState | null>(null)
  const [report, setReport] = useState<GroupMockReport | null>(null)
  const [reportError, setReportError] = useState<string | null>(null)
  const [chat, setChat] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!roomId) return
    const requestId = ++requestSequence.current
    try {
      const value = await getGroupMockState(roomId)
      // A slower response must not roll a question/reveal back to an earlier phase.
      if (requestId === requestSequence.current) {
        setState(value)
        setConnectionWarning(null)
      }
    } catch (error) {
      if (requestId === requestSequence.current) {
        setConnectionWarning('Ulanish uzildi. Natijalar yangilanmayapti; tarmoq tiklanganda avtomatik qayta ulanadi.')
      }
      throw error
    }
  }, [roomId])

  useEffect(() => {
    requestSequence.current += 1
    if (!roomId) {
      setState(null)
      setConnectionWarning(null)
      return
    }
    if (authLoading) return
    setState(null)
    void refresh().catch(err => setError(err instanceof Error ? err.message : 'Xona yuklanmadi'))
    const timer = window.setInterval(() => {
      void refresh().catch(() => {
        // Show a connection warning but keep the last valid answer selection.
      })
    }, 2500)
    return () => {
      requestSequence.current += 1
      window.clearInterval(timer)
    }
  }, [roomId, refresh, authLoading])

  useEffect(() => {
    if (roomId || !user?.id || authLoading) return
    let active = true
    setRoomsLoading(true)
    void listMyGroupMockRooms().then(rooms => {
      if (active) { setMyRooms(rooms); setRoomsError(null) }
    }).catch(err => {
      if (active) setRoomsError(err instanceof Error ? err.message : 'Xonalar ro‘yxati yuklanmadi')
    }).finally(() => { if (active) setRoomsLoading(false) })
    return () => { active = false }
  }, [roomId, user?.id, authLoading])

  useEffect(() => {
    if (roomId || mode === 'spec' || catalog.length) return
    let active = true
    setLoadingCatalog(true)
    void getCustomTestCatalog().then(items => {
      if (active) setCatalog(items)
    }).catch(err => {
      if (active) setCatalogError(err instanceof Error ? err.message : 'Mavzular yuklanmadi')
    }).finally(() => { if (active) setLoadingCatalog(false) })
    return () => { active = false }
  }, [roomId, mode, catalog.length])

  useEffect(() => {
    if (!bankLesson || mode !== 'manual' || roomId) return
    let active = true
    void listGroupBank(bankLesson, bankSearch).then(items => {
      if (active) {
        setBank(items)
        setCatalogError(null)
        setManualCatalog(previous => ({
          ...previous,
          ...Object.fromEntries(items.map(item => [item.id, item])),
        }))
      }
    }).catch(err => {
      if (active) setCatalogError(err instanceof Error ? err.message : 'Savollar yuklanmadi')
    })
    return () => { active = false }
  }, [bankLesson, bankSearch, mode, roomId])

  useEffect(() => {
    let active = true
    setReport(null)
    setReportError(null)
    if (roomId && state?.room_id === roomId && state.status === 'finished') {
      void getGroupMockReport(roomId).then(value => {
        if (active) setReport(value)
      }).catch(err => {
        if (active) setReportError(err instanceof Error ? err.message : 'Hisobot yuklanmadi')
      })
    }
    return () => { active = false }
  }, [roomId, state?.room_id, state?.status])

  const topics = useMemo<GroupMockTopic[]>(() =>
    Object.entries(selected).map(([lesson_id, value]) => ({
      lesson_id, count: value.count, difficulty: value.difficulty,
    })), [selected])
  const count = topics.reduce((sum, item) => sum + item.count, 0)

  const act = async (operation: () => Promise<unknown>) => {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await operation()
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Amal bajarilmadi')
    } finally {
      setBusy(false)
    }
  }

  const create = () => void act(async () => {
    const config: Record<string, unknown> = mode === 'spec' ? {} :
      mode === 'topics' ? { total_count: count, topics } : { question_ids: manual }
    const result = await createGroupMock(mode, config)
    setSearchParams({ room: result.room_id })
  })
  const join = () => void act(async () => {
    const result = await joinGroupMock(joinCode)
    setSearchParams({ room: result.room_id })
  })

  const toggleLesson = (id: string) => {
    setSelected(old => {
      const copy = { ...old }
      if (copy[id]) delete copy[id]
      else copy[id] = { count: 5, difficulty: 3 }
      return copy
    })
  }
  const copyCode = () => {
    if (!state) return
    void navigator.clipboard?.writeText(state.code)
  }
  const copyInviteLink = () => {
    if (!state) return
    const url = new URL('/group-mock', window.location.origin)
    url.searchParams.set('code', state.code)
    void navigator.clipboard?.writeText(url.toString())
  }
  const refreshRooms = () => {
    if (roomsLoading || authLoading) return
    setRoomsLoading(true)
    void listMyGroupMockRooms().then(rooms => {
      setMyRooms(rooms)
      setRoomsError(null)
    }).catch(err => setRoomsError(err instanceof Error ? err.message : 'Xonalarni yangilab bo‘lmadi'))
      .finally(() => setRoomsLoading(false))
  }
  const moveManual = (index: number, direction: -1 | 1) => {
    setManual(current => reorderManualQuestions(current, index, direction))
  }
  const exitLobby = (asHost: boolean) => {
    if (!roomId || busy) return
    if (!window.confirm(asHost
      ? 'Xonani bekor qilasizmi? Taklif kodi ham o‘chadi.'
      : 'Test boshlanmasdan xonadan chiqasizmi?')) return
    setBusy(true)
    setError(null)
    const operation = asHost ? cancelGroupMockLobby(roomId) : leaveGroupMockLobby(roomId)
    void operation.then(() => {
      setState(null)
      setSearchParams({})
    }).catch(err => {
      setError(err instanceof Error ? err.message : 'Xonadan chiqib bo‘lmadi')
    }).finally(() => setBusy(false))
  }
  const sendMessage = () => void act(async () => {
    if (!roomId || !chat.trim()) return
    await messageGroupMock(roomId, chat)
    setChat('')
  })
  const finishNow = () => {
    if (!roomId || !state?.is_host || busy) return
    if (!window.confirm('Testni hozir butunlay yakunlaysizmi? Qolgan savollar va javoblar javobsiz deb hisoblanadi. Barcha ishtirokchilar yakuniy hisobotni ko‘ra oladi. Bu amalni ortga qaytarib bo‘lmaydi.')) return
    void act(() => finishGroupMock(roomId))
  }
  const deleteRoom = (target: { room_id: string; code: string; is_host: boolean }) => {
    if (!target.is_host || busy) return
    const typed = window.prompt(
      'DIQQAT! Xona, barcha javoblar, guruh muhokamasi va yakuniy hisobot qayta tiklab bo‘lmaydigan tarzda o‘chiriladi. Tasdiqlash uchun xona kodini kiriting: ' + target.code,
    )
    if (typed === null) return
    if (typed.trim().toUpperCase() !== target.code) {
      setError('Xona kodi mos kelmadi. Hech narsa o‘chirilmadi.')
      return
    }
    setBusy(true)
    setError(null)
    void deleteGroupMockRoom(target.room_id, target.code).then(() => {
      setMyRooms(previous => previous.filter(item => item.room_id !== target.room_id))
      if (roomId === target.room_id) {
        requestSequence.current += 1
        setState(null)
        setReport(null)
        setSearchParams({})
      }
    }).catch(err => {
      setError(err instanceof Error ? err.message : 'Testni o‘chirib bo‘lmadi')
    }).finally(() => setBusy(false))
  }

  if (!roomId) {
    return (
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <header className="rounded-3xl bg-indigo-700 p-6 text-white sm:p-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold"><Users /> Guruhli Mock Test</h1>
          <p className="mt-2 text-indigo-100">Do‘stlaringiz bilan bir savolni bir vaqtda ishlang, natijani va ekspert izohini birga muhokama qiling.</p>
        </header>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
        <section className={panel}>
          <h2 className="mb-3 text-lg font-bold dark:text-white">Kod bilan guruhga kirish</h2>
          <div className="flex flex-wrap gap-3">
            <input aria-label="Xona kodi" value={joinCode} maxLength={8}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              className={field + ' sm:max-w-xs'} placeholder="Masalan: A12BC34D" />
            <button disabled={authLoading || busy || joinCode.trim().length !== 8} type="button" className={action} onClick={join}>Kirish</button>
          </div>
        </section>
        <section className={panel}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold dark:text-white">Mening guruhli testlarim</h2>
            <button type="button" disabled={roomsLoading || authLoading} onClick={refreshRooms}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:text-gray-200">
              <RefreshCw size={16} className={roomsLoading ? 'animate-spin' : ''} /> Yangilash
            </button>
          </div>
          {roomsError && <p role="alert" className="mb-3 text-sm text-red-600">{roomsError}</p>}
          {!roomsError && myRooms.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {roomsLoading || authLoading ? 'Xonalar qidirilmoqda...' : 'Hali saqlangan guruhli testingiz yo‘q.'}
            </p>
          ) : (
            <div className="space-y-2">
              {myRooms.map(room => (
                <div key={room.room_id} className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 p-2 dark:border-gray-700">
                  <button type="button" onClick={() => setSearchParams({ room: room.room_id })}
                    className="flex min-h-12 min-w-0 flex-1 flex-wrap items-center justify-between gap-3 rounded-lg p-2 text-left hover:bg-indigo-50 dark:text-white dark:hover:bg-gray-800">
                    <span className="min-w-0">
                      <strong className="font-mono">{room.code}</strong>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {room.is_host ? 'Tashkilotchi' : 'Ishtirokchi'} · {room.mode === 'spec' ? 'Spetsifikatsiya' : room.mode === 'topics' ? 'Mavzuli' : 'Qo‘lda'}
                      </span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {room.status === 'lobby' ? 'Kutilmoqda' : room.status === 'question' ? 'Savol' : room.status === 'reveal' ? 'Muhokama' : room.status === 'paused' ? 'Vaqtincha yopilgan' : 'Yakunlangan'}
                      {' · '}{room.current_idx}/{room.total_count}{' · '}{room.member_count} kishi
                    </span>
                  </button>
                  {room.is_host && (
                    <button type="button" disabled={busy} onClick={() => deleteRoom(room)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-red-300 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-300"
                      aria-label={room.code + ' guruhli testini butunlay o‘chirish'}>
                      <Trash2 size={17} /> O‘chirish
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        <section className={panel}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold dark:text-white"><ClipboardList /> Guruhli test tashkil etish</h2>
          <fieldset className="mb-5">
            <legend className={label}>Savollarni tanlash usuli</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {([
                ['spec', 'Spetsifikatsiya (50 ta)'],
                ['topics', 'Mavzular bo‘yicha'],
                ['manual', 'Savollarni qo‘lda'],
              ] as const).map(([value, text]) => (
                <label key={value} className={'cursor-pointer rounded-xl border p-3 text-sm dark:border-gray-700 ' +
                  (mode === value ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' : '')}>
                  <input className="mr-2" type="radio" name="group-mode" checked={mode === value}
                    onChange={() => { setMode(value); setCatalogError(null) }} />
                  {text}
                </label>
              ))}
            </div>
          </fieldset>
          {mode === 'spec' && (
            <p className="mb-5 rounded-xl bg-gray-50 p-4 text-sm dark:bg-gray-800 dark:text-gray-200">
              Amaldagi rasmiy attestatsiya spetsifikatsiyasi: 50 savol, barcha bo‘limlar va kognitiv darajalar kvotasi avtomatik saqlanadi.
            </p>
          )}
          {mode !== 'spec' && (
            <div className="mb-5 space-y-4">
              {loadingCatalog && <p role="status">Mavzular yuklanmoqda...</p>}
              {catalogError && <p role="alert" className="text-red-600">{catalogError}</p>}
              {mode === 'topics' ? (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Har bir mavzu uchun savollar soni va A–E qiyinchilik darajasini belgilang.</p>
                  {catalog.map(module => (
                    <details key={module.id} className="rounded-xl border p-3 dark:border-gray-700">
                      <summary className="cursor-pointer font-semibold dark:text-white">{module.code} · {module.title_uz}</summary>
                      <div className="mt-3 space-y-3">
                        {module.lessons.map(lesson => (
                          <div key={lesson.id} className="flex flex-wrap items-center gap-3 border-t pt-3 dark:border-gray-700">
                            <label className="flex min-w-48 flex-1 items-center gap-2 text-sm dark:text-gray-200">
                              <input type="checkbox" checked={Boolean(selected[lesson.id])}
                                onChange={() => toggleLesson(lesson.id)} />
                              {lesson.title_uz}
                            </label>
                            {selected[lesson.id] && (
                              <>
                                <label className="text-xs dark:text-gray-300">Savol soni
                                  <input className={field + ' mt-1 w-24'} type="number" min={1} max={100}
                                    value={selected[lesson.id].count} onChange={e => setSelected(old => ({
                                      ...old, [lesson.id]: { ...old[lesson.id], count: Math.min(100, Math.max(1, Number(e.target.value) || 1)) },
                                    }))} />
                                </label>
                                <label className="text-xs dark:text-gray-300">Daraja
                                  <select className={field + ' mt-1'} value={selected[lesson.id].difficulty}
                                    onChange={e => setSelected(old => ({
                                      ...old, [lesson.id]: { ...old[lesson.id], difficulty: Number(e.target.value) },
                                    }))}>
                                    <option value={1}>A · 1</option><option value={2}>B · 2</option>
                                    <option value={3}>C · 3</option><option value={4}>D · 4</option>
                                    <option value={5}>E · 5</option>
                                  </select>
                                </label>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                  <p className="font-semibold dark:text-white">{topics.length} ta mavzu · {count} ta savol</p>
                </>
              ) : (
                <>
                  <label className={label}>Savollar bazasidan mavzu tanlang
                    <select className={field + ' mt-2'} value={bankLesson}
                      onChange={e => { setBankLesson(e.target.value); setBankSearch(''); setBank([]) }}>
                      <option value="">Mavzuni tanlang</option>
                      {catalog.map(module => (
                        <optgroup key={module.id} label={module.title_uz}>
                          {module.lessons.map(lesson => (
                            <option key={lesson.id} value={lesson.id}>{lesson.title_uz}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                  {bankLesson && (
                    <>
                      <input className={field} aria-label="Savol matni bo‘yicha qidirish"
                        value={bankSearch} onChange={e => setBankSearch(e.target.value)}
                        placeholder="Savol matni bo‘yicha qidiring..." />
                      <div className="max-h-80 space-y-2 overflow-y-auto">
                        {bank.map(item => (
                          <label key={item.id} className="flex cursor-pointer gap-3 rounded-lg border p-3 text-sm dark:border-gray-700 dark:text-gray-200">
                            <input type="checkbox" checked={manual.includes(item.id)} disabled={!manual.includes(item.id) && manual.length>=100}
                              onChange={() => setManual(old => old.includes(item.id)
                                ? old.filter(id => id!==item.id) : [...old,item.id])} />
                            <span className="min-w-0 break-words">
                              <span className="font-semibold">{item.format} · {item.difficulty}-daraja</span> — {item.stem_md.slice(0,250)}
                              <span className="mt-2 block text-xs text-gray-500 dark:text-gray-400">
                                {item.options.map((option,index)=>(
                                  <span key={option.id} className="block">
                                    {option.side.toUpperCase()}-{index+1}. {option.content_md.slice(0,160)}
                                  </span>
                                ))}
                              </span>
                            </span>
                          </label>
                        ))}
                        {bank.length===0 && <p className="text-sm text-gray-500">Nashr etilgan savollar topilmadi.</p>}
                      </div>
                    </>
                  )}
                  <p className="font-semibold dark:text-white">{manual.length} ta savol tanlandi (maksimal 100)</p>
                  {manual.length > 0 && (
                    <div className="space-y-2 rounded-xl border border-indigo-200 p-3 dark:border-indigo-900" aria-label="Tanlangan savollar tartibi">
                      <h3 className="font-semibold dark:text-white">Savollar ketma-ketligi</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pastdagi tartib testda aynan shu ketma-ketlikda ishlatiladi.</p>
                      {manual.map((id,index) => (
                        <div key={id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
                          <span className="shrink-0 text-sm font-semibold dark:text-gray-200">{index+1}.</span>
                          <span className="min-w-0 flex-1 truncate text-sm dark:text-gray-200" title={manualCatalog[id]?.stem_md}>
                            {manualCatalog[id]?.stem_md ?? 'Tanlangan savol'}
                          </span>
                          <button type="button" disabled={index===0} onClick={() => moveManual(index,-1)}
                            className="rounded p-2 disabled:opacity-30 dark:text-gray-200"
                            aria-label={`${index+1}-savolni yuqoriga ko‘chirish`}><ArrowUp size={17}/></button>
                          <button type="button" disabled={index===manual.length-1} onClick={() => moveManual(index,1)}
                            className="rounded p-2 disabled:opacity-30 dark:text-gray-200"
                            aria-label={`${index+1}-savolni pastga ko‘chirish`}><ArrowDown size={17}/></button>
                          <button type="button" onClick={() => setManual(old=>old.filter(item=>item!==id))}
                            className="rounded p-2 text-red-600" aria-label={`${index+1}-savolni o‘chirish`}>
                            <Trash2 size={17}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <button type="button" className={action} onClick={create} disabled={busy ||
            (mode === 'topics' && (topics.length<1 || topics.length>30 || count>100)) ||
            (mode === 'manual' && manual.length<1)}>
            {busy ? <LoaderCircle className="inline animate-spin" size={18} /> : <Play className="inline" size={18} />} Xona yaratish
          </button>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Xona kodi faqat taklif qilgan ishtirokchilaringiz uchun. Testni tashkilotchi boshlaydi va savollar bo‘yicha boshqaradi.
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <header className="rounded-2xl bg-indigo-700 p-5 text-white sm:p-7">
        <h1 className="flex items-center gap-2 text-2xl font-bold"><Users /> Guruhli Mock Test</h1>
        {state && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-xl bg-white/15 px-4 py-2 font-mono text-xl font-bold tracking-widest">{state.code}</span>
            <button onClick={copyCode} type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white/15 px-3 hover:bg-white/25">
              <Copy size={16} /> Kodni nusxalash
            </button>
            <button onClick={copyInviteLink} type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white/15 px-3 hover:bg-white/25">
              <Link2 size={16} /> Taklif havolasini nusxalash
            </button>
            <span className="text-indigo-100">{state.members.length} ishtirokchi</span>
          </div>
        )}
      </header>
      {error && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-red-700">{error}</p>}
      {connectionWarning && <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-800">{connectionWarning}</p>}
      {!state && <p role="status" className={panel}>Xona yuklanmoqda...</p>}
      {state && (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            {state.status === 'paused' ? (
              <section className={panel}>
                <h2 className="mb-3 text-xl font-bold dark:text-white">Test vaqtincha yopilgan</h2>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  Savollar, ishtirokchilar va yuborilgan javoblar saqlangan.
                  Tashkilotchi testni qayta ochsa, avvalgi bosqichdan davom etadi.
                </p>
                {state.is_host ? (
                  <button className={action} type="button" disabled={busy}
                    onClick={() => void act(() => resumeGroupMock(roomId ?? ''))}>
                    <Play className="inline" size={18} /> Testni qayta ochish
                  </button>
                ) : <p role="status" className="font-medium text-indigo-700 dark:text-indigo-300">Tashkilotchi qayta ochishini kuting.</p>}
              </section>
            ) : state.status === 'lobby' ? (
              <section className={panel}>
                <h2 className="mb-3 text-xl font-bold dark:text-white">Guruh yig‘ilmoqda</h2>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  {state.total_count} ta savol tayyor. Kodni ulashing. Ishtirokchilar qo‘shilgach, tashkilotchi testni boshlaydi.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {state.is_host ? (
                    <button className={action} disabled={busy} onClick={() => void act(() => startGroupMock(roomId ?? ''))}>
                      <Play className="inline" size={17}/> Testni boshlash
                    </button>
                  ) : <p role="status" className="font-medium text-indigo-700 dark:text-indigo-300">Tashkilotchi boshlashini kuting.</p>}
                  <button type="button" disabled={busy} onClick={() => exitLobby(state.is_host)}
                    className="min-h-11 rounded-xl border border-red-300 px-4 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">
                    {state.is_host ? 'Xonani bekor qilish' : 'Xonadan chiqish'}
                  </button>
                </div>
              </section>
            ) : (
              <GroupQuestionCard room={state} busy={busy}
                onAnswer={answer => void act(() => answerGroupMock(roomId ?? '', answer))} />
            )}

            {state.is_host && ['lobby','question','reveal'].includes(state.status) && (
              <section className={panel}>
                <h2 className="mb-2 font-bold dark:text-white">Testni vaqtincha yopish</h2>
                <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                  Test o‘chirilmaydi. Keyin «Mening guruhli testlarim» orqali qayta ochib davom ettirishingiz mumkin.
                </p>
                <button type="button" disabled={busy}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-amber-500 px-4 text-sm font-semibold text-amber-700 dark:text-amber-300"
                  onClick={() => {
                    if (window.confirm('Testni vaqtincha yopasizmi? Barcha javoblar saqlanadi.')) {
                      void act(() => pauseGroupMock(roomId ?? ''))
                    }
                  }}>
                  <PauseCircle size={18} /> Vaqtincha yopish
                </button>
              </section>
            )}
            {state.is_host && state.status === 'question' && (
              <section className={panel}>
                <h2 className="mb-2 font-bold dark:text-white">Tashkilotchi boshqaruvi</h2>
                <p className="mb-3 text-sm text-gray-500">Barcha ishtirokchilar javob bergach natija avtomatik ochiladi. Zarur bo‘lsa, erta ochishingiz mumkin.</p>
                <button type="button" className={action} disabled={busy} onClick={() => {
                  if (window.confirm('Hamma javob bermagan bo‘lsa ham natijani ochasizmi?')) {
                    void act(() => stepGroupMock(roomId ?? '', 'reveal'))
                  }
                }}>Natijani hozir ochish</button>
              </section>
            )}
            {state.is_host && state.status === 'reveal' && (
              <button type="button" className={action} disabled={busy}
                onClick={() => void act(() => stepGroupMock(roomId ?? '', 'next'))}>
                {state.current_idx===state.total_count ? 'Testni yakunlash' : 'Keyingi savolga o‘tish →'}
              </button>
            )}
            {state.is_host && state.status !== 'finished' && (
              <section className={panel}>
                <h2 className="mb-2 font-bold dark:text-white">Testni butunlay yakunlash</h2>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                  Boshlangan testni hozir yakunlasangiz, qolgan savollar javobsiz deb hisoblanadi.
                  Barcha ishtirokchilar uchun to‘liq hisobot ochiladi; testni qayta davom ettirib bo‘lmaydi.
                </p>
                <button type="button" disabled={busy ||
                  state.status === 'lobby' ||
                  (state.status === 'paused' && state.paused_from_status === 'lobby')}
                  onClick={finishNow}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                  <CheckCircle2 size={18} /> Testni hozir yakunlash
                </button>
              </section>
            )}
            {state.is_host && (
              <section className={panel}>
                <h2 className="mb-2 font-bold text-red-700 dark:text-red-400">Guruhli testni butunlay o‘chirish</h2>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                  Xona, barcha ishtirokchilarning javoblari, yozishmalari va yakuniy hisobot qaytarib
                  bo‘lmaydigan tarzda o‘chiriladi. O‘chirish uchun xona kodini kiritish talab qilinadi.
                </p>
                <button type="button" disabled={busy} onClick={() => deleteRoom(state)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-500 px-4 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 dark:text-red-300">
                  <Trash2 size={18} /> Testni butunlay o‘chirish
                </button>
              </section>
            )}
            {state.status === 'finished' && (
              report ? <GroupFinalReport report={report} /> : (
                <section className={panel}>
                  <h2 className="mb-2 text-xl font-bold dark:text-white">Test yakunlandi</h2>
                  {reportError ? <p role="alert" className="text-red-700">{reportError}</p>
                    : <p role="status">Yakuniy to‘liq hisobot yuklanmoqda...</p>}
                  {reportError && (
                    <button className={action + ' mt-3'} type="button"
                      onClick={() => {
                        setReportError(null)
                        void getGroupMockReport(roomId ?? '').then(setReport).catch(err =>
                          setReportError(err instanceof Error ? err.message : 'Hisobot yuklanmadi'))
                      }}>Qayta yuklash</button>
                  )}
                </section>
              )
            )}
          </div>

          <aside className="space-y-5">
            <section className={panel}>
              <h2 className="mb-3 flex items-center gap-2 font-bold dark:text-white"><Users size={18}/> Ishtirokchilar</h2>
              <ul className="space-y-2 text-sm">
                {[...state.members].sort((a,b)=>b.score-a.score).map(member=>(
                  <li key={member.user_id} className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate dark:text-gray-200">
                      {member.name}{member.user_id===user?.id ? ' (siz)' : ''}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-gray-500 dark:text-gray-400">
                      {member.score} ball
                      {state.status==='question' && member.has_answered && <CheckCircle2 size={15} className="text-green-600"/>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section className={panel}>
              <h2 className="mb-3 flex items-center gap-2 font-bold dark:text-white"><MessageCircle size={18}/> Guruh muhokamasi</h2>
              <div aria-live="polite" className="mb-3 max-h-80 min-h-36 space-y-3 overflow-y-auto rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                {state.messages.length===0 && <p className="text-sm text-gray-500">Hali xabar yo‘q. Birinchi fikrni siz yozing.</p>}
                {state.messages.map(message=>(
                  <div key={message.id} className="break-words text-sm">
                    <strong className="text-indigo-700 dark:text-indigo-300">{message.name}</strong>
                    <p className="mt-0.5 whitespace-pre-wrap text-gray-700 dark:text-gray-300">{message.body}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={event=>{event.preventDefault();sendMessage()}} className="space-y-2">
                <label htmlFor="group-chat" className={label}>Xabar yozish</label>
                <textarea id="group-chat" className={field} value={chat} maxLength={500}
                  onChange={e=>setChat(e.target.value)} rows={2} placeholder="Savol bo‘yicha fikringiz..." />
                <button type="submit" className={action} disabled={busy || !chat.trim()}>Yuborish</button>
              </form>
            </section>
            <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200">
              <BookOpen size={18} className="mb-2" />
              Savol javobi va batafsil izoh faqat savol yopilgandan keyin barcha ishtirokchilarga ko‘rsatiladi. Guruhdagi bahs natijaga ta’sir qilmaydi.
            </section>
          </aside>
        </div>
      )}
      <button type="button" className="text-sm text-indigo-700 underline dark:text-indigo-300"
        onClick={() => { setState(null);setSearchParams({}) }}>
        Guruhli testlar bosh sahifasiga qaytish
      </button>
    </main>
  )
}
