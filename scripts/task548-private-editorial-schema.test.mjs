import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const schema = readFileSync(new URL('../supabase/migrations/20261022102800_task548_informatika_private_editorial_derivatives.sql', import.meta.url), 'utf8');

test('private schema does not change existing source or learner questions', () => {
  assert.match(schema, /CREATE TABLE IF NOT EXISTS attest_ingest\.telegram_informatika_pdf_editorial_derivatives/);
  assert.doesNotMatch(schema, /(?:UPDATE|DELETE FROM|INSERT INTO)\s+(?:public\.)?(?:questions|exam_items|telegram_informatika_pdf_question_candidates)\b/i);
  assert.doesNotMatch(schema, /\bINSERT\s+INTO\b/i, 'No student-facing answer texts or keys in public Git migrations');
});

test('four options and one bounded correct option index are mandatory', () => {
  assert.match(schema, /jsonb_array_length\(authored_options\)\s*=\s*4/);
  assert.match(schema, /correct_option_index BETWEEN 0 AND 3/);
  assert.match(schema, /PRIMARY KEY \(source_file_id,source_question_no,editorial_revision\)/);
  assert.match(schema, /length\(source_stem_md5\)\s*=\s*32/);
});

test('no learner publishing or fabricated independent human approval', () => {
  assert.match(schema, /CHECK \(editorial_state = 'private_review_only'\)/);
  assert.match(schema, /CHECK \(independently_human_approved IS FALSE\)/);
  assert.match(schema, /CHECK \(learner_publish_ready IS FALSE\)/);
  assert.match(schema, /CHECK \(published_question_id IS NULL\)/);
  assert.match(schema, /ai_assisted_owner_delegated/);
});

test('RLS with no client read grants', () => {
  assert.match(schema, /ENABLE ROW LEVEL SECURITY/);
  assert.match(schema, /REVOKE ALL ON TABLE[\s\S]*?FROM PUBLIC, anon, authenticated/);
  assert.doesNotMatch(schema, /GRANT\s+(?:SELECT|ALL)\s+ON\s+TABLE/i);
});

test('migration has no source-derived secret answer literals', () => {
  assert.doesNotMatch(schema, /\b(?:INSERT INTO|COPY|UPDATE public\.question_keys)\b/i);
  assert.doesNotMatch(schema, /CREATE\s+(?:OR REPLACE\s+)?VIEW\s+public\./i);
});
