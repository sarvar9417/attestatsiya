import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const d=JSON.parse(readFileSync(new URL('../docs/qa/task433-internet-twelve-rewrites.json',import.meta.url),'utf8'));
test('exactly twelve source-aware NEW editorial proposals, never marked published',()=>{
 assert.equal(d.questions.length,12);
 assert.equal(d.editorial_state,'alternative_comparison_only_not_release');
 assert.equal(d.existing_successor_batch,'task431:pdf-editorial:20261022');
 assert.ok(d.questions.every(q=>q.source_already_has_published_successor===true));
 assert.equal(d.human_approved,false);
 assert.deepEqual(d.questions.map(x=>x.source_no).sort((a,b)=>a-b),[1,3,4,7,8,10,12,13,14,17,18,22]);
});
test('one well specified choice among four distinct plausible alternatives',()=>{
 for(const q of d.questions){
  assert.ok(q.stem.length>65,`short stem ${q.source_no}`);
  assert.ok(q.explanation.length>65,`short explanation ${q.source_no}`);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(x=>x.trim().toLowerCase())).size,4);
  assert.ok(Number.isInteger(q.correct_idx)&&q.correct_idx>=0&&q.correct_idx<4);
  assert.ok(q.options.every(s=>s.length>22));
 }
});
test('Q14 disambiguates HTTP application layer vs TCP transport',()=>{
 const q=d.questions.find(x=>x.source_no===14);
 assert.match(q.stem,/ilova qatlamidagi/);
 assert.match(q.options[q.correct_idx],/HTTP va HTTPS/);
 assert.match(q.explanation,/TCP transport qatlamida/);
});
