import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, ArrowRight } from 'lucide-react'
import { useI18n } from '../../i18n'
import type { DaySession } from '../../services/phrasesService'
import { getTodayTashkent } from '../../utils/tashkentDate'

function useCalendarLocale() {
  const { t } = useI18n()
  const weekdays = t('calendar.weekdays').split(',')
  const months = t('calendar.months').split(',')
  const shortMonths = months.map(m => m.substring(0, 3))
  const fullWeekdays = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
  return { weekdays, months, shortMonths, fullWeekdays }
}

interface Props {
  sessions: Map<string, DaySession>
  selectedDate: string
  onDateSelect: (date: string) => void
  onContinue: () => void
  onClose: () => void
}

function getMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

function fmt(dateStr: string, locale: ReturnType<typeof useCalendarLocale>): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getDate()} ${locale.shortMonths[d.getMonth()]} ${d.getFullYear()}, ${locale.fullWeekdays[d.getDay()]}`
}

export default function PhraseCalendar({ sessions, selectedDate, onDateSelect, onContinue, onClose }: Props) {
  const { t } = useI18n()
  const calLocale = useCalendarLocale()
  const today = getTodayTashkent()
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())

  const days = useMemo(() => getMonthGrid(year, month), [year, month])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function fmtDate(day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const selectedSession = sessions.get(selectedDate)
  const canContinue = selectedDate && selectedDate <= today && (!selectedSession || !selectedSession.all_completed)

  return (
    <div className="space-y-3">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {calLocale.months[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center">
          {calLocale.weekdays.map(d => (
            <div key={d} className="text-xs sm:text-xs font-semibold text-gray-400 py-1">{d}</div>
          ))}
          {days.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} />
            const dateStr = fmtDate(day)
            const session = sessions.get(dateStr)
            const isToday = dateStr === today
            const isSel = dateStr === selectedDate
            const isFuture = dateStr > today

            let dotClass = ''
            if (session?.all_completed) dotClass = 'bg-green-500'
            else if (session && session.completed_batches > 0) dotClass = 'bg-orange-400'
            else if (!isFuture) dotClass = 'bg-gray-200'

            return (
              <button
                key={day}
                onClick={() => !isFuture && onDateSelect(dateStr)}
                disabled={isFuture}
                className={`
                  relative pt-2 pb-1.5 rounded-xl text-xs font-medium transition-all
                  ${isFuture ? 'opacity-20 cursor-default' : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'}
                  ${isSel ? 'ring-2 ring-b1-500 bg-b1-50 dark:bg-b1-900/30' : ''}
                  ${isToday && !isSel ? 'ring-1 ring-b1-300 dark:ring-b1-600' : ''}
                `}
              >
                <span className={`block leading-tight ${isToday ? 'text-b1-600 dark:text-b1-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                  {day}
                </span>
                {dotClass && (
                  <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${dotClass}`} />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> {t('calendar.completed')}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> {t('calendar.partial')}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200" /> {t('calendar.notStarted')}</span>
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-b1-50 dark:bg-b1-900/30 flex items-center justify-center">
              <CalendarDays size={16} className="text-b1-600 dark:text-b1-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{fmt(selectedDate, calLocale)}</p>
              {selectedSession ? (
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>
                    {t('calendar.batch', { completed: selectedSession.completed_batches, total: 3 })}
                    {selectedSession.all_completed && <span className="text-green-600 ml-1">✅</span>}
                  </p>
                  <p>
                    <span className="font-semibold text-green-700">{t('calendar.learned', { count: selectedSession.total_score })}</span>
                    <span className="text-gray-300 mx-1">·</span>
                    <span>{t('calendar.viewed', { count: selectedSession.total_phrases })}</span>
                  </p>
                  {selectedSession.total_phrases > 0 && (
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${Math.round((selectedSession.total_score / selectedSession.total_phrases) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedDate === today ? t('calendar.taskNotStarted') : t('calendar.taskNotDone')}
                </p>
              )}
            </div>
          </div>

          {canContinue && (
            <button
              onClick={onContinue}
              className="mt-3 w-full py-3 bg-gradient-to-r from-b1-500 to-b1-600 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CalendarDays size={14} />
              {selectedDate === today ? t('calendar.startTask') : t('calendar.continueTask', { date: fmt(selectedDate, calLocale) })}
              <ArrowRight size={14} />
            </button>
          )}

          {selectedDate !== today && (
            <button onClick={onClose} className="mt-2 w-full py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all">
              {t('calendar.backToToday')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
