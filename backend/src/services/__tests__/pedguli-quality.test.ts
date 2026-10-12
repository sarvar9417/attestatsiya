import { describe, expect, it } from 'vitest'
import { analyzeCandidateQuality } from '../pedguli-quality.service.js'

describe('Telegram private candidate QA triage', () => {
  it('detects a complete A–D choice group without inferring correct answers', () => {
    const q='Qaysi metod samarali? A) Faol usul B) Muammoli usul C) Keys-stadi D) Loyiha metodi'
    const r=analyzeCandidateQuality(q,false,['PM.GEN.08'])
    expect(r.four_options_detected).toBe(true)
    expect(r.flags).not.toContain('options_not_confirmed')
    expect(r).not.toHaveProperty('correct_answer')
    expect(r.priority).toBe(1)
  })
  it('flags identical or suspiciously near-identical options for human review', () => {
    const duplicate=analyzeCandidateQuality(
      'Savol? A) Pedagogik xayol B) Tafakkur C) Refleksiya D) Pedagogik xayol',false,['PM.GEN.07'])
    expect(duplicate.flags).toContain('duplicate_option_text')
    expect(duplicate.priority).toBe(3)
    const close=analyzeCandidateQuality(
      'Savol? A) Pedagogik xayol B) Tafakkur C) Refleksiya D) Pedagogik hayol',false,['PM.GEN.07'])
    expect(close.flags).toContain('near_identical_options')
    expect(close.priority).toBe(3)
  })
  it('flags partial or misleading option sequences conservatively', () => {
    const incomplete=analyzeCandidateQuality('Savol? A) Bir B) Ikki C) Uch',false,[])
    expect(incomplete.four_options_detected).toBe(false)
    expect(incomplete.flags).toContain('options_not_confirmed')
    expect(incomplete.flags).toContain('topic_unclassified')
  })
  it('prioritizes media-dependent questions and never validates ✅ as a key', () => {
    const r=analyzeCandidateQuality('A) Bir B) Ikki C) Uch D) To‘rt ✅',true,['KS.03'])
    expect(r.flags).toContain('media_context_may_be_missing')
    expect(r.flags).toContain('answer_marker_not_verified')
    expect(r.priority).toBe(2)
    expect(r).not.toHaveProperty('answer_verified')
  })
  it('finds the last A–D group when stem includes lettered substeps', () => {
    const r=analyzeCandidateQuality(
      'a) Tashkiliy qism b) Mustahkamlash c) Baholash d) Natija. Javob: A) Aralash dars B) Faqat nazorat C) Faol mashq D) Mustaqil ish',
      false,['PM.GEN.04'])
    expect(r.four_options_detected).toBe(true)
  })
})
