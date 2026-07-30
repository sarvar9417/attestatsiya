import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, Clock, AlertTriangle, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Flag, CheckCircle2, XCircle } from 'lucide-react'
import { BLUEPRINT, MODULES } from '../../data/contentTree'
import Y1Question from './questions/Y1Question'

const TOTAL = 50
const DURATION = 120 * 60

interface Props {
  onBack: () => void
  onComplete: (score: number, correct: number) => void
}

interface ExamQuestion {
  id: string
  moduleId: string
  type: 'Y1' | 'Y2' | 'Y3'
  cognitive: 'knowledge' | 'application' | 'reasoning'
  prompt: string
  options?: string[]
  pairs?: { leftId: string; leftContent: string; rightContent: string }[]
  items?: { id: string; content: string }[]
  correctOrder?: string[]
  correctAnswer: string | Record<string, string> | string[]
  explanation: string
}

function generateExamQuestions(): ExamQuestion[] {
  const questions: ExamQuestion[] = []
  let idx = 0

  for (const mod of MODULES) {
    const count = BLUEPRINT.moduleQuestionCount[mod.id as keyof typeof BLUEPRINT.moduleQuestionCount]
    if (!count) continue

    for (let i = 0; i < count; i++) {
      const cognitive = assignCognitive(idx)
      const qType = i === 0 ? 'Y1' : i === 1 && count > 1 ? 'Y2' : 'Y3'
      const vars = ['x', 'y', 'z', 'a', 'b', 'n', 'm', 'k', 't', 'p']
      const v1 = vars[idx % vars.length]
      const v2 = vars[(idx + 3) % vars.length]
      const num1 = 10 + idx
      const num2 = 5 + idx * 2

      const q: ExamQuestion = {
        id: `exam-q-${idx + 1}`,
        moduleId: mod.id,
        type: qType,
        cognitive,
        prompt: '',
        correctAnswer: '',
        explanation: '',
      }

      if (qType === 'Y1') {
        q.prompt = `${mod.title}: ${v1} ning qiymatini toping (${cognitive})`
        q.options = [`${num1}`, `${num1 + 1}`, `${num1 - 1}`, `${num1 + 2}`]
        q.correctAnswer = 'b'
        q.explanation = `${v1} = ${num1}. To'g'ri javob B varianti.`
      } else if (qType === 'Y2') {
        q.prompt = `${mod.title}: quyidagi elementlarni moslashtiring (${cognitive})`
        q.pairs = [
          { leftId: 'l1', leftContent: `${v1} ning qiymati`, rightContent: `${num1}` },
          { leftId: 'l2', leftContent: `${v2} ning qiymati`, rightContent: `${num2}` },
          { leftId: 'l3', leftContent: `${v1} + ${v2}`, rightContent: `${num1 + num2}` },
        ]
        q.correctAnswer = { l1: `${num1}`, l2: `${num2}`, l3: `${num1 + num2}` }
        q.explanation = `${v1}=${num1}, ${v2}=${num2}, yig'indi=${num1 + num2}`
      } else {
        q.prompt = `${mod.title}: quyidagi qadamlarni to'g'ri tartibga keltiring (${cognitive})`
        q.items = [
          { id: 'i1', content: `1-qadam: ${v1} ni aniqlash` },
          { id: 'i2', content: `2-qadam: ${v2} ni hisoblash` },
          { id: 'i3', content: `3-qadam: natijani tekshirish` },
          { id: 'i4', content: `4-qadam: javobni chiqarish` },
        ]
        q.correctAnswer = ['i1', 'i2', 'i3', 'i4']
        q.correctOrder = ['i1', 'i2', 'i3', 'i4']
        q.explanation = "To'g'ri ketma-ketlik: aniqlash → hisoblash → tekshirish → chiqarish"
      }

      questions.push(q)
      idx++
    }
  }

  return questions
}

function assignCognitive(idx: number): 'knowledge' | 'application' | 'reasoning' {
  if (idx < 8) return 'knowledge'
  if (idx < 43) return 'application'
  return 'reasoning'
}

