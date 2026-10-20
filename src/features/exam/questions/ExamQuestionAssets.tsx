/**
 * Render only audited same-origin static images.
 *
 * The kuzgi-demo SVG files are self-contained: each embeds the image cropped
 * from the source Word document. No external image URL from a question row is trusted.
 */
const ALGORITMLASH = new Set([
  'flow_sum','flow_abs','flow_div','flow_even','flow_loop','flow_max',
  'flow_sign','flow_grade','flow_euclid','graph_paths','algo_compare',
])
const OFFICE = new Set([
  'off_bar','off_line','off_pie','off_table','off_slides','off_timeline','off_wordtable',
])
const M07_SOURCE_BLOCKS = new Set(['m07_sl2_05_014','m07_sl2_05_018','m07_sl2_05_020','m07_sl2_05_023','m07_sl2_05_028','m07_sl2_06_015','m07_sl2_06_020','m07_sl2_06_022','m07_sl2_06_025','m07_sl2_06_026','m07_sl2_06_027'])
const M07_AUDIT = new Set(['m07_logo_nested_squares_20261020'])
const PEDGULI_SOURCE = new Set(['pedguli-4842-classroom-game', 'pedguli-4843-debate'])
const PEDGULI_PUBLISHED_DEBATE_QUESTION_ID = 'd41ab61f-a43e-4b2d-919b-5b06dde05341'
const DEBATE_ASSET = {
  kind: 'image',
  diagram_id: 'pedguli-4843-debate',
  alt: 'Ikki kishi minbardan navbat bilan bahslashayotgan sinf mashg‘uloti',
  src: '/pedguli-source/pedguli-4843-debate.jpg',
} as const

const KUZGI_DEMO = new Set([
  'demo_q01_powerpoint','demo_q11_access','demo_q18_flowchart',
  'demo_q04_blocks','demo_q04_options','demo_q14_labyrinth',
  'demo_q17_photoshop','demo_q19_wordtable','demo_q21_css',
  'demo_q27_html','demo_q30_logic','demo_q34_logo','demo_q39_word',
])

type Asset = { kind: 'image'; diagram_id: string; alt: string; src: string }

function approvedImagePath(id: string): string | null {
  if (ALGORITMLASH.has(id)) return `/algoritmlash-v2/${id}.svg`
  if (OFFICE.has(id)) return `/office-v2/${id}.svg`
  if (KUZGI_DEMO.has(id)) return `/kuzgi-demo/${id}.svg`
  if (M07_AUDIT.has(id)) return `/m07-audit-2026/${id}.svg`
  if (M07_SOURCE_BLOCKS.has(id)) return `/m07-source-blocks/${id}.svg`
  if (PEDGULI_SOURCE.has(id)) return `/pedguli-source/${id}.jpg`
  return null
}

export function safeAsset(value: unknown): Asset | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const asset = value as Record<string, unknown>
  if (asset.kind !== 'image' || typeof asset.diagram_id !== 'string') return null
  const path = approvedImagePath(asset.diagram_id)
  if (!path || asset.src !== path) return null

  return {
    kind: 'image',
    diagram_id: asset.diagram_id,
    src: path,
    alt: typeof asset.alt === 'string' && asset.alt.trim()
      ? asset.alt.slice(0, 220) : 'Savol chizmasi',
  }
}

/**
 * Older finalized exam-review payloads contain option texts but no question_id.
 * The two Telegram posts share their stem, so ONLY the exact published
 * four-option fingerprint may recover its picture in the results screen.
 * No answer key, answer position or grading data is involved.
 */
export function legacyPedguliDebateReviewId(
  stemMd: string,
  options: readonly { side: string; content_md: string }[],
): string | undefined {
  if (!stemMd.includes('Ushbu suratda qaysi metod tasvirlangan?')) return undefined
  const actual = options.filter(option => option.side === 'a').map(option => option.content_md.trim()).sort()
  const expected = ['Debat', 'Debrifing', 'Demonstratsiya', 'Diskussiya'].sort()
  if (actual.length !== expected.length || actual.some((text, i) => text !== expected[i])) return undefined
  return PEDGULI_PUBLISHED_DEBATE_QUESTION_ID
}

export default function ExamQuestionAssets({ assets, questionId }: {
  assets: unknown[]
  questionId?: string
}) {
  const images = (Array.isArray(assets) ? assets : [])
    .map(safeAsset)
    .filter((image): image is Asset => image !== null)

  // One source-verified, historically published Telegram item was imported
  // without its original photo. The question snapshot remains immutable;
  // restore visual presentation ONLY for that exact question ID and only when
  // the server still sends no assets. Other IDs, URLs and payloads fail closed.
  if (questionId === PEDGULI_PUBLISHED_DEBATE_QUESTION_ID
    && Array.isArray(assets) && assets.length === 0) {
    const image = safeAsset(DEBATE_ASSET)
    if (image) images.push(image)
  }

  if (!images.length) return null

  return (
    <div className="mb-5 space-y-3" aria-label="Savol chizmalari">
      {images.map(image => (
        <figure key={image.diagram_id}
          className="mx-auto max-w-3xl overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700">
          <a href={image.src} target="_blank" rel="noopener noreferrer"
            aria-label={`${image.alt} — to‘liq hajmda ochish`}
            className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500">
            <img src={image.src} alt={image.alt} loading="eager" decoding="async"
              className="mx-auto block h-auto max-h-[900px] w-auto max-w-full object-contain"
              style={{ maxWidth: '100%' }} />
          </a>
          <figcaption className="mt-2 text-center text-xs text-slate-500">
            {image.alt} · Kattalashtirish uchun rasmni bosing
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
