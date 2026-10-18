import { useEffect, useState } from 'react'
import {
  deleteCustomTestPreset,
  listCustomTestPresets,
  saveCustomTestPreset,
  updateCustomTestPreset,
  type CustomExamConfig,
  type CustomPreset,
} from './customTestApi'

interface SavedPresetsPanelProps {
  config: CustomExamConfig
  invalid: boolean
  onLoad: (value: CustomExamConfig) => void
}

function errorLabel(error: unknown): string {
  return error instanceof Error ? error.message : 'Shablonlar bilan ishlashda xato'
}

export default function SavedPresetsPanel({
  config, invalid, onLoad,
}: SavedPresetsPanelProps) {
  const [presets, setPresets] = useState<CustomPreset[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void listCustomTestPresets()
      .then(rows => { if (active) setPresets(rows) })
      .catch(failure => { if (active) setError(errorLabel(failure)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const save = async () => {
    const cleanName = name.trim()
    if (invalid || cleanName.length < 2 || cleanName.length > 60 || busy) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const value = await saveCustomTestPreset(cleanName, config)
      setPresets(old => [value, ...old])
      setName('')
      setNotice('Test shabloni saqlandi.')
    } catch (failure) {
      setError(errorLabel(failure))
    } finally {
      setBusy(false)
    }
  }

  const rename = async () => {
    const cleanName = editingName.trim()
    if (!editingId || cleanName.length < 2 || cleanName.length > 60 || busy) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const value = await updateCustomTestPreset(editingId, { name: cleanName })
      setPresets(old => old.map(preset => preset.id === value.id ? value : preset))
      setEditingId(null)
      setNotice('Shablon nomi yangilandi.')
    } catch (failure) {
      setError(errorLabel(failure))
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: string) => {
    if (busy) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await deleteCustomTestPreset(id)
      setPresets(old => old.filter(preset => preset.id !== id))
      setConfirmDeleteId(null)
      setNotice('Shablon o‘chirildi.')
    } catch (failure) {
      setError(errorLabel(failure))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section aria-label="Saqlangan test shablonlari"
      className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Saqlangan shablonlar</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        O‘zingizga tegishli 30 tagacha test sozlamasini saqlang.
        Yuklangan shablon bo‘yicha savollar mavjudligini qayta tekshirish zarur.
      </p>

      <label className="block space-y-1 text-sm text-gray-700 dark:text-gray-200">
        <span className="font-semibold">Yangi shablon nomi</span>
        <input type="text" maxLength={60} value={name}
          onChange={event => setName(event.target.value)}
          placeholder="Masalan, Qiyin Python va Excel"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"/>
      </label>
      <button type="button" onClick={() => void save()}
        disabled={invalid || busy || presets.length >= 30 || name.trim().length < 2}
        className="min-h-11 w-full rounded-xl border border-indigo-500 px-3 py-2 text-sm font-semibold text-indigo-700 disabled:opacity-40 dark:text-indigo-300">
        Joriy sozlamalarni saqlash
      </button>

      {loading && <p role="status" className="text-xs text-gray-500">Shablonlar yuklanmoqda...</p>}
      {error && <p role="alert" className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      {notice && <p role="status" className="text-xs text-emerald-600 dark:text-emerald-300">{notice}</p>}

      {!loading && presets.length === 0 && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Hozircha saqlangan shablon yo‘q.</p>
      )}

      <ul className="space-y-2">
        {presets.map(preset => (
          <li key={preset.id} className="space-y-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            {editingId === preset.id ? (
              <div className="space-y-2">
                <label className="block space-y-1 text-xs dark:text-gray-200">
                  <span>Shablon nomini o‘zgartirish</span>
                  <input value={editingName} maxLength={60}
                    onChange={event => setEditingName(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 dark:border-gray-600 dark:bg-gray-900"/>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy || editingName.trim().length < 2}
                    onClick={() => void rename()}
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Saqlash</button>
                  <button type="button" onClick={() => setEditingId(null)}
                    className="rounded-lg border px-3 py-2 text-xs dark:text-white">Bekor qilish</button>
                </div>
              </div>
            ) : (
              <>
                <p className="break-words text-sm font-semibold text-gray-900 dark:text-white">{preset.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {preset.config.total_count} savol · {preset.config.topics.length} mavzu
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => {
                    onLoad(preset.config)
                    setNotice('Shablon yuklandi. Savollar yetarliligini qayta tekshiring.')
                    setError(null)
                  }} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">
                    Yuklash
                  </button>
                  <button type="button" disabled={busy} onClick={() => {
                    setEditingId(preset.id)
                    setEditingName(preset.name)
                    setConfirmDeleteId(null)
                  }} className="rounded-lg border px-3 py-2 text-xs dark:text-white">
                    Nomini o‘zgartirish
                  </button>
                  {confirmDeleteId === preset.id ? (
                    <>
                      <button type="button" disabled={busy}
                        onClick={() => void remove(preset.id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                        O‘chirishni tasdiqlash
                      </button>
                      <button type="button" onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg border px-3 py-2 text-xs dark:text-white">Bekor qilish</button>
                    </>
                  ) : (
                    <button type="button" disabled={busy}
                      onClick={() => setConfirmDeleteId(preset.id)}
                      className="rounded-lg border border-red-400 px-3 py-2 text-xs text-red-700 dark:text-red-300">
                      O‘chirish
                    </button>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
