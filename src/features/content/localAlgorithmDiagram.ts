/**
 * Exact list of source-backed SVG diagrams shipped with the learner frontend.
 * Do not render arbitrary Markdown image URLs or user-supplied file paths.
 * V3 assets are from the original TASK-205 diagram-only patch (#146).
 */
export const LOCAL_ALGORITHM_SVG_PATHS = [
  '/algoritmlash-v2/algo_compare.svg',
  '/algoritmlash-v2/flow_abs.svg',
  '/algoritmlash-v2/flow_div.svg',
  '/algoritmlash-v2/flow_euclid.svg',
  '/algoritmlash-v2/flow_even.svg',
  '/algoritmlash-v2/flow_grade.svg',
  '/algoritmlash-v2/flow_loop.svg',
  '/algoritmlash-v2/flow_max.svg',
  '/algoritmlash-v2/flow_sign.svg',
  '/algoritmlash-v2/flow_sum.svg',
  '/algoritmlash-v2/graph_paths.svg',
  '/algoritmlash-v3/loop_until.svg',
  '/algoritmlash-v3/flow_euclid_mod.svg',
] as const

const localAlgorithmPaths: ReadonlySet<string> = new Set(LOCAL_ALGORITHM_SVG_PATHS)

export function isLocalAlgorithmSvgPath(path: string): boolean {
  return localAlgorithmPaths.has(path)
}
