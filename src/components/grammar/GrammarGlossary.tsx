// Grammatik atamalar lug'ati — yig'iladigan, qidiriladigan panel.
// Grammar sahifasida ko'rsatiladi (ingliz atama → o'zbekcha standart tarjima).

import { useState, useMemo } from 'react'
import { BookMarked, Search, ChevronDown, Info } from 'lucide-react'
import { GRAMMAR_TERMS } from '../../data/grammarGlossary'

function normalize(s: string) {
  return s.toLowerCase().replace(/[''ʼ]/g, "'").trim()
}

export default function GrammarGlossary() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = normalize(query)
    if (!q) return GRAMMAR_TERMS
    return GRAMMAR_TERMS.filter(
      (t) => normalize(t.en).includes(q) || normalize(t.uz).includes(q) || normalize(t.short).includes(q),
    )
  }, [query])

  return (
    <div className="card border-primary-100">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 text-left"
        aria-expanded={open}
      >
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
          <BookMarked size={20} className="text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-900">Grammatik atamalar lug'ati</h2>
          <p className="text-xs text-gray-500">Ingliz atamalarning o'zbekcha tarjimasi — {GRAMMAR_TERMS.length} ta</p>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-4">
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Atama qidirish (ingliz yoki o'zbek)..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Hech narsa topilmadi</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {filtered.map((t) => (
                <div key={t.en} className="flex flex-col gap-1 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-primary-700 shrink-0">{t.en}</span>
                    <span className="text-sm text-gray-600">— {t.uz}</span>
                  </div>
                  {t.description && (
                    <div className="flex items-start gap-1.5 text-xs text-gray-500 leading-relaxed">
                      <Info size={10} className="mt-0.5 shrink-0 text-gray-400" />
                      <span>{t.description}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
