import { Link } from 'react-router-dom'
import { ClipboardCheck, BookOpen, ShieldCheck } from 'lucide-react'
const sections = [
  {code:'M14',range:'36–40',name:'Kasb standartlari',count:5},
  {code:'M15',range:'41–47',name:'Umumiy pedagogika',count:7},
  {code:'M16',range:'48–50',name:'Informatika o‘qitish metodikasi',count:3},
] as const
export default function ProfessionalPracticePage() {
  return <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
    <header className="rounded-3xl bg-indigo-700 p-7 text-white">
      <p className="text-sm text-indigo-100">Attestatsiya 2026 · 36–50-savollar</p>
      <h1 className="mt-2 text-3xl font-bold">Pedagogik mahorat va kasb standartlari</h1>
      <p className="mt-2 text-indigo-100">15 savol: 5 kasb standarti, 7 pedagogika, 3 informatika metodikasi. Har savol 2 ball, maksimum 30 ball.</p>
      <Link to="/exam/pedagogik_15" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700"><ClipboardCheck size={18} /> 15 savollik praktikani boshlash</Link>
    </header>
    <section className="grid gap-4 sm:grid-cols-3" aria-label="Praktika tarkibi">
      {sections.map(s=><article key={s.code} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">{s.range}-savollar</p>
        <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{s.count}</p>
        <h2 className="mt-1 font-semibold text-gray-900 dark:text-white">{s.name}</h2>
        <Link to={`/learn/${s.code}`} className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300"><BookOpen size={16} /> Darslarni o‘rganish</Link>
      </article>)}
    </section>
    <p className="flex gap-3 rounded-2xl border border-gray-200 p-5 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-300"><ShieldCheck size={20} className="shrink-0" /> 30 daqiqa faqat mustaqil mashq uchun; rasmiy imtihon 120 daqiqa. Javoblar sinov tugaguncha brauzerga uzatilmaydi. Bank yetarli bo‘lmasa noto‘liq test yaratilmaydi. Yakunda natija va xatolar tahlili saqlanadi.</p>
  </main>
}
