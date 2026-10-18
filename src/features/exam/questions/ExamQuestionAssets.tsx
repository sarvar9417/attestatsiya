/**
 * Only first-party audited Algoritmlash SVG assets are rendered. Do not render
 * arbitrary URLs or inline SVG from question JSON.
 */
const ALLOWED = new Set([
  'flow_sum','flow_abs','flow_div','flow_even','flow_loop','flow_max',
  'flow_sign','flow_grade','flow_euclid','graph_paths','algo_compare',
])
type Asset = { kind: 'image'; diagram_id: string; alt: string; src: string }
function safeAsset(value: unknown): Asset | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const a = value as Record<string, unknown>
  if (a.kind !== 'image' || typeof a.diagram_id !== 'string' ||
      !ALLOWED.has(a.diagram_id) || typeof a.src !== 'string' ||
      a.src !== `/algoritmlash-v2/${a.diagram_id}.svg`) return null
  return {
    kind: 'image', diagram_id: a.diagram_id,
    src: a.src,
    alt: typeof a.alt === 'string' && a.alt.trim()
      ? a.alt.slice(0, 220) : 'Algoritmlash blok-sxemasi',
  }
}
export default function ExamQuestionAssets({ assets }: { assets: unknown[] }) {
  const images = assets.map(safeAsset).filter((a): a is Asset => a !== null)
  if (!images.length) return null
  return (
    <div className="mb-5 space-y-3" aria-label="Savol chizmalari">
      {images.map(image => (
        <figure key={image.diagram_id}
          className="mx-auto max-w-3xl overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700">
          <img src={image.src} alt={image.alt} loading="eager" decoding="async"
            className="mx-auto block max-h-[460px] min-w-0 w-full object-contain"
            style={{ maxWidth: '100%' }} />
          <figcaption className="mt-2 text-center text-xs text-slate-500">
            {image.alt}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
