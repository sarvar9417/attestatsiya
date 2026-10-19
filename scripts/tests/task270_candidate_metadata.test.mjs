// TASK-270: review-only candidate register; assert counts, source and no answer leakage.
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const path = new URL('../../docs/audits/TASK270_56_PRIVATE_CANDIDATE_METADATA_ONLY.tsv', import.meta.url)
const [header, ...lines] = readFileSync(path, 'utf8').trim().split(/\r?\n/)
const cols = header.split('\t')
const records = lines.map((line) => Object.fromEntries(cols.map((k, i) => [k, line.split('\t')[i]])))
const topics = {
  M06: { slug: 'masala-algoritmini-tuzish', pdf: 'ICT 9_sinf-2020(1).pdf', pages: new Set([28,29,30,31,32,33,34,35,36]) },
  M08: { slug: 'javascript-sintaksis-asoslari', pdf: '10-11-sinf informatika (Cambridge +)(1).pdf', pages: new Set([316,317,318,319,320,321]) },
  M12A: { slug: 'arxitektura-va-topologiyalar', pdf: 'ICT 11_sinf-2021(1).pdf', pages: new Set([140,141,142,167,168,169,170]) },
  M12B: { slug: 'internetdan-xavfsiz-va-maqsadli-foydalanish', pdf: 'ICT 6_sinf-2021(1).pdf', pages: new Set([79,80,82,83,94,95,96]) },
}

test('only privacy-safe columns are permitted', () => {
  assert.deepEqual(cols, [
    'candidate_id','topic_code','lesson_slug','question_format','source_pdf',
    'source_physical_pdf_page','relationship','originality_review',
    'independent_answer_review','semantic_source_match','editorial_signoff','publish_eligible'
  ])
  assert.equal(records.length, 56)
  assert.equal(new Set(records.map((r) => r.candidate_id)).size, records.length)
})

test('four topics each hold exactly ten Y1, two Y2, two Y3 original candidate slots', () => {
  for (const [topic, source] of Object.entries(topics)) {
    const same = records.filter((r) => r.topic_code === topic)
    assert.equal(same.length, 14)
    assert.equal(same.filter((r) => r.question_format === 'Y1').length, 10)
    assert.equal(same.filter((r) => r.question_format === 'Y2').length, 2)
    assert.equal(same.filter((r) => r.question_format === 'Y3').length, 2)
    for (let i = 0; i < same.length; i++) {
      const r = same[i]
      assert.equal(r.candidate_id, `T258-${topic}-${String(i+1).padStart(2, '0')}`)
      assert.equal(r.lesson_slug, source.slug)
      assert.equal(r.source_pdf, source.pdf)
      assert.ok(source.pages.has(Number(r.source_physical_pdf_page)))
    }
  }
})

test('thematic source page must not be mistaken for exact source-task evidence or approval', () => {
  for (const r of records) {
    assert.equal(r.relationship, 'concept_reference_not_exact_source_question')
    assert.equal(r.originality_review, 'NO')
    assert.equal(r.independent_answer_review, 'NO')
    assert.equal(r.semantic_source_match, 'NO')
    assert.equal(r.editorial_signoff, 'NO')
    assert.equal(r.publish_eligible, 'NO')
  }
})