export default function MockExamView({ onBack, onComplete }: Props) {
  const [phase, setPhase] = useState<'intro' | 'exam' | 'result'>('intro')
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | Record<string, string> | string[]>>({})
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [autoSubmit, setAutoSubmit] = useState(false)

  const questions = useMemo(() => generateExamQuestions(), [])

  useEffect(() => {
    if (phase !== 'exam') return
    if (timeLeft <= 0) return setAutoSubmit(true)
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [phase, timeLeft])

  useEffect(() => { if (autoSubmit) handleFinish() }, [autoSubmit])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const answered = Object.keys(answers).length

  let correctCount = 0
  if (phase === 'result') {
    correctCount = questions.filter(q => {
      const ans = answers[q.id]
      if (!ans) return false
      if (typeof q.correctAnswer === 'string') return ans === q.correctAnswer
      if (typeof q.correctAnswer === 'object' && !Array.isArray(q.correctAnswer)) {
        const ca = q.correctAnswer as Record<string, string>
        const aa = ans as Record<string, string>
        return Object.keys(ca).every(k => ca[k] === aa[k])
      }
      if (Array.isArray(q.correctAnswer)) {
        const ca = q.correctAnswer as string[]
        const aa = ans as string[]
        return ca.length === aa.length && ca.every((v, i) => v === aa[i])
      }
      return false
    }).length
  }
  const score = Math.round((correctCount / TOTAL) * 100)

  const handleAnswer = (value: string | Record<string, string> | string[]) => {
    setAnswers(p => ({ ...p, [questions[currentQ].id]: value }))
  }

  const handleFinish = () => {
    if (phase === 'result') return
    setPhase('result')
    onComplete(score, correctCount)
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-lg mx-auto p-6 animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6">
          <ArrowLeft size={14} /> Orqaga
        </button>
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Attestatsiya sinov imtihoni</h2>
          <div className="text-left space-y-2 mb-6">
            {[
              '50 ta savol',
              '120 daqiqa vaqt',
              'O\'tish bali: 60%',
              '35 informatika + 5 kasb standarti + 7 pedagogika + 3 metodika',
              '8 bilish + 35 qo\'llash + 7 mulohaza',
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-medium">{i + 1}</span>
                {t}
              </div>
            ))}
          </div>
          <button onClick={() => setPhase('exam')} className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl font-semibold hover:from-primary-700 hover:to-primary-600 transition-all">
            Testni boshlash
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    const passed = score >= 60
    const wrong = questions.filter(q => {
      const ans = answers[q.id]
      if (!ans) return true
      if (typeof q.correctAnswer === 'string') return ans !== q.correctAnswer
      if (typeof q.correctAnswer === 'object' && !Array.isArray(q.correctAnswer)) {
        const ca = q.correctAnswer as Record<string, string>
        const aa = ans as Record<string, string>
        return !Object.keys(ca).every(k => ca[k] === aa[k])
      }
      if (Array.isArray(q.correctAnswer)) {
        const ca = q.correctAnswer as string[]
        const aa = ans as string[]
        return ca.length !== aa.length || !ca.every((v, i) => v === aa[i])
      }
      return false
    })
    const timeUsed = DURATION - timeLeft
    return (
      <div className="max-w-3xl mx-auto p-6 animate-fade-in">
        <div className={`card p-8 text-center mb-6 ${passed ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-orange-50 to-red-50'}`}>
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
            {passed ? <CheckCircle2 size={36} className="text-green-600" /> : <XCircle size={36} className="text-orange-600" />}
          </div>
          <h2 className="text-2xl font-bold mb-2">{passed ? 'Tabriklaymiz!' : 'Qayta urinib ko\'ring'}</h2>
          <div className="text-5xl font-bold text-primary-600 mb-2">{score}%</div>
          <p className="text-gray-500 mb-1">{correctCount}/{TOTAL} to'g'ri | {score}/{BLUEPRINT.maxPoints} ball</p>
          <p className="text-sm text-gray-400">Vaqt: {formatTime(timeUsed)}</p>
        </div>
        <div className="card p-5 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Bo'limlar kesimi</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(BLUEPRINT.sections).map(([key, section]) => {
              const sectionMods = MODULES.filter(m => m.section === key)
              const sectionCorrect = questions.filter(q => {
                if (!answers[q.id]) return false
                const mod = sectionMods.find(m => m.id === q.moduleId)
                if (!mod) return false
                if (typeof q.correctAnswer === 'string') return answers[q.id] === q.correctAnswer
                return true
              }).length
              return (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-600">{section.label}</span>
                  <span className="font-medium">{sectionCorrect}/{section.count}</span>
                </div>
              )
            })}
          </div>
        </div>
        {wrong.length > 0 && wrong.length <= 10 && (
          <div className="card p-5 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Xatolar ({wrong.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {wrong.map((q, i) => (
                <div key={i} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{q.prompt}</p>
                  <p className="text-xs text-green-600 mt-1">{q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={() => { setPhase('intro'); setAnswers({}); setCurrentQ(0); setTimeLeft(DURATION); setFlagged(new Set()) }} className="btn-secondary flex-1">
            Qayta topshirish
          </button>
          <button onClick={onBack} className="btn-primary flex-1">Asosiy sahifaga qaytish</button>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600">
          <ArrowLeft size={14} /> Chiqish
        </button>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 text-sm font-mono font-bold ${timeLeft < 600 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
            <Clock size={16} /> {formatTime(timeLeft)}
          </div>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm text-gray-500">{answered}/{TOTAL}</span>
        </div>
      </div>
      <div className="progress-bar mb-6">
        <div className="progress-fill bg-primary-500" style={{ width: `${((currentQ + 1) / TOTAL) * 100}%` }} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-gray-400">Savol {currentQ + 1}/{TOTAL}</span>
              <span className="badge bg-primary-100 text-primary-700 text-xs">{q.moduleId}</span>
              <span className="badge bg-gray-100 text-gray-600 text-xs">{q.type} · {q.cognitive === 'knowledge' ? 'Bilish' : q.cognitive === 'application' ? 'Qo\'llash' : 'Mulohaza'}</span>
            </div>
            {q.type === 'Y1' && q.options && (
              <Y1Question
                prompt={q.prompt}
                options={q.options}
                selected={typeof answers[q.id] === 'string' ? ['a', 'b', 'c', 'd'].indexOf(answers[q.id] as string) : undefined}
                onSelect={(oi) => handleAnswer(String.fromCharCode(97 + oi))}
              />
            )}
            {q.type === 'Y2' && q.pairs && (
              <div>
                <p className="text-base font-medium text-gray-900 dark:text-white mb-4">{q.prompt}</p>
                <p className="text-xs text-gray-500 mb-3">Har bir chap elementga mos variantni tanlang</p>
                <div className="space-y-3">
                  {q.pairs.map(pair => (
                    <div key={pair.leftId} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">{pair.leftContent}</span>
                      <span className="text-gray-400">→</span>
                      <select
                        value={(answers[q.id] as Record<string, string>)?.[pair.leftId] || ''}
                        onChange={(e) => {
                          const current = (answers[q.id] as Record<string, string>) || {}
                          handleAnswer({ ...current, [pair.leftId]: e.target.value })
                        }}
                        className="input flex-1 text-sm"
                      >
                        <option value="">Tanlang...</option>
                        {q.pairs!.map(p => (
                          <option key={p.rightContent} value={p.rightContent}>{p.rightContent}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {q.type === 'Y3' && q.items && (
              <div>
                <p className="text-base font-medium text-gray-900 dark:text-white mb-4">{q.prompt}</p>
                <p className="text-xs text-gray-500 mb-3">Elementlarni to'g'ri tartibga keltiring</p>
                <div className="space-y-2">
                  {(answers[q.id] as string[] || q.items.map(i => i.id)).map((id, idx) => {
                    const item = q.items!.find(i => i.id === id)
                    if (!item) return null
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                        <span className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-mono text-gray-500 shrink-0">{idx + 1}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.content}</span>
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => {
                            const ord = answers[q.id] as string[] || q.items!.map(i => i.id)
                            const newOrd = [...ord]
                            if (idx > 0) { [newOrd[idx - 1], newOrd[idx]] = [newOrd[idx], newOrd[idx - 1]]; handleAnswer(newOrd) }
                          }} className="p-1 rounded hover:bg-gray-100"><ChevronUp size={16} /></button>
                          <button onClick={() => {
                            const ord = answers[q.id] as string[] || q.items!.map(i => i.id)
                            const newOrd = [...ord]
                            if (idx < ord.length - 1) { [newOrd[idx], newOrd[idx + 1]] = [newOrd[idx + 1], newOrd[idx]]; handleAnswer(newOrd) }
                          }} className="p-1 rounded hover:bg-gray-100"><ChevronDown size={16} /></button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mt-6">
              <button onClick={() => setFlagged(p => { const n = new Set(p); n.has(currentQ) ? n.delete(currentQ) : n.add(currentQ); return n })} className={`flex items-center gap-1.5 text-sm ${flagged.has(currentQ) ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-600`}>
                <Flag size={14} /> {flagged.has(currentQ) ? 'Belgilangan' : 'Belgilash'}
              </button>
              <div className="flex gap-2">
                <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0} className="btn-secondary text-sm py-2 px-4 disabled:opacity-50 flex items-center gap-1.5">
                  <ChevronLeft size={14} /> Avvalgi
                </button>
                <button onClick={() => setCurrentQ(p => Math.min(TOTAL - 1, p + 1))} disabled={currentQ === TOTAL - 1} className="btn-secondary text-sm py-2 px-4 disabled:opacity-50 flex items-center gap-1.5">
                  Keyingi <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="card p-4 sticky top-20">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Savollar</h4>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrentQ(i)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${currentQ === i ? 'ring-2 ring-primary-500' : ''} ${answers[questions[i].id] ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700' : flagged.has(i) ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-gray-400">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-primary-100" /> Javob berilgan</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-100" /> Belgilangan</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-100" /> Javob yo'q</div>
            </div>
            {answered === TOTAL && (
              <button onClick={handleFinish} className="w-full mt-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
                Yakunlash
              </button>
            )}
          </div>
        </div>
      </div>
      {answered < TOTAL && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/30 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">Hali {TOTAL - answered} ta savolga javob bermadingiz.</p>
        </div>
      )}
    </div>
  )
}
