import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await updatePassword(password)
    if (error) setError(error.message)
    else setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Parol yangilandi</h1>
        <p className="text-gray-500 mb-6">Parolingiz muvaffaqiyatli yangilandi</p>
        <button onClick={() => navigate('/')} className="btn-primary">Bosh sahifaga o'tish</button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-md card shadow-xl">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Yangi parol kiriting</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Yangi parol" required minLength={6} className="input" />
          {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}
          <button type="submit" className="btn-primary w-full">Saqlash</button>
        </form>
      </div>
    </div>
  )
}
