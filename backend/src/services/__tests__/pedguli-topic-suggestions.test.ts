import { describe, expect, it } from 'vitest'
import { suggestPedguliTopic } from '../pedguli-topic-suggestions.service.js'

describe('private topical suggestions (never source verification)',()=>{
  it('recognizes precise pedagogical concepts from the stem, not answers',()=>{
    const item=suggestPedguliTopic(
      'Pedagogik xayol tushunchasi nimani bildiradi? A) Tarbiya metodlari B) Nutqning ravonligi C) Nazorat D) Tashkiliy ish'
    )
    expect(item.suggestion_state).toBe('strong_keyword')
    expect(item.proposed_constructs).toEqual(['PM.GEN.07'])
  })
  it('does not misclassify textbook distractors appearing in options',()=>{
    const item=suggestPedguliTopic(
      'Quyidagilarni farqlang. A) Pedagogik qobiliyat B) Dars turlari C) Inklyuziv ta’lim muhiti D) Didaktik tamoyil'
    )
    expect(item.proposed_constructs).toEqual([])
    expect(item.suggestion_state).toBe('unclassified')
  })
  it('does not force multiple matched topics into one construct',()=>{
    const item=suggestPedguliTopic(
      'Tarbiyaviy faoliyatni tashkil etish va xavfsiz rivojlantiruvchi muhit o‘rtasidagi farq qaysi? A) Farq B) Yondashuv C) Qaror D) Aloqa'
    )
    expect(item.proposed_constructs).toEqual([])
    expect(item.suggestion_state).toBe('ambiguous')
    expect(item.evidence_terms.length).toBeGreaterThanOrEqual(2)
  })
  it('marks pedagogical-technology scope as PM.GEN.08, not KS.03',()=>{
    const item=suggestPedguliTopic(
      'Makrotexnologiya va mezotexnologiya darajalari qaysi? A) makro B) mikro C) mezo D) lokal'
    )
    expect(item.proposed_constructs).toEqual(['PM.GEN.08'])
  })
  it('does not assert answer keys, permissions or genuine prior-exam origin',()=>{
    const item=suggestPedguliTopic('Pedagogika qanday fan? A) A B) B C) C D) D ✅')
    expect(item).not.toHaveProperty('correct_option_id')
    expect(item).not.toHaveProperty('answer_verified')
    expect(item).not.toHaveProperty('rights_status')
    expect(item.proposed_constructs).toEqual(['PM.GEN.01'])
  })
  it('keeps manually triaged #16752 out of KS.03 unless a reviewer confirms',()=>{
    const proposal=suggestPedguliTopic('Ta’lim texnologiyalarining makro darajasi haqida savol',16752)
    expect(proposal.suggestion_state).toBe('editorial_proposal')
    expect(proposal.proposed_constructs).toEqual(['PM.GEN.08'])
    expect(proposal).not.toHaveProperty('answer_verified')
  })
  it('does not invent a topic for a missing-media matching task #5636',()=>{
    const proposal=suggestPedguliTopic('A) 1-a, 2-b B) 1-b, 2-c C) 1-c, 2-a D) 1-a, 2-b',5636)
    expect(proposal.proposed_constructs).toEqual([])
    expect(proposal.suggestion_state).toBe('unclassified')
  })

})
