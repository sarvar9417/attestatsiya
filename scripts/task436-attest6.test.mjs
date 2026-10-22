import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const sql=readFileSync(new URL('../supabase/maintenance/task436_publish_eight_attest6_cross_subject_y1.sql',import.meta.url),'utf8')
test('eight exact source numbers, safety and release checks',()=>{
 const src='1QNeDPscVBVUDYwQTsme3EgQbE-UJMf3I'
 const n=[...sql.matchAll(new RegExp("\\('"+src+"',([0-9]+),'S[0-9].","g"))].map(v=>Number(v[1]))
 assert.deepEqual(n,[1,4,5,8,9,14,16,20])
 for(const code of ['TASK436_SOURCE_LESSON_DRIFT','TASK436_RELEASE_QA_FAILED','TASK436_POSTFLIGHT','TASK436_FALSE_HUMAN_ATTESTATION'])assert.ok(sql.includes(code))
 assert.ok(sql.includes("<>8"))
 assert.equal([...sql.matchAll(/ARRAY\[(.*?)\]::text\[\],([0-3]),'/gs)].length,8)
 assert.ok(sql.trimEnd().endsWith('COMMIT;'))
})
test('JavaScript/Python, CSS and palette source calculations',()=>{
 const a=[2,4,6];a.push(a[1]);a.pop();a[0]+=3
 const s=a.reduce((s,x)=>s+(x%2===0?x:-x),0)
 assert.equal(s,5)
 let pyS=190,n=0;while(pyS-n>0){pyS-=5;n+=15}
 assert.equal(pyS,140)
 assert.equal(Math.floor(40*1024*8/(250*300)),4)
 assert.equal(2**4,16)
 const place=[[1,2,3],[3,2,1],[1,3,2],[2,1,3]]
 assert.deepEqual(place.map(([k,d,n])=>Number(k===3)+Number(d===2)+Number(n!==2)),[2,3,0,1])
})
