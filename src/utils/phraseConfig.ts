export const PHRASE_BATCH_SIZE = 15
export const PHRASES_PER_DAY  = 45
export const PHRASE_NUM_BATCHES = 3

interface CategoryStyle {
  bg:    string
  text:  string
  label: string
}

export const PHRASE_CATEGORY_BADGES: Record<string, CategoryStyle> = {
  everyday:      { bg: 'bg-emerald-100 dark:bg-emerald-900/30',  text: 'text-emerald-700 dark:text-emerald-300',  label: 'Kundalik' },
  grammar:       { bg: 'bg-indigo-100 dark:bg-indigo-900/30',    text: 'text-indigo-700 dark:text-indigo-300',    label: 'Grammatika' },
  travel:        { bg: 'bg-sky-100 dark:bg-sky-900/30',          text: 'text-sky-700 dark:text-sky-300',          label: 'Sayohat' },
  formal:        { bg: 'bg-amber-100 dark:bg-amber-900/30',      text: 'text-amber-700 dark:text-amber-300',      label: 'Rasmiy' },
  ielts:         { bg: 'bg-rose-100 dark:bg-rose-900/30',        text: 'text-rose-700 dark:text-rose-300',        label: 'IELTS' },
  business:      { bg: 'bg-teal-100 dark:bg-teal-900/30',        text: 'text-teal-700 dark:text-teal-300',        label: 'Biznes' },
  food:          { bg: 'bg-orange-100 dark:bg-orange-900/30',    text: 'text-orange-700 dark:text-orange-300',    label: 'Ovqat' },
  health:        { bg: 'bg-red-100 dark:bg-red-900/30',          text: 'text-red-700 dark:text-red-300',          label: "Sog'liq" },
  education:     { bg: 'bg-blue-100 dark:bg-blue-900/30',        text: 'text-blue-700 dark:text-blue-300',        label: "Ta'lim" },
  social:        { bg: 'bg-pink-100 dark:bg-pink-900/30',        text: 'text-pink-700 dark:text-pink-300',        label: 'Ijtimoiy' },
  work:          { bg: 'bg-violet-100 dark:bg-violet-900/30',    text: 'text-violet-700 dark:text-violet-300',    label: 'Ish' },
  shopping:      { bg: 'bg-yellow-100 dark:bg-yellow-900/30',    text: 'text-yellow-700 dark:text-yellow-300',    label: 'Xarid' },
  relationships: { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', text: 'text-fuchsia-700 dark:text-fuchsia-300', label: 'Munosabat' },
  environment:   { bg: 'bg-green-100 dark:bg-green-900/30',      text: 'text-green-700 dark:text-green-300',      label: 'Muhit' },
  economy:       { bg: 'bg-lime-100 dark:bg-lime-900/30',        text: 'text-lime-700 dark:text-lime-300',        label: 'Iqtisod' },
  culture:       { bg: 'bg-purple-100 dark:bg-purple-900/30',    text: 'text-purple-700 dark:text-purple-300',    label: 'Madaniyat' },
  feelings:      { bg: 'bg-pink-100 dark:bg-pink-900/30',        text: 'text-pink-600 dark:text-pink-300',        label: "His-tuyg'u" },
  discussion:    { bg: 'bg-slate-100 dark:bg-slate-700/60',      text: 'text-slate-700 dark:text-slate-300',      label: 'Muhokama' },
  technology:    { bg: 'bg-cyan-100 dark:bg-cyan-900/30',        text: 'text-cyan-700 dark:text-cyan-300',        label: 'Texnologiya' },
  communication: { bg: 'bg-teal-100 dark:bg-teal-900/30',        text: 'text-teal-600 dark:text-teal-300',        label: 'Muloqot' },
}

const FALLBACK: CategoryStyle = {
  bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', label: 'Boshqa',
}

export function getCategoryStyle(cat: string): CategoryStyle {
  return PHRASE_CATEGORY_BADGES[cat] ?? FALLBACK
}
