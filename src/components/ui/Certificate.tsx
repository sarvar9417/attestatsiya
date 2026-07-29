import { useRef } from 'react'
import { Download, Share2 } from 'lucide-react'

interface CertificateProps {
  userName: string
  completionDate: string  // 'YYYY-MM-DD'
  totalXP: number
  onClose: () => void
}

export function Certificate({ userName, completionDate, totalXP, onClose }: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null)

  const date = new Date(completionDate).toLocaleDateString('uz-UZ', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  async function handleDownload() {
    // html2canvas mavjud bo'lmasa oddiy print dialog
    const el = certRef.current
    if (!el) return
    // html2canvas mavjud emas — brauzer print dialog orqali saqlash
    const style = document.createElement('style')
    style.textContent = '@media print { body > *:not(#cert-print) { display: none !important; } }'
    el.id = 'cert-print'
    document.head.appendChild(style)
    window.print()
    document.head.removeChild(style)
    el.removeAttribute('id')
  }

  async function handleShare() {
    const text = `Men EnglishPath platformasida 126 kunlik B2 intensiv kursini yakunladim! 🎉 #EnglishPath #B2`
    if (navigator.share) {
      await navigator.share({ title: 'EnglishPath B2 Certificate', text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl">
        {/* Sertifikat */}
        <div
          ref={certRef}
          className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 text-center relative overflow-hidden"
        >
          {/* Fon bezak */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400 rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          {/* Logo */}
          <div className="relative">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-black text-2xl">EP</span>
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">
              EnglishPath Platform
            </p>
            <h1 className="text-3xl font-black text-gray-900 mb-1">
              Sertifikat
            </h1>
            <p className="text-sm text-gray-500 mb-6">Ingliz tilini muvaffaqiyatli o'rganganlik uchun</p>

            <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-6" />

            <p className="text-sm text-gray-500 mb-2">Ushbu sertifikat</p>
            <p className="text-4xl font-black text-blue-600 mb-2">{userName}</p>
            <p className="text-sm text-gray-500 mb-6">ga beriladi</p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6">
              <p className="text-base font-semibold text-gray-700 leading-relaxed">
                126 kunlik intensiv o'quv jarayonini muvaffaqiyatli yakunlab,
                <span className="font-black text-blue-600"> B2 darajasi</span>ga
                erishganligi tasdiqlandi.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Daraja', value: 'B2' },
                { label: 'Davomiyligi', value: '126 kun' },
                { label: 'Jami XP', value: totalXP.toLocaleString() },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="text-lg font-black text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Sana: {date}</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★★★★★</span>
                <span>EnglishPath · A1→B2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tugmalar */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
          >
            <Download size={18} /> Yuklab olish
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-colors"
          >
            <Share2 size={18} /> Ulashish
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 bg-gray-100 text-gray-600 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
