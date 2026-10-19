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
const KUZGI_DEMO = new Set([
  'demo_q04_blocks','demo_q04_options','demo_q14_labyrinth',
  'demo_q17_photoshop','demo_q19_wordtable','demo_q21_css',
  'demo_q27_html','demo_q34_logo','demo_q39_word',
])

type Asset = { kind: 'image'; diagram_id: string; alt: string; src: string }

function approvedImagePath(id: string): string | null {
  if (ALGORITMLASH.has(id)) return `/algoritmlash-v2/${id}.svg`
  if (OFFICE.has(id)) return `/office-v2/${id}.svg`
  if (KUZGI_DEMO.has(id)) return `/kuzgi-demo/${id}.svg`
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

export default function ExamQuestionAssets({ assets }: { assets: unknown[] }) {
  const images = (Array.isArray(assets) ? assets : [])
    .map(safeAsset)
    .filter((image): image is Asset => image !== null)
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
