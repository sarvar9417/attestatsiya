import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const sql=readFileSync(new URL('../supabase/maintenance/task432_publish_six_powerpoint_concepts.sql',import.meta.url),'utf8');
test('six separate PowerPoint candidates have safe immutable release scope',()=>{
  const id='1LEZo28L9u6DQXGvHU5himMvBl8_Bi0xi';
  const row=[...sql.matchAll(new RegExp("\\('"+id+"',([0-9]+),'S2.OFFICE.04'","g"))].map(m=>Number(m[1]));
  assert.deepEqual(row,[3,4,5,6,7,8]);
  assert.match(sql,/IF \(SELECT count\(\*\) FROM task432_release\)<>6/);
  assert.match(sql,/TASK432_SOURCE_LESSON_DRIFT/);
  assert.match(sql,/TASK432_RELEASE_QA_FAILED/);
  assert.match(sql,/TASK432_POSTFLIGHT/);
  assert.ok(!sql.includes('UPDATE attest_ingest.telegram_informatika_pdf_question_candidates'));
  assert.ok(sql.trimEnd().endsWith('COMMIT;'));
});
test('6 answer sets have 4 unique choices and one keyed index',()=>{
  const parts=[...sql.matchAll(/ARRAY\[(.*?)\]::text\[\],([0-3]),'/gs)];
  assert.equal(parts.length,6);
  for(const [,strings,idx] of parts){
    const choices=(strings.match(/'(?:''|[^'])*'/g)||[]).map(x=>x.toLowerCase().replace(/\s+/g,''));
    assert.equal(choices.length,4);
    assert.equal(new Set(choices).size,4);
    assert.ok(Number(idx)>=0&&Number(idx)<4);
  }
});
