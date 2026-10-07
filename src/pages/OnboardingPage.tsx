import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  authClient,
  type OnboardingState,
  type CompleteOnboardingInput,
} from '../features/auth/authClient'
import { useAuth } from '../hooks/useAuth'

const DAILY_GOALS = [10, 20, 30, 45, 60] as const

function tashkentToday(): string {
  const offsetMs = 5 * 60 * 60 * 1000
  return new Date(Date.now() + offsetMs).toISOString().slice(0, 10)
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { displayName, updateProfile } = useAuth()
  const [state, setState] = useState<OnboardingState | null>(null)
  const [name, setName] = useState(displayName ?? '')
  const [examDate, setExamDate] = useState('')
  const [dateUnknown, setDateUnknown] = useState(true)
  const [dailyGoal, setDailyGoal] =
    useState<(typeof DAILY_GOALS)[number]>(30)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    void authClient
      .getOnboarding()
      .then((next) => {
        if (!active) return
        setState(next)
        if (next.display_name) setName(next.display_name)
        if (next.exam_date) {
          setExamDate(next.exam_date)
          setDateUnknown(false)
        }
        if (
          DAILY_GOALS.includes(
            next.daily_goal_minutes as (typeof DAILY_GOALS)[number]
          )
        ) {
          setDailyGoal(next.daily_goal_minutes as (typeof DAILY_GOALS)[number])
        }
      })
      .catch(() => {
        if (active) {
          setError('Onboarding ma’lumotlarini yuklab bo‘lmadi. Qayta urinib ko‘ring.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const examDateValue = dateUnknown ? null : examDate
  const canSave = useMemo(
    () =>
      name.trim().length >= 2 &&
      (dateUnknown || Boolean(examDate)) &&
      !saving &&
      !loading,
    [dateUnknown, examDate, loading, name, saving]
  )

  async function complete(startDiagnostic: boolean) {
    if (!canSave) return

    setSaving(true)
    setError(null)

    const profileResult = await updateProfile(name.trim())
    if (profileResult.error) {
      setSaving(false)
      setError(profileResult.error.message)
      return
    }

    const payload: CompleteOnboardingInput = {
      exam_date: examDateValue,
      daily_goal_minutes: dailyGoal,
      start_diagnostic: startDiagnostic,
    }

    try {
      const result = await authClient.completeOnboarding(payload)
      if (!result.state.completed) {
        throw new Error('Onboarding holati tasdiqlanmadi.')
      }
      navigate(
        result.next_action === 'diagnostic' ? '/exam/diagnostika' : '/',
        { replace: true }
      )
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Onboardingni saqlashda xatolik yuz berdi.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950">
        <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" />
      </main>
    )
  }

  if (state && !state.available) {
    return (
      <main className="grid min-h-screen place-items-center bg-gray-50 px-4 dark:bg-gray-950">
        <section className="w-full max-w-lg rounded-3xl border border-amber-200 bg-white p-7 shadow-sm dark:border-amber-900/60 dark:bg-gray-900">
          <h1 className="text-xl font-bold text-gray-950 dark:text-white">
            Onboarding bazasi tayyorlanmoqda
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Profil migratsiyasi production bazaga qo‘llangach bu bosqich avtomatik faollashadi.
          </p>
          <button
            type="button"
            onClick={() => navigate('/', { replace: true })}
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Dashboardga o‘tish
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-950 sm:py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6">
          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            Boshlang‘ich sozlash
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
            Attestatsiya rejangizni sozlang
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Ismingiz, imtihon sanasi va kunlik o‘qish vaqtini belgilang. Diagnostikani hozir boshlashingiz yoki keyinroq o‘tishingiz mumkin.
          </p>
        </header>

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-6 p-5 sm:p-7">
              <div>
                <label
                  htmlFor="onboarding-name"
                  className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-gray-200"
                >
                  Ism va familiya
                </label>
                <input
                  id="onboarding-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={100}
                  autoComplete="name"
                  className="input"
                  placeholder="Ism familiyangiz"
                />
              </div>

              <fieldset>
                <legend className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <CalendarDays size={17} aria-hidden="true" />
                  Imtihon sanasi
                </legend>
                <label className="mt-3 flex min-h-11 items-center gap-3 rounded-xl border border-gray-200 px-4 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={dateUnknown}
                    onChange={(event) => setDateUnknown(event.target.checked)}
                  />
                  Hali noma’lum
                </label>
                {!dateUnknown && (
                  <input
                    aria-label="Imtihon sanasi"
                    type="date"
                    min={tashkentToday()}
                    value={examDate}
                    onChange={(event) => setExamDate(event.target.value)}
                    className="input mt-3"
                  />
                )}
              </fieldset>

              <fieldset>
                <legend className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <Clock3 size={17} aria-hidden="true" />
                  Kunlik o‘qish vaqti
                </legend>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {DAILY_GOALS.map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      aria-pressed={dailyGoal === minutes}
                      onClick={() => setDailyGoal(minutes)}
                      className={`min-h-11 rounded-xl border px-3 text-sm font-semibold transition ${
                        dailyGoal === minutes
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
                      }`}
                    >
                      {minutes} daq
                    </button>
                  ))}
                </div>
              </fieldset>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                >
                  {error}
                </div>
              )}
            </div>

            <aside className="border-t border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-950/40 sm:p-7 lg:border-l lg:border-t-0">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white">
                <Sparkles size={20} aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-950 dark:text-white">
                Keyingi qadam
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Diagnostika boshlang‘ich holatni aniqlashga yordam beradi. Uni o‘tkazib yuborsangiz, dashboard boshlang‘ich daraja hali noma’lumligini ko‘rsatadi.
              </p>

              <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                Kunlik reja: {dailyGoal} daqiqa
              </div>

              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  disabled={!canSave}
                  onClick={() => void complete(true)}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Saqlanmoqda...' : 'Diagnostikani boshlash'}
                  {!saving && <ArrowRight size={16} aria-hidden="true" />}
                </button>
                <button
                  type="button"
                  disabled={!canSave}
                  onClick={() => void complete(false)}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                >
                  Hozircha o‘tkazib yuborish
                </button>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}
