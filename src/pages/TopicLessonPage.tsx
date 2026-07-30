import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MODULES, getSubtopicById } from '../data/contentTree'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'

type TestType = 'theory' | 'Y1' | 'Y2' | 'Y3'

interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  type: TestType
}

const SAMPLE_QUESTIONS: Record<string, Question[]> = {
  'M03-03': [
    { id: 'q1', text: '1011₂ sonini o\'nlik sanoq sistemasiga o\'tkazing.', options: ['9', '11', '13', '15'], correctIndex: 1, explanation: '1011₂ = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11₁₀', type: 'Y1' },
    { id: 'q2', text: '255₁₀ sonini ikkilik sanoq sistemasiga o\'tkazing.', options: ['11111111₂', '11111110₂', '11101111₂', '11001100₂'], correctIndex: 0, explanation: '255₁₀ = 256 - 1 = 11111111₂', type: 'Y2' },
    { id: 'q3', text: '1Aₓ = 26₁₀ bo\'lsa, x sanoq sistemasining asosini toping.', options: ['10', '12', '14', '16'], correctIndex: 3, explanation: '1A₁₆ = 1×16 + 10 = 26₁₀. Demak x = 16.', type: 'Y3' },
  ],
  'M08-05': [
    { id: 'q4', text: 'Pythonda [1, 2, 3] va [4, 5] ro\'yxatlarini birlashtirish uchun qaysi operator ishlatiladi?', options: ['+', '*', '&', '|'], correctIndex: 0, explanation: 'Pythonda ro\'yxatlarni birlashtirish uchun + operatori ishlatiladi', type: 'Y1' },
    { id: 'q5', text: 'numbers = [1, 2, 3, 4, 5] da numbers[::-1] natijasi nima?', options: ['[1, 2, 3, 4, 5]', '[5, 4, 3, 2, 1]', 'Error', '[1]'], correctIndex: 1, explanation: '[::-1] ro\'yxatni teskari tartibda qaytaradi', type: 'Y2' },
  ],
}

export default function TopicLessonPage() {
  const { moduleId, subtopicId } = useParams()
  const [activeTab, setActiveTab] = useState<TestType>('theory')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const subtopic = subtopicId ? getSubtopicById(subtopicId) : undefined
  const module = moduleId ? MODULES.find(m => m.id === moduleId) : undefined
  const questions = (subtopicId && SAMPLE_QUESTIONS[subtopicId]) || []

  const filteredQuestions = questions.filter(q => q.type === activeTab || activeTab === 'theory')

  const correctCount = questions.filter(q => answers[q.id] === q.correctIndex && submitted[q.id]).length
  const totalAnswered = Object.keys(submitted).length

  const handleAnswer = (qId: string, optionIndex: number) => {
    if (submitted[qId]) return
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }))
  }

  const handleSubmit = (qId: string) => {
    if (answers[qId] === undefined) return
    setSubmitted(prev => ({ ...prev, [qId]: true }))
  }

  const progress = questions.length > 0 ? Math.round((totalAnswered / questions.length) * 100) : 0

  if (!module || !subtopic) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-gray-500">Mavzu topilmadi</p>
        <Link to="/learn" className="text-primary-600 hover:underline mt-2 inline-block">Modullarga qaytish</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <Link to="/learn" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-4">
        <ArrowLeft size={14} /> Modullarga qaytish
      </Link>

      <div className="mb-6">
        <span className="badge bg-primary-100 text-primary-700 text-xs font-mono mb-2 inline-block">{module.code}</span>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{subtopic.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{module.title}</p>
      </div>

      {questions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500">O'zlashtirish darajasi</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill bg-primary-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
        {(['theory', 'Y1', 'Y2', 'Y3'] as TestType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'theory' ? 'Nazariya' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'theory' && (
        <div className="card p-6 prose dark:prose-invert max-w-none">
          <h2 className="text-lg font-semibold mb-3">{subtopic.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{module.description}</p>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">Bu mavzu bo'yicha quyidagi bilim va ko'nikmalarga ega bo'lasiz:</p>
            <ul className="list-disc pl-5 space-y-1">
              {module.subtopics.map(st => (
                <li key={st.id}>{st.title}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab !== 'theory' && (
        <div className="space-y-4">
          {filteredQuestions.length === 0 && (
            <div className="card p-8 text-center text-gray-400">
              Bu darajadagi savollar hali tayyor emas
            </div>
          )}
          {filteredQuestions.map((q, idx) => {
            const isCorrect = answers[q.id] === q.correctIndex
            const isSubmitted = submitted[q.id]
            return (
              <div key={q.id} className="card p-5">
                <div className="flex items-start gap-3 mb-4">
                  <span className="badge bg-gray-100 text-gray-600 shrink-0 mt-0.5">
                    {q.type} {idx + 1}
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{q.text}</p>
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    let optionClass = 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    if (isSubmitted) {
                      if (oi === q.correctIndex) optionClass = 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      else if (oi === answers[q.id] && oi !== q.correctIndex) optionClass = 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    } else if (answers[q.id] === oi) {
                      optionClass = 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    }
                    return (
                      <button
                        key={oi}
                        onClick={() => handleAnswer(q.id, oi)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm text-left transition-all ${optionClass}`}
                      >
                        <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs font-medium shrink-0">
                          {isSubmitted && oi === q.correctIndex ? <CheckCircle2 size={14} className="text-green-600" /> :
                           isSubmitted && oi === answers[q.id] && oi !== q.correctIndex ? <XCircle size={14} className="text-red-600" /> :
                           String.fromCharCode(65 + oi)}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                      </button>
                    )
                  })}
                </div>

                {!isSubmitted ? (
                  <button
                    onClick={() => handleSubmit(q.id)}
                    disabled={answers[q.id] === undefined}
                    className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Javobni tekshirish
                  </button>
                ) : (
                  <div className={`mt-3 p-3 rounded-xl text-sm ${
                    isCorrect ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'bg-red-50 dark:bg-red-900/20 text-red-700'
                  }`}>
                    <p className="font-medium mb-1">{isCorrect ? 'To\'g\'ri! ✅' : 'Noto\'g\'ri ❌'}</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}

          {filteredQuestions.length > 0 && totalAnswered === filteredQuestions.length && (
            <div className="card p-6 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-100">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Natija: {correctCount}/{filteredQuestions.length} ({Math.round(correctCount / filteredQuestions.length * 100)}%)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {correctCount === filteredQuestions.length ? 'Mukammal! 🎉' :
                 correctCount >= filteredQuestions.length * 0.8 ? 'Yaxshi natija! 👍' :
                 'Ko\'proq mashq qilish kerak. 💪'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
