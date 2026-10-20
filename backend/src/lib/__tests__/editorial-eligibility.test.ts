import { describe, expect, it } from 'vitest'
import { isEditorialReviewEligible } from '../editorial-eligibility.js'

describe('human editorial source allowlist', () => {
  it('allows the eight first-batch M09 demo candidates', () => {
    for (let n=1;n<=8;n++) expect(isEditorialReviewEligible('S4.DB',
      `MSACCESS-DEMO-STYLE-2026/DBS-Q${String(n).padStart(2,'0')} | text`)).toBe(true)
  })
  it('rejects other M09 source prefixes pending review', () => {
    expect(isEditorialReviewEligible('S4.DB','MSACCESS-V2/DB-05-001')).toBe(false)
    expect(isEditorialReviewEligible('S4.DB','MSACCESS-V2-NATIVE/DBN-Y2-001')).toBe(false)
  })
  it('keeps older pedagogy source checks', () => {
    expect(isEditorialReviewEligible('KS',null)).toBe(true)
    expect(isEditorialReviewEligible('PM.MET',null)).toBe(true)
    expect(isEditorialReviewEligible(null,'authored:pedguli-001')).toBe(true)
  })
  it('does not approve fake similar prefixes', () => {
    expect(isEditorialReviewEligible('S4.DB','MSACCESS-DEMO-STYLE-2026-FAKE/DBS-Q01')).toBe(false)
    expect(isEditorialReviewEligible(null,null)).toBe(false)
  })
})
