import { describe, expect, it } from 'vitest'
import newItems from '../content/tarmoq/M12_2026_real_exam_style_original_20_review.json'
import proposals from '../content/tarmoq/M12_22_P1_published_item_revision_proposals_2026.json'
import historic from '../content/tarmoq/Kompyuter_tarmoqlari_300_savol_V2.json'

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('uz-UZ')

describe('TASK-220 M12 source-backed exam-style editorial candidates', () => {
  it('creates 20 original and 22 high-risk published replacements, with unique stems', () => {
    expect(newItems).toHaveLength(20)
    expect(proposals).toHaveLength(22)
    const stems = [...newItems.map(x => x.stem), ...proposals.map(x => x.proposed_stem)]
    expect(new Set(stems.map(normalize)).size).toBe(42)
    expect(new Set([...newItems.map(x => x.id), ...proposals.map(x => x.candidate_id)]).size).toBe(42)
    const originalStems = new Set(historic.map(x => normalize(x.q)))
    for (const stem of stems) expect(originalStems.has(normalize(stem)), stem).toBe(false)
  })

  it('retains plausible independent four-choice Y1 structure, protected answer position', () => {
    for (const item of newItems) {
      expect(item.editorial_status).toBe('review')
      expect(item.options).toHaveLength(4)
      expect(new Set(item.options.map(normalize)).size).toBe(4)
      expect(item.options['ABCD'.indexOf(item.answer)]).toBeTruthy()
      expect(item.explanation.length).toBeGreaterThan(30)
      expect(item.source_reference.length).toBeGreaterThan(25)
    }
  })

  it('does not silently overwrite the source published IDs and preserves correct concept', () => {
    for (const proposal of proposals) {
      const old = historic.find(x => x.id === proposal.replaces_published_id)
      expect(old, proposal.replaces_published_id).toBeTruthy()
      expect(proposal.status).toBe('proposed_review_only')
      expect(proposal.options).toHaveLength(4)
      expect(new Set(proposal.options.map(normalize)).size).toBe(4)
      expect(proposal.correct_answer).toBe(proposal.options[proposal.correct_index])
      expect(proposal.correct_index).toBe('ABCD'.indexOf(old!.correct))
      expect(proposal.candidate_id).not.toBe(proposal.replaces_published_id)
    }
  })

  it('computes binary IPv4 examples independently (not by the answer label alone)', () => {
    const group = newItems.filter(x => x.family === 'binary-ip')
    expect(group).toHaveLength(4)
    for (const item of group) {
      const bytes = item.stem.match(/(?:[01]{8}\s*){4}/)?.[0].trim().split(/\s+/) ?? []
      expect(bytes, item.id).toHaveLength(4)
      const decoded = bytes.map(x => parseInt(x, 2)).join('.')
      expect(item.options['ABCD'.indexOf(item.answer)], item.id).toBe(decoded)
    }
  })
})
