import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sql = readFileSync(new URL('../supabase/maintenance/task431_publish_24_internet_source_rewrites.sql', import.meta.url),'utf8');
test('24 original PDF candidates have distinct, pinned provenance and exact release guards',()=>{
  const id='1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX';
  const rows=[...sql.matchAll(new RegExp("\\('"+id+"',([0-9]+),'S6.NET.0[45]'","g"))];
  assert.equal(rows.length,24);
  assert.equal(new Set(rows.map(r=>Number(r[1]))).size,24);
  assert.deepEqual([...rows.map(r=>Number(r[1]))].sort((a,b)=>a-b),[1,3,4,7,8,10,12,13,14,17,18,22,24,25,26,27,28,30,31,32,34,35,38,40]);
  assert.match(sql,/IF \(SELECT count\(\*\) FROM task431_release\)<>24/);
  assert.match(sql,/TASK431_SOURCE_LESSON_DRIFT/);
  assert.match(sql,/TASK431_RELEASE_QA_FAILED/);
  assert.match(sql,/TASK431_POSTFLIGHT/);
  assert.match(sql,/TASK431_ALREADY_EXISTS/);
  assert.match(sql,/TASK431_FALSE_HUMAN_ATTESTATION/);
  assert.match(sql,/UPDATE public.questions q SET status='published'/);
  assert.ok(!sql.includes('UPDATE attest_ingest.telegram_informatika_pdf_question_candidates'));
  assert.ok(!sql.includes('DELETE FROM public.questions'));
  assert.ok(sql.trimEnd().endsWith('COMMIT;'));
});
test('all 24 releases have four unique answers and balanced key positions',()=>{
  const optionSegments = [...sql.matchAll(/ARRAY\[(.*?)\]::text\[\],([0-3]),'/gs)];
  assert.equal(optionSegments.length,24);
  const keys=[0,0,0,0];
  for(const [,content,idx] of optionSegments){
    const quoted=content.match(/'(?:''|[^'])*'/g)??[];
    assert.equal(quoted.length,4);
    assert.equal(new Set(quoted.map(x=>x.toLowerCase().replace(/\s+/g,''))).size,4);
    keys[Number(idx)]++;
  }
  assert.ok(Math.max(...keys)-Math.min(...keys)<=2,JSON.stringify(keys));
});
