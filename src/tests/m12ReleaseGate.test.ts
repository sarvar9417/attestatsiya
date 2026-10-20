import { describe, expect, it } from 'vitest'
import { m12PublicationApproved } from '../features/content/m12ReleaseGate'

describe('TASK-220 learner publication authorization is fail-closed', () => {
  it('does not enable M12 V2 for unset, false, accidental truthy or invalid flags', () => {
    for (const value of [undefined, '', 'false', '1', 'TRUE', 'approved', 'yes']) {
      expect(m12PublicationApproved(value)).toBe(false)
    }
  })
  it('requires an explicit exact true flag after independent expert signoff', () => {
    expect(m12PublicationApproved('true')).toBe(true)
  })
})
