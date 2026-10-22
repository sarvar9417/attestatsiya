/**
 * Project-wide learner-only projection of editorial source traces.
 *
 * The immutable source-backed lesson stays in Supabase. This projection only
 * omits labels of the form "Manba izi: ...", which describe the import audit,
 * not the educational concept. Real citations labelled "Manba:" and
 * educational source comparisons remain readable.
 */
import type { TheoryBlock } from '../../data/topicContent'

const trace = /^(?:>\s*)?\*{0,2}Manba izi\s*:\*{0,2}/i
const marker = /\s*\[(?:THEORY-CORPUS|PEDGULI-STUDY)[^\]]+\]/gi

export function projectLearnerTheoryWithoutEditorialTraces(blocks: TheoryBlock[]): TheoryBlock[] {
  let changed = false
  const output: TheoryBlock[] = []
  for (const block of blocks) {
    // Only an entire editorial annotation is filtered. In particular, never
    // scan code, formulas or examples for an in-line phrase and delete them.
    if ((block.type === 'source' || block.type === 'text' || block.type === 'note')
      && trace.test(block.content.trim())) {
      changed = true
      continue
    }
    if (block.type === 'heading' || block.type === 'subheading') {
      const content = block.content.replace(marker, '')
      if (content !== block.content) {
        changed = true
        output.push({ ...block, content: content.trim() })
        continue
      }
    }
    output.push(block)
  }
  return changed ? output : blocks
}
