import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const sql=readFileSync(new URL('../supabase/maintenance/task435_publish_18_information_encoding_y1.sql',import.meta.url),'utf8')
test('18 source numbers and guarded release SQL',()=>{
 const id='1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5'
 const n=[...sql.matchAll(new RegExp("\\('"+id+"',([0-9]+),'(?:S1.INFO.03|S3.LOGIC.02)'","g"))].map(x=>Number(x[1]))
 assert.deepEqual(n,[1,2,3,4,5,6,7,8,9,11,12,13,14,16,17,18,19,20])
 assert.ok(!n.includes(10)&&!n.includes(15))
 for(const marker of ['TASK435_SOURCE_LESSON_DRIFT','TASK435_RELEASE_QA_FAILED','TASK435_POSTFLIGHT','TASK435_FALSE_HUMAN_ATTESTATION'])assert.ok(sql.includes(marker))
 assert.match(sql,/IF \(SELECT count\(\*\) FROM task435_release\)<>18/)
 assert.equal([...sql.matchAll(/ARRAY\[(.*?)\]::text\[\],([0-3]),'/gs)].length,18)
 assert.ok(sql.trimEnd().endsWith('COMMIT;'))
})
test('worked-source quantitative result integrity',()=>{
 assert.equal((448/4)*9/8,126)
 assert.equal(128*32*60*8/512/60,64)
 assert.equal(960/(240/6+180/18+50),9.6)
 assert.equal(Math.ceil(Math.log2(200)),8)
 assert.equal(500*0.7*1024/(10*256),140)
 assert.equal(6*1024/512,12)
 assert.equal(256*128,32768)
 assert.equal(40*1024*8/32768,10)
 assert.equal(2**10,1024)
 assert.equal(160*256,40*1024)
 assert.equal(48_000*16*2*60/8/1024,11250)
 assert.equal(22_000*24*2*120/8,15_840_000)
 assert.equal((24+26>=28),true)
 assert.equal((25/2.54*300)*(30/2.54*300)*3/1e6 >31,true)
})
