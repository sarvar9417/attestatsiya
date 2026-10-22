import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const stage = readFileSync('supabase/maintenance/task546_network_eight_review_stage.sql','utf8')
const evidence = JSON.parse(readFileSync('docs/quality/task546_network_8_source_evidence.json','utf8')) as {
 task: string
 entries: {source_id:string; status:string; topic:string; book_evidence: {file:string; pdf_pages:number[]; detail:string}[]; caveat:string}[]
}
const ids = [...stage.matchAll(/\('([\da-f-]{36})'::uuid,NULL,/g)].map(m=>m[1])

describe('TASK-546 safe network Y1 semantic distractor batch', () => {
 it('tracks exactly eight original unrevised S6.NET Y1 questions', () => {
   expect(ids).toHaveLength(8)
   expect(new Set(ids).size).toBe(8)
   expect(stage).toContain("q.group_code IN ('S6.NET')")
   expect(stage).toContain("q.format='Y1'")
   expect(stage).toContain('TASK546_EXACT_EIGHT_REQUIRED')
   expect(stage).toContain('TASK546_SOURCE_OR_KEY_DRIFT_')
   expect(evidence.task).toBe('TASK-546')
   expect(evidence.entries).toHaveLength(8)
   expect(new Set(evidence.entries.map(x=>x.source_id))).toEqual(new Set(ids))
 })
 it('never changes published source text, option keys or historical exam snapshots', () => {
   expect(stage).toContain('CASE WHEN r.correct THEN r.content_md ELSE b.wrong')
   expect(stage).toContain('TASK546_PUBLISHED_SOURCE_CHANGED')
   expect(stage).not.toMatch(/UPDATE\s+public\.(questions|question_options|question_keys|exam_items)\b/i)
   expect(stage).not.toMatch(/DELETE\s+FROM\s+public\.(questions|question_options|question_keys|exam_items)\b/i)
 })
 it('enforces four unique options, unchanged correct key and REVIEW only with honest AI provenance', () => {
   expect(stage).toContain("q.assets,true,'review'::public.content_status")
   expect(stage).toContain('TASK546_OPTION_KEY_BALANCE_FAILED_')
   expect(stage).toContain('TASK546_OPTION_MAP_NOT_32')
   expect(stage).toContain('TASK546_NOT_REVIEW_ONLY')
   expect(stage).toContain("'human_editorial_approval',false")
   expect(stage).toContain("'release_performed',false")
   expect(stage).toContain("SELECT m.source_id,'task546_semantic_distractor_review_pending','medium',")
   expect(stage).not.toMatch(/SET\s+status\s*=\s*'published'/i)
 })
 it('separates directly checked book pages from partial or misleading references',()=>{
   expect(evidence.entries.filter(x=>x.status==='textbook_concept_verified')).toHaveLength(3)
   expect(evidence.entries.filter(x=>x.status==='textbook_partial')).toHaveLength(1)
   expect(evidence.entries.filter(x=>x.status==='source_reference_mismatch')).toHaveLength(1)
   expect(evidence.entries.filter(x=>x.status==='page_evidence_pending')).toHaveLength(3)
   const wrongRFC=evidence.entries.find(x=>x.topic==='VLSM')
   expect(wrongRFC?.caveat).toContain('RFC 4291')
   expect(wrongRFC?.status).toBe('source_reference_mismatch')
   for(const x of evidence.entries){
      expect(x.caveat.length).toBeGreaterThan(45)
      for(const ref of x.book_evidence){
        expect(ref.file.endsWith('.pdf')).toBe(true)
        expect(ref.pdf_pages.every(p=>Number.isInteger(p)&&p>0)).toBe(true)
      }
   }
 })
})
