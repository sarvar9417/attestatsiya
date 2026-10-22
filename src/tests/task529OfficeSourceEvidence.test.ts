import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

type EvidenceRow = {
  source_id: string
  topic: string
  status: 'concept_verified' | 'concept_verified_reference_mismatch' | 'partial_topic_only' | 'page_evidence_pending'
  references: { file: string; pdf_pages: number[]; printed_pages: number[]; details: string }[]
  caveat: string
}
const report = JSON.parse(readFileSync('docs/quality/task529_office_source_evidence.json', 'utf8')) as {
  task: string
  entries: EvidenceRow[]
}
const stagedSql = readFileSync('supabase/maintenance/task427_office_eight_review_stage.sql','utf8')

describe('TASK-529 Office source evidence integrity', () => {
  it('covers exactly the eight original source UUIDs of TASK-427 REVIEW replacements', () => {
    expect(report.task).toBe('TASK-529')
    expect(report.entries).toHaveLength(8)
    expect(new Set(report.entries.map((e) => e.source_id)).size).toBe(8)
    for (const e of report.entries) {
      expect(e.source_id).toMatch(/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/)
      expect(stagedSql).toContain(e.source_id)
    }
  })
  it('does not mislabel partial or missing page evidence as independently verified', () => {
    expect(report.entries.filter((e) => e.status === 'concept_verified')).toHaveLength(4)
    expect(report.entries.filter((e) => e.status === 'concept_verified_reference_mismatch')).toHaveLength(1)
    expect(report.entries.filter((e) => e.status === 'partial_topic_only')).toHaveLength(1)
    expect(report.entries.filter((e) => e.status === 'page_evidence_pending')).toHaveLength(2)
    const mismatched = report.entries.find((e) => e.source_id === '813fb43d-17bf-7f9c-7368-8d1fe26287d9')
    expect(mismatched?.status).toBe('concept_verified_reference_mismatch')
    expect(mismatched?.references[0]?.pdf_pages).toEqual([121,122])
  })
  it('requires an actual file, positive PDF page numbers and an explicit caveat for every source', () => {
    for (const e of report.entries) {
      expect(e.caveat.trim().length).toBeGreaterThan(20)
      for (const r of e.references) {
        expect(r.file.endsWith('.pdf')).toBe(true)
        expect(r.pdf_pages.every((p) => Number.isInteger(p) && p > 0)).toBe(true)
        expect(r.details.trim().length).toBeGreaterThan(40)
      }
    }
  })
  it('keeps external vendor verification distinct from uploaded textbook page evidence', () => {
    const external = report.entries.filter((e) => 'external_technical_support' in e)
    expect(external).toHaveLength(3)
    const withExternal = report.entries as (EvidenceRow & { external_technical_support?: { publisher: string; url: string; finding: string }[] })[]
    for (const e of withExternal.filter((v) => v.external_technical_support)) {
      expect(['partial_topic_only', 'page_evidence_pending']).toContain(e.status)
      for (const s of e.external_technical_support ?? []) {
        expect(s.publisher).toBe('Microsoft Support')
        expect(s.url.startsWith('https://support.microsoft.com/')).toBe(true)
        expect(s.finding.length).toBeGreaterThan(45)
      }
    }
  })

})
