import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const { tests } = JSON.parse(readFileSync(new URL('../docs/qa/task433-python31-executable-manifest.json', import.meta.url),'utf8'));
const sql = readFileSync(new URL('../supabase/maintenance/task433_publish_31_python_operator_questions.sql', import.meta.url),'utf8');

test('31 original numbers are unique, all original defective #17,#21,#22,#30 excluded',()=>{
  assert.equal(tests.length,31);
  const n=tests.map(x=>x.source_question_no);
  assert.equal(new Set(n).size,31);
  for(const bad of [17,21,22,30]) assert.ok(!n.includes(bad));
  assert.match(sql,/IF \(SELECT count\(\*\) FROM task433_release\)<>31/);
  assert.match(sql,/TASK433_SOURCE_LESSON_DRIFT/);
  assert.match(sql,/TASK433_RELEASE_QA_FAILED/);
  assert.match(sql,/TASK433_POSTFLIGHT/);
  assert.match(sql,/TASK433_FALSE_HUMAN_ATTESTATION/);
  assert.ok(sql.trimEnd().endsWith('COMMIT;'));
});
for (const q of tests) {
  test(`PDF Python original №${q.source_question_no}: interpreter output and answer key match`,()=>{
    assert.equal(q.source_file_id,'1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z');
    const r=spawnSync('python3',['-I','-c',q.code],{encoding:'utf8',timeout:4000});
    assert.equal(r.status,0, r.stderr||r.error?.message);
    assert.equal(r.stderr.trim(),'');
    assert.equal(r.stdout.trim(),q.expected_stdout);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4);
    assert.equal(q.options.filter(x=>x===q.expected_stdout).length,1);
    assert.equal(q.options[q.correct_idx],q.expected_stdout);
  });
}
