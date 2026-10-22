import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const sql=readFileSync(new URL('../supabase/maintenance/task439_publish_8_base_encoding_y1.sql',import.meta.url),'utf8')
test('eight exact source numbers with correct release guards',()=>{
 const source='1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au'
 const n=[...sql.matchAll(new RegExp("\\('"+source+"',([0-9]+),'(?:S3.NUM.03|S1.INFO.0[156])'","g"))].map(v=>Number(v[1]))
 assert.deepEqual(n,[1,3,5,6,7,8,9,10])
 for(const mark of ['TASK439_SOURCE_LESSON_DRIFT','TASK439_RELEASE_QA_FAILED','TASK439_POSTFLIGHT','TASK439_FALSE_HUMAN_ATTESTATION'])assert.ok(sql.includes(mark))
 assert.ok(!n.includes(2)&&!n.includes(4))
 assert.equal([...sql.matchAll(/ARRAY\[(.*?)\]::text\[\],([0-3]),'/gs)].length,8)
 assert.ok(sql.trimEnd().endsWith('COMMIT;'))
})
test('exact binary/volume source arithmetic',()=>{
 const binary=n=>n.toString(2)
 assert.equal(2*8**2+3*8+2-(8**2+7*8+3),3*8+7)
 assert.equal(151-parseInt('11000',2),127)
 assert.equal(binary(127),'1111111')
 assert.equal(43.5-21.25,22.25)
 assert.equal(13*34-13**2,273)
 assert.equal(binary(273),'100010001')
 assert.equal(1024*1024/(64*32),512)
 assert.equal(11*824/1024>8.5,true)
 assert.equal(Math.round(400*1024*8/(20*60)),2731)
})
