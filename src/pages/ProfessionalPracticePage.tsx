import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ClipboardCheck, FileText, ShieldCheck } from 'lucide-react'
import { MODULES } from '../data/contentTree'
import { PEDAGOGY_SPEC_OBJECTIVES } from '../data/pedagogySpec2026'

/**
 * Official 2026 distribution: KS=5, PM.GEN=7, PM.MET=3.
 * Module topic labels use the catalog rather than a duplicated list.
 * Historical test PDFs are study signals, never independently certified keys.
 */
const sections = [
  {
    code: 'M14', range: '36–40', count: 5, title: 'Kasb standartlari',
    description: 'Rejalashtirish, baholash, xavfsiz muhit, kasbiy o‘sish va hamkorlik.',
    sources: ['Pedagogning kasbiy standarti — metodik qo‘llanma', '2026-yilgi attestatsiya spetsifikatsiyasi'],
  },
  {
    code: 'M15', range: '41–47', count: 7, title: 'Umumiy pedagogika',
    description: 'Didaktika, tarbiya, dars turlari, pedagogik qobiliyatlar va inklyuziv ta’lim.',
    sources: ['Xoliqov A. — Pedagogik mahorat', 'Qodirova F., Pulatova D. — Inklyuziv ta’lim', 'Dars turlari va pedagogik qobiliyatlar qo‘llanmalari'],
  },
  {
    code: 'M16', range: '48–50', count: 3, title: 'Informatika o‘qitish metodikasi',
    description: 'Fan metodikasi, o‘qitish usullari va pedagogik vaziyatli qarorlar.',
    sources: ['Mamarajabov M.E. va boshq. — Informatika o‘qitish metodikasi', '2026-yilgi attestatsiya spetsifikatsiyasi'],
  },
] as const

export default function ProfessionalPracticePage() {
  const topicCount = sections.reduce(
    (n, section) => n + (MODULES.find(module => module.id === section.code)?.subtopics.length ?? 0),
    0,
  )
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="rounded-3xl bg-indigo-700 p-6 text-white sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">Attestatsiya 2026 · 36–50-savollar</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Pedagogika va kasb standartlariga tayyorgarlik</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-indigo-100">
          Nazariya, testlar va xatolar tahlili uchun yagona boshlang‘ich sahifa.
          {' '}{topicCount} ta mavzu · 15 savol (5 + 7 + 3) · maksimal 30 ball.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/learn/M15" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
            <BookOpen size={17} aria-hidden="true" /> Nazariyadan boshlash
          </Link>
          <Link to="/exam/pedagogik_15" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-indigo-200 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-600">
            <ClipboardCheck size={17} aria-hidden="true" /> 15 savollik sinov
          </Link>
        </div>
      </header>

      <section aria-labelledby="pedagogy-path">
        <h2 id="pedagogy-path" className="text-lg font-bold text-gray-950 dark:text-white">Tayyorlanish tartibi</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Mavzuni tanlang → nazariyani o‘rganing → mavzu testini ishlang →
          xatolarni tahlil qiling → aralash 15 savollik sinovdan o‘ting.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3" aria-label="Pedagogika o‘quv bo‘limlari">
        {sections.map(section => {
          const topics = MODULES.find(module => module.id === section.code)?.subtopics ?? []
          return (
            <article key={section.code} className="flex min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">{section.code}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{section.range}-savollar</span>
              </div>
              <p className="mt-4 text-3xl font-bold text-gray-950 dark:text-white">{section.count} <span className="text-xs font-normal text-gray-500">ta savol</span></p>
              <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{section.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{section.description}</p>

              <details className="mt-4 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50" open={section.code === 'M15'}>
                <summary className="cursor-pointer px-3 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">Mavzular ({topics.length})</summary>
                <ol className="space-y-2 border-t border-gray-200 px-3 py-3 dark:border-gray-700">
                  {topics.map(topic => (
                    <li key={topic.id} className="flex items-start gap-2 text-xs leading-5">
                      <span className="shrink-0 font-mono text-indigo-600 dark:text-indigo-300">{topic.id}</span>
                      <span className="min-w-0 text-gray-700 dark:text-gray-300">
                        <span className="block font-semibold">{topic.title}</span>
                        <span className="mt-0.5 block text-gray-500 dark:text-gray-400">
                          {PEDAGOGY_SPEC_OBJECTIVES[topic.id]?.skill ?? 'Rasmiy spetsifikatsiya bilan moslik tekshirilmoqda'}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="border-t border-gray-200 px-3 py-2 text-[11px] leading-5 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Ko‘nikmalar: 2026-yilgi informatika attestatsiyasi spetsifikatsiyasi, 2-jadval, 6–7-betlar. Bu mavzu boshiga alohida savol kvotasi emas.
                </p>
              </details>

              <div className="mt-4 rounded-xl bg-indigo-50/60 p-3 dark:bg-indigo-950/30">
                <p className="flex items-center gap-2 text-xs font-semibold text-indigo-800 dark:text-indigo-200"><FileText size={14} aria-hidden="true" /> Asosiy manbalar</p>
                <ul className="mt-2 space-y-1.5 text-xs leading-5 text-gray-700 dark:text-gray-300">
                  {section.sources.map(source => <li key={source}>• {source}</li>)}
                </ul>
              </div>

              <Link to={'/learn/' + section.code} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                Mavzularni o‘rganish <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          )
        })}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"><ShieldCheck size={18} className="text-indigo-600" aria-hidden="true" /> Baholash va manbalar</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          15 savollik mashq uchun 30 daqiqa; rasmiy 50 savollik malaka sinovida
          120 daqiqa beriladi. Javoblar serverda baholanadi. Tarixiy test
          to‘plamlaridagi javoblar alohida tekshirilmasdan rasmiy kalit deb
          qabul qilinmaydi. Mavzu testining savollar banki yetarli bo‘lmasa
          test boshlanmasligi kerak.
        </p>
      </section>
      <nav aria-label="Pedagogika qo‘shimcha yo‘llari" className="flex flex-wrap gap-5 text-sm font-semibold">
        <Link to="/history" className="text-indigo-600 hover:underline dark:text-indigo-300">Natijalar tarixi</Link>
        <Link to="/review" className="text-indigo-600 hover:underline dark:text-indigo-300">Xatolarni qayta ishlash</Link>
        <Link to="/learn" className="text-indigo-600 hover:underline dark:text-indigo-300">Barcha bo‘limlar</Link>
      </nav>
    </main>
  )
}
