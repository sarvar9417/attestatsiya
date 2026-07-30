import { Link } from 'react-router-dom'
import { Construction, ShieldCheck } from 'lucide-react'

export default function ExamPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="card max-w-xl w-full p-8 text-center">
        <div className="flex justify-center gap-3 mb-5 text-primary-600">
          <Construction size={36} aria-hidden="true" />
          <ShieldCheck size={36} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Xavfsiz sinov moduli tayyorlanmoqda
        </h1>
        <p className="mt-3 text-gray-500">
          Browser ichida javob tekshiradigan demo vaqtincha o‘chirildi. 50
          savollik sinov server timeri, himoyalangan javob kaliti va
          idempotent submission tayyor bo‘lgach ochiladi.
        </p>
        <Link to="/" className="btn-primary inline-flex mt-6">
          Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  )
}
