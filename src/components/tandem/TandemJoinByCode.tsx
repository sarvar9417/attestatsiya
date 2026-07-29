import { useState } from 'react'
import { Loader2, UserCheck } from 'lucide-react'
import { addFriendByCode } from '../../services/tandemService'
import { useToastStore } from '../../utils/toastStore'

interface TandemJoinByCodeProps {
  onJoined: () => void
}

export default function TandemJoinByCode({ onJoined }: TandemJoinByCodeProps) {
  const [code, setCode] = useState('')
  const [joining, setJoining] = useState(false)

  const handleJoin = async () => {
    if (!code.trim()) return
    setJoining(true)
    const result = await addFriendByCode(code.trim())
    if (result.success) {
      useToastStore.getState().toast("✅ Do'st qo'shildi!", 'success')
      setCode('')
      onJoined()
    } else {
      useToastStore.getState().toast(result.error || 'Xatolik', 'error')
    }
    setJoining(false)
  }

  return (
    <div className="flex gap-2">
      <input
        className="input flex-1 text-center font-mono text-sm"
        placeholder="Taklif kodingizni kiriting"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={60}
      />
      <button
        onClick={handleJoin}
        disabled={joining || !code.trim()}
        className="btn-primary px-4 py-2 text-sm disabled:opacity-40"
      >
        {joining ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
      </button>
    </div>
  )
}
