import { CheckCircle, XCircle, ChevronRight, ChevronLeft } from 'lucide-react'
import type { ListeningQuestion } from '../../data/dailyLessons'
import { DIFFICULTY_LABEL, checkAnswer } from './listeningUtils'
import { db } from '../../lib/db'

interface Props {
  q: ListeningQuestion
  index: number
  isSubmitted: boolean
  userAns: number | number[] | string | boolean | string[] | undefined
  shuffledOptions?: string[]
  shuffledCorrectIndex?: number
  onChoice: (qId: number, optionIdx: number) => void
  onMultiChoice: (qId: number, optionIdx: number) => void
  onFillBlank: (qId: number, value: string) => void
  onOrdering: (qId: number, items: number[]) => void
  onTrueFalse: (qId: number, value: boolean) => void
  onMatching: (qId: number, pairIdx: number, value: string) => void
}

export default function ListeningQuestionCard({
  q, index, isSubmitted, userAns,
  shuffledOptions, shuffledCorrectIndex,
  onChoice, onMultiChoice, onFillBlank, onOrdering, onTrueFalse, onMatching,
}: Props) {
  const isCorrect = isSubmitted ? checkAnswer(q, userAns) : false
  const d = DIFFICULTY_LABEL[q.difficulty || 'easy']

  const renderOptions = () => {
    switch (q.type) {
      case 'multiple-choice':
      case 'true-false': {
        const options = q.type === 'true-false'
          ? ['True', 'False']
          : (shuffledOptions ?? q.options ?? [])
        const correctIdx = q.type === 'true-false'
          ? ((db.cast<boolean>(q.answer)) === true ? 0 : 1)
          : (shuffledCorrectIndex ?? q.correctIndex!)
        return (
          <div className="space-y-1.5">
            {options.map((opt, i) => {
              const isSelected = userAns === i
              let cls = 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700 text-gray-700 dark:text-gray-300'
              if (isSubmitted) {
                if (i === correctIdx) cls = 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-semibold'
                else if (isSelected && !isCorrect) cls = 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                else cls = 'border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600'
              } else if (isSelected) {
                cls = 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300'
              }
              return (
                <button key={i} onClick={() => !isSubmitted && (q.type === 'true-false' ? onTrueFalse(q.id, i === 0) : onChoice(q.id, i))}
                  disabled={isSubmitted}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all ${cls}`}>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${isSelected && !isSubmitted ? 'bg-primary-500 border-primary-500 text-white' : isSubmitted && i === correctIdx ? 'bg-green-500 border-green-500 text-white' : isSubmitted && isSelected && !isCorrect ? 'bg-red-500 border-red-500 text-white' : 'border-current'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {isSubmitted && i === correctIdx && <CheckCircle size={14} className="text-green-600 dark:text-green-400 shrink-0" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle size={14} className="text-red-500 shrink-0" />}
                </button>
              )
            })}
          </div>
        )
      }
      case 'fill-blank':
        return (
          <div className="space-y-2">
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              {q.question.split('_____').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <input
                      type="text"
                      value={(typeof userAns === 'string' ? userAns : '') || ''}
                      onChange={e => onFillBlank(q.id, e.target.value)}
                      disabled={isSubmitted}
                      className={`inline-block mx-1 px-2 py-0.5 border-b-2 text-center font-semibold min-w-[100px] bg-transparent focus:outline-none ${isSubmitted ? (isCorrect ? 'border-green-500 text-green-700 dark:text-green-400' : 'border-red-500 text-red-700 dark:text-red-400') : 'border-primary-400 dark:border-primary-600 text-primary-700 dark:text-primary-300'}`}
                      placeholder="type here..."
                      autoComplete="off"
                    />
                  )}
                </span>
              ))}
            </div>
            {isSubmitted && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                To'g'ri javob: <span className="font-bold text-green-700 dark:text-green-400">{q.answer}</span>
              </p>
            )}
          </div>
        )
      case 'multiple-answer': {
        const options = q.options ?? []
        const correctIndices = q.correctIndices ?? []
        const selected = (userAns as number[]) || []
        return (
          <div className="space-y-1.5">
            <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-2">Bir nechta to'g'ri javobni tanlang:</p>
            {options.map((opt, i) => {
              const isSelected = selected.includes(i)
              let cls = 'border-gray-200 dark:border-gray-600 hover:border-primary-300 text-gray-700 dark:text-gray-300'
              if (isSubmitted) {
                if (correctIndices.includes(i) && isSelected) cls = 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-semibold'
                else if (correctIndices.includes(i)) cls = 'border-green-400 bg-green-50/50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                else cls = 'border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600'
              } else if (isSelected) {
                cls = 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300'
              }
              return (
                <button key={i} onClick={() => !isSubmitted && onMultiChoice(q.id, i)} disabled={isSubmitted}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all ${cls}`}>
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0 border ${isSelected && !isSubmitted ? 'bg-primary-500 border-primary-500 text-white' : isSubmitted && correctIndices.includes(i) ? 'bg-green-500 border-green-500 text-white' : isSubmitted && isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-current'}`}>
                    {isSelected ? '✓' : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {isSubmitted && correctIndices.includes(i) && <CheckCircle size={14} className="text-green-600 ml-auto shrink-0" />}
                </button>
              )
            })}
          </div>
        )
      }
      case 'ordering': {
        const items = q.options ?? []
        const currentOrder = (userAns as number[]) || items.map((_, i) => i)
        return (
          <div className="space-y-1.5">
            <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-2">Voqealarni tartib bilan joylashtiring:</p>
            {currentOrder.map((itemIdx, pos) => (
              <div key={pos} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold shrink-0">{pos + 1}</span>
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{items[itemIdx]}</span>
                {!isSubmitted && (
                  <div className="flex gap-1">
                    <button onClick={() => { if (pos === 0) return; const upd = [...currentOrder]; [upd[pos], upd[pos - 1]] = [upd[pos - 1], upd[pos]]; onOrdering(q.id, upd) }}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                      <ChevronLeft size={14} />
                    </button>
                    <button onClick={() => { if (pos === currentOrder.length - 1) return; const upd = [...currentOrder]; [upd[pos], upd[pos + 1]] = [upd[pos + 1], upd[pos]]; onOrdering(q.id, upd) }}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
      case 'matching': {
        const pairs = q.pairs ?? []
        const matchAnswers = (userAns as string[]) || []
        return (
          <div className="space-y-3">
            <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-2">Har bir gapni to'g'ri kishiga moslang:</p>
            {pairs.map((pair, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-1/3">{pair.left}</span>
                <ChevronRight size={14} className="text-gray-400 shrink-0" />
                <select
                  value={matchAnswers[i] || ''}
                  onChange={e => onMatching(q.id, i, e.target.value)}
                  disabled={isSubmitted}
                  className={`flex-1 px-3 py-2 rounded-xl border text-sm bg-white dark:bg-gray-800 ${isSubmitted ? (matchAnswers[i] === pair.right ? 'border-green-400 text-green-700' : 'border-red-400 text-red-700') : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                >
                  <option value="">-- Tanlang --</option>
                  {pairs.map((p, j) => (
                    <option key={j} value={p.right}>{p.right}</option>
                  ))}
                </select>
                {isSubmitted && matchAnswers[i] === pair.right && <CheckCircle size={14} className="text-green-500 shrink-0" />}
                {isSubmitted && matchAnswers[i] !== pair.right && matchAnswers[i] !== '' && <XCircle size={14} className="text-red-500 shrink-0" />}
              </div>
            ))}
            {isSubmitted && (
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2.5 mt-2">
                To'g'ri moslamalar: {pairs.map(p => `${p.left} → ${p.right}`).join(', ')}
              </div>
            )}
          </div>
        )
      }
      default:
        return null
    }
  }

  return (
    <div key={q.id} className={`card ${isSubmitted ? (isCorrect ? 'ring-1 ring-green-300 dark:ring-green-700' : 'ring-1 ring-red-300 dark:ring-red-700') : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSubmitted ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'}`}>
            {index + 1}
          </span>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{q.question}</p>
        </div>
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${d.color}`}>{d.label}</span>
      </div>
      {renderOptions()}
      {isSubmitted && (
        <div className="mt-2.5 flex items-start gap-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2.5">
          <span className="text-blue-500 text-xs mt-0.5">💡</span>
          <p className="text-xs text-blue-700 dark:text-blue-300 italic">{q.explanation}</p>
        </div>
      )}
    </div>
  )
}
